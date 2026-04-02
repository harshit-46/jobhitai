/*

// LWF

import { useState } from "react";
import { useResume } from "../ResumeContext";
import { enhanceBulletWithAI } from "../../../api/resume";

const emptyExp = () => ({
    id: Date.now(),
    company: "",
    role: "",
    location: "",
    start: "",
    end: "",
    current: false,
    bullets: [""],
});

export default function ExperienceStep() {
    const { resume, updateExperience } = useResume();
    const [experiences, setExperiences] = useState(resume.experience.length ? resume.experience : []);
    const [enhancing, setEnhancing] = useState({});

    const sync = (updated) => {
        setExperiences(updated);
        updateExperience(updated);
    };

    const addExp = () => sync([...experiences, emptyExp()]);

    const removeExp = (id) => sync(experiences.filter((e) => e.id !== id));

    const updateField = (id, field, value) => {
        sync(experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
    };

    const updateBullet = (id, idx, value) => {
        sync(
            experiences.map((e) =>
                e.id === id
                    ? { ...e, bullets: e.bullets.map((b, i) => (i === idx ? value : b)) }
                    : e
            )
        );
    };

    const addBullet = (id) => {
        sync(experiences.map((e) => (e.id === id ? { ...e, bullets: [...e.bullets, ""] } : e)));
    };

    const removeBullet = (id, idx) => {
        sync(
            experiences.map((e) =>
                e.id === id ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) } : e
            )
        );
    };

    const handleEnhanceBullet = async (expId, idx, text) => {
        if (!text.trim()) return;
        const key = `${expId}-${idx}`;
        setEnhancing((prev) => ({ ...prev, [key]: true }));
        try {
            const enhanced = await enhanceBulletWithAI(text);
            updateBullet(expId, idx, enhanced);
        } catch {
            alert("AI enhancement failed.");
        } finally {
            setEnhancing((prev) => ({ ...prev, [key]: false }));
        }
    };

    return (
        <div>
            {experiences.length === 0 && (
                <div className="border border-dashed border-white/10 rounded-2xl p-8 text-center mb-6">
                    <div className="text-3xl mb-3">💼</div>
                    <p className="text-white/30 text-sm mb-4">No experience added yet</p>
                    <button onClick={addExp} className="text-sm px-4 py-2 rounded-lg bg-[#00e5a0]/10 border border-[#00e5a0]/20 text-[#00e5a0] hover:bg-[#00e5a0]/15 transition-all">
                        + Add Experience
                    </button>
                </div>
            )}

            {experiences.map((exp, expIdx) => (
                <div key={exp.id} className="mb-6 border border-white/8 rounded-2xl p-5 bg-white/2 relative">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-white/20 uppercase tracking-widest">
                            Experience #{expIdx + 1}
                        </span>
                        <button
                            onClick={() => removeExp(exp.id)}
                            className="text-xs text-red-400/50 hover:text-red-400 transition-colors"
                        >
                            ✕ Remove
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4">
                        {[
                            ["Company Name", "company", "Acme Corp"],
                            ["Job Title / Role", "role", "Software Engineer"],
                            ["Location", "location", "Bangalore, India"],
                        ].map(([label, field, placeholder]) => (
                            <div key={field} className={`mb-4 ${field === "location" ? "col-span-2" : ""}`}>
                                <label className="block text-xs font-semibold uppercase tracking-widest text-white/25 mb-1.5">
                                    {label}
                                </label>
                                <input
                                    type="text"
                                    value={exp[field]}
                                    onChange={(e) => updateField(exp.id, field, e.target.value)}
                                    placeholder={placeholder}
                                    className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/15 focus:outline-none focus:border-[#00e5a0]/40 transition-all"
                                />
                            </div>
                        ))}

                        <div className="mb-4">
                            <label className="block text-xs font-semibold uppercase tracking-widest text-white/25 mb-1.5">Start Date</label>
                            <input
                                type="month"
                                value={exp.start}
                                onChange={(e) => updateField(exp.id, "start", e.target.value)}
                                className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e5a0]/40 transition-all"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-semibold uppercase tracking-widest text-white/25 mb-1.5">End Date</label>
                            <input
                                type="month"
                                value={exp.end}
                                disabled={exp.current}
                                onChange={(e) => updateField(exp.id, "end", e.target.value)}
                                className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e5a0]/40 disabled:opacity-30 transition-all"
                            />
                            <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={exp.current}
                                    onChange={(e) => updateField(exp.id, "current", e.target.checked)}
                                    className="accent-[#00e5a0]"
                                />
                                <span className="text-xs text-white/30">Currently working here</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-white/25 mb-3">
                            Key Achievements / Responsibilities
                        </label>
                        {exp.bullets.map((bullet, idx) => (
                            <div key={idx} className="flex gap-2 mb-2 items-start">
                                <span className="text-[#00e5a0]/40 mt-3 text-xs shrink-0">▸</span>
                                <input
                                    type="text"
                                    value={bullet}
                                    onChange={(e) => updateBullet(exp.id, idx, e.target.value)}
                                    placeholder="Improved API response time by 40% using Redis caching..."
                                    className="flex-1 bg-white/3 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/15 focus:outline-none focus:border-[#00e5a0]/40 transition-all"
                                />
                                <button
                                    onClick={() => handleEnhanceBullet(exp.id, idx, bullet)}
                                    disabled={enhancing[`${exp.id}-${idx}`]}
                                    title="AI Enhance"
                                    className="shrink-0 mt-1 px-2.5 py-2 rounded-lg text-xs bg-[#00e5a0]/8 border border-[#00e5a0]/15 text-[#00e5a0]/70 hover:text-[#00e5a0] hover:bg-[#00e5a0]/12 transition-all disabled:opacity-40"
                                >
                                    {enhancing[`${exp.id}-${idx}`] ? "..." : "✨"}
                                </button>
                                {exp.bullets.length > 1 && (
                                    <button
                                        onClick={() => removeBullet(exp.id, idx)}
                                        className="shrink-0 mt-1 px-2.5 py-2 rounded-lg text-xs text-red-400/40 hover:text-red-400 transition-colors"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={() => addBullet(exp.id)}
                            className="text-xs text-white/25 hover:text-white/50 transition-colors mt-1 ml-5"
                        >
                            + Add bullet point
                        </button>
                    </div>
                </div>
            ))}

            {experiences.length > 0 && (
                <button
                    onClick={addExp}
                    className="w-full py-3 rounded-xl border border-dashed border-white/10 text-sm text-white/30 hover:text-white/60 hover:border-white/20 transition-all"
                >
                    + Add Another Experience
                </button>
            )}
        </div>
    );
}

*/





