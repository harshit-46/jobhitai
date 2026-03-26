import { useState, useEffect } from "react";

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

// ── Static Data ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { icon: "⬛", label: "Overview", id: "overview" },
    { icon: "📄", label: "My Resumes", id: "resumes" },
    { icon: "🎯", label: "Job Matches", id: "jobs" },
    { icon: "📊", label: "Applications", id: "applications" },
    { icon: "💬", label: "Interview Prep", id: "interview" },
    { icon: "📈", label: "Analytics", id: "analytics" },
];

const STAT_CARDS = [
    {
        label: "Resume Score",
        value: "84",
        unit: "/100",
        delta: "+12 pts this week",
        positive: true,
        gradient: "linear-gradient(135deg,rgba(124,106,247,0.15),rgba(124,106,247,0.04))",
        border: "rgba(124,106,247,0.3)",
        accent: "#a599ff",
        icon: "🧠",
        iconBg: "rgba(124,106,247,0.12)",
        iconBorder: "rgba(124,106,247,0.2)",
    },
    {
        label: "Applications Sent",
        value: "47",
        unit: "",
        delta: "+8 this week",
        positive: true,
        gradient: "linear-gradient(135deg,rgba(63,216,152,0.12),rgba(63,216,152,0.03))",
        border: "rgba(63,216,152,0.25)",
        accent: "#3fd898",
        icon: "⚡",
        iconBg: "rgba(63,216,152,0.1)",
        iconBorder: "rgba(63,216,152,0.2)",
    },
    {
        label: "Interview Calls",
        value: "6",
        unit: "",
        delta: "3 pending reply",
        positive: true,
        gradient: "linear-gradient(135deg,rgba(240,192,96,0.12),rgba(240,192,96,0.03))",
        border: "rgba(240,192,96,0.25)",
        accent: "#f0c060",
        icon: "🎯",
        iconBg: "rgba(240,192,96,0.1)",
        iconBorder: "rgba(240,192,96,0.2)",
    },
    {
        label: "Response Rate",
        value: "38",
        unit: "%",
        delta: "-2% vs last month",
        positive: false,
        gradient: "linear-gradient(135deg,rgba(240,96,166,0.12),rgba(240,96,166,0.03))",
        border: "rgba(240,96,166,0.25)",
        accent: "#f067a6",
        icon: "📊",
        iconBg: "rgba(240,96,166,0.1)",
        iconBorder: "rgba(240,96,166,0.2)",
    },
];

const APPLICATIONS = [
    { company: "Stripe", role: "Senior Frontend Engineer", score: 91, status: "Interview", statusColor: "#3fd898", statusBg: "rgba(63,216,152,0.1)", statusBorder: "rgba(63,216,152,0.2)", date: "2 days ago", initials: "S", grad: "linear-gradient(135deg,#7c6af7,#5c4ed4)" },
    { company: "Notion", role: "Product Engineer", score: 78, status: "Applied", statusColor: "#f0c060", statusBg: "rgba(240,192,96,0.1)", statusBorder: "rgba(240,192,96,0.2)", date: "4 days ago", initials: "N", grad: "linear-gradient(135deg,#3fd898,#2ab87a)" },
    { company: "Linear", role: "Full Stack Developer", score: 85, status: "Viewed", statusColor: "#a599ff", statusBg: "rgba(124,106,247,0.1)", statusBorder: "rgba(124,106,247,0.2)", date: "5 days ago", initials: "L", grad: "linear-gradient(135deg,#f0c060,#e8a030)" },
    { company: "Vercel", role: "DX Engineer", score: 94, status: "Interview", statusColor: "#3fd898", statusBg: "rgba(63,216,152,0.1)", statusBorder: "rgba(63,216,152,0.2)", date: "1 week ago", initials: "V", grad: "linear-gradient(135deg,#f067a6,#d04080)" },
    { company: "Figma", role: "Software Engineer II", score: 72, status: "Rejected", statusColor: "#7b7a92", statusBg: "rgba(123,122,146,0.1)", statusBorder: "rgba(123,122,146,0.15)", date: "1 week ago", initials: "F", grad: "linear-gradient(135deg,#7c6af7,#3fd898)" },
];

