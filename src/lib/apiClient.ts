const IS_PROD = import.meta.env.PROD;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (IS_PROD ? '/api/v1' : 'http://localhost:8000/api/v1');

export interface AnalysisResponse {
    spatial_data: any;
    vastu_analysis: {
        score: number;
        compliance_level: string;
        violations: string[];
        suggestions: string[];
        primary_direction: string;
    };
    session_id: string;
}

export interface GenerateResponse {
    render_url: string;
    thumbnail_url: string;
    furniture_items: any[];
    estimated_cost: number;
}

export const submitImageForAnalysis = async (file: File, roomType: string): Promise<AnalysisResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('room_type', roomType);

    // In a real implementation this might include user_id, etc.
    // formData.append('user_id', 'user_id_here');

    try {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.warn("Backend unreachable or failed, falling back to mock response for UI flow.", error);

        // Return a mock response so the frontend flow can gracefully continue if backend is down
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    session_id: "preview-session-" + Math.random().toString(36).substr(2, 9),
                    spatial_data: {
                        room_type: roomType,
                        estimated_dimensions: { length: 15, width: 12, height: 10, unit: "feet" },
                    },
                    vastu_analysis: {
                        score: 85,
                        compliance_level: "excellent",
                        violations: [],
                        suggestions: ["Consider South-West corner for master bedroom"],
                        primary_direction: "southwest"
                    }
                });
            }, 2000); // 2 second mock processing delay
        });
    }
};

export const pollRenderStatus = async (sessionId: string, style: string = 'modern', timeOfDay: string = 'morning'): Promise<GenerateResponse> => {
    // Note: A real implementation might use WebSockets or long polling. 
    // Here we make a simple POST call that blocks until the synchronous generation completes.
    try {
        const response = await fetch(`${API_BASE_URL}/generate?session_id=${sessionId}&style=${style}&time_of_day=${timeOfDay}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Generation failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.warn("Backend generate failed, falling back to mock render.", error);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    render_url: "/images/services/residential-projects/img(18).webp", // Mock luxury render
                    thumbnail_url: "",
                    furniture_items: [],
                    estimated_cost: 150000.00
                });
            }, 3500); // 3.5s mock rendering delay
        });
    }
};

export const captureLead = async (leadData: { session_id: string, name: string, phone: string, city: string, room_type?: string, email?: string, estimated_cost?: number, vastu_score?: number }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/lead`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leadData)
        });

        if (!response.ok) {
            throw new Error(`Failed to capture lead: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.warn("Backend lead capture failed, mocking success API", error);
        return new Promise((resolve) => setTimeout(() => resolve({ status: "success", mock: true }), 1000));
    }
};
