/*


import { useState } from "react";
import { ResumeProvider } from "./ResumeContext";
import TemplateSelectionPage from "./TemplateSelectionPage";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import ExperienceStep from "./steps/ExperienceStep";
import EducationStep from "./steps/EducationStep";
import SkillsStep from "./steps/SkillsStep";
import ProjectsStep from "./steps/ProjectStep";
import ActivitiesStep from "./steps/ActivitiesStep";
import ResumePreviewClassic from "./ResumePreviewClassic";
import { exportResumePDF } from "../../api/resume";
import { useResume } from "./ResumeContext";
import ResumePreviewModern from "./ResumePreviewModern";

const t = {
    bg: "#0a0a0e",
    surface: "rgba(255,255,255,0.03)",
    sidebar: "#08080b",
    previewBg: "#0d0d11",
    text: "#f0ede8",
    muted: "rgba(240,237,232,0.45)",
    faint: "rgba(240,237,232,0.22)",
    border: "rgba(255,255,255,0.07)",
    border2: "rgba(255,255,255,0.12)",
    lime: "#E8FF47",
    limeD: "#c8dd00",
    pink: "#f9a8d4",
};

const STEPS = [
    { id: "personal",    label: "Personal",    icon: "◈" },
    { id: "experience",  label: "Experience",  icon: "◉" },
    { id: "education",   label: "Education",   icon: "◎" },
    { id: "skills",      label: "Skills",      icon: "◆" },
    { id: "projects",    label: "Projects",    icon: "◇" },
    { id: "activities",  label: "Activities",  icon: "◈" },
];

function BuilderInner() {
    const [phase, setPhase] = useState("select");
    const [activeStep, setActiveStep] = useState(0);
    const [showPreview, setShowPreview] = useState(true);
    const [exporting, setExporting] = useState(false);
    const { resume } = useResume();

    const handleExportPDF = async () => {
        setExporting(true);
        try {
            const blob = await exportResumePDF(resume);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${resume.personal.name || "resume"}_resume.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert("PDF export failed. Make sure the backend is running.");
        } finally {
            setExporting(false);
        }
    };

    const stepComponents = [
        <PersonalInfoStep />,
        <ExperienceStep />,
        <EducationStep />,
        <SkillsStep />,
        <ProjectsStep />,
        <ActivitiesStep />,
    ];

    if (phase === "select") {
        return <TemplateSelectionPage onSelect={() => setPhase("build")} />;
    }

    const PreviewComponent = resume.template === "classic" ? ResumePreviewClassic : ResumePreviewModern;
    const progress = ((activeStep + 1) / STEPS.length) * 100;

    return (
        <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'DM Sans', sans-serif" }}>

            <header style={{
                borderBottom: `1px solid ${t.border}`,
                padding: "0 28px",
                height: 60,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: t.sidebar,
                position: "sticky", top: 0, zIndex: 50,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.03em", color: t.text }}>
                        Career<span style={{ color: t.lime }}>Crafter</span>
                    </span>
                    <span style={{ color: t.border2, fontSize: 18 }}>·</span>
                    <span style={{ color: t.faint, fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>Resume Builder</span>
                    <span style={{
                        fontSize: 10, padding: "3px 10px", borderRadius: 100,
                        fontWeight: 600, letterSpacing: "0.05em", textTransform: "capitalize",
                        color: resume.template === "classic" ? "rgba(240,237,232,0.7)" : t.lime,
                        borderColor: resume.template === "classic" ? "rgba(240,237,232,0.15)" : "rgba(232,255,71,0.25)",
                        background: resume.template === "classic" ? "rgba(240,237,232,0.05)" : "rgba(232,255,71,0.07)",
                        border: `1px solid`,
                    }}>
                        {resume.template}
                    </span>
                    <button
                        onClick={() => setPhase("select")}
                        style={{ fontSize: 11, color: t.faint, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, transition: "color 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.color = t.text}
                        onMouseLeave={e => e.currentTarget.style.color = t.faint}
                    >
                        change
                    </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        style={{
                            fontSize: 12, padding: "7px 16px", borderRadius: 10,
                            border: `1px solid ${t.border}`, color: t.muted,
                            background: "transparent", cursor: "pointer", transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.borderColor = t.border2; }}
                        onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.borderColor = t.border; }}
                    >
                        {showPreview ? "Hide Preview" : "Show Preview"}
                    </button>
                    <button
                        onClick={handleExportPDF}
                        disabled={exporting}
                        style={{
                            fontSize: 12, padding: "7px 20px", borderRadius: 10,
                            fontWeight: 700, background: t.lime, color: "#0a0a0e",
                            border: "none", cursor: "pointer", transition: "opacity 0.15s",
                            display: "flex", alignItems: "center", gap: 6,
                            opacity: exporting ? 0.6 : 1,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {exporting ? (
                            <>
                                <span style={{ width: 11, height: 11, border: "2px solid rgba(10,10,14,0.3)", borderTop: "2px solid #0a0a0e", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                                Exporting...
                            </>
                        ) : "↓ Export PDF"}
                    </button>
                </div>
            </header>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>

                <aside style={{
                    width: 220, minWidth: 220,
                    background: t.sidebar,
                    borderRight: `1px solid ${t.border}`,
                    display: "flex", flexDirection: "column",
                    padding: "20px 8px",
                }}>
                    <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                        {STEPS.map((step, i) => {
                            const active = activeStep === i;
                            const done = i < activeStep;
                            return (
                                <button
                                    key={step.id}
                                    onClick={() => setActiveStep(i)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 10,
                                        padding: "10px 13px", borderRadius: 12,
                                        background: active ? "rgba(232,255,71,0.07)" : "transparent",
                                        border: active ? "1px solid rgba(232,255,71,0.18)" : "1px solid transparent",
                                        color: active ? t.lime : done ? "rgba(240,237,232,0.55)" : t.faint,
                                        cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%",
                                    }}
                                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = t.surface; e.currentTarget.style.color = t.text; } }}
                                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = done ? "rgba(240,237,232,0.55)" : t.faint; } }}
                                >
                                    <div style={{
                                        width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        background: active ? "rgba(232,255,71,0.15)" : done ? "rgba(232,255,71,0.08)" : "rgba(255,255,255,0.04)",
                                        fontSize: 10, fontWeight: 700,
                                        color: active ? t.lime : done ? t.limeD : t.faint,
                                        border: done && !active ? `1px solid rgba(232,255,71,0.2)` : "1px solid transparent",
                                    }}>
                                        {done ? "✓" : i + 1}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: active ? t.lime : t.faint, marginBottom: 1 }}>
                                            Step {i + 1}
                                        </div>
                                        <div style={{ fontSize: 12, fontWeight: 500 }}>{step.label}</div>
                                    </div>
                                    {active && <span style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: t.lime, flexShrink: 0 }} />}
                                </button>
                            );
                        })}
                    </nav>

                    <div style={{ padding: "16px 13px 4px" }}>
                        <div style={{ fontSize: 9, color: t.faint, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Progress</div>
                        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${progress}%`, background: t.lime, borderRadius: 2, transition: "width 0.5s ease" }} />
                        </div>
                        <div style={{ fontSize: 10, color: t.faint, marginTop: 6 }}>{activeStep + 1} of {STEPS.length}</div>
                    </div>
                </aside>

                <main style={{
                    overflowY: "auto",
                    padding: "40px 40px",
                    width: showPreview ? "45%" : "100%",
                    background: t.bg,
                    flex: showPreview ? "none" : 1,
                }}>
                    <div style={{ maxWidth: 560, margin: "0 auto" }}>
                        <div style={{ marginBottom: 32 }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 12px", borderRadius: 100, border: "1px solid rgba(232,255,71,0.2)", background: "rgba(232,255,71,0.05)", marginBottom: 14 }}>
                                <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.lime }} />
                                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: t.lime }}>Step {activeStep + 1} of {STEPS.length}</span>
                            </div>
                            <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "1.8rem", letterSpacing: "-0.03em", color: t.text, marginBottom: 6 }}>
                                {STEPS[activeStep].label}
                            </h1>
                            <p style={{ fontSize: 13, color: t.muted }}>Fill in your {STEPS[activeStep].label.toLowerCase()} details below</p>
                        </div>

                        {stepComponents[activeStep]}

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: `1px solid ${t.border}` }}>
                            <button
                                onClick={() => setActiveStep(s => Math.max(0, s - 1))}
                                disabled={activeStep === 0}
                                style={{
                                    padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 500,
                                    border: `1px solid ${t.border}`, color: t.muted, background: "transparent",
                                    cursor: activeStep === 0 ? "not-allowed" : "pointer", transition: "all 0.15s",
                                    opacity: activeStep === 0 ? 0.3 : 1,
                                }}
                                onMouseEnter={e => { if (activeStep > 0) { e.currentTarget.style.color = t.text; e.currentTarget.style.borderColor = t.border2; } }}
                                onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.borderColor = t.border; }}
                            >
                                ← Previous
                            </button>
                            <button
                                onClick={() => setActiveStep(s => Math.min(STEPS.length - 1, s + 1))}
                                disabled={activeStep === STEPS.length - 1}
                                style={{
                                    padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                                    background: activeStep === STEPS.length - 1 ? "rgba(255,255,255,0.05)" : t.lime,
                                    color: activeStep === STEPS.length - 1 ? t.faint : "#0a0a0e",
                                    border: "none",
                                    cursor: activeStep === STEPS.length - 1 ? "not-allowed" : "pointer",
                                    transition: "all 0.15s", opacity: activeStep === STEPS.length - 1 ? 0.3 : 1,
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </main>

                {showPreview && (
                    <section style={{
                        flex: 1,
                        borderLeft: `1px solid ${t.border}`,
                        overflowY: "auto",
                        background: t.previewBg,
                        padding: "24px 28px",
                    }}>
                        <div style={{
                            position: "sticky", top: 0, zIndex: 10,
                            background: t.previewBg,
                            paddingBottom: 16, marginBottom: 16,
                            borderBottom: `1px solid ${t.border}`,
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}>
                            <span style={{ fontSize: 10, color: t.faint, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Live Preview</span>
                            <span style={{
                                fontSize: 10, padding: "3px 10px", borderRadius: 100,
                                color: "rgba(232,255,71,0.6)", background: "rgba(232,255,71,0.05)",
                                border: "1px solid rgba(232,255,71,0.12)",
                            }}>Auto-updating</span>
                        </div>
                        <PreviewComponent />
                    </section>
                )}
            </div>
        </div>
    );
}

export default function ResumeBuilder() {
    return (
        <ResumeProvider>
            <BuilderInner />
        </ResumeProvider>
    );
}


*/