const JOB_MATCHES = [
    { company: "Loom", role: "Senior React Engineer", location: "Remote", salary: "$140k–$175k", match: 96, tags: ["React", "TypeScript", "GraphQL"], grad: "linear-gradient(135deg,#f067a6,#d04080)" },
    { company: "Retool", role: "Frontend Platform Eng.", location: "SF / Remote", salary: "$130k–$160k", match: 89, tags: ["React", "Node.js", "Postgres"], grad: "linear-gradient(135deg,#f0c060,#e8a030)" },
    { company: "PlanetScale", role: "Developer Advocate", location: "Remote", salary: "$120k–$150k", match: 83, tags: ["APIs", "MySQL", "Content"], grad: "linear-gradient(135deg,#3fd898,#2ab87a)" },
];

const SCORE_BARS = [
    { name: "Keywords", val: 88, gradient: "linear-gradient(90deg,#7c6af7,#a599ff)" },
    { name: "Skills", val: 76, gradient: "linear-gradient(90deg,#7c6af7,#3fd898)" },
    { name: "Impact", val: 82, gradient: "linear-gradient(90deg,#f0c060,#f067a6)" },
    { name: "Format", val: 92, gradient: "linear-gradient(90deg,#3fd898,#7c6af7)" },
];

const WEEKLY_ACTIVITY = [
    { day: "Mon", apps: 6, height: 40 },
    { day: "Tue", apps: 11, height: 73 },
    { day: "Wed", apps: 8, height: 53 },
    { day: "Thu", apps: 14, height: 93 },
    { day: "Fri", apps: 9, height: 60 },
    { day: "Sat", apps: 3, height: 20 },
    { day: "Sun", apps: 5, height: 33 },
];

const RESUMES = [
    { name: "Senior Dev — General", score: 84, updated: "Today", tag: "Active", tagColor: "#3fd898", tagBg: "rgba(63,216,152,0.1)", tagBorder: "rgba(63,216,152,0.2)" },
    { name: "Stripe — Frontend Eng.", score: 91, updated: "2 days ago", tag: "Tailored", tagColor: "#a599ff", tagBg: "rgba(124,106,247,0.1)", tagBorder: "rgba(124,106,247,0.2)" },
    { name: "PM Role — Product", score: 68, updated: "1 week ago", tag: "Draft", tagColor: "#7b7a92", tagBg: "rgba(123,122,146,0.08)", tagBorder: "rgba(123,122,146,0.15)" },
];

