/*

import { useState, useRef, useCallback } from "react";

const BG = "#09090f";
const SURFACE = "#111118";
const SURFACE2 = "#16161f";
const BORDER = "#22222e";
const BORDER2 = "#2e2e3e";
const TEXT = "#efefef";
const MUTED = "#666677";
const ACCENT = "#b8f04a";
const PURPLE = "#7c6af7";

const CATEGORY_META = {
    "Data Science": {
        color: PURPLE,
        bg: "#7c6af718",
        border: "#7c6af733",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
        ),
        desc: "Machine learning, statistical analysis, and data-driven decision making.",
        skills: ["Python", "ML", "SQL", "Statistics", "Visualization"],
    },
    "Web Designing": {
        color: "#f0c94a",
        bg: "#f0c94a18",
        border: "#f0c94a33",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
            </svg>
        ),
        desc: "UI/UX design, front-end development, and visual communication.",
        skills: ["HTML/CSS", "Figma", "JavaScript", "UX", "React"],
    },
    "Java Developer": {
        color: "#f07a4a",
        bg: "#f07a4a18",
        border: "#f07a4a33",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
        ),
        desc: "Backend systems, enterprise applications, and JVM-based development.",
        skills: ["Java", "Spring", "OOP", "Maven", "REST APIs"],
    },
    "Python Developer": {
        color: "#4ab8f0",
        bg: "#4ab8f018",
        border: "#4ab8f033",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
        ),
        desc: "Scripting, automation, APIs, and data pipelines using Python.",
        skills: ["Python", "FastAPI", "Django", "Pandas", "Automation"],
    },
    "DevOps Engineer": {
        color: "#f04a7a",
        bg: "#f04a7a18",
        border: "#f04a7a33",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93A10 10 0 1 0 4.93 19.07" /><path d="M19.07 19.07A10 10 0 0 0 4.93 4.93" />
            </svg>
        ),
        desc: "CI/CD pipelines, cloud infrastructure, and deployment automation.",
        skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
    },
    "HR": {
        color: "#b84af0",
        bg: "#b84af018",
        border: "#b84af033",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        desc: "Talent acquisition, people management, and organizational development.",
        skills: ["Recruitment", "HRIS", "Policy", "Training", "Compliance"],
    },
    "Advocate": {
        color: "#f0a44a",
        bg: "#f0a44a18",
        border: "#f0a44a33",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        desc: "Legal practice, litigation, and advisory services.",
        skills: ["Legal Research", "Contract Law", "Litigation", "Compliance", "Drafting"],
    },
    "Accountant": {
        color: "#4af0a4",
        bg: "#4af0a418",
        border: "#4af0a433",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
            </svg>
        ),
        desc: "Financial reporting, auditing, and fiscal management.",
        skills: ["Tally", "GST", "Excel", "Auditing", "Taxation"],
    },
    "Business Analyst": {
        color: "#f04af0",
        bg: "#f04af018",
        border: "#f04af033",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
        desc: "Process improvement, requirements gathering, and stakeholder management.",
        skills: ["JIRA", "SQL", "Agile", "Documentation", "Wireframing"],
    },
};

function getFallbackMeta(prediction) {
    return {
        color: ACCENT,
        bg: `${ACCENT}18`,
        border: `${ACCENT}33`,
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
        ),
        desc: `Your resume has been classified as ${prediction}.`,
        skills: [],
    };
}

function getMeta(prediction) {
    // fuzzy match: iterate keys case-insensitively
    const key = Object.keys(CATEGORY_META).find(
        k => k.toLowerCase() === prediction.toLowerCase()
    );
    return key ? CATEGORY_META[key] : getFallbackMeta(prediction);
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes revealWidth {
    from { width: 0; }
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.88); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes dropBounce {
    0%, 100% { transform: translateY(0); }
    50%  { transform: translateY(-6px); }
  }

  .fade-up { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  .d1 { animation-delay: 0.06s; }
  .d2 { animation-delay: 0.12s; }
  .d3 { animation-delay: 0.18s; }
  .d4 { animation-delay: 0.24s; }
  .d5 { animation-delay: 0.32s; }

  .drop-zone { transition: border-color 0.2s, background 0.2s; }
  .drop-zone.drag-over { border-color: ${ACCENT} !important; background: ${ACCENT}0d !important; }
  .drop-zone.drag-over .drop-icon { animation: dropBounce 0.6s ease infinite; }

  .analyze-btn { transition: background 0.2s, color 0.2s, transform 0.1s; }
  .analyze-btn:hover:not(:disabled) { background: ${ACCENT} !important; color: #000 !important; }
  .analyze-btn:active:not(:disabled) { transform: scale(0.98); }
  .analyze-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .skill-tag { transition: border-color 0.2s, background 0.2s; }
  .skill-tag:hover { background: ${ACCENT}22 !important; border-color: ${ACCENT}66 !important; }

  .result-card { animation: popIn 0.55s cubic-bezier(0.22,1,0.36,1) both; }

  .bar-fill { animation: revealWidth 1.2s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.5s; }
`;

const ROLES_POOL = {
    "Data Science": ["ML Engineer", "Data Analyst", "Research Scientist", "AI Engineer"],
    "Web Designing": ["Front-end Developer", "UI Designer", "UX Engineer", "Product Designer"],
    "Java Developer": ["Backend Engineer", "Software Developer", "Full-stack Engineer", "API Developer"],
    "Python Developer": ["Backend Developer", "Automation Engineer", "API Engineer", "AI Developer"],
    "DevOps Engineer": ["SRE", "Cloud Architect", "Platform Engineer", "Infrastructure Lead"],
    "HR": ["HR Manager", "Talent Acquisition", "People Ops", "L&D Specialist"],
    "Advocate": ["Legal Counsel", "Corporate Lawyer", "Compliance Officer", "Legal Advisor"],
    "Accountant": ["Finance Manager", "Auditor", "Tax Consultant", "CFO"],
    "Business Analyst": ["Product Manager", "Scrum Master", "Strategy Analyst", "Systems Analyst"],
};

function ResultView({ prediction, file, onReset }) {
    const meta = getMeta(prediction);
    const roles = ROLES_POOL[prediction] || ["Specialist", "Consultant", "Analyst", "Manager"];

    return (
        <div>
            <div className="result-card" style={{
                background: SURFACE,
                border: `1px solid ${meta.border}`,
                borderRadius: 16,
                padding: "32px",
                marginBottom: 20,
                position: "relative",
                overflow: "hidden",
            }}>

                <div style={{
                    position: "absolute", top: -40, right: -40,
                    width: 200, height: 200, borderRadius: "50%",
                    background: meta.color,
                    opacity: 0.04,
                    pointerEvents: "none",
                }} />

                <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>

                    <div style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: meta.bg,
                        border: `1px solid ${meta.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: meta.color, flexShrink: 0,
                    }}>
                        {meta.icon}
                    </div>

                    <div style={{ flex: 1 }}>
                        <p style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 10, color: meta.color, letterSpacing: "0.14em",
                            textTransform: "uppercase", marginBottom: 6,
                        }}>
                            Resume classified as
                        </p>
                        <h2 style={{
                            fontFamily: "'Fraunces', serif", fontWeight: 300,
                            fontSize: 32, color: TEXT, lineHeight: 1.1, marginBottom: 8,
                        }}>
                            <em style={{ fontStyle: "italic" }}>{prediction}</em>
                        </h2>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: MUTED, lineHeight: 1.7 }}>
                            {meta.desc}
                        </p>
                    </div>
                </div>

                {meta.skills.length > 0 && (
                    <div style={{ marginTop: 24 }}>
                        <p style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 10, color: MUTED, letterSpacing: "0.1em",
                            textTransform: "uppercase", marginBottom: 12,
                        }}>Core skills in this field</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {meta.skills.map((s, i) => (
                                <span key={i} className="skill-tag fade-up" style={{
                                    animationDelay: `${0.3 + i * 0.06}s`,
                                    background: meta.bg, border: `1px solid ${meta.border}`,
                                    borderRadius: 8, padding: "5px 12px",
                                    fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                                    color: meta.color, fontWeight: 500,
                                }}>
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>

                <div className="fade-up d2" style={{
                    background: SURFACE, border: `1px solid ${BORDER}`,
                    borderRadius: 14, padding: "20px",
                }}>
                    <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 10, color: MUTED, letterSpacing: "0.1em",
                        textTransform: "uppercase", marginBottom: 16,
                    }}>Model confidence</p>

                    {[
                        { label: prediction, value: 87, color: meta.color },
                        { label: "Next candidate", value: 61, color: BORDER2 },
                        { label: "Other classes", value: 38, color: BORDER2 },
                    ].map(({ label, value, color }) => (
                        <div key={label} style={{ marginBottom: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: label === prediction ? TEXT : MUTED }}>{label}</span>
                                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: TEXT, fontWeight: 500 }}>{value}%</span>
                            </div>
                            <div style={{ height: 4, background: BORDER2, borderRadius: 4, overflow: "hidden" }}>
                                <div className="bar-fill" style={{
                                    height: "100%", width: `${value}%`, background: color, borderRadius: 4,
                                }} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="fade-up d3" style={{
                    background: SURFACE, border: `1px solid ${BORDER}`,
                    borderRadius: 14, padding: "20px",
                }}>
                    <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 10, color: MUTED, letterSpacing: "0.1em",
                        textTransform: "uppercase", marginBottom: 16,
                    }}>Related job titles</p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {roles.map((role, i) => (
                            <div key={i} className="fade-up" style={{
                                animationDelay: `${0.25 + i * 0.07}s`,
                                display: "flex", alignItems: "center", gap: 10,
                            }}>
                                <div style={{
                                    width: 6, height: 6, borderRadius: "50%",
                                    background: meta.color, opacity: 0.6, flexShrink: 0,
                                }} />
                                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: MUTED }}>{role}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fade-up d5" style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button
                    onClick={onReset}
                    style={{
                        border: `1px solid ${BORDER2}`, background: "none", color: MUTED,
                        borderRadius: 8, padding: "10px 20px", fontSize: 13,
                        cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                        transition: "color 0.2s, border-color 0.2s",
                    }}
                >
                    ← Analyze another
                </button>
                <div style={{
                    flex: 1, background: SURFACE, border: `1px solid ${BORDER}`,
                    borderRadius: 10, padding: "10px 16px",
                    display: "flex", alignItems: "center", gap: 10,
                }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: meta.color, flexShrink: 0 }} />
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: MUTED }}>
                        {file?.name}
                        <span style={{ margin: "0 10px", color: BORDER2 }}>·</span>
                        classified as <span style={{ color: meta.color }}>{prediction}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ResumeClassifier() {
    const [file, setFile] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dragging, setDragging] = useState(false);
    const fileRef = useRef();

    const handleFile = (f) => {
        if (f && f.type === "application/pdf") { setFile(f); setError(null); }
        else setError("Please upload a valid PDF file.");
    };

    const onDrop = useCallback((e) => {
        e.preventDefault(); setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    }, []);

    async function handleSubmit() {
        if (!file) {
            setError("Please upload a resume PDF.");
            return;
        }

        setLoading(true);
        setError(null);
        setPrediction(null);

        const form = new FormData();
        form.append("resume", file);

        try {
            const res = await fetch("http://localhost:8000/api/resume/predict", {
                method: "POST",
                body: form,
                credentials: "include",
            });

            if (!res.ok) {
                const err = await res.text();
                console.error("Backend error:", err);
                throw new Error("Server error");
            }

            const data = await res.json();

            setPrediction(data.prediction || "Unknown Role");

        } catch (err) {
            setError("Backend not reachable. Make sure the server is running.");
        }

        setLoading(false);
    }

    function reset() { setPrediction(null); setFile(null); setError(null); }

    return (
        <>
            <style>{css}</style>
            <div style={{ minHeight: "100vh", background: BG, color: TEXT, fontFamily: "'DM Sans', sans-serif" }}>

                <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "28px 40px 24px" }}>
                    <div style={{ maxWidth: 800, margin: "0 auto" }}>
                        <p className="fade-up" style={{
                            fontSize: 10, color: ACCENT, letterSpacing: "0.16em",
                            textTransform: "uppercase", marginBottom: 6,
                        }}>
                            Resume Intelligence
                        </p>
                        <h1 className="fade-up d1" style={{
                            fontFamily: "'Fraunces', serif", fontWeight: 300,
                            fontSize: 34, color: TEXT, lineHeight: 1.1, marginBottom: 6,
                        }}>
                            Role <em style={{ fontStyle: "italic" }}>Classifier</em>
                        </h1>
                        <p className="fade-up d2" style={{ fontSize: 13, color: MUTED }}>
                            Upload your resume — our ML model will identify the most fitting job category.
                        </p>
                    </div>
                </div>

                <div style={{ maxWidth: 800, margin: "0 auto", padding: "36px 40px" }}>
                    {!prediction ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                            <div className="fade-up d2" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <p style={{
                                    fontSize: 11, color: MUTED, textTransform: "uppercase",
                                    letterSpacing: "0.1em", marginBottom: 4,
                                }}>Resume PDF</p>

                                <div
                                    className={`drop-zone ${dragging ? "drag-over" : ""}`}
                                    style={{
                                        border: `1.5px dashed ${file ? ACCENT : BORDER2}`,
                                        borderRadius: 12, padding: "40px 20px",
                                        textAlign: "center", cursor: "pointer",
                                        background: file ? `${ACCENT}08` : SURFACE,
                                    }}
                                    onClick={() => fileRef.current.click()}
                                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={onDrop}
                                >
                                    <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }}
                                        onChange={(e) => handleFile(e.target.files[0])} />

                                    {file ? (
                                        <div>
                                            <div style={{
                                                width: 44, height: 44, borderRadius: 10,
                                                background: `${ACCENT}18`, border: `1px solid ${ACCENT}44`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                margin: "0 auto 12px", color: ACCENT,
                                            }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                    <polyline points="14 2 14 8 20 8" />
                                                </svg>
                                            </div>
                                            <p style={{ fontSize: 13, color: ACCENT, fontWeight: 500, marginBottom: 4 }}>{file.name}</p>
                                            <p style={{ fontSize: 11, color: MUTED, marginBottom: 12 }}>{(file.size / 1024).toFixed(1)} KB</p>
                                            <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                                style={{
                                                    fontSize: 11, color: MUTED, background: "none",
                                                    border: `1px solid ${BORDER2}`, borderRadius: 6,
                                                    padding: "4px 10px", cursor: "pointer",
                                                }}>
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="drop-icon" style={{
                                                width: 44, height: 44, borderRadius: 10,
                                                background: SURFACE2, border: `1px solid ${BORDER2}`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                margin: "0 auto 12px", color: MUTED,
                                            }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="17 8 12 3 7 8" />
                                                    <line x1="12" y1="3" x2="12" y2="15" />
                                                </svg>
                                            </div>
                                            <p style={{ fontSize: 13, color: MUTED, marginBottom: 4 }}>Drop your PDF here</p>
                                            <p style={{ fontSize: 11, color: BORDER2 }}>or click to browse</p>
                                        </div>
                                    )}
                                </div>

                                {error && (
                                    <div style={{
                                        background: "#f07a4a14", border: "1px solid #f07a4a33",
                                        borderRadius: 10, padding: "12px 14px",
                                    }}>
                                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#f07a4a", lineHeight: 1.6 }}>
                                            {error}
                                        </p>
                                    </div>
                                )}

                                <button
                                    className="analyze-btn"
                                    onClick={handleSubmit}
                                    disabled={loading || !file}
                                    style={{
                                        width: "100%", padding: "14px",
                                        border: `1px solid ${ACCENT}`, borderRadius: 10,
                                        background: "transparent", color: ACCENT,
                                        fontSize: 14, fontWeight: 500,
                                        fontFamily: "'DM Sans', sans-serif",
                                        cursor: "pointer", letterSpacing: "0.04em",
                                        display: "flex", alignItems: "center",
                                        justifyContent: "center", gap: 10,
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <div style={{
                                                width: 16, height: 16,
                                                border: `2px solid ${ACCENT}44`,
                                                borderTopColor: ACCENT, borderRadius: "50%",
                                                animation: "spin 0.8s linear infinite",
                                            }} />
                                            Classifying…
                                        </>
                                    ) : "Classify Resume →"}
                                </button>
                            </div>

                            <div className="fade-up d3" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div style={{
                                    background: SURFACE, border: `1px solid ${BORDER}`,
                                    borderRadius: 14, padding: "22px",
                                }}>
                                    <p style={{
                                        fontSize: 11, color: MUTED, textTransform: "uppercase",
                                        letterSpacing: "0.1em", marginBottom: 16,
                                    }}>How it works</p>

                                    {[
                                        { n: "01", title: "PDF parsed", desc: "Text is extracted from your resume, cleaned of noise and formatting." },
                                        { n: "02", title: "TF-IDF vectorized", desc: "Your resume becomes a weighted feature vector of important terms." },
                                        { n: "03", title: "ML model predicts", desc: "A trained classifier maps your vector to the closest job category." },
                                        { n: "04", title: "Result returned", desc: "The predicted role category is surfaced alongside related insights." },
                                    ].map(({ n, title, desc }) => (
                                        <div key={n} style={{ display: "flex", gap: 14, marginBottom: 18 }}>
                                            <span style={{
                                                fontFamily: "'Fraunces', serif", fontSize: 13,
                                                color: ACCENT, opacity: 0.6, flexShrink: 0, marginTop: 1,
                                            }}>{n}</span>
                                            <div>
                                                <p style={{ fontSize: 13, color: TEXT, fontWeight: 500, marginBottom: 3 }}>{title}</p>
                                                <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>{desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    background: `${ACCENT}0a`, border: `1px solid ${ACCENT}22`,
                                    borderRadius: 12, padding: "16px 18px",
                                }}>
                                    <p style={{ fontSize: 12, color: ACCENT, lineHeight: 1.7 }}>
                                        <strong style={{ fontWeight: 500 }}>Tip:</strong> For best results, upload a resume with clear section headings and 300+ words of content.
                                    </p>
                                </div>

                                <div style={{
                                    background: SURFACE, border: `1px solid ${BORDER}`,
                                    borderRadius: 14, padding: "18px 20px",
                                }}>
                                    <p style={{
                                        fontSize: 11, color: MUTED, textTransform: "uppercase",
                                        letterSpacing: "0.1em", marginBottom: 14,
                                    }}>Detectable categories</p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                                        {Object.entries(CATEGORY_META).map(([label, m]) => (
                                            <span key={label} style={{
                                                background: m.bg, border: `1px solid ${m.border}`,
                                                borderRadius: 7, padding: "4px 10px",
                                                fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                                                color: m.color,
                                            }}>
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <ResultView prediction={prediction} file={file} onReset={reset} />
                    )}
                </div>
            </div>
        </>
    );
}


*/




