import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const API = import.meta.env.VITE_API_URL;

// ── Tokens ────────────────────────────────────────────────────────────────────
const BG      = "#0a0a0e";
const SURFACE  = "rgba(255,255,255,0.03)";
const SURFACE2 = "rgba(255,255,255,0.055)";
const BORDER   = "rgba(255,255,255,0.07)";
const BORDER2  = "rgba(255,255,255,0.12)";
const TEXT     = "#f0ede8";
const MUTED    = "rgba(240,237,232,0.45)";
const FAINT    = "rgba(240,237,232,0.22)";
const ACCENT   = "#E8FF47";
const GREEN    = "#86efac";
const GOLD     = "#fcd34d";
const PINK     = "#f9a8d4";
const BLUE     = "#93c5fd";

// ── Action type config ────────────────────────────────────────────────────────
const ACTION_CONFIG = {
    resume_uploaded:  { color: ACCENT, dot: ACCENT,  label: "Uploaded New Resume",      icon: "📄" },
    resume_deleted:   { color: PINK,   dot: PINK,    label: "Deleted a Resume",          icon: "🗑️" },
    resume_created:   { color: ACCENT, dot: ACCENT,  label: "Created New Resume",        icon: "✍️" },
    resume_update:    { color: GOLD,   dot: GOLD,    label: "Updated Resume",            icon: "✏️" },
    ats_analysis:     { color: GREEN,  dot: GREEN,   label: "Analysed Resume",           icon: "📊" },
    resume_scanned:   { color: BLUE,   dot: BLUE,    label: "Scanned Resume",            icon: "🔍" },
    skill_match:      { color: PINK,   dot: PINK,    label: "Ran Skill Matcher",         icon: "🎯" },
    category_pred:    { color: GOLD,   dot: GOLD,    label: "Job Category Predicted",    icon: "🧠" },
    career_advice:    { color: GREEN,  dot: GREEN,   label: "Asked Career Advisor",      icon: "💬" },
    ai_suggestion:    { color: ACCENT, dot: ACCENT,  label: "Used AI Feature",           icon: "🤖" },
    job_match:        { color: PINK,   dot: PINK,    label: "New Job Match Found",       icon: "🎯" },
};

