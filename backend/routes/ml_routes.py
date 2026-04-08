from fastapi import APIRouter, UploadFile, File , Form
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

    print("STATUS:", response.status_code)
    print("RAW RESPONSE:", response.text)  # 🔥 IMPORTANT

    return response.json()

# ================================
# 🧠 Resume + Job Description Matcher
# ================================
@router.post("/predict/resumejobmatcher")
async def match_skills(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    file_bytes = await file.read()

    result = await call_ml_service(
        "POST",
        "/api/ml/resumejd",
        files={"file": ("resume.pdf", file_bytes)},
        data={"job_description": job_description}
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