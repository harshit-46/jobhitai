/*

// LWF

import { useState } from "react";
import { useResume } from "./ResumeContext";

const TEMPLATES = [
    {
        id: "classic",
        name: "Classic",
        tag: "ATS Friendly",
        description: "Clean single-column layout. Loved by recruiters, optimized for ATS scanners.",
        accent: "#e8e0d4",
        preview: <ClassicMiniPreview />,
    },
    {
        id: "modern",
        name: "Modern",
        tag: "Stands Out",
        description: "Bold dark header with editorial flair. Perfect for design and tech roles.",
        accent: "#00e5a0",
        preview: <ModernMiniPreview />,
    },
];

export default function TemplateSelectionPage({ onSelect }) {
    const { setTemplate } = useResume();
    const [hovered, setHovered] = useState(null);
    const [selected, setSelected] = useState(null);

    const handleSelect = (id) => {
        setSelected(id);
        setTemplate(id);
        setTimeout(() => onSelect(id), 320);
    };

    return (
        <div
            className="min-h-screen bg-[#0a0a0f] flex flex-col"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
            <header className="px-8 py-5 flex items-center justify-between border-b border-white/5">
                <span className="text-lg font-bold tracking-tight text-white">
                    JobHit<span style={{ color: "#00e5a0" }}>AI</span>
                </span>
                <span className="text-xs text-white/20 uppercase tracking-widest font-semibold">Resume Builder</span>
            </header>

            <div className="text-center pt-16 pb-12 px-6">
                <div
                    className="inline-block text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border"
                    style={{ color: "#00e5a0", borderColor: "rgba(0,229,160,0.2)", background: "rgba(0,229,160,0.06)" }}
                >
                    Step 1 of 2
                </div>
                <h1
                    className="text-white mb-4"
                    style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}
                >
                    Choose your resume template
                </h1>
                <p className="text-white/35 text-base max-w-md mx-auto">
                    Pick a layout that fits your style. You can always change it later inside the builder.
                </p>
            </div>

            <div className="flex-1 flex items-start justify-center gap-8 px-8 pb-16 flex-wrap">
                {TEMPLATES.map((t) => (
                    <div
                        key={t.id}
                        onMouseEnter={() => setHovered(t.id)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => handleSelect(t.id)}
                        className="cursor-pointer group"
                        style={{
                            width: "clamp(260px, 28vw, 340px)",
                            transform: hovered === t.id ? "translateY(-6px)" : "translateY(0)",
                            transition: "transform 0.25s ease",
                        }}
                    >
                        <div className="flex items-center justify-between mb-3 px-1">
                            <span className="text-white/50 text-sm font-semibold">{t.name}</span>
                            <span
                                className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                                style={{
                                    color: t.accent,
                                    borderColor: `${t.accent}30`,
                                    background: `${t.accent}10`,
                                }}
                            >
                                {t.tag}
                            </span>
                        </div>

                        <div
                            className="rounded-2xl overflow-hidden mb-4 relative"
                            style={{
                                border: selected === t.id
                                    ? `2px solid ${t.accent}`
                                    : hovered === t.id
                                        ? "2px solid rgba(255,255,255,0.15)"
                                        : "2px solid rgba(255,255,255,0.06)",
                                transition: "border-color 0.2s ease",
                                background: "#fff",
                                height: "420px",
                                boxShadow: hovered === t.id
                                    ? `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${t.accent}20`
                                    : "0 8px 32px rgba(0,0,0,0.4)",
                            }}
                        >
                            {t.preview}

                            <div
                                className="absolute inset-0 flex items-center justify-center"
                                style={{
                                    background: `${t.accent}18`,
                                    opacity: hovered === t.id || selected === t.id ? 1 : 0,
                                    transition: "opacity 0.2s ease",
                                }}
                            >
                                <div
                                    className="px-6 py-3 rounded-xl font-semibold text-sm"
                                    style={{
                                        background: t.accent,
                                        color: t.id === "classic" ? "#1a1a1a" : "#000",
                                        boxShadow: `0 8px 24px ${t.accent}50`,
                                    }}
                                >
                                    {selected === t.id ? "✓ Selected" : "Use this template →"}
                                </div>
                            </div>
                        </div>

                        <p className="text-white/30 text-xs text-center px-2">{t.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ClassicMiniPreview() {
    return (
        <div style={{ padding: "20px 22px", height: "100%", fontFamily: "Georgia, serif", fontSize: "7pt", color: "#1a1a1a", background: "#fff" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <div style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "13pt", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                    HARSHIT GUPTA
                </div>
                <div style={{ fontSize: "6pt", color: "#555", display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap" }}>
                    <span>Moradabad, UP</span><span style={{ color: "#bbb" }}>|</span>
                    <span>+91-9690424413</span><span style={{ color: "#bbb" }}>|</span>
                    <span>iamharshit999@gmail.com</span>
                </div>
            </div>

            {[
                {
                    title: "EDUCATION", rows: [
                        { left: "Graphic Era University, Dehradun", right: "2022 – 2026", sub: "B.Tech in Computer Science & AI", subRight: "CGPA: 8.1/10" },
                    ]
                },
                {
                    title: "TECHNICAL SKILLS", skills: [
                        ["Languages:", "C/C++, Python, JavaScript, Java, SQL"],
                        ["Frontend:", "React.js, Tailwind CSS, Redux"],
                        ["Backend:", "Node.js, Express.js"],
                    ]
                },
                {
                    title: "PROJECTS", projects: [
                        { name: "Algorithm Visualizer", tech: "(MERN, OS)", year: "2025", bullets: ["Web-based OS algorithm visualizer.", "Real-time simulations with React.js."] },
                        { name: "onChat", tech: "(MERN, WebSocket)", year: "2025", bullets: ["Real-time chat with WebSocket.", "Secure auth with Express & MongoDB."] },
                    ]
                },
                { title: "CERTIFICATIONS", certs: ["Azure AI Essentials by Microsoft", "HTML/CSS/JS by Udemy"] },
            ].map((section) => (
                <div key={section.title} style={{ marginBottom: "8px" }}>
                    <div style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "6.5pt", letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: "1px solid #000", paddingBottom: "1px", marginBottom: "4px" }}>
                        {section.title}
                    </div>
                    {section.rows?.map((row, i) => (
                        <div key={i} style={{ marginBottom: "3px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "7pt" }}>{row.left}</span>
                                <span style={{ fontFamily: "sans-serif", fontSize: "6pt", color: "#555" }}>{row.right}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontStyle: "italic", fontSize: "6.5pt", color: "#333" }}>{row.sub}</span>
                                <span style={{ fontFamily: "sans-serif", fontSize: "6pt", color: "#555" }}>{row.subRight}</span>
                            </div>
                        </div>
                    ))}
                    {section.skills?.map(([label, val], i) => (
                        <div key={i} style={{ display: "flex", gap: "3px", marginBottom: "1.5px" }}>
                            <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "6pt", whiteSpace: "nowrap" }}>{label}</span>
                            <span style={{ fontSize: "6pt", color: "#333" }}>{val}</span>
                        </div>
                    ))}
                    {section.projects?.map((p, i) => (
                        <div key={i} style={{ marginBottom: "4px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div>
                                    <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "7pt" }}>{p.name}</span>
                                    <span style={{ fontStyle: "italic", fontSize: "6pt", color: "#555", marginLeft: "2px" }}>{p.tech}</span>
                                </div>
                                <span style={{ fontFamily: "sans-serif", fontSize: "6pt", color: "#555" }}>{p.year}</span>
                            </div>
                            {p.bullets.map((b, j) => (
                                <div key={j} style={{ display: "flex", gap: "3px", fontSize: "6pt", color: "#444" }}>
                                    <span>•</span><span>{b}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                    {section.certs?.map((c, i) => (
                        <div key={i} style={{ display: "flex", gap: "3px", fontSize: "6pt", color: "#333" }}>
                            <span>•</span><span>{c}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

function ModernMiniPreview() {
    return (
        <div style={{ height: "100%", fontFamily: "Georgia, serif", fontSize: "7pt", color: "#1a1a1a", background: "#fff", display: "flex", flexDirection: "column" }}>
            <div style={{ background: "#1a1a2e", padding: "16px 18px 14px", color: "white" }}>
                <div style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "13pt", letterSpacing: "-0.01em", marginBottom: "5px" }}>
                    Harshit Gupta
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 10px", fontSize: "6pt", color: "rgba(255,255,255,0.5)" }}>
                    <span>✉ iamharshit999@gmail.com</span>
                    <span>✆ +91-9690424413</span>
                    <span>⌖ Moradabad, UP</span>
                </div>
            </div>

            <div style={{ padding: "14px 18px", flex: 1 }}>
                {[
                    { title: "Summary", content: <p style={{ fontSize: "6pt", color: "#555", lineHeight: 1.5 }}>Full-stack developer specializing in React, Node.js, and AI-integrated systems with 800+ DSA problems solved.</p> },
                    {
                        title: "Experience", content: (
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "7pt" }}>SDE Intern</span>
                                    <span style={{ fontSize: "6pt", color: "#888" }}>Jan 2025 – Present</span>
                                </div>
                                <div style={{ fontSize: "6pt", color: "#555", fontStyle: "italic" }}>TechCorp · Bangalore</div>
                                {["Built REST APIs reducing latency 40%.", "Led migration to React & TypeScript."].map((b, i) => (
                                    <div key={i} style={{ display: "flex", gap: "3px", fontSize: "6pt", color: "#444", marginTop: "1px" }}>
                                        <span style={{ color: "#00a070" }}>▸</span><span>{b}</span>
                                    </div>
                                ))}
                            </div>
                        )
                    },
                    {
                        title: "Projects", content: (
                            <div>
                                {[["Algorithm Visualizer", "MERN, OS"], ["onChat", "WebSocket, MERN"]].map(([name, tech], i) => (
                                    <div key={i} style={{ marginBottom: "4px" }}>
                                        <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "7pt" }}>{name}</span>
                                        <span style={{ fontSize: "6pt", color: "#888", marginLeft: "3px", fontStyle: "italic" }}>({tech})</span>
                                    </div>
                                ))}
                            </div>
                        )
                    },
                    {
                        title: "Skills", content: (
                            <div>
                                <div style={{ fontSize: "6pt", color: "#333" }}><b style={{ fontFamily: "sans-serif" }}>Technical: </b>React · FastAPI · MongoDB · Python · Node.js</div>
                            </div>
                        )
                    },
                ].map((s) => (
                    <div key={s.title} style={{ marginBottom: "9px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                            <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "6pt", letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a1a2e", whiteSpace: "nowrap" }}>{s.title}</span>
                            <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
                        </div>
                        {s.content}
                    </div>
                ))}
            </div>
        </div>
    );
}

*/







