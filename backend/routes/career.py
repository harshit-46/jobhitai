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

    prompt = f # three double quotes will appear here
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

    # and here

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.3-70b-versatile",
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


"""






# routers/career_advisor.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from data.career_data import career_data
import httpx
import os
from dotenv import load_dotenv

router = APIRouter()

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"

# ── Intent patterns ────────────────────────────────────────────────────────────

INTENT_PATTERNS = {
    "greeting": [
        "hi", "hello", "hey", "hii", "helo", "good morning", "good evening",
        "good afternoon", "what's up", "whats up", "sup", "howdy", "greetings",
        "namaste", "how are you", "how r u", "who are you", "what are you",
        "what can you do", "help me", "can you help"
    ],
    "roadmap": [
        "roadmap", "how to start", "how do i start", "where to begin", "learning path",
        "step by step", "guide", "plan", "path", "get started", "begin", "journey"
    ],
    "salary": [
        "salary", "pay", "package", "ctc", "lpa", "stipend", "earn", "income",
        "compensation", "how much", "money"
    ],
    "skills": [
        "skills", "skill", "what to learn", "technologies", "tools", "tech stack",
        "requirements", "must know", "should know", "knowledge"
    ],
    "comparison": [
        "vs", "versus", "compare", "difference between", "better", "which is",
        "or ", "switch", "move from"
    ],
    "interview": [
        "interview", "question", "asked in", "crack", "prepare", "preparation",
        "hiring", "selection", "round"
    ],
    "fresher": [
        "fresher", "fresh graduate", "no experience", "first job", "entry level",
        "college", "campus", "placement", "beginner", "student", "0 experience"
    ],
    "definition": [
        "what is", "what are", "explain", "define", "meaning of", "tell me about",
        "describe", "how does", "why is"
    ],
}

def detect_intent(question: str) -> str:
    q = question.lower().strip()
    for intent, keywords in INTENT_PATTERNS.items():
        if any(kw in q for kw in keywords):
            return intent
    return "general"


# ── Greeting — handled locally, no LLM call needed ────────────────────────────

GREETING_RESPONSE = """Hey there! 👋 I'm your AI Career Advisor on **JobHitAI**.

I can help you with:
- 🗺️ **Roadmaps** — step-by-step learning paths for any tech career
- 💰 **Salaries** — fresher to senior pay ranges in the Indian market
- 🛠️ **Skills** — what to learn and where to learn it
- 🎯 **Interview prep** — commonly asked questions and tips
- 🆚 **Comparisons** — which career/tech suits you better
- 💡 **Concepts** — clear explanations of any technical topic

Just select a career and ask me anything. What would you like to know?"""


# ── Career context builder ─────────────────────────────────────────────────────

def build_career_context(career: str) -> str:
    data = career_data.get(career, {})
    if not data:
        return ""

    skills = ", ".join(data.get("skills", []))
    salary = data.get("salary", "")
    description = data.get("description", "")

    roadmap = data.get("roadmap", {})
    roadmap_text = ""
    for level, steps in roadmap.items():
        roadmap_text += f"\n  {level}: {', '.join(steps)}"

    questions = data.get("questions", {})
    qa_text = ""
    for q, a in list(questions.items())[:3]:
        qa_text += f"\n  Q: {q}\n  A: {a[:120]}...\n"

    return f"""
CAREER PROFILE — {career}
- Description: {description}
- Salary range (India): {salary}
- Core skills: {skills}
- Roadmap:{roadmap_text}
- Sample Q&A:{qa_text}
"""


# ── Intent instruction builder ─────────────────────────────────────────────────

def build_intent_instruction(intent: str, career: str) -> str:
    instructions = {
        "roadmap": f"""The user wants a learning roadmap for {career}.
Respond with:
1. A clear Beginner → Intermediate → Advanced progression
2. Specific resources or tools at each stage
3. Realistic time estimates for an Indian fresher
4. Top 2-3 mistakes to avoid when starting out""",

        "salary": f"""The user is asking about salary for {career} in India.
Respond with:
1. Fresher salary range (0-2 years experience)
2. Mid-level salary range (2-5 years)
3. Senior-level salary range (5+ years)
4. Top companies hiring for this role in India and their pay bands
5. Skills that increase salary the most""",

        "skills": f"""The user wants to know what skills to learn for {career}.
Respond with:
1. Must-have technical skills (ranked by importance)
2. Good-to-have skills that differentiate candidates
3. Soft skills that matter for this specific role
4. Free/affordable resources to learn each skill""",

        "comparison": f"""The user is comparing {career} with something else.
