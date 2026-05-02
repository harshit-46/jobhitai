import asyncio
import json
import logging
import os
from datetime import datetime, timezone
from typing import AsyncIterator, Optional

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Request
from sse_starlette.sse import EventSourceResponse

from auth import get_current_user
from database import db, users_collection

from routes.dashboard_router import (
    _rel_time, _ACTION_META,
    StatsResponse, ActivityItem, ScoreBars, AiTip,
)

logger = logging.getLogger(__name__)
router = APIRouter()

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://careercrafter.online")

# ─────────────────────────────────────────────────────────────────────────────
# In-process event bus
# { user_id_str: [queue, queue, ...] }
# ─────────────────────────────────────────────────────────────────────────────

_connections: dict[str, list[asyncio.Queue]] = {}


async def emit_dashboard_event(user_id, event_type: str, payload: dict):
    """
    Call from any other router to push a live update to the user's dashboard.
    Pass db_user["_id"] (ObjectId) as user_id.
    """
    uid = str(user_id)
    queues = _connections.get(uid, [])
    message = {"event": event_type, "data": payload}
    dead = []
    for q in queues:
        try:
            q.put_nowait(message)
        except asyncio.QueueFull:
            dead.append(q)
    for q in dead:
        queues.remove(q)


# ─────────────────────────────────────────────────────────────────────────────
# Helper: resolve ObjectId from JWT payload
# ─────────────────────────────────────────────────────────────────────────────

async def _get_uid(current_user: dict) -> ObjectId:
    """Returns ObjectId — never a string."""
    db_user = await users_collection.find_one({"email": current_user["sub"]})
    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")
    return db_user["_id"]  # ObjectId


def _to_object_id(uid) -> ObjectId:
    """Ensure uid is always an ObjectId regardless of what was passed in."""
    if isinstance(uid, ObjectId):
        return uid
    return ObjectId(str(uid))


# ─────────────────────────────────────────────────────────────────────────────
# Snapshot helpers — always receive and query with ObjectId
# ─────────────────────────────────────────────────────────────────────────────

async def _snapshot_stats(uid) -> dict:
    uid = _to_object_id(uid)
    uid_str = str(uid)

    resume_count = await db.resumes.count_documents({"user_id": uid_str})

    scores = await db.ats_results.find(
        {"user_id": uid},
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

    pred = await db.category_predictions.find_one(
        {"user_id": uid},
        sort=[("created_at", -1)],
        projection={"predicted_category": 1},
    )

    return StatsResponse(
        resume_count=resume_count,
        ats_score=ats_score,
        ats_delta=ats_delta,
        best_category=pred["predicted_category"] if pred else None,
        improvement_pct=improvement_pct,
    ).model_dump()


async def _snapshot_activity(uid, limit=6) -> list[dict]:
    uid = _to_object_id(uid)

    docs = await db.activity_log.find(
        {"user_id": uid},
        projection={"action_type": 1, "created_at": 1, "label_override": 1},
    ).sort("created_at", -1).limit(limit).to_list(length=limit)

    items = []
    for doc in docs:
        meta = _ACTION_META.get(doc["action_type"], {"icon": "📌", "label": doc["action_type"]})
        items.append(ActivityItem(
            label=doc.get("label_override") or meta["label"],
            time=_rel_time(doc["created_at"]),
            icon=meta["icon"],
            action_type=doc["action_type"],
        ).model_dump())
    return items


async def _snapshot_score(uid) -> Optional[dict]:
    uid = _to_object_id(uid)

    latest = await db.ats_results.find_one(
        {"user_id": uid},
        sort=[("created_at", -1)],
        projection={
            "overall_score": 1,
            "keyword_score": 1,
            "skills_score": 1,
            "impact_score": 1,
            "format_score": 1,
        },
    )
    if not latest:
        return None
    return ScoreBars(
        overall=int(latest.get("overall_score", 0)),
        keywords=int(latest.get("keyword_score", 0)),
        skills=int(latest.get("skills_score", 0)),
        impact=int(latest.get("impact_score", 0)),
        format=int(latest.get("format_score", 0)),
    ).model_dump()


async def _snapshot_tip(uid) -> Optional[dict]:
    uid = _to_object_id(uid)

    doc = await db.ai_tips.find_one(
        {"user_id": uid, "actioned": {"$ne": True}},
        sort=[("created_at", -1)],
        projection={"tip": 1, "action_label": 1, "action_path": 1},
    )
    if not doc:
        return None
    return AiTip(
        tip=doc["tip"],
        action_label=doc.get("action_label", "Fix now →"),
        action_path=doc.get("action_path", "/skill-matcher"),
    ).model_dump()


# ─────────────────────────────────────────────────────────────────────────────
# SSE generator — passes ObjectId to all snapshot functions
# ─────────────────────────────────────────────────────────────────────────────

HEARTBEAT_INTERVAL = 25  # seconds — stays under Render's 55s idle timeout


async def _event_generator(request: Request, uid_obj: ObjectId) -> AsyncIterator[dict]:
    """uid_obj is always an ObjectId here."""
    queue: asyncio.Queue = asyncio.Queue(maxsize=50)
    uid_str = str(uid_obj)

    _connections.setdefault(uid_str, []).append(queue)
    logger.info("SSE connected: user=%s  open_connections=%d", uid_str, len(_connections[uid_str]))

    try:
        # 1. Push full snapshot immediately on connect
        stats, activity, score, tip = await asyncio.gather(
            _snapshot_stats(uid_obj),
            _snapshot_activity(uid_obj),
            _snapshot_score(uid_obj),
            _snapshot_tip(uid_obj),
        )

        logger.info("SSE init snapshot: stats=%s activity_count=%d score=%s",
                    stats, len(activity), score)

        yield {
            "event": "init",
            "data": json.dumps({
                "stats":    stats,
                "activity": activity,
                "score":    score,
                "ai_tip":   tip,
            }),
        }

        # 2. Stream queued events + heartbeats until client disconnects
        while True:
            if await request.is_disconnected():
                break

            try:
                msg = await asyncio.wait_for(queue.get(), timeout=HEARTBEAT_INTERVAL)
                yield {
                    "event": msg["event"],
                    "data":  json.dumps(msg["data"]),
                }
            except asyncio.TimeoutError:
                yield {"event": "ping", "data": ""}

    except asyncio.CancelledError:
        pass
    finally:
        queues = _connections.get(uid_str, [])
        if queue in queues:
            queues.remove(queue)
        if not queues:
            _connections.pop(uid_str, None)
        logger.info("SSE disconnected: user=%s", uid_str)


# ─────────────────────────────────────────────────────────────────────────────
# Route
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/stream")
async def dashboard_stream(
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    uid_obj = await _get_uid(current_user)  # ObjectId
    logger.info("SSE request: email=%s uid=%s", current_user["sub"], uid_obj)

    return EventSourceResponse(
        _event_generator(request, uid_obj),  # pass ObjectId, not string
        headers={
            "Access-Control-Allow-Origin":  FRONTEND_URL,
            "Access-Control-Allow-Credentials": "true",
            "Cache-Control":   "no-cache",
            "X-Accel-Buffering": "no",
        },
    )