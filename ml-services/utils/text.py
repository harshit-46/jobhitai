"""

import pdfplumber
import io
import re

def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"\S+@\S+", "", text)
    text = re.sub(r"[^a-zA-Z ]", " ", text)
    return text

def extract_pdf_text(file_bytes):
    text = ""

    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text

    return clean_text(text)

"""


import re
import pdfplumber

def clean_text(text: str) -> str:
    if not text:
        return ""

    text = text.lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"\S+@\S+", "", text)
    text = re.sub(r"[^a-zA-Z ]", " ", text)
    return text


def extract_text(file) -> str:
    text = ""

    try:
        file.file.seek(0)  # IMPORTANT

        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text

    except Exception as e:
        print("PDF Error:", e)
        return ""

    return clean_text(text)