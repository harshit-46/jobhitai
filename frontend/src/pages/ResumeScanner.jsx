import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── Design tokens ─────────────────────────────────────────────────────────────
const t = {
    bg:       "#0a0a0e",
    surface:  "rgba(255,255,255,0.03)",
    surface2: "rgba(255,255,255,0.06)",
    text:     "#f0ede8",
    muted:    "rgba(240,237,232,0.5)",
    faint:    "rgba(240,237,232,0.22)",
    border:   "rgba(255,255,255,0.07)",
    border2:  "rgba(255,255,255,0.13)",
    lime:     "#E8FF47",
    limeD:    "#c8dd00",
    green:    "#86efac",
    gold:     "#fcd34d",
    pink:     "#f9a8d4",
    red:      "#fca5a5",
};

// ── Grade config ───────────────────────────────────────────────────────────────
const GRADE_CONFIG = {
    "Excellent": { color: "#E8FF47", bg: "rgba(232,255,71,0.1)",  border: "rgba(232,255,71,0.25)" },
    "Good":      { color: "#86efac", bg: "rgba(134,239,172,0.1)", border: "rgba(134,239,172,0.25)" },
    "Average":   { color: "#fcd34d", bg: "rgba(252,211,77,0.1)",  border: "rgba(252,211,77,0.25)" },
    "Poor":      { color: "#f9a8d4", bg: "rgba(249,168,212,0.1)", border: "rgba(249,168,212,0.25)" },
};

const SCORE_BARS = [
    { key: "formatting",  label: "Formatting",  gradient: "linear-gradient(90deg,#E8FF47,#c8dd00)" },
    { key: "keywords",    label: "Keywords",    gradient: "linear-gradient(90deg,#86efac,#E8FF47)" },
    { key: "sections",    label: "Sections",    gradient: "linear-gradient(90deg,#fcd34d,#f9a8d4)" },
    { key: "readability", label: "Readability", gradient: "linear-gradient(90deg,#86efac,#E8FF47)" },
];

// ── Animated score ring ────────────────────────────────────────────────────────
function ScoreRing({ score, size = 120, stroke = 8 }) {
    const r   = (size - stroke) / 2;
    const c   = 2 * Math.PI * r;
    const pct = score / 100;
    const grade = score >= 90 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Average" : "Poor";
    const cfg = GRADE_CONFIG[grade] || GRADE_CONFIG["Good"];

    return (
        <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={size/2} cy={size/2} r={r} fill="none"
                    stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
                <circle cx={size/2} cy={size/2} r={r} fill="none"
                    stroke={cfg.color} strokeWidth={stroke}
                    strokeDasharray={c}
                    strokeDashoffset={c * (1 - pct)}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
                />
            </svg>
            <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
            }}>
                <span style={{ fontSize: size * 0.22, fontWeight: 700, color: cfg.color, lineHeight: 1, fontFamily: "'Fraunces', serif" }}>{score}</span>
                <span style={{ fontSize: size * 0.1, color: t.faint, marginTop: 2 }}>/ 100</span>
            </div>
        </div>
    );
}

// ── Upload zone ────────────────────────────────────────────────────────────────
function UploadZone({ file, onFile, loading }) {
    const inputRef  = useRef();
    const [drag, setDrag] = useState(false);

    const handle = (f) => {
        if (!f) return;
        if (!["application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
             ].includes(f.type)) {
            alert("Only PDF or Word documents are accepted.");
            return;
        }
        onFile(f);
    };

    return (
        <div
            onClick={() => !loading && inputRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
            style={{
                borderRadius: 20,
                border: `2px dashed ${drag ? t.lime : file ? "rgba(134,239,172,0.4)" : t.border2}`,
                background: drag
                    ? "rgba(232,255,71,0.04)"
                    : file
                    ? "rgba(134,239,172,0.03)"
                    : t.surface,
                padding: "48px 32px",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 14,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                minHeight: 220,
            }}
        >
            <input
                ref={inputRef} type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={(e) => handle(e.target.files[0])}
            />

            {file ? (
                <>
                    <div style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: "rgba(134,239,172,0.1)",
                        border: "1px solid rgba(134,239,172,0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22,
                    }}>📄</div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 14, color: t.green, fontWeight: 500 }}>{file.name}</div>
                        <div style={{ fontSize: 12, color: t.faint, marginTop: 4 }}>
                            {(file.size / 1024).toFixed(0)} KB · Click to change
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: "rgba(232,255,71,0.08)",
                        border: "1px solid rgba(232,255,71,0.18)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22,
                    }}>📁</div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 15, color: t.text, fontWeight: 500 }}>
                            Drop your resume here
                        </div>
                        <div style={{ fontSize: 13, color: t.faint, marginTop: 6 }}>
                            PDF or Word · Max 5 MB
                        </div>
                    </div>
                    <div style={{
                        fontSize: 12, padding: "6px 16px", borderRadius: 999,
                        background: "rgba(232,255,71,0.08)",
                        border: "1px solid rgba(232,255,71,0.2)",
                        color: t.lime,
                    }}>Browse files</div>
                </>
            )}
        </div>
    );
}