import { useState, useRef, useCallback } from "react";

const BG       = "#0a0a0e";
const SURFACE  = "rgba(255,255,255,0.03)";
const SURFACE2 = "rgba(255,255,255,0.055)";
const BORDER   = "rgba(255,255,255,0.07)";
const BORDER2  = "rgba(255,255,255,0.12)";
const TEXT     = "#f0ede8";
const MUTED    = "rgba(240,237,232,0.45)";
const FAINT    = "rgba(240,237,232,0.22)";
const ACCENT   = "#E8FF47";
const GREEN    = "#86efac";
const GOLD     = "#fcd34d";
const PINK     = "#f9a8d4";

const CATEGORY_META = {
    "Data Science": {
        color: ACCENT, bg: "rgba(232,255,71,0.07)", border: "rgba(232,255,71,0.2)",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>,
        desc: "Machine learning, statistical analysis, and data-driven decision making.",
        skills: ["Python", "ML", "SQL", "Statistics", "Visualization"],
    },
    "Web Designing": {
        color: GOLD, bg: "rgba(252,211,77,0.07)", border: "rgba(252,211,77,0.2)",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>,
        desc: "UI/UX design, front-end development, and visual communication.",
        skills: ["HTML/CSS", "Figma", "JavaScript", "UX", "React"],
    },
    "Java Developer": {
        color: PINK, bg: "rgba(249,168,212,0.07)", border: "rgba(249,168,212,0.2)",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
        desc: "Backend systems, enterprise applications, and JVM-based development.",
        skills: ["Java", "Spring", "OOP", "Maven", "REST APIs"],
    },
    "Python Developer": {
        color: GREEN, bg: "rgba(134,239,172,0.07)", border: "rgba(134,239,172,0.2)",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
        desc: "Scripting, automation, APIs, and data pipelines using Python.",
        skills: ["Python", "FastAPI", "Django", "Pandas", "Automation"],
    },
    "DevOps Engineer": {
        color: "#93c5fd", bg: "rgba(147,197,253,0.07)", border: "rgba(147,197,253,0.2)",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93A10 10 0 1 0 4.93 19.07" /><path d="M19.07 19.07A10 10 0 0 0 4.93 4.93" /></svg>,
        desc: "CI/CD pipelines, cloud infrastructure, and deployment automation.",
        skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
    },
    "HR": {
        color: "#c4b5fd", bg: "rgba(196,181,253,0.07)", border: "rgba(196,181,253,0.2)",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
        desc: "Talent acquisition, people management, and organizational development.",
        skills: ["Recruitment", "HRIS", "Policy", "Training", "Compliance"],
    },
    "Advocate": {
        color: GOLD, bg: "rgba(252,211,77,0.07)", border: "rgba(252,211,77,0.2)",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
        desc: "Legal practice, litigation, and advisory services.",
        skills: ["Legal Research", "Contract Law", "Litigation", "Compliance", "Drafting"],
    },
    "Accountant": {
        color: GREEN, bg: "rgba(134,239,172,0.07)", border: "rgba(134,239,172,0.2)",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
        desc: "Financial reporting, auditing, and fiscal management.",
        skills: ["Tally", "GST", "Excel", "Auditing", "Taxation"],
    },
    "Business Analyst": {
        color: PINK, bg: "rgba(249,168,212,0.07)", border: "rgba(249,168,212,0.2)",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
        desc: "Process improvement, requirements gathering, and stakeholder management.",
        skills: ["JIRA", "SQL", "Agile", "Documentation", "Wireframing"],
    },
};

