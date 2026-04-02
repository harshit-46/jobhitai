/*

// LWF

import { useState } from "react";
import { useResume } from "../ResumeContext";

function TagInput({ label, tags, onAdd, onRemove, placeholder }) {
    const [input, setInput] = useState("");

    const handleKeyDown = (e) => {
        if ((e.key === "Enter" || e.key === ",") && input.trim()) {
            e.preventDefault();
            onAdd(input.trim());
            setInput("");
        }
        if (e.key === "Backspace" && !input && tags.length > 0) {
            onRemove(tags[tags.length - 1]);
        }
    };

    return (
        <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">{label}</label>
            <div className="min-h-13 bg-white/3 border border-white/8 rounded-xl px-3 py-2 flex flex-wrap gap-2 items-center focus-within:border-[#00e5a0]/40 transition-all">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00e5a0]/10 border border-[#00e5a0]/20 text-[#00e5a0] text-xs font-medium"
                    >
                        {tag}
                        <button onClick={() => onRemove(tag)} className="text-[#00e5a0]/50 hover:text-[#00e5a0] leading-none">×</button>
                    </span>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : ""}
                    className="flex-1 min-w-30 bg-transparent text-sm text-white placeholder-white/15 focus:outline-none"
                />
            </div>
            <p className="text-xs text-white/20 mt-1.5">Press Enter or comma to add</p>
        </div>
    );
}

const SUGGESTED_TECH = [
    "Python", "JavaScript", "TypeScript", "React", "Next.js",
    "FastAPI", "Node.js", "MongoDB", "PostgreSQL", "Redis",
    "Docker", "Git", "AWS", "Tailwind CSS", "REST APIs",
];

export default function SkillsStep() {
    const { resume, updateSkills } = useResume();
    const [skills, setSkills] = useState(resume.skills);

    const sync = (updated) => {
        setSkills(updated);
        updateSkills(updated);
    };

    const addTech = (skill) => {
        if (!skills.technical.includes(skill)) {
            sync({ ...skills, technical: [...skills.technical, skill] });
        }
    };

    const removeTech = (skill) =>
        sync({ ...skills, technical: skills.technical.filter((s) => s !== skill) });

    const addSoft = (skill) => {
        if (!skills.soft.includes(skill)) {
            sync({ ...skills, soft: [...skills.soft, skill] });
        }
    };

    const removeSoft = (skill) =>
        sync({ ...skills, soft: skills.soft.filter((s) => s !== skill) });

    return (
        <div>
            <TagInput
                label="Technical Skills"
                tags={skills.technical}
                onAdd={addTech}
                onRemove={removeTech}
                placeholder="Type a skill and press Enter..."
            />

            <div className="mb-6">
                <p className="text-xs text-white/20 uppercase tracking-widest mb-2 font-semibold">Quick Add</p>
                <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TECH.filter((s) => !skills.technical.includes(s)).map((s) => (
                        <button
                            key={s}
                            onClick={() => addTech(s)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-white/8 text-white/30 hover:text-white/70 hover:border-white/20 transition-all"
                        >
                            + {s}
                        </button>
                    ))}
                </div>
            </div>

            <TagInput
                label="Soft Skills"
                tags={skills.soft}
                onAdd={addSoft}
                onRemove={removeSoft}
                placeholder="Leadership, Communication, Problem Solving..."
            />
        </div>
    );
}

*/


import { useState } from "react";
import { useResume } from "../ResumeContext";

const lbl = {
    display: "block",
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "rgba(240,237,232,0.35)",
    marginBottom: 8,
};

