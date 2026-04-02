/*

// LWF

import { useResume } from "./ResumeContext";

export default function ResumePreviewClassic() {
    const { resume } = useResume();
    const { personal, experience, education, skills, projects, certifications } = resume;

    const hasContent = personal.name || personal.email;

    if (!hasContent) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-4xl mb-3 opacity-20">📄</div>
                <p className="text-white/15 text-sm">Fill in your details to see the preview</p>
            </div>
        );
    }

    const base = {
        fontFamily: "'EB Garamond', Georgia, serif",
        fontSize: "10pt",
        lineHeight: "1.45",
        color: "#1a1a1a",
        background: "white",
    };

    const sansFont = { fontFamily: "'Source Sans 3', 'Helvetica Neue', sans-serif" };

    return (
        <div
            style={{
                ...base,
                padding: "28px 36px",
                minHeight: "297mm",
                width: "100%",
                maxWidth: "210mm",
                margin: "0 auto",
                boxShadow: "0 4px 40px rgba(0,0,0,0.3)",
                borderRadius: "4px",
            }}
        >
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <div style={{ ...sansFont, fontSize: "18pt", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#000", marginBottom: "5px" }}>
                    {personal.name || "Your Name"}
                </div>
                <div style={{ ...sansFont, fontSize: "8pt", color: "#333", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0 8px" }}>
                    {[personal.location, personal.phone, personal.email, personal.portfolio, personal.linkedin, personal.github]
                        .filter(Boolean)
                        .map((item, i, arr) => (
                            <span key={i}>
                                {item}
                                {i < arr.length - 1 && <span style={{ color: "#bbb", marginLeft: "8px" }}>|</span>}
                            </span>
                        ))}
                </div>
            </div>

            {education.length > 0 && (
                <Section title="Education">
                    {education.map((edu) => (
                        <div key={edu.id} style={{ marginBottom: "5px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <span style={{ ...sansFont, fontWeight: 700, fontSize: "10.5pt", color: "#000" }}>
                                    {edu.institution}
                                </span>
                                <span style={{ ...sansFont, fontSize: "8.5pt", color: "#444" }}>
                                    {edu.start?.slice(0, 4)}{edu.start ? " – " : ""}{edu.current ? "Present" : edu.end?.slice(0, 4)}
                                </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "1px" }}>
                                <span style={{ fontStyle: "italic", fontSize: "10pt", color: "#222" }}>
                                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                                </span>
                                {edu.cgpa && (
                                    <span style={{ ...sansFont, fontSize: "8.5pt", color: "#444" }}>CGPA: {edu.cgpa}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </Section>
            )}

            {(skills.technical.length > 0 || skills.soft.length > 0) && (
                <Section title="Technical Skills">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tbody>
                            {skills.technical.length > 0 && (
                                <tr>
                                    <td style={{ ...sansFont, fontWeight: 700, fontSize: "9.5pt", paddingRight: "6px", whiteSpace: "nowrap", verticalAlign: "top", paddingBottom: "2px" }}>
                                        Languages:
                                    </td>
                                    <td style={{ fontSize: "9.5pt", paddingBottom: "2px" }}>{skills.technical.join(", ")}</td>
                                </tr>
                            )}
                            {skills.soft.length > 0 && (
                                <tr>
                                    <td style={{ ...sansFont, fontWeight: 700, fontSize: "9.5pt", paddingRight: "6px", whiteSpace: "nowrap", verticalAlign: "top" }}>
                                        Others:
                                    </td>
                                    <td style={{ fontSize: "9.5pt" }}>{skills.soft.join(", ")}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Section>
            )}

            {experience.length > 0 && (
                <Section title="Experience">
                    {experience.map((exp) => (
                        <div key={exp.id} style={{ marginBottom: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <div>
                                    <span style={{ ...sansFont, fontWeight: 700, fontSize: "10.5pt", color: "#000" }}>{exp.role}</span>
                                    {exp.company && <span style={{ fontStyle: "italic", fontSize: "10pt", color: "#333" }}>, {exp.company}</span>}
                                    {exp.location && <span style={{ fontStyle: "italic", fontSize: "10pt", color: "#555" }}> – {exp.location}</span>}
                                </div>
                                <span style={{ ...sansFont, fontSize: "8.5pt", color: "#444", whiteSpace: "nowrap", marginLeft: "8px" }}>
                                    {exp.start}{exp.start ? " – " : ""}{exp.current ? "Present" : exp.end}
                                </span>
                            </div>
                            <BulletList items={exp.bullets} />
                        </div>
                    ))}
                </Section>
            )}

            {projects.length > 0 && (
                <Section title="Projects">
                    {projects.map((proj) => (
                        <div key={proj.id} style={{ marginBottom: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px" }}>
                                    <span style={{ ...sansFont, fontWeight: 700, fontSize: "10.5pt", color: "#000" }}>{proj.title}</span>
                                    {proj.techStack.length > 0 && (
                                        <span style={{ fontStyle: "italic", fontSize: "10pt", color: "#333" }}>
                                            ({proj.techStack.join(", ")})
                                        </span>
                                    )}
                                    {(proj.liveUrl || proj.githubUrl) && (
                                        <span style={{ ...sansFont, fontSize: "8pt", color: "#1a56a0" }}>
                                            {proj.liveUrl && "[Live]"} {proj.githubUrl && "[Code]"}
                                        </span>
                                    )}
                                </div>
                                {proj.year && (
                                    <span style={{ ...sansFont, fontSize: "8.5pt", color: "#444", whiteSpace: "nowrap", marginLeft: "8px" }}>{proj.year}</span>
                                )}
                            </div>
                            {proj.description && (
                                <BulletList
                                    items={proj.description
                                        .split("\n")
                                        .map((l) => l.trim().replace(/^[•\-]/, "").trim())
                                        .filter(Boolean)}
                                />
                            )}
                        </div>
                    ))}
                </Section>
            )}

            {resume.activities?.length > 0 && (
                <Section title="Activities & Achievements">
                    <BulletList items={resume.activities} />
                </Section>
            )}

            {certifications?.length > 0 && (
                <Section title="Certifications">
                    <BulletList
                        items={certifications.map((c) =>
                            [c.name, c.issuer ? `by ${c.issuer}` : ""].filter(Boolean).join(" ")
                        )}
                    />
                </Section>
            )}
        </div>
    );
}

// ── Shared sub-components ──

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: "10px" }}>
            <div
                style={{
                    fontFamily: "'Source Sans 3', 'Helvetica Neue', sans-serif",
                    fontSize: "9pt",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#000",
                    borderBottom: "1.5px solid #000",
                    paddingBottom: "2px",
                    marginBottom: "7px",
                }}
            >
                {title}
            </div>
            {children}
        </div>
    );
}

function BulletList({ items = [] }) {
    const filtered = items.filter(Boolean);
    if (!filtered.length) return null;
    return (
        <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "3px" }}>
            {filtered.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: "6px", fontSize: "10pt", color: "#222", marginBottom: "2px" }}>
                    <span style={{ flexShrink: 0 }}>•</span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

*/