import { useState, useEffect } from "react";
import { ResumeProvider } from "./ResumeContext";
import TemplateSelectionPage from "./TemplateSelectionPage";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import ExperienceStep from "./steps/ExperienceStep";
import EducationStep from "./steps/EducationStep";
import SkillsStep from "./steps/SkillsStep";
import ProjectsStep from "./steps/ProjectStep";
import ActivitiesStep from "./steps/ActivitiesStep";
import ResumePreviewClassic from "./ResumePreviewClassic";
import { exportResumePDF } from "../../api/resume";
import { useResume } from "./ResumeContext";
import ResumePreviewModern from "./ResumePreviewModern";
import { useParams } from "react-router-dom";

const t = {
    bg: "#0a0a0e",
    surface: "rgba(255,255,255,0.03)",
    sidebar: "#08080b",
    previewBg: "#0d0d11",
    text: "#f0ede8",
    muted: "rgba(240,237,232,0.45)",
    faint: "rgba(240,237,232,0.22)",
    border: "rgba(255,255,255,0.07)",
    border2: "rgba(255,255,255,0.12)",
    lime: "#E8FF47",
    limeD: "#c8dd00",
    green: "#86efac",
    red: "#fca5a5",
};

const STEPS = [
    { id: "personal",   label: "Personal",   icon: "◈" },
    { id: "experience", label: "Experience", icon: "◉" },
    { id: "education",  label: "Education",  icon: "◎" },
    { id: "skills",     label: "Skills",     icon: "◆" },
    { id: "projects",   label: "Projects",   icon: "◇" },
    { id: "activities", label: "Activities", icon: "◈" },
];

