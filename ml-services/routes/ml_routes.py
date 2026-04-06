from fastapi import APIRouter, UploadFile, File, Form
from services.ml_client import predict_resume, match_skills, match_job

router = APIRouter()

@router.post("/resume")
def resume_predict(resume: UploadFile = File(...)):
    return predict_resume(resume.file)


@router.post("/skills")
def skills_predict(skills: str = Form(...)):
    return match_skills(skills)


@router.post("/job")
def job_predict(
    resume: UploadFile = File(...),
    jobdesc: str = Form(...)
):
    return match_job(resume.file, jobdesc)