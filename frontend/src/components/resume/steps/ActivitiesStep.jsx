/*

// LWF

import { useState } from "react";
import { useResume } from "../ResumeContext";

export default function ActivitiesStep() {
    const { resume, updateSection } = useResume();

    const [activities, setActivities] = useState(resume.activities || [""]);
    const [certs, setCerts] = useState(
        resume.certifications?.length ? resume.certifications : [{ name: "", issuer: "" }]
    );

    const syncActivities = (updated) => {
        setActivities(updated);
        // call updateSection directly since useResume exposes it
        // if not, add updateActivities to the context
        if (typeof resume.updateActivities === "function") {
            resume.updateActivities(updated);
        }
    };

    const syncCerts = (updated) => {
        setCerts(updated);
    };

    // We use a local save button since these aren't wired to context steps yet
    // Just pass up via props if needed, or add to context

    return (
        <div>
            <div className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">
                    Activities &amp; Achievements
                </h3>

                {activities.map((item, i) => (
                    <div key={i} className="flex gap-2 mb-2 items-center">
                        <span className="text-white/20 text-xs shrink-0">•</span>
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                                const updated = [...activities];
                                updated[i] = e.target.value;
                                syncActivities(updated);
                            }}
                            placeholder="Solved 800+ problems on LeetCode, Codeforces..."
                            className="flex-1 bg-white/3 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/15 focus:outline-none focus:border-[#00e5a0]/40 transition-all"
                        />
                        {activities.length > 1 && (
                            <button
                                onClick={() => syncActivities(activities.filter((_, j) => j !== i))}
                                className="text-xs text-red-400/40 hover:text-red-400 transition-colors px-2"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}

                <button
                    onClick={() => syncActivities([...activities, ""])}
                    className="text-xs text-white/25 hover:text-white/50 transition-colors mt-1 ml-4"
                >
                    + Add achievement
                </button>
            </div>

            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">
                    Certifications
                </h3>

                {certs.map((cert, i) => (
                    <div key={i} className="mb-3 border border-white/8 rounded-xl p-4 bg-white/2">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-white/20 uppercase tracking-wider">Cert #{i + 1}</span>
                            {certs.length > 1 && (
                                <button
                                    onClick={() => syncCerts(certs.filter((_, j) => j !== i))}
                                    className="text-xs text-red-400/40 hover:text-red-400 transition-colors"
                                >
                                    ✕ Remove
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                ["Certificate Name", "name", "Azure AI Essentials Professional Certificate"],
                                ["Issued By", "issuer", "Microsoft"],
                            ].map(([label, field, placeholder]) => (
                                <div key={field}>
                                    <label className="block text-xs font-semibold uppercase tracking-widest text-white/25 mb-1.5">{label}</label>
                                    <input
                                        type="text"
                                        value={cert[field]}
                                        onChange={(e) => {
                                            const updated = [...certs];
                                            updated[i] = { ...updated[i], [field]: e.target.value };
                                            syncCerts(updated);
                                        }}
                                        placeholder={placeholder}
                                        className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/15 focus:outline-none focus:border-[#00e5a0]/40 transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => syncCerts([...certs, { name: "", issuer: "" }])}
                    className="w-full py-3 rounded-xl border border-dashed border-white/10 text-sm text-white/30 hover:text-white/60 hover:border-white/20 transition-all"
                >
                    + Add Certification
                </button>
            </div>
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

export default function ActivitiesStep() {
    const { resume, updateSection } = useResume();

    const [activities, setActivities] = useState(resume.activities || [""]);
    const [certs, setCerts] = useState(
        resume.certifications?.length ? resume.certifications : [{ name: "", issuer: "" }]
    );

    const syncActivities = (updated) => {
        setActivities(updated);
        if (typeof resume.updateActivities === "function") {
            resume.updateActivities(updated);
        }
    };

    const syncCerts = (updated) => {
        setCerts(updated);
    };

    return (
        <div>
            {/* ── Activities ── */}
            <div style={{ marginBottom: 36 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(240,237,232,0.3)" }}>
                        Activities &amp; Achievements
                    </span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                </div>

                {activities.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                        <span style={{ color: "rgba(232,255,71,0.35)", fontSize: 10, flexShrink: 0 }}>▸</span>
                        <input
                            type="text"
                            value={item}
                            onChange={e => {
                                const updated = [...activities];
                                updated[i] = e.target.value;
                                syncActivities(updated);
                            }}
                            placeholder="Solved 800+ problems on LeetCode, Codeforces..."
                            style={{ ...inp, flex: 1 }}
                            onFocus={focusIn} onBlur={focusOut}
                        />
                        {activities.length > 1 && (
                            <button
                                onClick={() => syncActivities(activities.filter((_, j) => j !== i))}
                                style={{
                                    fontSize: 11, color: "rgba(249,168,212,0.4)", background: "none",
                                    border: "none", cursor: "pointer", padding: "0 6px", transition: "color 0.15s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = "#f9a8d4"}
                                onMouseLeave={e => e.currentTarget.style.color = "rgba(249,168,212,0.4)"}
                            >✕</button>
                        )}
                    </div>
                ))}

                <button
                    onClick={() => syncActivities([...activities, ""])}
                    style={{
                        fontSize: 11, color: "rgba(240,237,232,0.25)", background: "none",
                        border: "none", cursor: "pointer", marginLeft: 20, marginTop: 4,
                        fontFamily: "'DM Sans', sans-serif", transition: "color 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "rgba(240,237,232,0.6)"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(240,237,232,0.25)"}
                >
                    + Add achievement
                </button>
            </div>

            {/* ── Certifications ── */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(240,237,232,0.3)" }}>
                        Certifications
                    </span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                </div>

                {certs.map((cert, i) => (
                    <div key={i} style={{
                        marginBottom: 12, border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 14, padding: 16, background: "rgba(255,255,255,0.02)",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                            <span style={{ fontSize: 10, color: "rgba(240,237,232,0.22)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                Cert #{i + 1}
                            </span>
                            {certs.length > 1 && (
                                <button
                                    onClick={() => syncCerts(certs.filter((_, j) => j !== i))}
                                    style={{
                                        fontSize: 11, color: "rgba(249,168,212,0.5)", background: "none",
                                        border: "none", cursor: "pointer", transition: "color 0.15s", fontFamily: "'DM Sans', sans-serif",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = "#f9a8d4"}
                                    onMouseLeave={e => e.currentTarget.style.color = "rgba(249,168,212,0.5)"}
                                >
                                    ✕ Remove
                                </button>
                            )}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                            {[
                                ["Certificate Name", "name",   "Azure AI Essentials Professional Certificate"],
                                ["Issued By",         "issuer", "Microsoft"],
                            ].map(([label, field, placeholder]) => (
                                <div key={field}>
                                    <label style={lbl}>{label}</label>
                                    <input
                                        type="text"
                                        value={cert[field]}
                                        onChange={e => {
                                            const updated = [...certs];
                                            updated[i] = { ...updated[i], [field]: e.target.value };
                                            syncCerts(updated);
                                        }}
                                        placeholder={placeholder}
                                        style={inp} onFocus={focusIn} onBlur={focusOut}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => syncCerts([...certs, { name: "", issuer: "" }])}
                    style={{
                        width: "100%", padding: "12px", borderRadius: 12,
                        border: "1px dashed rgba(255,255,255,0.1)", fontSize: 13,
                        color: "rgba(240,237,232,0.3)", background: "transparent",
                        cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = "rgba(240,237,232,0.7)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(240,237,232,0.3)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                    + Add Certification
                </button>
            </div>
        </div>
    );
}