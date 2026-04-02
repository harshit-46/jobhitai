import { Home, FileText, BarChart, Brain, Folder, Settings, LogOut, Bell, Search, ChevronRight } from "lucide-react";


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


export default function ScoreRing({ score = 82, size = 84, stroke = 6 }) {
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