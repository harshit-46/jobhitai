// src/components/resume/ResumeDocument.jsx
import {
    Document, Page, Text, View, StyleSheet, Link
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        fontFamily: "Helvetica",
        fontSize: 10,
        padding: "36pt 42pt",
        color: "#1a1a1a",
        lineHeight: 1.4,
    },
    // ── Header ──
    header: { marginBottom: 14 },
    name: { fontSize: 22, fontFamily: "Helvetica-Bold", letterSpacing: 0.5, marginBottom: 4 },
    contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, color: "#444" },
    contactItem: { fontSize: 9, color: "#444" },
    divider: { height: 1, backgroundColor: "#d1d5db", marginVertical: 8 },

    // ── Section ──
    section: { marginBottom: 12 },
    sectionTitle: {
        fontSize: 10, fontFamily: "Helvetica-Bold",
        textTransform: "uppercase", letterSpacing: 1,
        color: "#111", borderBottom: "1pt solid #d1d5db",
        paddingBottom: 3, marginBottom: 7,
    },

    // ── Experience / Education ──
    entryHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
    entryTitle: { fontSize: 10, fontFamily: "Helvetica-Bold" },
    entryMeta: { fontSize: 9, color: "#555" },
    entryDate: { fontSize: 9, color: "#555" },
    bullet: { flexDirection: "row", marginTop: 2 },
    bulletDot: { width: 12, color: "#555" },
    bulletText: { flex: 1, fontSize: 9.5, color: "#333" },

    // ── Skills ──
    skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
    skillChip: {
        fontSize: 9, paddingHorizontal: 8, paddingVertical: 3,
        backgroundColor: "#f3f4f6", borderRadius: 4, color: "#374151",
    },

    // ── Projects ──
    projectTitle: { fontSize: 10, fontFamily: "Helvetica-Bold" },
    projectMeta: { fontSize: 9, color: "#6b7280", marginBottom: 2 },
    projectDesc: { fontSize: 9.5, color: "#333" },

    // ── Certifications ──
    certItem: { fontSize: 9.5, marginBottom: 2 },
});

const ContactSep = () => <Text style={{ color: "#aaa", marginHorizontal: 4 }}>·</Text>;

export default function ResumeDocument({ resume }) {
    const { personal, experience, education, skills, projects, certifications } = resume;

    const hasExp   = experience?.length > 0;
    const hasEdu   = education?.length > 0;
    const hasSkill = skills?.technical?.length > 0 || skills?.soft?.length > 0;
    const hasProj  = projects?.length > 0;
    const hasCert  = certifications?.length > 0;

    const contacts = [
        personal.email,
        personal.phone,
        personal.location,
        personal.linkedin,
        personal.github,
        personal.website,
    ].filter(Boolean);

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* ── Header ── */}
                <View style={styles.header}>
                    <Text style={styles.name}>{personal.name || "Your Name"}</Text>
                    <View style={styles.contactRow}>
                        {contacts.map((c, i) => (
                            <View key={i} style={{ flexDirection: "row", alignItems: "center" }}>
                                {i > 0 && <ContactSep />}
                                <Text style={styles.contactItem}>{c}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ── Summary ── */}
                {personal.summary ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Summary</Text>
                        <Text style={{ fontSize: 9.5, color: "#333" }}>{personal.summary}</Text>
                    </View>
                ) : null}

                {/* ── Experience ── */}
                {hasExp && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Experience</Text>
                        {experience.map((exp, i) => (
                            <View key={i} style={{ marginBottom: 8 }}>
                                <View style={styles.entryHeader}>
                                    <Text style={styles.entryTitle}>{exp.role}{exp.company ? ` — ${exp.company}` : ""}</Text>
                                    <Text style={styles.entryDate}>
                                        {exp.start}{exp.end || exp.current ? ` – ${exp.current ? "Present" : exp.end}` : ""}
                                    </Text>
                                </View>
                                {exp.location ? <Text style={styles.entryMeta}>{exp.location}</Text> : null}
                                {exp.bullets?.map((b, j) => (
                                    <View key={j} style={styles.bullet}>
                                        <Text style={styles.bulletDot}>•</Text>
                                        <Text style={styles.bulletText}>{b}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* ── Education ── */}
                {hasEdu && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {education.map((edu, i) => (
                            <View key={i} style={{ marginBottom: 6 }}>
                                <View style={styles.entryHeader}>
                                    <Text style={styles.entryTitle}>
                                        {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                                    </Text>
                                    <Text style={styles.entryDate}>
                                        {edu.start}{edu.end || edu.current ? ` – ${edu.current ? "Present" : edu.end}` : ""}
                                    </Text>
                                </View>
                                <Text style={styles.entryMeta}>
                                    {edu.institution}{edu.cgpa ? `  ·  CGPA: ${edu.cgpa}` : ""}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* ── Skills ── */}
                {hasSkill && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        {skills.technical?.length > 0 && (
                            <View style={{ marginBottom: 5 }}>
                                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 4, color: "#374151" }}>
                                    Technical
                                </Text>
                                <View style={styles.skillsRow}>
                                    {skills.technical.map((s, i) => (
                                        <Text key={i} style={styles.skillChip}>{s}</Text>
                                    ))}
                                </View>
                            </View>
                        )}
                        {skills.soft?.length > 0 && (
                            <View>
                                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 4, color: "#374151" }}>
                                    Soft Skills
                                </Text>
                                <View style={styles.skillsRow}>
                                    {skills.soft.map((s, i) => (
                                        <Text key={i} style={styles.skillChip}>{s}</Text>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {/* ── Projects ── */}
                {hasProj && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Projects</Text>
                        {projects.map((p, i) => (
                            <View key={i} style={{ marginBottom: 7 }}>
                                <View style={styles.entryHeader}>
                                    <Text style={styles.projectTitle}>{p.title}</Text>
                                </View>
                                {p.techStack?.length > 0 && (
                                    <Text style={styles.projectMeta}>{p.techStack.join(", ")}</Text>
                                )}
                                {p.description ? (
                                    <Text style={styles.projectDesc}>{p.description}</Text>
                                ) : null}
                                {(p.liveUrl || p.githubUrl) && (
                                    <Text style={{ fontSize: 9, color: "#6b7280", marginTop: 2 }}>
                                        {p.githubUrl ? `GitHub: ${p.githubUrl}` : ""}
                                        {p.githubUrl && p.liveUrl ? "  ·  " : ""}
                                        {p.liveUrl ? `Live: ${p.liveUrl}` : ""}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* ── Certifications ── */}
                {hasCert && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Certifications</Text>
                        {certifications.map((c, i) => (
                            <Text key={i} style={styles.certItem}>
                                • {c.name || c.title || JSON.stringify(c)}
                            </Text>
                        ))}
                    </View>
                )}

            </Page>
        </Document>
    );
}