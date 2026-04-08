import requests

ML_URL = "https://jobhitai-ml-service.onrender.com"

def predict_resume(file):
    res = requests.post(
        f"{ML_URL}/predict/resume",
        files={"resume": file},
        timeout=10
    )
    return res.json()


def match_skills(skills):
    res = requests.post(
        f"{ML_URL}/predict/skills",
        data={"skills": skills},
        timeout=10
    )
    return res.json()


def match_job(file, job_description):
    res = requests.post(
        f"{ML_URL}/api/ml/resumejd",
        files={"file": file},
        data={"job_description": job_description},
        timeout=10
    )
    return res.json()