// ── Score bar ──────────────────────────────────────────────────────────────────
function ScoreBar({ label, val, gradient }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, width: 80, flexShrink: 0, color: t.muted }}>{label}</span>
            <div style={{ flex: 1, height: 5, borderRadius: 999, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{
                    height: "100%", borderRadius: 999,
                    width: `${val}%`, background: gradient,
                    transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
                }} />
            </div>
            <span style={{ fontSize: 12, width: 28, textAlign: "right", color: t.faint, flexShrink: 0 }}>{val}</span>
        </div>
    );
}

// ── Tip card ───────────────────────────────────────────────────────────────────
function TipCard({ tip, index }) {
    const colors = [t.lime, t.green, t.gold, t.pink];
    const color  = colors[index % colors.length];
    return (
        <div style={{
            borderRadius: 16, padding: "16px 18px",
            background: t.surface,
            border: `1px solid ${t.border}`,
            transition: "border-color 0.15s",
        }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = t.border2}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = t.border}
        >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{
                    width: 24, height: 24, borderRadius: 8, flexShrink: 0,
                    background: `${color}18`,
                    border: `1px solid ${color}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color, fontWeight: 700, fontFamily: "'Fraunces', serif",
                    marginTop: 1,
                }}>{index + 1}</div>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 5 }}>
                        {tip.title}
                    </div>
                    <div style={{ fontSize: 12, color: t.muted, lineHeight: 1.6 }}>
                        {tip.detail}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Results panel ──────────────────────────────────────────────────────────────
function Results({ data }) {
    const grade   = data.grade || "Good";
    const cfg     = GRADE_CONFIG[grade] || GRADE_CONFIG["Good"];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp 0.5s ease-out" }}>

            {/* Top row: ring + score bars */}
            <div style={{
                display: "grid", gridTemplateColumns: "auto 1fr", gap: 24,
                borderRadius: 20, padding: "24px 28px",
                background: t.surface, border: `1px solid ${t.border}`,
            }}>
                {/* Ring + grade */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <ScoreRing score={data.overall_score} size={120} stroke={8} />
                    <div style={{
                        fontSize: 12, padding: "4px 14px", borderRadius: 999,
                        background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
                        fontWeight: 600,
                    }}>{grade}</div>
                </div>

                {/* Verdict + bars */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
                    <p style={{ margin: 0, fontSize: 13, color: t.muted, lineHeight: 1.65, fontStyle: "italic" }}>
                        "{data.verdict}"
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {SCORE_BARS.map((b) => (
                            <ScoreBar key={b.key} label={b.label} val={data.scores?.[b.key] ?? 0} gradient={b.gradient} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Strengths + Issues */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

                {/* Strengths */}
                <div style={{ borderRadius: 18, padding: "18px 20px", background: t.surface, border: `1px solid ${t.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: "rgba(134,239,172,0.1)",
                            border: "1px solid rgba(134,239,172,0.2)",
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                        }}>✅</div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Strengths</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {(data.strengths || []).map((s, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                                <span style={{ color: t.green, flexShrink: 0, marginTop: 1, fontSize: 12 }}>✓</span>
                                <span style={{ fontSize: 12, color: t.muted, lineHeight: 1.55 }}>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Issues */}
                <div style={{ borderRadius: 18, padding: "18px 20px", background: t.surface, border: `1px solid ${t.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: "rgba(249,168,212,0.1)",
                            border: "1px solid rgba(249,168,212,0.2)",
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                        }}>⚠️</div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Issues</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {(data.issues || []).map((s, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                                <span style={{ color: t.pink, flexShrink: 0, marginTop: 1, fontSize: 12 }}>✗</span>
                                <span style={{ fontSize: 12, color: t.muted, lineHeight: 1.55 }}>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tips */}
            {data.tips?.length > 0 && (
                <div style={{ borderRadius: 18, padding: "18px 20px", background: t.surface, border: `1px solid ${t.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: "rgba(232,255,71,0.08)",
                            border: "1px solid rgba(232,255,71,0.18)",
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                        }}>💡</div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>How to improve</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {data.tips.map((tip, i) => <TipCard key={i} tip={tip} index={i} />)}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Loading skeleton ───────────────────────────────────────────────────────────
function LoadingSkeleton() {
    const Sk = ({ h = 16, w = "100%", r = 8 }) => (
        <div style={{ width: w, height: h, borderRadius: r, background: "rgba(255,255,255,0.06)", animation: "pulse 1.6s ease-in-out infinite" }} />
    );
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ borderRadius: 20, padding: "24px 28px", background: t.surface, border: `1px solid ${t.border}`, display: "grid", gridTemplateColumns: "auto 1fr", gap: 24 }}>
                <Sk h={120} w={120} r={60} />
                <div style={{ display: "flex", flexDirection: "column", gap: 12, justifyContent: "center" }}>
                    <Sk h={14} w="80%" />
                    {[...Array(4)].map((_, i) => <Sk key={i} h={5} r={3} />)}
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Sk h={160} r={18} />
                <Sk h={160} r={18} />
            </div>
            <Sk h={200} r={18} />
        </div>
    );
}

// ── Main page ──────────────────────────────────────────────────────────────────
function ResumeScannerPage() {
    const [file,    setFile]    = useState(null);
    const [loading, setLoading] = useState(false);
    const [result,  setResult]  = useState(null);
    const [error,   setError]   = useState(null);

    const handleScan = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const form = new FormData();
            form.append("file", file);

            const res = await fetch(`${API}/api/resume/scan`, {
                method:      "POST",
                body:        form,
                credentials: "include",
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
    };

    const handleReset = () => {
        setFile(null);
        setResult(null);
        setError(null);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <style>{`
                @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
                @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
                @keyframes spin    { to{transform:rotate(360deg)} }
            `}</style>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                    <h1 style={{
                        margin: 0, fontSize: 26,
                        fontFamily: "'Fraunces', serif", fontWeight: 700,
                        color: t.text, letterSpacing: "-0.03em",
                    }}>
                        Resume <span style={{ color: t.lime }}>Scanner</span>
                    </h1>
                    <p style={{ margin: "6px 0 0", fontSize: 13, color: t.faint }}>
                        Upload your resume and get an instant ATS analysis with actionable tips.
                    </p>
                </div>
                {result && (
                    <button
                        onClick={handleReset}
                        style={{
                            fontSize: 12, padding: "7px 16px", borderRadius: 999,
                            background: t.surface2, border: `1px solid ${t.border2}`,
                            color: t.muted, cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif",
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = t.text}
                        onMouseLeave={(e) => e.currentTarget.style.color = t.muted}
                    >← Scan another</button>
                )}
            </div>

            {/* Upload + button (hide after result) */}
            {!result && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <UploadZone file={file} onFile={setFile} loading={loading} />

                    {error && (
                        <div style={{
                            padding: "11px 16px", borderRadius: 12, fontSize: 13,
                            background: "rgba(252,165,165,0.06)",
                            border: "1px solid rgba(252,165,165,0.2)", color: t.red,
                        }}>⚠️ {error}</div>
                    )}

                    <button
                        onClick={handleScan}
                        disabled={!file || loading}
                        style={{
                            padding: "13px 0", borderRadius: 14, fontSize: 14, fontWeight: 600,
                            fontFamily: "'DM Sans', sans-serif",
                            background: file && !loading
                                ? t.lime
                                : "rgba(232,255,71,0.12)",
                            color: file && !loading ? "#0a0a0e" : "rgba(232,255,71,0.4)",
                            border: "none", cursor: file && !loading ? "pointer" : "not-allowed",
                            transition: "all 0.2s",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        }}
                        onMouseEnter={(e) => { if (file && !loading) e.currentTarget.style.background = t.limeD; }}
                        onMouseLeave={(e) => { if (file && !loading) e.currentTarget.style.background = t.lime; }}
                    >
                        {loading ? (
                            <>
                                <div style={{
                                    width: 16, height: 16, borderRadius: "50%",
                                    border: "2px solid rgba(232,255,71,0.3)",
                                    borderTopColor: t.lime,
                                    animation: "spin 0.8s linear infinite",
                                }} />
                                Scanning resume…
                            </>
                        ) : "Scan Resume →"}
                    </button>
                </div>
            )}

            {/* Results */}
            {loading  && <LoadingSkeleton />}
            {result   && !loading && <Results data={result} />}
        </div>
    );
}

// ── Shell ──────────────────────────────────────────────────────────────────────
export default function ResumeScanner() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleClick  = (path) => navigate(path);
    const handleLogout = () => { logout(); navigate("/login"); };

    return (
        <>
            <style>{`
                * { box-sizing: border-box; }
                body { margin: 0; background: #0a0a0e; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(232,255,71,0.18); border-radius: 2px; }
            `}</style>

            <div style={{ fontFamily: "'DM Sans', sans-serif", background: t.bg, color: t.text, minHeight: "100vh", display: "flex" }}>
                <Sidebar user={user} onLogout={handleLogout} onClick={handleClick} />
                <Topbar />
                <main style={{ marginLeft: 256, paddingTop: 68, flex: 1, minHeight: "100vh", overflowY: "auto" }}>
                    <div style={{ maxWidth: 820, margin: "0 auto", padding: "26px 28px" }}>
                        <ResumeScannerPage />
                    </div>
                </main>
            </div>
        </>
    );
}