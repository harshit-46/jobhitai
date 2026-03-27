import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

const NAV_LINKS = ["Features", "How it works", "Pricing"];

const STATS = [
    { num: "2.4M+", label: "Resumes Built" },
    { num: "89%", label: "Interview Rate" },
    { num: "140K+", label: "Jobs Applied" },
    { num: "4.9★", label: "User Rating" },
];

const FEATURES = [
    {
        icon: "🧠",
        iconBg: "rgba(124,106,247,0.12)",
        iconBorder: "rgba(124,106,247,0.2)",
        title: "AI Resume Builder",
        desc: "Create tailored, ATS-optimized resumes in minutes. Our AI adapts your content to match any job description perfectly.",
    },
    {
        icon: "📊",
        iconBg: "rgba(63,216,152,0.1)",
        iconBorder: "rgba(63,216,152,0.2)",
        title: "Resume Score Engine",
        desc: "Get a real-time match score against job postings, with line-by-line suggestions to boost your chances dramatically.",
    },
    {
        icon: "🎯",
        iconBg: "rgba(240,192,96,0.1)",
        iconBorder: "rgba(240,192,96,0.2)",
        title: "Smart Job Matching",
        desc: "AI curates roles that align with your skills, experience, and preferences — no more scrolling through irrelevant listings.",
    },
    {
        icon: "⚡",
        iconBg: "rgba(240,96,166,0.1)",
        iconBorder: "rgba(240,96,166,0.2)",
        title: "One-Click Apply",
        desc: "Apply to hundreds of positions instantly. Auto-fill forms, attach the right resume version, and track every submission.",
    },
    {
        icon: "💬",
        iconBg: "rgba(124,106,247,0.12)",
        iconBorder: "rgba(124,106,247,0.2)",
        title: "Interview Prep AI",
        desc: "Practice with AI mock interviews tailored to the company and role. Get feedback on answers, tone, and confidence.",
    },
    {
        icon: "📈",
        iconBg: "rgba(63,216,152,0.1)",
        iconBorder: "rgba(63,216,152,0.2)",
        title: "Career Analytics",
        desc: "Track applications, response rates, and salary benchmarks. Data-driven insights to refine your job search strategy.",
    },
];

const SCORE_BARS = [
    { name: "Keywords", val: 88, gradient: "linear-gradient(90deg,#7c6af7,#a599ff)" },
    { name: "Skills", val: 76, gradient: "linear-gradient(90deg,#7c6af7,#3fd898)" },
    { name: "Impact", val: 82, gradient: "linear-gradient(90deg,#f0c060,#f067a6)" },
    { name: "Format", val: 92, gradient: "linear-gradient(90deg,#3fd898,#7c6af7)" },
];

const HOW_STEPS = [
    { n: "1", title: "Create Your Profile", desc: "Upload your existing resume or start fresh. Our AI extracts and structures your experience instantly." },
    { n: "2", title: "Build & Score", desc: "Craft a tailored resume for each role and see your match score update in real time as you edit." },
    { n: "3", title: "Discover Jobs", desc: "Browse AI-curated listings that match your profile, or paste any job URL to get an instant analysis." },
    { n: "4", title: "Apply & Track", desc: "Submit with one click and manage all your applications from a single beautiful dashboard." },
];

const TESTIMONIALS = [
    { initial: "P", grad: "linear-gradient(135deg,#7c6af7,#5c4ed4)", name: "Priya Sharma", role: "Software Engineer, Bangalore", text: "JobHitAI transformed my resume overnight. Got 3 interview calls within a week. The score feedback is incredibly specific." },
    { initial: "M", grad: "linear-gradient(135deg,#3fd898,#2ab87a)", name: "Marcus Chen", role: "Product Manager, San Francisco", text: "I was applying to 50 jobs a week manually. Now I let JobHitAI handle the matching and focus only on interviews. Total game changer." },
    { initial: "A", grad: "linear-gradient(135deg,#f0c060,#e8a030)", name: "Amira Hassan", role: "Data Analyst, London", text: "The interview prep feature alone is worth the subscription. I went from blanking on questions to feeling genuinely confident." },
    { initial: "R", grad: "linear-gradient(135deg,#f067a6,#d04080)", name: "Rahul Verma", role: "ML Engineer, Hyderabad", text: "Jumped from 32% to 87% ATS score with AI suggestions. Landed a FAANG role within 6 weeks." },
    { initial: "S", grad: "linear-gradient(135deg,#7c6af7,#3fd898)", name: "Sofia Lopes", role: "UX Designer, Lisbon", text: "Finally a platform that tailors resumes per job. The AI tailoring is insanely good. Highly recommend!" },
];

