from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
import httpx

router = APIRouter()

# 🔗 ML Service Base URL
ML_API = "https://jobhitai-ml-service.onrender.com"


# 🔥 Generic helper to call ML service
async def call_ml_service(method: str, endpoint: str, **kwargs):
    url = f"{ML_API}{endpoint}"

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.request(method, url, **kwargs)

    return response.json()


# ================================
# 📄 Resume Classification
# ================================
@router.post("/predict/resume")
async def predict_resume(file: UploadFile = File(...)):
    file_bytes = await file.read()

    result = await call_ml_service(
        "POST",
        "/api/ml/resume",
        files={"file": ("resume.pdf", file_bytes)}
    )

    return result


# ================================
# 🧠 Skill Matcher
# ================================
class SkillMatchRequest(BaseModel):
    resume_text: str
    job_description: str


@router.post("/predict/skills")
async def match_skills(data: SkillMatchRequest):
    result = await call_ml_service(
        "POST",
        "/api/ml/skills",
        json=data.dict()
    )

    return result


# ================================
# 🧠 Job Category Predictor
# ================================
class JobPredictRequest(BaseModel):
    resume_text: str


@router.post("/predict/job")
async def predict_job(data: JobPredictRequest):
    result = await call_ml_service(
        "POST",
        "/api/ml/job",
        json=data.dict()
    )

    return result


# ================================
# 🧠 Skill Set Matcher
# ================================
class SkillSetRequest(BaseModel):
    skills: list[str]


@router.post("/predict/skillset")
async def skillset_match(data: SkillSetRequest):
    result = await call_ml_service(
        "POST",
        "/api/ml/skillset",
        json=data.dict()
    )

    return result