import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const API = import.meta.env.VITE_API_URL;

// ── Tokens (identical to ResumeClassifier) ────────────────────────────────────
const BG      = "#0a0a0e";
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

// ── Grade config ──────────────────────────────────────────────────────────────
const GRADE_META = {
    Excellent: { color: ACCENT, bg: "rgba(232,255,71,0.07)",  border: "rgba(232,255,71,0.2)" },
    Good:      { color: GREEN,  bg: "rgba(134,239,172,0.07)", border: "rgba(134,239,172,0.2)" },
    Average:   { color: GOLD,   bg: "rgba(252,211,77,0.07)",  border: "rgba(252,211,77,0.2)" },
    Poor:      { color: PINK,   bg: "rgba(249,168,212,0.07)", border: "rgba(249,168,212,0.2)" },
};

function getGrade(score) {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Average";
    return "Poor";
}

// ── Global CSS (same pattern as ResumeClassifier) ─────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,800;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  @keyframes fadeUp      { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin        { to{transform:rotate(360deg)} }
  @keyframes revealWidth { from{width:0} }
  @keyframes popIn       { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
  @keyframes dropBounce  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes drawRing    { from{stroke-dashoffset:var(--full)} }

  .fade-up { animation:fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  .d1{animation-delay:0.06s} .d2{animation-delay:0.12s}
  .d3{animation-delay:0.18s} .d4{animation-delay:0.24s} .d5{animation-delay:0.32s}

  .drop-zone { transition:border-color 0.2s, background 0.2s; }
  .drop-zone.drag-over { border-color:#E8FF47 !important; background:rgba(232,255,71,0.05) !important; }
  .drop-zone.drag-over .drop-icon { animation:dropBounce 0.6s ease infinite; }

  .scan-btn { transition:background 0.2s, color 0.2s, transform 0.1s, box-shadow 0.2s; }
  .scan-btn:hover:not(:disabled) { background:#E8FF47 !important; color:#0a0a0e !important; box-shadow:0 4px 20px rgba(232,255,71,0.25) !important; border-color:#E8FF47 !important; }
  .scan-btn:active:not(:disabled) { transform:scale(0.98); }
  .scan-btn:disabled { opacity:0.35; cursor:not-allowed; }

  .result-card { animation:popIn 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .bar-fill { animation:revealWidth 1.2s cubic-bezier(0.22,1,0.36,1) both; animation-delay:0.5s; }

  .reset-btn { transition:border-color 0.2s, color 0.2s; }
  .reset-btn:hover { border-color:rgba(240,237,232,0.25) !important; color:#f0ede8 !important; }

  .tip-card { transition:border-color 0.2s; }
  .tip-card:hover { border-color:rgba(255,255,255,0.13) !important; }
`;

// ── Score ring ─────────────────────────────────────────────────────────────────
function ScoreRing({ score, color, size = 110 }) {
    const stroke = 7;
    const r      = (size - stroke) / 2;
    const c      = 2 * Math.PI * r;
    const offset = c * (1 - score / 100);

    return (
        <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={size/2} cy={size/2} r={r} fill="none"
                    stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
                <circle cx={size/2} cy={size/2} r={r} fill="none"
                    stroke={color} strokeWidth={stroke}
                    strokeDasharray={c}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{
                        "--full": c,
                        animation: "drawRing 1.2s cubic-bezier(0.22,1,0.36,1) both",
                        animationDelay: "0.3s",
                    }}
                />
            </svg>
            <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
            }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: size * 0.22, color, lineHeight: 1 }}>{score}</span>
                <span style={{ fontSize: size * 0.1, color: FAINT, marginTop: 2 }}>/ 100</span>
            </div>
        </div>
    );
}

// ── Score bar (same pattern as confidence bars in classifier) ─────────────────
function ScoreBar({ label, val, color }) {
    return (
        <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: MUTED }}>{label}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: TEXT, fontWeight: 500 }}>{val}%</span>
            </div>
            <div style={{ height: 4, background: BORDER2, borderRadius: 4, overflow: "hidden" }}>
                <div className="bar-fill" style={{ height: "100%", width: `${val}%`, background: color, borderRadius: 4 }} />
            </div>
        </div>
    );
}

// ── Results view ───────────────────────────────────────────────────────────────
function ResultView({ data, file, onReset }) {
    const grade = data.grade || getGrade(data.overall_score);
    const meta  = GRADE_META[grade] || GRADE_META["Good"];

    const barColors = [ACCENT, GREEN, GOLD, PINK];

    return (
        <div>
            {/* ── Main score card ── */}
            <div className="result-card" style={{
                background: SURFACE, border: `1px solid ${meta.border}`,
                borderRadius: 18, padding: "32px", marginBottom: 20,
                position: "relative", overflow: "hidden",
            }}>
                <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: `linear-gradient(90deg,transparent,${meta.color},transparent)` }} />
                <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: meta.color, opacity: 0.04, pointerEvents: "none" }} />

                <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
                    {/* Ring */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <ScoreRing score={data.overall_score} color={meta.color} size={110} />
                        <span style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600,
                            letterSpacing: "0.12em", textTransform: "uppercase",
                            color: meta.color, background: meta.bg,
                            border: `1px solid ${meta.border}`,
                            padding: "3px 12px", borderRadius: 999,
                        }}>{grade}</span>
                    </div>

                    {/* Verdict + bars */}
                    <div style={{ flex: 1, paddingTop: 4 }}>
                        <p style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: meta.color,
                            letterSpacing: "0.14em", textTransform: "uppercase",
                            marginBottom: 6, fontWeight: 600,
                        }}>ATS Analysis Result</p>
                        <h2 style={{
                            fontFamily: "'Fraunces', serif", fontWeight: 800,
                            fontSize: 28, color: TEXT, lineHeight: 1.1,
                            marginBottom: 10, letterSpacing: "-0.03em",
                        }}>
                            Resume is{" "}
                            <em style={{ fontStyle: "italic", color: meta.color }}>{grade}</em>
                        </h2>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: MUTED, lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
                            "{data.verdict}"
                        </p>

                        {/* Score bars */}
                        {Object.entries(data.scores || {}).map(([key, val], i) => (
                            <ScoreBar
                                key={key}
                                label={key.charAt(0).toUpperCase() + key.slice(1)}
                                val={val}
                                color={barColors[i % barColors.length]}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Strengths + Issues ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>

                {/* Strengths */}
                <div className="fade-up d2" style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "22px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: "25%", right: "25%", height: 1, background: `linear-gradient(90deg,transparent,${GREEN},transparent)` }} />
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: FAINT, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>Strengths</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {(data.strengths || []).map((s, i) => (
                            <div key={i} className="fade-up" style={{ animationDelay: `${0.2 + i * 0.07}s`, display: "flex", alignItems: "flex-start", gap: 10 }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN, flexShrink: 0, marginTop: 5, boxShadow: `0 0 5px ${GREEN}` }} />
                                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: MUTED, lineHeight: 1.6 }}>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Issues */}
                <div className="fade-up d3" style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "22px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: "25%", right: "25%", height: 1, background: `linear-gradient(90deg,transparent,${PINK},transparent)` }} />
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: FAINT, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>Issues</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {(data.issues || []).map((s, i) => (
                            <div key={i} className="fade-up" style={{ animationDelay: `${0.2 + i * 0.07}s`, display: "flex", alignItems: "flex-start", gap: 10 }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: PINK, flexShrink: 0, marginTop: 5, boxShadow: `0 0 5px ${PINK}` }} />
                                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: MUTED, lineHeight: 1.6 }}>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Tips ── */}
            {(data.tips || []).length > 0 && (
                <div className="fade-up d4" style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "22px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: `linear-gradient(90deg,transparent,${ACCENT},transparent)` }} />
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: FAINT, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>How to improve</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {data.tips.map((tip, i) => {
                            const colors = [ACCENT, GREEN, GOLD, PINK];
                            const c = colors[i % colors.length];
                            return (
                                <div key={i} className="tip-card fade-up" style={{
                                    animationDelay: `${0.25 + i * 0.08}s`,
                                    background: "rgba(255,255,255,0.02)",
                                    border: `1px solid ${BORDER}`,
                                    borderRadius: 12, padding: "14px 16px",
                                    display: "flex", gap: 14, alignItems: "flex-start",
                                }}>
                                    <span style={{
                                        fontFamily: "'Fraunces', serif", fontWeight: 700,
                                        fontSize: 13, color: c, opacity: 0.8,
                                        flexShrink: 0, marginTop: 1,
                                    }}>{String(i + 1).padStart(2, "0")}</span>
                                    <div>
                                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: TEXT, fontWeight: 500, marginBottom: 4 }}>{tip.title}</p>
                                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: MUTED, lineHeight: 1.65 }}>{tip.detail}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Footer row ── */}
            <div className="fade-up d5" style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button onClick={onReset} className="reset-btn"
                    style={{ border: `1px solid ${BORDER2}`, background: "none", color: MUTED, borderRadius: 10, padding: "10px 20px", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
                    ← Scan another
                </button>
                <div style={{
                    flex: 1, background: SURFACE, border: `1px solid ${BORDER}`,
                    borderRadius: 12, padding: "10px 16px",
                    display: "flex", alignItems: "center", gap: 10,
                }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: meta.color, boxShadow: `0 0 6px ${meta.color}`, flexShrink: 0 }} />
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: MUTED }}>
                        {file?.name}
                        <span style={{ margin: "0 10px", color: FAINT }}>·</span>
                        scored <span style={{ color: meta.color, fontWeight: 600 }}>{data.overall_score}/100</span>
                        <span style={{ margin: "0 10px", color: FAINT }}>·</span>
                        <span style={{ color: meta.color, fontWeight: 600 }}>{grade}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

// ── Main scanner component ─────────────────────────────────────────────────────
function ResumeScannerPage() {
    const [file,    setFile]    = useState(null);
    const [result,  setResult]  = useState(null);
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState(null);
    const [dragging, setDragging] = useState(false);
    const fileRef = useRef();

    const handleFile = (f) => {
        if (!f) return;
        const allowed = ["application/pdf", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        if (!allowed.includes(f.type)) {
            setError("Please upload a valid PDF or Word document.");
            return;
        }
        setFile(f);
        setError(null);
    };

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    }, []);

    async function handleSubmit() {
        if (!file) { setError("Please upload a resume."); return; }
        setLoading(true);
        setError(null);
        setResult(null);

        const form = new FormData();
        form.append("file", file);

        try {
            const res = await fetch(`${API}/ats/score-file`, {
                method: "POST", body: form, credentials: "include",
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || `Server error ${res.status}`);
            }
            const data = await res.json();
            setResult(data);
        } catch (e) {
            setError(e.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function reset() { setResult(null); setFile(null); setError(null); }

    return (
        <>
            <style>{css}</style>

            {/* ── Header ── */}
            <div style={{ marginBottom: 20 }}>
                <p className="fade-up" style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>
                    Resume Intelligence
                </p>
                <h1 className="fade-up d1" style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "clamp(24px,3vw,36px)", color: TEXT, lineHeight: 1.05, marginBottom: 6, letterSpacing: "-0.035em" }}>
                    ATS <em style={{ fontStyle: "italic", color: ACCENT }}>Scanner</em>
                </h1>
                <p className="fade-up d2" style={{ fontSize: 13, color: MUTED }}>
                    Upload your resume — get an instant ATS score, strengths, issues, and actionable tips.
                </p>
            </div>

            {/* ── Upload state ── */}
            {!result ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                    {/* Left: upload */}
                    <div className="fade-up d2" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <p style={{ fontSize: 11, color: FAINT, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Resume PDF / DOCX</p>

                        <div
                            className={`drop-zone ${dragging ? "drag-over" : ""}`}
                            style={{
                                border: `1.5px dashed ${file ? ACCENT : BORDER2}`,
                                borderRadius: 14, padding: "40px 20px", textAlign: "center",
                                cursor: "pointer",
                                background: file ? "rgba(232,255,71,0.04)" : SURFACE,
                            }}
                            onClick={() => fileRef.current.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={onDrop}
                        >
                            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx"
                                style={{ display: "none" }}
                                onChange={(e) => handleFile(e.target.files[0])} />

                            {file ? (
                                <div>
                                    <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(232,255,71,0.08)", border: "1px solid rgba(232,255,71,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: ACCENT }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                                        </svg>
                                    </div>
                                    <p style={{ fontSize: 13, color: ACCENT, fontWeight: 600, marginBottom: 4 }}>{file.name}</p>
                                    <p style={{ fontSize: 11, color: MUTED, marginBottom: 12 }}>{(file.size / 1024).toFixed(1)} KB</p>
                                    <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                        style={{ fontSize: 11, color: MUTED, background: "none", border: `1px solid ${BORDER2}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.15s, color 0.15s" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = TEXT; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER2; e.currentTarget.style.color = MUTED; }}>
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="drop-icon" style={{ width: 44, height: 44, borderRadius: 10, background: SURFACE2, border: `1px solid ${BORDER2}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: MUTED }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    </div>
                                    <p style={{ fontSize: 13, color: MUTED, marginBottom: 4 }}>Drop your resume here</p>
                                    <p style={{ fontSize: 11, color: FAINT }}>or click to browse · PDF / Word</p>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div style={{ background: "rgba(249,168,212,0.06)", border: "1px solid rgba(249,168,212,0.2)", borderRadius: 10, padding: "12px 14px" }}>
                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: PINK, lineHeight: 1.6 }}>{error}</p>
                            </div>
                        )}

                        <button className="scan-btn" onClick={handleSubmit} disabled={loading || !file}
                            style={{ width: "100%", padding: "14px", border: `1px solid rgba(232,255,71,0.4)`, borderRadius: 12, background: "rgba(232,255,71,0.06)", color: ACCENT, fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", letterSpacing: "0.02em", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                            {loading ? (
                                <>
                                    <div style={{ width: 16, height: 16, border: `2px solid rgba(232,255,71,0.3)`, borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                    Scanning…
                                </>
                            ) : "Scan Resume →"}
                        </button>
                    </div>

                    {/* Right: info panels */}
                    <div className="fade-up d3" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* How it works */}
                        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "22px", position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: `linear-gradient(90deg,transparent,${ACCENT},transparent)` }} />
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: FAINT, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>How it works</p>
                            {[
                                { n: "01", title: "Resume parsed",      desc: "Text is extracted from your PDF or DOCX and cleaned of formatting noise." },
                                { n: "02", title: "ATS score computed", desc: "Our ML model evaluates formatting, keywords, sections, and readability." },
                                { n: "03", title: "AI analysis",        desc: "Groq LLM generates a tailored verdict, strengths, issues, and fix tips." },
                                { n: "04", title: "Result returned",    desc: "You get a full breakdown with an actionable improvement plan." },
                            ].map(({ n, title, desc }) => (
                                <div key={n} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                                    <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 13, color: ACCENT, opacity: 0.7, flexShrink: 0, marginTop: 1 }}>{n}</span>
                                    <div>
                                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: TEXT, fontWeight: 500, marginBottom: 3 }}>{title}</p>
                                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: MUTED, lineHeight: 1.6 }}>{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tip banner */}
                        <div style={{ background: "rgba(232,255,71,0.04)", border: "1px solid rgba(232,255,71,0.15)", borderRadius: 12, padding: "14px 16px", position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", top: 0, left: "30%", right: "30%", height: 1, background: `linear-gradient(90deg,transparent,${ACCENT},transparent)` }} />
                            <p style={{ fontSize: 12, lineHeight: 1.7 }}>
                                <span style={{ color: ACCENT, fontWeight: 600 }}>Tip: </span>
                                <span style={{ color: MUTED }}>For best results, use a clean single-column PDF with clear section headings and 300+ words of content.</span>
                            </p>
                        </div>

                        {/* What gets scored */}
                        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", top: 0, left: "25%", right: "25%", height: 1, background: `linear-gradient(90deg,transparent,${GREEN},transparent)` }} />
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: FAINT, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>What gets scored</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                                {[
                                    { label: "Formatting",  color: ACCENT },
                                    { label: "Keywords",    color: GREEN  },
                                    { label: "Sections",    color: GOLD   },
                                    { label: "Readability", color: PINK   },
                                ].map(({ label, color }) => (
                                    <span key={label} style={{
                                        background: `${color}11`, border: `1px solid ${color}33`,
                                        borderRadius: 8, padding: "4px 10px",
                                        fontFamily: "'DM Sans', sans-serif", fontSize: 11, color, fontWeight: 500,
                                    }}>{label}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <ResultView data={result} file={file} onReset={reset} />
            )}
        </>
    );
}

// ── Shell ──────────────────────────────────────────────────────────────────────
export default function ResumeScanner() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <style>{`
                * { box-sizing: border-box; }
                body { margin: 0; background: ${BG}; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(232,255,71,0.18); border-radius: 2px; }
            `}</style>
            <div style={{ fontFamily: "'DM Sans', sans-serif", background: BG, color: TEXT, minHeight: "100vh", display: "flex" }}>
                <Sidebar user={user} onLogout={() => { logout(); navigate("/login"); }} onClick={(p) => navigate(p)} />
                <Topbar />
                <main style={{ marginLeft: 256, paddingTop: 68, flex: 1, minHeight: "100vh", overflowY: "auto" }}>
                    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "26px 28px" }}>
                        <ResumeScannerPage />
                    </div>
                </main>
            </div>
        </>
    );
}