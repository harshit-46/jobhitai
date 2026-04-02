import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = ["Features", "How It Works", "Contribute"];

const FEATURES = [
    {
        id: "01",
        title: "ATS Score Analyzer",
        desc: "Instantly parse your resume against 200+ ATS systems. Get a real score, keyword gaps, and a line-by-line breakdown before the recruiter ever sees it.",
        tag: "ANALYSIS",
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                <rect x="6" y="6" width="36" height="36" rx="2" stroke="#E8FF47" strokeWidth="2" />
                <path d="M14 24h20M14 16h12M14 32h16" stroke="#E8FF47" strokeWidth="2" strokeLinecap="round" />
                <circle cx="38" cy="10" r="6" fill="#E8FF47" />
                <path d="M35 10l2 2 4-4" stroke="#09090f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: "02",
        title: "Job Category Predictor",
        desc: "Our ML model reads your resume and maps you to the most relevant job categories — so you stop applying blind and start targeting right.",
        tag: "INTELLIGENCE",
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                <circle cx="24" cy="24" r="18" stroke="#E8FF47" strokeWidth="2" />
                <path d="M24 6v4M24 38v4M6 24h4M38 24h4" stroke="#E8FF47" strokeWidth="2" strokeLinecap="round" />
                <circle cx="24" cy="24" r="6" fill="#E8FF47" />
                <path d="M17 17l5 5M31 17l-5 5M17 31l5-5M31 31l-5-5" stroke="#09090f" strokeWidth="1.5" />
            </svg>
        ),
    },
    {
        id: "03",
        title: "Resume Builder",
        desc: "Build recruiter-ready resumes with AI-powered bullet points, professional summaries, and export-ready PDF output. No design skills needed.",
        tag: "CREATION",
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                <path d="M10 8h28a2 2 0 012 2v28a2 2 0 01-2 2H10a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#E8FF47" strokeWidth="2" />
                <path d="M16 20h16M16 26h10" stroke="#E8FF47" strokeWidth="2" strokeLinecap="round" />
                <path d="M28 32l4-4-4-4" stroke="#E8FF47" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: "04",
        title: "One-Click Job Apply",
        desc: "Browse curated job listings matched to your profile. Apply directly without leaving the platform — track every application in a single dashboard.",
        tag: "AUTOMATION",
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                <path d="M8 24C8 15.163 15.163 8 24 8s16 7.163 16 16-7.163 16-16 16S8 32.837 8 24z" stroke="#E8FF47" strokeWidth="2" />
                <path d="M20 18l8 6-8 6V18z" fill="#E8FF47" />
            </svg>
        ),
    },
];

const STEPS = [
    { num: "01", title: "Upload Your Resume", body: "Drop your existing resume (PDF or DOCX) or start fresh with our builder." },
    { num: "02", title: "Get Your Analysis", body: "Receive ATS score, keyword gaps, category predictions, and improvement suggestions instantly." },
    { num: "03", title: "Optimize & Build", body: "Apply AI suggestions, rewrite bullets, and download a polished, recruiter-ready PDF." },
    { num: "04", title: "Apply with Confidence", body: "Browse matched jobs and apply directly — track everything from one dashboard." },
];

const STATS = [
    { value: "94%", label: "ATS Pass Rate" },
    { value: "2.3×", label: "More Interviews" },
    { value: "50+", label: "Resumes Analyzed" },
    { value: "12 sec", label: "Average Scan Time" },
];

function useScrollReveal(threshold = 0.15) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
    const [ref, visible] = useScrollReveal();
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
            }}
        >
            {children}
        </div>
    );
}

