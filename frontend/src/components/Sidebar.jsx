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