import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, RenderVariation } from "../types/aura";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDBRBY7faHAp1Dbs11iy4aHsyefzNdQHxc";

const MAX_RETRIES = 5;
const INITIAL_BACKOFF = 15000;
const QUOTA_COOLDOWN = 45000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function withRetry<T>(fn: () => Promise<T>, isImage: boolean = false, retries = MAX_RETRIES, backoff = INITIAL_BACKOFF): Promise<T> {
    try {
        return await fn();
    } catch (error: any) {
        const errorMsg = (error?.message || String(error)).toUpperCase();
        const isQuotaError = errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("QUOTA");
        const isTransientError = errorMsg.includes("500") || errorMsg.includes("503") || errorMsg.includes("504") || errorMsg.includes("DEADLINE_EXCEEDED");

        if ((isQuotaError || isTransientError) && retries > 0) {
            const waitTime = isQuotaError ? (QUOTA_COOLDOWN + (MAX_RETRIES - retries) * 15000) : backoff;
            console.warn(
                `Gemini API ${isQuotaError ? 'QUOTA' : 'TRANSIENT'} ERROR. ` +
                `Attempt ${MAX_RETRIES - retries + 1}/${MAX_RETRIES}. ` +
                `Cooling down for ${Math.round(waitTime / 1000)}s...`
            );
            await sleep(waitTime);
            return withRetry(fn, isImage, retries - 1, backoff * 2);
        }

        console.error("Gemini API call failed permanently:", errorMsg);
        throw error;
    }
}

const VASTU_GUIDE = `You are the "Vastu Shastra Consultant" for SMM Modular Furniture (South India's premium modular interior brand with 20+ years experience).

CORE VASTU KNOWLEDGE:
1. Living Room: Ideally North/East. Heavy furniture (sofa, TV unit) in South/West. Occupants face North/East. Electronics in South-East. Keep North-East light and clutter-free.
2. Master Bedroom: Ideally South-West. Headboard against South/West wall. Never head facing North. No bed under beams. Mirrors must NOT reflect the bed.
3. Kitchen: Best in South-East (Agni corner). Cook should face East. Keep water (sink) and fire (stove) separate. 
4. Pooja Room: Best in North-East. Should be separate from bedroom.
5. Dining: Best in West or North-West direction.
6. Entrance: Best facing East or North for prosperity.

PROTOCOL:
- Evaluate every detected element against Vastu rules.
- Generate a Compliance Score (1-100).
- Use "Correction" instead of "Bad".
- Suggest SMM Modular product recommendations in 'smm_product_boost' to fix violations (e.g., "SMM Marine Ply Modular Wardrobe", "SMM Teak Wood TV Unit").`;

const SPATIAL_ANALYZER = `You are the Lead Virtual Architect for SMM Modular Furniture.
Analyze the uploaded floor plan, sketch, or room photo:
- Detect walls, windows, doors, furniture, and room boundaries.
- Identify the room type (living_room, bedroom, kitchen, entire_home, etc).
- Estimate room dimensions using standard door width (3ft) as reference.
- Provide a detailed layout analysis summary.`;

/**
 * Combined Spatial + Vastu analysis using Gemini
 */
