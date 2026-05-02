import io
import json
import os
import re

import httpx
import docx2txt
import pdfplumber
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL   = "llama-3.3-70b-versatile"

router = APIRouter()


# ── Models ────────────────────────────────────────────────────────────────────

class Tip(BaseModel):
    title: str
    detail: str

class ATSResponse(BaseModel):
    overall_score: int
    grade: str
    verdict: str
    scores: dict[str, int]
    strengths: list[str]
    issues: list[str]
    tips: list[Tip]


# ── Helpers ───────────────────────────────────────────────────────────────────

def _extract_pdf(data: bytes) -> str:
    with pdfplumber.open(io.BytesIO(data)) as pdf:
        return "\n".join(page.extract_text() or "" for page in pdf.pages)

def _extract_docx(data: bytes) -> str:
    return docx2txt.process(io.BytesIO(data))

def _grade(score: int) -> str:
    if score >= 80: return "ATS-Ready"
    if score >= 65: return "Good"
    if score >= 50: return "Needs Improvement"
    return "Poor"

SYSTEM_PROMPT = """You are an expert ATS (Applicant Tracking System) analyst.
Evaluate resumes purely on ATS compatibility — formatting, structure, keywords,
bot-readability, section completeness, and overall quality.
Do NOT compare to any job description.
Always respond ONLY with a valid JSON object. No markdown, no backticks, no explanation."""

def _build_user_message(resume_text: str) -> str:
    return f"""Evaluate this resume for ATS compatibility and return ONLY this JSON:

{{
  "overall_score": <integer 0-100>,
  "formatting":    <integer 0-100>,
  "keywords":      <integer 0-100>,
  "sections":      <integer 0-100>,
  "readability":   <integer 0-100>,
  "verdict": "<one sentence summary>",
  "strengths": ["up to 5 things the resume does well for ATS"],
  "issues":    ["up to 5 ATS problems found"],
  "tips": [
    {{"title": "short title", "detail": "specific actionable fix"}},
    {{"title": "short title", "detail": "specific actionable fix"}},
    {{"title": "short title", "detail": "specific actionable fix"}},
    {{"title": "short title", "detail": "specific actionable fix"}}
  ]
}}

Resume:
{resume_text}"""


async def _call_groq(resume_text: str) -> ATSResponse:
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Missing GROQ_API_KEY in environment.")

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
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user",   "content": _build_user_message(resume_text)},
                    ],
                    "temperature": 0.3,
                },
            )

        data = response.json()

        if "choices" not in data:
            print("Groq Error:", data)
            raise HTTPException(status_code=500, detail="LLM response error from Groq.")

        raw = data["choices"][0]["message"]["content"]
        raw = re.sub(r"```json|```", "", raw).strip()

        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=502, detail=f"Failed to parse AI response: {e}")

        return ATSResponse(
            overall_score=parsed["overall_score"],
            grade=_grade(parsed["overall_score"]),
            verdict=parsed["verdict"],
            scores={
                "formatting":  parsed["formatting"],
                "keywords":    parsed["keywords"],
                "sections":    parsed["sections"],
                "readability": parsed["readability"],
            },
            strengths=parsed.get("strengths", []),
            issues=parsed.get("issues", []),
            tips=[Tip(title=t["title"], detail=t["detail"]) for t in parsed.get("tips", [])],
        )

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request to Groq timed out.")
    except httpx.RequestError as e:
        print("HTTPX Error:", str(e))
        raise HTTPException(status_code=502, detail="Failed to reach Groq API.")
    except HTTPException:
        raise
    except Exception as e:
        print("ATS Error:", str(e))
        raise HTTPException(status_code=500, detail="Failed to process resume.")


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("/score-text", response_model=ATSResponse, summary="Score resume from plain text")
async def score_text(
    resume_text: str = Form(..., description="Plain text content of the resume"),
):
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="resume_text must not be empty.")
    return await _call_groq(resume_text)


@router.post("/score-file", response_model=ATSResponse, summary="Score resume from uploaded file")
async def score_file(
    file: UploadFile = File(..., description="Resume file (.pdf, .docx, or .txt)"),
):
    ext = (file.filename or "").rsplit(".", 1)[-1].lower()
    if ext not in ("pdf", "docx", "txt"):
        raise HTTPException(status_code=400, detail="Only .pdf, .docx, and .txt are supported.")

    contents = await file.read()

    if ext == "pdf":
        text = _extract_pdf(contents)
    elif ext == "docx":
        text = _extract_docx(contents)
    else:
        text = contents.decode("utf-8", errors="ignore")

    if not text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from the uploaded file.")

    return await _call_groq(text)