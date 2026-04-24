import { useEffect, useState, useRef, useCallback } from "react";
import api from "../api/axios";

// ── Design tokens ─────────────────────────────────────────────────────────────
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
    green: "#86efac",
    gold: "#fcd34d",
    red: "#fca5a5",
};

const API = "https://jobhitai-server.onrender.com/api/resume";

// ── URL helpers ───────────────────────────────────────────────────────────────

// PDFs uploaded as resource_type="image" — swap to fl_inline for browser rendering
function getInlineUrl(url, mimeType) {
    if (mimeType !== "application/pdf") return null;
    return url.replace("/image/upload/", "/image/upload/fl_inline/");
}

// Download URL — forces download with original filename preserved
function getDownloadUrl(url, filename, mimeType) {
    const safe = filename.replace(/\s+/g, "_");
    if (mimeType === "application/pdf") {
        // PDF was uploaded as image resource_type
        return url.replace("/image/upload/", `/image/upload/fl_attachment:${safe}/`);
    }
    // DOC/DOCX uploaded as raw
    return url.replace("/raw/upload/", `/raw/upload/fl_attachment:${safe}/`);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
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
        day: "numeric", month: "short", year: "numeric"
    });
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = {
    file: (color = t.lime, size = 22) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
    ),
    upload: (color = t.lime, size = 22) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        </svg>
    ),
    trash: (color = t.faint, size = 15) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
    ),
    eye: (color = t.muted, size = 14) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ),
    download: (color = t.muted, size = 14) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    ),
    expand: (color = "#0a0a0e", size = 13) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
    ),
    x: (color = t.faint, size = 13) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
    check: (color = t.green, size = 14) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    noPreview: (color = t.faint, size = 28) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
    ),
};

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
    return (
        <div style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 2000,
            padding: "11px 16px", borderRadius: 12,
            background: type === "error" ? "rgba(252,165,165,0.08)" : "rgba(134,239,172,0.08)",
            border: `1px solid ${type === "error" ? "rgba(252,165,165,0.22)" : "rgba(134,239,172,0.22)"}`,
            color: type === "error" ? t.red : t.green,
            fontSize: 13, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            animation: "toastIn 0.3s cubic-bezier(0.22,1,0.36,1) both",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", gap: 8,
        }}>
            {type !== "error" && Icon.check(t.green, 14)}
            {msg}
        </div>
    );
}

// ── Delete confirm modal ──────────────────────────────────────────────────────
function DeleteModal({ filename, onConfirm, onCancel, loading }) {
    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.72)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20, backdropFilter: "blur(6px)",
            animation: "fadeIn 0.15s ease both",
        }}>
            <div style={{
                width: "100%", maxWidth: 360,
                background: "#111116",
                border: `1px solid ${t.border2}`,
                borderRadius: 20, overflow: "hidden",
                animation: "slideUp 0.3s cubic-bezier(0.22,1,0.36,1) both",
                fontFamily: "'DM Sans', sans-serif",
            }}>
                <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${t.red},transparent)` }} />
                <div style={{ padding: "22px 22px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: "rgba(252,165,165,0.08)",
                            border: "1px solid rgba(252,165,165,0.18)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            {Icon.trash(t.red, 16)}
                        </div>
                        <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 16, color: t.text, margin: 0, letterSpacing: "-0.02em" }}>
                            Delete resume?
                        </h3>
                    </div>
                    <p style={{ fontSize: 13, color: t.muted, margin: "0 0 18px", lineHeight: 1.6 }}>
                        <strong style={{ color: t.text }}>{filename}</strong> will be permanently removed and cannot be recovered.
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={onConfirm} disabled={loading} style={{
                            flex: 1, padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 700,
                            fontFamily: "'DM Sans', sans-serif",
                            background: "rgba(252,165,165,0.1)", border: "1px solid rgba(252,165,165,0.22)",
                            color: t.red, cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.5 : 1, transition: "all 0.15s",
                        }}>
                            {loading ? "Deleting…" : "Yes, delete"}
                        </button>
                        <button onClick={onCancel} disabled={loading} style={{
                            flex: 1, padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 600,
                            fontFamily: "'DM Sans', sans-serif",
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

// ── Upload drop zone ──────────────────────────────────────────────────────────
function UploadZone({ onUpload, uploading, progress }) {
    const [dragging, setDragging] = useState(false);
    const [picked, setPicked] = useState(null);
    const inputRef = useRef(null);

    const ALLOWED = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => isIdle && inputRef.current?.click()}
            style={{
                borderRadius: 18,
                border: `1.5px dashed ${dragging ? t.lime : picked ? "rgba(134,239,172,0.38)" : t.border2}`,
                background: dragging ? "rgba(232,255,71,0.03)" : picked ? "rgba(134,239,172,0.025)" : t.surface,
                padding: picked || uploading ? "16px 20px" : "22px 24px",
                cursor: isIdle ? "pointer" : "default",
                transition: "all 0.2s",
            }}
        >
            {isIdle && (
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: dragging ? "rgba(232,255,71,0.1)" : t.surface2,
                        border: `1px solid ${dragging ? "rgba(232,255,71,0.28)" : t.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s",
                    }}>
                        {Icon.upload(dragging ? t.lime : t.muted, 20)}
                    </div>
                    <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: dragging ? t.lime : t.text, margin: "0 0 3px", transition: "color 0.2s" }}>
                            {dragging ? "Drop to upload" : "Upload a new resume"}
                        </p>
                        <p style={{ fontSize: 11, color: t.faint, margin: 0 }}>
                            PDF, DOC, DOCX · Max 5 MB · Drag & drop or click to browse
                        </p>
                    </div>
                </div>
            )}

            {picked && !uploading && (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                        background: "rgba(134,239,172,0.08)", border: "1px solid rgba(134,239,172,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        {Icon.file(t.green, 18)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: t.text, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {picked.name}
                        </p>
                        <p style={{ fontSize: 11, color: t.faint, margin: 0 }}>{formatSize(picked.size)}</p>
                    </div>
                    <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                        <button onClick={(e) => { e.stopPropagation(); submit(); }} style={{
                            padding: "7px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                            fontFamily: "'DM Sans', sans-serif",
                            background: t.lime, color: "#0a0a0e", border: "none", cursor: "pointer",
                            boxShadow: "0 4px 14px rgba(232,255,71,0.22)", transition: "all 0.15s",
                        }}>
                            Upload →
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setPicked(null); }} style={{
                            width: 32, height: 32, borderRadius: 9, background: "transparent",
                            border: `1px solid ${t.border}`,
                            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                        }}>
                            {Icon.x()}
                        </button>
                    </div>
                </div>
            )}

            {uploading && (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                        background: "rgba(232,255,71,0.07)", border: "1px solid rgba(232,255,71,0.18)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <div style={{
                            width: 17, height: 17, borderRadius: "50%",
                            border: "2px solid rgba(232,255,71,0.18)", borderTopColor: t.lime,
                            animation: "spin 0.8s linear infinite",
                        }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: t.text, margin: 0 }}>Uploading…</p>
                            <span style={{ fontSize: 12, fontWeight: 700, color: t.lime }}>{progress}%</span>
                        </div>
                        <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}>
                            <div style={{ height: "100%", borderRadius: 99, background: t.lime, width: `${progress}%`, transition: "width 0.15s ease" }} />
                        </div>
                    </div>
                </div>
            )}

            <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }}
                onChange={(e) => { if (e.target.files[0]) pick(e.target.files[0]); }} />
        </div>
    );
}

