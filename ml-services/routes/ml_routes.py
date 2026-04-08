from fastapi import APIRouter, UploadFile, File, Form
from services.resume_classifier import predict_resume
#from services.job_match import calculate_match
from services.skills_matcher import match_skills

#job description
from utils.text import clean_text , extract_text
from services.job_match import calculate_similarity

router = APIRouter()

@router.post("/resume")
def resume_predict(resume: UploadFile = File(...)):
    return predict_resume(resume.file)


@router.post("/skills")
def skills_predict(skills: str = Form(...)):
    return match_skills(skills)



"""

# This is code for the job description matcher last working

@router.post("/resumejd")
async def resume_jd_predict(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    contents = await file.read()

    score = calculate_match(contents, job_description)

    print("score is : ",score)

    return {"score" : score}

"""


@router.post("/resumejd")
async def resume_jd_predict(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        jobdesc_clean = clean_text(job_description)
        resume_text = extract_text(file)

        if not resume_text.strip():
            return {
                "score": 0.0,
                "error": "Empty or invalid resume"
            }

        score = calculate_similarity(resume_text, jobdesc_clean)

        return {"score": float(score)}

    except Exception as e:
        print("ERROR:", e)
        return {"score": 0.0}