Respond with:
1. Key differences in day-to-day work
2. Salary comparison in the Indian market
3. Which is better suited for freshers
4. Long-term career growth for each
5. An honest recommendation based on the question""",

        "interview": f"""The user wants interview preparation help for {career}.
Respond with:
1. Most commonly asked technical questions with brief answers
2. Round-by-round breakdown (online test → technical → HR)
3. Topics to focus on for the Indian hiring process
4. One underrated tip most candidates miss""",

        "fresher": f"""The user is a fresher or student asking about {career}.
Respond with:
1. Realistic first step to take this week
2. What to build for a strong portfolio/resume as a fresher
3. Where to apply in India (job boards, companies, internships)
4. Common mistakes freshers make and how to avoid them
5. Timeline: how long to land a first job with consistent effort""",

        "definition": f"""The user wants a clear explanation of a concept related to {career}.
Respond with:
1. Simple, jargon-free definition (2-3 sentences)
2. Real-world analogy to make it memorable
3. Why it matters specifically for a {career}
4. A practical tip or common mistake related to this concept""",

        "general": f"""The user has a general question about {career}.
Respond with:
1. A direct, accurate answer to their specific question
2. Context relevant to the Indian job market where applicable
3. A practical next step or actionable tip
Keep it concise and specific — avoid generic advice.""",
    }
    return instructions.get(intent, instructions["general"])


# ── Prompt builder ─────────────────────────────────────────────────────────────

def build_prompt(question: str, career: str) -> tuple[str, str]:
    intent = detect_intent(question)
    career_context = build_career_context(career)
    intent_instruction = build_intent_instruction(intent, career)

    system_prompt = f"""You are an expert AI Career Advisor on JobHitAI, a platform for fresh graduates and students in India.

You have deep knowledge of the Indian tech job market — including top companies (TCS, Infosys, Wipro, Flipkart, Zomato, startups, MNCs), placement processes, salary trends, and skill demand.

RULES:
- Be specific and actionable. Never give vague or generic answers.
- Tailor every answer to the Indian fresher/student context unless stated otherwise.
- Use bullet points or numbered lists for clarity.
- Be honest — if a career path is hard, say so and explain how to overcome it.
- Never hallucinate company names, salary figures, or tool names.
- Keep responses concise but complete — no unnecessary filler.

{career_context}

RESPONSE INSTRUCTION (based on what the user is asking):
{intent_instruction}"""

    user_message = f"Career: {career}\n\nQuestion: {question}"
    return system_prompt, user_message


# ── Pydantic models ────────────────────────────────────────────────────────────

class CareerRequest(BaseModel):
    category: str | None = None
    compare_category: str | None = None

class AskRequest(BaseModel):
    question: str
    career: str


# ── Routes ─────────────────────────────────────────────────────────────────────

@router.post("/select")
async def select_career(data: CareerRequest):
    response = {
        "selected": data.category,
        "data": None,
        "compare_selected": data.compare_category,
        "compare_data": None
    }
    if data.category:
        response["data"] = career_data.get(data.category)
    if data.compare_category and data.compare_category != data.category:
        response["compare_data"] = career_data.get(data.compare_category)
    return response


@router.post("/ask")
async def ask_career(req: AskRequest):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Missing GROQ API Key")

    intent = detect_intent(req.question)

    # Greetings are handled locally — no LLM call, instant response
    if intent == "greeting":
        return {"answer": GREETING_RESPONSE, "intent": "greeting"}

    system_prompt, user_message = build_prompt(req.question, req.career)

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                GROQ_URL,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": GROQ_MODEL,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user",   "content": user_message}
                    ],
                    "temperature": 0.7
                }
            )

        data = response.json()

        if "choices" not in data:
            print("Groq Error:", data)
            raise HTTPException(status_code=500, detail="LLM response error")

        return {
            "answer": data["choices"][0]["message"]["content"],
            "intent": intent
        }

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request to AI service timed out.")
    except httpx.RequestError as e:
        print("HTTPX Error:", str(e))
        raise HTTPException(status_code=502, detail="Failed to reach AI service.")
    except HTTPException:
        raise
    except Exception as e:
        print("Error:", str(e))
        raise HTTPException(status_code=500, detail="Failed to fetch AI response")


@router.get("/categories")
async def get_categories():
    return {"categories": list(career_data.keys())}