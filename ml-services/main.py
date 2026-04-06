from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from services import resume_classifier, skill_matcher, job_matcher, career
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "ML Service Running 🚀"}

# ---------------- RESUME ----------------
@app.post("/predict/resume")
def predict_resume(resume: UploadFile = File(...)):
    result = resume_classifier.predict_resume(resume)
    return {"role": result}

# ---------------- SKILLS ----------------
@app.post("/predict/skills")
def predict_skills(skills: str = Form(...)):
    roles, scores = skill_matcher.match_skills(skills)

    return {
        "best_role": roles[0],
        "confidence": scores[0],
        "others": [
            {"role": r, "confidence": s}
            for r, s in zip(roles[1:], scores[1:])
        ]
    }

# ---------------- JOB MATCH ----------------
@app.post("/predict/job")
def match_job(resume: UploadFile = File(...), jobdesc: str = Form(...)):
    score = job_matcher.calculate_match(resume, jobdesc)
    return {"score": float(score)}

# ---------------- CAREER ----------------
@app.get("/career/categories")
def categories():
    return {"categories": career.get_categories()}

@app.post("/career/info")
def info(name: str):
    return career.get_career_info(name)

@app.post("/career/ask")
def ask(career_name: str, question: str):
    ans = career.get_answer(career_name, question)

    if not ans:
        raise HTTPException(status_code=404, detail="Not found")

    return {"answer": ans}