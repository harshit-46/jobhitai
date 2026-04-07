"""

# Job description matcher

from fastapi import APIRouter, UploadFile, File, Form
import pdfplumber
import re
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

router = APIRouter()

# Load model once
model = SentenceTransformer('all-MiniLM-L6-v2')


# ---------------- CLEAN ----------------
def clean_text(text):
    text = text.lower()
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'\S+@\S+', '', text)
    text = re.sub(r'[^a-zA-Z ]', ' ', text)
    return text


# ---------------- PDF ----------------
def extract_text(file):
    text = ""

    try:
        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text
    except Exception as e:
        print("PDF Error:", e)
        return ""

    return clean_text(text)


# ---------------- KEYWORD ----------------
def keyword_overlap(resume, job):
    resume_words = set(resume.split())
    job_words = set(job.split())

    if len(job_words) == 0:
        return 0

    return len(resume_words.intersection(job_words)) / len(job_words)


# ---------------- SCORE ----------------
def calculate_similarity(resume, job):
    embeddings = model.encode([resume, job])

    semantic_score = cosine_similarity(
        [embeddings[0]], [embeddings[1]]
    )[0][0]

    keyword_score = keyword_overlap(resume, job)

    final_score = (0.7 * semantic_score) + (0.3 * keyword_score)

    return min(82, round(final_score * 100, 2) + 30)


# ---------------- API ----------------
@router.post("/match")
async def match_job(
    resume: UploadFile = File(...),
    jobdesc: str = Form(...)
):
    try:
        jobdesc = clean_text(jobdesc)
        resume_text = extract_text(resume)

        score = calculate_similarity(resume_text, jobdesc)

        return {"score": float(score)}

    except Exception as e:
        print("ERROR:", e)
        return {"score": float(score)}


"""


'''

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from utils.text import clean_text, extract_pdf_text

model = SentenceTransformer('all-MiniLM-L6-v2')

def keyword_overlap(resume, job):
    resume_words = set(resume.split())
    job_words = set(job.split())

    if len(job_words) == 0:
        return 0

    return len(resume_words & job_words) / len(job_words)

def calculate_match(resume_file, jobdesc):
    jobdesc = clean_text(jobdesc)
    resume_text = extract_pdf_text(resume_file)

    emb = model.encode([resume_text, jobdesc])
    semantic = cosine_similarity([emb[0]], [emb[1]])[0][0]
    keyword = keyword_overlap(resume_text, jobdesc)

    score = (0.7 * semantic) + (0.3 * keyword)

    return min(82, round(score * 100, 2) + 30)

'''

import re
from utils.text import extract_pdf_text

def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"\S+@\S+", "", text)
    text = re.sub(r"[^a-zA-Z ]", " ", text)
    return text

def keyword_overlap(resume, job):
    resume_words = set(resume.split())
    job_words = set(job.split())

    if len(job_words) == 0:
        return 0

    return len(resume_words & job_words) / len(job_words)

def calculate_match(resume_file, jobdesc):
    jobdesc = clean_text(jobdesc)
    resume_text = extract_pdf_text(resume_file)

    score = keyword_overlap(resume_text, jobdesc)

    return round(score * 100, 2)