// ── Shared Styles (mirroring landing page) ─────────────────────────────────────
const serif = { fontFamily: "'Instrument Serif', serif" };
const serifItalic = { fontFamily: "'Instrument Serif', serif", fontStyle: "italic" };
const body = { fontFamily: "'DM Sans', sans-serif", background: "#09090f", color: "#f0eff8" };

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive }) {
    return (
        <aside
            className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-40"
            style={{ background: "#0d0d14", borderRight: "1px solid rgba(255,255,255,0.07)" }}
        >
            {/* Logo */}
            <div className="px-7 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <span style={{ ...serif, fontSize: "1.4rem", letterSpacing: "-0.02em", color: "#f0eff8" }}>
                    JobHit<span style={{ color: "#a599ff" }}>AI</span>
                </span>
            </div>

            {/* User pill */}
            <div className="mx-4 mt-5 mb-2 p-3 rounded-2xl flex items-center gap-3" style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                    style={{ background: "linear-gradient(135deg,#7c6af7,#5c4ed4)" }}
                >
                    R
                </div>
                <div className="min-w-0">
                    <div className="text-sm font-medium truncate" style={{ letterSpacing: "-0.01em" }}>Rahul Verma</div>
                    <div className="text-xs truncate" style={{ color: "#4a4963" }}>Pro Plan</div>
                </div>
                <div className="ml-auto shrink-0 w-2 h-2 rounded-full" style={{ background: "#3fd898", boxShadow: "0 0 6px #3fd898" }} />
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 mt-3 flex flex-col gap-0.5">
                {NAV_ITEMS.map((item) => {
                    const isActive = active === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActive(item.id)}
                            className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-150"
                            style={{
                                background: isActive ? "rgba(124,106,247,0.12)" : "transparent",
                                color: isActive ? "#a599ff" : "#7b7a92",
                                border: isActive ? "1px solid rgba(124,106,247,0.2)" : "1px solid transparent",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "#f0eff8"; } }}
                            onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#7b7a92"; } }}
                        >
                            <span className="text-base">{item.icon}</span>
                            {item.label}
                            {isActive && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#7c6af7" }} />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom actions */}
            <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-150"
                    style={{ color: "#7b7a92", background: "transparent", border: "none", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#f0eff8"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#7b7a92"; e.currentTarget.style.background = "transparent"; }}
                >
                    <span>⚙️</span> Settings
                </button>
            </div>
        </aside>
    );
}

// ── Top Bar ────────────────────────────────────────────────────────────────────
function Topbar() {
    return (
        <header
            className="fixed top-0 right-0 z-30 flex items-center justify-between px-8 py-4"
            style={{ left: 256, background: "rgba(9,9,15,0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
            <div>
                <h1 className="text-lg font-medium" style={{ ...serif, letterSpacing: "-0.02em" }}>
                    Good morning, <em style={serifItalic}>Rahul</em> 👋
                </h1>
                <p className="text-xs mt-0.5" style={{ color: "#4a4963" }}>Here's what's happening with your job search today.</p>
            </div>

            <div className="flex items-center gap-3">
                {/* Search */}
                <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                    style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", color: "#4a4963" }}
                >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <circle cx="5.5" cy="5.5" r="4.5" stroke="#4a4963" strokeWidth="1.2" />
                        <path d="M9 9l2.5 2.5" stroke="#4a4963" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    Search jobs, resumes…
                </div>

                {/* Notification */}
                <button
                    className="relative w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-150"
                    style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", color: "#7b7a92", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#f0eff8"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#7b7a92"; }}
                >
                    🔔
                    <span
                        className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                        style={{ background: "#f067a6", boxShadow: "0 0 4px #f067a6" }}
                    />
                </button>

                {/* CTA */}
                <button
                    className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-white transition-all duration-150"
                    style={{ background: "#7c6af7", boxShadow: "0 4px 20px rgba(124,106,247,0.35)", border: "none", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#a599ff"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#7c6af7"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                    + New Resume
                </button>
            </div>
        </header>
    );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, unit, delta, positive, gradient, border, accent, icon, iconBg, iconBorder }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className="relative rounded-2xl p-6 overflow-hidden transition-transform duration-200"
            style={{ background: gradient, border: `1px solid ${hovered ? border : "rgba(255,255,255,0.07)"}`, cursor: "default" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {hovered && (
                <div className="absolute top-0 left-6 right-6" style={{ height: 1, background: `linear-gradient(90deg,transparent,${accent},transparent)` }} />
            )}
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: iconBg, border: `1px solid ${iconBorder}` }}>
                    {icon}
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ color: positive ? "#3fd898" : "#f067a6", background: positive ? "rgba(63,216,152,0.08)" : "rgba(240,96,166,0.08)", border: `1px solid ${positive ? "rgba(63,216,152,0.2)" : "rgba(240,96,166,0.2)"}` }}>
                    {positive ? "↑" : "↓"} {delta}
                </span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-4xl font-normal" style={{ ...serif, letterSpacing: "-0.04em", color: "#f0eff8" }}>{value}</span>
                {unit && <span className="text-base" style={{ color: "#4a4963" }}>{unit}</span>}
            </div>
            <div className="text-xs mt-1 uppercase tracking-widest" style={{ color: "#4a4963" }}>{label}</div>
        </div>
    );
}

// ── Resume Score Ring ──────────────────────────────────────────────────────────
function ScoreRing({ score = 84, size = 110, stroke = 8 }) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - score / 100);
    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
                <defs>
                    <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7c6af7" />
                        <stop offset="100%" stopColor="#3fd898" />
                    </linearGradient>
                </defs>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#rg)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-normal leading-none" style={{ ...serif, letterSpacing: "-0.04em" }}>{score}</span>
                <span className="text-xs" style={{ color: "#4a4963" }}>/100</span>
            </div>
        </div>
    );
}

// ── Overview Page ──────────────────────────────────────────────────────────────
function Overview() {
    return (
        <div className="flex flex-col gap-6">
            {/* AI Tip Banner */}
            <div
                className="relative rounded-2xl px-6 py-4 flex items-center gap-4 overflow-hidden"
                style={{ background: "rgba(124,106,247,0.08)", border: "1px solid rgba(124,106,247,0.2)" }}
            >
                <div className="absolute top-0 left-1/3 right-1/3" style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(124,106,247,0.6),transparent)" }} />
                <span className="text-2xl shrink-0">💡</span>
                <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium" style={{ color: "#a599ff" }}>AI Tip: </span>
                    <span className="text-sm" style={{ color: "#7b7a92" }}>Add "distributed systems" and "CI/CD" to your skills section to boost your Stripe match score by ~14 pts.</span>
                </div>
                <button
                    className="shrink-0 text-xs px-4 py-1.5 rounded-full transition-all duration-150"
                    style={{ background: "rgba(124,106,247,0.15)", border: "1px solid rgba(124,106,247,0.25)", color: "#a599ff", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,106,247,0.25)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(124,106,247,0.15)"; }}
                >
                    Fix now →
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {STAT_CARDS.map((s) => <StatCard key={s.label} {...s} />)}
            </div>

            {/* Middle Row: Applications + Score */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* Applications Table */}
                <div className="xl:col-span-2 rounded-2xl overflow-hidden" style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        <h2 className="text-sm font-medium" style={{ letterSpacing: "-0.01em" }}>Recent Applications</h2>
                        <button className="text-xs transition-colors duration-150" style={{ color: "#7b7a92", background: "none", border: "none", cursor: "pointer" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#a599ff")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#7b7a92")}>
                            View all →
                        </button>
                    </div>
                    <div className="flex flex-col">
                        {APPLICATIONS.map((app, i) => (
                            <ApplicationRow key={app.company} app={app} last={i === APPLICATIONS.length - 1} />
                        ))}
                    </div>
                </div>

                {/* Resume Score Panel */}
                <div className="rounded-2xl p-6 flex flex-col" style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-sm font-medium" style={{ letterSpacing: "-0.01em" }}>Resume Score</h2>
                        <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(63,216,152,0.08)", border: "1px solid rgba(63,216,152,0.2)", color: "#3fd898" }}>Live</span>
                    </div>

                    <div className="flex justify-center my-2">
                        <ScoreRing score={84} />
                    </div>

                    <div className="mt-5 flex flex-col gap-3">
                        {SCORE_BARS.map((b) => (
                            <div key={b.name} className="flex items-center gap-3">
                                <span className="text-xs w-16 shrink-0" style={{ color: "#7b7a92" }}>{b.name}</span>
                                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                                    <div className="h-full rounded-full" style={{ width: `${b.val}%`, background: b.gradient }} />
                                </div>
                                <span className="text-xs w-6 text-right" style={{ color: "#7b7a92" }}>{b.val}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        className="mt-5 w-full py-2.5 rounded-full text-sm font-medium transition-all duration-150"
                        style={{ background: "rgba(124,106,247,0.12)", border: "1px solid rgba(124,106,247,0.2)", color: "#a599ff", cursor: "pointer" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,106,247,0.2)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(124,106,247,0.12)"; }}
                    >
                        Improve with AI →
                    </button>
                </div>
            </div>

            {/* Bottom Row: Job Matches + Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* Job Matches */}
                <div className="xl:col-span-2 rounded-2xl overflow-hidden" style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        <h2 className="text-sm font-medium" style={{ letterSpacing: "-0.01em" }}>Top Job Matches</h2>
                        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(124,106,247,0.08)", border: "1px solid rgba(124,106,247,0.15)", color: "#a599ff" }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#3fd898", boxShadow: "0 0 5px #3fd898" }} />
                            AI Curated
                        </div>
                    </div>
                    <div className="flex flex-col gap-0">
                        {JOB_MATCHES.map((job, i) => (
                            <JobMatchRow key={job.company} job={job} last={i === JOB_MATCHES.length - 1} />
                        ))}
                    </div>
                </div>

                {/* Weekly Activity */}
                <div className="rounded-2xl p-6" style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <h2 className="text-sm font-medium mb-1" style={{ letterSpacing: "-0.01em" }}>Weekly Activity</h2>
                    <p className="text-xs mb-6" style={{ color: "#4a4963" }}>Applications sent this week</p>

                    <div className="flex items-end gap-2 h-24">
                        {WEEKLY_ACTIVITY.map((d) => (
                            <div key={d.day} className="flex flex-col items-center flex-1 gap-1.5">
                                <div
                                    className="w-full rounded-md transition-all duration-200"
                                    style={{ height: `${d.height}%`, background: d.day === "Thu" ? "linear-gradient(180deg,#7c6af7,#5c4ed4)" : "rgba(124,106,247,0.2)", cursor: "pointer" }}
                                    onMouseEnter={(e) => { if (d.day !== "Thu") e.currentTarget.style.background = "rgba(124,106,247,0.4)"; }}
                                    onMouseLeave={(e) => { if (d.day !== "Thu") e.currentTarget.style.background = "rgba(124,106,247,0.2)"; }}
                                />
                                <span className="text-xs" style={{ color: d.day === "Thu" ? "#a599ff" : "#4a4963" }}>{d.day}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 pt-5 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                        <div>
                            <div className="text-2xl font-normal" style={{ ...serif, letterSpacing: "-0.04em" }}>56 <span style={{ color: "#4a4963", fontSize: "0.9rem" }}>total</span></div>
                            <div className="text-xs mt-0.5 uppercase tracking-widest" style={{ color: "#4a4963" }}>This Month</div>
                        </div>
                        <div className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(63,216,152,0.08)", border: "1px solid rgba(63,216,152,0.2)", color: "#3fd898" }}>↑ 23% vs last mo.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Application Row ────────────────────────────────────────────────────────────
function ApplicationRow({ app, last }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className="flex items-center gap-4 px-6 py-4 transition-colors duration-150"
            style={{ background: hovered ? "#16161f" : "transparent", borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold text-white shrink-0" style={{ background: app.grad }}>
                {app.initials}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ letterSpacing: "-0.01em" }}>{app.company}</div>
                <div className="text-xs truncate mt-0.5" style={{ color: "#7b7a92" }}>{app.role}</div>
            </div>

            {/* Score */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                <div className="w-14 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${app.score}%`, background: "linear-gradient(90deg,#7c6af7,#3fd898)" }} />
                </div>
                <span className="text-xs w-7" style={{ color: "#7b7a92" }}>{app.score}</span>
            </div>

            <span
                className="text-xs px-2.5 py-1 rounded-full shrink-0"
                style={{ background: app.statusBg, border: `1px solid ${app.statusBorder}`, color: app.statusColor }}
            >
                {app.status}
            </span>
            <span className="text-xs shrink-0 hidden sm:block" style={{ color: "#4a4963" }}>{app.date}</span>
        </div>
    );
}

// ── Job Match Row ──────────────────────────────────────────────────────────────
function JobMatchRow({ job, last }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className="flex items-center gap-4 px-6 py-4 transition-colors duration-150"
            style={{ background: hovered ? "#16161f" : "transparent", borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold text-white shrink-0" style={{ background: job.grad }}>
                {job.company[0]}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium" style={{ letterSpacing: "-0.01em" }}>{job.role}</div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs" style={{ color: "#7b7a92" }}>{job.company}</span>
                    <span className="text-xs" style={{ color: "#4a4963" }}>·</span>
                    <span className="text-xs" style={{ color: "#7b7a92" }}>{job.location}</span>
                    <span className="text-xs" style={{ color: "#4a4963" }}>·</span>
                    <span className="text-xs" style={{ color: "#f0c060" }}>{job.salary}</span>
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-semibold" style={{ color: job.match >= 90 ? "#3fd898" : "#a599ff", ...serif }}>{job.match}%</span>
                <span className="text-xs" style={{ color: "#4a4963" }}>match</span>
            </div>
            <button
                className="hidden sm:block text-xs px-4 py-1.5 rounded-full transition-all duration-150 shrink-0"
                style={{ background: "rgba(124,106,247,0.1)", border: "1px solid rgba(124,106,247,0.2)", color: "#a599ff", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,106,247,0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(124,106,247,0.1)"; }}
            >
                Apply →
            </button>
        </div>
    );
}

// ── Resumes Page ───────────────────────────────────────────────────────────────
function Resumes() {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-end justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a599ff" }}>
                        <span className="inline-block w-5" style={{ height: 1, background: "#7c6af7" }} />
                        My Resumes
                    </div>
                    <h2 className="text-3xl font-normal" style={{ ...serif, letterSpacing: "-0.025em" }}>
                        All <em style={serifItalic}>versions</em>
                    </h2>
                </div>
                <button
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all duration-150"
                    style={{ background: "linear-gradient(135deg,#7c6af7,#5c4ed4)", boxShadow: "0 4px 20px rgba(124,106,247,0.35)", border: "none", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                >
                    + New Resume
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {RESUMES.map((r) => <ResumeCard key={r.name} resume={r} />)}
                {/* Add card */}
                <div
                    className="rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-150"
                    style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.12)", cursor: "pointer", minHeight: 180 }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(124,106,247,0.35)"; e.currentTarget.style.background = "rgba(124,106,247,0.04)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.background = "transparent"; }}
                >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "rgba(124,106,247,0.1)", border: "1px solid rgba(124,106,247,0.2)" }}>+</div>
                    <span className="text-sm" style={{ color: "#7b7a92" }}>Create new resume</span>
                </div>
            </div>

            {/* Upload zone */}
            <div
                className="rounded-2xl px-8 py-10 text-center transition-all duration-150"
                style={{ background: "rgba(124,106,247,0.04)", border: "1px dashed rgba(124,106,247,0.2)", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,106,247,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(124,106,247,0.04)"; }}
            >
                <div className="text-3xl mb-3">📎</div>
                <p className="text-sm font-medium mb-1" style={{ letterSpacing: "-0.01em" }}>Drop your existing resume here</p>
                <p className="text-xs" style={{ color: "#7b7a92" }}>PDF or DOCX — our AI will extract and structure your experience instantly.</p>
            </div>
        </div>
    );
}

function ResumeCard({ resume }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className="relative rounded-2xl p-6 overflow-hidden transition-colors duration-150"
            style={{ background: hovered ? "#16161f" : "#111118", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {hovered && (
                <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: "linear-gradient(90deg,transparent,#7c6af7,transparent)" }} />
            )}
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: "rgba(124,106,247,0.1)", border: "1px solid rgba(124,106,247,0.2)" }}>📄</div>
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: resume.tagBg, border: `1px solid ${resume.tagBorder}`, color: resume.tagColor }}>{resume.tag}</span>
            </div>
            <div className="text-sm font-medium mb-1" style={{ letterSpacing: "-0.01em" }}>{resume.name}</div>
            <div className="text-xs mb-4" style={{ color: "#4a4963" }}>Updated {resume.updated}</div>

            <div className="flex items-center gap-3">
                <ScoreRing score={resume.score} size={48} stroke={5} />
                <div>
                    <div className="text-xs uppercase tracking-widest" style={{ color: "#4a4963" }}>Match Score</div>
                    <div className="text-xs mt-0.5" style={{ color: resume.score >= 85 ? "#3fd898" : resume.score >= 70 ? "#f0c060" : "#f067a6" }}>
                        {resume.score >= 85 ? "Excellent" : resume.score >= 70 ? "Good" : "Needs work"}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Interview Prep Page ────────────────────────────────────────────────────────
const PREP_QUESTIONS = [
    { q: "Tell me about a time you led a complex technical project.", cat: "Behavioral", done: true },
    { q: "How do you approach debugging in a distributed system?", cat: "Technical", done: true },
    { q: "Describe your experience with CI/CD pipelines.", cat: "Technical", done: false },
    { q: "How do you handle conflicting priorities?", cat: "Behavioral", done: false },
];

function InterviewPrep() {
    const [current, setCurrent] = useState(null);
    return (
        <div className="flex flex-col gap-5">
            <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a599ff" }}>
                    <span className="inline-block w-5" style={{ height: 1, background: "#7c6af7" }} />
                    Interview Prep
                </div>
                <h2 className="text-3xl font-normal" style={{ ...serif, letterSpacing: "-0.025em" }}>
                    Practice with <em style={serifItalic}>AI mock</em> interviews
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Question Bank */}
                <div className="rounded-2xl overflow-hidden" style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        <div className="text-sm font-medium">Question Bank</div>
                        <div className="text-xs mt-0.5" style={{ color: "#4a4963" }}>Tailored to Stripe — Frontend Engineer</div>
                    </div>
                    {PREP_QUESTIONS.map((q, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-3 px-6 py-4 transition-colors duration-150"
                            style={{ borderBottom: i < PREP_QUESTIONS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", cursor: "pointer", background: current === i ? "#16161f" : "transparent" }}
                            onClick={() => setCurrent(i)}
                            onMouseEnter={(e) => { if (current !== i) e.currentTarget.style.background = "#16161f"; }}
                            onMouseLeave={(e) => { if (current !== i) e.currentTarget.style.background = "transparent"; }}
                        >
                            <span className="mt-0.5 shrink-0" style={{ color: q.done ? "#3fd898" : "#4a4963" }}>{q.done ? "✓" : "○"}</span>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm leading-snug" style={{ color: q.done ? "#7b7a92" : "#f0eff8" }}>{q.q}</div>
                                <span className="text-xs mt-1 inline-block px-2 py-0.5 rounded-full" style={{ background: "rgba(124,106,247,0.08)", border: "1px solid rgba(124,106,247,0.15)", color: "#a599ff" }}>{q.cat}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* AI Practice Panel */}
                <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: "rgba(124,106,247,0.12)", border: "1px solid rgba(124,106,247,0.2)" }}>🤖</div>
                        <div>
                            <div className="text-sm font-medium">AI Interviewer</div>
                            <div className="text-xs" style={{ color: "#4a4963" }}>GPT-powered feedback on tone, clarity & content</div>
                        </div>
                    </div>

                    <div className="flex-1 rounded-xl p-4 text-sm leading-relaxed" style={{ background: "#09090f", border: "1px solid rgba(255,255,255,0.07)", color: "#7b7a92", minHeight: 140 }}>
                        {current !== null
                            ? <><span style={{ color: "#a599ff" }}>Question:</span> {PREP_QUESTIONS[current].q}</>
                            : <span style={{ color: "#4a4963" }}>Select a question from the bank to begin your practice session.</span>}
                    </div>

                    <textarea
                        className="w-full rounded-xl p-4 text-sm resize-none outline-none transition-all duration-150"
                        style={{ background: "#09090f", border: "1px solid rgba(255,255,255,0.07)", color: "#f0eff8", minHeight: 100, fontFamily: "'DM Sans', sans-serif" }}
                        placeholder="Type your answer here…"
                        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(124,106,247,0.3)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
                    />

                    <button
                        className="w-full py-3 rounded-full text-sm font-medium text-white transition-all duration-150"
                        style={{ background: "linear-gradient(135deg,#7c6af7,#5c4ed4)", boxShadow: "0 4px 20px rgba(124,106,247,0.3)", border: "none", cursor: "pointer" }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                        Get AI Feedback →
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Sessions Done", value: "14", accent: "#a599ff", bg: "rgba(124,106,247,0.08)", border: "rgba(124,106,247,0.2)" },
                    { label: "Avg Confidence", value: "73%", accent: "#3fd898", bg: "rgba(63,216,152,0.08)", border: "rgba(63,216,152,0.2)" },
                    { label: "Sessions Left", value: "6", accent: "#f0c060", bg: "rgba(240,192,96,0.08)", border: "rgba(240,192,96,0.2)" },
                ].map((s) => (
                    <div key={s.label} className="rounded-2xl p-5 text-center" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                        <div className="text-3xl font-normal mb-1" style={{ ...serif, letterSpacing: "-0.04em", color: s.accent }}>{s.value}</div>
                        <div className="text-xs uppercase tracking-widest" style={{ color: "#4a4963" }}>{s.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Page Content Router ────────────────────────────────────────────────────────
function PageContent({ active }) {
    if (active === "resumes") return <Resumes />;
    if (active === "interview") return <InterviewPrep />;
    return <Overview />;
}

// ── Root Dashboard ─────────────────────────────────────────────────────────────
export default function Dashboard() {
    const [active, setActive] = useState("overview");

    return (
        <>
            <FontLoader />
            <style>{`
                * { box-sizing: border-box; margin: 0; padding: 0; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(124,106,247,0.2); border-radius: 2px; }
                body { background: #09090f; }
            `}</style>

            <div style={{ ...body, minHeight: "100vh", display: "flex" }}>
                {/* Ambient orbs */}
                <div className="fixed rounded-full pointer-events-none" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(124,106,247,0.1) 0%,transparent 70%)", top: -150, left: 64, filter: "blur(80px)", zIndex: 0 }} />
                <div className="fixed rounded-full pointer-events-none" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(63,216,152,0.06) 0%,transparent 70%)", bottom: "5%", right: "10%", filter: "blur(80px)", zIndex: 0 }} />

                <Sidebar active={active} setActive={setActive} />
                <Topbar />

                {/* Main */}
                <main style={{ marginLeft: 256, paddingTop: 73, flex: 1, minHeight: "100vh", position: "relative", zIndex: 10 }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px" }}>
                        <PageContent active={active} />
                    </div>
                </main>
            </div>
        </>
    );
}




/*


import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user , logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div>
            <h1>This is the Dashboard 🔥</h1>
            <p>Welcome, {user.name}!</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;


*/