export default function Landing() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const [ticker, setTicker] = useState(0);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const id = setInterval(() => setTicker(t => t + 1), 2200);
        return () => clearInterval(id);
    }, []);

    const tickerWords = ["Interviews.", "Opportunities.", "Offers.", "Callbacks.", "Careers."];
    const currentWord = tickerWords[ticker % tickerWords.length];

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    
        window.scrollTo({ top: y, behavior: "smooth" });
    };

    const handleHREF = () => {
        window.open("https://github.com/harshit-46/jobhitai", "_blank");
    };

    return (
        <div style={{ background: "#0a0a0e", color: "#f0ede8", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,300&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,800;1,9..144,300;1,9..144,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #E8FF47; color: #0a0a0e; }
        body { background: #0a0a0e; }
        .ticker-enter { animation: slideUp 0.5s cubic-bezier(.22,.68,0,1.2) forwards; }
        @keyframes slideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        .scan-line { animation: scan 3s linear infinite; }
        @keyframes scan { 0%{top:0%} 100%{top:100%} }
        .float { animation: floatAnim 6s ease-in-out infinite; }
        @keyframes floatAnim { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .marquee-track { animation: marquee 22s linear infinite; }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .glow-btn:hover { box-shadow: 0 0 0 1px #E8FF47, 0 0 24px rgba(232,255,71,0.25); }
        .feature-card:hover .feature-num { color: #E8FF47; }
        .noise { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); }
        .underline-hover { position: relative; }
        .underline-hover::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:#E8FF47; transition:width 0.3s ease; }
        .underline-hover:hover::after { width:100%; }
        .step-line::after { content:''; position:absolute; left:19px; top:40px; bottom:-20px; width:1px; background: linear-gradient(to bottom, #E8FF47 0%, transparent 100%); }
        .pill { display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:100px; border:1px solid rgba(232,255,71,0.3); font-size:11px; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; color:#E8FF47; }
        .grid-bg { background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size:60px 60px; }
      `}</style>

            <nav
                style={{
                    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
                    padding: "0 40px",
                    height: "64px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: scrolled ? "rgba(10,10,14,0.92)" : "transparent",
                    backdropFilter: scrolled ? "blur(16px)" : "none",
                    borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
                    transition: "all 0.4s ease",
                }}
            >
                <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    style={{ display: "flex", alignItems: "center", gap: "8px" , cursor: "pointer"}}>
                    <div style={{ width: 28, height: 28, background: "#E8FF47", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
                            <path d="M4 5h12M4 10h8M4 15h10" stroke="#0a0a0e" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "18px", letterSpacing: "-0.02em" }}>
                        JobHit<span style={{ color: "#E8FF47" }}>AI</span>
                    </span>
                </div>

                <div style={{ display: "flex", gap: "36px" }} className="hidden md:flex">
                    {NAV_LINKS.map(l => (
                        <button key={l} 
                        onClick={
                            () => {
                                if( l == "Features" ) scrollToSection("features");
                                if( l == "How It Works") scrollToSection("how");
                                if( l == "Contribute") handleHREF();
                            }}
                        className="underline-hover cursor-pointer" style={{ fontSize: "13px", fontWeight: 500, color: "rgba(240,237,232,0.65)", textDecoration: "none", transition: "color 0.2s" }}
                            onMouseEnter={e => e.target.style.color = "#f0ede8"}
                            onMouseLeave={e => e.target.style.color = "rgba(240,237,232,0.65)"}
                        >{l}</button>
                    ))}
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <Link to="/login" style={{ fontSize: "13px", fontWeight: 500, color: "rgba(240,237,232,0.65)", textDecoration: "none" }}
                        onMouseEnter={e => e.target.style.color = "#f0ede8"}
                        onMouseLeave={e => e.target.style.color = "rgba(240,237,232,0.65)"}
                    >Log in</Link>
                    <Link to="/login" className="glow-btn" style={{
                        fontSize: "13px", fontWeight: 600, textDecoration: "none",
                        background: "#E8FF47", color: "#0a0a0e", padding: "8px 20px", borderRadius: "8px",
                        transition: "all 0.25s ease", letterSpacing: "-0.01em"
                    }}>Get Started</Link>
                </div>
            </nav>

            <section className="grid-bg" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 40px 80px", position: "relative", overflow: "hidden" }}>

                <div style={{ position: "absolute", top: "20%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,255,71,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: "10%", right: "8%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(120,80,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

                <div style={{ position: "absolute", top: 80, left: 40, opacity: 0.15 }}>
                    <svg width="60" height="60" viewBox="0 0 60 60"><path d="M0 60V0h60" fill="none" stroke="#E8FF47" strokeWidth="1" /></svg>
                </div>
                <div style={{ position: "absolute", bottom: 80, right: 40, opacity: 0.15, transform: "rotate(180deg)" }}>
                    <svg width="60" height="60" viewBox="0 0 60 60"><path d="M0 60V0h60" fill="none" stroke="#E8FF47" strokeWidth="1" /></svg>
                </div>

                <div style={{ textAlign: "center", maxWidth: 800, position: "relative", zIndex: 2 }}>
                    <div className="pill" style={{ marginBottom: 32, display: "inline-flex" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8FF47" }} />
                        Now with AI-powered resume intelligence
                    </div>

                    <h1 style={{
                        fontFamily: "'Fraunces', serif",
                        fontWeight: 800,
                        fontSize: "clamp(52px, 8vw, 92px)",
                        lineHeight: 1.0,
                        letterSpacing: "-0.04em",
                        marginBottom: 24,
                    }}>
                        Land More{" "}
                        <span style={{ display: "block", fontStyle: "italic", color: "#E8FF47", minHeight: "1.1em" }}>
                            <span key={currentWord} className="ticker-enter" style={{ display: "inline-block" }}>{currentWord}</span>
                        </span>
                    </h1>

                    <p style={{ fontSize: "18px", fontWeight: 300, color: "rgba(240,237,232,0.6)", maxWidth: 520, margin: "0 auto 48px", lineHeight: 1.65 }}>
                        Analyze your resume against ATS filters, predict your ideal job category, build polished resumes with AI, and apply to curated jobs — all in one platform.
                    </p>

                    <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link to="/login" style={{
                            background: "#E8FF47", color: "#0a0a0e", padding: "16px 36px",
                            borderRadius: "10px", fontWeight: 700, fontSize: "15px",
                            textDecoration: "none", letterSpacing: "-0.02em",
                            transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: "8px"
                        }}
                            className="glow-btn"
                            onMouseEnter={e => { e.currentTarget.style.background = "#f5ff6e"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#E8FF47"; }}
                        >
                            Analyze My Resume
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#0a0a0e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </Link>
                        <a
                            onClick={ () => {scrollToSection("how")}}
                            style={{
                            border: "1px solid rgba(240,237,232,0.15)", color: "#f0ede8",
                            padding: "16px 36px", borderRadius: "10px", fontWeight: 500,
                            fontSize: "15px", textDecoration: "none", letterSpacing: "-0.02em",
                            transition: "all 0.2s ease"
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(240,237,232,0.4)"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(240,237,232,0.15)"; }}
                        >See how it works</a>
                    </div>
                </div>

                <div className="float" style={{ marginTop: 80, position: "relative", maxWidth: 720, width: "100%" }}>
                    <div style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "20px",
                        padding: "28px",
                        backdropFilter: "blur(8px)",
                        position: "relative",
                        overflow: "hidden"
                    }}>
                        <div className="scan-line" style={{ position: "absolute", left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(232,255,71,0.4), transparent)", pointerEvents: "none" }} />

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <div>
                                <div style={{ fontSize: 12, color: "rgba(240,237,232,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>ATS Analysis Report</div>
                                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 20 }}>Harshit_Resume_2025.pdf</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 11, color: "rgba(240,237,232,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>ATS Score</div>
                                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 36, color: "#E8FF47", lineHeight: 1 }}>87<span style={{ fontSize: 18 }}>/100</span></div>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                            {[
                                { label: "Keywords Found", val: "34/42", color: "#E8FF47" },
                                { label: "Format Score", val: "92%", color: "#86efac" },
                                { label: "Job Category", val: "SWE", color: "#93c5fd" },
                            ].map(s => (
                                <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)" }}>
                                    <div style={{ fontSize: 11, color: "rgba(240,237,232,0.4)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                                    <div style={{ fontWeight: 700, fontSize: 20, color: s.color, fontFamily: "'Fraunces', serif" }}>{s.val}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {[
                                { label: "Technical Skills", pct: 88, color: "#E8FF47" },
                                { label: "Experience Match", pct: 74, color: "#86efac" },
                                { label: "Education Fit", pct: 95, color: "#93c5fd" },
                            ].map(bar => (
                                <div key={bar.label}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                        <span style={{ fontSize: 12, color: "rgba(240,237,232,0.55)" }}>{bar.label}</span>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: bar.color }}>{bar.pct}%</span>
                                    </div>
                                    <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
                                        <div style={{ height: "100%", width: `${bar.pct}%`, background: bar.color, borderRadius: 2, transition: "width 1s ease" }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", padding: "14px 0" }}>
                <div className="marquee-track" style={{ display: "flex", gap: "60px", whiteSpace: "nowrap", width: "max-content" }}>
                    {[...Array(2)].map((_, i) =>
                        ["ATS Optimization", "Resume Intelligence", "Job Matching", "AI-Powered Bullets", "Career Prediction", "One-Click Apply", "PDF Export", "Interview Rate Boost"].map(t => (
                            <span key={`${i}-${t}`} style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(240,237,232,0.3)", display: "flex", alignItems: "center", gap: "60px" }}>
                                {t}
                                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#E8FF47", opacity: 0.6, display: "inline-block" }} />
                            </span>
                        ))
                    )}
                </div>
            </div>

            <section style={{ padding: "80px 40px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
                    {STATS.map((s, i) => (
                        <Reveal key={s.label} delay={i * 0.1}>
                            <div style={{
                                padding: "40px 32px",
                                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
                                textAlign: "center"
                            }}>
                                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "52px", color: "#E8FF47", lineHeight: 1, letterSpacing: "-0.03em" }}>{s.value}</div>
                                <div style={{ marginTop: 8, fontSize: "13px", fontWeight: 500, color: "rgba(240,237,232,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            <section style={{ padding: "80px 40px 120px" }} id="features">
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <Reveal>
                        <div style={{ marginBottom: 64 }}>
                            <div className="pill" style={{ marginBottom: 20 }}>Features</div>
                            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "clamp(36px,5vw,60px)", letterSpacing: "-0.035em", lineHeight: 1.05 }}>
                                Everything your job search<br /><span style={{ fontStyle: "italic", color: "rgba(240,237,232,0.45)" }}>actually needs.</span>
                            </h2>
                        </div>
                    </Reveal>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                        {FEATURES.map((f, i) => (
                            <Reveal key={f.id} delay={i * 0.1}>
                                <div
                                    className="feature-card"
                                    onMouseEnter={() => setActiveFeature(i)}
                                    style={{
                                        padding: "48px",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        borderRadius: i === 0 ? "16px 0 0 0" : i === 1 ? "0 16px 0 0" : i === 2 ? "0 0 0 16px" : "0 0 16px 0",
                                        background: activeFeature === i ? "rgba(232,255,71,0.03)" : "transparent",
                                        transition: "background 0.3s ease",
                                        cursor: "default",
                                    }}
                                >
                                    <div style={{ marginBottom: 24 }}>{f.icon}</div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                        <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "24px", letterSpacing: "-0.02em" }}>{f.title}</h3>
                                        <span className="feature-num" style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: "48px", color: "rgba(255,255,255,0.1)", lineHeight: 1, transition: "color 0.3s" }}>{f.id}</span>
                                    </div>
                                    <p style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(240,237,232,0.55)", maxWidth: 380 }}>{f.desc}</p>
                                    <div style={{ marginTop: 24 }}>
                                        <span className="pill">{f.tag}</span>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section id="how" style={{ padding: "80px 40px 120px", background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
                    <div>
                        <Reveal>
                            <div className="pill" style={{ marginBottom: 20 }}>Process</div>
                            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "clamp(36px,4vw,52px)", letterSpacing: "-0.035em", lineHeight: 1.08, marginBottom: 24 }}>
                                From upload<br /><span style={{ fontStyle: "italic" }}>to offer.</span>
                            </h2>
                            <p style={{ fontSize: "15px", color: "rgba(240,237,232,0.5)", lineHeight: 1.7, maxWidth: 380 }}>
                                A streamlined four-step process that takes you from a rough resume to a confident job applicant in under five minutes.
                            </p>
                        </Reveal>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                        {STEPS.map((s, i) => (
                            <Reveal key={s.num} delay={i * 0.12}>
                                <div style={{ display: "flex", gap: "24px", paddingBottom: "36px", position: "relative" }} className={i < STEPS.length - 1 ? "step-line" : ""}>
                                    <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", border: "1.5px solid rgba(232,255,71,0.5)", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0e", position: "relative", zIndex: 1 }}>
                                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#E8FF47", letterSpacing: "0.04em" }}>{s.num}</span>
                                    </div>
                                    <div>
                                        <h4 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "18px", marginBottom: 8, letterSpacing: "-0.02em" }}>{s.title}</h4>
                                        <p style={{ fontSize: "13px", color: "rgba(240,237,232,0.5)", lineHeight: 1.65 }}>{s.body}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ padding: "40px 40px 120px" }}>
                <Reveal>
                    <div style={{
                        maxWidth: 1100, margin: "0 auto",
                        background: "#E8FF47",
                        borderRadius: "24px",
                        padding: "80px 60px",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        flexWrap: "wrap", gap: "40px",
                        position: "relative", overflow: "hidden"
                    }}>
                        <div style={{ position: "absolute", top: -30, right: -30, width: 200, height: 200, borderRadius: "50%", background: "rgba(0,0,0,0.06)", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", bottom: -60, left: 80, width: 300, height: 300, borderRadius: "50%", background: "rgba(0,0,0,0.04)", pointerEvents: "none" }} />
                        <div style={{ position: "relative" }}>
                            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", color: "#0a0a0e", letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 12 }}>
                                Your next job<br />starts with your resume.
                            </h2>
                            <p style={{ fontSize: "15px", color: "rgba(10,10,14,0.6)", maxWidth: 400 }}>
                                Join 50+ candidates who improved their ATS scores and landed more interviews.
                            </p>
                        </div>
                        <Link to="/login" style={{
                            background: "#0a0a0e", color: "#E8FF47",
                            padding: "18px 40px", borderRadius: "12px",
                            fontWeight: 700, fontSize: "15px",
                            textDecoration: "none", letterSpacing: "-0.02em",
                            flexShrink: 0, display: "flex", alignItems: "center", gap: "10px",
                            transition: "all 0.2s ease"
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                        >
                            Analyze Resume Free
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#E8FF47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </Link>
                    </div>
                </Reveal>
            </section>

            <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "48px 40px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
                    <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: 24, height: 24, background: "#E8FF47", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg viewBox="0 0 20 20" fill="none" width="14" height="14"><path d="M4 5h12M4 10h8M4 15h10" stroke="#0a0a0e" strokeWidth="2" strokeLinecap="round" /></svg>
                        </div>
                        <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "16px" }}>JobHit<span style={{ color: "#E8FF47" }}>AI</span></span>
                    </div>
                    <div style={{ fontSize: "12px", color: "rgba(240,237,232,0.25)" }}>© 2026 JobHitAI. All rights reserved.</div>
                </div>
            </footer>
        </div>
    );
}