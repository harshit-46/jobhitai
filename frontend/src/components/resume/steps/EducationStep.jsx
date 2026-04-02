/*

// LWF

import { useState } from "react";
import { useResume } from "../ResumeContext";

const emptyEdu = () => ({
    id: Date.now(),
    institution: "",
    degree: "",
    field: "",
    start: "",
    end: "",
    cgpa: "",
    current: false,
});

export default function EducationStep() {
    const { resume, updateEducation } = useResume();
    const [educations, setEducations] = useState(resume.education.length ? resume.education : []);

    const sync = (updated) => {
        setEducations(updated);
        updateEducation(updated);
    };

    const addEdu = () => sync([...educations, emptyEdu()]);
    const removeEdu = (id) => sync(educations.filter((e) => e.id !== id));
    const updateField = (id, field, value) =>
        sync(educations.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

    return (
        <div>
            {educations.length === 0 && (
                <div className="border border-dashed border-white/10 rounded-2xl p-8 text-center mb-6">
                    <div className="text-3xl mb-3">🎓</div>
                    <p className="text-white/30 text-sm mb-4">No education added yet</p>
                    <button
                        onClick={addEdu}
                        className="text-sm px-4 py-2 rounded-lg bg-[#00e5a0]/10 border border-[#00e5a0]/20 text-[#00e5a0] hover:bg-[#00e5a0]/15 transition-all"
                    >
                        + Add Education
                    </button>
                </div>
            )}

            {educations.map((edu, i) => (
                <div key={edu.id} className="mb-6 border border-white/8 rounded-2xl p-5 bg-white/2">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-white/20 uppercase tracking-widest">Education #{i + 1}</span>
                        <button onClick={() => removeEdu(edu.id)} className="text-xs text-red-400/50 hover:text-red-400 transition-colors">
                            ✕ Remove
                        </button>
                    </div>

                    {[
                        ["Institution", "institution", "IIT Delhi"],
                        ["Degree", "degree", "B.Tech / M.Tech / MBA"],
                        ["Field of Study", "field", "Computer Science"],
                        ["CGPA / Percentage", "cgpa", "8.5 / 10"],
                    ].map(([label, field, placeholder]) => (
                        <div key={field} className="mb-4">
                            <label className="block text-xs font-semibold uppercase tracking-widest text-white/25 mb-1.5">{label}</label>
                            <input
                                type="text"
                                value={edu[field]}
                                onChange={(e) => updateField(edu.id, field, e.target.value)}
                                placeholder={placeholder}
                                className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/15 focus:outline-none focus:border-[#00e5a0]/40 transition-all"
                            />
                        </div>
                    ))}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-white/25 mb-1.5">Start Year</label>
                            <input
                                type="month"
                                value={edu.start}
                                onChange={(e) => updateField(edu.id, "start", e.target.value)}
                                className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e5a0]/40 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-white/25 mb-1.5">End Year</label>
                            <input
                                type="month"
                                value={edu.end}
                                disabled={edu.current}
                                onChange={(e) => updateField(edu.id, "end", e.target.value)}
                                className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e5a0]/40 disabled:opacity-30 transition-all"
                            />
                            <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                <input type="checkbox" checked={edu.current} onChange={(e) => updateField(edu.id, "current", e.target.checked)} className="accent-[#00e5a0]" />
                                <span className="text-xs text-white/30">Currently studying</span>
                            </label>
                        </div>
                    </div>
                </div>
            ))}

            {educations.length > 0 && (
                <button
                    onClick={addEdu}
                    className="w-full py-3 rounded-xl border border-dashed border-white/10 text-sm text-white/30 hover:text-white/60 hover:border-white/20 transition-all"
                >
                    + Add Another Education
                </button>
            )}
        </div>
    );
}

*/





import { useState } from "react";
import { useResume } from "../ResumeContext";

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

const emptyEdu = () => ({
    id: Date.now(),
    institution: "",
    degree: "",
    field: "",
    start: "",
    end: "",
    cgpa: "",
    current: false,
});

