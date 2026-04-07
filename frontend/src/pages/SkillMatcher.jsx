import { useState, useRef, useCallback } from "react";

// ── Landing palette tokens ────────────────────────────────
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

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,800;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes scoreReveal { from { stroke-dashoffset:339.3; } }
  @keyframes countUp { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
  @keyframes dropBounce { 0%{transform:translateY(0)} 50%{transform:translateY(-6px)} 100%{transform:translateY(0)} }

  .fade-up { animation:fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  .d1 { animation-delay:0.06s; } .d2 { animation-delay:0.14s; }
  .d3 { animation-delay:0.22s; } .d4 { animation-delay:0.30s; }

  textarea:focus { outline:none; border-color:rgba(232,255,71,0.45) !important; }

  .drop-zone { transition:border-color 0.2s, background 0.2s; }
  .drop-zone.drag-over { border-color:${ACCENT} !important; background:rgba(232,255,71,0.05) !important; }
  .drop-zone.drag-over .drop-icon { animation:dropBounce 0.6s ease infinite; }

  .submit-btn { transition:background 0.2s, color 0.2s, transform 0.1s, box-shadow 0.2s; }
  .submit-btn:hover:not(:disabled) { background:${ACCENT} !important; color:#0a0a0e !important; box-shadow:0 4px 20px rgba(232,255,71,0.25) !important; border-color:${ACCENT} !important; }
  .submit-btn:active:not(:disabled) { transform:scale(0.98); }
  .submit-btn:disabled { opacity:0.35; cursor:not-allowed; }

  .score-ring { animation:scoreReveal 1.4s cubic-bezier(0.22,1,0.36,1) both; animation-delay:0.1s; }
  .score-num  { animation:countUp 0.6s cubic-bezier(0.22,1,0.36,1) both; animation-delay:0.5s; }

  .tip-item { transition:border-color 0.2s, background 0.2s; }
  .tip-item:hover { border-color:rgba(232,255,71,0.25) !important; background:rgba(232,255,71,0.03) !important; }

  .reset-btn { transition:border-color 0.2s, color 0.2s; }
  .reset-btn:hover { border-color:rgba(240,237,232,0.25) !important; color:${TEXT} !important; }
`;

function scoreColor(s) {
    if (s >= 70) return ACCENT;
    if (s >= 50) return GOLD;
    return PINK;
}
function scoreLabel(s) {
    if (s >= 75) return "Strong Match";
    if (s >= 60) return "Good Match";
    if (s >= 45) return "Moderate Match";
    return "Weak Match";
}
function scoreTips(s) {
    if (s >= 75) return [
        "Your resume aligns well with this job description.",
        "Ensure your top skills appear in the first half of your resume.",
        "Quantify achievements where possible — numbers stand out.",
        "Tailor your summary to mirror the job title.",
    ];
    if (s >= 55) return [
        "Several keywords from the JD are missing in your resume.",
        "Add a 'Skills' section that directly mirrors the JD's language.",
        "Use the exact job title from the posting in your resume header.",
        "Reorder bullet points to front-load the most relevant experience.",
    ];
    return [
        "Significant keyword gap detected between resume and JD.",
        "Rewrite your experience bullets using language from the job post.",
        "Add more domain-specific skills that appear in the description.",
        "Consider a targeted summary that directly addresses the role.",
    ];
}

function ScoreRing({ score }) {
    const r = 54, circ = 2 * Math.PI * r, col = scoreColor(score);
    const offset = circ * (1 - score / 100);
    return (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}>
            <div style={{ position:"relative", width:148, height:148 }}>
                <svg width="148" height="148" viewBox="0 0 148 148">
                    <circle cx="74" cy="74" r={r} fill="none" stroke={BORDER2} strokeWidth="7" />
                    <circle className="score-ring" cx="74" cy="74" r={r} fill="none" stroke={col} strokeWidth="7" strokeLinecap="round"
                        strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 74 74)"
                        style={{ transition:"stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)" }} />
                </svg>
                <div className="score-num" style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2 }}>
                    <span style={{ fontFamily:"'Fraunces', serif", fontSize:36, fontWeight:800, color:col, lineHeight:1 }}>{score}</span>
                    <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:10, color:FAINT, letterSpacing:"0.1em", textTransform:"uppercase" }}>/ 100</span>
                </div>
            </div>
            <div style={{ textAlign:"center" }}>
                <p style={{ fontFamily:"'Fraunces', serif", fontStyle:"italic", fontWeight:300, fontSize:20, color:col, margin:"0 0 4px" }}>{scoreLabel(score)}</p>
                <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:MUTED }}>ATS compatibility score</p>
            </div>
            <div style={{ width:"100%", background:SURFACE2, borderRadius:10, padding:"14px 16px", border:`1px solid ${BORDER}` }}>
                {[
                    { label:"Semantic match",  value:Math.min(100,Math.round(score*1.05)), color:GREEN },
                    { label:"Keyword overlap", value:Math.min(100,Math.round(score*0.88)), color:ACCENT },
                    { label:"Overall score",   value:score,                                color:col   },
                ].map(({ label, value, color }) => (
                    <div key={label} style={{ marginBottom:10 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                            <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, color:MUTED }}>{label}</span>
                            <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, color:TEXT, fontWeight:500 }}>{value}%</span>
                        </div>
                        <div style={{ height:4, background:BORDER2, borderRadius:4, overflow:"hidden" }}>
                            <div style={{ height:"100%", width:`${value}%`, background:color, borderRadius:4, transition:"width 1.2s cubic-bezier(0.22,1,0.36,1)" }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Tips({ score }) {
    return (
        <div>
            <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, color:FAINT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>Recommendations</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {scoreTips(score).map((tip, i) => (
                    <div key={i} className="tip-item fade-up" style={{ animationDelay:`${0.55+i*0.08}s`, background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:10, padding:"12px 14px", display:"flex", gap:12, alignItems:"flex-start" }}>
                        <span style={{ width:20, height:20, borderRadius:"50%", background:"rgba(232,255,71,0.08)", border:"1px solid rgba(232,255,71,0.25)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                <path d="M1 4.5L3 6.5L7 2" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:MUTED, lineHeight:1.6 }}>{tip}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function SkillMatcher() {
    const [file, setFile]         = useState(null);
    const [jobDesc, setJobDesc]   = useState("");
    const [score, setScore]       = useState(null);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState(null);
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
        if (!file || !jobDesc.trim()) { setError("Please upload a resume and enter a job description."); return; }
        setLoading(true); setError(null); setScore(null);
        const form = new FormData();
        form.append("file", file);
        form.append("job_description", jobDescription);
        try {
            const res = await fetch("https://jobhitai-server.onrender.com/predict/resumejobmatcher", { method:"POST", body:form });
            if (!res.ok) throw new Error("Server error");
            const data = await res.json();
            setScore(data.score);
        } catch (err) {
            console.error(err);
            setError("Backend not reachable.");
        }
        setLoading(false);
    }

    function reset() { setScore(null); setFile(null); setJobDesc(""); setError(null); }

    // Pure content component — page shell & layout handled by SkillMatcherPage
    return (
        <>
            <style>{css}</style>

            {/* Page header — same style as CareerAdvisor */}
            <div style={{ marginBottom:20 }}>
                <p className="fade-up" style={{ fontSize:10, color:ACCENT, letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:6, fontWeight:600 }}>
                    Resume Intelligence
                </p>
                <h1 className="fade-up d1" style={{ fontFamily:"'Fraunces', serif", fontWeight:800, fontSize:"clamp(24px,3vw,36px)", color:TEXT, lineHeight:1.05, marginBottom:6, letterSpacing:"-0.035em" }}>
                    ATS <em style={{ fontStyle:"italic", color:ACCENT }}>Score</em> Checker
                </h1>
                <p className="fade-up d2" style={{ fontSize:13, color:MUTED }}>
                    Upload your resume and paste a job description to measure compatibility.
                </p>
            </div>

            {!score ? (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

                    {/* Left */}
                    <div className="fade-up d2" style={{ display:"flex", flexDirection:"column", gap:16 }}>
                        <div>
                            <p style={{ fontSize:11, color:FAINT, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12, fontWeight:600 }}>Resume PDF</p>
                            <div
                                className={`drop-zone ${dragging ? "drag-over" : ""}`}
                                style={{ border:`1.5px dashed ${file ? ACCENT : BORDER2}`, borderRadius:14, padding:"32px 20px", textAlign:"center", cursor:"pointer", background:file ? "rgba(232,255,71,0.04)" : SURFACE }}
                                onClick={() => fileRef.current.click()}
                                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={onDrop}
                            >
                                <input ref={fileRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={(e) => handleFile(e.target.files[0])} />
                                {file ? (
                                    <div>
                                        <div style={{ width:40, height:40, borderRadius:10, background:"rgba(232,255,71,0.08)", border:"1px solid rgba(232,255,71,0.25)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                                            </svg>
                                        </div>
                                        <p style={{ fontSize:13, color:ACCENT, fontWeight:600, marginBottom:4 }}>{file.name}</p>
                                        <p style={{ fontSize:11, color:MUTED }}>{(file.size/1024).toFixed(1)} KB</p>
                                        <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                            style={{ marginTop:10, fontSize:11, color:MUTED, background:"none", border:`1px solid ${BORDER2}`, borderRadius:6, padding:"4px 10px", cursor:"pointer", fontFamily:"'DM Sans', sans-serif", transition:"border-color 0.15s, color 0.15s" }}
                                            onMouseEnter={(e) => { e.currentTarget.style.borderColor=BORDER; e.currentTarget.style.color=TEXT; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.borderColor=BORDER2; e.currentTarget.style.color=MUTED; }}
                                        >Remove</button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="drop-icon" style={{ width:40, height:40, borderRadius:10, background:SURFACE2, border:`1px solid ${BORDER2}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.8" strokeLinecap="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                            </svg>
                                        </div>
                                        <p style={{ fontSize:13, color:MUTED, marginBottom:4 }}>Drop your PDF here</p>
                                        <p style={{ fontSize:11, color:FAINT }}>or click to browse</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
                            <p style={{ fontSize:11, color:FAINT, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12, fontWeight:600 }}>Job Description</p>
                            <textarea
                                value={jobDesc} onChange={(e) => setJobDesc(e.target.value)}
                                placeholder="Paste the full job description here…"
                                style={{ flex:1, minHeight:200, background:SURFACE, border:`1px solid ${BORDER2}`, borderRadius:12, padding:"14px 16px", color:TEXT, fontSize:13, fontFamily:"'DM Sans', sans-serif", lineHeight:1.7, resize:"none", transition:"border-color 0.2s" }}
                            />
                            <p style={{ fontSize:11, color:FAINT, marginTop:6, textAlign:"right" }}>
                                {jobDesc.trim().split(/\s+/).filter(Boolean).length} words
                            </p>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="fade-up d3" style={{ display:"flex", flexDirection:"column", gap:16 }}>
                        <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:16, padding:"22px", position:"relative", overflow:"hidden" }}>
                            <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:1, background:`linear-gradient(90deg,transparent,${ACCENT},transparent)` }} />
                            <p style={{ fontSize:11, color:FAINT, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:16, fontWeight:600 }}>How it works</p>
                            {[
                                { n:"01", title:"Upload resume",     desc:"PDF is parsed and cleaned — URLs, emails, and noise removed." },
                                { n:"02", title:"Semantic analysis", desc:"Sentence embeddings measure meaning similarity beyond keywords." },
                                { n:"03", title:"Keyword overlap",   desc:"Exact keyword coverage against the job description is measured." },
                                { n:"04", title:"ATS score",         desc:"70% semantic + 30% keyword gives your final ATS compatibility score." },
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
                                <span style={{ color:MUTED }}>Scores above 70 indicate strong ATS compatibility. Most ATS systems filter resumes below 60.</span>
                            </p>
                        </div>

                        {error && (
                            <div style={{ background:"rgba(249,168,212,0.06)", border:"1px solid rgba(249,168,212,0.2)", borderRadius:10, padding:"12px 14px" }}>
                                <p style={{ fontSize:12, color:PINK, lineHeight:1.6 }}>{error}</p>
                            </div>
                        )}

                        <button className="submit-btn" onClick={handleSubmit} disabled={loading || !file || !jobDesc.trim()}
                            style={{ width:"100%", padding:"14px", border:`1px solid rgba(232,255,71,0.4)`, borderRadius:12, background:"rgba(232,255,71,0.06)", color:ACCENT, fontSize:14, fontWeight:700, fontFamily:"'DM Sans', sans-serif", cursor:"pointer", letterSpacing:"0.02em", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                            {loading ? (
                                <>
                                    <div style={{ width:16, height:16, border:`2px solid rgba(232,255,71,0.3)`, borderTopColor:ACCENT, borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                                    Analyzing…
                                </>
                            ) : "Analyze Resume →"}
                        </button>
                    </div>
                </div>

            ) : (
                <div>
                    <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:24, alignItems:"start" }}>
                        <div className="fade-up" style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:18, padding:"28px 22px", position:"relative", overflow:"hidden" }}>
                            <div style={{ position:"absolute", top:0, left:"15%", right:"15%", height:1, background:`linear-gradient(90deg,transparent,${ACCENT},transparent)` }} />
                            <ScoreRing score={Math.round(score)} />
                        </div>
                        <div className="fade-up d1"><Tips score={Math.round(score)} /></div>
                    </div>

                    <div className="fade-up d4" style={{ marginTop:24, display:"flex", gap:12 }}>
                        <button onClick={reset} className="reset-btn"
                            style={{ border:`1px solid ${BORDER2}`, background:"none", color:MUTED, borderRadius:10, padding:"10px 20px", fontSize:13, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>
                            ← Analyze another
                        </button>
                        <div style={{ flex:1, background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:12, padding:"10px 16px", display:"flex", alignItems:"center", gap:10 }}>
                            <div style={{ width:8, height:8, borderRadius:"50%", background:scoreColor(score), boxShadow:`0 0 6px ${scoreColor(score)}`, flexShrink:0 }} />
                            <p style={{ fontSize:12, color:MUTED }}>
                                Resume: <span style={{ color:TEXT }}>{file?.name}</span>
                                <span style={{ margin:"0 10px", color:FAINT }}>·</span>
                                {jobDesc.trim().split(/\s+/).filter(Boolean).length} words in JD
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}