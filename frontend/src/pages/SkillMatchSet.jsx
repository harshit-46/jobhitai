/*

import { useState, useRef } from "react";

const BG = "#09090f";
const SURFACE = "#111118";
const SURFACE2 = "#16161f";
const BORDER = "#22222e";
const BORDER2 = "#2e2e3e";
const TEXT = "#efefef";
const MUTED = "#666677";
const ACCENT = "#b8f04a";
const PURPLE = "#7c6af7";

const VERDICT_META = {
    strong: { color: ACCENT, bg: `${ACCENT}14`, border: `${ACCENT}33`, label: "Strong Match" },
    moderate: { color: "#f0c94a", bg: "#f0c94a14", border: "#f0c94a33", label: "Moderate Match" },
    low: { color: "#f07a4a", bg: "#f07a4a14", border: "#f07a4a33", label: "Low Confidence" },
};

const ROLE_META = {
    "Data Science": { color: PURPLE, bg: `${PURPLE}18`, border: `${PURPLE}33` },
    "Python Developer": { color: "#4ab8f0", bg: "#4ab8f018", border: "#4ab8f033" },
    "Java Developer": { color: "#f07a4a", bg: "#f07a4a18", border: "#f07a4a33" },
    "Web Designing": { color: "#f0c94a", bg: "#f0c94a18", border: "#f0c94a33" },
    "DevOps Engineer": { color: "#f04a7a", bg: "#f04a7a18", border: "#f04a7a33" },
    "HR": { color: "#b84af0", bg: "#b84af018", border: "#b84af033" },
    "Advocate": { color: "#f0a44a", bg: "#f0a44a18", border: "#f0a44a33" },
    "Accountant": { color: "#4af0a4", bg: "#4af0a418", border: "#4af0a433" },
    "Business Analyst": { color: "#f04af0", bg: "#f04af018", border: "#f04af033" },
};

function getRoleMeta(role) {
    const key = Object.keys(ROLE_META).find(k => k.toLowerCase() === role?.toLowerCase());
    return key ? ROLE_META[key] : { color: ACCENT, bg: `${ACCENT}18`, border: `${ACCENT}33` };
}

const SKILL_SUGGESTIONS = [
    "Python", "React", "SQL", "Machine Learning", "Docker",
    "Java", "Node.js", "TensorFlow", "AWS", "Figma",
    "Excel", "Pandas", "Kubernetes", "Spring Boot", "TypeScript",
];

const css = `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes fadeUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes barGrow {
        from { width: 0; }
    }
    @keyframes popIn {
        from { opacity: 0; transform: scale(0.9); }
        to   { opacity: 1; transform: scale(1); }
    }
    @keyframes tagIn {
        from { opacity: 0; transform: scale(0.85) translateY(4px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    .fade-up { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
    .d1 { animation-delay: 0.06s; }
    .d2 { animation-delay: 0.12s; }
    .d3 { animation-delay: 0.18s; }
    .d4 { animation-delay: 0.26s; }

    .skill-chip {
        display: inline-flex; align-items: center; gap: 6px;
        background: ${SURFACE2}; border: 1px solid ${BORDER2};
        border-radius: 8px; padding: 5px 10px;
        font-family: 'DM Sans', sans-serif; font-size: 12px; color: ${TEXT};
        cursor: default; animation: tagIn 0.3s cubic-bezier(0.22,1,0.36,1) both;
        transition: border-color 0.2s;
    }
    .skill-chip:hover { border-color: #f07a4a55; }
    .skill-chip-remove {
        width: 14px; height: 14px; border-radius: 50%;
        background: none; border: none; cursor: pointer;
        color: ${MUTED}; display: flex; align-items: center; justify-content: center;
        padding: 0; transition: color 0.15s;
        font-size: 14px; line-height: 1;
    }
    .skill-chip-remove:hover { color: #f07a4a; }

    .suggestion-btn {
        background: ${SURFACE}; border: 1px solid ${BORDER};
        border-radius: 7px; padding: 5px 10px;
        font-family: 'DM Sans', sans-serif; font-size: 11px; color: ${MUTED};
        cursor: pointer; transition: border-color 0.2s, color 0.2s, background 0.2s;
        white-space: nowrap;
    }
    .suggestion-btn:hover { border-color: ${ACCENT}55; color: ${ACCENT}; background: ${ACCENT}0a; }
    .suggestion-btn.used { opacity: 0.3; pointer-events: none; }

    .submit-btn { transition: background 0.2s, color 0.2s, transform 0.1s; }
    .submit-btn:hover:not(:disabled) { background: ${ACCENT} !important; color: #000 !important; }
    .submit-btn:active:not(:disabled) { transform: scale(0.98); }
    .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    .bar-grow { animation: barGrow 1.1s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.35s; }

    .result-pop { animation: popIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }

    .other-card { transition: border-color 0.2s, background 0.2s; }
    .other-card:hover { background: #1a1a25 !important; }

    input[type="text"]:focus { outline: none; border-color: ${ACCENT}66 !important; }
`;

function ConfidenceArc({ value, color }) {
    // Semi-circle arc gauge
    const r = 52;
    const cx = 70, cy = 70;
    const total = Math.PI * r; 
    const fill = total * (value / 100);
    const gap = total - fill;

    return (
        <svg width="140" height="78" viewBox="0 0 140 78" style={{ overflow: "visible" }}>
            <path
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                fill="none" stroke={BORDER2} strokeWidth="7" strokeLinecap="round"
            />
            <path
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
                strokeDasharray={`${fill} ${gap + 2}`}
                strokeDashoffset="0"
                style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.22,1,0.36,1)" }}
                className="bar-grow"
            />
            <text x={cx} y={cy - 6} textAnchor="middle"
                style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, fill: color }}>
                {value}%
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fill: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                confidence
            </text>
        </svg>
    );
}

function ResultView({ data, skills, onReset }) {
    const { best_role, confidence, verdict, others } = data;
    const vm = VERDICT_META[verdict.type] || VERDICT_META.low;
    const rm = getRoleMeta(best_role);

    return (
        <div>
            <div className="result-pop" style={{
                background: SURFACE, border: `1px solid ${rm.border}`,
                borderRadius: 16, padding: "28px 28px 24px",
                marginBottom: 16, position: "relative", overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", top: -60, right: -60,
                    width: 220, height: 220, borderRadius: "50%",
                    background: rm.color, opacity: 0.05, pointerEvents: "none",
                }} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
                    <div>
                        <span style={{
                            display: "inline-block",
                            background: vm.bg, border: `1px solid ${vm.border}`,
                            borderRadius: 6, padding: "3px 10px", marginBottom: 14,
                            fontFamily: "'DM Sans', sans-serif", fontSize: 10,
                            color: vm.color, letterSpacing: "0.12em", textTransform: "uppercase",
                        }}>
                            {vm.label}
                        </span>

                        <p style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: 10,
                            color: MUTED, letterSpacing: "0.12em",
                            textTransform: "uppercase", marginBottom: 6,
                        }}>Best matching role</p>

                        <h2 style={{
                            fontFamily: "'Fraunces', serif", fontWeight: 300,
                            fontSize: 36, color: TEXT, lineHeight: 1.05, marginBottom: 12,
                        }}>
                            <em style={{ fontStyle: "italic", color: rm.color }}>{best_role}</em>
                        </h2>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {skills.map((s, i) => (
                                <span key={i} style={{
                                    background: SURFACE2, border: `1px solid ${BORDER2}`,
                                    borderRadius: 7, padding: "4px 10px",
                                    fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: MUTED,
                                }}>
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, paddingRight: 4 }}>
                        <ConfidenceArc value={Math.round(confidence)} color={vm.color} />
                    </div>
                </div>
            </div>

            {others.length > 0 && (
                <div className="fade-up d2" style={{ marginBottom: 16 }}>
                    <p style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 10,
                        color: MUTED, letterSpacing: "0.1em",
                        textTransform: "uppercase", marginBottom: 12,
                    }}>Also considered</p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {others.map(({ role, confidence: c }, i) => {
                            const m = getRoleMeta(role);
                            return (
                                <div key={i} className="other-card fade-up" style={{
                                    animationDelay: `${0.1 + i * 0.07}s`,
                                    background: SURFACE, border: `1px solid ${BORDER}`,
                                    borderRadius: 12, padding: "14px 16px",
                                    display: "flex", alignItems: "center", gap: 14,
                                }}>
                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0 }} />

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: TEXT, fontWeight: 500 }}>
                                                {role}
                                            </span>
                                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: MUTED }}>
                                                {Math.round(c)}%
                                            </span>
                                        </div>
                                        <div style={{ height: 3, background: BORDER2, borderRadius: 3, overflow: "hidden" }}>
                                            <div className="bar-grow" style={{
                                                height: "100%", width: `${c}%`,
                                                background: m.color, borderRadius: 3,
                                                animationDelay: `${0.4 + i * 0.1}s`,
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="fade-up d4" style={{ display: "flex", gap: 12 }}>
                <button onClick={onReset} style={{
                    border: `1px solid ${BORDER2}`, background: "none", color: MUTED,
                    borderRadius: 8, padding: "10px 20px", fontSize: 13,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    transition: "color 0.2s, border-color 0.2s",
                }}>
                    ← Try again
                </button>
                <div style={{
                    flex: 1, background: SURFACE, border: `1px solid ${BORDER}`,
                    borderRadius: 10, padding: "10px 16px",
                    display: "flex", alignItems: "center", gap: 10,
                }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: vm.color, flexShrink: 0 }} />
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: MUTED }}>
                        {skills.length} skill{skills.length !== 1 ? "s" : ""} →{" "}
                        <span style={{ color: rm.color }}>{best_role}</span>
                        <span style={{ margin: "0 10px", color: BORDER2 }}>·</span>
                        <span style={{ color: vm.color }}>{Math.round(confidence)}% confidence</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function SkillMatchSet() {
    const [inputVal, setInputVal] = useState("");
    const [skills, setSkills] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef();

    function addSkill(s) {
        const trimmed = s.trim().replace(/,+$/, "").trim();
        if (!trimmed) return;
        if (skills.find(x => x.toLowerCase() === trimmed.toLowerCase())) return;
        setSkills(prev => [...prev, trimmed]);
    }

    function handleKeyDown(e) {
        if (e.key === "," || e.key === "Enter") {
            e.preventDefault();
            const parts = inputVal.split(",").map(s => s.trim()).filter(Boolean);
            parts.forEach(addSkill);
            setInputVal("");
        } else if (e.key === "Backspace" && !inputVal && skills.length) {
            setSkills(prev => prev.slice(0, -1));
        }
    }

    function handleInputChange(e) {
        const val = e.target.value;
        if (val.includes(",")) {
            const parts = val.split(",").map(s => s.trim()).filter(Boolean);
            parts.slice(0, -1).forEach(addSkill);
            setInputVal(parts[parts.length - 1] || "");
        } else {
            setInputVal(val);
        }
    }

    function removeSkill(idx) {
        setSkills(prev => prev.filter((_, i) => i !== idx));
    }

    async function handleSubmit() {
        const allSkills = inputVal.trim()
            ? [...skills, inputVal.trim()]
            : skills;

        if (allSkills.length === 0) {
            setError("Please add at least one skill.");
            return;
        }

        setLoading(true); setError(null); setResult(null);
        const payload = { skills: allSkills.join(", ") };

        try {
            const res = await fetch("http://localhost:8000/api/skills/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials : "include"
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Server error");
            }
            const data = await res.json();
            if (inputVal.trim()) { addSkill(inputVal.trim()); setInputVal(""); }
            setResult(data);
        } catch (err) {
            setError(err.message || "Backend not reachable.");
        }

        setLoading(false);
    }

    function reset() { setResult(null); setSkills([]); setInputVal(""); setError(null); }

    const usedSet = new Set(skills.map(s => s.toLowerCase()));

    return (
        <>
            <style>{css}</style>
            <div style={{ minHeight: "100vh", background: BG, color: TEXT, fontFamily: "'DM Sans', sans-serif" }}>

                <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "28px 40px 24px" }}>
                    <div style={{ maxWidth: 820, margin: "0 auto" }}>
                        <p className="fade-up" style={{
                            fontSize: 10, color: ACCENT, letterSpacing: "0.16em",
                            textTransform: "uppercase", marginBottom: 6,
                        }}>Resume Intelligence</p>
                        <h1 className="fade-up d1" style={{
                            fontFamily: "'Fraunces', serif", fontWeight: 300,
                            fontSize: 34, color: TEXT, lineHeight: 1.1, marginBottom: 6,
                        }}>
                            Skill <em style={{ fontStyle: "italic" }}>Role</em> Matcher
                        </h1>
                        <p className="fade-up d2" style={{ fontSize: 13, color: MUTED }}>
                            Enter your skills — our model finds the role you're best suited for.
                        </p>
                    </div>
                </div>

                <div style={{ maxWidth: 820, margin: "0 auto", padding: "36px 40px" }}>

                    {!result ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                            <div className="fade-up d2" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                                <div>
                                    <p style={{
                                        fontSize: 11, color: MUTED, textTransform: "uppercase",
                                        letterSpacing: "0.1em", marginBottom: 12,
                                    }}>Your Skills</p>

                                    <div
                                        onClick={() => inputRef.current?.focus()}
                                        style={{
                                            minHeight: 120, background: SURFACE,
                                            border: `1px solid ${BORDER2}`, borderRadius: 12,
                                            padding: "10px 12px", cursor: "text",
                                            display: "flex", flexWrap: "wrap", gap: 7, alignContent: "flex-start",
                                            transition: "border-color 0.2s",
                                        }}
                                    >
                                        {skills.map((s, i) => (
                                            <span key={i} className="skill-chip" style={{ animationDelay: `${i * 0.04}s` }}>
                                                {s}
                                                <button className="skill-chip-remove" onClick={(e) => { e.stopPropagation(); removeSkill(i); }}>
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={inputVal}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            placeholder={skills.length === 0 ? "Type a skill and press comma or Enter…" : "Add more…"}
                                            style={{
                                                background: "none", border: "none", outline: "none",
                                                color: TEXT, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                                                minWidth: 160, flex: 1, padding: "4px 2px",
                                            }}
                                        />
                                    </div>
                                    <p style={{ fontSize: 11, color: BORDER2, marginTop: 6, textAlign: "right" }}>
                                        {skills.length} skill{skills.length !== 1 ? "s" : ""} added
                                    </p>
                                </div>

                                <div>
                                    <p style={{
                                        fontSize: 10, color: MUTED, textTransform: "uppercase",
                                        letterSpacing: "0.1em", marginBottom: 10,
                                    }}>Quick add</p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                                        {SKILL_SUGGESTIONS.map(s => (
                                            <button
                                                key={s}
                                                className={`suggestion-btn ${usedSet.has(s.toLowerCase()) ? "used" : ""}`}
                                                onClick={() => { addSkill(s); inputRef.current?.focus(); }}
                                            >
                                                + {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {error && (
                                    <div style={{
                                        background: "#f07a4a14", border: "1px solid #f07a4a33",
                                        borderRadius: 10, padding: "12px 14px",
                                    }}>
                                        <p style={{ fontSize: 12, color: "#f07a4a", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                                            {error}
                                        </p>
                                    </div>
                                )}

                                <button
                                    className="submit-btn"
                                    onClick={handleSubmit}
                                    disabled={loading || (skills.length === 0 && !inputVal.trim())}
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
                                            Matching…
                                        </>
                                    ) : "Find My Role →"}
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
                                        { n: "01", title: "Enter your skills", desc: "Type any skills separated by commas, or use the quick-add buttons." },
                                        { n: "02", title: "Vectorized", desc: "Your skill set is converted using a Count Vectorizer trained on job data." },
                                        { n: "03", title: "Classified", desc: "An ML classifier predicts the top 3 most fitting job roles with probabilities." },
                                        { n: "04", title: "Verdict issued", desc: "Strong (≥75%), Moderate (≥45%), or Low Confidence based on the top score." },
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
                                    background: SURFACE, border: `1px solid ${BORDER}`,
                                    borderRadius: 14, padding: "18px 20px",
                                }}>
                                    <p style={{
                                        fontSize: 11, color: MUTED, textTransform: "uppercase",
                                        letterSpacing: "0.1em", marginBottom: 14,
                                    }}>Confidence thresholds</p>
                                    {Object.entries(VERDICT_META).map(([key, v]) => (
                                        <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                                            <div style={{
                                                width: 8, height: 8, borderRadius: "50%",
                                                background: v.color, flexShrink: 0,
                                            }} />
                                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: v.color, fontWeight: 500, width: 120 }}>
                                                {v.label}
                                            </span>
                                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: MUTED }}>
                                                {key === "strong" ? "≥ 75%" : key === "moderate" ? "45 – 74%" : "< 45%"}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    background: `${ACCENT}0a`, border: `1px solid ${ACCENT}22`,
                                    borderRadius: 12, padding: "14px 16px",
                                }}>
                                    <p style={{ fontSize: 12, color: ACCENT, lineHeight: 1.7 }}>
                                        <strong style={{ fontWeight: 500 }}>Tip:</strong> Adding 5–10 specific skills gives the most accurate prediction. Include both technical and domain skills.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <ResultView data={result} skills={skills} onReset={reset} />
                    )}
                </div>
            </div>
        </>
    );
}

*/


