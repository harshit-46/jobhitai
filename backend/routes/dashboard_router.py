from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
from bson import ObjectId
from database import users_collection
from auth import get_current_user
from database import db

router = APIRouter()


# ─────────────────────────────────────────────────────────────────────────────
# Pydantic response models
# ─────────────────────────────────────────────────────────────────────────────

class StatsResponse(BaseModel):
    resume_count: int
    ats_score: Optional[float]
    ats_delta: Optional[float]
    best_category: Optional[str]
    improvement_pct: Optional[float]


class ActivityItem(BaseModel):
    label: str
    time: str
    icon: str
    action_type: str


class ScoreBars(BaseModel):
    keywords: int
    skills: int
    impact: int
    format: int
    overall: int


class AiTip(BaseModel):
    tip: str
    action_label: str
    action_path: str


class DashboardResponse(BaseModel):
    stats: StatsResponse
    activity: list[ActivityItem]
    score: Optional[ScoreBars]
    ai_tip: Optional[AiTip]


# ─────────────────────────────────────────────────────────────────────────────
# Helper: human-readable relative time
# ─────────────────────────────────────────────────────────────────────────────

def _rel_time(dt: datetime) -> str:
    now = datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    diff = int((now - dt).total_seconds())
    if diff < 60:
        return "just now"
    if diff < 3600:
        m = diff // 60
        return f"{m} min ago"
    if diff < 86400:
        h = diff // 3600
        return f"{h} hr ago"
    if diff < 172800:
        return "Yesterday"
    return dt.strftime("%b %d")


# ─────────────────────────────────────────────────────────────────────────────
# Action meta — every action_type used anywhere in the app must be here
# ─────────────────────────────────────────────────────────────────────────────

