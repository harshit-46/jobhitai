/*


import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [user, setUser] = useState(null);

    // 🔐 Protect route
    if (!token) {
        return <Navigate to="/login" />;
    }

    // 🔄 Fetch user data (for now dummy)
    useEffect(() => {
        // later we will fetch from backend
        setUser({
            name: "Harshit",
            email: "harshit@example.com",
        });
    }, []);

    // 🚪 Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-blue-500">
                    JobHit AI Dashboard
                </h1>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold mb-2">
                    Welcome 👋 {user?.name}
                </h2>
                <p className="text-gray-400">
                    {user?.email}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                <div className="bg-gray-900 p-6 rounded-xl hover:scale-105 transition">
                    <h3 className="text-xl font-semibold mb-2">📄 Resume Builder</h3>
                    <p className="text-gray-400">
                        Create and manage your resumes easily.
                    </p>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl hover:scale-105 transition">
                    <h3 className="text-xl font-semibold mb-2">💼 Job Search</h3>
                    <p className="text-gray-400">
                        Find jobs tailored to your skills.
                    </p>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl hover:scale-105 transition">
                    <h3 className="text-xl font-semibold mb-2">🤖 AI Suggestions</h3>
                    <p className="text-gray-400">
                        Improve your career with AI insights.
                    </p>
                </div>

            </div>

        </div>
    );
}


*/


import { useState } from "react";

const C = {
    bg: "#09090f",
    surface: "#111118",
    surface2: "#16161f",
    surface3: "#1b1b26",
    border: "rgba(255,255,255,0.07)",
    border2: "rgba(255,255,255,0.12)",
    text: "#f0eff8",
    muted: "#7b7a92",
    dim: "#4a4963",
    accent: "#7c6af7",
    accent2: "#a599ff",
    green: "#3fd898",
    gold: "#f0c060",
    pink: "#f067a6",
};

const serif = { fontFamily: "'Instrument Serif', serif" };
const serifItalic = { fontFamily: "'Instrument Serif', serif", fontStyle: "italic" };

/* ── Nav items ── */
const NAV = [
    { icon: "▣", label: "Dashboard", id: "dashboard" },
    { icon: "📄", label: "My Resumes", id: "resumes" },
    { icon: "🎯", label: "Job Board", id: "jobs" },
    { icon: "📊", label: "Applications", id: "applications" },
    { icon: "💬", label: "Interview Prep", id: "interview" },
    { icon: "📈", label: "Analytics", id: "analytics" },
];

/* ── Mini stat card ── */
function StatCard({ label, value, sub, accent, icon }) {
    return (
        <div className="relative rounded-2xl p-6 overflow-hidden transition-all duration-200"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.border2; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>{icon}</div>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: `${accent}12`, color: accent, border: `1px solid ${accent}20` }}>{sub}</span>
            </div>
            <div className="text-3xl font-normal mb-1" style={{ ...serif, letterSpacing: "-0.03em" }}>{value}</div>
            <div className="text-xs" style={{ color: C.dim }}>{label}</div>
        </div>
    );
}

/* ── Score ring ── */
function ScoreRing({ score, size = 88 }) {
    const r = 36;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox="0 0 88 88" style={{ transform: "rotate(-90deg)" }}>
                <defs>
                    <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7c6af7" />
                        <stop offset="100%" stopColor="#3fd898" />
                    </linearGradient>
                </defs>
                <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <circle cx="44" cy="44" r={r} fill="none" stroke="url(#rg)" strokeWidth="6" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-normal" style={{ ...serif, letterSpacing: "-0.03em" }}>{score}</span>
                <span className="text-xs" style={{ color: C.dim }}>/ 100</span>
            </div>
        </div>
    );
}

/* ── Resume card ── */
function ResumeCard({ title, score, updated, status }) {
    const statusColors = { Active: C.green, Draft: C.gold, Archived: C.dim };
    return (
        <div className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer"
            style={{ background: C.surface2, border: `1px solid ${C.border}` }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.border2; e.currentTarget.style.background = C.surface3; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface2; }}
        >
            <div className="w-9 h-11 rounded-lg flex items-center justify-center text-base shrink-0" style={{ background: "rgba(124,106,247,0.12)", border: "1px solid rgba(124,106,247,0.2)" }}>📄</div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate mb-0.5">{title}</div>
                <div className="text-xs" style={{ color: C.dim }}>Updated {updated}</div>
            </div>
            <ScoreRing score={score} size={52} />
            <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: `${statusColors[status]}15`, color: statusColors[status], border: `1px solid ${statusColors[status]}25` }}>{status}</span>
        </div>
    );
}