import { useState, useRef } from "react";

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

const VERDICT_META = {
    strong:   { color: ACCENT, bg: "rgba(232,255,71,0.07)",  border: "rgba(232,255,71,0.2)",  label: "Strong Match"    },
    moderate: { color: GOLD,   bg: "rgba(252,211,77,0.07)",  border: "rgba(252,211,77,0.2)",  label: "Moderate Match"  },
    low:      { color: PINK,   bg: "rgba(249,168,212,0.07)", border: "rgba(249,168,212,0.2)", label: "Low Confidence"  },
};

const ROLE_META = {
    "Data Science":     { color: ACCENT, bg: "rgba(232,255,71,0.07)",  border: "rgba(232,255,71,0.2)"  },
    "Python Developer": { color: GREEN,  bg: "rgba(134,239,172,0.07)", border: "rgba(134,239,172,0.2)" },
    "Java Developer":   { color: PINK,   bg: "rgba(249,168,212,0.07)", border: "rgba(249,168,212,0.2)" },
    "Web Designing":    { color: GOLD,   bg: "rgba(252,211,77,0.07)",  border: "rgba(252,211,77,0.2)"  },
    "DevOps Engineer":  { color: "#93c5fd", bg: "rgba(147,197,253,0.07)", border: "rgba(147,197,253,0.2)" },
    "HR":               { color: "#c4b5fd", bg: "rgba(196,181,253,0.07)", border: "rgba(196,181,253,0.2)" },
    "Advocate":         { color: GOLD,   bg: "rgba(252,211,77,0.07)",  border: "rgba(252,211,77,0.2)"  },
    "Accountant":       { color: GREEN,  bg: "rgba(134,239,172,0.07)", border: "rgba(134,239,172,0.2)" },
    "Business Analyst": { color: PINK,   bg: "rgba(249,168,212,0.07)", border: "rgba(249,168,212,0.2)" },
};