const PLANS = [
    {
        name: "Starter", price: "0", period: "Free forever", featured: false, cta: "Get started free",
        features: [
            { text: "3 resume builds/month", on: true },
            { text: "Basic ATS score", on: true },
            { text: "5 job applications", on: true },
            { text: "AI tailoring engine", on: false },
            { text: "Interview prep", on: false },
            { text: "Analytics dashboard", on: false },
        ],
    },
    {
        name: "Pro", price: "19", period: "per month, billed monthly", featured: true, cta: "Start Pro trial →",
        features: [
            { text: "Unlimited resume builds", on: true },
            { text: "Full AI score engine", on: true },
            { text: "Unlimited applications", on: true },
            { text: "AI tailoring engine", on: true },
            { text: "Interview prep (20 sessions)", on: true },
            { text: "Analytics dashboard", on: true },
        ],
    },
    {
        name: "Teams", price: "49", period: "per seat / month", featured: false, cta: "Contact sales",
        features: [
            { text: "Everything in Pro", on: true },
            { text: "Team collaboration", on: true },
            { text: "Recruiter dashboard", on: true },
            { text: "Bulk resume screening", on: true },
            { text: "Priority support", on: true },
            { text: "Custom integrations", on: true },
        ],
    },
];

const styles = {
    body: {
        background: "#09090f",
        color: "#f0eff8",
        fontFamily: "'DM Sans', sans-serif",
        overflowX: "hidden",
    },
    noise: {
        backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        opacity: 0.028,
    },
    orb1: { width: 600, height: 600, background: "radial-gradient(circle, rgba(124,106,247,0.14) 0%, transparent 70%)", top: -200, left: -150 },
    orb2: { width: 500, height: 500, background: "radial-gradient(circle, rgba(240,192,96,0.08) 0%, transparent 70%)", top: "40%", right: -200 },
    orb3: { width: 400, height: 400, background: "radial-gradient(circle, rgba(63,216,152,0.07) 0%, transparent 70%)", bottom: "10%", left: "20%" },
    heroTitle: { fontFamily: "'Instrument Serif', serif", fontSize: "clamp(3rem,7vw,5.8rem)", lineHeight: 1.05, letterSpacing: "-0.03em" },
    serif: { fontFamily: "'Instrument Serif', serif" },
    serifItalic: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic" },
    glowBtn: { boxShadow: "0 4px 30px rgba(124,106,247,0.4), 0 0 0 1px rgba(124,106,247,0.3)" },
    navGlow: { boxShadow: "0 0 20px rgba(124,106,247,0.3)" },
    surface: { background: "#111118" },
    surface2: { background: "#16161f" },
    border: { borderColor: "rgba(255,255,255,0.07)" },
    border2: { borderColor: "rgba(255,255,255,0.12)" },
    accentLine: {
        content: "''",
        position: "absolute",
        bottom: 4,
        left: 0,
        right: 0,
        height: 2,
        background: "linear-gradient(90deg,#7c6af7,transparent)",
        borderRadius: 2,
    },
};



