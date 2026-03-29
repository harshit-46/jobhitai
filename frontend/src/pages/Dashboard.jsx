import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate , useLocation} from "react-router-dom";
import { Home, FileText, BarChart, Brain, Folder, Settings, LogOut, Bell, Search, ChevronRight } from "lucide-react";

// ── Font Loader ────────────────────────────────────────────────────────────────
const FontLoader = () => {
    useEffect(() => {
        const link = document.createElement("link");
        link.href =
            "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }, []);
    return null;
};

// ── Design Tokens (mirrors landing page exactly) ───────────────────────────────
const t = {
    bg: "#09090f",
    surface: "#111118",
    surface2: "#16161f",
    sidebar: "#0d0d14",
    text: "#f0eff8",
    muted: "#7b7a92",
    faint: "#4a4963",
    border: "rgba(255,255,255,0.07)",
    border2: "rgba(255,255,255,0.12)",
    purple: "#7c6af7",
    purpleL: "#a599ff",
    purpleD: "#5c4ed4",
    green: "#3fd898",
    gold: "#f0c060",
    pink: "#f067a6",
    serif: { fontFamily: "'Instrument Serif', serif" },
    serifItalic: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic" },
};

// ── Static Data ────────────────────────────────────────────────────────────────
const MENU = [
    { name: "Dashboard", icon: Home , path : "/dashboard" },
    { name: "Resume Builder", icon: FileText , path : "/resume-builder" },
    { name: "Analyzer", icon: BarChart , path : "/analyzer" },
    { name: "AI Predictions", icon: Brain , path : "/ai-predictions" },
    { name: "My Resumes", icon: Folder , path : "/myresumes" },
    { name: "Settings", icon: Settings , path : "/settings" },
];

const STATS = [
    {
        title: "Resumes", value: "12", delta: "+3 this month", positive: true,
        icon: "📄", iconBg: "rgba(124,106,247,0.12)", iconBorder: "rgba(124,106,247,0.2)",
        accent: "#7c6af7", cardBorder: "rgba(124,106,247,0.25)",
        cardGrad: "linear-gradient(135deg,rgba(124,106,247,0.1),rgba(124,106,247,0.02))",
    },
    {
        title: "ATS Score", value: "82%", delta: "+7% vs last", positive: true,
        icon: "📊", iconBg: "rgba(63,216,152,0.1)", iconBorder: "rgba(63,216,152,0.2)",
        accent: "#3fd898", cardBorder: "rgba(63,216,152,0.22)",
        cardGrad: "linear-gradient(135deg,rgba(63,216,152,0.1),rgba(63,216,152,0.02))",
    },
    {
        title: "Job Category", value: "AI Eng.", delta: "Best match", positive: true,
        icon: "🧠", iconBg: "rgba(240,192,96,0.1)", iconBorder: "rgba(240,192,96,0.2)",
        accent: "#f0c060", cardBorder: "rgba(240,192,96,0.22)",
        cardGrad: "linear-gradient(135deg,rgba(240,192,96,0.1),rgba(240,192,96,0.02))",
    },
    {
        title: "Improvement", value: "+15%", delta: "Since last wk", positive: true,
        icon: "📈", iconBg: "rgba(240,96,166,0.1)", iconBorder: "rgba(240,96,166,0.2)",
        accent: "#f067a6", cardBorder: "rgba(240,96,166,0.22)",
        cardGrad: "linear-gradient(135deg,rgba(240,96,166,0.1),rgba(240,96,166,0.02))",
    },
];

const FEATURES = [
    {
        title: "Resume Builder", icon: "✍️",
        desc: "Create AI-powered, ATS-optimized resumes tailored to any job description in minutes.",
        iconBg: "rgba(124,106,247,0.12)", iconBorder: "rgba(124,106,247,0.2)",
        btnBg: "rgba(124,106,247,0.12)", btnBorder: "rgba(124,106,247,0.25)", btnColor: "#a599ff",
        topLine: "linear-gradient(90deg,transparent,#7c6af7,transparent)",
    },
    {
        title: "Resume Analyzer", icon: "📊",
        desc: "Get a real-time ATS score and line-by-line feedback to maximize your interview chances.",
        iconBg: "rgba(63,216,152,0.1)", iconBorder: "rgba(63,216,152,0.2)",
        btnBg: "rgba(63,216,152,0.1)", btnBorder: "rgba(63,216,152,0.25)", btnColor: "#3fd898",
        topLine: "linear-gradient(90deg,transparent,#3fd898,transparent)",
    },
    {
        title: "AI Predictor", icon: "🎯",
        desc: "Predict your ideal job category and get personalised recommendations based on your profile.",
        iconBg: "rgba(240,192,96,0.1)", iconBorder: "rgba(240,192,96,0.2)",
        btnBg: "rgba(240,192,96,0.1)", btnBorder: "rgba(240,192,96,0.25)", btnColor: "#f0c060",
        topLine: "linear-gradient(90deg,transparent,#f0c060,transparent)",
    },
];

const ACTIVITY = [
    { label: "Updated Resume", time: "2 min ago", icon: "✏️", dot: "#a599ff" },
    { label: "Analysed Resume", time: "1 hr ago", icon: "📊", dot: "#3fd898" },
    { label: "Generated AI Suggestions", time: "3 hr ago", icon: "🤖", dot: "#f0c060" },
    { label: "New Job Match Found", time: "Yesterday", icon: "🎯", dot: "#f067a6" },
];

const SCORE_BARS = [
    { name: "Keywords", val: 88, gradient: "linear-gradient(90deg,#7c6af7,#a599ff)" },
    { name: "Skills", val: 76, gradient: "linear-gradient(90deg,#7c6af7,#3fd898)" },
    { name: "Impact", val: 82, gradient: "linear-gradient(90deg,#f0c060,#f067a6)" },
    { name: "Format", val: 92, gradient: "linear-gradient(90deg,#3fd898,#7c6af7)" },
];

// ── Micro components ───────────────────────────────────────────────────────────

// ── Sidebar ────────────────────────────────────────────────────────────────────

// ── Topbar ─────────────────────────────────────────────────────────────────────

// ── Stat Card ──────────────────────────────────────────────────────────────────

// ── Feature Card ───────────────────────────────────────────────────────────────

// ── Dashboard Main Content ─────────────────────────────────────────────────────
function DashboardPage() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* AI Tip banner */}
            <div style={{ position: "relative", borderRadius: 18, padding: "13px 20px", display: "flex", alignItems: "center", gap: 12, overflow: "hidden", background: "rgba(124,106,247,0.07)", border: "1px solid rgba(124,106,247,0.18)" }}>
                <div style={{ position: "absolute", top: 0, left: "30%", right: "30%", height: 1, background: "linear-gradient(90deg,transparent,rgba(124,106,247,0.55),transparent)" }} />
                <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
                <span style={{ fontSize: 13, color: t.muted, flex: 1 }}>
                    <span style={{ color: t.purpleL, fontWeight: 500 }}>AI Tip: </span>
                    Add "distributed systems" and "CI/CD" to your skills section to boost your ATS score by ~14 pts.
                </span>
                <button
                    style={{ marginLeft: "auto", flexShrink: 0, fontSize: 12, padding: "5px 13px", borderRadius: 999, background: "rgba(124,106,247,0.13)", border: "1px solid rgba(124,106,247,0.25)", color: t.purpleL, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,106,247,0.22)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(124,106,247,0.13)"; }}
                >Fix now →</button>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {STATS.map((s) => <StatCard key={s.title} {...s} />)}
            </div>

            {/* Feature cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
            </div>

            {/* Bottom row: Activity + Insights + Score */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

                {/* Recent Activity */}
                <div style={{ borderRadius: 20, overflow: "hidden", background: t.surface, border: `1px solid ${t.border}` }}>
                    <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em" }}>Recent Activity</span>
                        <span style={{ fontSize: 11, color: t.purpleL, cursor: "pointer" }}>View all →</span>
                    </div>
                    {ACTIVITY.map((a, i) => (
                        <div key={i}
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

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ borderRadius: 20, padding: "18px 20px", background: t.surface, border: `1px solid ${t.border}`, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, background: "rgba(124,106,247,0.12)", border: "1px solid rgba(124,106,247,0.2)" }}>🤖</div>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em" }}>AI Insights</div>
                                <div style={{ fontSize: 11, color: t.faint, marginTop: 1 }}>Personalised for you</div>
                            </div>
                        </div>
                        {[
                            "Add more ML projects to improve your score.",
                            "Highlight leadership experience for senior roles.",
                            "Your profile is 78% complete — finish it!",
                        ].map((tip, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: t.muted, lineHeight: 1.55, marginBottom: i < 2 ? 8 : 0 }}>
                                <span style={{ color: t.green, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                                {tip}
                            </div>
                        ))}
                    </div>

                    {/* Score panel */}
                    <div style={{ borderRadius: 20, padding: "18px 20px", background: t.surface, border: `1px solid ${t.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                            <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em" }}>Resume Score</span>
                            <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 999, background: "rgba(63,216,152,0.08)", border: "1px solid rgba(63,216,152,0.2)", color: t.green }}>Live</span>
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

    const handleClick = () => {
        navigate(path);
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            <FontLoader />
            <style>{`
                * { box-sizing: border-box; }
                body { margin: 0; background: #09090f; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(124,106,247,0.2); border-radius: 2px; }
            `}</style>

            <div style={{ fontFamily: "'DM Sans', sans-serif", background: t.bg, color: t.text, minHeight: "100vh", display: "flex" }}>
                <div style={{ position: "fixed", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,106,247,0.11) 0%,transparent 70%)", top: -140, left: 60, filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
                <div style={{ position: "fixed", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,rgba(63,216,152,0.07) 0%,transparent 70%)", bottom: "4%", right: "6%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />

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