/* ── Job card ── */
function JobCard({ company, role, location, match, logo, remote }) {
    const [saved, setSaved] = useState(false);
    return (
        <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-200"
            style={{ background: C.surface2, border: `1px solid ${C.border}` }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.border2; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
        >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: C.surface3, border: `1px solid ${C.border}` }}>{logo}</div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium mb-0.5">{role}</div>
                <div className="text-xs mb-2" style={{ color: C.muted }}>{company} · {location}</div>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(124,106,247,0.1)", color: C.accent2, border: "1px solid rgba(124,106,247,0.2)" }}>{match}% match</span>
                    {remote && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(63,216,152,0.1)", color: C.green, border: "1px solid rgba(63,216,152,0.2)" }}>Remote</span>}
                </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
                <button onClick={() => setSaved(!saved)} className="text-base transition-all" style={{ background: "none", border: "none", cursor: "pointer", color: saved ? C.gold : C.dim }}>{saved ? "★" : "☆"}</button>
                <button className="text-xs px-3 py-1.5 rounded-lg transition-all duration-150" style={{ background: "rgba(124,106,247,0.15)", border: "1px solid rgba(124,106,247,0.25)", color: C.accent2, fontFamily: "'DM Sans',sans-serif", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,106,247,0.25)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(124,106,247,0.15)"; }}
                >Apply →</button>
            </div>
        </div>
    );
}

/* ── Activity feed item ── */
function ActivityItem({ icon, text, time, accent }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0" style={{ background: `${accent}18`, border: `1px solid ${accent}25` }}>{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{text}</p>
                <p className="text-xs mt-0.5" style={{ color: C.dim }}>{time}</p>
            </div>
        </div>
    );
}

/* ── Application status pill ── */
function AppRow({ role, company, status, date }) {
    const statusMap = {
        "Interview": { bg: "rgba(124,106,247,0.12)", color: C.accent2, border: "rgba(124,106,247,0.25)" },
        "Applied": { bg: "rgba(240,192,96,0.1)", color: C.gold, border: "rgba(240,192,96,0.25)" },
        "Rejected": { bg: "rgba(240,96,166,0.1)", color: C.pink, border: "rgba(240,96,166,0.25)" },
        "Offer": { bg: "rgba(63,216,152,0.1)", color: C.green, border: "rgba(63,216,152,0.25)" },
    };
    const s = statusMap[status] || statusMap["Applied"];
    return (
        <div className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{role}</div>
                <div className="text-xs mt-0.5" style={{ color: C.dim }}>{company}</div>
            </div>
            <div className="text-xs" style={{ color: C.dim }}>{date}</div>
            <span className="text-xs px-2.5 py-1 rounded-full shrink-0" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{status}</span>
        </div>
    );
}

