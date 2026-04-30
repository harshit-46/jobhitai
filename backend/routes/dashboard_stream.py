import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import AsyncIterator, Optional

from fastapi import APIRouter, Depends, Request
from sse_starlette.sse import EventSourceResponse   # pip install sse-starlette

# ── your existing helpers ────────────────────────────────────────────────────
from auth import get_current_user
from database import db

# ── re-use the query helpers from dashboard_router ──────────────────────────
from routes.dashboard_router import (
    _rel_time, _ACTION_META,
    StatsResponse, ActivityItem, ScoreBars, AiTip,
)

logger = logging.getLogger(__name__)
router = APIRouter()

# ─────────────────────────────────────────────────────────────────────────────
# In-process event bus
# One asyncio.Queue per connected user  (supports multiple tabs / devices)
# ─────────────────────────────────────────────────────────────────────────────

# { user_id_str: [queue, queue, ...] }
_connections: dict[str, list[asyncio.Queue]] = {}


async def emit_dashboard_event(user_id, event_type: str, payload: dict):
    """
    Call this from ANY other router to push a live update to the user's dashboard.

    Example — inside your ATS router after scoring completes:
        from dashboard_stream import emit_dashboard_event
        await emit_dashboard_event(current_user["_id"], "score_update", score_dict)
        await emit_dashboard_event(current_user["_id"], "stats_update", stats_dict)
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
# Snapshot helpers  (mirror logic from dashboard_router but returned as dicts)
# ─────────────────────────────────────────────────────────────────────────────

async def _snapshot_stats(uid) -> dict:
    resume_count = await db.resumes.count_documents({"user_id": uid})

    scores = await db.ats_results.find(
        {"user_id": uid}, sort=[("created_at", -1)], limit=2,
        projection={"overall_score": 1},
    ).to_list(length=2)

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
        {"user_id": uid}, sort=[("created_at", -1)],
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
    docs = await db.activity_log.find(
        {"user_id": uid}, sort=[("created_at", -1)], limit=limit,
        projection={"action_type": 1, "created_at": 1, "label_override": 1},
    ).to_list(length=limit)

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
    latest = await db.ats_results.find_one(
        {"user_id": uid}, sort=[("created_at", -1)],
        projection={"overall_score": 1, "keyword_score": 1, "skills_score": 1,
                    "impact_score": 1, "format_score": 1},
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
# SSE generator
# ─────────────────────────────────────────────────────────────────────────────

HEARTBEAT_INTERVAL = 25   # seconds — keeps Render's proxy alive


async def _event_generator(request: Request, uid: str) -> AsyncIterator[dict]:
    queue: asyncio.Queue = asyncio.Queue(maxsize=50)

    # Register this connection
    _connections.setdefault(uid, []).append(queue)
    logger.info("SSE connected: user=%s  connections=%d", uid, len(_connections[uid]))

    try:
        # ── 1. Push full snapshot immediately on connect ──────────────────
        stats, activity, score, tip = await asyncio.gather(
            _snapshot_stats(uid),
            _snapshot_activity(uid),
            _snapshot_score(uid),
            _snapshot_tip(uid),
        )
        yield {
            "event": "init",
            "data": json.dumps({
                "stats": stats,
                "activity": activity,
                "score": score,
                "ai_tip": tip,
            }),
        }

        # ── 2. Stream events + heartbeats until client disconnects ────────
        while True:
            if await request.is_disconnected():
                break

            try:
                # Wait up to HEARTBEAT_INTERVAL seconds for a queued event
                msg = await asyncio.wait_for(queue.get(), timeout=HEARTBEAT_INTERVAL)
                yield {
                    "event": msg["event"],
                    "data": json.dumps(msg["data"]),
                }
            except asyncio.TimeoutError:
                # No event arrived — send heartbeat
                yield {"event": "ping", "data": ""}

    except asyncio.CancelledError:
        pass
    finally:
        # Deregister on disconnect
        queues = _connections.get(uid, [])
        if queue in queues:
            queues.remove(queue)
        if not queues:
            _connections.pop(uid, None)
        logger.info("SSE disconnected: user=%s", uid)


# ─────────────────────────────────────────────────────────────────────────────
# Route
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/stream")
async def dashboard_stream(
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    """
    SSE endpoint. Client connects once and receives push events.
    Headers set by EventSourceResponse: Content-Type: text/event-stream
    """
    uid = str(current_user["_id"])
    return EventSourceResponse(
        _event_generator(request, uid),
        headers={
            # Required for CORS if your React dev server is on a different port
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",   # disable Nginx buffering on Render
        },
    )


# ─────────────────────────────────────────────────────────────────────────────
# Convenience: how to emit from other routers
# ─────────────────────────────────────────────────────────────────────────────
#
# ── After ATS analysis ───────────────────────────────────────────────────────
#
#   from dashboard_stream import emit_dashboard_event
#
#   # inside your ATS router, after saving results to MongoDB:
#   score_payload = {"overall": 82, "keywords": 88, "skills": 76, "impact": 82, "format": 92}
#   await emit_dashboard_event(uid, "score_update", score_payload)
#
#   stats_payload = await _snapshot_stats(uid)          # re-query
#   await emit_dashboard_event(uid, "stats_update", stats_payload)
#
#   await emit_dashboard_event(uid, "activity_update", {
#       "label": "Analysed Resume", "time": "just now",
#       "icon": "📊", "action_type": "ats_analysis"
#   })
#
# ── After resume upload ──────────────────────────────────────────────────────
#
#   await emit_dashboard_event(uid, "activity_update", {
#       "label": "Uploaded Resume", "time": "just now",
#       "icon": "📄", "action_type": "resume_created"
#   })
#   stats_payload = await _snapshot_stats(uid)
#   await emit_dashboard_event(uid, "stats_update", stats_payload)
#
# ── After category prediction ────────────────────────────────────────────────
#
#   await emit_dashboard_event(uid, "stats_update", await _snapshot_stats(uid))
#   await emit_dashboard_event(uid, "activity_update", {
#       "label": "Job Category Predicted", "time": "just now",
#       "icon": "🧠", "action_type": "category_pred"
#   })
#
# ── After AI tip is generated ────────────────────────────────────────────────
#
#   await emit_dashboard_event(uid, "tip_update", {
#       "tip": "Add 'Kubernetes' to boost score by ~9 pts.",
#       "action_label": "Fix now →",
#       "action_path": "/skill-matcher"
#   })