function Navbar() {
    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-5 backdrop-blur-xl border-b"
            style={{ background: "rgba(9,9,15,0.7)", borderColor: "rgba(255,255,255,0.07)" }}
        >
            <Link to="/"
            onClick={(e) => {
                e.preventDefault(); // stop route change
                window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{ ...styles.serif, fontSize: "1.5rem", letterSpacing: "-0.02em", color: "#f0eff8", textDecoration: "none" }}>
                JobHit<span style={{ color: "#a599ff" }}>AI</span>
            </Link>

            <ul className="hidden md:flex items-center gap-9 list-none">
                {NAV_LINKS.map((l) => (
                    <li key={l}>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                const id = l.toLowerCase().replace(/\s/g, "");
                                const el = document.getElementById(id);
                                if (el) {
                                    el.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                            className="text-sm transition-colors duration-200"
                            style={{ color: "#7b7a92", textDecoration: "none" }}
                            onMouseEnter={(e) => (e.target.style.color = "#f0eff8")}
                            onMouseLeave={(e) => (e.target.style.color = "#7b7a92")}
                        >
                            {l}
                        </a>
                    </li>
                ))}
                <li>
                    <Link
                        to="/login"
                        className="text-sm font-medium px-6 py-2 rounded-full text-white transition-all duration-200"
                        style={{ background: "#7c6af7", ...styles.navGlow, textDecoration: "none" }}
                        onMouseEnter={(e) => { e.target.style.background = "#a599ff"; e.target.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={(e) => { e.target.style.background = "#7c6af7"; e.target.style.transform = "translateY(0)"; }}
                    >
                        Get Started →
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

function Hero() {
    return (
        <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6" style={{ paddingTop: 140, paddingBottom: 80 }}>
            <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest mb-9"
                style={{ background: "rgba(124,106,247,0.1)", border: "1px solid rgba(124,106,247,0.25)", color: "#a599ff" }}
            >
                <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: "#3fd898", boxShadow: "0 0 8px #3fd898", animation: "pulse 2s infinite" }}
                />
                AI-Powered Career Platform
            </div>

            <h1 className="max-w-4xl mb-7 font-normal" style={styles.heroTitle}>
                Land your dream job
                <br />
                with{" "}
                <em className="relative not-italic" style={{ color: "#a599ff", fontStyle: "italic" }}>
                    AI precision
                    <span
                        className="absolute left-0 right-0 rounded-sm"
                        style={{ bottom: 4, height: 2, background: "linear-gradient(90deg,#7c6af7,transparent)" }}
                    />
                </em>
            </h1>

            <p className="text-lg max-w-xl mb-11 leading-relaxed font-light" style={{ color: "#7b7a92" }}>
                Build ATS-ready resumes, score against real job descriptions, and get personalized career coaching — all in one intelligent platform.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                    to="/login"
                    className="px-8 py-3.5 rounded-full text-white font-medium text-sm transition-all duration-200"
                    style={{ background: "linear-gradient(135deg,#7c6af7,#5c4ed4)", ...styles.glowBtn, textDecoration: "none" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 40px rgba(124,106,247,0.55),0 0 0 1px rgba(124,106,247,0.4)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = styles.glowBtn.boxShadow; }}
                >
                    Start for free &nbsp;→
                </Link>
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById("howitworks");
                        if (el) {
                            el.scrollIntoView({ behavior: "smooth" });
                        }
                    }}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm transition-all duration-200"
                    style={{ color: "#7b7a92", border: "1px solid rgba(255,255,255,0.12)", textDecoration: "none" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#f0eff8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#7b7a92"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.background = "transparent"; }}
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M5.5 5.5C5.5 4.7 6.1 4 7 4s1.5.7 1.5 1.5c0 .8-.6 1.2-1 1.5-.4.3-.5.5-.5.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        <circle cx="7" cy="10" r=".6" fill="currentColor" />
                    </svg>
                    See how it works
                </a>
            </div>

            <div
                className="flex flex-col sm:flex-row mt-16 rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.07)", background: "#111118" }}
            >
                {STATS.map((s, i) => (
                    <div
                        key={s.label}
                        className="px-10 py-6 text-center"
                        style={i < STATS.length - 1 ? { borderRight: "1px solid rgba(255,255,255,0.07)" } : {}}
                    >
                        <span className="block text-3xl" style={{ ...styles.serif, letterSpacing: "-0.03em", color: "#f0eff8" }}>
                            {s.num.replace(/[+%★]/g, (m) => "")}
                            <span style={{ color: "#a599ff" }}>{s.num.match(/[+%★]/)?.[0] ?? ""}</span>
                        </span>
                        <div className="text-xs uppercase tracking-widest mt-0.5" style={{ color: "#4a4963" }}>{s.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function Features() {
    return (
        <section id="features" className="relative z-10 max-w-6xl mx-auto px-12 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end mb-16">
                <div>
                    <SectionLabel>Features</SectionLabel>
                    <h2 className="text-4xl md:text-5xl font-normal mt-4 leading-tight" style={{ ...styles.serif, letterSpacing: "-0.025em" }}>
                        Everything you need to
                        <br />
                        <em style={styles.serifItalic}>get hired faster</em>
                    </h2>
                </div>
                <p className="text-base leading-relaxed font-light max-w-sm" style={{ color: "#7b7a92" }}>
                    From crafting the perfect resume to tracking every application, JobHitAI is your end-to-end career accelerator.
                </p>
            </div>

            <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
                {FEATURES.map((f) => (
                    <FeatureCard key={f.title} {...f} />
                ))}
            </div>
        </section>
    );
}

function FeatureCard({ icon, iconBg, iconBorder, title, desc }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className="relative p-9 overflow-hidden transition-colors duration-200"
            style={{ background: hovered ? "#16161f" : "#111118" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {hovered && (
                <div
                    className="absolute top-0 left-0 right-0"
                    style={{ height: 1, background: "linear-gradient(90deg,transparent,#7c6af7,transparent)" }}
                />
            )}
            <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-5"
                style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
            >
                {icon}
            </div>
            <h3 className="text-base font-medium mb-2.5" style={{ letterSpacing: "-0.01em" }}>{title}</h3>
            <p className="text-sm leading-relaxed font-light" style={{ color: "#7b7a92" }}>{desc}</p>
        </div>
    );
}

function ScoreDemo() {
    return (
        <section className="relative z-10 max-w-6xl mx-auto px-12 py-10 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
                <SectionLabel>Resume Scoring</SectionLabel>
                <h2 className="text-4xl md:text-5xl font-normal mt-4 mb-8 leading-tight" style={{ ...styles.serif, letterSpacing: "-0.025em" }}>
                    Know exactly <em style={styles.serifItalic}>where you stand</em>
                </h2>
                <p className="text-base leading-relaxed font-light mb-8" style={{ color: "#7b7a92" }}>
                    Our AI analyzes your resume against the job description, identifying gaps and strengths in seconds — not guesses.
                </p>
                <ul className="flex flex-col gap-3">
                    {["ATS keyword gap analysis", "Skills match percentage", "Tone & impact word scoring", "One-click AI improvements"].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm" style={{ color: "#7b7a92" }}>
                            <span
                                className="w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0"
                                style={{ background: "rgba(63,216,152,0.15)", border: "1px solid rgba(63,216,152,0.3)", color: "#3fd898", fontWeight: 700 }}
                            >✓</span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            <div
                className="relative rounded-3xl p-9 overflow-hidden"
                style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)" }}
            >
                <div className="absolute top-0 left-10 right-10" style={{ height: 1, background: "linear-gradient(90deg,transparent,#a599ff,transparent)" }} />

                <div className="flex items-center justify-between mb-7">
                    <div className="flex items-center gap-2.5">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                            style={{ background: "rgba(124,106,247,0.15)", border: "1px solid rgba(124,106,247,0.25)" }}
                        >📄</div>
                        <div>
                            <div className="text-sm font-medium" style={{ color: "#f0eff8" }}>senior_dev_resume.pdf</div>
                            <div className="text-xs mt-0.5" style={{ color: "#7b7a92" }}>Analysing against job #JD-4821</div>
                        </div>
                    </div>
                    <div className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(63,216,152,0.1)", border: "1px solid rgba(63,216,152,0.2)", color: "#3fd898" }}>Live</div>
                </div>

                <div className="flex justify-center my-8 relative">
                    <div className="relative w-36 h-36">
                        <svg viewBox="0 0 140 140" width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
                            <defs>
                                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#7c6af7" />
                                    <stop offset="100%" stopColor="#3fd898" />
                                </linearGradient>
                            </defs>
                            <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                            <circle cx="70" cy="70" r="60" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray="377" strokeDashoffset="75" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl" style={{ ...styles.serif, letterSpacing: "-0.04em", lineHeight: 1 }}>80</span>
                            <span className="text-xs uppercase tracking-widest mt-0.5" style={{ color: "#4a4963" }}>/ 100</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {SCORE_BARS.map((b) => (
                        <div key={b.name} className="flex items-center gap-3">
                            <span className="text-xs w-20 shrink-0" style={{ color: "#7b7a92" }}>{b.name}</span>
                            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                                <div className="h-full rounded-full" style={{ width: `${b.val}%`, background: b.gradient }} />
                            </div>
                            <span className="text-xs w-7 text-right" style={{ color: "#7b7a92" }}>{b.val}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-4 rounded-xl text-sm leading-relaxed" style={{ background: "rgba(124,106,247,0.08)", border: "1px solid rgba(124,106,247,0.15)", color: "#7b7a92" }}>
                    💡 <strong style={{ color: "#a599ff" }}>AI Tip:</strong> Add "distributed systems" and "CI/CD" to your skills section to boost your match score by ~14 points.
                </div>
            </div>
        </section>
    );
}

function HowItWorks() {
    return (
        <section id="howitworks" className="relative z-10 max-w-6xl mx-auto px-12 py-24 text-center">
            <SectionLabel>Process</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-normal mt-4 mb-4" style={{ ...styles.serif, letterSpacing: "-0.025em" }}>
                Get hired in <em style={styles.serifItalic}>four simple steps</em>
            </h2>
            <p className="text-base font-light max-w-md mx-auto" style={{ color: "#7b7a92" }}>
                From signup to offer letter — JobHitAI guides you through every step of your job search journey.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-16 relative">
                <div
                    className="hidden md:block absolute"
                    style={{ top: 28, left: "calc(12.5% + 20px)", right: "calc(12.5% + 20px)", height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.12),rgba(255,255,255,0.12),transparent)" }}
                />

                {HOW_STEPS.map((s, i) => (
                    <div key={s.n} className="relative z-10 flex flex-col items-center">
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-6"
                            style={{
                                border: i === 0 ? "1px solid #7c6af7" : "1px solid rgba(255,255,255,0.12)",
                                background: "#111118",
                                color: i === 0 ? "#a599ff" : "#7b7a92",
                                ...(i === 0 ? { boxShadow: "0 0 20px rgba(124,106,247,0.25)" } : {}),
                                ...styles.serif,
                            }}
                        >
                            {s.n}
                        </div>
                        <h3 className="text-base font-medium mb-2.5" style={{ letterSpacing: "-0.01em" }}>{s.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: "#7b7a92" }}>{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function Testimonials() {
    const doubled = [...TESTIMONIALS, ...TESTIMONIALS];
    return (
        <section className="relative z-10 py-24 overflow-hidden">
            <div className="max-w-6xl mx-auto px-12 text-center mb-14">
                <SectionLabel>Testimonials</SectionLabel>
                <h2 className="text-4xl md:text-5xl font-normal mt-4" style={{ ...styles.serif, letterSpacing: "-0.025em" }}>
                    Loved by <em style={styles.serifItalic}>job seekers</em> everywhere
                </h2>
            </div>

            <div className="overflow-hidden">
                <div
                    className="flex gap-5"
                    style={{ width: "max-content", animation: "scrollX 30s linear infinite" }}
                    onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
                    onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
                >
                    {doubled.map((t, i) => (
                        <div
                            key={i}
                            className="rounded-2xl p-7 shrink-0"
                            style={{ width: 320, background: "#111118", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            <div className="text-sm tracking-widest mb-3.5" style={{ color: "#f0c060" }}>★★★★★</div>
                            <p className="text-sm leading-relaxed font-light mb-5" style={{ color: "#7b7a92", fontStyle: "italic" }}>"{t.text}"</p>
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: t.grad }}>{t.initial}</div>
                                <div>
                                    <div className="text-sm font-medium">{t.name}</div>
                                    <div className="text-xs mt-0.5" style={{ color: "#4a4963" }}>{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Pricing() {
    return (
        <section id="pricing" className="relative z-10 max-w-5xl mx-auto px-12 py-24 text-center">
            <SectionLabel>Pricing</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-normal mt-4" style={{ ...styles.serif, letterSpacing: "-0.025em" }}>
                Simple, <em style={styles.serifItalic}>transparent</em> pricing
            </h2>
            <p className="text-base font-light mt-3 mx-auto" style={{ color: "#7b7a92" }}>
                Start free, upgrade when you're ready. No hidden fees, cancel anytime.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14 items-start">
                {PLANS.map((p) => (
                    <PricingCard key={p.name} {...p} />
                ))}
            </div>
        </section>
    );
}

function PricingCard({ name, price, period, featured, cta, features }) {
    return (
        <div
            className="relative rounded-2xl p-9 text-left transition-transform duration-200"
            style={{
                background: featured ? "linear-gradient(160deg,rgba(124,106,247,0.08) 0%,#111118 60%)" : "#111118",
                border: featured ? "1px solid rgba(124,106,247,0.4)" : "1px solid rgba(255,255,255,0.07)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
            {featured && (
                <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1 rounded-full"
                    style={{ background: "#7c6af7" }}
                >
                    Most Popular
                </div>
            )}
            <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7b7a92" }}>{name}</div>
            <div className="text-5xl font-normal" style={{ ...styles.serif, letterSpacing: "-0.04em" }}>
                <sup className="text-2xl align-super">$</sup>{price}
            </div>
            <div className="text-xs mb-6 mt-1" style={{ color: "#4a4963" }}>{period}</div>
            <div className="h-px mb-6" style={{ background: "rgba(255,255,255,0.07)" }} />
            <ul className="flex flex-col gap-2.5 mb-7">
                {features.map((f) => (
                    <li key={f.text} className="flex items-center gap-2.5 text-sm" style={{ color: f.on ? "#7b7a92" : "#4a4963" }}>
                        <span style={{ color: f.on ? "#3fd898" : "#4a4963", fontWeight: 700 }}>{f.on ? "✓" : "—"}</span>
                        {f.text}
                    </li>
                ))}
            </ul>
            <button
                className="w-full py-3 rounded-full text-sm font-medium cursor-pointer transition-all duration-200"
                style={
                    featured
                        ? { background: "#7c6af7", color: "#fff", border: "none", boxShadow: "0 4px 24px rgba(124,106,247,0.35)" }
                        : { background: "transparent", color: "#7b7a92", border: "1px solid rgba(255,255,255,0.12)" }
                }
                onMouseEnter={(e) => {
                    if (featured) { e.currentTarget.style.background = "#a599ff"; e.currentTarget.style.transform = "translateY(-1px)"; }
                    else { e.currentTarget.style.color = "#f0eff8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }
                }}
                onMouseLeave={(e) => {
                    if (featured) { e.currentTarget.style.background = "#7c6af7"; e.currentTarget.style.transform = "translateY(0)"; }
                    else { e.currentTarget.style.color = "#7b7a92"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }
                }}
            >
                {cta}
            </button>
        </div>
    );
}

function CTABand() {
    return (
        <div className="relative z-10 max-w-6xl mx-auto px-12 mb-20">
            <div
                className="relative rounded-3xl px-16 py-20 text-center overflow-hidden"
                style={{ background: "linear-gradient(135deg,rgba(124,106,247,0.12) 0%,rgba(124,106,247,0.04) 100%)", border: "1px solid rgba(124,106,247,0.2)" }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5" style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(124,106,247,0.6),transparent)" }} />
                <h2 className="text-4xl md:text-5xl font-normal mb-4" style={{ ...styles.serif, letterSpacing: "-0.03em" }}>
                    Ready to <em style={styles.serifItalic}>hit</em> your dream job?
                </h2>
                <p className="text-base font-light mb-10" style={{ color: "#7b7a92" }}>
                    Join over 2.4 million job seekers who've supercharged their careers with JobHitAI.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                    <Link
                        to="/signup"
                        className="px-8 py-3.5 rounded-full text-white font-medium text-sm transition-all duration-200"
                        style={{ background: "linear-gradient(135deg,#7c6af7,#5c4ed4)", ...styles.glowBtn, textDecoration: "none" }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                        Create your free account →
                    </Link>
                    <a
                        href="#"
                        className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm transition-all duration-200"
                        style={{ color: "#7b7a92", border: "1px solid rgba(255,255,255,0.12)", textDecoration: "none" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#f0eff8"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "#7b7a92"; e.currentTarget.style.background = "transparent"; }}
                    >
                        See live demo
                    </a>
                </div>
            </div>
        </div>
    );
}

function Footer() {
    return (
        <footer
            className="relative z-10 max-w-6xl mx-auto px-12 py-12 flex flex-wrap items-center justify-between gap-6"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
            <Link to="/" style={{ ...styles.serif, fontSize: "1.3rem", color: "#f0eff8", textDecoration: "none" }}>
                JobHit<span style={{ color: "#a599ff" }}>AI</span>
            </Link>
            <span className="text-xs" style={{ color: "#4a4963" }}>© 2025 JobHitAI. All rights reserved.</span>
            <div className="flex gap-7">
                {["Privacy", "Terms", "Blog", "Contact"].map((l) => (
                    <a
                        key={l}
                        href="#"
                        className="text-xs transition-colors duration-200"
                        style={{ color: "#4a4963", textDecoration: "none" }}
                        onMouseEnter={(e) => (e.target.style.color = "#7b7a92")}
                        onMouseLeave={(e) => (e.target.style.color = "#4a4963")}
                    >
                        {l}
                    </a>
                ))}
            </div>
        </footer>
    );
}

function SectionLabel({ children }) {
    return (
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "#a599ff" }}>
            <span className="inline-block w-5" style={{ height: 1, background: "#7c6af7" }} />
            {children}
        </div>
    );
}

export default function JobHitAI() {
    return (
        <>
            <FontLoader />

            <style>{`
            @keyframes pulse {
            0%,100% { opacity:1; transform:scale(1); }
            50% { opacity:0.6; transform:scale(0.85); }
            }
            @keyframes scrollX {
            from { transform:translateX(0); }
            to { transform:translateX(-50%); }
            }
            html { scroll-behavior: smooth; }
        `}</style>

            <div style={styles.body}>
                <div className="fixed inset-0 pointer-events-none" style={{ ...styles.noise, zIndex: 9999 }} />

                <div className="fixed rounded-full pointer-events-none" style={{ ...styles.orb1, filter: "blur(80px)", zIndex: 0 }} />
                <div className="fixed rounded-full pointer-events-none" style={{ ...styles.orb2, filter: "blur(80px)", zIndex: 0 }} />
                <div className="fixed rounded-full pointer-events-none" style={{ ...styles.orb3, filter: "blur(80px)", zIndex: 0 }} />

                <Navbar />
                <Hero />
                <Features />
                <ScoreDemo />
                <HowItWorks />
                <Testimonials />
                <Pricing />
                <CTABand />
                <Footer />
            </div>
        </>
    );
}


/*

import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <>
                <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                    <h1 className="text-4xl font-bold">Welcome to JobHitAI</h1>
                    <Link to="/signup">Register</Link>
                    <Link to="/login">Login</Link>
                </div>
        </>
    )
}

export default Landing

*/