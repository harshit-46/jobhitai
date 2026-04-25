# Resume builder

from fastapi import APIRouter, Depends, HTTPException
#from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
#import io
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
# Groq helper
# ─────────────────────────────────────────────

async def groq_chat(system: str, user: str) -> str:
    """Call Groq and return the assistant message text."""
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


# ─────────────────────────────────────────────
# Pydantic Models
# ─────────────────────────────────────────────

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
    resume_id: Optional[str] = None       # omit on create, send on update
    filename: str = "My Resume"           # user-editable title shown in the vault
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
# Save Resume  (create or update)
# ─────────────────────────────────────────────

@router.post("/save")
async def save_resume(
    resume: ResumeData,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    user_id = current_user["sub"]   # email from JWT — consistent with rest of app
    now = datetime.now(timezone.utc).isoformat()
    resume_dict = resume.model_dump()
    resume_dict["user_id"] = user_id

    if resume.resume_id:
        # ── Update existing resume ──────────────────────────────────────────
        result = await db["built_resumes"].update_one(
            {"resume_id": resume.resume_id, "user_id": user_id},
            {"$set": {**resume_dict, "updated_at": now}},
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Resume not found")
        return {"message": "Resume updated successfully", "resume_id": resume.resume_id}
    else:
        # ── Create new resume ───────────────────────────────────────────────
        resume_id = str(uuid.uuid4())
        resume_dict["resume_id"] = resume_id
        resume_dict["created_at"] = now
        resume_dict["updated_at"] = now
        await db["built_resumes"].insert_one(resume_dict)
        return {"message": "Resume created successfully", "resume_id": resume_id}


# ─────────────────────────────────────────────
# List all built resumes for the current user
# ─────────────────────────────────────────────

@router.get("/list")
async def list_resumes(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    user_id = current_user["sub"]
    cursor = db["built_resumes"].find(
        {"user_id": user_id},
        {
            "_id": 0,
            "resume_id": 1,
            "filename": 1,
            "template": 1,
            "created_at": 1,
            "updated_at": 1,
            "personal": 1,   # included so we can show name/role in the card
        },
    ).sort("updated_at", -1)
    resumes = await cursor.to_list(length=50)
    return {"resumes": resumes}


# ─────────────────────────────────────────────
# Fetch a single resume (full data — for the editor)
# ─────────────────────────────────────────────

@router.get("/{resume_id}")
async def get_resume(
    resume_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    user_id = current_user["sub"]
    resume = await db["built_resumes"].find_one(
        {"resume_id": resume_id, "user_id": user_id},
        {"_id": 0},
    )
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


# ─────────────────────────────────────────────
# Delete a resume
# ─────────────────────────────────────────────

@router.delete("/delete/{resume_id}")
async def delete_resume(
    resume_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    user_id = current_user["sub"]
    result = await db["built_resumes"].delete_one(
        {"resume_id": resume_id, "user_id": user_id}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {"message": "Resume deleted successfully"}



"""


@router.post("/export-pdf")
async def export_pdf(
    resume: ResumeData,
    current_user: dict = Depends(get_current_user),
):
    try:
        from weasyprint import HTML
        from jinja2 import Environment, FileSystemLoader

        templates_dir = os.path.join(os.path.dirname(__file__), "..", "templates")
        env = Environment(loader=FileSystemLoader(templates_dir))
        template = env.get_template("resume_modern.html")

        html_content = template.render(resume=resume.model_dump())
        pdf_bytes = HTML(string=html_content).write_pdf()

        filename = f"{resume.personal.name or 'resume'}_resume.pdf".replace(" ", "_")

        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="WeasyPrint not installed. Run: pip install weasyprint",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")


@router.get("/export-pdf/{resume_id}")
async def export_pdf_by_id(
    resume_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    user_id = current_user["sub"]
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

    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="WeasyPrint not installed. Run: pip install weasyprint",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")


"""



# ─────────────────────────────────────────────
# AI: Generate Summary
# ─────────────────────────────────────────────

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
        return {"summary": summary}
    except Exception as e:
        print(f"Groq summary error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate summary.")


# ─────────────────────────────────────────────
# AI: Enhance Bullet Point
# ─────────────────────────────────────────────

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
        return {"enhanced": enhanced}
    except Exception as e:
        print(f"Groq bullet error: {e}")
        raise HTTPException(status_code=500, detail="Failed to enhance bullet.")