_ACTION_META = {
    # resume upload (resume_upload.py)
    "resume_uploaded":    {"icon": "📄", "label": "Uploaded New Resume"},
    "resume_deleted":     {"icon": "🗑️", "label": "Deleted a Resume"},

    # resume builder (resume_builder.py)
    "resume_created":     {"icon": "✍️", "label": "Created New Resume"},
    "resume_update":      {"icon": "✏️", "label": "Updated Resume"},

    # ATS / skill matcher (ml_routes.py)
    "ats_analysis":       {"icon": "📊", "label": "Analysed Resume"},
    "skill_match":        {"icon": "🎯", "label": "Ran Skill Matcher"},

    # resume scanner (resume_scanner.py)
    "resume_scanned":     {"icon": "🔍", "label": "Scanned Resume"},

    # job category predictor (ml_routes.py)
    "category_pred":      {"icon": "🧠", "label": "Job Category Predicted"},

    # career advisor (career.py)
    "career_advice":      {"icon": "💬", "label": "Asked Career Advisor"},

    # AI features (resume_builder.py)
    "ai_suggestion":      {"icon": "🤖", "label": "Used AI Feature"},

    # job match (future)
    "job_match":          {"icon": "🎯", "label": "New Job Match Found"},
}


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/dashboard/stats
# NOTE: resumes collection stores user_id as STRING — query accordingly
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/stats", response_model=StatsResponse)
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    db_user = await users_collection.find_one({"email": current_user["sub"]})
    if not db_user:
        raise HTTPException(404, "User not found")

    uid_obj = db_user["_id"]          # ObjectId — for ats_results, category_predictions
    uid_str = str(uid_obj)            # string   — for resumes collection

    # resumes stores user_id as string
    resume_count = await db.resumes.count_documents({"user_id": uid_str})

    # ats_results stores user_id as ObjectId
    scores = await db.ats_results.find(
        {"user_id": uid_obj},
        projection={"overall_score": 1},
    ).sort("created_at", -1).limit(2).to_list(length=2)

    ats_score = round(scores[0]["overall_score"], 1) if scores else None
    ats_delta = None
    improvement_pct = None

    if len(scores) == 2:
        ats_delta = round(scores[0]["overall_score"] - scores[1]["overall_score"], 1)
        if scores[1]["overall_score"] > 0:
            improvement_pct = round(
                (ats_delta / scores[1]["overall_score"]) * 100, 1
            )

    latest_pred = await db.category_predictions.find_one(
        {"user_id": uid_obj},
        sort=[("created_at", -1)],
        projection={"predicted_category": 1},
    )
    best_category = latest_pred["predicted_category"] if latest_pred else None

    return StatsResponse(
        resume_count=resume_count,
        ats_score=ats_score,
        ats_delta=ats_delta,
        best_category=best_category,
        improvement_pct=improvement_pct,
    )


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/dashboard/activity
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/activity", response_model=list[ActivityItem])
async def get_recent_activity(
    limit: int = 6,
    current_user: dict = Depends(get_current_user),
):
    db_user = await users_collection.find_one({"email": current_user["sub"]})
    if not db_user:
        raise HTTPException(404, "User not found")

    uid_obj = db_user["_id"]

    docs = await db.activity_log.find(
        {"user_id": uid_obj},
        projection={"action_type": 1, "created_at": 1, "label_override": 1},
    ).sort("created_at", -1).limit(limit).to_list(length=limit)

    items = []
    for doc in docs:
        meta = _ACTION_META.get(
            doc["action_type"],
            {"icon": "📌", "label": doc["action_type"]}  # fallback: show raw type
        )
        items.append(ActivityItem(
            label=doc.get("label_override") or meta["label"],
            time=_rel_time(doc["created_at"]),
            icon=meta["icon"],
            action_type=doc["action_type"],
        ))
    return items


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/dashboard/score
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/score", response_model=Optional[ScoreBars])
async def get_score_breakdown(current_user: dict = Depends(get_current_user)):
    db_user = await users_collection.find_one({"email": current_user["sub"]})
    if not db_user:
        raise HTTPException(404, "User not found")

    uid_obj = db_user["_id"]

    latest = await db.ats_results.find_one(
        {"user_id": uid_obj},
        sort=[("created_at", -1)],
        projection={
            "overall_score": 1,
            "keyword_score": 1,
            "skills_score":  1,
            "impact_score":  1,
            "format_score":  1,
        },
    )
    if not latest:
        return None

    return ScoreBars(
        overall=int(latest.get("overall_score", 0)),
        keywords=int(latest.get("keyword_score", 0)),
        skills=int(latest.get("skills_score",   0)),
        impact=int(latest.get("impact_score",   0)),
        format=int(latest.get("format_score",   0)),
    )


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/dashboard/ai-tip
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/ai-tip", response_model=Optional[AiTip])
async def get_ai_tip(current_user: dict = Depends(get_current_user)):
    db_user = await users_collection.find_one({"email": current_user["sub"]})
    if not db_user:
        raise HTTPException(404, "User not found")

    uid_obj = db_user["_id"]

    tip_doc = await db.ai_tips.find_one(
        {"user_id": uid_obj, "actioned": {"$ne": True}},
        sort=[("created_at", -1)],
        projection={"tip": 1, "action_label": 1, "action_path": 1},
    )
    if not tip_doc:
        return None

    return AiTip(
        tip=tip_doc["tip"],
        action_label=tip_doc.get("action_label", "Fix now →"),
        action_path=tip_doc.get("action_path", "/skill-matcher"),
    )


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/dashboard/activity
# ─────────────────────────────────────────────────────────────────────────────

class LogActivityRequest(BaseModel):
    action_type: str
    label_override: Optional[str] = None


@router.post("/activity", status_code=201)
async def log_activity(
    body: LogActivityRequest,
    current_user: dict = Depends(get_current_user),
):
    if body.action_type not in _ACTION_META:
        raise HTTPException(400, f"Unknown action_type '{body.action_type}'")

    db_user = await users_collection.find_one({"email": current_user["sub"]})
    if not db_user:
        raise HTTPException(404, "User not found")

    await db.activity_log.insert_one({
        "user_id":        db_user["_id"],
        "action_type":    body.action_type,
        "label_override": body.label_override,
        "created_at":     datetime.now(timezone.utc),
    })
    return {"ok": True}