import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
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
    { name: "Dashboard", icon: Home },
    { name: "Resume Builder", icon: FileText },
    { name: "Analyzer", icon: BarChart },
    { name: "AI Predictions", icon: Brain },
    { name: "My Resumes", icon: Folder },
    { name: "Settings", icon: Settings },
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
function ScoreRing({ score = 82, size = 84, stroke = 6 }) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - score / 100);
    return (
        <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
                <defs>
                    <linearGradient id="rg2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7c6af7" />
                        <stop offset="100%" stopColor="#3fd898" />
                    </linearGradient>
                </defs>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#rg2)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ ...t.serif, fontSize: size * 0.24, letterSpacing: "-0.04em", color: t.text, lineHeight: 1 }}>{score}</span>
                <span style={{ fontSize: 9, color: t.faint }}>100</span>
            </div>
        </div>
    );
}

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, user, onLogout }) {
    const initial = user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U";
    const displayName = user?.name ?? user?.email?.split("@")[0] ?? "User";

    return (
        <aside style={{
            width: 256, minWidth: 256, background: t.sidebar,
            borderRight: `1px solid ${t.border}`,
            display: "flex", flexDirection: "column",
            position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 40,
        }}>
            {/* Logo */}
            <div style={{ padding: "22px 26px", borderBottom: `1px solid ${t.border}` }}>
                <span style={{ ...t.serif, fontSize: "1.42rem", letterSpacing: "-0.02em", color: t.text }}>
                    JobHit<span style={{ color: t.purpleL }}>AI</span>
                </span>
            </div>

            {/* User pill */}
            <div style={{ margin: "14px 10px 4px", padding: "11px 12px", borderRadius: 16, background: t.surface, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#7c6af7,#5c4ed4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#fff", flexShrink: 0 }}>
                    {initial}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em", color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</div>
                    <div style={{ fontSize: 11, color: t.faint, marginTop: 1 }}>Pro Plan</div>
                </div>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: t.green, boxShadow: `0 0 6px ${t.green}`, flexShrink: 0 }} />
            </div>

            {/* Nav items */}
            <nav style={{ flex: 1, padding: "8px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
                {MENU.map(({ name, icon: Icon }) => {
                    const on = active === name;
                    return (
                        <button key={name} onClick={() => setActive(name)}
                            style={{
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "10px 13px", borderRadius: 12, fontSize: 13,
                                fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                                background: on ? "rgba(124,106,247,0.12)" : "transparent",
                                color: on ? t.purpleL : t.muted,
                                border: on ? "1px solid rgba(124,106,247,0.2)" : "1px solid transparent",
                                cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => { if (!on) { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = t.text; } }}
                            onMouseLeave={(e) => { if (!on) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.muted; } }}
                        >
                            <Icon size={14} />
                            {name}
                            {on && <span style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: t.purple }} />}
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div style={{ padding: "10px 8px", borderTop: `1px solid ${t.border}` }}>
                <button onClick={onLogout}
                    style={{
                        display: "flex", alignItems: "center", gap: 10, width: "100%",
                        padding: "10px 13px", borderRadius: 12, fontSize: 13,
                        fontFamily: "'DM Sans', sans-serif",
                        background: "transparent", color: t.muted,
                        border: "1px solid transparent", cursor: "pointer", transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = t.pink; e.currentTarget.style.background = "rgba(240,96,166,0.07)"; e.currentTarget.style.borderColor = "rgba(240,96,166,0.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = t.muted; e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
                >
                    <LogOut size={14} /> Logout
                </button>
            </div>
        </aside>
    );
}

// ── Topbar ─────────────────────────────────────────────────────────────────────
function Topbar({ active }) {
    return (
        <header style={{
            position: "fixed", top: 0, left: 256, right: 0, zIndex: 30,
            background: "rgba(9,9,15,0.85)", backdropFilter: "blur(16px)",
            borderBottom: `1px solid ${t.border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "13px 30px", fontFamily: "'DM Sans', sans-serif",
        }}>
            <div>
                <h2 style={{ ...t.serif, fontSize: "1.15rem", letterSpacing: "-0.02em", color: t.text, margin: 0 }}>
                    {active === "Dashboard"
                        ? <>Good morning, <em style={t.serifItalic}>there</em> 👋</>
                        : active}
                </h2>
                <p style={{ fontSize: 11, color: t.faint, marginTop: 2 }}>
                    {active === "Dashboard" ? "Here's what's happening with your job search today." : `Manage your ${active.toLowerCase()}.`}
                </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 999, background: t.surface, border: `1px solid ${t.border}`, fontSize: 12, color: t.faint }}>
                    <Search size={11} /> Search jobs, resumes…
                </div>

                <button style={{ position: "relative", width: 34, height: 34, borderRadius: "50%", background: t.surface, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: t.muted, transition: "all 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.border2; e.currentTarget.style.color = t.text; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.muted; }}>
                    <Bell size={13} />
                    <span style={{ position: "absolute", top: 5, right: 5, width: 5, height: 5, borderRadius: "50%", background: t.pink, boxShadow: `0 0 4px ${t.pink}` }} />
                </button>

                <button style={{
                    display: "flex", alignItems: "center", gap: 5, padding: "7px 16px", borderRadius: 999,
                    fontSize: 12, fontWeight: 500, color: "#fff", fontFamily: "'DM Sans', sans-serif",
                    background: t.purple, border: "none", cursor: "pointer",
                    boxShadow: "0 4px 18px rgba(124,106,247,0.35)", transition: "all 0.15s",
                }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = t.purpleL; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = t.purple; e.currentTarget.style.transform = "translateY(0)"; }}>
                    + New Resume
                </button>
            </div>
        </header>
    );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ title, value, delta, positive, icon, iconBg, iconBorder, accent, cardBorder, cardGrad }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            style={{ position: "relative", borderRadius: 20, padding: "20px 20px 16px", background: cardGrad, border: `1px solid ${hov ? cardBorder : t.border}`, overflow: "hidden", transition: "border-color 0.2s, transform 0.2s", transform: hov ? "translateY(-2px)" : "translateY(0)", cursor: "default" }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        >
            {hov && <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: `linear-gradient(90deg,transparent,${accent},transparent)` }} />}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, background: iconBg, border: `1px solid ${iconBorder}` }}>{icon}</div>
                <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 999, color: positive ? t.green : t.pink, background: positive ? "rgba(63,216,152,0.08)" : "rgba(240,96,166,0.08)", border: `1px solid ${positive ? "rgba(63,216,152,0.2)" : "rgba(240,96,166,0.2)"}` }}>
                    {positive ? "↑" : "↓"} {delta}
                </span>
            </div>
            <div style={{ ...t.serif, fontSize: "2rem", letterSpacing: "-0.04em", color: t.text, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: t.faint, marginTop: 4 }}>{title}</div>
        </div>
    );
}

// ── Feature Card ───────────────────────────────────────────────────────────────
function FeatureCard({ title, desc, icon, iconBg, iconBorder, btnBg, btnBorder, btnColor, topLine }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            style={{ position: "relative", borderRadius: 20, padding: "26px 24px", background: hov ? t.surface2 : t.surface, border: `1px solid ${t.border}`, overflow: "hidden", transition: "background 0.2s", cursor: "pointer" }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        >
            {hov && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: topLine }} />}
            <div style={{ width: 42, height: 42, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, background: iconBg, border: `1px solid ${iconBorder}`, marginBottom: 16 }}>{icon}</div>
            <h3 style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em", color: t.text, marginBottom: 7 }}>{title}</h3>
            <p style={{ fontSize: 12, lineHeight: 1.65, color: t.muted, fontWeight: 300, marginBottom: 18 }}>{desc}</p>
            <button
                style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 16px", borderRadius: 999, fontSize: 12, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", background: btnBg, border: `1px solid ${btnBorder}`, color: btnColor, cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.75"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
                Open <ChevronRight size={11} />
            </button>
        </div>
    );
}

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

                {/* Right column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                    {/* AI Insights */}
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

// ── Placeholder for other pages ────────────────────────────────────────────────
function PlaceholderPage({ name }) {
    const icons = { "Resume Builder": "✍️", "Analyzer": "📊", "AI Predictions": "🧠", "My Resumes": "📁", "Settings": "⚙️" };
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 420, gap: 16, textAlign: "center" }}>
            <div style={{ width: 68, height: 68, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, background: "rgba(124,106,247,0.1)", border: "1px solid rgba(124,106,247,0.2)" }}>{icons[name] ?? "🔧"}</div>
            <div>
                <h3 style={{ ...t.serif, fontSize: "1.7rem", letterSpacing: "-0.025em", marginBottom: 6, color: t.text }}>{name}</h3>
                <p style={{ fontSize: 13, color: t.muted, fontWeight: 300 }}>This section is coming soon. Stay tuned!</p>
            </div>
            <div style={{ padding: "7px 18px", borderRadius: 999, fontSize: 12, background: "rgba(124,106,247,0.1)", border: "1px solid rgba(124,106,247,0.2)", color: t.purpleL }}>Under Construction</div>
        </div>
    );
}

// ── Root Component ─────────────────────────────────────────────────────────────
export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [active, setActive] = useState("Dashboard");

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
                {/* Ambient orbs — same as landing page */}
                <div style={{ position: "fixed", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,106,247,0.11) 0%,transparent 70%)", top: -140, left: 60, filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
                <div style={{ position: "fixed", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,rgba(63,216,152,0.07) 0%,transparent 70%)", bottom: "4%", right: "6%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />

                <Sidebar active={active} setActive={setActive} user={user} onLogout={handleLogout} />
                <Topbar active={active} />

                <main style={{ marginLeft: 256, paddingTop: 68, flex: 1, minHeight: "100vh", position: "relative", zIndex: 10, overflowY: "auto" }}>
                    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "26px 28px" }}>
                        {active === "Dashboard" ? <DashboardPage /> : <PlaceholderPage name={active} />}
                    </div>
                </main>
            </div>
        </>
    );
}