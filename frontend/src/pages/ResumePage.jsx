import { useEffect, useState, useRef, useCallback } from "react";
import api from "../api/axios";

// ── Design tokens ─────────────────────────────────────────────────────────────
const t = {
    bg: "#0a0a0e",
    surface: "rgba(255,255,255,0.028)",
    surface2: "rgba(255,255,255,0.055)",
    surface3: "rgba(255,255,255,0.085)",
    surfaceHover: "rgba(255,255,255,0.042)",
    text: "#f0ede8",
    muted: "rgba(240,237,232,0.48)",
    faint: "rgba(240,237,232,0.22)",
    border: "rgba(255,255,255,0.07)",
    border2: "rgba(255,255,255,0.13)",
    borderHover: "rgba(255,255,255,0.2)",
    lime: "#E8FF47",
    limeGlow: "rgba(232,255,71,0.18)",
    limeDim: "rgba(232,255,71,0.08)",
    green: "#86efac",
    greenDim: "rgba(134,239,172,0.08)",
    gold: "#fcd34d",
    red: "#fca5a5",
    redDim: "rgba(252,165,165,0.08)",
};

const API = "https://jobhitai-server.onrender.com/api/resume";

// ── URL helpers ───────────────────────────────────────────────────────────────
function getInlineUrl(url, mimeType) {
    if (mimeType !== "application/pdf") return null;
    return url.replace("/image/upload/", "/image/upload/fl_inline/");
}

function formatSize(bytes) {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
}

function getExt(filename) {
    return filename?.split(".").pop()?.toUpperCase() || "FILE";
}

function getExtColor(ext) {
    if (ext === "PDF") return "#f87171";
    if (ext === "DOC" || ext === "DOCX") return "#93c5fd";
    return t.muted;
}

function formatDate(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
    });
}

function getPdfThumbnail(url) {
    return url.replace("/upload/", "/upload/pg_1,w_500,h_640,c_fill,f_jpg/");
}

function getDownloadUrl(url, filename) {
    const safe = filename.replace(/\s+/g, "_");
    return url.replace("/upload/", `/upload/fl_attachment:${safe}/`);
}

