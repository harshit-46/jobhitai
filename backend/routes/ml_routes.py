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
import os

router = APIRouter()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL   = "llama-3.3-70b-versatile"

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
    import pdfplumber, io

    # ── Extract text from PDF ──────────────────────────────────────────────
    file_bytes = await file.read()
    text = ""
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                text += (page.extract_text() or "") + "\n"
    except Exception as e:
        raise HTTPException(400, f"Could not read PDF: {e}")

    if not text.strip():
        raise HTTPException(400, "Resume appears to be empty or unreadable.")

    # ── Call Groq ──────────────────────────────────────────────────────────
    system_prompt = """You are a resume analysis expert. Given a resume, predict the most suitable job category.

Choose ONLY from these categories:
Java Developer, Testing, DevOps Engineer, Python Developer, Web Designing,
HR, Hadoop, Blockchain, ETL Developer, Operations Manager, Data Science,
Sales, Mechanical Engineer, Arts, Database, Electrical Engineering,
Health and Fitness, PMO, Business Analyst, DotNet Developer, Automation Testing,
Network Security Engineer, SAP Developer, Civil Engineer, Advocate

Respond ONLY with a valid JSON object — no explanation, no markdown, no extra text:
{"predicted_category": "<category>", "confidence": "<High|Medium|Low>", "reason": "<one sentence>"}"""

    user_message = f"Resume:\n{text[:4000]}"  # Groq context is large but keep it focused

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                GROQ_URL,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": GROQ_MODEL,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user",   "content": user_message},
                    ],
                    "temperature": 0.2,  # low temp for consistent classification
                },
            )

        data = response.json()

        if "choices" not in data:
            print("Groq Error:", data)
            raise HTTPException(500, "LLM response error")

        import json as json_lib
        raw = data["choices"][0]["message"]["content"].strip()

        # Strip markdown fences if Groq wraps in ```json
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        result = json_lib.loads(raw.strip())

    except httpx.TimeoutException:
        raise HTTPException(504, "Groq timed out.")
    except json_lib.JSONDecodeError:
        raise HTTPException(500, "Could not parse Groq response.")
    except HTTPException:
        raise
    except Exception as e:
        print("Groq job predict error:", e)
        raise HTTPException(500, "Failed to predict job category.")

    # ── Save to MongoDB + log activity ─────────────────────────────────────
    db_user = await _resolve_user(current_user)
    uid_obj = db_user["_id"]

    predicted_category = result.get("predicted_category")

    if predicted_category:
        await db.category_predictions.insert_one({
            "user_id":            uid_obj,
            "predicted_category": predicted_category,
            "confidence":         result.get("confidence"),
            "created_at":         datetime.utcnow(),
        })

        await db.activity_log.insert_one({
            "user_id":     uid_obj,
            "action_type": "category_pred",
            "created_at":  datetime.utcnow(),
        })

        try:
            from routes.dashboard_stream import emit_dashboard_event, _snapshot_stats
            await emit_dashboard_event(uid_obj, "stats_update", await _snapshot_stats(uid_obj))
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