export default function EducationStep() {
    const { resume, updateEducation } = useResume();
    const [educations, setEducations] = useState(resume.education.length ? resume.education : []);

    const sync = (updated) => {
        setEducations(updated);
        updateEducation(updated);
    };

    const addEdu    = () => sync([...educations, emptyEdu()]);
    const removeEdu = (id) => sync(educations.filter((e) => e.id !== id));
    const updateField = (id, field, value) =>
        sync(educations.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

    return (
        <div>
            {educations.length === 0 && (
                <div style={{
                    border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 16,
                    padding: "48px 24px", textAlign: "center", marginBottom: 24,
                }}>
                    <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>◎</div>
                    <p style={{ color: "rgba(240,237,232,0.3)", fontSize: 13, marginBottom: 20 }}>No education added yet</p>
                    <button onClick={addEdu} style={{
                        fontSize: 12, padding: "8px 18px", borderRadius: 10,
                        background: "rgba(232,255,71,0.08)", border: "1px solid rgba(232,255,71,0.2)",
                        color: "#E8FF47", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                        transition: "all 0.15s",
                    }}>
                        + Add Education
                    </button>
                </div>
            )}

            {educations.map((edu, i) => (
                <div key={edu.id} style={{
                    marginBottom: 24, border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16, padding: 20, background: "rgba(255,255,255,0.02)",
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(240,237,232,0.25)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Education #{i + 1}
                        </span>
                        <button onClick={() => removeEdu(edu.id)} style={{
                            fontSize: 11, color: "rgba(249,168,212,0.5)", background: "none",
                            border: "none", cursor: "pointer", transition: "color 0.15s", fontFamily: "'DM Sans', sans-serif",
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = "#f9a8d4"}
                            onMouseLeave={e => e.currentTarget.style.color = "rgba(249,168,212,0.5)"}
                        >
                            ✕ Remove
                        </button>
                    </div>

                    {[
                        ["Institution",          "institution", "IIT Delhi"],
                        ["Degree",               "degree",      "B.Tech / M.Tech / MBA"],
                        ["Field of Study",       "field",       "Computer Science"],
                        ["CGPA / Percentage",    "cgpa",        "8.5 / 10"],
                    ].map(([label, field, placeholder]) => (
                        <div key={field} style={{ marginBottom: 16 }}>
                            <label style={lbl}>{label}</label>
                            <input type="text" value={edu[field]}
                                onChange={e => updateField(edu.id, field, e.target.value)}
                                placeholder={placeholder} style={inp} onFocus={focusIn} onBlur={focusOut} />
                        </div>
                    ))}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                        <div>
                            <label style={lbl}>Start Year</label>
                            <input type="month" value={edu.start}
                                onChange={e => updateField(edu.id, "start", e.target.value)}
                                style={inp} onFocus={focusIn} onBlur={focusOut} />
                        </div>
                        <div>
                            <label style={lbl}>End Year</label>
                            <input type="month" value={edu.end} disabled={edu.current}
                                onChange={e => updateField(edu.id, "end", e.target.value)}
                                style={{ ...inp, opacity: edu.current ? 0.3 : 1 }} onFocus={focusIn} onBlur={focusOut} />
                            <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, cursor: "pointer" }}>
                                <input type="checkbox" checked={edu.current}
                                    onChange={e => updateField(edu.id, "current", e.target.checked)}
                                    style={{ accentColor: "#E8FF47" }} />
                                <span style={{ fontSize: 11, color: "rgba(240,237,232,0.3)" }}>Currently studying</span>
                            </label>
                        </div>
                    </div>
                </div>
            ))}

            {educations.length > 0 && (
                <button onClick={addEdu} style={{
                    width: "100%", padding: "12px", borderRadius: 12,
                    border: "1px dashed rgba(255,255,255,0.1)", fontSize: 13,
                    color: "rgba(240,237,232,0.3)", background: "transparent",
                    cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
                }}
                    onMouseEnter={e => { e.currentTarget.style.color = "rgba(240,237,232,0.7)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(240,237,232,0.3)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                    + Add Another Education
                </button>
            )}
        </div>
    );
}