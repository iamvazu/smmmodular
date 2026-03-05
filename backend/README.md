# Build & Deploy Instructions for SMM Aura AI Backend

## Core Tech Stack
- **FastAPI**: Core Python framework for high-performance API routing.
- **Node.js (Next Step)**: Planned for WebSocket interactions handling the generation progress streaming.
- **Google Cloud Run**: Target serverless execution environment.
- **PostgreSQL**: Primary DB for caching configurations, sessions, and catalog.
- **Vertex AI / Gemini 1.5 Pro**: Used for Spatial & Layout Analysis mapping.
- **Stable Diffusion XL + ControlNet**: Gen-AI rendering using ControlNet for layout matching.

## Local Development
1. Requires Python `3.10+` minimum.
2. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
4. Access interactive API documentation at `http://127.0.0.1:8000/docs`

## Phase 2 Modules Implemented
- `/services/spatial_analyzer.py` - Wraps Gemini multi-modal prompt templates.
- `/services/vastu_engine.py` - Custom business logic engine implementing Vastu spatial rule deductions.
- `/services/render_generator.py` - Diffusers/ControlNet based SDXL integration.
- `/integrations/crm.py` - Automatic lead injection routing based on regional South Indian branches.
- `/integrations/factory.py` - Experimental BOM (Bill of Materials) constructor parsing the AI furniture output.
- `/database/schema.sql` - Complete tracking model for Postgres setup.

## Next Steps (Deploy to GCP)
To push these containers to the cloud via Artifact Registry:
```bash
gcloud builds submit --tag asia-south1-docker.pkg.dev/YOUR-PROJ/smm/aura-api
gcloud run deploy smm-aura-api --image asia-south1-docker.pkg.dev/YOUR-PROJ/smm/aura-api --region asia-south1 --memory 8Gi --cpu 4
```
*(Note: To utilize full SDXL generation without crashing, you will either need a GPU-backed Cloud Run instance or host the generation pipeline on a Vertex AI endpoint serving the PyTorch SDXL workload, reducing this FastAPI to a lightweight orchestration layer.)*
