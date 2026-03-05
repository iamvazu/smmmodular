import json
import os
import google.generativeai as genai

class SpatialAnalyzer:
    def __init__(self):
        try:
            # Use the provided API key or fallback to environment variable
            api_key = os.getenv("GEMINI_API_KEY", "AIzaSyDBRBY7faHAp1Dbs11iy4aHsyefzNdQHxc")
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel("gemini-1.5-pro-002")
        except Exception as e:
            print(f"Failed to configure Gemini: {e}")
            self.model = None
        
    async def analyze(self, image_path: str, room_type: str) -> dict:
        try:
            if not self.model:
                return self.mock_response(room_type)

            import PIL.Image
            image = PIL.Image.open(image_path)
            
            analysis_prompt = f"""
            You are an expert interior designer and architect. Analyze this room image.
            
            Provide a JSON response with:
            {{
              "room_type": "{room_type}",
              "estimated_dimensions": {{"length": X, "width": Y, "height": Z, "unit": "feet"}},
              "walls": [{{"id": 1, "start": [x1,y1], "end": [x2,y2], "type": "load_bearing|partition"}}],
              "openings": [{{"type": "door|window", "position": [x,y], "width": W, "height": H}}],
              "detected_furniture": [{{"type": "sofa|bed|table", "position": [x,y], "approx_size": [w,h]}}],
              "lighting": {{"natural_light_direction": "north|south|east|west", "quality": "bright|moderate|dim"}},
              "floor_type": "tile|wood|marble|carpet|unknown"
            }}
            
            Use standard door width (3ft) and window height (4ft) as reference for scale.
            """
            
            response = self.model.generate_content([analysis_prompt, image])
            return self.parse_json_response(response.text)
        except Exception as e:
            print(f"Error in spatial analysis: {e}. Falling back to mock data.")
            return self.mock_response(room_type)

    def parse_json_response(self, text: str) -> dict:
        try:
            if text.startswith("```json"):
                text = text.split("```json")[1].split("```")[0].strip()
            return json.loads(text)
        except Exception as e:
            return self.mock_response("unknown")
            
    def mock_response(self, room_type):
        return {
          "room_type": room_type,
          "estimated_dimensions": {"length": 15, "width": 12, "height": 10, "unit": "feet"},
          "walls": [{"id": 1, "start": [0,0], "end": [15,0], "type": "load_bearing"}],
          "openings": [{"type": "door", "position": [5,0], "width": 3, "height": 7}],
          "detected_furniture": [{"type": "sofa", "position": [5,5], "approx_size": [6,3], "orientation": "east"}],
          "lighting": {"natural_light_direction": "east", "quality": "bright"},
          "floor_type": "tile"
        }
