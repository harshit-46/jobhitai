import { useState, useEffect, useRef } from "react";
import api from "../api/axios";

// ── Design tokens (matching existing CareerAdvisor) ─────────────────────────
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
};

const API_BASE = import.meta.env.VITE_API_URL || "";

// ── Suggestion chips per intent hint ────────────────────────────────────────
const SUGGESTIONS = [
    "How do I get started in this field?",
    "What's the salary range in India?",
    "What skills should I learn first?",
    "How do I prepare for interviews?",
    "Tips for freshers with no experience?",
];

// ── Markdown-like renderer for AI responses ──────────────────────────────────
function FormattedMessage({ text }) {
    const lines = text.split("\n");
    const elements = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Skip empty lines
        if (!line.trim()) { i++; continue; }

        // Heading: **text** alone on a line
        if (/^\*\*(.+)\*\*$/.test(line.trim())) {
            const content = line.trim().replace(/^\*\*|\*\*$/g, "");
            elements.push(
                <p key={i} style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: "10px 0 4px", letterSpacing: "-0.01em" }}>
                    {content}
                </p>
            );
            i++; continue;
        }

        // Numbered list item: "1. text"
        if (/^\d+\.\s/.test(line)) {
            const listItems = [];
            while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
                const content = lines[i].replace(/^\d+\.\s/, "");
                listItems.push(
                    <li key={i} style={{ fontSize: 13, color: t.muted, lineHeight: 1.65, marginBottom: 4, paddingLeft: 4 }}>
                        <InlineFormatted text={content} />
                    </li>
                );
                i++;
            }
            elements.push(
                <ol key={`ol-${i}`} style={{ margin: "6px 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 2 }}>
                    {listItems}
                </ol>
            );
            continue;
        }

        // Bullet list: "- text" or "• text"
        if (/^[-•]\s/.test(line.trim())) {
            const listItems = [];
            while (i < lines.length && /^[-•]\s/.test(lines[i].trim())) {
                const content = lines[i].trim().replace(/^[-•]\s/, "");
                listItems.push(
                    <li key={i} style={{ fontSize: 13, color: t.muted, lineHeight: 1.65, marginBottom: 3, listStyle: "none", display: "flex", alignItems: "flex-start", gap: 7 }}>
                        <span style={{ color: t.lime, flexShrink: 0, marginTop: 2, fontSize: 10 }}>›</span>
                        <InlineFormatted text={content} />
                    </li>
                );
                i++;
            }
            elements.push(
                <ul key={`ul-${i}`} style={{ margin: "6px 0", padding: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                    {listItems}
                </ul>
            );
            continue;
        }

        // Regular paragraph
        elements.push(
            <p key={i} style={{ fontSize: 13, color: t.muted, lineHeight: 1.65, margin: "4px 0" }}>
                <InlineFormatted text={line} />
            </p>
        );
        i++;
    }

    return <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>{elements}</div>;
}

// Inline bold/code formatting
function InlineFormatted({ text }) {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return (
        <>
            {parts.map((part, i) => {
                if (/^\*\*[^*]+\*\*$/.test(part)) {
                    return <strong key={i} style={{ color: t.text, fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
                }
                if (/^`[^`]+`$/.test(part)) {
                    return (
                        <code key={i} style={{
                            background: "rgba(232,255,71,0.08)", border: "1px solid rgba(232,255,71,0.15)",
                            borderRadius: 5, padding: "1px 6px", fontSize: 12,
                            color: t.lime, fontFamily: "monospace",
                        }}>{part.slice(1, -1)}</code>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </>
    );
}

// ── Typing dots ──────────────────────────────────────────────────────────────
function TypingDots() {
    return (
        <div style={{ display: "flex", gap: 4, padding: "4px 2px", alignItems: "center" }}>
            {[0, 1, 2].map(i => (
                <span key={i} style={{
                    width: 6, height: 6, borderRadius: "50%", background: t.lime,
                    display: "inline-block", opacity: 0.4,
                    animation: `dotBounce 1.2s ${i * 0.2}s infinite`,
                }} />
            ))}
        </div>
    );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function CareerAdvisorChat() {
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState("");
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [streaming, setStreaming] = useState(false);
    const [streamingText, setStreamingText] = useState("");
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        api.get("/career/categories")
            .then(res => setCategories(res.data.categories))
            .catch(console.error);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamingText]);

    const autoResizeTextarea = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 120) + "px";
    };

    const sendMessage = async (text) => {
        const q = (text || input).trim();
        if (!q || streaming) return;

        setInput("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";

        // Append user message
        setMessages(prev => [...prev, { role: "user", content: q }]);
        setStreaming(true);
        setStreamingText("");

        try {
            // Use fetch directly for streaming support
            const res = await fetch(`${API_BASE}/career/ask`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ question: q, career: selected || "General" }),
            });

            if (!res.ok) throw new Error("API error");

            const contentType = res.headers.get("content-type") || "";

            // ── Streaming response (text/event-stream) ──
            if (contentType.includes("text/event-stream")) {
                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                let accumulated = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split("\n");
                    for (const line of lines) {
                        if (line.startsWith("data: ")) {
                            const data = line.slice(6).trim();
                            if (data === "[DONE]") break;
                            try {
                                const parsed = JSON.parse(data);
                                const delta = parsed.choices?.[0]?.delta?.content || "";
                                accumulated += delta;
                                setStreamingText(accumulated);
                            } catch {}
                        }
                    }
                }
                setMessages(prev => [...prev, { role: "assistant", content: accumulated }]);
            } else {
                // ── Non-streaming fallback (current backend returns JSON) ──
                const data = await res.json();
                const answer = data.answer || "No answer found.";

                // Simulate streaming for better UX
                let i = 0;
                const interval = setInterval(() => {
                    i += 3;
                    setStreamingText(answer.slice(0, i));
                    if (i >= answer.length) {
                        clearInterval(interval);
                        setMessages(prev => [...prev, { role: "assistant", content: answer }]);
                        setStreamingText("");
                        setStreaming(false);
                    }
                }, 8);
                return; // early return — streaming flag handled in interval
            }

        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Something went wrong. Please try again.",
            }]);
        }

        setStreamingText("");
        setStreaming(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => setMessages([]);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "'DM Sans', sans-serif", gap: 0 }}>
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes dotBounce {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30%           { transform: translateY(-5px); opacity: 1; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50%      { opacity: 0.4; }
                }
                .fade-up { animation: fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }
                .d1 { animation-delay: 0.06s; }
                .d2 { animation-delay: 0.12s; }
                .chat-scroll::-webkit-scrollbar { width: 4px; }
                .chat-scroll::-webkit-scrollbar-track { background: transparent; }
                .chat-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
                .send-btn:hover { background: #f5ff6e !important; transform: translateY(-1px); }
                .send-btn:active { transform: translateY(0); }
                .send-btn:disabled { opacity: 0.35 !important; cursor: not-allowed; transform: none !important; }
                .chip-btn:hover { border-color: rgba(232,255,71,0.4) !important; color: ${t.lime} !important; background: rgba(232,255,71,0.05) !important; }
                .clear-btn:hover { border-color: rgba(249,168,212,0.4) !important; color: ${t.pink} !important; }
                .career-select option { background: #141418; color: #f0ede8; }
                .career-select option:checked { background: #1e1e26; color: #E8FF47; }
                textarea { scrollbar-width: none; }
                textarea::-webkit-scrollbar { display: none; }
            `}</style>

            {/* ── Page header ─────────────────────────────────────────────── */}
            <div className="fade-up" style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 10, color: t.lime, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>
                    Career Intelligence
                </p>
                <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "clamp(24px,3vw,36px)", letterSpacing: "-0.035em", color: t.text, margin: "0 0 6px", lineHeight: 1.05 }}>
                    AI Career <em style={{ fontStyle: "italic", color: t.lime }}>Assistant</em>
                </h1>
                <p style={{ fontSize: 13, color: t.muted, margin: 0 }}>
                    Ask anything about careers, roadmaps, salaries, and interview prep.
                </p>
            </div>

            {/* ── Chat container ───────────────────────────────────────────── */}
            <div className="fade-up d1" style={{
                flex: 1, display: "flex", flexDirection: "column",
                borderRadius: 20, overflow: "hidden",
                background: t.surface, border: `1px solid ${t.border}`,
                minHeight: 0,
            }}>

                {/* Chat header */}
                <div style={{
                    padding: "13px 18px",
                    borderBottom: `1px solid ${t.border}`,
                    display: "flex", alignItems: "center", gap: 10,
                    background: "rgba(255,255,255,0.015)",
                    flexShrink: 0,
                }}>
                    {/* Bot avatar */}
                    <div style={{
                        width: 32, height: 32, borderRadius: 10,
                        background: "rgba(232,255,71,0.08)",
                        border: "1px solid rgba(232,255,71,0.18)",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                    }}>🤖</div>

                    <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: t.text, letterSpacing: "-0.01em" }}>Career AI</div>
                        <div style={{ fontSize: 11, color: t.faint }}>Powered by Llama 3.3 · Indian job market specialist</div>
                    </div>

                    {/* Status + career selector */}
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                        {/* Career dropdown */}
                        <select
                            className="career-select"
                            value={selected}
                            onChange={e => setSelected(e.target.value)}
                            style={{
                                padding: "6px 12px", borderRadius: 9,
                                background: "#141418", border: `1px solid ${t.border}`,
                                color: selected ? t.text : t.faint,
                                fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                                outline: "none", cursor: "pointer",
                                appearance: "none", WebkitAppearance: "none",
                                minWidth: 140,
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = "rgba(232,255,71,0.4)"}
                            onBlur={e => e.currentTarget.style.borderColor = t.border}
                        >
                            <option value="">All Careers</option>
                            {categories.map((c, i) => <option key={i}>{c}</option>)}
                        </select>

                        {/* Online dot */}
                        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: t.green, flexShrink: 0 }}>
                            <span style={{
                                width: 6, height: 6, borderRadius: "50%",
                                background: t.green, display: "inline-block",
                                boxShadow: `0 0 6px ${t.green}`,
                                animation: "pulse 2.5s infinite",
                            }} />
                            Online
                        </div>

                        {/* Clear button */}
                        {messages.length > 0 && (
                            <button
                                className="clear-btn"
                                onClick={clearChat}
                                style={{
                                    padding: "5px 10px", borderRadius: 8, fontSize: 11,
                                    background: "none", border: `1px solid ${t.border}`,
                                    color: t.faint, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                                    transition: "all 0.15s",
                                }}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Messages area ────────────────────────────────────────── */}
                <div
                    className="chat-scroll"
                    style={{
                        flex: 1, overflowY: "auto",
                        padding: "18px 20px",
                        display: "flex", flexDirection: "column", gap: 14,
                        minHeight: 360, maxHeight: "calc(100vh - 320px)",
                    }}
                >
                    {/* Empty state */}
                    {messages.length === 0 && !streaming && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 16, padding: "40px 0" }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: 16,
                                background: "rgba(232,255,71,0.06)",
                                border: "1px solid rgba(232,255,71,0.14)",
                                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                            }}>🧭</div>
                            <div style={{ textAlign: "center" }}>
                                <p style={{ fontSize: 14, fontWeight: 600, color: t.text, margin: "0 0 5px", fontFamily: "'Fraunces', serif" }}>
                                    What do you want to know?
                                </p>
                                <p style={{ fontSize: 12, color: t.faint, margin: 0 }}>
                                    Ask about any career, skill, salary, or roadmap.
                                </p>
                            </div>

                            {/* Suggestion chips */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", maxWidth: 480 }}>
                                {SUGGESTIONS.map((s, i) => (
                                    <button
                                        key={i}
                                        className="chip-btn"
                                        onClick={() => sendMessage(s)}
                                        style={{
                                            padding: "6px 13px", borderRadius: 999,
                                            background: t.surface2, border: `1px solid ${t.border2}`,
                                            color: t.muted, fontSize: 12,
                                            fontFamily: "'DM Sans', sans-serif",
                                            cursor: "pointer", transition: "all 0.15s",
                                        }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Message list */}
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex", flexDirection: "column", gap: 4,
                                alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                                animation: "fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both",
                            }}
                        >
                            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em", color: t.faint, paddingInline: 4 }}>
                                {msg.role === "user" ? "You" : "Career AI"}
                            </span>
                            <div style={{
                                maxWidth: "82%",
                                padding: msg.role === "user" ? "9px 14px" : "12px 16px",
                                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                background: msg.role === "user" ? "rgba(232,255,71,0.08)" : t.surface2,
                                border: msg.role === "user" ? "1px solid rgba(232,255,71,0.18)" : `1px solid ${t.border}`,
                            }}>
                                {msg.role === "user" ? (
                                    <p style={{ fontSize: 13, color: t.lime, margin: 0, lineHeight: 1.6 }}>{msg.content}</p>
                                ) : (
                                    <FormattedMessage text={msg.content} />
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Streaming message */}
                    {streaming && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
                            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em", color: t.faint, paddingInline: 4 }}>
                                Career AI
                            </span>
                            <div style={{
                                maxWidth: "82%",
                                padding: "12px 16px",
                                borderRadius: "16px 16px 16px 4px",
                                background: t.surface2,
                                border: `1px solid ${t.border}`,
                            }}>
                                {streamingText
                                    ? <FormattedMessage text={streamingText} />
                                    : <TypingDots />
                                }
                                {/* Blinking cursor */}
                                {streamingText && (
                                    <span style={{
                                        display: "inline-block", width: 2, height: 13,
                                        background: t.lime, marginLeft: 2, verticalAlign: "middle",
                                        animation: "pulse 0.8s infinite",
                                        borderRadius: 1,
                                    }} />
                                )}
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* ── Input area ───────────────────────────────────────────── */}
                <div style={{
                    padding: "12px 16px",
                    borderTop: `1px solid ${t.border}`,
                    background: "rgba(255,255,255,0.015)",
                    display: "flex", gap: 8, alignItems: "flex-end",
                    flexShrink: 0,
                }}>
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={e => { setInput(e.target.value); autoResizeTextarea(); }}
                        onKeyDown={handleKeyDown}
                        placeholder={selected ? `Ask about ${selected}…` : "Ask anything about your career…"}
                        rows={1}
                        style={{
                            flex: 1, padding: "10px 14px",
                            borderRadius: 13, fontSize: 13,
                            background: t.surface2,
                            border: `1px solid ${t.border}`,
                            color: t.text, fontFamily: "'DM Sans', sans-serif",
                            outline: "none", resize: "none",
                            lineHeight: 1.55, minHeight: 40,
                            transition: "border-color 0.15s",
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = "rgba(232,255,71,0.38)"}
                        onBlur={e => e.currentTarget.style.borderColor = t.border}
                    />
                    <button
                        className="send-btn"
                        onClick={() => sendMessage()}
                        disabled={streaming || !input.trim()}
                        style={{
                            padding: "10px 20px", borderRadius: 13,
                            fontSize: 13, fontWeight: 700,
                            fontFamily: "'DM Sans', sans-serif",
                            background: t.lime, color: "#0a0a0e",
                            border: "none", cursor: "pointer",
                            boxShadow: "0 4px 16px rgba(232,255,71,0.2)",
                            transition: "all 0.15s", flexShrink: 0, alignSelf: "flex-end",
                        }}
                    >
                        Ask →
                    </button>
                </div>
            </div>

            {/* ── Helper note ──────────────────────────────────────────────── */}
            <p className="fade-up d2" style={{ fontSize: 11, color: t.faint, textAlign: "center", marginTop: 10 }}>
                Select a career from the dropdown to get focused answers · Press <kbd style={{ background: t.surface3, border: `1px solid ${t.border2}`, borderRadius: 4, padding: "1px 5px", fontSize: 10, color: t.muted }}>Enter</kbd> to send · <kbd style={{ background: t.surface3, border: `1px solid ${t.border2}`, borderRadius: 4, padding: "1px 5px", fontSize: 10, color: t.muted }}>Shift+Enter</kbd> for new line
            </p>
        </div>
    );
}