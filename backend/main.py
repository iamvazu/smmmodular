import os
import uuid
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

# Internal services
from services.spatial_analyzer import SpatialAnalyzer
from services.vastu_engine import VastuEngine
from services.render_generator import RenderGenerator
from integrations.crm import PerfexCRMIntegration

app = FastAPI(title="Aura AI API")

# Add CORS middleware to allow connections from local Vite (or deployed frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store (replace with Redis/Postgres in production)
session_store: dict = {}

# Helper save function
async def save_to_temp_storage(file: UploadFile) -> str:
    os.makedirs("/tmp/smm_aura_uploads", exist_ok=True)
    temp_path = f"/tmp/smm_aura_uploads/{uuid.uuid4()}_{file.filename}"
    
    with open(temp_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
        
    return temp_path

def generate_session_id():
    return str(uuid.uuid4())

def get_smm_catalog():
    return [
        {"name": "Elegance Sofa", "finish": "Teak Wood", "category": "sofa"},
        {"name": "Royal Wardrobe", "finish": "Walnut", "category": "wardrobe"},
        {"name": "Modular Kitchen Set", "finish": "Marine Ply", "category": "kitchen"},
    ]

def calculate_estimate(spatial_data):
    # Basic estimation logic based on room dimensions
    dims = spatial_data.get("estimated_dimensions", {})
    length = dims.get("length", 12)
    width = dims.get("width", 10)
    area = length * width
    # Rough cost per sq ft for modular interiors
    return round(area * 450, 2)

# Initialize engines
spatial_analyzer = SpatialAnalyzer()
vastu_engine = VastuEngine()
render_generator = RenderGenerator()
perfex_crm = PerfexCRMIntegration()

class LeadRequest(BaseModel):
    session_id: str
    name: str
    phone: str
    city: str
    room_type: str = "Entire Home"
    estimated_cost: float = 0.0
    vastu_score: int = 0
    email: str = ""

@app.post("/api/v1/lead")
async def capture_lead(lead: LeadRequest):
    """
    Capture lead from Aura AI UI and send to Perfex CRM
    """
    design_session = {
        "id": lead.session_id,
        "user_name": lead.name,
        "user_phone": lead.phone,
        "user_city": lead.city,
        "user_email": lead.email,
        "room_type": lead.room_type,
        "estimated_cost": lead.estimated_cost,
        "vastu_score": lead.vastu_score
    }
    perfex_crm.create_lead_from_design(design_session)
    return {"status": "success", "message": "Lead captured in Perfex CRM"}

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
    # Save locally to be sent to Gemini
    local_path = await save_to_temp_storage(file)
    
    # Analyze spatially using Gemini
    spatial_data = await spatial_analyzer.analyze(local_path, room_type)
    
    # Vastu analysis
    vastu_result = vastu_engine.analyze_layout(spatial_data, room_type)
    
    # Clean up the temp image
    try:
        os.remove(local_path)
    except Exception:
        pass

    # Generate a session ID and store results for later retrieval
    session_id = generate_session_id()
    session_store[session_id] = {
        "spatial_data": spatial_data,
        "vastu_analysis": vastu_result,
        "room_type": room_type
    }
    
    return {
        "spatial_data": spatial_data,
        "vastu_analysis": vastu_result,
        "session_id": session_id
    }

@app.post("/api/v1/generate")
async def generate_render_endpoint(
    session_id: str,
    style: str = "modern",
    time_of_day: str = "morning",
    apply_vastu_corrections: bool = True
):
    """
    Generate photorealistic render using Gemini + curated SMM portfolio
    """
    # Retrieve spatial data from session store
    session = session_store.get(session_id, {"room_type": "living_room", "detected_furniture": []})
    room_type = session.get("room_type", "living_room")
    
    # Generate render with Gemini-powered advisor
    render_result = await render_generator.generate(
        control_image=None,
        style=style,
        time_of_day=time_of_day,
        room_type=room_type,
        furniture_items=get_smm_catalog()
    )
    
    spatial_data = session.get("spatial_data", {})
    
    return {
        "render_url": render_result.get("render_url", "/images/services/residential-projects/img(18).webp"),
        "thumbnail_url": "",
        "furniture_items": get_smm_catalog(),
        "estimated_cost": calculate_estimate(spatial_data),
        "design_description": render_result.get("design_description", "")
    }

@app.get("/api/v1/session/{session_id}")
async def get_session(session_id: str):
    """
    Retrieve a stored session's analysis results
    """
    session = session_store.get(session_id)
    if not session:
        return {"error": "Session not found"}
    return session

@app.get("/health")
def health_check():
    return {"status": "healthy", "engines": {"gemini": render_generator.ready}}

# Serve React frontend build from ../dist
DIST_DIR = Path(__file__).resolve().parent.parent / "dist"
if DIST_DIR.is_dir():
    # Mount static assets (JS, CSS, images)
    app.mount("/assets", StaticFiles(directory=str(DIST_DIR / "assets")), name="assets")
    if (DIST_DIR / "images").is_dir():
        app.mount("/images", StaticFiles(directory=str(DIST_DIR / "images")), name="images")

    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        """Catch-all route: serve static files or fallback to index.html for SPA routing"""
        file_path = DIST_DIR / full_path
        if file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(DIST_DIR / "index.html"))