function getRoleMeta(role) {
    const key = Object.keys(ROLE_META).find(k => k.toLowerCase() === role?.toLowerCase());
    return key ? ROLE_META[key] : { color: ACCENT, bg: "rgba(232,255,71,0.07)", border: "rgba(232,255,71,0.2)" };
}

const SKILL_SUGGESTIONS = [
    "Python", "React", "SQL", "Machine Learning", "Docker",
    "Java", "Node.js", "TensorFlow", "AWS", "Figma",
    "Excel", "Pandas", "Kubernetes", "Spring Boot", "TypeScript",
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,800;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes barGrow { from{width:0} }
  @keyframes popIn   { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
  @keyframes tagIn   { from{opacity:0;transform:scale(0.85) translateY(4px)} to{opacity:1;transform:scale(1) translateY(0)} }

  .fade-up{animation:fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both}
  .d1{animation-delay:0.06s} .d2{animation-delay:0.12s}
  .d3{animation-delay:0.18s} .d4{animation-delay:0.26s}

  .skill-chip {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(255,255,255,0.055); border:1px solid rgba(255,255,255,0.12);
    border-radius:8px; padding:5px 10px;
    font-family:'DM Sans',sans-serif; font-size:12px; color:#f0ede8;
    cursor:default; animation:tagIn 0.3s cubic-bezier(0.22,1,0.36,1) both;
    transition:border-color 0.2s;
  }
  .skill-chip:hover { border-color:rgba(232,255,71,0.35); }
  .skill-chip-remove {
    width:14px; height:14px; border-radius:50%;
    background:none; border:none; cursor:pointer;
    color:rgba(240,237,232,0.35); display:flex; align-items:center; justify-content:center;
    padding:0; transition:color 0.15s; font-size:14px; line-height:1;
  }
  .skill-chip-remove:hover { color:#f9a8d4; }

  .suggestion-btn {
    background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
    border-radius:7px; padding:5px 10px;
    font-family:'DM Sans',sans-serif; font-size:11px; color:rgba(240,237,232,0.45);
    cursor:pointer; transition:border-color 0.2s, color 0.2s, background 0.2s;
    white-space:nowrap;
  }
  .suggestion-btn:hover { border-color:rgba(232,255,71,0.35); color:#E8FF47; background:rgba(232,255,71,0.06); }
  .suggestion-btn.used { opacity:0.3; pointer-events:none; }

  .submit-btn { transition:background 0.2s, color 0.2s, transform 0.1s, box-shadow 0.2s; }
  .submit-btn:hover:not(:disabled) { background:#E8FF47 !important; color:#0a0a0e !important; box-shadow:0 4px 20px rgba(232,255,71,0.25) !important; border-color:#E8FF47 !important; }
  .submit-btn:active:not(:disabled) { transform:scale(0.98); }
  .submit-btn:disabled { opacity:0.35; cursor:not-allowed; }

  .bar-grow { animation:barGrow 1.1s cubic-bezier(0.22,1,0.36,1) both; animation-delay:0.35s; }
  .result-pop { animation:popIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }

  .other-card { transition:border-color 0.2s, background 0.2s; }
  .other-card:hover { background:rgba(255,255,255,0.04) !important; }

  .reset-btn { transition:color 0.2s, border-color 0.2s; }
  .reset-btn:hover { border-color:rgba(240,237,232,0.25) !important; color:#f0ede8 !important; }

  input[type="text"]:focus { outline:none; border-color:rgba(232,255,71,0.45) !important; }
  .chip-input-box:focus-within { border-color:rgba(232,255,71,0.35) !important; }
`;

function ConfidenceArc({ value, color }) {
    const r = 52, cx = 70, cy = 70;
    const total = Math.PI * r;
    const fill = total * (value / 100);
    const gap  = total - fill;
    return (
        <svg width="140" height="78" viewBox="0 0 140 78" style={{ overflow:"visible" }}>
            <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={BORDER2} strokeWidth="7" strokeLinecap="round" />
            <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
                strokeDasharray={`${fill} ${gap+2}`} strokeDashoffset="0"
                style={{ transition:"stroke-dasharray 1.2s cubic-bezier(0.22,1,0.36,1)" }}
                className="bar-grow" />
            <text x={cx} y={cy-6} textAnchor="middle" style={{ fontFamily:"'Fraunces', serif", fontSize:26, fontWeight:800, fill:color }}>{value}%</text>
            <text x={cx} y={cy+10} textAnchor="middle" style={{ fontFamily:"'DM Sans', sans-serif", fontSize:9, fill:FAINT, letterSpacing:"0.1em", textTransform:"uppercase" }}>confidence</text>
        </svg>
    );
}

function ResultView({ data, skills, onReset }) {
    const { best_role, confidence, verdict, others } = data;
    const vm = VERDICT_META[verdict.type] || VERDICT_META.low;
    const rm = getRoleMeta(best_role);

    return (
        <div>
            {/* Main result card */}
            <div className="result-pop" style={{ background:SURFACE, border:`1px solid ${rm.border}`, borderRadius:18, padding:"28px 28px 24px", marginBottom:16, position:"relative", overflow:"hidden" }}>
                {/* Top accent line */}
                <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:1, background:`linear-gradient(90deg,transparent,${rm.color},transparent)` }} />
                {/* Ambient glow */}
                <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:rm.color, opacity:0.04, pointerEvents:"none" }} />

                <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:24, alignItems:"center" }}>
                    <div>
                        {/* Verdict badge */}
                        <span style={{ display:"inline-block", background:vm.bg, border:`1px solid ${vm.border}`, borderRadius:6, padding:"3px 10px", marginBottom:14, fontFamily:"'DM Sans', sans-serif", fontSize:10, color:vm.color, letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:600 }}>
                            {vm.label}
                        </span>
                        <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:10, color:FAINT, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:6, fontWeight:600 }}>Best matching role</p>
                        <h2 style={{ fontFamily:"'Fraunces', serif", fontWeight:800, fontSize:36, color:TEXT, lineHeight:1.05, marginBottom:12, letterSpacing:"-0.03em" }}>
                            <em style={{ fontStyle:"italic", color:rm.color }}>{best_role}</em>
                        </h2>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                            {skills.map((s, i) => (
                                <span key={i} style={{ background:SURFACE2, border:`1px solid ${BORDER2}`, borderRadius:7, padding:"4px 10px", fontFamily:"'DM Sans', sans-serif", fontSize:11, color:MUTED }}>
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, paddingRight:4 }}>
                        <ConfidenceArc value={Math.round(confidence)} color={vm.color} />
                    </div>
                </div>
            </div>

            {/* Other predictions */}
            {others.length > 0 && (
                <div className="fade-up d2" style={{ marginBottom:16 }}>
                    <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:10, color:FAINT, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12, fontWeight:600 }}>Also considered</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {others.map(({ role, confidence:c }, i) => {
                            const m = getRoleMeta(role);
                            return (
                                <div key={i} className="other-card fade-up" style={{ animationDelay:`${0.1+i*0.07}s`, background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", gap:14 }}>
                                    <div style={{ width:8, height:8, borderRadius:"50%", background:m.color, boxShadow:`0 0 6px ${m.color}`, flexShrink:0 }} />
                                    <div style={{ flex:1 }}>
                                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                                            <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:TEXT, fontWeight:500 }}>{role}</span>
                                            <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:MUTED }}>{Math.round(c)}%</span>
                                        </div>
                                        <div style={{ height:3, background:BORDER2, borderRadius:3, overflow:"hidden" }}>
                                            <div className="bar-grow" style={{ height:"100%", width:`${c}%`, background:m.color, borderRadius:3, animationDelay:`${0.4+i*0.1}s` }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="fade-up d4" style={{ display:"flex", gap:12 }}>
                <button onClick={onReset} className="reset-btn"
                    style={{ border:`1px solid ${BORDER2}`, background:"none", color:MUTED, borderRadius:10, padding:"10px 20px", fontSize:13, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>
                    ← Try again
                </button>
                <div style={{ flex:1, background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:12, padding:"10px 16px", display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:vm.color, boxShadow:`0 0 6px ${vm.color}`, flexShrink:0 }} />
                    <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:MUTED }}>
                        {skills.length} skill{skills.length !== 1 ? "s" : ""} →{" "}
                        <span style={{ color:rm.color, fontWeight:600 }}>{best_role}</span>
                        <span style={{ margin:"0 10px", color:FAINT }}>·</span>
                        <span style={{ color:vm.color }}>{Math.round(confidence)}% confidence</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function SkillMatchSet() {
    const [inputVal, setInputVal] = useState("");
    const [skills, setSkills]     = useState([]);
    const [result, setResult]     = useState(null);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState(null);
    const inputRef = useRef();

    function addSkill(s) {
        const trimmed = s.trim().replace(/,+$/, "").trim();
        if (!trimmed) return;
        if (skills.find(x => x.toLowerCase() === trimmed.toLowerCase())) return;
        setSkills(prev => [...prev, trimmed]);
    }

    function handleKeyDown(e) {
        if (e.key === "," || e.key === "Enter") {
            e.preventDefault();
            const parts = inputVal.split(",").map(s => s.trim()).filter(Boolean);
            parts.forEach(addSkill);
            setInputVal("");
        } else if (e.key === "Backspace" && !inputVal && skills.length) {
            setSkills(prev => prev.slice(0, -1));
        }
    }

    function handleInputChange(e) {
        const val = e.target.value;
        if (val.includes(",")) {
            const parts = val.split(",").map(s => s.trim()).filter(Boolean);
            parts.slice(0, -1).forEach(addSkill);
            setInputVal(parts[parts.length - 1] || "");
        } else {
            setInputVal(val);
        }
    }

    function removeSkill(idx) { setSkills(prev => prev.filter((_, i) => i !== idx)); }

    async function handleSubmit() {
        const allSkills = inputVal.trim() ? [...skills, inputVal.trim()] : skills;
        if (allSkills.length === 0) { setError("Please add at least one skill."); return; }
        setLoading(true); setError(null); setResult(null);
        const payload = { skills: allSkills.join(", ") };
        try {
            const res = await fetch("http://localhost:8000/api/skills/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include",
            });
            if (!res.ok) { const err = await res.json(); throw new Error(err.detail || "Server error"); }
            const data = await res.json();
            if (inputVal.trim()) { addSkill(inputVal.trim()); setInputVal(""); }
            setResult(data);
        } catch (err) {
            setError(err.message || "Backend not reachable.");
        }
        setLoading(false);
    }

    function reset() { setResult(null); setSkills([]); setInputVal(""); setError(null); }

    const usedSet = new Set(skills.map(s => s.toLowerCase()));

    // Pure content component — no page wrapper/header shell
    return (
        <>
            <style>{css}</style>

            {/* Page header — matches SkillMatcher & CareerAdvisor */}
            <div style={{ marginBottom:20 }}>
                <p className="fade-up" style={{ fontSize:10, color:ACCENT, letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:6, fontWeight:600 }}>
                    Resume Intelligence
                </p>
                <h1 className="fade-up d1" style={{ fontFamily:"'Fraunces', serif", fontWeight:800, fontSize:"clamp(24px,3vw,36px)", color:TEXT, lineHeight:1.05, marginBottom:6, letterSpacing:"-0.035em" }}>
                    Skill <em style={{ fontStyle:"italic", color:ACCENT }}>Role</em> Matcher
                </h1>
                <p className="fade-up d2" style={{ fontSize:13, color:MUTED }}>
                    Enter your skills — our model finds the role you're best suited for.
                </p>
            </div>

            {!result ? (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

                    {/* ── Left — skill input ── */}
                    <div className="fade-up d2" style={{ display:"flex", flexDirection:"column", gap:16 }}>
                        <div>
                            <p style={{ fontSize:11, color:FAINT, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12, fontWeight:600 }}>Your Skills</p>

                            {/* Chip input */}
                            <div
                                className="chip-input-box"
                                onClick={() => inputRef.current?.focus()}
                                style={{ minHeight:120, background:SURFACE, border:`1px solid ${BORDER2}`, borderRadius:12, padding:"10px 12px", cursor:"text", display:"flex", flexWrap:"wrap", gap:7, alignContent:"flex-start", transition:"border-color 0.2s" }}
                            >
                                {skills.map((s, i) => (
                                    <span key={i} className="skill-chip" style={{ animationDelay:`${i*0.04}s` }}>
                                        {s}
                                        <button className="skill-chip-remove" onClick={(e) => { e.stopPropagation(); removeSkill(i); }}>×</button>
                                    </span>
                                ))}
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputVal}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder={skills.length === 0 ? "Type a skill and press comma or Enter…" : "Add more…"}
                                    style={{ background:"none", border:"none", outline:"none", color:TEXT, fontSize:13, fontFamily:"'DM Sans', sans-serif", minWidth:160, flex:1, padding:"4px 2px" }}
                                />
                            </div>
                            <p style={{ fontSize:11, color:FAINT, marginTop:6, textAlign:"right" }}>
                                {skills.length} skill{skills.length !== 1 ? "s" : ""} added
                            </p>
                        </div>

                        {/* Quick add */}
                        <div>
                            <p style={{ fontSize:10, color:FAINT, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10, fontWeight:600 }}>Quick add</p>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                                {SKILL_SUGGESTIONS.map(s => (
                                    <button key={s} className={`suggestion-btn ${usedSet.has(s.toLowerCase()) ? "used" : ""}`} onClick={() => { addSkill(s); inputRef.current?.focus(); }}>
                                        + {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div style={{ background:"rgba(249,168,212,0.06)", border:"1px solid rgba(249,168,212,0.2)", borderRadius:10, padding:"12px 14px" }}>
                                <p style={{ fontSize:12, color:PINK, lineHeight:1.6, fontFamily:"'DM Sans', sans-serif" }}>{error}</p>
                            </div>
                        )}

                        <button className="submit-btn" onClick={handleSubmit} disabled={loading || (skills.length === 0 && !inputVal.trim())}
                            style={{ width:"100%", padding:"14px", border:`1px solid rgba(232,255,71,0.4)`, borderRadius:12, background:"rgba(232,255,71,0.06)", color:ACCENT, fontSize:14, fontWeight:700, fontFamily:"'DM Sans', sans-serif", cursor:"pointer", letterSpacing:"0.02em", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                            {loading ? (
                                <>
                                    <div style={{ width:16, height:16, border:`2px solid rgba(232,255,71,0.3)`, borderTopColor:ACCENT, borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                                    Matching…
                                </>
                            ) : "Find My Role →"}
                        </button>
                    </div>

                    {/* ── Right — info ── */}
                    <div className="fade-up d3" style={{ display:"flex", flexDirection:"column", gap:16 }}>

                        {/* How it works */}
                        <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:16, padding:"22px", position:"relative", overflow:"hidden" }}>
                            <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:1, background:`linear-gradient(90deg,transparent,${ACCENT},transparent)` }} />
                            <p style={{ fontSize:11, color:FAINT, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:16, fontWeight:600 }}>How it works</p>
                            {[
                                { n:"01", title:"Enter your skills", desc:"Type any skills separated by commas, or use the quick-add buttons." },
                                { n:"02", title:"Vectorized",        desc:"Your skill set is converted using a Count Vectorizer trained on job data." },
                                { n:"03", title:"Classified",        desc:"An ML classifier predicts the top 3 most fitting job roles with probabilities." },
                                { n:"04", title:"Verdict issued",    desc:"Strong (≥75%), Moderate (≥45%), or Low Confidence based on the top score." },
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

                        {/* Verdict legend */}
                        <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:16, padding:"18px 20px", position:"relative", overflow:"hidden" }}>
                            <div style={{ position:"absolute", top:0, left:"25%", right:"25%", height:1, background:`linear-gradient(90deg,transparent,${GREEN},transparent)` }} />
                            <p style={{ fontSize:11, color:FAINT, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14, fontWeight:600 }}>Confidence thresholds</p>
                            {Object.entries(VERDICT_META).map(([key, v]) => (
                                <div key={key} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                                    <div style={{ width:8, height:8, borderRadius:"50%", background:v.color, boxShadow:`0 0 5px ${v.color}`, flexShrink:0 }} />
                                    <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:v.color, fontWeight:600, width:120 }}>{v.label}</span>
                                    <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, color:MUTED }}>
                                        {key === "strong" ? "≥ 75%" : key === "moderate" ? "45 – 74%" : "< 45%"}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Tip */}
                        <div style={{ background:"rgba(232,255,71,0.04)", border:"1px solid rgba(232,255,71,0.15)", borderRadius:12, padding:"14px 16px", position:"relative", overflow:"hidden" }}>
                            <div style={{ position:"absolute", top:0, left:"30%", right:"30%", height:1, background:`linear-gradient(90deg,transparent,${ACCENT},transparent)` }} />
                            <p style={{ fontSize:12, lineHeight:1.7 }}>
                                <span style={{ color:ACCENT, fontWeight:600 }}>Tip: </span>
                                <span style={{ color:MUTED }}>Adding 5–10 specific skills gives the most accurate prediction. Include both technical and domain skills.</span>
                            </p>
                        </div>
                    </div>
                </div>

            ) : (
                <ResultView data={result} skills={skills} onReset={reset} />
            )}
        </>
    );
}