// ── Resume card ───────────────────────────────────────────────────────────────
function ResumeCard({ resume, onDelete, index }) {
    const ext = getExt(resume.filename);
    const extColor = getExtColor(ext);
    const isPdf = resume.mime_type === "application/pdf";
    const [hovered, setHovered] = useState(false);

    const thumbnail = isPdf ? getPdfThumbnail(resume.url) : null;
    const downloadUrl = getDownloadUrl(resume.url, resume.filename);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                borderRadius: 18,
                background: t.surface,
                border: `1px solid ${hovered ? t.border2 : t.border}`,
                overflow: "hidden",
                transition: "all 0.2s",
                transform: hovered ? "translateY(-2px)" : "translateY(0)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Preview */}
            <div style={{
                height: 200,
                background: "#0d0d11",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
            }}>
                {isPdf ? (
                    <>
                        <img
                            src={thumbnail}
                            alt={resume.filename}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                        />

                        {/* Hover overlay */}
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0,0,0,0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: hovered ? 1 : 0,
                            transition: "0.2s"
                        }}>
                            <button
                                onClick={() => window.open(resume.url, "_blank")}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: 10,
                                    background: t.lime,
                                    border: "none",
                                    fontWeight: 700,
                                    cursor: "pointer"
                                }}
                            >
                                Open PDF
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ color: t.faint }}>No preview</div>
                )}
            </div>

            {/* Footer */}
            <div style={{ padding: 14, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, color: t.text }}>{resume.filename}</p>
                </div>

                {/* Download */}
                <a href={downloadUrl} download={resume.filename}>
                    {Icon.download()}
                </a>

                {/* Delete */}
                <button onClick={() => onDelete(resume)}>
                    {Icon.trash()}
                </button>
            </div>
        </div>
    );
}