import { useResume } from "./ResumeContext";

// Renders the "Classic" template — matches the single-column ATS-style layout
export default function ResumePreviewClassic() {
    const { resume } = useResume();
    const { personal, experience, education, skills, projects, certifications } = resume;

    const hasContent = personal.name || personal.email;

    if (!hasContent) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-4xl mb-3 opacity-20">📄</div>
                <p className="text-white/15 text-sm">Fill in your details to see the preview</p>
            </div>
        );
    }

    const base = {
        fontFamily: "'EB Garamond', Georgia, serif",
        fontSize: "10pt",
        lineHeight: "1.45",
        color: "#1a1a1a",
        background: "white",
    };

    const sansFont = { fontFamily: "'Source Sans 3', 'Helvetica Neue', sans-serif" };

    return (
        <div
            style={{
                ...base,
                padding: "28px 36px",
                minHeight: "297mm",
                width: "100%",
                maxWidth: "210mm",
                margin: "0 auto",
                boxShadow: "0 4px 40px rgba(0,0,0,0.3)",
                borderRadius: "4px",
            }}
        >
            {/* ── HEADER ── */}
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <div style={{ ...sansFont, fontSize: "18pt", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#000", marginBottom: "5px" }}>
                    {personal.name || "Your Name"}
                </div>
                <div style={{ ...sansFont, fontSize: "8pt", color: "#333", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0 8px" }}>
                    {[personal.location, personal.phone, personal.email, personal.portfolio, personal.linkedin, personal.github]
                        .filter(Boolean)
                        .map((item, i, arr) => (
                            <span key={i}>
                                {item}
                                {i < arr.length - 1 && <span style={{ color: "#bbb", marginLeft: "8px" }}>|</span>}
                            </span>
                        ))}
                </div>
            </div>

            {/* ── EDUCATION ── */}
            {education.length > 0 && (
                <Section title="Education">
                    {education.map((edu) => (
                        <div key={edu.id} style={{ marginBottom: "5px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <span style={{ ...sansFont, fontWeight: 700, fontSize: "10.5pt", color: "#000" }}>
                                    {edu.institution}
                                </span>
                                <span style={{ ...sansFont, fontSize: "8.5pt", color: "#444" }}>
                                    {edu.start?.slice(0, 4)}{edu.start ? " – " : ""}{edu.current ? "Present" : edu.end?.slice(0, 4)}
                                </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "1px" }}>
                                <span style={{ fontStyle: "italic", fontSize: "10pt", color: "#222" }}>
                                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                                </span>
                                {edu.cgpa && (
                                    <span style={{ ...sansFont, fontSize: "8.5pt", color: "#444" }}>CGPA: {edu.cgpa}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </Section>
            )}

            {/* ── TECHNICAL SKILLS ── */}
            {(skills.technical.length > 0 || skills.soft.length > 0) && (
                <Section title="Technical Skills">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tbody>
                            {skills.technical.length > 0 && (
                                <tr>
                                    <td style={{ ...sansFont, fontWeight: 700, fontSize: "9.5pt", paddingRight: "6px", whiteSpace: "nowrap", verticalAlign: "top", paddingBottom: "2px" }}>
                                        Languages:
                                    </td>
                                    <td style={{ fontSize: "9.5pt", paddingBottom: "2px" }}>{skills.technical.join(", ")}</td>
                                </tr>
                            )}
                            {skills.soft.length > 0 && (
                                <tr>
                                    <td style={{ ...sansFont, fontWeight: 700, fontSize: "9.5pt", paddingRight: "6px", whiteSpace: "nowrap", verticalAlign: "top" }}>
                                        Others:
                                    </td>
                                    <td style={{ fontSize: "9.5pt" }}>{skills.soft.join(", ")}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Section>
            )}

            {/* ── EXPERIENCE ── */}
            {experience.length > 0 && (
                <Section title="Experience">
                    {experience.map((exp) => (
                        <div key={exp.id} style={{ marginBottom: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <div>
                                    <span style={{ ...sansFont, fontWeight: 700, fontSize: "10.5pt", color: "#000" }}>{exp.role}</span>
                                    {exp.company && <span style={{ fontStyle: "italic", fontSize: "10pt", color: "#333" }}>, {exp.company}</span>}
                                    {exp.location && <span style={{ fontStyle: "italic", fontSize: "10pt", color: "#555" }}> – {exp.location}</span>}
                                </div>
                                <span style={{ ...sansFont, fontSize: "8.5pt", color: "#444", whiteSpace: "nowrap", marginLeft: "8px" }}>
                                    {exp.start}{exp.start ? " – " : ""}{exp.current ? "Present" : exp.end}
                                </span>
                            </div>
                            <BulletList items={exp.bullets} />
                        </div>
                    ))}
                </Section>
            )}

            {/* ── PROJECTS ── */}
            {projects.length > 0 && (
                <Section title="Projects">
                    {projects.map((proj) => (
                        <div key={proj.id} style={{ marginBottom: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px" }}>
                                    <span style={{ ...sansFont, fontWeight: 700, fontSize: "10.5pt", color: "#000" }}>{proj.title}</span>
                                    {proj.techStack.length > 0 && (
                                        <span style={{ fontStyle: "italic", fontSize: "10pt", color: "#333" }}>
                                            ({proj.techStack.join(", ")})
                                        </span>
                                    )}
                                    {(proj.liveUrl || proj.githubUrl) && (
                                        <span style={{ ...sansFont, fontSize: "8pt", color: "#1a56a0" }}>
                                            {proj.liveUrl && "[Live]"} {proj.githubUrl && "[Code]"}
                                        </span>
                                    )}
                                </div>
                                {proj.year && (
                                    <span style={{ ...sansFont, fontSize: "8.5pt", color: "#444", whiteSpace: "nowrap", marginLeft: "8px" }}>{proj.year}</span>
                                )}
                            </div>
                            {proj.description && (
                                <BulletList
                                    items={proj.description
                                        .split("\n")
                                        .map((l) => l.trim().replace(/^[•\-]/, "").trim())
                                        .filter(Boolean)}
                                />
                            )}
                        </div>
                    ))}
                </Section>
            )}

            {/* ── ACTIVITIES & ACHIEVEMENTS ── */}
            {resume.activities?.length > 0 && (
                <Section title="Activities & Achievements">
                    <BulletList items={resume.activities} />
                </Section>
            )}

            {/* ── CERTIFICATIONS ── */}
            {certifications?.length > 0 && (
                <Section title="Certifications">
                    <BulletList
                        items={certifications.map((c) =>
                            [c.name, c.issuer ? `by ${c.issuer}` : ""].filter(Boolean).join(" ")
                        )}
                    />
                </Section>
            )}
        </div>
    );
}

// ── Shared sub-components ──

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: "10px" }}>
            <div
                style={{
                    fontFamily: "'Source Sans 3', 'Helvetica Neue', sans-serif",
                    fontSize: "9pt",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#000",
                    borderBottom: "1.5px solid #000",
                    paddingBottom: "2px",
                    marginBottom: "7px",
                }}
            >
                {title}
            </div>
            {children}
        </div>
    );
}

function BulletList({ items = [] }) {
    const filtered = items.filter(Boolean);
    if (!filtered.length) return null;
    return (
        <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "3px" }}>
            {filtered.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: "6px", fontSize: "10pt", color: "#222", marginBottom: "2px" }}>
                    <span style={{ flexShrink: 0 }}>•</span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}