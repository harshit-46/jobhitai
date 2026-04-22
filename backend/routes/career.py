"""


# Career advisor last working 

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from data.career_data import career_data

router = APIRouter()

class CareerRequest(BaseModel):
    category: str | None = None
    compare_category: str | None = None


class AskRequest(BaseModel):
    question: str
    career: str

@router.post("/select")
async def select_career(data: CareerRequest):
    selected = data.category
    compare_selected = data.compare_category

    response = {
        "selected": selected,
        "data": None,
        "compare_selected": compare_selected,
        "compare_data": None
    }

    if selected:
        response["data"] = career_data.get(selected)

    if compare_selected and compare_selected != selected:
        response["compare_data"] = career_data.get(compare_selected)

    return response

@router.post("/ask")
async def ask(data: AskRequest):
    question = data.question.strip()
    career = data.career.strip()

    career_info = career_data.get(career)

    if not career_info:
        raise HTTPException(status_code=404, detail="Career not found.")

    answer = career_info["questions"].get(question)

    if not answer:
        raise HTTPException(
            status_code=404,
            detail="Answer not available for this question."
        )

    return {"answer": answer}

@router.get("/categories")
async def get_categories():
    return {"categories": list(career_data.keys())}


"""    


from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from data.career_data import career_data
import requests
import os
from dotenv import load_dotenv

router = APIRouter()


load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

class CareerRequest(BaseModel):
    category: str | None = None
    compare_category: str | None = None


class AskRequest(BaseModel):
    question: str
    career: str

@router.post("/select")
async def select_career(data: CareerRequest):
    selected = data.category
    compare_selected = data.compare_category

    response = {
        "selected": selected,
        "data": None,
        "compare_selected": compare_selected,
        "compare_data": None
    }

    if selected:
        response["data"] = career_data.get(selected)

    if compare_selected and compare_selected != selected:
        response["compare_data"] = career_data.get(compare_selected)

    return response

@router.post("/ask")
def ask_career(req: AskRequest):

    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Missing GROQ API Key")

    # ✅ Proper prompt
    prompt = f"""
You are an expert AI Career Advisor.

Career: {req.career}

User Question:
{req.question}

Give:
- Clear explanation
- Step-by-step roadmap
- Skills required
- Tools/technologies
- Keep it practical and concise
"""

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama3-70b-8192",
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7
            }
        )

        data = response.json()

        # 🔍 Debug safety
        if "choices" not in data:
            print("Groq Error:", data)
            raise HTTPException(status_code=500, detail="LLM response error")

        return {
            "answer": data["choices"][0]["message"]["content"]
        }

    except Exception as e:
        print("Error:", str(e))
        raise HTTPException(status_code=500, detail="Failed to fetch AI response")

@router.get("/categories")
async def get_categories():
    return {"categories": list(career_data.keys())}