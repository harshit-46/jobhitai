from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import os
import uuid
import httpx
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL   = "llama-3.3-70b-versatile"

from auth import get_current_user
from database import get_db, users_collection, db

router = APIRouter()


# ── Groq helper ────────────────────────────────────────────────────────────────

async def groq_chat(system: str, user: str) -> str:
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not set")

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
                    {"role": "system", "content": system},
                    {"role": "user",   "content": user},
                ],
                "temperature": 0.7,
            },
        )
    data = response.json()
    if "choices" not in data:
        raise ValueError(f"Groq error: {data}")
    return data["choices"][0]["message"]["content"].strip()


# ── Helper: resolve uid_obj silently ──────────────────────────────────────────

async def _try_get_uid(current_user: dict):
    """Returns ObjectId or None — never raises, so logging never breaks a route."""
    try:
        db_user = await users_collection.find_one({"email": current_user["sub"]})
        return db_user["_id"] if db_user else None
    except Exception:
        return None


# ── Pydantic Models ────────────────────────────────────────────────────────────

class PersonalInfo(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    github: str = ""
    website: str = ""
    summary: str = ""

class Experience(BaseModel):
    id: Optional[int] = None
    company: str = ""
    role: str = ""
    location: str = ""
    start: str = ""
    end: str = ""
    current: bool = False
    bullets: List[str] = []

class Education(BaseModel):
    id: Optional[int] = None
    institution: str = ""
    degree: str = ""
    field: str = ""
    start: str = ""
    end: str = ""
    cgpa: str = ""
    current: bool = False

class Skills(BaseModel):
    technical: List[str] = []
    soft: List[str] = []

class Project(BaseModel):
    id: Optional[int] = None
    title: str = ""
    description: str = ""
    techStack: List[str] = []
    liveUrl: str = ""
    githubUrl: str = ""

class ResumeData(BaseModel):
    resume_id: Optional[str] = None
    filename: str = "My Resume"
    template: str = "modern"
    personal: PersonalInfo = PersonalInfo()
    experience: List[Experience] = []
    education: List[Education] = []
    skills: Skills = Skills()
    projects: List[Project] = []
    certifications: List[dict] = []

class BulletEnhanceRequest(BaseModel):
    bullet: str


# ── Save Resume (create or update) ────────────────────────────────────────────

@router.post("/save")
async def save_resume(
    resume: ResumeData,
    current_user: dict = Depends(get_current_user),
    db_dep=Depends(get_db),
):
    user_id = current_user["sub"]
    now     = datetime.now(timezone.utc).isoformat()
    resume_dict           = resume.model_dump()
    resume_dict["user_id"] = user_id

    uid_obj     = await _try_get_uid(current_user)
    is_update   = bool(resume.resume_id)

    if is_update:
        # ── Update ──────────────────────────────────────────────────────────
        result = await db_dep["built_resumes"].update_one(
            {"resume_id": resume.resume_id, "user_id": user_id},
            {"$set": {**resume_dict, "updated_at": now}},
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Resume not found")

        resume_id    = resume.resume_id
        action_type  = "resume_update"
        label        = f"Updated resume: {resume.filename or 'Untitled'}"
        icon         = "✏️"
        response_msg = "Resume updated successfully"

    else:
        # ── Create ──────────────────────────────────────────────────────────
        resume_id               = str(uuid.uuid4())
        resume_dict["resume_id"] = resume_id
        resume_dict["created_at"] = now
        resume_dict["updated_at"] = now
        await db_dep["built_resumes"].insert_one(resume_dict)

        action_type  = "resume_created"
        label        = f"Created resume: {resume.filename or 'Untitled'}"
        icon         = "📄"
        response_msg = "Resume created successfully"

    # ── Log activity + push dashboard update ──────────────────────────────
    if uid_obj:
        try:
            await db.activity_log.insert_one({
                "user_id":        uid_obj,
                "action_type":    action_type,
                "label_override": label,
                "created_at":     datetime.utcnow(),
            })
            from routes.dashboard_stream import emit_dashboard_event, _snapshot_stats
            await emit_dashboard_event(uid_obj, "activity_update", {
                "label":       label,
                "time":        "just now",
                "icon":        icon,
                "action_type": action_type,
            })
            # On create, also update the resume count stat card
            if not is_update:
                await emit_dashboard_event(
                    uid_obj, "stats_update", await _snapshot_stats(uid_obj)
                )
        except Exception as e:
            print("Dashboard emit error (non-fatal):", e)

    return {"message": response_msg, "resume_id": resume_id}


# ── List ───────────────────────────────────────────────────────────────────────

@router.get("/list")
async def list_resumes(
    current_user: dict = Depends(get_current_user),
    db_dep=Depends(get_db),
):
    user_id = current_user["sub"]
    cursor  = db_dep["built_resumes"].find(
        {"user_id": user_id},
        {
            "_id": 0, "resume_id": 1, "filename": 1, "template": 1,
            "created_at": 1, "updated_at": 1, "personal": 1,
        },
    ).sort("updated_at", -1)
    resumes = await cursor.to_list(length=50)
    return {"resumes": resumes}


# ── Get single resume ──────────────────────────────────────────────────────────

@router.get("/{resume_id}")
async def get_resume(
    resume_id: str,
    current_user: dict = Depends(get_current_user),
    db_dep=Depends(get_db),
):
    user_id = current_user["sub"]
    resume  = await db_dep["built_resumes"].find_one(
        {"resume_id": resume_id, "user_id": user_id},
        {"_id": 0},
    )
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


# ── Delete ─────────────────────────────────────────────────────────────────────

@router.delete("/delete/{resume_id}")
async def delete_resume(
    resume_id: str,
    current_user: dict = Depends(get_current_user),
    db_dep=Depends(get_db),
):
    user_id = current_user["sub"]
    uid_obj = await _try_get_uid(current_user)

    # Grab filename before deleting (for the activity label)
    doc = await db_dep["built_resumes"].find_one(
        {"resume_id": resume_id, "user_id": user_id},
        {"filename": 1},
    )

    result = await db_dep["built_resumes"].delete_one(
        {"resume_id": resume_id, "user_id": user_id}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resume not found")

    # ── Log + push ─────────────────────────────────────────────────────────
    if uid_obj:
        filename = doc.get("filename", "Untitled") if doc else "Untitled"
        try:
            await db.activity_log.insert_one({
                "user_id":        uid_obj,
                "action_type":    "resume_update",
                "label_override": f"Deleted resume: {filename}",
                "created_at":     datetime.utcnow(),
            })
            from routes.dashboard_stream import emit_dashboard_event, _snapshot_stats
            await emit_dashboard_event(uid_obj, "activity_update", {
                "label":       f"Deleted resume: {filename}",
                "time":        "just now",
                "icon":        "🗑️",
                "action_type": "resume_update",
            })
            await emit_dashboard_event(
                uid_obj, "stats_update", await _snapshot_stats(uid_obj)
            )
        except Exception as e:
            print("Dashboard emit error (non-fatal):", e)

    return {"message": "Resume deleted successfully"}


# ── AI: Generate Summary ───────────────────────────────────────────────────────

@router.post("/ai/generate-summary")
async def generate_summary(
    resume: ResumeData,
    current_user: dict = Depends(get_current_user),
):
    experience_text = ""
    for exp in resume.experience:
        experience_text += f"\n- {exp.role} at {exp.company}"
        if exp.bullets:
            experience_text += ": " + "; ".join(exp.bullets[:2])

    skills_text   = ", ".join(resume.skills.technical[:10])
    projects_text = ", ".join([p.title for p in resume.projects if p.title])

    system = "You are a professional resume writer. Write only the summary text — no labels, no preamble, no quotes."
    user   = f"""Write a strong professional resume summary (2-3 sentences).

Name: {resume.personal.name}
Experience: {experience_text or "None yet"}
Skills: {skills_text or "Not specified"}
Projects: {projects_text or "None"}

Make it concise, impactful, and tailored for tech roles in the Indian job market."""

    try:
        summary = await groq_chat(system, user)

        # ── Log AI summary generation ──────────────────────────────────────
        uid_obj = await _try_get_uid(current_user)
        if uid_obj:
            try:
                await db.activity_log.insert_one({
                    "user_id":        uid_obj,
                    "action_type":    "ai_suggestion",
                    "label_override": "Generated AI Resume Summary",
                    "created_at":     datetime.utcnow(),
                })
                from routes.dashboard_stream import emit_dashboard_event
                await emit_dashboard_event(uid_obj, "activity_update", {
                    "label":       "Generated AI Resume Summary",
                    "time":        "just now",
                    "icon":        "🤖",
                    "action_type": "ai_suggestion",
                })
            except Exception as e:
                print("Dashboard emit error (non-fatal):", e)

        return {"summary": summary}
    except Exception as e:
        print(f"Groq summary error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate summary.")


# ── AI: Enhance Bullet ─────────────────────────────────────────────────────────

@router.post("/ai/enhance-bullet")
async def enhance_bullet(
    request: BulletEnhanceRequest,
    current_user: dict = Depends(get_current_user),
):
    system = "You are a professional resume writer. Return only the improved bullet point — no labels, no preamble, no quotes."
    user   = f"""Improve this resume bullet point:

"{request.bullet}"

Make it:
- Start with a strong action verb
- Quantify impact where possible
- Concise and one sentence only
- Suitable for a tech resume in the Indian job market"""

    try:
        enhanced = await groq_chat(system, user)

        # ── Log bullet enhancement ─────────────────────────────────────────
        uid_obj = await _try_get_uid(current_user)
        if uid_obj:
            try:
                await db.activity_log.insert_one({
                    "user_id":        uid_obj,
                    "action_type":    "ai_suggestion",
                    "label_override": "Enhanced Resume Bullet with AI",
                    "created_at":     datetime.utcnow(),
                })
                from routes.dashboard_stream import emit_dashboard_event
                await emit_dashboard_event(uid_obj, "activity_update", {
                    "label":       "Enhanced Resume Bullet with AI",
                    "time":        "just now",
                    "icon":        "✨",
                    "action_type": "ai_suggestion",
                })
            except Exception as e:
                print("Dashboard emit error (non-fatal):", e)

        return {"enhanced": enhanced}
    except Exception as e:
        print(f"Groq bullet error: {e}")
        raise HTTPException(status_code=500, detail="Failed to enhance bullet.")