export const analyzeSketch = async (
    base64Image: string,
    roomType: string = "",
    userPrompt: string = ""
): Promise<AnalysisResult> => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const prompt = `Analyze this ${roomType || 'room'} sketch/floor plan for SMM Modular Furniture. ${userPrompt}
    Identify all structural elements, furniture placements, and room boundaries. 
    Perform a comprehensive Vastu Shastra audit with specific corrections.
    The user selected room type: "${roomType}".`;

    const response = await withRetry(() => ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: {
            parts: [
                { inlineData: { mimeType: "image/jpeg", data: base64Image } },
                { text: prompt }
            ]
        },
        config: {
            systemInstruction: `${SPATIAL_ANALYZER}\n\n${VASTU_GUIDE}`,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    objects: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                object: { type: Type.STRING },
                                bbox: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                                confidence: { type: Type.NUMBER },
                                suggestedSKU: { type: Type.STRING }
                            },
                            required: ["object", "bbox"]
                        }
                    },
                    architecture: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                type: { type: Type.STRING, enum: ['wall', 'window', 'door', 'opening'] },
                                bbox: { type: Type.ARRAY, items: { type: Type.NUMBER } }
                            }
                        }
                    },
                    vastu_score: { type: Type.INTEGER },
                    status: { type: Type.STRING, enum: ['Auspicious', 'Neutral', 'Needs Remedy'] },
                    violations: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                item: { type: Type.STRING },
                                issue: { type: Type.STRING },
                                impact: { type: Type.STRING }
                            }
                        }
                    },
                    remedies: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                action: { type: Type.STRING },
                                reason: { type: Type.STRING },
                                smm_product_boost: { type: Type.STRING }
                            }
                        }
                    },
                    summary: { type: Type.STRING },
                    roomType: { type: Type.STRING },
                    layoutAnalysis: { type: Type.STRING }
                },
                required: ["objects", "vastu_score", "status", "violations", "remedies", "summary", "roomType"]
            }
        }
    }), false);

    return JSON.parse(response.text || '{}');
};

/**
 * Generate 3 render variations with different lighting conditions
 */
export const generateRenders = async (
    sketchBase64: string,
    analysis: AnalysisResult,
    customModifications: string = ""
): Promise<RenderVariation[]> => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const detectedProducts = analysis.objects.map(o => o.suggestedSKU || o.object).join(', ');

    const basePrompt = `8K photorealistic architectural interior render for SMM Modular Furniture.
    - SCENE: Premium Indian home interior design.
    - SPATIAL FIDELITY: Maintain exact placement of all walls and furniture from the sketch.
    - FURNITURE: Render ${detectedProducts} clearly with SMM Modular premium finishes.
    - MATERIALS: Teak wood, Marine Ply, Walnut veneer, Soft-close mechanisms, German fittings.
    - STYLE: Modern Indian luxury, clean lines, premium modular furniture.
    - ROOM TYPE: ${analysis.roomType}
    ${customModifications ? `- CUSTOM: ${customModifications}` : ''}`;

    const variations = [
        { name: "Morning Daylight", lighting: "Bright morning sun streaming through windows, soft natural shadows, warm golden tones." },
        { name: "Evening Ambient", lighting: "Warm evening light, cozy ambient table lamps and ceiling lights, subtle warm shadows." },
        { name: "Cinematic Twilight", lighting: "Dramatic twilight lighting, high contrast, moody luxury atmosphere with accent lighting." }
    ];

    const renders: RenderVariation[] = [];

    for (let i = 0; i < variations.length; i++) {
        const v = variations[i];
        try {
            console.log(`Generating render variation ${i + 1}/${variations.length}: ${v.name}...`);

            const response = await withRetry(() => ai.models.generateContent({
                model: 'gemini-2.0-flash-exp',
                contents: {
                    parts: [
                        { inlineData: { mimeType: 'image/jpeg', data: sketchBase64 } },
                        { text: `${basePrompt}\nLIGHTING: ${v.lighting}\nGenerate a photorealistic interior render of this space.` }
                    ]
                },
                config: {
                    responseModalities: ["IMAGE", "TEXT"],
                }
            }), true);

            const parts = response.candidates?.[0]?.content?.parts || [];
            const imagePart = parts.find((p: any) => p.inlineData);
            if (imagePart?.inlineData) {
                renders.push({
                    name: v.name,
                    url: `data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`
                });
                console.log(`✅ Render "${v.name}" generated successfully`);
            } else {
                console.warn(`⚠️ No image in response for variation "${v.name}"`);
            }
        } catch (err) {
            console.error(`❌ Render failed for "${v.name}":`, err);
        }

        // Cool down between renders to respect rate limits
        if (i < variations.length - 1) {
            console.log("Cooling down between renders (10s)...");
            await sleep(10000);
        }
    }

    return renders;
};
