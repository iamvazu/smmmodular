import { GoogleGenAI } from "@google/genai";

async function listModels() {
    const api_key = "AIzaSyDBRBY7faHAp1Dbs11iy4aHsyefzNdQHxc";
    const ai = new GoogleGenAI({ apiKey: api_key });

    try {
        console.log("Listing available models...");
        const response = await ai.models.list();
        console.log(JSON.stringify(response, null, 2));
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
