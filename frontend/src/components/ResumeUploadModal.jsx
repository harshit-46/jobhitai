import { useState, useRef, useCallback } from "react";
import api from "../api/axios";

// ── Design tokens (exact match to existing components) ──────────────────────
const t = {
    bg: "#0a0a0e",
    surface: "rgba(255,255,255,0.03)",
    surface2: "rgba(255,255,255,0.055)",
    surface3: "rgba(255,255,255,0.08)",
    text: "#f0ede8",
    muted: "rgba(240,237,232,0.45)",
    faint: "rgba(240,237,232,0.22)",
    border: "rgba(255,255,255,0.07)",
    border2: "rgba(255,255,255,0.12)",
    lime: "#E8FF47",
    limeD: "#c8dd00",
    green: "#86efac",
    gold: "#fcd34d",
    pink: "#f9a8d4",
    red: "#fca5a5",
};

// ── File icon SVG ────────────────────────────────────────────────────────────
function FileIcon({ size = 32, color }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    );
}

function UploadIcon({ size = 28, color }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        </svg>
    );
}

function CheckIcon({ size = 18, color }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function XIcon({ size = 14, color }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

// ── Format file size ─────────────────────────────────────────────────────────
function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Upload states ────────────────────────────────────────────────────────────
// idle | dragging | selected | uploading | success | error

export default function ResumeUploadModal({ onClose, onSkip, onSuccess }) {
    const [state, setState] = useState("idle");
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");
    const inputRef = useRef(null);

    const ACCEPTED = ["application/pdf", "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const MAX_MB = 5;

    const validate = (f) => {
        if (!ACCEPTED.includes(f.type)) {
            setErrorMsg("Only PDF or Word documents are accepted.");
            return false;
        }
        if (f.size > MAX_MB * 1024 * 1024) {
            setErrorMsg(`File must be under ${MAX_MB} MB.`);
            return false;
        }
        return true;
    };

    const pickFile = (f) => {
        setErrorMsg("");
        if (!validate(f)) { setState("error"); return; }
        setFile(f);
        setState("selected");
    };

    const onDrop = useCallback((e) => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f) pickFile(f);
        else setState("idle");
    }, []);

    const onDragOver = (e) => { e.preventDefault(); setState("dragging"); };
    const onDragLeave = () => setState(file ? "selected" : "idle");

    const handleUpload = async () => {
        if (!file) return;
        setState("uploading");
        setProgress(0);

        const formData = new FormData();
        formData.append("file", file);

        try {
            await api.post("/resume/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (e) => {
                    const pct = Math.round((e.loaded * 100) / e.total);
                    setProgress(pct);
                },
            });
            setState("success");
            setTimeout(() => onSuccess?.(), 1800);
        } catch (err) {
            setErrorMsg(err.response?.data?.detail || "Upload failed. Please try again.");
            setState("error");
        }
    };

    const reset = () => {
        setFile(null);
        setProgress(0);
        setErrorMsg("");
        setState("idle");
    };

    const isDragging = state === "dragging";
    const isUploading = state === "uploading";
    const isSuccess = state === "success";
    const isError = state === "error";
    const hasFile = state === "selected" || isError;

    return (
        <>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(28px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes pulse-lime {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(232,255,71,0.3); }
                    50%      { box-shadow: 0 0 0 8px rgba(232,255,71,0); }
                }
                @keyframes checkPop {
                    0%   { transform: scale(0.6); opacity: 0; }
                    70%  { transform: scale(1.15); opacity: 1; }
                    100% { transform: scale(1); }
                }
                .modal-skip:hover { color: rgba(240,237,232,0.7) !important; }
                .modal-upload-btn:hover:not(:disabled) { background: #f5ff6e !important; transform: translateY(-1px); }
                .modal-upload-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .modal-close:hover { background: rgba(255,255,255,0.07) !important; }
                .remove-file:hover { color: ${t.red} !important; border-color: rgba(252,165,165,0.3) !important; }
            `}</style>

            {/* ── Overlay ─────────────────────────────────────────────────── */}
            <div
                onClick={(e) => { if (e.target === e.currentTarget && !isUploading) onClose?.(); }}
                style={{
                    position: "fixed", inset: 0, zIndex: 1000,
                    background: "rgba(0,0,0,0.72)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "20px",
                    animation: "fadeIn 0.2s ease both",
                    backdropFilter: "blur(4px)",
                }}
            >
                {/* ── Modal card ───────────────────────────────────────────── */}
                <div style={{
                    width: "100%", maxWidth: 480,
                    background: "#111116",
                    border: `1px solid ${t.border2}`,
                    borderRadius: 24,
                    overflow: "hidden",
                    animation: "slideUp 0.35s cubic-bezier(0.22,1,0.36,1) both",
                    position: "relative",
                }}>
                    {/* Top lime accent line */}
                    <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${t.lime}, transparent)` }} />

                    {/* ── Header ──────────────────────────────────────────── */}
                    <div style={{ padding: "22px 24px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 12,
                                background: "rgba(232,255,71,0.07)",
                                border: "1px solid rgba(232,255,71,0.16)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <FileIcon size={20} color={t.lime} />
                            </div>
                            <div>
                                <h2 style={{
                                    fontFamily: "'Fraunces', serif", fontWeight: 800,
                                    fontSize: 18, letterSpacing: "-0.025em",
                                    color: t.text, margin: 0, lineHeight: 1.2,
                                }}>
                                    Upload your resume
                                </h2>
                                <p style={{ fontSize: 12, color: t.faint, margin: "3px 0 0" }}>
                                    Get AI-powered career insights
                                </p>
                            </div>
                        </div>

                        {!isUploading && (
                            <button
                                className="modal-close"
                                onClick={onClose}
                                style={{
                                    width: 30, height: 30, borderRadius: 8,
                                    background: "transparent",
                                    border: `1px solid ${t.border}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: "pointer", transition: "background 0.15s", flexShrink: 0,
                                }}
                            >
                                <XIcon size={13} color={t.faint} />
                            </button>
                        )}
                    </div>

                    {/* ── Body ────────────────────────────────────────────── */}
                    <div style={{ padding: "20px 24px 24px" }}>

                        {/* ── Success state ─────────────────────────────── */}
                        {isSuccess ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "20px 0" }}>
                                <div style={{
                                    width: 56, height: 56, borderRadius: "50%",
                                    background: "rgba(134,239,172,0.1)",
                                    border: "1px solid rgba(134,239,172,0.25)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    animation: "checkPop 0.4s cubic-bezier(0.22,1,0.36,1) both",
                                }}>
                                    <CheckIcon size={24} color={t.green} />
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <p style={{ fontSize: 15, fontWeight: 700, color: t.text, margin: "0 0 4px", fontFamily: "'Fraunces', serif" }}>
                                        Resume uploaded!
                                    </p>
                                    <p style={{ fontSize: 12, color: t.muted, margin: 0 }}>
                                        Analyzing your resume…
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* ── Drop zone ─────────────────────────── */}
                                <div
                                    onDrop={onDrop}
                                    onDragOver={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onClick={() => !hasFile && !isUploading && inputRef.current?.click()}
                                    style={{
                                        borderRadius: 16,
                                        border: `1.5px dashed ${isDragging ? t.lime : hasFile ? (isError ? "rgba(252,165,165,0.4)" : "rgba(134,239,172,0.35)") : t.border2}`,
                                        background: isDragging ? "rgba(232,255,71,0.04)" : hasFile ? (isError ? "rgba(252,165,165,0.03)" : "rgba(134,239,172,0.03)") : t.surface,
                                        padding: hasFile ? "16px 18px" : "32px 20px",
                                        cursor: hasFile || isUploading ? "default" : "pointer",
                                        transition: "all 0.2s",
                                        marginBottom: 16,
                                    }}
                                >
                                    {/* No file yet */}
                                    {!hasFile && !isUploading && (
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                                            <div style={{
                                                width: 52, height: 52, borderRadius: 14,
                                                background: isDragging ? "rgba(232,255,71,0.1)" : t.surface2,
                                                border: `1px solid ${isDragging ? "rgba(232,255,71,0.3)" : t.border}`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                transition: "all 0.2s",
                                            }}>
                                                <UploadIcon size={22} color={isDragging ? t.lime : t.muted} />
                                            </div>
                                            <div style={{ textAlign: "center" }}>
                                                <p style={{ fontSize: 13, fontWeight: 600, color: isDragging ? t.lime : t.text, margin: "0 0 3px", transition: "color 0.2s" }}>
                                                    {isDragging ? "Drop it here" : "Drag & drop your resume"}
                                                </p>
                                                <p style={{ fontSize: 12, color: t.faint, margin: "0 0 10px" }}>
                                                    or click to browse
                                                </p>
                                                <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                                    {["PDF", "DOC", "DOCX"].map(ext => (
                                                        <span key={ext} style={{
                                                            fontSize: 10, fontWeight: 700,
                                                            padding: "3px 8px", borderRadius: 6,
                                                            background: "rgba(255,255,255,0.05)",
                                                            border: `1px solid ${t.border}`,
                                                            color: t.faint, letterSpacing: "0.05em",
                                                        }}>{ext}</span>
                                                    ))}
                                                    <span style={{
                                                        fontSize: 10, color: t.faint,
                                                        padding: "3px 0", alignSelf: "center",
                                                    }}>· Max {MAX_MB} MB</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* File selected */}
                                    {hasFile && file && (
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                                                background: isError ? "rgba(252,165,165,0.08)" : "rgba(134,239,172,0.08)",
                                                border: `1px solid ${isError ? "rgba(252,165,165,0.2)" : "rgba(134,239,172,0.2)"}`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <FileIcon size={18} color={isError ? t.red : t.green} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: 13, fontWeight: 600, color: t.text, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {file.name}
                                                </p>
                                                <p style={{ fontSize: 11, color: t.faint, margin: 0 }}>
                                                    {formatSize(file.size)}
                                                    {isError && (
                                                        <span style={{ color: t.red, marginLeft: 6 }}>· {errorMsg}</span>
                                                    )}
                                                </p>
                                            </div>
                                            {!isUploading && (
                                                <button
                                                    className="remove-file"
                                                    onClick={(e) => { e.stopPropagation(); reset(); }}
                                                    style={{
                                                        width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                                                        background: "transparent",
                                                        border: `1px solid ${t.border}`,
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        cursor: "pointer", color: t.faint,
                                                        transition: "all 0.15s",
                                                    }}
                                                >
                                                    <XIcon size={12} color="currentColor" />
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Uploading */}
                                    {isUploading && file && (
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                                                background: "rgba(232,255,71,0.07)",
                                                border: "1px solid rgba(232,255,71,0.18)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <div style={{
                                                    width: 18, height: 18, borderRadius: "50%",
                                                    border: `2px solid rgba(232,255,71,0.2)`,
                                                    borderTopColor: t.lime,
                                                    animation: "spin 0.8s linear infinite",
                                                }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                                    <p style={{ fontSize: 13, fontWeight: 600, color: t.text, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "75%" }}>
                                                        {file.name}
                                                    </p>
                                                    <span style={{ fontSize: 12, fontWeight: 700, color: t.lime }}>{progress}%</span>
                                                </div>
                                                {/* Progress bar */}
                                                <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                                                    <div style={{
                                                        height: "100%", borderRadius: 99,
                                                        background: t.lime,
                                                        width: `${progress}%`,
                                                        transition: "width 0.2s ease",
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <input
                                    ref={inputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    style={{ display: "none" }}
                                    onChange={(e) => { if (e.target.files[0]) pickFile(e.target.files[0]); }}
                                />

                                {/* ── Feature pills ──────────────────────── */}
                                {!hasFile && !isUploading && (
                                    <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
                                        {[
                                            { icon: "✦", label: "AI skill analysis" },
                                            { icon: "✦", label: "Job match score" },
                                            { icon: "✦", label: "Resume feedback" },
                                        ].map(({ icon, label }) => (
                                            <div key={label} style={{
                                                display: "flex", alignItems: "center", gap: 6,
                                                padding: "5px 11px", borderRadius: 8,
                                                background: t.surface2, border: `1px solid ${t.border}`,
                                                fontSize: 11, color: t.muted,
                                            }}>
                                                <span style={{ fontSize: 8, color: t.lime }}>{icon}</span>
                                                {label}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* ── Action buttons ─────────────────────── */}
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <button
                                        className="modal-upload-btn"
                                        onClick={handleUpload}
                                        disabled={!file || isUploading || isError}
                                        style={{
                                            flex: 1, padding: "11px 20px",
                                            borderRadius: 13, fontSize: 13, fontWeight: 700,
                                            fontFamily: "'DM Sans', sans-serif",
                                            background: t.lime, color: "#0a0a0e",
                                            border: "none", cursor: "pointer",
                                            boxShadow: "0 4px 16px rgba(232,255,71,0.18)",
                                            transition: "all 0.15s",
                                            animation: file && !isError ? "pulse-lime 2.5s infinite" : "none",
                                        }}
                                    >
                                        {isUploading ? "Uploading…" : "Upload resume →"}
                                    </button>

                                    <button
                                        className="modal-skip"
                                        onClick={onSkip}
                                        disabled={isUploading}
                                        style={{
                                            padding: "11px 18px",
                                            borderRadius: 13, fontSize: 13,
                                            fontFamily: "'DM Sans', sans-serif",
                                            background: "transparent",
                                            border: `1px solid ${t.border}`,
                                            color: t.faint, cursor: "pointer",
                                            transition: "color 0.15s", flexShrink: 0,
                                        }}
                                    >
                                        Skip for now
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}