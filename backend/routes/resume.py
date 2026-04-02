# Resume builder

from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
import anthropic
import io

from auth import get_current_user  # your existing auth dependency
from database import get_db           # your existing MongoDB connection

router = APIRouter()

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
# Save Resume
# ─────────────────────────────────────────────

@router.post("/save")
async def save_resume(
    resume: ResumeData,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    user_id = str(current_user["_id"])
    resume_dict = resume.model_dump()
    resume_dict["user_id"] = user_id

    await db["resumes"].update_one(
        {"user_id": user_id},
        {"$set": resume_dict},
        upsert=True,
    )
    return {"message": "Resume saved successfully"}


# ─────────────────────────────────────────────
# Fetch Resume
# ─────────────────────────────────────────────

@router.get("/me")
async def get_my_resume(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    user_id = str(current_user["_id"])
    resume = await db["resumes"].find_one({"user_id": user_id}, {"_id": 0})
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found")
    return resume


# ─────────────────────────────────────────────
# Export PDF (WeasyPrint)
# ─────────────────────────────────────────────

@router.post("/export-pdf")
async def export_pdf(
    resume: ResumeData,
    current_user: dict = Depends(get_current_user),
):
    try:
        from weasyprint import HTML
        from jinja2 import Environment, FileSystemLoader
        import os

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


# ─────────────────────────────────────────────
# AI: Generate Summary
# ─────────────────────────────────────────────

@router.post("/ai/generate-summary")
async def generate_summary(
    resume: ResumeData,
    current_user: dict = Depends(get_current_user),
):
    client = anthropic.Anthropic()

    # Build context from resume data
    experience_text = ""
    for exp in resume.experience:
        experience_text += f"\n- {exp.role} at {exp.company}"
        if exp.bullets:
            experience_text += ": " + "; ".join(exp.bullets[:2])

    skills_text = ", ".join(resume.skills.technical[:10])
    projects_text = ", ".join([p.title for p in resume.projects if p.title])

    prompt = f"""You are a professional resume writer. Write a compelling 2-3 sentence professional summary for this person.

Name: {resume.personal.name}
Experience:{experience_text or " Not provided"}
Key Skills: {skills_text or "Not provided"}
Projects: {projects_text or "Not provided"}

Requirements:
- 2-3 sentences only
- Start with a strong professional identity statement
- Mention key skills and value proposition
- Use active voice, no first-person pronouns (no "I", "my")
- Tailored for software/tech roles in India
- Sound human and authentic, not generic

Return ONLY the summary text, nothing else."""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}],
    )

    summary = message.content[0].text.strip()
    return {"summary": summary}


# ─────────────────────────────────────────────
# AI: Enhance Bullet Point
# ─────────────────────────────────────────────

@router.post("/ai/enhance-bullet")
async def enhance_bullet(
    request: BulletEnhanceRequest,
    current_user: dict = Depends(get_current_user),
):
    client = anthropic.Anthropic()

    prompt = f"""You are a professional resume writer. Improve this resume bullet point to be more impactful.

Original bullet: "{request.bullet}"

Rules:
- Start with a strong action verb (Engineered, Architected, Optimized, Spearheaded, etc.)
- Include quantifiable metrics if possible (%, ms, users, requests/sec)
- Keep it concise — one sentence only
- Focus on impact, not just tasks
- Maintain technical accuracy
- Do NOT add fake numbers — if no metrics exist, focus on quality/impact language

Return ONLY the improved bullet point text. No quotes, no explanation."""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=150,
        messages=[{"role": "user", "content": prompt}],
    )

    enhanced = message.content[0].text.strip().strip('"')
    return {"enhanced": enhanced}