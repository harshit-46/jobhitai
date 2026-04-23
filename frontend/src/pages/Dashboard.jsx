import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import FeatureCard from "../components/FeatureCard";
import ScoreRing from "../components/ScoreRing";
import ResumeUploadModal from "../components/ResumeUploadModal";

const FontLoader = () => {
    useEffect(() => {
        const link = document.createElement("link");
        link.href =
            "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,800;1,9..144,300;1,9..144,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }, []);
    return null;
};

// ── Design tokens — landing palette ──────────────────────
const t = {
    bg: "#0a0a0e",
    surface: "rgba(255,255,255,0.03)",
    surface2: "rgba(255,255,255,0.055)",
    sidebar: "#08080b",
    text: "#f0ede8",
    muted: "rgba(240,237,232,0.5)",
    faint: "rgba(240,237,232,0.25)",
    border: "rgba(255,255,255,0.07)",
    border2: "rgba(255,255,255,0.12)",
    // accent
    lime: "#E8FF47",
    limeD: "#c8dd00",
    // supporting accents (kept distinct, no purple)
    green: "#86efac",
    gold: "#fcd34d",
    pink: "#f9a8d4",
    serif: { fontFamily: "'Fraunces', serif" },
    serifItalic: { fontFamily: "'Fraunces', serif", fontStyle: "italic" },
};

const STATS = [
    {
        title: "Resumes", value: "12", delta: "+3 this month", positive: true,
        icon: "📄",
        iconBg: "rgba(232,255,71,0.1)", iconBorder: "rgba(232,255,71,0.2)",
        accent: "#E8FF47", cardBorder: "rgba(232,255,71,0.2)",
        cardGrad: "linear-gradient(135deg,rgba(232,255,71,0.08),rgba(232,255,71,0.01))",
    },
    {
        title: "ATS Score", value: "82%", delta: "+7% vs last", positive: true,
        icon: "📊",
        iconBg: "rgba(134,239,172,0.1)", iconBorder: "rgba(134,239,172,0.2)",
        accent: "#86efac", cardBorder: "rgba(134,239,172,0.2)",
        cardGrad: "linear-gradient(135deg,rgba(134,239,172,0.08),rgba(134,239,172,0.01))",
    },
    {
        title: "Job Category", value: "AI Eng.", delta: "Best match", positive: true,
        icon: "🧠",
        iconBg: "rgba(252,211,77,0.1)", iconBorder: "rgba(252,211,77,0.2)",
        accent: "#fcd34d", cardBorder: "rgba(252,211,77,0.2)",
        cardGrad: "linear-gradient(135deg,rgba(252,211,77,0.08),rgba(252,211,77,0.01))",
    },
    {
        title: "Improvement", value: "+15%", delta: "Since last wk", positive: true,
        icon: "📈",
        iconBg: "rgba(249,168,212,0.1)", iconBorder: "rgba(249,168,212,0.2)",
        accent: "#f9a8d4", cardBorder: "rgba(249,168,212,0.2)",
        cardGrad: "linear-gradient(135deg,rgba(249,168,212,0.08),rgba(249,168,212,0.01))",
    },
];

const FEATURES = [
    {
        title: "Resume Builder", icon: "✍️", path: "resume-builder",
        desc: "Create AI-powered, ATS-optimized resumes tailored to any job description in minutes.",
        iconBg: "rgba(232,255,71,0.1)", iconBorder: "rgba(232,255,71,0.2)",
        btnBg: "rgba(232,255,71,0.1)", btnBorder: "rgba(232,255,71,0.25)", btnColor: "#E8FF47",
        topLine: "linear-gradient(90deg,transparent,#E8FF47,transparent)",
    },
    {
        title: "Resume Analyzer", icon: "📊", path: "skill-matcher",
        desc: "Get a real-time ATS score and line-by-line feedback to maximize your interview chances.",
        iconBg: "rgba(134,239,172,0.1)", iconBorder: "rgba(134,239,172,0.2)",
        btnBg: "rgba(134,239,172,0.1)", btnBorder: "rgba(134,239,172,0.25)", btnColor: "#86efac",
        topLine: "linear-gradient(90deg,transparent,#86efac,transparent)",
    },
    {
        title: "AI Predictor", icon: "🎯", path: "job-category",
        desc: "Predict your ideal job category and get personalised recommendations based on your profile.",
        iconBg: "rgba(252,211,77,0.1)", iconBorder: "rgba(252,211,77,0.2)",
        btnBg: "rgba(252,211,77,0.1)", btnBorder: "rgba(252,211,77,0.25)", btnColor: "#fcd34d",
        topLine: "linear-gradient(90deg,transparent,#fcd34d,transparent)",
    },
];

const ACTIVITY = [
    { label: "Updated Resume", time: "2 min ago", icon: "✏️", dot: "#E8FF47" },
    { label: "Analysed Resume", time: "1 hr ago", icon: "📊", dot: "#86efac" },
    { label: "Generated AI Suggestions", time: "3 hr ago", icon: "🤖", dot: "#fcd34d" },
    { label: "New Job Match Found", time: "Yesterday", icon: "🎯", dot: "#f9a8d4" },
];

const SCORE_BARS = [
    { name: "Keywords", val: 88, gradient: "linear-gradient(90deg,#E8FF47,#c8dd00)" },
    { name: "Skills", val: 76, gradient: "linear-gradient(90deg,#E8FF47,#86efac)" },
    { name: "Impact", val: 82, gradient: "linear-gradient(90deg,#fcd34d,#f9a8d4)" },
    { name: "Format", val: 92, gradient: "linear-gradient(90deg,#86efac,#E8FF47)" },
];

function DashboardPage() {

    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [score, setScore] = useState(null);

    const navigate = useNavigate();

    const handleFeatureClick = (path) => {
        navigate(`/${path}`);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* ── AI Tip banner ── */}
            <div style={{
                position: "relative", borderRadius: 18, padding: "13px 20px",
                display: "flex", alignItems: "center", gap: 12, overflow: "hidden",
                background: "rgba(232,255,71,0.05)",
                border: "1px solid rgba(232,255,71,0.15)",
            }}>
                <div style={{ position: "absolute", top: 0, left: "30%", right: "30%", height: 1, background: "linear-gradient(90deg,transparent,rgba(232,255,71,0.45),transparent)" }} />
                <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
                <span style={{ fontSize: 13, color: t.muted, flex: 1 }}>
                    <span style={{ color: t.lime, fontWeight: 600 }}>AI Tip: </span>
                    Add "distributed systems" and "CI/CD" to your skills section to boost your ATS score by ~14 pts.
                </span>
                <button
                    style={{
                        marginLeft: "auto", flexShrink: 0, fontSize: 12,
                        padding: "5px 13px", borderRadius: 999,
                        background: "rgba(232,255,71,0.1)",
                        border: "1px solid rgba(232,255,71,0.25)",
                        color: t.lime, cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(232,255,71,0.18)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(232,255,71,0.1)"; }}
                >Fix now →</button>
            </div>

            {/* ── Stat cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {STATS.map((s) => <StatCard key={s.title} {...s} />)}
            </div>

            {/* ── Feature cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {FEATURES.map((f) => <FeatureCard key={f.title} {...f} onClick={() => handleFeatureClick(f.path)} />)}
            </div>

            {/* ── Bottom row ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

                {/* Recent Activity */}
                <div style={{ borderRadius: 20, overflow: "hidden", background: t.surface, border: `1px solid ${t.border}` }}>
                    <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em", color: t.text }}>Recent Activity</span>
                        <span style={{ fontSize: 11, color: t.lime, cursor: "pointer" }}>View all →</span>
                    </div>
                    {ACTIVITY.map((a, i) => (
                        <div
                            key={i}
                            style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 20px", borderBottom: i < ACTIVITY.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.15s", cursor: "default" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = t.surface2; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                        >
                            <div style={{ width: 30, height: 30, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, background: "rgba(255,255,255,0.04)", border: `1px solid ${t.border}`, flexShrink: 0 }}>{a.icon}</div>
                            <span style={{ flex: 1, fontSize: 13, color: t.muted }}>{a.label}</span>
                            <span style={{ fontSize: 11, color: t.faint, flexShrink: 0 }}>{a.time}</span>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: a.dot, flexShrink: 0 }} />
                        </div>
                    ))}
                </div>

                {/* Right column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                    {/* AI Insights */}
                    <div style={{ borderRadius: 20, padding: "18px 20px", background: t.surface, border: `1px solid ${t.border}`, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, background: "rgba(232,255,71,0.08)", border: "1px solid rgba(232,255,71,0.18)" }}>🤖</div>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em", color: t.text }}>AI Insights</div>
                                <div style={{ fontSize: 11, color: t.faint, marginTop: 1 }}>Personalised for you</div>
                            </div>
                        </div>
                        {[
                            "Add more ML projects to improve your score.",
                            "Highlight leadership experience for senior roles.",
                            "Your profile is 78% complete — finish it!",
                        ].map((tip, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: t.muted, lineHeight: 1.55, marginBottom: i < 2 ? 8 : 0 }}>
                                <span style={{ color: t.lime, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                                {tip}
                            </div>
                        ))}
                    </div>

                    {/* Resume Score */}
                    <div style={{ borderRadius: 20, padding: "18px 20px", background: t.surface, border: `1px solid ${t.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                            <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em", color: t.text }}>Resume Score</span>
                            <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 999, background: "rgba(134,239,172,0.08)", border: "1px solid rgba(134,239,172,0.2)", color: t.green }}>Live</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <ScoreRing score={82} size={80} stroke={6} />
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
                                {SCORE_BARS.map((b) => (
                                    <div key={b.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontSize: 10, width: 44, flexShrink: 0, color: t.faint }}>{b.name}</span>
                                        <div style={{ flex: 1, height: 3, borderRadius: 999, overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
                                            <div style={{ height: "100%", borderRadius: 999, width: `${b.val}%`, background: b.gradient }} />
                                        </div>
                                        <span style={{ fontSize: 10, width: 20, textAlign: "right", color: t.faint }}>{b.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleClick = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };



    const [showUpload, setShowUpload] = useState(!user.hasResume);

    return (
        <>
            <FontLoader />
            <style>{`
                * { box-sizing: border-box; }
                body { margin: 0; background: #0a0a0e; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(232,255,71,0.18); border-radius: 2px; }
            `}</style>

            <div style={{ fontFamily: "'DM Sans', sans-serif", background: t.bg, color: t.text, minHeight: "100vh", display: "flex" }}>
                {showUpload && (
                    <ResumeUploadModal
                        onClose={() => setShowUpload(false)}
                        onSkip={() => setShowUpload(false)}
                        onSuccess={() => setShowUpload(false)}
                    />
                )}
                <Sidebar user={user} onLogout={handleLogout} onClick={handleClick} />
                <Topbar />
                <main style={{ marginLeft: 256, paddingTop: 68, flex: 1, minHeight: "100vh", position: "relative", zIndex: 10, overflowY: "auto" }}>
                    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "26px 28px" }}>
                        <DashboardPage />
                    </div>
                </main>
            </div>
        </>
    );
}