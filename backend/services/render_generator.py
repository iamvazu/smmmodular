import os
import google.generativeai as genai
from PIL import Image, ImageDraw

class RenderGenerator:
    def __init__(self):
        self.ready = False
        try:
            api_key = os.getenv("GEMINI_API_KEY")
            genai.configure(api_key=api_key)
            # Use Gemini for text-based design descriptions
            # (Gemini does not generate images directly, so we use it to 
            #  produce rich design recommendations, and serve curated renders)
            self.model = genai.GenerativeModel("gemini-1.5-pro-002")
            self.ready = True
            print("Gemini Render Advisor Pipeline Ready.")
        except Exception as e:
            print(f"Warning: Gemini render advisor disabled. Running in stub mode. Details: {e}")

    async def generate(
        self, 
        control_image,
        style: str,
        time_of_day: str,
        room_type: str,
        furniture_items: list
    ):
        style_prompts = {
            "modern": "modern minimalist interior design, clean lines, neutral colors",
            "contemporary_indian": "contemporary Indian interior, warm wood tones, ethnic accents",
            "scandinavian": "Scandinavian design, light wood, hygge, cozy",
            "industrial": "industrial loft style, exposed brick, metal accents"
        }
        
        lighting = {
            "morning": "soft morning sunlight streaming through windows, warm golden hour",
            "afternoon": "bright natural daylight, clear shadows",
            "evening": "warm ambient lighting, cozy evening atmosphere, lamps glowing"
        }
        
        furniture_desc = ", ".join([f"SMM {item.get('name', 'Custom Item')} in {item.get('finish', 'Wood')}" for item in furniture_items])

        # Map room types to curated SMM render images
        # These are high-quality project photos from the SMM portfolio
        render_map = {
            "living_room": "/images/services/residential-projects/img(18).webp",
            "bedroom": "/images/services/residential-projects/img(22).webp",
            "master_bedroom": "/images/services/residential-projects/img(22).webp",
            "kitchen": "/images/services/residential-projects/img(26).webp",
            "office": "/images/services/commercial-projects/img(1).webp",
            "entire_home": "/images/services/residential-projects/img(18).webp",
        }

        selected_render = render_map.get(room_type, render_map["living_room"])

        if self.ready:
            # Use Gemini to generate a rich design description
            prompt = f"""
            You are an expert interior designer working for SMM Modular Furniture.
            Generate a short, elegant description (2-3 sentences) of a {room_type} designed in
            {style_prompts.get(style, style_prompts['modern'])} style, with 
            {lighting.get(time_of_day, lighting['morning'])} lighting.
            Furniture: {furniture_desc}.
            Make it sound premium and aspirational.
            """
            try:
                response = self.model.generate_content(prompt)
                design_description = response.text
            except Exception as e:
                print(f"Gemini design description failed: {e}")
                design_description = f"A stunning {room_type} featuring premium SMM modular furniture in a {style} aesthetic."
            
            return {
                "render_url": selected_render,
                "design_description": design_description,
                "style": style,
                "room_type": room_type
            }
        else:
            print("Notice: Returning placeholder render because Gemini wasn't loaded.")
            return {
                "render_url": selected_render,
                "design_description": f"A beautifully designed {room_type} with premium SMM modular furniture.",
                "style": style,
                "room_type": room_type
            }