/* ════════════════════════════════════════
   MAIN DASHBOARD
════════════════════════════════════════ */
export default function Dashboard({ onNavigate }) {
    const [activeNav, setActiveNav] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.8); } }
      `}</style>

            <div className="flex h-screen overflow-hidden" style={{ background: C.bg, fontFamily: "'DM Sans', sans-serif", color: C.text }}>
                {/* Ambient orbs */}
                <div className="fixed pointer-events-none rounded-full" style={{ width: 500, height: 500, top: -150, left: 200, background: "radial-gradient(circle,rgba(124,106,247,0.08) 0%,transparent 70%)", filter: "blur(80px)", zIndex: 0 }} />

                {/* ══ SIDEBAR ══ */}
                <aside
                    className="flex flex-col shrink-0 h-full overflow-y-auto transition-all duration-300"
                    style={{
                        width: 240,
                        background: C.surface,
                        borderRight: `1px solid ${C.border}`,
                        zIndex: 20,
                    }}
                >
                    {/* Logo */}
                    <div className="px-6 py-5 flex items-center gap-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                        <span style={{ ...serif, fontSize: "1.3rem", letterSpacing: "-0.02em" }}>
                            JobHit<span style={{ color: C.accent2 }}>AI</span>
                        </span>
                        <div className="ml-auto w-2 h-2 rounded-full" style={{ background: C.green, boxShadow: `0 0 6px ${C.green}`, animation: "pulse 2s infinite" }} />
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-0.5 p-3 flex-1">
                        {NAV.map((item) => (
                            <button
                                key={item.id}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all duration-150 w-full"
                                style={{
                                    background: activeNav === item.id ? "rgba(124,106,247,0.12)" : "transparent",
                                    color: activeNav === item.id ? C.accent2 : C.muted,
                                    border: activeNav === item.id ? "1px solid rgba(124,106,247,0.2)" : "1px solid transparent",
                                    fontFamily: "'DM Sans',sans-serif",
                                    cursor: "pointer",
                                    fontWeight: activeNav === item.id ? 500 : 400,
                                }}
                                onClick={() => setActiveNav(item.id)}
                                onMouseEnter={(e) => { if (activeNav !== item.id) { e.currentTarget.style.background = C.surface2; e.currentTarget.style.color = C.text; } }}
                                onMouseLeave={(e) => { if (activeNav !== item.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; } }}
                            >
                                <span style={{ fontSize: "0.9rem", opacity: 0.85 }}>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Upgrade CTA */}
                    <div className="p-4">
                        <div className="rounded-2xl p-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(124,106,247,0.15),rgba(124,106,247,0.05))", border: "1px solid rgba(124,106,247,0.2)" }}>
                            <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(124,106,247,0.5),transparent)" }} />
                            <div className="text-xs font-semibold mb-1" style={{ color: C.accent2 }}>Free Plan</div>
                            <div className="text-xs mb-3" style={{ color: C.dim }}>3 / 5 resume builds used</div>
                            <div className="w-full h-1 rounded-full mb-3" style={{ background: C.border2 }}>
                                <div className="h-full rounded-full" style={{ width: "60%", background: "linear-gradient(90deg,#7c6af7,#a599ff)" }} />
                            </div>
                            <button className="w-full py-2 rounded-xl text-xs font-medium text-white transition-all duration-200"
                                style={{ background: C.accent, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = C.accent2)}
                                onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
                            >Upgrade to Pro →</button>
                        </div>
                    </div>

                    {/* User */}
                    <div className="px-4 py-4 flex items-center gap-3" style={{ borderTop: `1px solid ${C.border}` }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0" style={{ background: "linear-gradient(135deg,#7c6af7,#5c4ed4)" }}>A</div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">Arjun Mehta</div>
                            <div className="text-xs truncate" style={{ color: C.dim }}>arjun@example.com</div>
                        </div>
                        <button style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: "1rem" }}
                            onClick={() => onNavigate && onNavigate("login")}
                        >⏏</button>
                    </div>
                </aside>

                {/* ══ MAIN CONTENT ══ */}
                <main className="flex-1 overflow-y-auto relative z-10">
                    {/* Top bar */}
                    <div className="sticky top-0 z-30 flex items-center justify-between px-8 py-4" style={{ background: "rgba(9,9,15,0.8)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
                        <div>
                            <h1 className="text-lg font-normal" style={serif}>Good morning, <em style={serifItalic}>Arjun</em> 👋</h1>
                            <p className="text-xs mt-0.5" style={{ color: C.dim }}>Thursday, 19 March 2026</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm" style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.dim }}>
                                <span>🔍</span>
                                <input className="bg-transparent outline-none text-sm w-44" placeholder="Search jobs, resumes…" style={{ color: C.muted, fontFamily: "'DM Sans',sans-serif" }} />
                            </div>
                            {/* Notif */}
                            <button className="w-9 h-9 rounded-xl flex items-center justify-center relative transition-all duration-150"
                                style={{ background: C.surface2, border: `1px solid ${C.border}`, cursor: "pointer" }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.border2)}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
                            >
                                🔔
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: C.pink }} />
                            </button>
                            {/* New resume */}
                            <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-200"
                                style={{ background: "linear-gradient(135deg,#7c6af7,#5c4ed4)", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 20px rgba(124,106,247,0.3)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                            >+ New Resume</button>
                        </div>
                    </div>

                    {/* Content area */}
                    <div className="px-8 py-8 max-w-7xl mx-auto" style={{ animation: "fadeUp 0.5s ease both" }}>

                        {/* ── Stat cards ── */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <StatCard icon="📄" label="Resumes Created" value="7" sub="+2 this week" accent={C.accent} />
                            <StatCard icon="📬" label="Applications Sent" value="34" sub="↑ 12%" accent={C.green} />
                            <StatCard icon="💼" label="Interviews Landed" value="6" sub="17.6% rate" accent={C.gold} />
                            <StatCard icon="⭐" label="Avg. Resume Score" value="82" sub="↑ 8 pts" accent={C.pink} />
                        </div>

                        {/* ── Main two-column grid ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Left column (2/3) */}
                            <div className="lg:col-span-2 flex flex-col gap-6">

                                {/* AI Score spotlight */}
                                <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                                    <div className="absolute top-0 left-10 right-10" style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(124,106,247,0.4),transparent)" }} />
                                    <div className="flex items-center justify-between mb-5">
                                        <div>
                                            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: C.dim }}>Resume Score</div>
                                            <h2 className="text-xl font-normal" style={serif}>Top Resume · <em style={serifItalic}>SWE at Stripe</em></h2>
                                        </div>
                                        <button className="text-xs px-4 py-2 rounded-xl transition-all duration-150" style={{ background: "rgba(124,106,247,0.1)", border: "1px solid rgba(124,106,247,0.2)", color: C.accent2, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Improve →</button>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <ScoreRing score={80} size={96} />
                                        <div className="flex-1 flex flex-col gap-2.5">
                                            {[
                                                { name: "Keywords", val: 88, color: "linear-gradient(90deg,#7c6af7,#a599ff)" },
                                                { name: "Skills match", val: 76, color: "linear-gradient(90deg,#7c6af7,#3fd898)" },
                                                { name: "Impact words", val: 82, color: "linear-gradient(90deg,#f0c060,#f067a6)" },
                                                { name: "Formatting", val: 92, color: "linear-gradient(90deg,#3fd898,#7c6af7)" },
                                            ].map((b) => (
                                                <div key={b.name} className="flex items-center gap-3">
                                                    <span className="text-xs w-24 shrink-0" style={{ color: C.muted }}>{b.name}</span>
                                                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: C.border2 }}>
                                                        <div className="h-full rounded-full" style={{ width: `${b.val}%`, background: b.color }} />
                                                    </div>
                                                    <span className="text-xs w-6 text-right" style={{ color: C.muted }}>{b.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-4 p-3 rounded-xl text-xs leading-relaxed" style={{ background: "rgba(124,106,247,0.07)", border: "1px solid rgba(124,106,247,0.15)", color: C.muted }}>
                                        💡 <span style={{ color: C.accent2, fontWeight: 500 }}>AI Tip:</span> Adding "distributed systems" and "CI/CD" could boost your score by ~14 points.
                                    </div>
                                </div>

                                {/* My Resumes */}
                                <div className="rounded-2xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                                    <div className="flex items-center justify-between mb-5">
                                        <h2 className="text-lg font-normal" style={serif}>My Resumes</h2>
                                        <button className="text-xs transition-colors" style={{ color: C.accent2, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>View all →</button>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <ResumeCard title="Software Engineer — Stripe" score={80} updated="2 days ago" status="Active" />
                                        <ResumeCard title="Frontend Dev — Vercel" score={71} updated="5 days ago" status="Active" />
                                        <ResumeCard title="Full Stack — Startup" score={63} updated="1 week ago" status="Draft" />
                                    </div>
                                </div>

                                {/* Applications table */}
                                <div className="rounded-2xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                                    <div className="flex items-center justify-between mb-5">
                                        <h2 className="text-lg font-normal" style={serif}>Recent Applications</h2>
                                        <div className="flex gap-2">
                                            {["All", "Active", "Interviews"].map((t) => (
                                                <button key={t} className="text-xs px-3 py-1 rounded-full transition-all duration-150"
                                                    style={{ background: t === "All" ? "rgba(124,106,247,0.12)" : "transparent", color: t === "All" ? C.accent2 : C.dim, border: t === "All" ? "1px solid rgba(124,106,247,0.2)" : "1px solid transparent", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
                                                >{t}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <AppRow role="Software Engineer" company="Stripe" status="Interview" date="Mar 15" />
                                        <AppRow role="Frontend Engineer" company="Vercel" status="Applied" date="Mar 12" />
                                        <AppRow role="Full Stack Dev" company="Linear" status="Interview" date="Mar 10" />
                                        <AppRow role="React Developer" company="Notion" status="Offer" date="Mar 8" />
                                        <AppRow role="Product Engineer" company="Figma" status="Rejected" date="Mar 5" />
                                    </div>
                                </div>
                            </div>

                            {/* Right column (1/3) */}
                            <div className="flex flex-col gap-6">

                                {/* Recommended jobs */}
                                <div className="rounded-2xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-base font-normal" style={serif}>Matched Jobs</h2>
                                        <button className="text-xs" style={{ color: C.accent2, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>See all</button>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <JobCard company="Anthropic" role="Staff Engineer" location="SF / Remote" match={94} logo="🤖" remote />
                                        <JobCard company="Linear" role="Frontend Dev" location="Remote" match={88} logo="⚡" remote />
                                        <JobCard company="Figma" role="SWE II" location="New York" match={81} logo="🎨" />
                                    </div>
                                </div>

                                {/* Interview prep */}
                                <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(124,106,247,0.1),rgba(124,106,247,0.03))", border: "1px solid rgba(124,106,247,0.2)" }}>
                                    <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(124,106,247,0.5),transparent)" }} />
                                    <div className="text-2xl mb-3">💬</div>
                                    <h3 className="text-base font-normal mb-1" style={serif}>Interview Prep AI</h3>
                                    <p className="text-xs leading-relaxed mb-4" style={{ color: C.muted }}>Practice with mock interviews tailored to your target roles. Get AI feedback on your answers.</p>
                                    <div className="flex flex-col gap-2 mb-4">
                                        {["Behavioural questions", "System design", "Coding challenges"].map((t) => (
                                            <div key={t} className="flex items-center gap-2 text-xs" style={{ color: C.muted }}>
                                                <span style={{ color: C.green }}>✓</span> {t}
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-2.5 rounded-xl text-xs font-medium text-white transition-all duration-200"
                                        style={{ background: C.accent, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = C.accent2)}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
                                    >Start a session →</button>
                                </div>

                                {/* Activity feed */}
                                <div className="rounded-2xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                                    <h2 className="text-base font-normal mb-4" style={serif}>Recent Activity</h2>
                                    <div className="flex flex-col gap-4">
                                        <ActivityItem icon="📊" text="Your resume score improved by 8 points after AI optimisation." time="2 hours ago" accent={C.accent} />
                                        <ActivityItem icon="📬" text="Applied to Staff Engineer at Anthropic." time="5 hours ago" accent={C.green} />
                                        <ActivityItem icon="💬" text="Interview scheduled with Linear for Friday." time="Yesterday" accent={C.gold} />
                                        <ActivityItem icon="🎯" text="12 new job matches based on your updated profile." time="2 days ago" accent={C.pink} />
                                    </div>
                                </div>

                                {/* Quick links */}
                                <div className="rounded-2xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                                    <h2 className="text-base font-normal mb-3" style={serif}>Quick Actions</h2>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { icon: "📄", label: "New Resume" },
                                            { icon: "🔍", label: "Find Jobs" },
                                            { icon: "📊", label: "Check Score" },
                                            { icon: "📈", label: "Analytics" },
                                        ].map((a) => (
                                            <button key={a.label} className="flex flex-col items-center gap-2 py-3 rounded-xl text-xs transition-all duration-150"
                                                style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.muted, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = C.surface3; e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.border2; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = C.surface2; e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; }}
                                            >
                                                <span className="text-lg">{a.icon}</span>
                                                {a.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}