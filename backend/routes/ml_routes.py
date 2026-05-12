"""

# Last Working File

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

    if response.status_code != 200:
        return {
            "error": "ML service error",
            "status": response.status_code,
            "details": response.text
        }

    try:
        return response.json()
    except Exception:
        return {
            "error": "Invalid JSON from ML service",
            "raw": response.text
        }

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
@router.post("/predict/job")
async def predict_job(file: UploadFile = File(...)):
    file_bytes = await file.read()

    result = await call_ml_service(
        "POST",
        "/api/ml/resume",
        files={"resume": (file.filename, file_bytes)}
    )

    return result

# ================================
# 🧠 Skill Set Matcher
# ================================
class SkillSetRequest(BaseModel):
    skills: str

@router.post("/predict/skillset")
async def skillset_match(data: SkillSetRequest):
    skills_str = " ".join([s.strip().lower() for s in data.skills.split(",")])
    print("Sending from backend to ml service : ", skills_str)
    result = await call_ml_service(
        "POST",
        "/api/ml/skills",
        data= {"skills" : skills_str}
    )

    return result

"""

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from pydantic import BaseModel
from auth import get_current_user
from database import users_collection, db
import httpx
from datetime import datetime

router = APIRouter()

# ML Service Base URL
ML_API = "https://jobhitai-ml-service.onrender.com"


# ── Generic helper to call ML service ─────────────────────────────────────────

async def call_ml_service(method: str, endpoint: str, **kwargs):
    url = f"{ML_API}{endpoint}"
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.request(method, url, **kwargs)

    if response.status_code != 200:
        return {
            "error": "ML service error",
            "status": response.status_code,
            "details": response.text
        }
    try:
        return response.json()
    except Exception:
        return {"error": "Invalid JSON from ML service", "raw": response.text}


# ── Helper: resolve uid_obj from JWT ──────────────────────────────────────────

async def _resolve_user(current_user: dict):
    db_user = await users_collection.find_one({"email": current_user["sub"]})
    if not db_user:
        raise HTTPException(404, "User not found.")
    return db_user


# ── Resume + Job Description Matcher (ATS scorer) ─────────────────────────────

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


# ── Job Category Predictor ─────────────────────────────────────────────────────

@router.post("/predict/job")
async def predict_job(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    file_bytes = await file.read()

    result = await call_ml_service(
        "POST",
        "/api/ml/resume",
        files={"resume": (file.filename, file_bytes)}
    )

    if "error" not in result:
        db_user = await _resolve_user(current_user)
        uid_obj = db_user["_id"]

        # ── Extract predicted category from ML response ───────────────────
        # Adjust key to match your ML service's actual response
        predicted_category = (
            result.get("predicted_category")
            or result.get("category")
            or result.get("job_category")
            or result.get("prediction")
        )

        if predicted_category:
            # ── Save prediction to MongoDB ────────────────────────────────
            await db.category_predictions.insert_one({
                "user_id":            uid_obj,
                "predicted_category": predicted_category,
                "created_at":         datetime.utcnow(),
            })

            # ── Log activity ──────────────────────────────────────────────
            await db.activity_log.insert_one({
                "user_id":     uid_obj,
                "action_type": "category_pred",
                "created_at":  datetime.utcnow(),
            })

            # ── Push live dashboard updates ───────────────────────────────
            try:
                from routes.dashboard_stream import emit_dashboard_event, _snapshot_stats
                updated_stats = await _snapshot_stats(uid_obj)
                await emit_dashboard_event(uid_obj, "stats_update", updated_stats)
                await emit_dashboard_event(uid_obj, "activity_update", {
                    "label":       "Job Category Predicted",
                    "time":        "just now",
                    "icon":        "🧠",
                    "action_type": "category_pred",
                })
            except Exception as e:
                print("Dashboard emit error (non-fatal):", e)

    return result


# ── Skill Set Matcher ──────────────────────────────────────────────────────────

class SkillSetRequest(BaseModel):
    skills: str

@router.post("/predict/skillset")
async def skillset_match(
    data: SkillSetRequest,
    current_user=Depends(get_current_user)
):
    skills_str = " ".join([s.strip().lower() for s in data.skills.split(",")])
    print("Sending from backend to ml service:", skills_str)

    result = await call_ml_service(
        "POST",
        "/api/ml/skills",
        data={"skills": skills_str}
    )

    if "error" not in result:
        db_user = await _resolve_user(current_user)
        uid_obj = db_user["_id"]

        # ── Log activity ──────────────────────────────────────────────────
        await db.activity_log.insert_one({
            "user_id":     uid_obj,
            "action_type": "ai_suggestion",
            "created_at":  datetime.utcnow(),
        })

        try:
            from routes.dashboard_stream import emit_dashboard_event
            await emit_dashboard_event(uid_obj, "activity_update", {
                "label":       "Skill Match Completed",
                "time":        "just now",
                "icon":        "🎯",
                "action_type": "ai_suggestion",
            })
        except Exception as e:
            print("Dashboard emit error (non-fatal):", e)

    return result