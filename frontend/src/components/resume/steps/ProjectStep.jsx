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

const emptyProject = () => ({
    id: Date.now(),
    title: "",
    description: "",
    techStack: [],
    liveUrl: "",
    githubUrl: "",
});

export default function ProjectsStep() {
    const { resume, updateProjects } = useResume();
    const [projects, setProjects] = useState(resume.projects.length ? resume.projects : []);
    const [techInput, setTechInput] = useState({});

    const sync = (updated) => {
        setProjects(updated);
        updateProjects(updated);
    };

    const addProject    = () => sync([...projects, emptyProject()]);
    const removeProject = (id) => sync(projects.filter((p) => p.id !== id));
    const updateField   = (id, field, value) =>
        sync(projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

    const addTech = (id, tech) => {
        if (!tech.trim()) return;
        sync(projects.map((p) =>
            p.id === id && !p.techStack.includes(tech)
                ? { ...p, techStack: [...p.techStack, tech] }
                : p
        ));
        setTechInput((prev) => ({ ...prev, [id]: "" }));
    };

    const removeTech = (id, tech) =>
        sync(projects.map((p) => (p.id === id ? { ...p, techStack: p.techStack.filter((t) => t !== tech) } : p)));

    return (
        <div>
            {projects.length === 0 && (
                <div style={{
                    border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 16,
                    padding: "48px 24px", textAlign: "center", marginBottom: 24,
                }}>
                    <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>◇</div>
                    <p style={{ color: "rgba(240,237,232,0.3)", fontSize: 13, marginBottom: 20 }}>Showcase your best work</p>
                    <button onClick={addProject} style={{
                        fontSize: 12, padding: "8px 18px", borderRadius: 10,
                        background: "rgba(232,255,71,0.08)", border: "1px solid rgba(232,255,71,0.2)",
                        color: "#E8FF47", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    }}>
                        + Add Project
                    </button>
                </div>
            )}

            {projects.map((proj, i) => (
                <div key={proj.id} style={{
                    marginBottom: 24, border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16, padding: 20, background: "rgba(255,255,255,0.02)",
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(240,237,232,0.25)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Project #{i + 1}
                        </span>
                        <button onClick={() => removeProject(proj.id)} style={{
                            fontSize: 11, color: "rgba(249,168,212,0.5)", background: "none",
                            border: "none", cursor: "pointer", transition: "color 0.15s", fontFamily: "'DM Sans', sans-serif",
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = "#f9a8d4"}
                            onMouseLeave={e => e.currentTarget.style.color = "rgba(249,168,212,0.5)"}
                        >
                            ✕ Remove
                        </button>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label style={lbl}>Project Title</label>
                        <input type="text" value={proj.title}
                            onChange={e => updateField(proj.id, "title", e.target.value)}
                            placeholder="Career Crafter Resume Builder" style={inp} onFocus={focusIn} onBlur={focusOut} />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label style={lbl}>Description</label>
                        <textarea value={proj.description}
                            onChange={e => updateField(proj.id, "description", e.target.value)}
                            placeholder="A full-stack AI-powered resume builder built with React, FastAPI, and MongoDB..."
                            rows={3}
                            style={{ ...inp, resize: "none" }} onFocus={focusIn} onBlur={focusOut} />
                    </div>

                    {/* Tech stack */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={lbl}>Tech Stack</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                            {proj.techStack.map((tech) => (
                                <span key={tech} style={{
                                    display: "flex", alignItems: "center", gap: 6,
                                    padding: "4px 10px", borderRadius: 8,
                                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                                    color: "rgba(240,237,232,0.55)", fontSize: 11,
                                }}>
                                    {tech}
                                    <button onClick={() => removeTech(proj.id, tech)} style={{
                                        color: "rgba(240,237,232,0.3)", background: "none", border: "none",
                                        cursor: "pointer", padding: 0, fontSize: 14, lineHeight: 1, transition: "color 0.15s",
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.color = "rgba(240,237,232,0.8)"}
                                        onMouseLeave={e => e.currentTarget.style.color = "rgba(240,237,232,0.3)"}
                                    >×</button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={techInput[proj.id] || ""}
                            onChange={e => setTechInput(prev => ({ ...prev, [proj.id]: e.target.value }))}
                            onKeyDown={e => {
                                if ((e.key === "Enter" || e.key === ",") && (techInput[proj.id] || "").trim()) {
                                    e.preventDefault();
                                    addTech(proj.id, (techInput[proj.id] || "").trim());
                                }
                            }}
                            placeholder="React, FastAPI, MongoDB... (Enter to add)"
                            style={inp} onFocus={focusIn} onBlur={focusOut}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                        {[["Live URL", "liveUrl", "https://jobhitai.vercel.app"], ["GitHub URL", "githubUrl", "github.com/you/project"]].map(
                            ([label, field, placeholder]) => (
                                <div key={field}>
                                    <label style={lbl}>{label}</label>
                                    <input type="text" value={proj[field]}
                                        onChange={e => updateField(proj.id, field, e.target.value)}
                                        placeholder={placeholder} style={inp} onFocus={focusIn} onBlur={focusOut} />
                                </div>
                            )
                        )}
                    </div>
                </div>
            ))}

            {projects.length > 0 && (
                <button onClick={addProject} style={{
                    width: "100%", padding: "12px", borderRadius: 12,
                    border: "1px dashed rgba(255,255,255,0.1)", fontSize: 13,
                    color: "rgba(240,237,232,0.3)", background: "transparent",
                    cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
                }}
                    onMouseEnter={e => { e.currentTarget.style.color = "rgba(240,237,232,0.7)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(240,237,232,0.3)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                    + Add Another Project
                </button>
            )}
        </div>
    );
}