// ── Global Styles ─────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,400;1,9..144,800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

    @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
    @keyframes slideUp   { from{opacity:0;transform:translateY(22px) scale(0.975)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes toastIn   { from{opacity:0;transform:translateY(10px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.45} }
    @keyframes shimmer   { from{background-position:-400px 0} to{background-position:400px 0} }
    @keyframes floatDot  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
    @keyframes limeFlash { 0%{box-shadow:0 0 0 0 rgba(232,255,71,0.35)} 70%{box-shadow:0 0 0 10px rgba(232,255,71,0)} 100%{box-shadow:0 0 0 0 rgba(232,255,71,0)} }
    @keyframes progressPulse { 0%,100%{opacity:1} 50%{opacity:0.7} }

    .rcard:hover .rcard-overlay { opacity: 1 !important; }
    .rcard:hover .rcard-badge   { opacity: 1 !important; transform: translateY(0) !important; }

    .action-btn {
        width: 32px; height: 32px; border-radius: 9px;
        background: transparent;
        border: 1px solid rgba(255,255,255,0.07);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: all 0.18s ease;
        flex-shrink: 0;
    }
    .action-btn:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.16); }
    .action-btn.danger:hover { background: rgba(252,165,165,0.1); border-color: rgba(252,165,165,0.28); }
    .action-btn.download:hover { background: rgba(232,255,71,0.07); border-color: rgba(232,255,71,0.24); }

    .stat-chip:hover { border-color: rgba(255,255,255,0.16) !important; background: rgba(255,255,255,0.042) !important; }

    .upload-zone { transition: all 0.22s ease; }
    .upload-zone:hover .upload-icon-wrap { background: rgba(232,255,71,0.1) !important; border-color: rgba(232,255,71,0.26) !important; }
`;

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = {
    file: (c = t.lime, s = 20) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
    ),
    upload: (c = t.lime, s = 22) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16"/>
            <line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
        </svg>
    ),
    trash: (c = t.faint, s = 15) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
    ),
    eye: (c = t.text, s = 14) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    ),
    download: (c = t.muted, s = 14) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
    ),
    x: (c = t.faint, s = 12) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    ),
    check: (c = t.green, s = 14) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
    ),
    spark: (c = t.lime, s = 12) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
            <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-5.26L4 10l5.91-1.74z"/>
        </svg>
    ),
    pdf: (s = 16) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
        </svg>
    ),
    doc: (s = 16) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
    ),
    arrowRight: (c = "#0a0a0e", s = 14) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
        </svg>
    ),
    warning: (c = t.red, s = 16) => (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
    ),
};

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
    const isErr = type === "error";
    return (
        <div style={{
            position: "fixed", bottom: 28, right: 28, zIndex: 3000,
            padding: "12px 18px",
            borderRadius: 14,
            background: isErr ? "rgba(10,10,14,0.92)" : "rgba(10,10,14,0.92)",
            border: `1px solid ${isErr ? "rgba(252,165,165,0.25)" : "rgba(134,239,172,0.25)"}`,
            color: isErr ? t.red : t.green,
            fontSize: 13, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            animation: "toastIn 0.35s cubic-bezier(0.22,1,0.36,1) both",
            backdropFilter: "blur(20px)",
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: isErr
                ? "0 8px 32px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(252,165,165,0.1)"
                : "0 8px 32px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(134,239,172,0.1)",
            minWidth: 220,
        }}>
            <div style={{
                width: 24, height: 24, borderRadius: 8, flexShrink: 0,
                background: isErr ? "rgba(252,165,165,0.12)" : "rgba(134,239,172,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                {isErr ? Icon.warning(t.red, 12) : Icon.check(t.green, 12)}
            </div>
            {msg}
        </div>
    );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteModal({ filename, onConfirm, onCancel, loading }) {
    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 2000,
            background: "rgba(0,0,0,0.78)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20, backdropFilter: "blur(12px)",
            animation: "fadeIn 0.18s ease both",
        }}>
            <div style={{
                width: "100%", maxWidth: 380,
                background: "rgba(16,16,20,0.98)",
                border: `1px solid rgba(255,255,255,0.1)`,
                borderRadius: 22, overflow: "hidden",
                animation: "slideUp 0.32s cubic-bezier(0.22,1,0.36,1) both",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(252,165,165,0.1)",
            }}>
                {/* Top accent line */}
                <div style={{ height: 2, background: `linear-gradient(90deg, transparent 0%, ${t.red} 40%, rgba(252,165,165,0.4) 100%)` }} />

                <div style={{ padding: "24px 24px 22px" }}>
                    {/* Icon + title */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                        <div style={{
                            width: 42, height: 42, borderRadius: 13, flexShrink: 0,
                            background: "rgba(252,165,165,0.08)",
                            border: "1px solid rgba(252,165,165,0.2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            {Icon.trash(t.red, 18)}
                        </div>
                        <div>
                            <h3 style={{
                                fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 17,
                                color: t.text, margin: "0 0 5px", letterSpacing: "-0.025em", lineHeight: 1.1,
                            }}>
                                Delete this resume?
                            </h3>
                            <p style={{ fontSize: 12.5, color: t.muted, margin: 0, lineHeight: 1.55 }}>
                                <span style={{ color: t.text, fontWeight: 600 }}>{filename}</span> will be permanently removed and cannot be recovered.
                            </p>
                        </div>
                    </div>

                    {/* Warning note */}
                    <div style={{
                        padding: "10px 14px", borderRadius: 11, marginBottom: 18,
                        background: "rgba(252,165,165,0.05)", border: "1px solid rgba(252,165,165,0.12)",
                        display: "flex", alignItems: "center", gap: 8,
                    }}>
                        {Icon.warning(t.red, 13)}
                        <span style={{ fontSize: 12, color: "rgba(252,165,165,0.7)" }}>
                            Any linked AI analyses will also be removed.
                        </span>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: 9 }}>
                        <button onClick={onConfirm} disabled={loading} style={{
                            flex: 1, padding: "11px 0", borderRadius: 12,
                            fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                            background: loading ? "rgba(252,165,165,0.06)" : "rgba(252,165,165,0.1)",
                            border: "1px solid rgba(252,165,165,0.25)",
                            color: t.red, cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.6 : 1, transition: "all 0.15s",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                        }}>
                            {loading ? (
                                <>
                                    <div style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid rgba(252,165,165,0.2)", borderTopColor: t.red, animation: "spin 0.75s linear infinite" }} />
                                    Deleting…
                                </>
                            ) : "Delete permanently"}
                        </button>
                        <button onClick={onCancel} disabled={loading} style={{
                            flex: 1, padding: "11px 0", borderRadius: 12,
                            fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                            background: "transparent", border: `1px solid ${t.border}`,
                            color: t.muted, cursor: "pointer", transition: "all 0.15s",
                        }}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Upload Zone ───────────────────────────────────────────────────────────────
function UploadZone({ onUpload, uploading, progress }) {
    const [dragging, setDragging] = useState(false);
    const [picked, setPicked] = useState(null);
    const inputRef = useRef(null);

    const ALLOWED = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const pick = (f) => {
        if (!ALLOWED.includes(f.type) || f.size > 5 * 1024 * 1024) return;
        setPicked(f);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault(); setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) pick(f);
    }, []);

    const submit = async () => {
        if (!picked) return;
        await onUpload(picked);
        setPicked(null);
    };

    const isIdle = !picked && !uploading;

    return (
        <div
            className="upload-zone"
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => isIdle && inputRef.current?.click()}
            style={{
                borderRadius: 20,
                border: `1.5px dashed ${dragging ? t.lime : picked ? "rgba(134,239,172,0.4)" : uploading ? "rgba(232,255,71,0.3)" : "rgba(255,255,255,0.1)"}`,
                background: dragging
                    ? "rgba(232,255,71,0.04)"
                    : picked
                        ? "rgba(134,239,172,0.025)"
                        : "rgba(255,255,255,0.02)",
                padding: picked || uploading ? "18px 22px" : "26px 28px",
                cursor: isIdle ? "pointer" : "default",
                transition: "all 0.22s ease",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Subtle grid bg */}
            {isIdle && (
                <div style={{
                    position: "absolute", inset: 0, opacity: dragging ? 0.08 : 0.04,
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
                    backgroundSize: "28px 28px",
                    pointerEvents: "none", transition: "opacity 0.2s",
                }} />
            )}

            {isIdle && (
                <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative" }}>
                    <div className="upload-icon-wrap" style={{
                        width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                        background: dragging ? "rgba(232,255,71,0.1)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${dragging ? "rgba(232,255,71,0.28)" : "rgba(255,255,255,0.08)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s",
                    }}>
                        {Icon.upload(dragging ? t.lime : t.muted, 22)}
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: dragging ? t.lime : t.text, margin: "0 0 4px", transition: "color 0.2s", letterSpacing: "-0.01em" }}>
                            {dragging ? "Release to upload" : "Upload a new resume"}
                        </p>
                        <p style={{ fontSize: 12, color: t.faint, margin: 0 }}>
                            PDF, DOC, DOCX · Max 5 MB · Drag & drop or click to browse
                        </p>
                    </div>
                    <div style={{
                        padding: "7px 18px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                        background: "rgba(255,255,255,0.04)", border: `1px solid ${t.border2}`,
                        color: t.muted, pointerEvents: "none",
                        fontFamily: "'DM Sans', sans-serif",
                    }}>
                        Browse
                    </div>
                </div>
            )}

            {picked && !uploading && (
                <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
                    <div style={{
                        width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                        background: "rgba(134,239,172,0.08)", border: "1px solid rgba(134,239,172,0.22)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        {picked.type === "application/pdf" ? Icon.pdf(20) : Icon.doc(20)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: t.text, margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-0.01em" }}>
                            {picked.name}
                        </p>
                        <p style={{ fontSize: 11.5, color: t.faint, margin: 0 }}>
                            {formatSize(picked.size)} · Ready to upload
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        <button onClick={(e) => { e.stopPropagation(); submit(); }} style={{
                            padding: "9px 20px", borderRadius: 11, fontSize: 13, fontWeight: 700,
                            fontFamily: "'DM Sans', sans-serif",
                            background: t.lime, color: "#0a0a0e", border: "none", cursor: "pointer",
                            boxShadow: "0 4px 18px rgba(232,255,71,0.28)", transition: "all 0.15s",
                            display: "flex", alignItems: "center", gap: 7,
                        }}>
                            Upload {Icon.arrowRight()}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setPicked(null); }} style={{
                            width: 36, height: 36, borderRadius: 10, background: "transparent",
                            border: `1px solid ${t.border}`,
                            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                            transition: "all 0.15s",
                        }}>
                            {Icon.x(t.faint, 12)}
                        </button>
                    </div>
                </div>
            )}

            {uploading && (
                <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
                    <div style={{
                        width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                        background: "rgba(232,255,71,0.07)", border: "1px solid rgba(232,255,71,0.18)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <div style={{
                            width: 20, height: 20, borderRadius: "50%",
                            border: "2.5px solid rgba(232,255,71,0.15)", borderTopColor: t.lime,
                            animation: "spin 0.75s linear infinite",
                        }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                            <p style={{ fontSize: 13.5, fontWeight: 600, color: t.text, margin: 0 }}>Uploading resume…</p>
                            <span style={{ fontSize: 13, fontWeight: 800, color: t.lime, fontFamily: "'Fraunces', serif" }}>{progress}%</span>
                        </div>
                        <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                            <div style={{
                                height: "100%", borderRadius: 99,
                                background: `linear-gradient(90deg, ${t.lime}, rgba(232,255,71,0.75))`,
                                width: `${progress}%`, transition: "width 0.12s ease",
                                boxShadow: "0 0 10px rgba(232,255,71,0.5)",
                            }} />
                        </div>
                    </div>
                </div>
            )}

            <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }}
                onChange={(e) => { if (e.target.files[0]) pick(e.target.files[0]); }} />
        </div>
    );
}

// ── Resume Card ───────────────────────────────────────────────────────────────
function ResumeCard({ resume, onDelete, index }) {
    const ext = getExt(resume.filename);
    const extColor = getExtColor(ext);
    const isPdf = resume.mime_type === "application/pdf";
    const [hovered, setHovered] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);

    const thumbnail = isPdf ? getPdfThumbnail(resume.url) : null;
    const downloadUrl = getDownloadUrl(resume.url, resume.filename);

    return (
        <div
            className="rcard"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                borderRadius: 20,
                background: t.surface,
                border: `1px solid ${hovered ? "rgba(255,255,255,0.13)" : t.border}`,
                overflow: "hidden",
                transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
                transform: hovered ? "translateY(-3px)" : "translateY(0)",
                boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.45)" : "0 2px 12px rgba(0,0,0,0.2)",
                display: "flex", flexDirection: "column",
                animation: `fadeUp 0.4s ${index * 0.06}s cubic-bezier(0.22,1,0.36,1) both`,
            }}
        >
            {/* Thumbnail area */}
            <div style={{
                height: 210, background: "#0c0c10", position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
            }}>
                {isPdf && thumbnail ? (
                    <>
                        <img
                            src={thumbnail}
                            alt={resume.filename}
                            onLoad={() => setImgLoaded(true)}
                            style={{
                                width: "100%", height: "100%", objectFit: "cover",
                                opacity: imgLoaded ? 1 : 0, transition: "opacity 0.3s ease",
                            }}
                        />
                        {/* Gradient overlay (always) */}
                        <div style={{
                            position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
                            background: "linear-gradient(to top, rgba(12,12,16,0.9), transparent)",
                            pointerEvents: "none",
                        }} />
                    </>
                ) : (
                    <div style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                    }}>
                        <div style={{
                            width: 52, height: 52, borderRadius: 16,
                            background: "rgba(255,255,255,0.03)", border: `1px solid ${t.border}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            {Icon.doc(26)}
                        </div>
                        <span style={{ fontSize: 11, color: t.faint }}>No preview</span>
                    </div>
                )}

                {/* Ext badge */}
                <div style={{
                    position: "absolute", top: 12, left: 12,
                    padding: "3px 9px", borderRadius: 7, fontSize: 10, fontWeight: 800,
                    fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.06em",
                    background: "rgba(10,10,14,0.82)",
                    border: `1px solid ${ext === "PDF" ? "rgba(248,113,113,0.3)" : "rgba(147,197,253,0.3)"}`,
                    color: extColor, backdropFilter: "blur(6px)",
                }}>
                    {ext}
                </div>

                {/* Hover overlay */}
                <div className="rcard-overlay" style={{
                    position: "absolute", inset: 0,
                    background: "rgba(0,0,0,0.55)",
                    backdropFilter: "blur(2px)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    opacity: 0, transition: "opacity 0.22s ease",
                }}>
                    <button
                        onClick={() => window.open(resume.url, "_blank")}
                        style={{
                            padding: "9px 20px", borderRadius: 11,
                            background: t.lime, border: "none",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13, fontWeight: 700, color: "#0a0a0e",
                            cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 7,
                            boxShadow: "0 4px 20px rgba(232,255,71,0.35)",
                        }}
                    >
                        {Icon.eye("#0a0a0e", 14)} Open
                    </button>
                    <a href={downloadUrl} download={resume.filename} onClick={e => e.stopPropagation()} style={{
                        width: 38, height: 38, borderRadius: 11,
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        textDecoration: "none", transition: "all 0.15s",
                    }}>
                        {Icon.download(t.text, 15)}
                    </a>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                padding: "13px 14px 14px",
                display: "flex", alignItems: "center", gap: 10,
                borderTop: `1px solid ${hovered ? "rgba(255,255,255,0.07)" : t.border}`,
                transition: "border-color 0.2s",
            }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                        fontSize: 12.5, fontWeight: 600, color: t.text, margin: "0 0 3px",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        letterSpacing: "-0.005em",
                    }}>
                        {resume.filename}
                    </p>
                    <p style={{ fontSize: 11, color: t.faint, margin: 0 }}>
                        {resume.file_size ? formatSize(resume.file_size) + " · " : ""}
                        {formatDate(resume.uploaded_at)}
                    </p>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <a href={downloadUrl} download={resume.filename} className="action-btn download" style={{ textDecoration: "none" }}>
                        {Icon.download(t.muted, 14)}
                    </a>
                    <button className="action-btn danger" onClick={() => onDelete(resume)}>
                        {Icon.trash(t.faint, 14)}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard({ delay = 0 }) {
    return (
        <div style={{
            borderRadius: 20, background: t.surface,
            border: `1px solid ${t.border}`, overflow: "hidden",
            animation: `fadeUp 0.4s ${delay}s cubic-bezier(0.22,1,0.36,1) both`,
        }}>
            <div style={{
                height: 210,
                background: `linear-gradient(90deg, ${t.surface} 0%, rgba(255,255,255,0.055) 50%, ${t.surface} 100%)`,
                backgroundSize: "800px 100%",
                animation: "shimmer 1.8s ease-in-out infinite",
            }} />
            <div style={{ padding: "13px 14px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1 }}>
                    <div style={{ height: 12, width: "65%", borderRadius: 6, background: t.surface2, marginBottom: 7, animation: "pulse 1.6s ease-in-out infinite" }} />
                    <div style={{ height: 9, width: "40%", borderRadius: 6, background: t.surface2, animation: "pulse 1.6s 0.2s ease-in-out infinite" }} />
                </div>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: t.surface2, animation: "pulse 1.6s 0.1s ease-in-out infinite" }} />
                <div style={{ width: 32, height: 32, borderRadius: 9, background: t.surface2, animation: "pulse 1.6s 0.15s ease-in-out infinite" }} />
            </div>
        </div>
    );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState() {
    const features = ["AI skill match", "ATS score", "Career insights", "Job fit analysis"];
    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 18, padding: "56px 24px 52px",
            borderRadius: 22, background: t.surface, border: `1px solid ${t.border}`,
            animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both",
            position: "relative", overflow: "hidden",
        }}>
            {/* Subtle bg glow */}
            <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-60%)",
                width: 220, height: 220, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(232,255,71,0.04) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            <div style={{
                width: 68, height: 68, borderRadius: 22,
                background: "rgba(232,255,71,0.05)",
                border: "1px solid rgba(232,255,71,0.13)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 0 8px rgba(232,255,71,0.03)",
                position: "relative",
            }}>
                {Icon.file(t.faint, 30)}
            </div>

            <div style={{ textAlign: "center" }}>
                <p style={{
                    fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 18,
                    color: t.text, margin: "0 0 6px", letterSpacing: "-0.03em",
                }}>
                    No resumes yet
                </p>
                <p style={{ fontSize: 13, color: t.faint, margin: 0, lineHeight: 1.65, maxWidth: 280 }}>
                    Upload your first resume to unlock AI-powered job matching, skill analysis, and career insights.
                </p>
            </div>

            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", justifyContent: "center" }}>
                {features.map((f, i) => (
                    <span key={f} style={{
                        fontSize: 11.5, padding: "5px 12px", borderRadius: 8,
                        background: t.surface2, border: `1px solid ${t.border}`,
                        color: t.faint, display: "flex", alignItems: "center", gap: 6,
                        animation: `fadeUp 0.4s ${0.08 + i * 0.05}s cubic-bezier(0.22,1,0.36,1) both`,
                    }}>
                        <span style={{ color: t.lime, fontSize: 8 }}>✦</span>
                        {f}
                    </span>
                ))}
            </div>
        </div>
    );
}