// ── Reusable icon button ──────────────────────────────────────────────────────
function ActionBtn({ children, onClick, title, hoverBorder, hoverBg }) {
    return (
        <button
            onClick={onClick}
            title={title}
            style={{
                width: 30, height: 30, borderRadius: 8,
                background: "transparent", border: `1px solid ${t.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = hoverBorder; e.currentTarget.style.background = hoverBg; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = "transparent"; }}
        >
            {children}
        </button>
    );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 14, padding: "52px 20px",
            borderRadius: 18, background: t.surface, border: `1px solid ${t.border}`,
            animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both",
        }}>
            <div style={{
                width: 60, height: 60, borderRadius: 18,
                background: "rgba(232,255,71,0.05)", border: "1px solid rgba(232,255,71,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                {Icon.file(t.faint, 28)}
            </div>
            <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 16, color: t.text, margin: "0 0 5px", letterSpacing: "-0.02em" }}>
                    No resumes yet
                </p>
                <p style={{ fontSize: 12, color: t.faint, margin: 0, lineHeight: 1.6 }}>
                    Upload your first resume above to unlock<br />AI-powered job matching and analysis.
                </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 4 }}>
                {["AI skill match", "ATS score", "Career insights"].map(f => (
                    <span key={f} style={{
                        fontSize: 11, padding: "4px 11px", borderRadius: 7,
                        background: t.surface2, border: `1px solid ${t.border}`,
                        color: t.faint, display: "flex", alignItems: "center", gap: 5,
                    }}>
                        <span style={{ fontSize: 8, color: t.lime }}>✦</span> {f}
                    </span>
                ))}
            </div>
        </div>
    );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div style={{
            borderRadius: 18, background: t.surface,
            border: `1px solid ${t.border}`, overflow: "hidden",
            animation: "pulse 1.6s ease-in-out infinite",
        }}>
            <div style={{ height: 200, background: t.surface2 }} />
            <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: t.surface2 }} />
                <div style={{ flex: 1 }}>
                    <div style={{ height: 12, width: "60%", borderRadius: 6, background: t.surface2, marginBottom: 6 }} />
                    <div style={{ height: 9, width: "35%", borderRadius: 6, background: t.surface2 }} />
                </div>
            </div>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ResumePage() {
    const [resumes, setResumes]           = useState([]);
    const [loading, setLoading]           = useState(true);
    const [uploading, setUploading]       = useState(false);
    const [progress, setProgress]         = useState(0);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [toast, setToast]               = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3200);
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
        setUploading(true);
        setProgress(0);
        const formData = new FormData();
        formData.append("file", file);
        try {
            await api.post(`${API}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
                onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
            });
            await fetchResumes();
            showToast("Resume uploaded successfully.");
        } catch (err) {
            showToast(err.response?.data?.detail || "Upload failed.", "error");
        } finally {
            setUploading(false);
            setProgress(0);
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
            setDeleteLoading(false);
            setDeleteTarget(null);
        }
    };

    return (
        <>
            <style>{`
                @keyframes fadeIn  { from{opacity:0}to{opacity:1} }
                @keyframes slideUp { from{opacity:0;transform:translateY(20px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)} }
                @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
                @keyframes spin    { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
                @keyframes toastIn { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
                @keyframes pulse   { 0%,100%{opacity:1}50%{opacity:0.5} }
            `}</style>

            <div style={{ display: "flex", flexDirection: "column", gap: 22, fontFamily: "'DM Sans', sans-serif" }}>

                {/* Header */}
                <div style={{ animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
                    <p style={{ fontSize: 10, color: t.lime, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>
                        Resume Vault
                    </p>
                    <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "clamp(24px,3vw,36px)", letterSpacing: "-0.035em", color: t.text, margin: "0 0 6px", lineHeight: 1.05 }}>
                        My <em style={{ fontStyle: "italic", color: t.lime }}>Resumes</em>
                    </h1>
                    <p style={{ fontSize: 13, color: t.muted, margin: 0 }}>
                        Manage your resumes — upload, preview, and delete anytime.
                    </p>
                </div>

                {/* Stats row */}
                {!loading && resumes.length > 0 && (
                    <div style={{ display: "flex", gap: 10, animation: "fadeUp 0.4s 0.05s cubic-bezier(0.22,1,0.36,1) both" }}>
                        {[
                            { label: "Total Resumes", value: resumes.length },
                            { label: "Latest Upload", value: resumes[0]?.uploaded_at ? formatDate(resumes[0].uploaded_at) : "—" },
                            { label: "Formats", value: [...new Set(resumes.map(r => getExt(r.filename)))].join(", ") || "—" },
                        ].map(({ label, value }) => (
                            <div key={label} style={{
                                flex: 1, padding: "12px 16px", borderRadius: 14,
                                background: t.surface, border: `1px solid ${t.border}`,
                            }}>
                                <p style={{ fontSize: 10, color: t.faint, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>{label}</p>
                                <p style={{ fontSize: 15, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Fraunces', serif", letterSpacing: "-0.02em" }}>{value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload zone */}
                <div style={{ animation: "fadeUp 0.4s 0.08s cubic-bezier(0.22,1,0.36,1) both" }}>
                    <UploadZone onUpload={handleUpload} uploading={uploading} progress={progress} />
                </div>

                {/* Grid */}
                <div style={{ animation: "fadeUp 0.4s 0.12s cubic-bezier(0.22,1,0.36,1) both" }}>
                    {loading ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
                            <SkeletonCard /><SkeletonCard />
                        </div>
                    ) : resumes.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            <p style={{ fontSize: 11, color: t.faint, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>
                                {resumes.length} resume{resumes.length !== 1 ? "s" : ""}
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
                                {resumes.map((r, i) => (
                                    <ResumeCard key={r.resume_id} resume={r} onDelete={setDeleteTarget} index={i} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

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