from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from services import resume_classifier, skills_matcher, job_match
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict
    allow_methods=["*"],
    allow_headers=["*"],
)

from routes.ml_routes import router as ml_router

app.include_router(ml_router, prefix="/api/ml", tags=["ML"])

@app.get("/")
def root():
    return {"message": "ML Service Running 🚀"}