import { useState } from "react";
import { useResume } from "./ResumeContext";

const t = {
    bg: "#0a0a0e",
    sidebar: "#08080b",
    text: "#f0ede8",
    muted: "rgba(240,237,232,0.45)",
    faint: "rgba(240,237,232,0.22)",
    border: "rgba(255,255,255,0.07)",
    border2: "rgba(255,255,255,0.12)",
    lime: "#E8FF47",
    limeD: "#c8dd00",
};

const TEMPLATES = [
    {
        id: "classic",
        name: "Classic",
        tag: "ATS Friendly",
        description: "Clean single-column layout. Loved by recruiters, optimized for ATS scanners.",
        accent: "#e8e0d4",
        preview: <ClassicMiniPreview />,
    },
    {
        id: "modern",
        name: "Modern",
        tag: "Stands Out",
        description: "Bold dark header with editorial flair. Perfect for design and tech roles.",
        accent: "#E8FF47",
        preview: <ModernMiniPreview />,
    },
];

export default function TemplateSelectionPage({ onSelect }) {
    const { setTemplate } = useResume();
    const [hovered, setHovered] = useState(null);
    const [selected, setSelected] = useState(null);

    const handleSelect = (id) => {
        setSelected(id);
        setTemplate(id);
        setTimeout(() => onSelect(id), 320);
    };

    return (
        <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'DM Sans', sans-serif", color: t.text, display: "flex", flexDirection: "column" }}>

            {/* Top bar */}
            <header style={{
                padding: "0 32px", height: 60,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: `1px solid ${t.border}`,
                background: t.sidebar,
            }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.03em", color: t.text }}>
                    JobHit<span style={{ color: t.lime }}>AI</span>
                </span>
                <span style={{ fontSize: 10, color: t.faint, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Resume Builder</span>
            </header>

            {/* Hero text */}
            <div style={{ textAlign: "center", paddingTop: 72, paddingBottom: 56, paddingLeft: 24, paddingRight: 24 }}>
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "4px 14px", borderRadius: 100, marginBottom: 24,
                    border: "1px solid rgba(232,255,71,0.25)", background: "rgba(232,255,71,0.06)",
                }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.lime }} />
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: t.lime }}>Step 1 of 2</span>
                </div>
                <h1 style={{
                    fontFamily: "'Fraunces', serif", fontWeight: 800,
                    fontSize: "clamp(28px, 4vw, 52px)", letterSpacing: "-0.04em", lineHeight: 1.05,
                    color: t.text, marginBottom: 16,
                }}>
                    Choose your resume<br />
                    <span style={{ fontStyle: "italic", color: "rgba(240,237,232,0.4)" }}>template.</span>
                </h1>
                <p style={{ fontSize: 14, color: t.muted, maxWidth: 420, margin: "0 auto", lineHeight: 1.7 }}>
                    Pick a layout that fits your style. You can always change it later inside the builder.
                </p>
            </div>

            {/* Template cards */}
            <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 32, padding: "0 32px 80px", flexWrap: "wrap" }}>
                {TEMPLATES.map((tmpl) => (
                    <div
                        key={tmpl.id}
                        onMouseEnter={() => setHovered(tmpl.id)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => handleSelect(tmpl.id)}
                        style={{
                            width: "clamp(260px, 28vw, 340px)",
                            cursor: "pointer",
                            transform: hovered === tmpl.id ? "translateY(-8px)" : "translateY(0)",
                            transition: "transform 0.25s ease",
                        }}
                    >
                        {/* Label row */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "0 4px" }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: t.muted }}>{tmpl.name}</span>
                            <span style={{
                                fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 100,
                                letterSpacing: "0.05em", textTransform: "uppercase",
                                color: tmpl.id === "modern" ? t.lime : "rgba(240,237,232,0.6)",
                                border: `1px solid ${tmpl.id === "modern" ? "rgba(232,255,71,0.3)" : "rgba(240,237,232,0.15)"}`,
                                background: tmpl.id === "modern" ? "rgba(232,255,71,0.07)" : "rgba(240,237,232,0.04)",
                            }}>
                                {tmpl.tag}
                            </span>
                        </div>

                        {/* Preview card */}
                        <div style={{
                            borderRadius: 16, overflow: "hidden", marginBottom: 14, position: "relative",
                            border: selected === tmpl.id
                                ? `2px solid ${t.lime}`
                                : hovered === tmpl.id
                                    ? `2px solid rgba(255,255,255,0.15)`
                                    : `2px solid ${t.border}`,
                            background: "#fff",
                            height: 420,
                            boxShadow: hovered === tmpl.id
                                ? `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,255,71,0.12)`
                                : "0 8px 32px rgba(0,0,0,0.4)",
                            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                        }}>
                            {tmpl.preview}

                            {/* Hover overlay */}
                            <div style={{
                                position: "absolute", inset: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: "rgba(232,255,71,0.1)",
                                opacity: hovered === tmpl.id || selected === tmpl.id ? 1 : 0,
                                transition: "opacity 0.2s ease",
                            }}>
                                <div style={{
                                    padding: "12px 28px", borderRadius: 12,
                                    fontWeight: 700, fontSize: 13, letterSpacing: "-0.01em",
                                    background: t.lime, color: "#0a0a0e",
                                    boxShadow: "0 8px 28px rgba(232,255,71,0.4)",
                                }}>
                                    {selected === tmpl.id ? "✓ Selected" : "Use this template →"}
                                </div>
                            </div>
                        </div>

                        <p style={{ fontSize: 12, color: t.faint, textAlign: "center", padding: "0 8px", lineHeight: 1.6 }}>{tmpl.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── Mini Previews (unchanged logic, unchanged content) ── */

function ClassicMiniPreview() {
    return (
        <div style={{ height: "100%", fontFamily: "Georgia, serif", fontSize: "7pt", color: "#1a1a1a", background: "#fff", padding: "16px 18px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px", borderBottom: "0.5px solid #ccc", paddingBottom: "8px" }}>
                <div style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "11pt", letterSpacing: "0.08em", textTransform: "uppercase", color: "#000", marginBottom: "4px" }}>
                    HARSHIT GUPTA
                </div>
                <div style={{ fontSize: "6pt", color: "#555", display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap" }}>
                    <span>Moradabad, UP</span><span style={{ color: "#bbb" }}>|</span>
                    <span>+91-9690424413</span><span style={{ color: "#bbb" }}>|</span>
                    <span>iamharshit999@gmail.com</span>
                </div>
            </div>

            {[
                {
                    title: "EDUCATION", rows: [
                        { left: "Graphic Era University, Dehradun", right: "2022 – 2026", sub: "B.Tech in Computer Science & AI", subRight: "CGPA: 8.1/10" },
                    ]
                },
                {
                    title: "TECHNICAL SKILLS", skills: [
                        ["Languages:", "C/C++, Python, JavaScript, Java, SQL"],
                        ["Frontend:", "React.js, Tailwind CSS, Redux"],
                        ["Backend:", "Node.js, Express.js"],
                    ]
                },
                {
                    title: "PROJECTS", projects: [
                        { name: "Algorithm Visualizer", tech: "(MERN, OS)", year: "2025", bullets: ["Web-based OS algorithm visualizer.", "Real-time simulations with React.js."] },
                        { name: "onChat", tech: "(MERN, WebSocket)", year: "2025", bullets: ["Real-time chat with WebSocket.", "Secure auth with Express & MongoDB."] },
                    ]
                },
                { title: "CERTIFICATIONS", certs: ["Azure AI Essentials by Microsoft", "HTML/CSS/JS by Udemy"] },
            ].map((section) => (
                <div key={section.title} style={{ marginBottom: "8px" }}>
                    <div style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "6.5pt", letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: "1px solid #000", paddingBottom: "1px", marginBottom: "4px" }}>
                        {section.title}
                    </div>
                    {section.rows?.map((row, i) => (
                        <div key={i} style={{ marginBottom: "3px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "7pt" }}>{row.left}</span>
                                <span style={{ fontFamily: "sans-serif", fontSize: "6pt", color: "#555" }}>{row.right}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontStyle: "italic", fontSize: "6.5pt", color: "#333" }}>{row.sub}</span>
                                <span style={{ fontFamily: "sans-serif", fontSize: "6pt", color: "#555" }}>{row.subRight}</span>
                            </div>
                        </div>
                    ))}
                    {section.skills?.map(([label, val], i) => (
                        <div key={i} style={{ display: "flex", gap: "3px", marginBottom: "1.5px" }}>
                            <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "6pt", whiteSpace: "nowrap" }}>{label}</span>
                            <span style={{ fontSize: "6pt", color: "#333" }}>{val}</span>
                        </div>
                    ))}
                    {section.projects?.map((p, i) => (
                        <div key={i} style={{ marginBottom: "4px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div>
                                    <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "7pt" }}>{p.name}</span>
                                    <span style={{ fontStyle: "italic", fontSize: "6pt", color: "#555", marginLeft: "2px" }}>{p.tech}</span>
                                </div>
                                <span style={{ fontFamily: "sans-serif", fontSize: "6pt", color: "#555" }}>{p.year}</span>
                            </div>
                            {p.bullets.map((b, j) => (
                                <div key={j} style={{ display: "flex", gap: "3px", fontSize: "6pt", color: "#444" }}>
                                    <span>•</span><span>{b}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                    {section.certs?.map((c, i) => (
                        <div key={i} style={{ display: "flex", gap: "3px", fontSize: "6pt", color: "#333" }}>
                            <span>•</span><span>{c}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

function ModernMiniPreview() {
    return (
        <div style={{ height: "100%", fontFamily: "Georgia, serif", fontSize: "7pt", color: "#1a1a1a", background: "#fff", display: "flex", flexDirection: "column" }}>
            <div style={{ background: "#1a1a2e", padding: "16px 18px 14px", color: "white" }}>
                <div style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "13pt", letterSpacing: "-0.01em", marginBottom: "5px" }}>
                    Harshit Gupta
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 10px", fontSize: "6pt", color: "rgba(255,255,255,0.5)" }}>
                    <span>✉ iamharshit999@gmail.com</span>
                    <span>✆ +91-9690424413</span>
                    <span>⌖ Moradabad, UP</span>
                </div>
            </div>
            <div style={{ padding: "14px 18px", flex: 1 }}>
                {[
                    { title: "Summary", content: <p style={{ fontSize: "6pt", color: "#555", lineHeight: 1.5 }}>Full-stack developer specializing in React, Node.js, and AI-integrated systems with 800+ DSA problems solved.</p> },
                    {
                        title: "Experience", content: (
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "7pt" }}>SDE Intern</span>
                                    <span style={{ fontSize: "6pt", color: "#888" }}>Jan 2025 – Present</span>
                                </div>
                                <div style={{ fontSize: "6pt", color: "#555", fontStyle: "italic" }}>TechCorp · Bangalore</div>
                                {["Built REST APIs reducing latency 40%.", "Led migration to React & TypeScript."].map((b, i) => (
                                    <div key={i} style={{ display: "flex", gap: "3px", fontSize: "6pt", color: "#444", marginTop: "1px" }}>
                                        <span style={{ color: "#00a070" }}>▸</span><span>{b}</span>
                                    </div>
                                ))}
                            </div>
                        )
                    },
                    {
                        title: "Projects", content: (
                            <div>
                                {[["Algorithm Visualizer", "MERN, OS"], ["onChat", "WebSocket, MERN"]].map(([name, tech], i) => (
                                    <div key={i} style={{ marginBottom: "4px" }}>
                                        <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "7pt" }}>{name}</span>
                                        <span style={{ fontSize: "6pt", color: "#888", marginLeft: "3px", fontStyle: "italic" }}>({tech})</span>
                                    </div>
                                ))}
                            </div>
                        )
                    },
                    {
                        title: "Skills", content: (
                            <div>
                                <div style={{ fontSize: "6pt", color: "#333" }}><b style={{ fontFamily: "sans-serif" }}>Technical: </b>React · FastAPI · MongoDB · Python · Node.js</div>
                            </div>
                        )
                    },
                ].map((s) => (
                    <div key={s.title} style={{ marginBottom: "9px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                            <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "6pt", letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a1a2e", whiteSpace: "nowrap" }}>{s.title}</span>
                            <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
                        </div>
                        {s.content}
                    </div>
                ))}
            </div>
        </div>
    );
}