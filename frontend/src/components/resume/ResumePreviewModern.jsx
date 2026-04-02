/*

// LWF

import { useResume } from "./ResumeContext";

function formatDate(dateStr) {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(month) - 1]} ${year}`;
}

export default function ResumePreviewModern() {
    const { resume } = useResume();
    const { personal, experience, education, skills, projects } = resume;

    const hasContent = personal.name || personal.email;

    if (!hasContent) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-4xl mb-3 opacity-20">📄</div>
                <p className="text-white/15 text-sm">Fill in your details to see the preview</p>
            </div>
        );
    }

    return (
        <div
            className="bg-white text-gray-900 rounded-xl shadow-2xl overflow-hidden"
            style={{
                fontFamily: "'Crimson Text', Georgia, serif",
                fontSize: "9.5pt",
                lineHeight: "1.45",
                minHeight: "297mm",
                width: "100%",
                maxWidth: "210mm",
                margin: "0 auto",
            }}
        >
            <div className="bg-[#1a1a2e] text-white px-8 py-6">
                <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "22pt", fontWeight: 700, letterSpacing: "-0.02em" }}>
                    {personal.name || "Your Name"}
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-white/60 text-xs">
                    {personal.email && <span>✉ {personal.email}</span>}
                    {personal.phone && <span>✆ {personal.phone}</span>}
                    {personal.location && <span>⌖ {personal.location}</span>}
                    {personal.linkedin && <span>in {personal.linkedin}</span>}
                    {personal.github && <span>⌥ {personal.github}</span>}
                    {personal.portfolio && <span>⎋ {personal.portfolio}</span>}
                </div>
            </div>

            <div className="px-8 py-5">
                {personal.summary && (
                    <Section title="Summary">
                        <p className="text-gray-600 leading-relaxed">{personal.summary}</p>
                    </Section>
                )}

                {experience.length > 0 && (
                    <Section title="Experience">
                        {experience.map((exp) => (
                            <div key={exp.id} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <div>
                                        <span className="font-bold text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10pt" }}>
                                            {exp.role || "Role"}
                                        </span>
                                        <span className="text-gray-500 ml-2">· {exp.company || "Company"}</span>
                                    </div>
                                    <span className="text-gray-400 text-xs shrink-0 ml-2">
                                        {formatDate(exp.start)}{exp.start ? " – " : ""}{exp.current ? "Present" : formatDate(exp.end)}
                                        {exp.location ? ` · ${exp.location}` : ""}
                                    </span>
                                </div>
                                {exp.bullets.filter(Boolean).length > 0 && (
                                    <ul className="mt-1.5 space-y-0.5">
                                        {exp.bullets.filter(Boolean).map((b, i) => (
                                            <li key={i} className="flex gap-2 text-gray-600">
                                                <span className="text-[#00a070] mt-0.5 shrink-0">▸</span>
                                                <span>{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </Section>
                )}

                {projects.length > 0 && (
                    <Section title="Projects">
                        {projects.map((proj) => (
                            <div key={proj.id} className="mb-3.5">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                        {proj.title || "Project"}
                                    </span>
                                    {proj.techStack.length > 0 && (
                                        <span className="text-gray-400 text-xs">{proj.techStack.join(", ")}</span>
                                    )}
                                </div>
                                {proj.description && <p className="text-gray-600 mt-0.5">{proj.description}</p>}
                                <div className="flex gap-3 mt-0.5 text-xs text-[#00a070]">
                                    {proj.liveUrl && <span>↗ {proj.liveUrl}</span>}
                                    {proj.githubUrl && <span>⎇ {proj.githubUrl}</span>}
                                </div>
                            </div>
                        ))}
                    </Section>
                )}

                {education.length > 0 && (
                    <Section title="Education">
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-3">
                                <div className="flex justify-between items-baseline">
                                    <div>
                                        <span className="font-bold text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                            {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                                        </span>
                                        <span className="text-gray-500 ml-2">· {edu.institution}</span>
                                    </div>
                                    <span className="text-gray-400 text-xs shrink-0 ml-2">
                                        {formatDate(edu.start)}{edu.start ? " – " : ""}{edu.current ? "Present" : formatDate(edu.end)}
                                    </span>
                                </div>
                                {edu.cgpa && <p className="text-gray-500 text-xs mt-0.5">CGPA: {edu.cgpa}</p>}
                            </div>
                        ))}
                    </Section>
                )}

                {(skills.technical.length > 0 || skills.soft.length > 0) && (
                    <Section title="Skills">
                        {skills.technical.length > 0 && (
                            <div className="mb-1.5">
                                <span className="font-semibold text-gray-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>Technical: </span>
                                <span className="text-gray-600">{skills.technical.join(" · ")}</span>
                            </div>
                        )}
                        {skills.soft.length > 0 && (
                            <div>
                                <span className="font-semibold text-gray-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>Soft Skills: </span>
                                <span className="text-gray-600">{skills.soft.join(" · ")}</span>
                            </div>
                        )}
                    </Section>
                )}
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="mb-5">
            <div className="flex items-center gap-3 mb-2.5">
                <h2
                    style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "9pt",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#1a1a2e",
                    }}
                >
                    {title}
                </h2>
                <div className="flex-1 h-px bg-gray-200" />
            </div>
            {children}
        </div>
    );
}

*/