// ── Save status indicator ─────────────────────────────────────────────────────
function SaveIndicator({ status }) {
    if (status === "idle") return null;

    const config = {
        saving: { color: t.muted,  dot: "rgba(240,237,232,0.3)", label: "Saving…" },
        saved:  { color: t.green,  dot: t.green,                  label: "Saved"   },
        error:  { color: t.red,    dot: t.red,                    label: "Save failed" },
    }[status];

    if (!config) return null;

    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 11, color: config.color,
            transition: "opacity 0.2s",
        }}>
            {status === "saving" ? (
                <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    border: `2px solid rgba(240,237,232,0.15)`,
                    borderTopColor: t.muted,
                    animation: "spin 0.75s linear infinite",
                    flexShrink: 0,
                }} />
            ) : (
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: config.dot, flexShrink: 0 }} />
            )}
            {config.label}
        </div>
    );
}

// ── Main builder ──────────────────────────────────────────────────────────────
function BuilderInner({ initialResumeId }) {
    const [phase, setPhase] = useState(initialResumeId ? "build" : "select");
    const [activeStep, setActiveStep] = useState(0);
    const [showPreview, setShowPreview] = useState(true);
    const [exporting, setExporting] = useState(false);

    const { resume, saveStatus, loadStatus, saveToServer, loadFromServer } = useResume();

    // Load existing resume from server when in edit mode
    useEffect(() => {
        if (initialResumeId) {
            loadFromServer(initialResumeId);
        }
    }, [initialResumeId]);

    const handleExportPDF = async () => {
        setExporting(true);
        try {
            const blob = await exportResumePDF(resume);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${resume.personal.name || "resume"}_resume.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            alert("PDF export failed. Make sure the backend is running.");
        } finally {
            setExporting(false);
        }
    };

    const handleSave = async () => {
        await saveToServer();
    };

    const stepComponents = [
        <PersonalInfoStep />,
        <ExperienceStep />,
        <EducationStep />,
        <SkillsStep />,
        <ProjectsStep />,
        <ActivitiesStep />,
    ];

    // Loading screen while fetching existing resume
    if (loadStatus === "loading") {
        return (
            <div style={{
                minHeight: "100vh", background: t.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Sans', sans-serif",
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        border: `3px solid rgba(255,255,255,0.06)`,
                        borderTopColor: t.lime,
                        animation: "spin 0.75s linear infinite",
                        margin: "0 auto 16px",
                    }} />
                    <p style={{ fontSize: 13, color: t.muted }}>Loading your resume…</p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (phase === "select") {
        return <TemplateSelectionPage onSelect={() => setPhase("build")} />;
    }

    const PreviewComponent = resume.template === "classic" ? ResumePreviewClassic : ResumePreviewModern;
    const progress = ((activeStep + 1) / STEPS.length) * 100;
    const isNew = !resume.resume_id;

    return (
        <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'DM Sans', sans-serif" }}>

            {/* ── Header ── */}
            <header style={{
                borderBottom: `1px solid ${t.border}`,
                padding: "0 28px",
                height: 60,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: t.sidebar,
                position: "sticky", top: 0, zIndex: 50,
            }}>
                {/* Left side */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{
                        fontFamily: "'Fraunces', serif", fontWeight: 800,
                        fontSize: "1.2rem", letterSpacing: "-0.03em", color: t.text,
                    }}>
                        Career<span style={{ color: t.lime }}>Crafter</span>
                    </span>
                    <span style={{ color: t.border2, fontSize: 18 }}>·</span>
                    <span style={{ color: t.faint, fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Resume Builder
                    </span>
                    <span style={{
                        fontSize: 10, padding: "3px 10px", borderRadius: 100,
                        fontWeight: 600, letterSpacing: "0.05em", textTransform: "capitalize",
                        color: resume.template === "classic" ? "rgba(240,237,232,0.7)" : t.lime,
                        borderColor: resume.template === "classic" ? "rgba(240,237,232,0.15)" : "rgba(232,255,71,0.25)",
                        background: resume.template === "classic" ? "rgba(240,237,232,0.05)" : "rgba(232,255,71,0.07)",
                        border: "1px solid",
                    }}>
                        {resume.template}
                    </span>
                    <button
                        onClick={() => setPhase("select")}
                        style={{
                            fontSize: 11, color: t.faint, background: "none", border: "none",
                            cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3,
                            transition: "color 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = t.text}
                        onMouseLeave={e => e.currentTarget.style.color = t.faint}
                    >
                        change
                    </button>
                </div>

                {/* Right side */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

                    {/* Save status */}
                    <SaveIndicator status={saveStatus} />

                    {/* Unsaved draft badge */}
                    {isNew && saveStatus === "idle" && (
                        <span style={{
                            fontSize: 10, padding: "3px 9px", borderRadius: 7,
                            background: "rgba(252,211,77,0.08)", border: "1px solid rgba(252,211,77,0.2)",
                            color: "#fcd34d", fontWeight: 600,
                        }}>
                            Unsaved draft
                        </span>
                    )}

                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        style={{
                            fontSize: 12, padding: "7px 16px", borderRadius: 10,
                            border: `1px solid ${t.border}`, color: t.muted,
                            background: "transparent", cursor: "pointer", transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.borderColor = t.border2; }}
                        onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.borderColor = t.border; }}
                    >
                        {showPreview ? "Hide Preview" : "Show Preview"}
                    </button>

                    {/* Save button */}
                    <button
                        onClick={handleSave}
                        disabled={saveStatus === "saving"}
                        style={{
                            fontSize: 12, padding: "7px 18px", borderRadius: 10, fontWeight: 700,
                            background: "transparent",
                            border: `1px solid ${saveStatus === "saved" ? "rgba(134,239,172,0.35)" : t.border2}`,
                            color: saveStatus === "saved" ? t.green : t.text,
                            cursor: saveStatus === "saving" ? "not-allowed" : "pointer",
                            transition: "all 0.2s", opacity: saveStatus === "saving" ? 0.6 : 1,
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                        onMouseEnter={e => { if (saveStatus !== "saving") { e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; } }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = saveStatus === "saved" ? "rgba(134,239,172,0.35)" : t.border2; e.currentTarget.style.background = "transparent"; }}
                    >
                        {isNew ? "Save to Vault" : "Save"}
                    </button>

                    {/* Export PDF button */}
                    <button
                        onClick={handleExportPDF}
                        disabled={exporting}
                        style={{
                            fontSize: 12, padding: "7px 20px", borderRadius: 10, fontWeight: 700,
                            background: t.lime, color: "#0a0a0e", border: "none",
                            cursor: "pointer", transition: "opacity 0.15s",
                            display: "flex", alignItems: "center", gap: 6,
                            opacity: exporting ? 0.6 : 1, letterSpacing: "-0.01em",
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        {exporting ? (
                            <>
                                <span style={{
                                    width: 11, height: 11,
                                    border: "2px solid rgba(10,10,14,0.3)", borderTop: "2px solid #0a0a0e",
                                    borderRadius: "50%", display: "inline-block",
                                    animation: "spin 0.7s linear infinite",
                                }} />
                                Exporting…
                            </>
                        ) : "↓ Export PDF"}
                    </button>
                </div>
            </header>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>

                {/* ── Sidebar ── */}
                <aside style={{
                    width: 220, minWidth: 220,
                    background: t.sidebar, borderRight: `1px solid ${t.border}`,
                    display: "flex", flexDirection: "column", padding: "20px 8px",
                }}>
                    <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                        {STEPS.map((step, i) => {
                            const active = activeStep === i;
                            const done = i < activeStep;
                            return (
                                <button
                                    key={step.id}
                                    onClick={() => setActiveStep(i)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 10,
                                        padding: "10px 13px", borderRadius: 12,
                                        background: active ? "rgba(232,255,71,0.07)" : "transparent",
                                        border: active ? "1px solid rgba(232,255,71,0.18)" : "1px solid transparent",
                                        color: active ? t.lime : done ? "rgba(240,237,232,0.55)" : t.faint,
                                        cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%",
                                    }}
                                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = t.surface; e.currentTarget.style.color = t.text; } }}
                                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = done ? "rgba(240,237,232,0.55)" : t.faint; } }}
                                >
                                    <div style={{
                                        width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        background: active ? "rgba(232,255,71,0.15)" : done ? "rgba(232,255,71,0.08)" : "rgba(255,255,255,0.04)",
                                        fontSize: 10, fontWeight: 700,
                                        color: active ? t.lime : done ? t.limeD : t.faint,
                                        border: done && !active ? "1px solid rgba(232,255,71,0.2)" : "1px solid transparent",
                                    }}>
                                        {done ? "✓" : i + 1}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: active ? t.lime : t.faint, marginBottom: 1 }}>
                                            Step {i + 1}
                                        </div>
                                        <div style={{ fontSize: 12, fontWeight: 500 }}>{step.label}</div>
                                    </div>
                                    {active && <span style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: t.lime, flexShrink: 0 }} />}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Progress */}
                    <div style={{ padding: "16px 13px 4px" }}>
                        <div style={{ fontSize: 9, color: t.faint, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Progress</div>
                        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${progress}%`, background: t.lime, borderRadius: 2, transition: "width 0.5s ease" }} />
                        </div>
                        <div style={{ fontSize: 10, color: t.faint, marginTop: 6 }}>{activeStep + 1} of {STEPS.length}</div>
                    </div>
                </aside>

                {/* ── Main form area ── */}
                <main style={{
                    overflowY: "auto", padding: "40px 40px",
                    width: showPreview ? "45%" : "100%",
                    background: t.bg, flex: showPreview ? "none" : 1,
                }}>
                    <div style={{ maxWidth: 560, margin: "0 auto" }}>
                        <div style={{ marginBottom: 32 }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 12px", borderRadius: 100, border: "1px solid rgba(232,255,71,0.2)", background: "rgba(232,255,71,0.05)", marginBottom: 14 }}>
                                <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.lime }} />
                                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: t.lime }}>
                                    Step {activeStep + 1} of {STEPS.length}
                                </span>
                            </div>
                            <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "1.8rem", letterSpacing: "-0.03em", color: t.text, marginBottom: 6 }}>
                                {STEPS[activeStep].label}
                            </h1>
                            <p style={{ fontSize: 13, color: t.muted }}>
                                Fill in your {STEPS[activeStep].label.toLowerCase()} details below
                            </p>
                        </div>

                        {stepComponents[activeStep]}

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: `1px solid ${t.border}` }}>
                            <button
                                onClick={() => setActiveStep(s => Math.max(0, s - 1))}
                                disabled={activeStep === 0}
                                style={{
                                    padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 500,
                                    border: `1px solid ${t.border}`, color: t.muted, background: "transparent",
                                    cursor: activeStep === 0 ? "not-allowed" : "pointer", transition: "all 0.15s",
                                    opacity: activeStep === 0 ? 0.3 : 1,
                                }}
                                onMouseEnter={e => { if (activeStep > 0) { e.currentTarget.style.color = t.text; e.currentTarget.style.borderColor = t.border2; } }}
                                onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.borderColor = t.border; }}
                            >
                                ← Previous
                            </button>
                            <button
                                onClick={() => setActiveStep(s => Math.min(STEPS.length - 1, s + 1))}
                                disabled={activeStep === STEPS.length - 1}
                                style={{
                                    padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                                    background: activeStep === STEPS.length - 1 ? "rgba(255,255,255,0.05)" : t.lime,
                                    color: activeStep === STEPS.length - 1 ? t.faint : "#0a0a0e",
                                    border: "none",
                                    cursor: activeStep === STEPS.length - 1 ? "not-allowed" : "pointer",
                                    transition: "all 0.15s", opacity: activeStep === STEPS.length - 1 ? 0.3 : 1,
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </main>

                {/* ── Preview pane ── */}
                {showPreview && (
                    <section style={{
                        flex: 1, borderLeft: `1px solid ${t.border}`,
                        overflowY: "auto", background: t.previewBg, padding: "24px 28px",
                    }}>
                        <div style={{
                            position: "sticky", top: 0, zIndex: 10,
                            background: t.previewBg, paddingBottom: 16, marginBottom: 16,
                            borderBottom: `1px solid ${t.border}`,
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}>
                            <span style={{ fontSize: 10, color: t.faint, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                                Live Preview
                            </span>
                            <span style={{
                                fontSize: 10, padding: "3px 10px", borderRadius: 100,
                                color: "rgba(232,255,71,0.6)", background: "rgba(232,255,71,0.05)",
                                border: "1px solid rgba(232,255,71,0.12)",
                            }}>
                                Auto-updating
                            </span>
                        </div>
                        <PreviewComponent />
                    </section>
                )}
            </div>
        </div>
    );
}

// ── Export ────────────────────────────────────────────────────────────────────
// Pass initialResumeId from your router when editing an existing resume.
// e.g. <ResumeBuilder initialResumeId={params.resumeId} />
// Leave it undefined / null when creating a new one.

export default function ResumeBuilder() {
    const { resumeId = null } = useParams();

    return (
        <ResumeProvider initialResumeId={resumeId}>
            <BuilderInner initialResumeId={resumeId} />
        </ResumeProvider>
    );
}