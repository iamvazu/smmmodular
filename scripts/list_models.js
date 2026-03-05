import { GoogleGenAI } from "@google/genai";

async function listModels() {
    const api_key = "AIzaSyBAL-yJ0kP0ttS-KfxG4HiBf4P9-3JAXto";
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