import { useResume } from "./ResumeContext";

function formatDate(dateStr) {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(month) - 1]} ${year}`;
}

export default function ResumePreviewModern() {
    const { resume } = useResume();
    const { personal, experience, education, skills, projects } = resume;

    const hasContent = personal.name || personal.email;

    if (!hasContent) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-4xl mb-3 opacity-20">📄</div>
                <p className="text-white/15 text-sm">Fill in your details to see the preview</p>
            </div>
        );
    }

    return (
        <div
            className="bg-white text-gray-900 rounded-xl shadow-2xl overflow-hidden"
            style={{
                fontFamily: "'Crimson Text', Georgia, serif",
                fontSize: "9.5pt",
                lineHeight: "1.45",
                minHeight: "297mm",
                width: "100%",
                maxWidth: "210mm",
                margin: "0 auto",
            }}
        >
            {/* Header */}
            <div className="bg-[#1a1a2e] text-white px-8 py-6">
                <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "22pt", fontWeight: 700, letterSpacing: "-0.02em" }}>
                    {personal.name || "Your Name"}
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-white/60 text-xs">
                    {personal.email && <span>✉ {personal.email}</span>}
                    {personal.phone && <span>✆ {personal.phone}</span>}
                    {personal.location && <span>⌖ {personal.location}</span>}
                    {personal.linkedin && <span>in {personal.linkedin}</span>}
                    {personal.github && <span>⌥ {personal.github}</span>}
                    {personal.portfolio && <span>⎋ {personal.portfolio}</span>}
                </div>
            </div>

            <div className="px-8 py-5">
                {/* Summary */}
                {personal.summary && (
                    <Section title="Summary">
                        <p className="text-gray-600 leading-relaxed">{personal.summary}</p>
                    </Section>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <Section title="Experience">
                        {experience.map((exp) => (
                            <div key={exp.id} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <div>
                                        <span className="font-bold text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10pt" }}>
                                            {exp.role || "Role"}
                                        </span>
                                        <span className="text-gray-500 ml-2">· {exp.company || "Company"}</span>
                                    </div>
                                    <span className="text-gray-400 text-xs shrink-0 ml-2">
                                        {formatDate(exp.start)}{exp.start ? " – " : ""}{exp.current ? "Present" : formatDate(exp.end)}
                                        {exp.location ? ` · ${exp.location}` : ""}
                                    </span>
                                </div>
                                {exp.bullets.filter(Boolean).length > 0 && (
                                    <ul className="mt-1.5 space-y-0.5">
                                        {exp.bullets.filter(Boolean).map((b, i) => (
                                            <li key={i} className="flex gap-2 text-gray-600">
                                                <span className="text-[#00a070] mt-0.5 shrink-0">▸</span>
                                                <span>{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </Section>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <Section title="Projects">
                        {projects.map((proj) => (
                            <div key={proj.id} className="mb-3.5">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                        {proj.title || "Project"}
                                    </span>
                                    {proj.techStack.length > 0 && (
                                        <span className="text-gray-400 text-xs">{proj.techStack.join(", ")}</span>
                                    )}
                                </div>
                                {proj.description && <p className="text-gray-600 mt-0.5">{proj.description}</p>}
                                <div className="flex gap-3 mt-0.5 text-xs text-[#00a070]">
                                    {proj.liveUrl && <span>↗ {proj.liveUrl}</span>}
                                    {proj.githubUrl && <span>⎇ {proj.githubUrl}</span>}
                                </div>
                            </div>
                        ))}
                    </Section>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <Section title="Education">
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-3">
                                <div className="flex justify-between items-baseline">
                                    <div>
                                        <span className="font-bold text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                            {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                                        </span>
                                        <span className="text-gray-500 ml-2">· {edu.institution}</span>
                                    </div>
                                    <span className="text-gray-400 text-xs shrink-0 ml-2">
                                        {formatDate(edu.start)}{edu.start ? " – " : ""}{edu.current ? "Present" : formatDate(edu.end)}
                                    </span>
                                </div>
                                {edu.cgpa && <p className="text-gray-500 text-xs mt-0.5">CGPA: {edu.cgpa}</p>}
                            </div>
                        ))}
                    </Section>
                )}

                {/* Skills */}
                {(skills.technical.length > 0 || skills.soft.length > 0) && (
                    <Section title="Skills">
                        {skills.technical.length > 0 && (
                            <div className="mb-1.5">
                                <span className="font-semibold text-gray-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>Technical: </span>
                                <span className="text-gray-600">{skills.technical.join(" · ")}</span>
                            </div>
                        )}
                        {skills.soft.length > 0 && (
                            <div>
                                <span className="font-semibold text-gray-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>Soft Skills: </span>
                                <span className="text-gray-600">{skills.soft.join(" · ")}</span>
                            </div>
                        )}
                    </Section>
                )}
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="mb-5">
            <div className="flex items-center gap-3 mb-2.5">
                <h2
                    style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "9pt",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#1a1a2e",
                    }}
                >
                    {title}
                </h2>
                <div className="flex-1 h-px bg-gray-200" />
            </div>
            {children}
        </div>
    );
}