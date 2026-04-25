# Resume builder

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import io
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
from database import get_db

router = APIRouter()

# ─────────────────────────────────────────────
# Groq helper (IMPROVED)
# ─────────────────────────────────────────────

async def groq_chat(system: str, user: str) -> str:
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="AI service not configured")

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
                    {"role": "user", "content": user},
                ],
                "temperature": 0.7,
            },
        )

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="AI service failed")

    data = response.json()

    if "choices" not in data or not data["choices"]:
        raise HTTPException(status_code=500, detail="Invalid AI response")

    return data["choices"][0]["message"]["content"].strip()


# ─────────────────────────────────────────────
# Models (IMPROVED TYPES)
# ─────────────────────────────────────────────

class PersonalInfo(BaseModel):
    name: str = ""
    email: Optional[EmailStr] = None
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    github: str = ""
    website: str = ""
    summary: str = ""


class Experience(BaseModel):
    id: Optional[str] = None
    company: str = ""
    role: str = ""
    location: str = ""
    start: str = ""
    end: str = ""
    current: bool = False
    bullets: List[str] = []


class Education(BaseModel):
    id: Optional[str] = None
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
    id: Optional[str] = None
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


# ─────────────────────────────────────────────
# Helper: Auth guard
# ─────────────────────────────────────────────

def get_user_id(current_user: dict):
    if not current_user or "sub" not in current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return current_user["sub"]


# ─────────────────────────────────────────────
# Save Resume (FIXED UPDATE LOGIC)
# ─────────────────────────────────────────────

@router.post("/save")
async def save_resume(
    resume: ResumeData,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    user_id = get_user_id(current_user)
    now = datetime.now(timezone.utc).isoformat()

    if resume.resume_id:
        update_data = resume.model_dump(exclude_unset=True)

        result = await db["built_resumes"].update_one(
            {"resume_id": resume.resume_id, "user_id": user_id},
            {"$set": {**update_data, "updated_at": now}},
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Resume not found")

        return {"message": "Resume updated successfully", "resume_id": resume.resume_id}

    else:
        resume_id = str(uuid.uuid4())
        resume_dict = resume.model_dump()
        resume_dict.update({
            "resume_id": resume_id,
            "user_id": user_id,
            "created_at": now,
            "updated_at": now,
        })

        await db["built_resumes"].insert_one(resume_dict)

        return {"message": "Resume created successfully", "resume_id": resume_id}


# ─────────────────────────────────────────────
# List resumes
# ─────────────────────────────────────────────

@router.get("/list")
async def list_resumes(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    user_id = get_user_id(current_user)

    cursor = db["built_resumes"].find(
        {"user_id": user_id},
        {
            "_id": 0,
            "resume_id": 1,
            "filename": 1,
            "template": 1,
            "created_at": 1,
            "updated_at": 1,
            "personal": 1,
        },
    ).sort("updated_at", -1)

    resumes = await cursor.to_list(length=50)

    return {"resumes": resumes}


# ─────────────────────────────────────────────
# Get resume
# ─────────────────────────────────────────────

@router.get("/{resume_id}")
async def get_resume(
    resume_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    user_id = get_user_id(current_user)

    resume = await db["built_resumes"].find_one(
        {"resume_id": resume_id, "user_id": user_id},
        {"_id": 0},
    )

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    return resume


# ─────────────────────────────────────────────
# Delete
# ─────────────────────────────────────────────

@router.delete("/delete/{resume_id}")
async def delete_resume(
    resume_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    user_id = get_user_id(current_user)

    result = await db["built_resumes"].delete_one(
        {"resume_id": resume_id, "user_id": user_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resume not found")

    return {"message": "Resume deleted successfully"}


# ─────────────────────────────────────────────
# Export PDF
# ─────────────────────────────────────────────

@router.get("/export-pdf/{resume_id}")
async def export_pdf_by_id(
    resume_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    user_id = get_user_id(current_user)

    doc = await db["built_resumes"].find_one(
        {"resume_id": resume_id, "user_id": user_id},
        {"_id": 0},
    )

    if not doc:
        raise HTTPException(status_code=404, detail="Resume not found")

    try:
        from weasyprint import HTML
        from jinja2 import Environment, FileSystemLoader

        templates_dir = os.path.join(os.path.dirname(__file__), "..", "templates")
        env = Environment(loader=FileSystemLoader(templates_dir))
        template = env.get_template("resume_modern.html")

        html_content = template.render(resume=doc)
        pdf_bytes = HTML(string=html_content).write_pdf()

        name = doc.get("personal", {}).get("name") or "resume"
        filename = f"{name}_resume.pdf".replace(" ", "_")

        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")


# ─────────────────────────────────────────────
# AI Summary
# ─────────────────────────────────────────────

@router.post("/ai/generate-summary")
async def generate_summary(
    resume: ResumeData,
    current_user: dict = Depends(get_current_user),
):
    get_user_id(current_user)

    experience_lines = [
        f"- {exp.role} at {exp.company}: {'; '.join(exp.bullets[:2])}"
        for exp in resume.experience if exp.role or exp.company
    ]

    skills_text = ", ".join(resume.skills.technical[:10])
    projects_text = ", ".join([p.title for p in resume.projects if p.title])
    education_text = ", ".join([e.degree for e in resume.education if e.degree])

    if not any([experience_lines, skills_text, projects_text, education_text]):
        raise HTTPException(status_code=400, detail="Not enough data")

    system = "You are an expert resume writer."
    user = f"""
Experience: {experience_lines}
Skills: {skills_text}
Projects: {projects_text}
Education: {education_text}
Write 2-3 sentence professional summary.
"""

    summary = await groq_chat(system, user)
    return {"summary": summary}


# ─────────────────────────────────────────────
# AI Bullet
# ─────────────────────────────────────────────

@router.post("/ai/enhance-bullet")
async def enhance_bullet(
    request: BulletEnhanceRequest,
    current_user: dict = Depends(get_current_user),
):
    get_user_id(current_user)

    system = "Improve resume bullet with action verb and impact."
    user = request.bullet

    enhanced = await groq_chat(system, user)
    return {"enhanced": enhanced}