function TagInput({ label, tags, onAdd, onRemove, placeholder }) {
    const [input, setInput] = useState("");

    const handleKeyDown = (e) => {
        if ((e.key === "Enter" || e.key === ",") && input.trim()) {
            e.preventDefault();
            onAdd(input.trim());
            setInput("");
        }
        if (e.key === "Backspace" && !input && tags.length > 0) {
            onRemove(tags[tags.length - 1]);
        }
    };

    return (
        <div style={{ marginBottom: 24 }}>
            <label style={lbl}>{label}</label>
            <div
                style={{
                    minHeight: 52,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: "8px 12px",
                    display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center",
                    transition: "border-color 0.15s",
                }}
                onClick={e => e.currentTarget.querySelector("input")?.focus()}
                onFocusCapture={e => e.currentTarget.style.borderColor = "rgba(232,255,71,0.35)"}
                onBlurCapture={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
            >
                {tags.map((tag) => (
                    <span key={tag} style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "4px 12px", borderRadius: 8,
                        background: "rgba(232,255,71,0.09)", border: "1px solid rgba(232,255,71,0.2)",
                        color: "#E8FF47", fontSize: 12, fontWeight: 500,
                    }}>
                        {tag}
                        <button onClick={() => onRemove(tag)} style={{
                            color: "rgba(232,255,71,0.5)", background: "none", border: "none",
                            cursor: "pointer", lineHeight: 1, padding: 0, fontSize: 14,
                            transition: "color 0.15s",
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = "#E8FF47"}
                            onMouseLeave={e => e.currentTarget.style.color = "rgba(232,255,71,0.5)"}
                        >×</button>
                    </span>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : ""}
                    style={{
                        flex: 1, minWidth: 120, background: "transparent",
                        border: "none", outline: "none", fontSize: 13,
                        color: "#f0ede8", fontFamily: "'DM Sans', sans-serif",
                    }}
                />
            </div>
            <p style={{ fontSize: 10, color: "rgba(240,237,232,0.2)", marginTop: 6 }}>Press Enter or comma to add</p>
        </div>
    );
}

const SUGGESTED_TECH = [
    "Python", "JavaScript", "TypeScript", "React", "Next.js",
    "FastAPI", "Node.js", "MongoDB", "PostgreSQL", "Redis",
    "Docker", "Git", "AWS", "Tailwind CSS", "REST APIs",
];

export default function SkillsStep() {
    const { resume, updateSkills } = useResume();
    const [skills, setSkills] = useState(resume.skills);

    const sync = (updated) => {
        setSkills(updated);
        updateSkills(updated);
    };

    const addTech    = (skill) => { if (!skills.technical.includes(skill)) sync({ ...skills, technical: [...skills.technical, skill] }); };
    const removeTech = (skill) => sync({ ...skills, technical: skills.technical.filter((s) => s !== skill) });
    const addSoft    = (skill) => { if (!skills.soft.includes(skill)) sync({ ...skills, soft: [...skills.soft, skill] }); };
    const removeSoft = (skill) => sync({ ...skills, soft: skills.soft.filter((s) => s !== skill) });

    return (
        <div>
            <TagInput
                label="Technical Skills"
                tags={skills.technical}
                onAdd={addTech}
                onRemove={removeTech}
                placeholder="Type a skill and press Enter..."
            />

            {/* Quick add suggestions */}
            <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 9, color: "rgba(240,237,232,0.22)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 10 }}>Quick Add</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {SUGGESTED_TECH.filter((s) => !skills.technical.includes(s)).map((s) => (
                        <button
                            key={s}
                            onClick={() => addTech(s)}
                            style={{
                                fontSize: 11, padding: "5px 12px", borderRadius: 8,
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(240,237,232,0.3)", background: "transparent",
                                cursor: "pointer", transition: "all 0.13s",
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = "#E8FF47"; e.currentTarget.style.borderColor = "rgba(232,255,71,0.25)"; e.currentTarget.style.background = "rgba(232,255,71,0.06)"; }}
                            onMouseLeave={e => { e.currentTarget.style.color = "rgba(240,237,232,0.3)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "transparent"; }}
                        >
                            + {s}
                        </button>
                    ))}
                </div>
            </div>

            <TagInput
                label="Soft Skills"
                tags={skills.soft}
                onAdd={addSoft}
                onRemove={removeSoft}
                placeholder="Leadership, Communication, Problem Solving..."
            />
        </div>
    );
}