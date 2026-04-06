
"""

# Career advisor

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




from data.career_data import career_data

def get_categories():
    return list(career_data.keys())

def get_career_info(name):
    return career_data.get(name)

def get_answer(career, question):
    career_info = career_data.get(career)
    if not career_info:
        return None

    return career_info["questions"].get(question)