import { Home, FileText, BarChart, Brain, Folder, Settings, LogOut, Bell, Search, ChevronRight } from "lucide-react";
import { useState } from "react";


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


export default function FeatureCard({ title, desc, icon, iconBg, iconBorder, btnBg, btnBorder, btnColor, topLine }) {
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