import { useState } from "react";
import { useResume } from "../ResumeContext";
import { enhanceBulletWithAI } from "../../../api/resume";

const inp = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "10px 16px",
    fontSize: 13,
    color: "#f0ede8",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.15s, background 0.15s",
};

const lbl = {
    display: "block",
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "rgba(240,237,232,0.35)",
    marginBottom: 6,
};

const focusIn  = e => { e.target.style.borderColor = "rgba(232,255,71,0.35)"; e.target.style.background = "rgba(255,255,255,0.05)"; };
const focusOut = e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.03)"; };

const emptyExp = () => ({
    id: Date.now(),
    company: "",
    role: "",
    location: "",
    start: "",
    end: "",
    current: false,
    bullets: [""],
});

export default function ExperienceStep() {
    const { resume, updateExperience } = useResume();
    const [experiences, setExperiences] = useState(resume.experience.length ? resume.experience : []);
    const [enhancing, setEnhancing] = useState({});

    const sync = (updated) => {
        setExperiences(updated);
        updateExperience(updated);
    };

    const addExp    = () => sync([...experiences, emptyExp()]);
    const removeExp = (id) => sync(experiences.filter((e) => e.id !== id));
    const updateField = (id, field, value) =>
        sync(experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
    const updateBullet = (id, idx, value) =>
        sync(experiences.map((e) =>
            e.id === id ? { ...e, bullets: e.bullets.map((b, i) => (i === idx ? value : b)) } : e
        ));
    const addBullet = (id) =>
        sync(experiences.map((e) => (e.id === id ? { ...e, bullets: [...e.bullets, ""] } : e)));
    const removeBullet = (id, idx) =>
        sync(experiences.map((e) =>
            e.id === id ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) } : e
        ));

    const handleEnhanceBullet = async (expId, idx, text) => {
        if (!text.trim()) return;
        const key = `${expId}-${idx}`;
        setEnhancing((prev) => ({ ...prev, [key]: true }));
        try {
            const enhanced = await enhanceBulletWithAI(text);
            updateBullet(expId, idx, enhanced);
        } catch {
            alert("AI enhancement failed.");
        } finally {
            setEnhancing((prev) => ({ ...prev, [key]: false }));
        }
    };

    return (
        <div>
            {experiences.length === 0 && (
                <div style={{
                    border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 16,
                    padding: "48px 24px", textAlign: "center", marginBottom: 24,
                }}>
                    <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>◉</div>
                    <p style={{ color: "rgba(240,237,232,0.3)", fontSize: 13, marginBottom: 20 }}>No experience added yet</p>
                    <button onClick={addExp} style={{
                        fontSize: 12, padding: "8px 18px", borderRadius: 10,
                        background: "rgba(232,255,71,0.08)", border: "1px solid rgba(232,255,71,0.2)",
                        color: "#E8FF47", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                        transition: "all 0.15s",
                    }}>
                        + Add Experience
                    </button>
                </div>
            )}

            {experiences.map((exp, expIdx) => (
                <div key={exp.id} style={{
                    marginBottom: 24, border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16, padding: 20, background: "rgba(255,255,255,0.02)",
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(240,237,232,0.25)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Experience #{expIdx + 1}
                        </span>
                        <button onClick={() => removeExp(exp.id)} style={{
                            fontSize: 11, color: "rgba(249,168,212,0.5)", background: "none",
                            border: "none", cursor: "pointer", transition: "color 0.15s", fontFamily: "'DM Sans', sans-serif",
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = "#f9a8d4"}
                            onMouseLeave={e => e.currentTarget.style.color = "rgba(249,168,212,0.5)"}
                        >
                            ✕ Remove
                        </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                        {[
                            ["Company Name",     "company",  "Acme Corp"],
                            ["Job Title / Role", "role",     "Software Engineer"],
                        ].map(([label, field, placeholder]) => (
                            <div key={field} style={{ marginBottom: 16 }}>
                                <label style={lbl}>{label}</label>
                                <input type="text" value={exp[field]} onChange={e => updateField(exp.id, field, e.target.value)}
                                    placeholder={placeholder} style={inp} onFocus={focusIn} onBlur={focusOut} />
                            </div>
                        ))}
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label style={lbl}>Location</label>
                        <input type="text" value={exp.location} onChange={e => updateField(exp.id, "location", e.target.value)}
                            placeholder="Bangalore, India" style={inp} onFocus={focusIn} onBlur={focusOut} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px", marginBottom: 16 }}>
                        <div>
                            <label style={lbl}>Start Date</label>
                            <input type="month" value={exp.start} onChange={e => updateField(exp.id, "start", e.target.value)}
                                style={inp} onFocus={focusIn} onBlur={focusOut} />
                        </div>
                        <div>
                            <label style={lbl}>End Date</label>
                            <input type="month" value={exp.end} disabled={exp.current}
                                onChange={e => updateField(exp.id, "end", e.target.value)}
                                style={{ ...inp, opacity: exp.current ? 0.3 : 1 }} onFocus={focusIn} onBlur={focusOut} />
                            <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, cursor: "pointer" }}>
                                <input type="checkbox" checked={exp.current}
                                    onChange={e => updateField(exp.id, "current", e.target.checked)}
                                    style={{ accentColor: "#E8FF47" }} />
                                <span style={{ fontSize: 11, color: "rgba(240,237,232,0.3)" }}>Currently working here</span>
                            </label>
                        </div>
                    </div>

                    {/* Bullets */}
                    <div>
                        <label style={{ ...lbl, marginBottom: 12 }}>Key Achievements / Responsibilities</label>
                        {exp.bullets.map((bullet, idx) => (
                            <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                                <span style={{ color: "rgba(232,255,71,0.4)", marginTop: 12, fontSize: 10, flexShrink: 0 }}>▸</span>
                                <input
                                    type="text" value={bullet}
                                    onChange={e => updateBullet(exp.id, idx, e.target.value)}
                                    placeholder="Improved API response time by 40% using Redis caching..."
                                    style={{ ...inp, flex: 1 }} onFocus={focusIn} onBlur={focusOut}
                                />
                                <button
                                    onClick={() => handleEnhanceBullet(exp.id, idx, bullet)}
                                    disabled={enhancing[`${exp.id}-${idx}`]}
                                    title="AI Enhance"
                                    style={{
                                        flexShrink: 0, marginTop: 2, padding: "8px 10px", borderRadius: 8,
                                        fontSize: 11, background: "rgba(232,255,71,0.07)",
                                        border: "1px solid rgba(232,255,71,0.15)", color: "rgba(232,255,71,0.7)",
                                        cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
                                        opacity: enhancing[`${exp.id}-${idx}`] ? 0.5 : 1,
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.color = "#E8FF47"; e.currentTarget.style.background = "rgba(232,255,71,0.12)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(232,255,71,0.7)"; e.currentTarget.style.background = "rgba(232,255,71,0.07)"; }}
                                >
                                    {enhancing[`${exp.id}-${idx}`] ? "…" : "✦"}
                                </button>
                                {exp.bullets.length > 1 && (
                                    <button onClick={() => removeBullet(exp.id, idx)} style={{
                                        flexShrink: 0, marginTop: 2, padding: "8px 10px", borderRadius: 8,
                                        fontSize: 11, color: "rgba(249,168,212,0.4)", background: "none",
                                        border: "none", cursor: "pointer", transition: "color 0.15s",
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.color = "#f9a8d4"}
                                        onMouseLeave={e => e.currentTarget.style.color = "rgba(249,168,212,0.4)"}
                                    >✕</button>
                                )}
                            </div>
                        ))}
                        <button onClick={() => addBullet(exp.id)} style={{
                            fontSize: 11, color: "rgba(240,237,232,0.25)", background: "none",
                            border: "none", cursor: "pointer", marginLeft: 20, marginTop: 4,
                            fontFamily: "'DM Sans', sans-serif", transition: "color 0.15s",
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = "rgba(240,237,232,0.6)"}
                            onMouseLeave={e => e.currentTarget.style.color = "rgba(240,237,232,0.25)"}
                        >
                            + Add bullet point
                        </button>
                    </div>
                </div>
            ))}

            {experiences.length > 0 && (
                <button onClick={addExp} style={{
                    width: "100%", padding: "12px", borderRadius: 12,
                    border: "1px dashed rgba(255,255,255,0.1)", fontSize: 13,
                    color: "rgba(240,237,232,0.3)", background: "transparent",
                    cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
                }}
                    onMouseEnter={e => { e.currentTarget.style.color = "rgba(240,237,232,0.7)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(240,237,232,0.3)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                    + Add Another Experience
                </button>
            )}
        </div>
    );
}