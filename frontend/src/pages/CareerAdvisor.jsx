import { useEffect, useState } from "react";
import api from "../api/axios";

const t = {
    bg: "#0a0a0e",
    surface: "rgba(255,255,255,0.03)",
    surface2: "rgba(255,255,255,0.055)",
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
};

// rgba backgrounds don't work on native <select> dropdowns — use solid color
const selectStyle = {
    padding: "9px 14px",
    borderRadius: 12,
    background: "#141418",
    border: `1px solid ${t.border}`,
    color: t.text,
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
    minWidth: 180,
    transition: "border-color 0.15s",
    width: "100%",
};

function SkillTag({ label, color }) {
    return (
        <span style={{
            fontSize: 11, fontWeight: 600,
            padding: "4px 10px", borderRadius: 999,
            background: `${color}15`,
            border: `1px solid ${color}30`,
            color: color,
            letterSpacing: "0.02em",
        }}>
            {label}
        </span>
    );
}

function CareerCard({ data, name, accentColor }) {
    return (
        <div style={{
            borderRadius: 20,
            background: t.surface,
            border: `1px solid ${t.border}`,
            overflow: "hidden",
            position: "relative",
        }}>
            {/* Top accent line */}
            <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${accentColor},transparent)` }} />

            <div style={{ padding: "20px 22px" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: 10, fontSize: 18,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: `${accentColor}12`, border: `1px solid ${accentColor}25`,
                        flexShrink: 0,
                    }}>
                        {data.icon}
                    </div>
                    <div>
                        <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 18, letterSpacing: "-0.025em", color: t.text, margin: 0 }}>
                            {name}
                        </h2>
                        <span style={{ fontSize: 11, color: t.faint, textTransform: "uppercase", letterSpacing: "0.06em" }}>{data.category}</span>
                    </div>
                </div>

                <p style={{ fontSize: 13, color: t.muted, lineHeight: 1.65, marginBottom: 14 }}>{data.description}</p>

                {/* Salary */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, padding: "9px 13px", borderRadius: 10, background: `${t.gold}0d`, border: `1px solid ${t.gold}20` }}>
                    <span style={{ fontSize: 14 }}>💰</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: t.gold }}>{data.salary}</span>
                </div>

                {/* Skills */}
                <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: t.faint, marginBottom: 8 }}>🧠 Skills</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {data.skills.map((skill, i) => (
                            <SkillTag key={i} label={skill} color={accentColor} />
                        ))}
                    </div>
                </div>

                {/* Roadmap */}
                <div>
                    <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: t.faint, marginBottom: 10 }}>🛣 Roadmap</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {Object.entries(data.roadmap).map(([level, steps]) => (
                            <div key={level}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: t.lime, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{level}</div>
                                <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 3 }}>
                                    {steps.map((step, i) => (
                                        <li key={i} style={{ fontSize: 12, color: t.muted, lineHeight: 1.55, listStyleType: "none", paddingLeft: 2, display: "flex", alignItems: "flex-start", gap: 6 }}>
                                            <span style={{ color: accentColor, flexShrink: 0, marginTop: 2 }}>›</span>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CareerAdvisor() {
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState("");
    const [compare, setCompare] = useState("");

    const [data, setData] = useState(null);
    const [compareData, setCompareData] = useState(null);

    const [question, setQuestion] = useState("");
    const [chat, setChat] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get("/career/categories");
                setCategories(res.data.categories);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    const handleSelect = async () => {
        try {
            const res = await api.post("/career/select", {
                category: selected,
                compare_category: compare,
            });
            setData(res.data.data);
            setCompareData(res.data.compare_data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAsk = async () => {
        if (!question || !selected) return;
        try {
            const res = await api.post("/career/ask", {
                question,
                career: selected,
            });
            setChat((prev) => [
                ...prev,
                { type: "q", text: question },
                { type: "a", text: res.data.answer },
            ]);
            setQuestion("");
        } catch (err) {
            setChat((prev) => [
                ...prev,
                { type: "q", text: question },
                { type: "a", text: "No answer found." },
            ]);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
                .d1 { animation-delay: 0.07s; }
                .d2 { animation-delay: 0.14s; }
                .d3 { animation-delay: 0.21s; }
                .d4 { animation-delay: 0.28s; }
                .d5 { animation-delay: 0.35s; }

                .career-select option {
                    background: #141418;
                    color: #f0ede8;
                    font-size: 13px;
                }
                .career-select option:checked {
                    background: #1e1e26;
                    color: #E8FF47;
                }
            `}</style>

            {/* ── Page header ── */}
            <div className="fade-up" style={{ marginBottom: 4 }}>
                <p style={{ fontSize: 10, color: t.lime, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                    Resume Intelligence
                </p>
                <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "clamp(24px,3vw,36px)", letterSpacing: "-0.035em", color: t.text, margin: "0 0 6px", lineHeight: 1.05 }}>
                    Career <em style={{ fontStyle: "italic", color: t.lime }}>Advisor</em>
                </h1>
                <p style={{ fontSize: 13, color: t.muted, margin: 0 }}>
                    Explore career paths, compare roles, and get AI-powered guidance.
                </p>
            </div>

            {/* ── Controls row ── */}
            <div className="fade-up d1" style={{
                display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
                padding: "16px 20px", borderRadius: 16,
                background: t.surface, border: `1px solid ${t.border}`,
            }}>
                <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
                    <select
                        className="career-select"
                        style={selectStyle}
                        value={selected}
                        onChange={(e) => setSelected(e.target.value)}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(232,255,71,0.45)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = t.border; }}
                    >
                        <option value="">Select Career</option>
                        {categories.map((c, i) => <option key={i}>{c}</option>)}
                    </select>
                </div>

                <div style={{ fontSize: 11, color: t.faint, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>vs</div>

                <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
                    <select
                        className="career-select"
                        style={selectStyle}
                        value={compare}
                        onChange={(e) => setCompare(e.target.value)}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(134,239,172,0.45)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = t.border; }}
                    >
                        <option value="">Compare With</option>
                        {categories.map((c, i) => <option key={i}>{c}</option>)}
                    </select>
                </div>

                <button
                    onClick={handleSelect}
                    style={{
                        padding: "9px 22px", borderRadius: 12, fontSize: 13, fontWeight: 700,
                        fontFamily: "'DM Sans', sans-serif",
                        background: t.lime, color: "#0a0a0e", border: "none", cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(232,255,71,0.2), 0 0 0 1px rgba(232,255,71,0.15)",
                        transition: "all 0.15s", flexShrink: 0,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f5ff6e"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = t.lime; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                    Load →
                </button>
            </div>

            {/* ── Career cards ── */}
            {(data || compareData) && (
                <div className="fade-up d2" style={{ display: "grid", gridTemplateColumns: compareData ? "1fr 1fr" : "1fr", gap: 14 }}>
                    {data && <CareerCard data={data} name={selected} accentColor={t.lime} />}
                    {compareData && <CareerCard data={compareData} name={compare} accentColor={t.green} />}
                </div>
            )}

            {/* ── AI Chat ── */}
            <div className="fade-up d3" style={{ borderRadius: 20, overflow: "hidden", background: t.surface, border: `1px solid ${t.border}` }}>

                {/* Chat header */}
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(232,255,71,0.08)", border: "1px solid rgba(232,255,71,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🤖</div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", color: t.text }}>Career AI</div>
                        <div style={{ fontSize: 11, color: t.faint }}>Ask anything about your career</div>
                    </div>
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: t.green }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.green, boxShadow: `0 0 6px ${t.green}`, display: "inline-block" }} />
                        Online
                    </div>
                </div>

                {/* Messages */}
                <div style={{ height: 240, overflowY: "auto", padding: "14px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                    {chat.length === 0 && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 6 }}>
                            <span style={{ fontSize: 28 }}>💬</span>
                            <p style={{ fontSize: 12, color: t.faint, textAlign: "center" }}>Select a career and ask me anything about it.</p>
                        </div>
                    )}
                    {chat.map((msg, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: msg.type === "q" ? "flex-end" : "flex-start" }}>
                            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: t.faint }}>
                                {msg.type === "q" ? "You" : "Career AI"}
                            </span>
                            <div style={{
                                maxWidth: "78%", padding: "9px 13px", borderRadius: msg.type === "q" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                                fontSize: 13, lineHeight: 1.6,
                                background: msg.type === "q" ? "rgba(232,255,71,0.1)" : t.surface2,
                                border: msg.type === "q" ? "1px solid rgba(232,255,71,0.2)" : `1px solid ${t.border}`,
                                color: msg.type === "q" ? t.lime : t.muted,
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input row */}
                <div style={{ padding: "12px 16px", borderTop: `1px solid ${t.border}`, display: "flex", gap: 8 }}>
                    <input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAsk(); }}
                        placeholder="Ask about this career…"
                        style={{
                            flex: 1, padding: "10px 14px", borderRadius: 12, fontSize: 13,
                            background: t.surface2, border: `1px solid ${t.border}`,
                            color: t.text, fontFamily: "'DM Sans', sans-serif", outline: "none",
                            transition: "border-color 0.15s",
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(232,255,71,0.4)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = t.border; }}
                    />
                    <button
                        onClick={handleAsk}
                        style={{
                            padding: "10px 20px", borderRadius: 12, fontSize: 13, fontWeight: 700,
                            fontFamily: "'DM Sans', sans-serif",
                            background: t.lime, color: "#0a0a0e", border: "none", cursor: "pointer",
                            boxShadow: "0 4px 16px rgba(232,255,71,0.2)",
                            transition: "all 0.15s", flexShrink: 0,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#f5ff6e"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = t.lime; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                        Ask
                    </button>
                </div>
            </div>
        </div>
    );
}