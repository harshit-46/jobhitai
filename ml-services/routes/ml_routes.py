from fastapi import APIRouter, UploadFile, File, Form
from services.resume_classifier import predict_resume
from services.job_match import calculate_match
from services.skills_matcher import match_skills

router = APIRouter()

@router.post("/resume")
def resume_predict(resume: UploadFile = File(...)):
    return predict_resume(resume.file)


@router.post("/skills")
def skills_predict(skills: str = Form(...)):
    return match_skills(skills)


@router.post("/resumejd")
async def resume_jd_predict(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    contents = await file.read()

    return calculate_match(contents, job_description)