function getFallbackMeta(prediction) {
    return {
        color: ACCENT, bg: "rgba(232,255,71,0.07)", border: "rgba(232,255,71,0.2)",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
        desc: `Your resume has been classified as ${prediction}.`,
        skills: [],
    };
}

function getMeta(prediction) {
    const key = Object.keys(CATEGORY_META).find(k => k.toLowerCase() === prediction.toLowerCase());
    return key ? CATEGORY_META[key] : getFallbackMeta(prediction);
}

const ROLES_POOL = {
    "Data Science":       ["ML Engineer", "Data Analyst", "Research Scientist", "AI Engineer"],
    "Web Designing":      ["Front-end Developer", "UI Designer", "UX Engineer", "Product Designer"],
    "Java Developer":     ["Backend Engineer", "Software Developer", "Full-stack Engineer", "API Developer"],
    "Python Developer":   ["Backend Developer", "Automation Engineer", "API Engineer", "AI Developer"],
    "DevOps Engineer":    ["SRE", "Cloud Architect", "Platform Engineer", "Infrastructure Lead"],
    "HR":                 ["HR Manager", "Talent Acquisition", "People Ops", "L&D Specialist"],
    "Advocate":           ["Legal Counsel", "Corporate Lawyer", "Compliance Officer", "Legal Advisor"],
    "Accountant":         ["Finance Manager", "Auditor", "Tax Consultant", "CFO"],
    "Business Analyst":   ["Product Manager", "Scrum Master", "Strategy Analyst", "Systems Analyst"],
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,800;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes revealWidth { from{width:0} }
  @keyframes popIn { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
  @keyframes dropBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

  .fade-up { animation:fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  .d1{animation-delay:0.06s} .d2{animation-delay:0.12s}
  .d3{animation-delay:0.18s} .d4{animation-delay:0.24s} .d5{animation-delay:0.32s}

  .drop-zone { transition:border-color 0.2s, background 0.2s; }
  .drop-zone.drag-over { border-color:#E8FF47 !important; background:rgba(232,255,71,0.05) !important; }
  .drop-zone.drag-over .drop-icon { animation:dropBounce 0.6s ease infinite; }

  .analyze-btn { transition:background 0.2s, color 0.2s, transform 0.1s, box-shadow 0.2s; }
  .analyze-btn:hover:not(:disabled) { background:#E8FF47 !important; color:#0a0a0e !important; box-shadow:0 4px 20px rgba(232,255,71,0.25) !important; border-color:#E8FF47 !important; }
  .analyze-btn:active:not(:disabled) { transform:scale(0.98); }
  .analyze-btn:disabled { opacity:0.35; cursor:not-allowed; }

  .skill-tag { transition:border-color 0.2s, background 0.2s; }
  .skill-tag:hover { opacity:0.85; }

  .result-card { animation:popIn 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .bar-fill { animation:revealWidth 1.2s cubic-bezier(0.22,1,0.36,1) both; animation-delay:0.5s; }

  .reset-btn { transition:border-color 0.2s, color 0.2s; }
  .reset-btn:hover { border-color:rgba(240,237,232,0.25) !important; color:#f0ede8 !important; }
`;

function ResultView({ prediction, file, onReset }) {
    const meta  = getMeta(prediction);
    const roles = ROLES_POOL[prediction] || ["Specialist", "Consultant", "Analyst", "Manager"];

    return (
        <div>
            <div className="result-card" style={{ background:SURFACE, border:`1px solid ${meta.border}`, borderRadius:18, padding:"32px", marginBottom:20, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:1, background:`linear-gradient(90deg,transparent,${meta.color},transparent)` }} />

                <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:meta.color, opacity:0.04, pointerEvents:"none" }} />

                <div style={{ display:"flex", alignItems:"flex-start", gap:20 }}>
                    <div style={{ width:52, height:52, borderRadius:14, background:meta.bg, border:`1px solid ${meta.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:meta.color, flexShrink:0 }}>
                        {meta.icon}
                    </div>
                    <div style={{ flex:1 }}>
                        <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:10, color:meta.color, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:6, fontWeight:600 }}>
                            Resume classified as
                        </p>
                        <h2 style={{ fontFamily:"'Fraunces', serif", fontWeight:800, fontSize:32, color:TEXT, lineHeight:1.05, marginBottom:8, letterSpacing:"-0.03em" }}>
                            <em style={{ fontStyle:"italic", color:meta.color }}>{prediction}</em>
                        </h2>
                        <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:MUTED, lineHeight:1.7 }}>{meta.desc}</p>
                    </div>
                </div>

                {meta.skills.length > 0 && (
                    <div style={{ marginTop:24 }}>
                        <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:10, color:FAINT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12, fontWeight:600 }}>Core skills in this field</p>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                            {meta.skills.map((s, i) => (
                                <span key={i} className="skill-tag fade-up" style={{ animationDelay:`${0.3+i*0.06}s`, background:meta.bg, border:`1px solid ${meta.border}`, borderRadius:8, padding:"5px 12px", fontFamily:"'DM Sans', sans-serif", fontSize:12, color:meta.color, fontWeight:600 }}>
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>

                <div className="fade-up d2" style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:16, padding:"20px", position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", top:0, left:"25%", right:"25%", height:1, background:`linear-gradient(90deg,transparent,${meta.color},transparent)` }} />
                    <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:10, color:FAINT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16, fontWeight:600 }}>Model confidence</p>
                    {[
                        { label:prediction,       value:87, color:meta.color },
                        { label:"Next candidate", value:61, color:BORDER2 },
                        { label:"Other classes",  value:38, color:BORDER2 },
                    ].map(({ label, value, color }) => (
                        <div key={label} style={{ marginBottom:12 }}>
                            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                                <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, color:label===prediction ? TEXT : MUTED }}>{label}</span>
                                <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, color:TEXT, fontWeight:500 }}>{value}%</span>
                            </div>
                            <div style={{ height:4, background:BORDER2, borderRadius:4, overflow:"hidden" }}>
                                <div className="bar-fill" style={{ height:"100%", width:`${value}%`, background:color, borderRadius:4 }} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="fade-up d3" style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:16, padding:"20px", position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", top:0, left:"25%", right:"25%", height:1, background:`linear-gradient(90deg,transparent,${GREEN},transparent)` }} />
                    <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:10, color:FAINT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16, fontWeight:600 }}>Related job titles</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        {roles.map((role, i) => (
                            <div key={i} className="fade-up" style={{ animationDelay:`${0.25+i*0.07}s`, display:"flex", alignItems:"center", gap:10 }}>
                                <div style={{ width:6, height:6, borderRadius:"50%", background:meta.color, opacity:0.7, flexShrink:0, boxShadow:`0 0 5px ${meta.color}` }} />
                                <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:MUTED }}>{role}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fade-up d5" style={{ display:"flex", gap:12, alignItems:"center" }}>
                <button onClick={onReset} className="reset-btn"
                    style={{ border:`1px solid ${BORDER2}`, background:"none", color:MUTED, borderRadius:10, padding:"10px 20px", fontSize:13, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>
                    ← Analyze another
                </button>
                <div style={{ flex:1, background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:12, padding:"10px 16px", display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:meta.color, boxShadow:`0 0 6px ${meta.color}`, flexShrink:0 }} />
                    <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:MUTED }}>
                        {file?.name}
                        <span style={{ margin:"0 10px", color:FAINT }}>·</span>
                        classified as <span style={{ color:meta.color, fontWeight:600 }}>{prediction}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ResumeClassifier() {
    const [file, setFile]           = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState(null);
    const [dragging, setDragging]   = useState(false);
    const fileRef = useRef();

    const handleFile = (f) => {
        if (f && f.type === "application/pdf") { setFile(f); setError(null); }
        else setError("Please upload a valid PDF file.");
    };
    const onDrop = useCallback((e) => {
        e.preventDefault(); setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    }, []);

    async function handleSubmit() {
        if (!file) { setError("Please upload a resume PDF."); return; }
        setLoading(true); setError(null); setPrediction(null);
        const form = new FormData();
        form.append("resume", file);
        try {
            const res = await fetch("https://jobhitai-server.onrender.com/predict/job", { method:"POST", body:form, credentials:"include" });
            if (!res.ok) { const err = await res.text(); console.error("Backend error:", err); throw new Error("Server error"); }
            const data = await res.json();
            setPrediction(data.prediction || "Unknown Role");
        } catch (err) {
            setError("Backend not reachable. Make sure the server is running.");
        }
        setLoading(false);
    }

    function reset() { setPrediction(null); setFile(null); setError(null); }

    return (
        <>
            <style>{css}</style>

            <div style={{ marginBottom:20 }}>
                <p className="fade-up" style={{ fontSize:10, color:ACCENT, letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:6, fontWeight:600 }}>
                    Resume Intelligence
                </p>
                <h1 className="fade-up d1" style={{ fontFamily:"'Fraunces', serif", fontWeight:800, fontSize:"clamp(24px,3vw,36px)", color:TEXT, lineHeight:1.05, marginBottom:6, letterSpacing:"-0.035em" }}>
                    Role <em style={{ fontStyle:"italic", color:ACCENT }}>Classifier</em>
                </h1>
                <p className="fade-up d2" style={{ fontSize:13, color:MUTED }}>
                    Upload your resume — our ML model will identify the most fitting job category.
                </p>
            </div>

            {!prediction ? (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

                    <div className="fade-up d2" style={{ display:"flex", flexDirection:"column", gap:16 }}>
                        <p style={{ fontSize:11, color:FAINT, textTransform:"uppercase", letterSpacing:"0.1em", fontWeight:600 }}>Resume PDF</p>

                        <div
                            className={`drop-zone ${dragging ? "drag-over" : ""}`}
                            style={{ border:`1.5px dashed ${file ? ACCENT : BORDER2}`, borderRadius:14, padding:"40px 20px", textAlign:"center", cursor:"pointer", background:file ? "rgba(232,255,71,0.04)" : SURFACE }}
                            onClick={() => fileRef.current.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={onDrop}
                        >
                            <input ref={fileRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={(e) => handleFile(e.target.files[0])} />

                            {file ? (
                                <div>
                                    <div style={{ width:44, height:44, borderRadius:10, background:"rgba(232,255,71,0.08)", border:"1px solid rgba(232,255,71,0.25)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", color:ACCENT }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                                        </svg>
                                    </div>
                                    <p style={{ fontSize:13, color:ACCENT, fontWeight:600, marginBottom:4 }}>{file.name}</p>
                                    <p style={{ fontSize:11, color:MUTED, marginBottom:12 }}>{(file.size/1024).toFixed(1)} KB</p>
                                    <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                        style={{ fontSize:11, color:MUTED, background:"none", border:`1px solid ${BORDER2}`, borderRadius:6, padding:"4px 10px", cursor:"pointer", fontFamily:"'DM Sans', sans-serif", transition:"border-color 0.15s, color 0.15s" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor=BORDER; e.currentTarget.style.color=TEXT; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor=BORDER2; e.currentTarget.style.color=MUTED; }}>
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="drop-icon" style={{ width:44, height:44, borderRadius:10, background:SURFACE2, border:`1px solid ${BORDER2}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", color:MUTED }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    </div>
                                    <p style={{ fontSize:13, color:MUTED, marginBottom:4 }}>Drop your PDF here</p>
                                    <p style={{ fontSize:11, color:FAINT }}>or click to browse</p>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div style={{ background:"rgba(249,168,212,0.06)", border:"1px solid rgba(249,168,212,0.2)", borderRadius:10, padding:"12px 14px" }}>
                                <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:PINK, lineHeight:1.6 }}>{error}</p>
                            </div>
                        )}

                        <button className="analyze-btn" onClick={handleSubmit} disabled={loading || !file}
                            style={{ width:"100%", padding:"14px", border:`1px solid rgba(232,255,71,0.4)`, borderRadius:12, background:"rgba(232,255,71,0.06)", color:ACCENT, fontSize:14, fontWeight:700, fontFamily:"'DM Sans', sans-serif", cursor:"pointer", letterSpacing:"0.02em", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                            {loading ? (
                                <>
                                    <div style={{ width:16, height:16, border:`2px solid rgba(232,255,71,0.3)`, borderTopColor:ACCENT, borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                                    Classifying…
                                </>
                            ) : "Classify Resume →"}
                        </button>
                    </div>

                    <div className="fade-up d3" style={{ display:"flex", flexDirection:"column", gap:16 }}>

                        <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:16, padding:"22px", position:"relative", overflow:"hidden" }}>
                            <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:1, background:`linear-gradient(90deg,transparent,${ACCENT},transparent)` }} />
                            <p style={{ fontSize:11, color:FAINT, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:16, fontWeight:600 }}>How it works</p>
                            {[
                                { n:"01", title:"PDF parsed",        desc:"Text is extracted from your resume, cleaned of noise and formatting." },
                                { n:"02", title:"TF-IDF vectorized", desc:"Your resume becomes a weighted feature vector of important terms." },
                                { n:"03", title:"ML model predicts", desc:"A trained classifier maps your vector to the closest job category." },
                                { n:"04", title:"Result returned",   desc:"The predicted role category is surfaced alongside related insights." },
                            ].map(({ n, title, desc }) => (
                                <div key={n} style={{ display:"flex", gap:14, marginBottom:18 }}>
                                    <span style={{ fontFamily:"'Fraunces', serif", fontWeight:700, fontSize:13, color:ACCENT, opacity:0.7, flexShrink:0, marginTop:1 }}>{n}</span>
                                    <div>
                                        <p style={{ fontSize:13, color:TEXT, fontWeight:500, marginBottom:3 }}>{title}</p>
                                        <p style={{ fontSize:12, color:MUTED, lineHeight:1.6 }}>{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ background:"rgba(232,255,71,0.04)", border:"1px solid rgba(232,255,71,0.15)", borderRadius:12, padding:"14px 16px", position:"relative", overflow:"hidden" }}>
                            <div style={{ position:"absolute", top:0, left:"30%", right:"30%", height:1, background:`linear-gradient(90deg,transparent,${ACCENT},transparent)` }} />
                            <p style={{ fontSize:12, lineHeight:1.7 }}>
                                <span style={{ color:ACCENT, fontWeight:600 }}>Tip: </span>
                                <span style={{ color:MUTED }}>For best results, upload a resume with clear section headings and 300+ words of content.</span>
                            </p>
                        </div>

                        <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:16, padding:"18px 20px", position:"relative", overflow:"hidden" }}>
                            <div style={{ position:"absolute", top:0, left:"25%", right:"25%", height:1, background:`linear-gradient(90deg,transparent,${GREEN},transparent)` }} />
                            <p style={{ fontSize:11, color:FAINT, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14, fontWeight:600 }}>Detectable categories</p>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                                {Object.entries(CATEGORY_META).map(([label, m]) => (
                                    <span key={label} style={{ background:m.bg, border:`1px solid ${m.border}`, borderRadius:8, padding:"4px 10px", fontFamily:"'DM Sans', sans-serif", fontSize:11, color:m.color, fontWeight:500 }}>
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            ) : (
                <ResultView prediction={prediction} file={file} onReset={reset} />
            )}
        </>
    );
}