const FILTERS = [
    { key: "all",           label: "All" },
    { key: "resume",        label: "Resumes",  types: ["resume_uploaded", "resume_created", "resume_update", "resume_deleted", "resume_scanned"] },
    { key: "ai",            label: "AI",       types: ["ats_analysis", "ai_suggestion", "category_pred", "career_advice"] },
    { key: "skills",        label: "Skills",   types: ["skill_match", "job_match"] },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,800;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  @keyframes fadeUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes spin      { to{transform:rotate(360deg)} }
  @keyframes slideIn   { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }

  .fade-up { animation: fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .slide-in { animation: slideIn 0.35s cubic-bezier(0.22,1,0.36,1) both; }

  .activity-row {
    transition: background 0.15s;
    cursor: default;
  }
  .activity-row:hover {
    background: rgba(255,255,255,0.04) !important;
  }

  .filter-btn {
    transition: all 0.15s;
    cursor: pointer;
  }
  .filter-btn:hover {
    border-color: rgba(255,255,255,0.2) !important;
    color: #f0ede8 !important;
  }

  .skeleton {
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite;
    border-radius: 6px;
  }
`;

// ── Skeleton row ──────────────────────────────────────────────────────────────
function SkeletonRow({ delay = 0 }) {
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "14px 20px",
            borderBottom: `1px solid ${BORDER}`,
            animationDelay: `${delay}s`,
        }} className="fade-up">
            <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0 }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
                <div className="skeleton" style={{ height: 12, width: "45%" }} />
                <div className="skeleton" style={{ height: 10, width: "25%" }} />
            </div>
            <div className="skeleton" style={{ height: 10, width: 60 }} />
            <div className="skeleton" style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0 }} />
        </div>
    );
}

// ── Activity row ──────────────────────────────────────────────────────────────
function ActivityRow({ item, index }) {
    const cfg = ACTION_CONFIG[item.action_type] || {
        color: FAINT, dot: FAINT, label: item.action_type, icon: "📌"
    };

    return (
        <div
            className="activity-row fade-up"
            style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 20px",
                borderBottom: `1px solid ${BORDER}`,
                animationDelay: `${index * 0.04}s`,
                position: "relative",
            }}
        >
            {/* Left accent line */}
            <div style={{
                position: "absolute", left: 0, top: "20%", bottom: "20%",
                width: 2, borderRadius: 1,
                background: cfg.color,
                opacity: 0.5,
            }} />

            {/* Icon */}
            <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15,
                background: `${cfg.color}11`,
                border: `1px solid ${cfg.color}28`,
            }}>
                {cfg.icon}
            </div>

            {/* Label + type badge */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: 13, color: TEXT, fontWeight: 500,
                    marginBottom: 4, fontFamily: "'DM Sans', sans-serif",
                }}>
                    {item.label}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                        fontSize: 10, padding: "2px 8px", borderRadius: 999,
                        background: `${cfg.color}10`,
                        border: `1px solid ${cfg.color}25`,
                        color: cfg.color, fontWeight: 600,
                        letterSpacing: "0.06em", textTransform: "uppercase",
                        fontFamily: "'DM Sans', sans-serif",
                    }}>
                        {item.action_type.replace(/_/g, " ")}
                    </span>
                </div>
            </div>

            {/* Time */}
            <span style={{
                fontSize: 11, color: FAINT, flexShrink: 0,
                fontFamily: "'DM Sans', sans-serif",
            }}>
                {item.time}
            </span>

            {/* Dot */}
            <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: cfg.dot,
                boxShadow: `0 0 6px ${cfg.dot}`,
                flexShrink: 0,
            }} />
        </div>
    );
}

// ── Group by date ─────────────────────────────────────────────────────────────
function groupByDate(items) {
    const groups = {};
    items.forEach((item) => {
        const key = item.time.includes("ago") || item.time === "just now"
            ? "Today"
            : item.time === "Yesterday"
            ? "Yesterday"
            : item.time; // "Apr 30" etc
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
    });
    return groups;
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ filter }) {
    return (
        <div style={{
            padding: "60px 20px", textAlign: "center",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        }}>
            <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "rgba(232,255,71,0.06)",
                border: "1px solid rgba(232,255,71,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, marginBottom: 4,
            }}>📭</div>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: TEXT, fontWeight: 700, margin: 0 }}>
                No activity yet
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: FAINT, margin: 0 }}>
                {filter === "all"
                    ? "Start using JobHitAI and your activity will appear here."
                    : `No ${filter} activity found. Try a different filter.`}
            </p>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function ActivityLogPage() {
    const [items,    setItems]    = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);
    const [filter,   setFilter]   = useState("all");
    const [page,     setPage]     = useState(1);
    const [hasMore,  setHasMore]  = useState(false);

    const LIMIT = 20;

    async function fetchActivity(pageNum = 1, append = false) {
        try {
            if (!append) setLoading(true);
            const res = await fetch(
                `${API}/api/dashboard/activity?limit=${pageNum * LIMIT}`,
                { credentials: "include" }
            );
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const data = await res.json();
            const list = Array.isArray(data) ? data : data.activity ?? [];
            setItems(list);
            setHasMore(list.length === pageNum * LIMIT);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchActivity(1);
    }, []);

    const loadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchActivity(next, true);
    };

    // ── Filter ──────────────────────────────────────────────────────────────
    const activeFilter = FILTERS.find((f) => f.key === filter);
    const filtered = filter === "all"
        ? items
        : items.filter((i) => activeFilter?.types?.includes(i.action_type));

    const groups = groupByDate(filtered);

    // ── Stats summary ───────────────────────────────────────────────────────
    const summary = {
        total:   items.length,
        resumes: items.filter((i) => ["resume_uploaded","resume_created","resume_update","resume_scanned"].includes(i.action_type)).length,
        ai:      items.filter((i) => ["ats_analysis","ai_suggestion","category_pred","career_advice"].includes(i.action_type)).length,
        skills:  items.filter((i) => ["skill_match","job_match"].includes(i.action_type)).length,
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* ── Header ── */}
            <div className="fade-up" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                    <p style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                        Activity
                    </p>
                    <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "clamp(22px,2.5vw,32px)", color: TEXT, lineHeight: 1.05, marginBottom: 6, letterSpacing: "-0.035em" }}>
                        All <em style={{ fontStyle: "italic", color: ACCENT }}>Activity</em>
                    </h1>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: MUTED }}>
                        Everything you've done across JobHitAI, in one place.
                    </p>
                </div>
                <button
                    onClick={() => fetchActivity(page)}
                    style={{
                        fontSize: 12, padding: "7px 14px", borderRadius: 999,
                        background: SURFACE, border: `1px solid ${BORDER2}`,
                        color: MUTED, cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        transition: "all 0.15s",
                        display: "flex", alignItems: "center", gap: 6,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = TEXT}
                    onMouseLeave={(e) => e.currentTarget.style.color = MUTED}
                >
                    ↻ Refresh
                </button>
            </div>

            {/* ── Summary cards ── */}
            {!loading && (
                <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                    {[
                        { label: "Total Actions", value: summary.total,   color: ACCENT },
                        { label: "Resume Events", value: summary.resumes, color: GREEN  },
                        { label: "AI Events",     value: summary.ai,      color: GOLD   },
                        { label: "Skill Events",  value: summary.skills,  color: PINK   },
                    ].map(({ label, value, color }, i) => (
                        <div key={label} style={{
                            borderRadius: 14, padding: "14px 16px",
                            background: `${color}08`,
                            border: `1px solid ${color}20`,
                            animationDelay: `${i * 0.06}s`,
                        }}>
                            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: FAINT, marginTop: 5 }}>{label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Filter tabs ── */}
            <div className="fade-up" style={{ display: "flex", gap: 8 }}>
                {FILTERS.map((f) => (
                    <button
                        key={f.key}
                        className="filter-btn"
                        onClick={() => setFilter(f.key)}
                        style={{
                            fontSize: 12, padding: "6px 14px", borderRadius: 999,
                            background: filter === f.key ? "rgba(232,255,71,0.1)" : SURFACE,
                            border: `1px solid ${filter === f.key ? "rgba(232,255,71,0.3)" : BORDER2}`,
                            color: filter === f.key ? ACCENT : MUTED,
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: filter === f.key ? 600 : 400,
                        }}
                    >
                        {f.label}
                        {f.key !== "all" && (
                            <span style={{ marginLeft: 6, opacity: 0.6, fontSize: 10 }}>
                                {items.filter((i) => f.types?.includes(i.action_type)).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── Activity list ── */}
            <div className="fade-up" style={{
                borderRadius: 18, overflow: "hidden",
                background: SURFACE, border: `1px solid ${BORDER}`,
            }}>

                {/* Error */}
                {error && (
                    <div style={{ padding: "16px 20px", fontSize: 13, color: PINK, borderBottom: `1px solid ${BORDER}` }}>
                        ⚠️ {error} — <span onClick={() => fetchActivity(page)} style={{ textDecoration: "underline", cursor: "pointer" }}>retry</span>
                    </div>
                )}

                {/* Loading skeletons */}
                {loading && Array(8).fill(null).map((_, i) => (
                    <SkeletonRow key={i} delay={i * 0.05} />
                ))}

                {/* Grouped rows */}
                {!loading && Object.keys(groups).length === 0 && (
                    <EmptyState filter={filter} />
                )}

                {!loading && Object.entries(groups).map(([date, groupItems]) => (
                    <div key={date}>
                        {/* Date header */}
                        <div style={{
                            padding: "10px 20px 8px",
                            borderBottom: `1px solid ${BORDER}`,
                            display: "flex", alignItems: "center", gap: 10,
                            position: "sticky", top: 0,
                            background: "#0d0d12",
                            zIndex: 2,
                        }}>
                            <span style={{
                                fontFamily: "'Fraunces', serif", fontSize: 11,
                                color: ACCENT, fontWeight: 700, fontStyle: "italic",
                            }}>{date}</span>
                            <div style={{ flex: 1, height: 1, background: BORDER }} />
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: FAINT }}>
                                {groupItems.length} {groupItems.length === 1 ? "event" : "events"}
                            </span>
                        </div>

                        {groupItems.map((item, i) => (
                            <ActivityRow
                                key={`${item.action_type}-${item.time}-${i}`}
                                item={item}
                                index={i}
                            />
                        ))}
                    </div>
                ))}

                {/* Load more */}
                {!loading && hasMore && (
                    <div style={{ padding: "16px 20px", borderTop: `1px solid ${BORDER}`, textAlign: "center" }}>
                        <button
                            onClick={loadMore}
                            style={{
                                fontSize: 12, padding: "8px 20px", borderRadius: 999,
                                background: "rgba(232,255,71,0.06)",
                                border: "1px solid rgba(232,255,71,0.2)",
                                color: ACCENT, cursor: "pointer",
                                fontFamily: "'DM Sans', sans-serif",
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(232,255,71,0.12)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(232,255,71,0.06)"}
                        >
                            Load more
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Shell ──────────────────────────────────────────────────────────────────────
export default function ActivityLog() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <style>{css}</style>
            <style>{`
                * { box-sizing: border-box; }
                body { margin: 0; background: ${BG}; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(232,255,71,0.18); border-radius: 2px; }
            `}</style>
            <div style={{ fontFamily: "'DM Sans', sans-serif", background: BG, color: TEXT, minHeight: "100vh", display: "flex" }}>
                <Sidebar user={user} onLogout={() => { logout(); navigate("/login"); }} onClick={(p) => navigate(p)} />
                <Topbar />
                <main style={{ marginLeft: 256, paddingTop: 68, flex: 1, minHeight: "100vh", overflowY: "auto" }}>
                    <div style={{ maxWidth: 860, margin: "0 auto", padding: "26px 28px" }}>
                        <ActivityLogPage />
                    </div>
                </main>
            </div>
        </>
    );
}