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


def match_job(file, jobdesc):
    res = requests.post(
        f"{ML_URL}/predict/job",
        files={"resume": file},
        data={"jobdesc": jobdesc},
        timeout=10
    )
    return res.json()