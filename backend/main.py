import os
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Internal services
from services.spatial_analyzer import SpatialAnalyzer
from services.vastu_engine import VastuEngine
from services.render_generator import RenderGenerator

app = FastAPI(title="Aura AI API")

# Add CORS middleware to allow connections from local Vite (or deployed frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock persistence and utility functions
async def save_to_gcs(file: UploadFile) -> str:
    # Save file logic would go here
    return f"gs://smm-aura-ai-uploads/{file.filename}"

def generate_session_id():
    import uuid
    return str(uuid.uuid4())

async def get_session_data(session_id: str):
    return {"room_type": "living_room", "detected_furniture": []}

def create_controlnet_input(spatial_data):
    from PIL import Image
    return Image.new('RGB', (1024, 1024), color = 'white')

def get_smm_catalog():
    return [{"name": "Elegance Sofa", "finish": "Teak Wood", "category": "sofa"}]

async def upscale_image(image):
    return image

async def save_render_to_gcs(image, session_id):
    return f"https://storage.googleapis.com/smm-renders/{session_id}.png"

def create_thumbnail(image):
    return "thumbnail-url"

def extract_furniture_recommendations(data):
    return [{"category": "sofa", "price": "45000"}]

def calculate_estimate(data):
    return 150000.00

# Initialize engines
spatial_analyzer = SpatialAnalyzer()
vastu_engine = VastuEngine()
render_generator = RenderGenerator()

@app.post("/api/v1/analyze")
async def analyze_upload(
    file: UploadFile = File(...),
    room_type: str = "living_room",
    user_id: str = None
):
    """
    Analyze uploaded sketch/photo using Gemini 1.5 Pro
    Returns: Spatial layout, dimensions, Vastu analysis
    """
    # Save to GCS
    gcs_path = await save_to_gcs(file)
    
    # Analyze spatially using Custom Service
    spatial_data = await spatial_analyzer.analyze(gcs_path, room_type)
    
    # Vastu analysis
    vastu_result = vastu_engine.analyze_layout(spatial_data, room_type)
    
    return {
        "spatial_data": spatial_data,
        "vastu_analysis": vastu_result,
        "session_id": generate_session_id()
    }

@app.post("/api/v1/generate")
async def generate_render(
    session_id: str,
    style: str = "modern",
    time_of_day: str = "morning",
    apply_vastu_corrections: bool = True
):
    """
    Generate photorealistic render using Stable Diffusion XL + ControlNet
    """
    # Retrieve spatial data from DB/Cache
    spatial_data = await get_session_data(session_id)
    
    # Prepare ControlNet conditioning
    control_image = create_controlnet_input(spatial_data)
    
    # Generate with SDXL
    render = await render_generator.generate(
        control_image=control_image,
        style=style,
        time_of_day=time_of_day,
        room_type=spatial_data.get("room_type", "living_room"),
        furniture_items=get_smm_catalog()
    )
    
    # Upscale to 4K
    final_render = await upscale_image(render)
    
    # Save and return URL
    output_url = await save_render_to_gcs(final_render, session_id)
    
    return {
        "render_url": output_url,
        "thumbnail_url": create_thumbnail(final_render),
        "furniture_items": extract_furniture_recommendations(spatial_data),
        "estimated_cost": calculate_estimate(spatial_data)
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "engines": {"sdxl": render_generator.ready}}