// ── Stat Chip ─────────────────────────────────────────────────────────────────
function StatChip({ label, value, accent, delay = 0 }) {
    return (
        <div className="stat-chip" style={{
            flex: 1, padding: "14px 18px", borderRadius: 16,
            background: t.surface, border: `1px solid ${t.border}`,
            animation: `fadeUp 0.4s ${delay}s cubic-bezier(0.22,1,0.36,1) both`,
            transition: "all 0.2s ease",
            cursor: "default", minWidth: 0,
        }}>
            <p style={{ fontSize: 10.5, color: t.faint, margin: "0 0 5px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                {label}
            </p>
            <p style={{ fontSize: 16, fontWeight: 800, color: accent || t.text, margin: 0, fontFamily: "'Fraunces', serif", letterSpacing: "-0.03em", lineHeight: 1 }}>
                {value}
            </p>
        </div>
    );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionLabel({ count }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 11, color: t.faint, textTransform: "uppercase", letterSpacing: "0.09em", fontWeight: 700 }}>
                {count} resume{count !== 1 ? "s" : ""}
            </span>
            <div style={{ flex: 1, height: 1, background: t.border }} />
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ResumePage() {
    const [resumes, setResumes]             = useState([]);
    const [loading, setLoading]             = useState(true);
    const [uploading, setUploading]         = useState(false);
    const [progress, setProgress]           = useState(0);
    const [deleteTarget, setDeleteTarget]   = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [toast, setToast]                 = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3400);
    };

    const fetchResumes = async () => {
        try {
            const res = await api.get(`${API}/list`);
            setResumes(res.data.resumes || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchResumes(); }, []);

    const handleUpload = async (file) => {
        setUploading(true); setProgress(0);
        const fd = new FormData();
        fd.append("file", file);
        try {
            await api.post(`${API}/upload`, fd, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
                onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
            });
            await fetchResumes();
            showToast("Resume uploaded successfully.");
        } catch (err) {
            showToast(err.response?.data?.detail || "Upload failed.", "error");
        } finally {
            setUploading(false); setProgress(0);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await api.delete(`${API}/delete/${deleteTarget.resume_id}`, { withCredentials: true });
            setResumes(prev => prev.filter(r => r.resume_id !== deleteTarget.resume_id));
            showToast("Resume deleted.");
        } catch (err) {
            showToast("Failed to delete.", "error");
        } finally {
            setDeleteLoading(false); setDeleteTarget(null);
        }
    };

    const formats = [...new Set(resumes.map(r => getExt(r.filename)))].join(", ") || "—";
    const latestDate = resumes[0]?.uploaded_at ? formatDate(resumes[0].uploaded_at) : "—";

    return (
        <>
            <style>{GLOBAL_CSS}</style>

            <div style={{ display: "flex", flexDirection: "column", gap: 26, fontFamily: "'DM Sans', sans-serif", maxWidth: 900 }}>

                {/* ── Header ── */}
                <div style={{ animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{
                            fontSize: 10, color: t.lime, letterSpacing: "0.18em",
                            textTransform: "uppercase", fontWeight: 700,
                        }}>
                            Resume Vault
                        </span>
                        <div style={{
                            width: 5, height: 5, borderRadius: "50%",
                            background: t.lime, opacity: 0.6,
                            animation: "floatDot 2.2s ease-in-out infinite",
                        }} />
                    </div>

                    <h1 style={{
                        fontFamily: "'Fraunces', serif", fontWeight: 800,
                        fontSize: "clamp(26px, 3.5vw, 40px)",
                        letterSpacing: "-0.04em", color: t.text,
                        margin: "0 0 8px", lineHeight: 1.0,
                    }}>
                        My{" "}
                        <em style={{
                            fontStyle: "italic", color: t.lime,
                            textShadow: "0 0 40px rgba(232,255,71,0.3)",
                        }}>Resumes</em>
                    </h1>
                    <p style={{ fontSize: 13.5, color: t.muted, margin: 0, lineHeight: 1.5 }}>
                        Upload, preview, and manage your resumes — powering every AI match.
                    </p>
                </div>

                {/* ── Stats ── */}
                {!loading && resumes.length > 0 && (
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <StatChip label="Total Resumes" value={resumes.length} accent={t.lime} delay={0.04} />
                        <StatChip label="Latest Upload" value={latestDate} delay={0.08} />
                        <StatChip label="Formats" value={formats} delay={0.12} />
                    </div>
                )}

                {/* ── Upload Zone ── */}
                <div style={{ animation: "fadeUp 0.4s 0.1s cubic-bezier(0.22,1,0.36,1) both" }}>
                    <UploadZone onUpload={handleUpload} uploading={uploading} progress={progress} />
                </div>

                {/* ── Grid ── */}
                <div style={{ animation: "fadeUp 0.4s 0.14s cubic-bezier(0.22,1,0.36,1) both" }}>
                    {loading ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(248px, 1fr))", gap: 14 }}>
                            <SkeletonCard delay={0} />
                            <SkeletonCard delay={0.05} />
                            <SkeletonCard delay={0.1} />
                        </div>
                    ) : resumes.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            <SectionLabel count={resumes.length} />
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(248px, 1fr))", gap: 14 }}>
                                {resumes.map((r, i) => (
                                    <ResumeCard key={r.resume_id} resume={r} onDelete={setDeleteTarget} index={i} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modals / Toasts */}
            {deleteTarget && (
                <DeleteModal
                    filename={deleteTarget.filename}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deleteLoading}
                />
            )}
            {toast && <Toast msg={toast.msg} type={toast.type} />}
        </>
    );
}