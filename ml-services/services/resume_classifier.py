"""

# Role classifer

from fastapi import APIRouter, UploadFile, File
import pickle
import pdfplumber
import re

router = APIRouter()

label_map = {
    0: "Web Developer",
    1: "Data Scientist",
    2: "DevOps Engineer",
    3: "HR",
    4: "Business Analyst"
}

# ---------------- LOAD MODELS ----------------
clf = pickle.load(open("models/clf.pkl", "rb"))
tfidf = pickle.load(open("models/tfidf.pkl", "rb"))

# ---------------- CLEAN TEXT ----------------
def clean_text(text):
    text = text.lower()
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'\S+@\S+', '', text)
    text = re.sub(r'[^a-zA-Z ]', ' ', text)
    return text

# ---------------- EXTRACT PDF ----------------
def extract_text(file):
    text = ""

    with pdfplumber.open(file.file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text

    return clean_text(text)

# ---------------- API ----------------
@router.post("/predict")
async def predict_resume(resume: UploadFile = File(...)):
    try:
        resume_text = extract_text(resume)

        vec = tfidf.transform([resume_text])
        pred = clf.predict(vec)[0]

        return {
            "prediction": label_map.get(pred , "unknown role")  # ✅ important
        }

    except Exception as e:
        print("ERROR:", e)
        return {
            "prediction": "Error processing resume"
        }

"""


'''
import pickle
from utils.text import extract_pdf_text

clf = pickle.load(open("models/clf.pkl", "rb"))
tfidf = pickle.load(open("models/tfidf.pkl", "rb"))

label_map = {
    0: "Web Developer",
    1: "Data Scientist",
    2: "DevOps Engineer",
    3: "HR",
    4: "Business Analyst"
}

def predict_resume(file):
    text = extract_pdf_text(file)
    vec = tfidf.transform([text])
    pred = clf.predict(vec)[0]

    return label_map.get(pred, "unknown role")

'''



import pickle
from utils.text import extract_text

clf = None
tfidf = None

label_map = {
    0: "Web Developer",
    1: "Data Scientist",
    2: "DevOps Engineer",
    3: "HR",
    4: "Business Analyst"
}

def load_models():
    global clf, tfidf
    if clf is None or tfidf is None:
        clf = pickle.load(open("models/clf.pkl", "rb"))
        tfidf = pickle.load(open("models/tfidf.pkl", "rb"))

def predict_resume(file):
    load_models()
    text = extract_text(file)
    vec = tfidf.transform([text])
    pred = clf.predict(vec)[0]

    return label_map.get(pred, "Unknown Role")