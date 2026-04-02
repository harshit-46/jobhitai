/*

// LWF

import { useState, useEffect } from "react";
import { useResume } from "../ResumeContext";
import { generateSummaryWithAI } from "../../../api/resume";

const Field = ({ label, name, value, onChange, placeholder, type = "text" }) => (
    <div className="mb-5">
        <label className="block text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-white/15 focus:outline-none focus:border-[#00e5a0]/40 focus:bg-white/5 transition-all"
        />
    </div>
);

export default function PersonalInfoStep() {
    const { resume, updatePersonal } = useResume();
    const [form, setForm] = useState(resume.personal);
    const [generatingAI, setGeneratingAI] = useState(false);

    useEffect(() => {
        updatePersonal(form);
    }, [form]);

    const handleChange = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenerateSummary = async () => {
        setGeneratingAI(true);
        try {
            const summary = await generateSummaryWithAI(resume);
            setForm((prev) => ({ ...prev, summary }));
        } catch {
            alert("AI summary generation failed. Ensure backend is running.");
        } finally {
            setGeneratingAI(false);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-2 gap-x-4">
                <Field label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Harshit Sharma" />
                <Field label="Email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" type="email" />
                <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                <Field label="Location" name="location" value={form.location} onChange={handleChange} placeholder="Dehradun, India" />
                <Field label="LinkedIn URL" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="linkedin.com/in/yourprofile" />
                <Field label="GitHub URL" name="github" value={form.github} onChange={handleChange} placeholder="github.com/yourusername" />
            </div>

            <Field label="Portfolio / Website" name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="yourportfolio.dev" />

            <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-white/30">
                        Professional Summary
                    </label>
                    <button
                        onClick={handleGenerateSummary}
                        disabled={generatingAI}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#00e5a0]/10 border border-[#00e5a0]/20 text-[#00e5a0] hover:bg-[#00e5a0]/15 transition-all disabled:opacity-50"
                    >
                        {generatingAI ? (
                            <>
                                <span className="w-2.5 h-2.5 border border-[#00e5a0]/30 border-t-[#00e5a0] rounded-full animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>✨ AI Generate</>
                        )}
                    </button>
                </div>
                <textarea
                    value={form.summary}
                    onChange={(e) => handleChange("summary", e.target.value)}
                    placeholder="A brief, impactful summary of who you are and what you bring to the table..."
                    rows={4}
                    className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-white/15 focus:outline-none focus:border-[#00e5a0]/40 focus:bg-white/5 transition-all resize-none"
                />
            </div>
        </div>
    );
}

*/






import { useState, useEffect } from "react";
import { useResume } from "../ResumeContext";
import { generateSummaryWithAI } from "../../../api/resume";

const inputStyle = {
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

const labelStyle = {
    display: "block",
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "rgba(240,237,232,0.35)",
    marginBottom: 6,
};

const Field = ({ label, name, value, onChange, placeholder, type = "text" }) => (
    <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = "rgba(232,255,71,0.35)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.03)"; }}
        />
    </div>
);

export default function PersonalInfoStep() {
    const { resume, updatePersonal } = useResume();
    const [form, setForm] = useState(resume.personal);
    const [generatingAI, setGeneratingAI] = useState(false);

    useEffect(() => {
        updatePersonal(form);
    }, [form]);

    const handleChange = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenerateSummary = async () => {
        setGeneratingAI(true);
        try {
            const summary = await generateSummaryWithAI(resume);
            setForm((prev) => ({ ...prev, summary }));
        } catch {
            alert("AI summary generation failed. Ensure backend is running.");
        } finally {
            setGeneratingAI(false);
        }
    };

    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                <Field label="Full Name"  name="name"  value={form.name}  onChange={handleChange} placeholder="Harshit Sharma" />
                <Field label="Email"      name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" type="email" />
                <Field label="Phone"      name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                <Field label="Location"   name="location" value={form.location} onChange={handleChange} placeholder="Dehradun, India" />
                <Field label="LinkedIn URL" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="linkedin.com/in/yourprofile" />
                <Field label="GitHub URL"   name="github"   value={form.github}   onChange={handleChange} placeholder="github.com/yourusername" />
            </div>

            <Field label="Portfolio / Website" name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="yourportfolio.dev" />

            <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <label style={labelStyle}>Professional Summary</label>
                    <button
                        onClick={handleGenerateSummary}
                        disabled={generatingAI}
                        style={{
                            display: "flex", alignItems: "center", gap: 6,
                            fontSize: 11, padding: "6px 14px", borderRadius: 8,
                            background: "rgba(232,255,71,0.08)", border: "1px solid rgba(232,255,71,0.2)",
                            color: "#E8FF47", cursor: "pointer", transition: "all 0.15s",
                            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                            opacity: generatingAI ? 0.6 : 1,
                        }}
                        onMouseEnter={e => { if (!generatingAI) e.currentTarget.style.background = "rgba(232,255,71,0.14)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(232,255,71,0.08)"; }}
                    >
                        {generatingAI ? (
                            <>
                                <span style={{ width: 10, height: 10, border: "1.5px solid rgba(232,255,71,0.3)", borderTop: "1.5px solid #E8FF47", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                                Generating...
                            </>
                        ) : <>✦ AI Generate</>}
                    </button>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <textarea
                    value={form.summary}
                    onChange={(e) => handleChange("summary", e.target.value)}
                    placeholder="A brief, impactful summary of who you are and what you bring to the table..."
                    rows={4}
                    style={{ ...inputStyle, resize: "none" }}
                    onFocus={e => { e.target.style.borderColor = "rgba(232,255,71,0.35)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.03)"; }}
                />
            </div>
        </div>
    );
}