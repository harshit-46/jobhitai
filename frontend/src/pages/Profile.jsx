/*


import { useState } from "react";

// ── Theme tokens (identical to the rest of the app) ─────────────────────────
const t = {
    bg:      "#0a0a0e",
    sidebar: "#08080b",
    surface: "rgba(255,255,255,0.03)",
    surface2:"rgba(255,255,255,0.055)",
    text:    "#f0ede8",
    muted:   "rgba(240,237,232,0.45)",
    faint:   "rgba(240,237,232,0.22)",
    border:  "rgba(255,255,255,0.07)",
    border2: "rgba(255,255,255,0.12)",
    lime:    "#E8FF47",
    limeD:   "#c8dd00",
    pink:    "#f9a8d4",
    blue:    "#93c5fd",
    green:   "#86efac",
};

// ── Shared primitives ────────────────────────────────────────────────────────
const inp = (extra = {}) => ({
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${t.border}`,
    borderRadius: 12,
    padding: "10px 16px",
    fontSize: 13,
    color: t.text,
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.15s, background 0.15s",
    ...extra,
});

const lbl = {
    display: "block",
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "rgba(240,237,232,0.35)",
    marginBottom: 6,
};

const focusIn  = e => { e.target.style.borderColor = "rgba(232,255,71,0.4)";  e.target.style.background = "rgba(255,255,255,0.05)"; };
const focusOut = e => { e.target.style.borderColor = t.border;                  e.target.style.background = "rgba(255,255,255,0.03)"; };

const pill = (active) => ({
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "3px 12px", borderRadius: 100,
    fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase",
    border: `1px solid ${active ? "rgba(232,255,71,0.25)" : t.border}`,
    background: active ? "rgba(232,255,71,0.07)" : t.surface,
    color: active ? t.lime : t.muted,
    cursor: "pointer", transition: "all 0.15s",
});

// ── Mock initial data (replace with real user context / API) ─────────────────
const INIT = {
    name:       "Harshit Gupta",
    email:      "harshit@careercrafter.com",
    phone:      "+91 98765 43210",
    location:   "Dehradun, India",
    linkedin:   "linkedin.com/in/harshithere",
    github:     "github.com/harshit-46",
    portfolio:  "harshit.dev",
    bio:        "Full-stack developer specialising in React, FastAPI and AI-integrated systems. Passionate about developer tooling and open-source.",
    plan:       "Pro",
    joined:     "January 2025",
    role:       "Software Engineer",
    skills:     ["React", "TypeScript", "FastAPI", "Python", "MongoDB", "Docker"],
    resumeCount: 4,
    atsAvg:      87,
    interviews:  12,
};

const STATS = [
    { label: "Resumes Built",   value: s => s.resumeCount, suffix: "",   color: t.lime  },
    { label: "Avg ATS Score",   value: s => s.atsAvg,      suffix: "%",  color: t.green },
    { label: "Interviews Won",  value: s => s.interviews,  suffix: "",   color: t.blue  },
];

const SECTIONS = ["Overview", "Edit Profile", "Account"];

// ── Component ────────────────────────────────────────────────────────────────
export default function Profile({ user, onLogout }) {
    const merged   = { ...INIT, ...(user || {}) };
    const [data, setData]       = useState(merged);
    const [active, setActive]   = useState("Overview");
    const [saved, setSaved]     = useState(false);
    const [editSkill, setEditSkill] = useState("");

    const initial = data.name?.[0]?.toUpperCase() ?? "U";

    const handleChange = (k, v) => setData(p => ({ ...p, [k]: v }));

    const handleSave = () => {
        // Wire to your real update API here
        setSaved(true);
        setTimeout(() => setSaved(false), 2200);
    };

    const addSkill = () => {
        const s = editSkill.trim();
        if (s && !data.skills.includes(s)) {
            setData(p => ({ ...p, skills: [...p.skills, s] }));
        }
        setEditSkill("");
    };

    const removeSkill = (s) => setData(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));

    return (
        <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Fraunces:ital,opsz,wght@0,9..144,800;1,9..144,800&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                ::selection { background: #E8FF47; color: #0a0a0e; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
                .anim { animation: fadeIn 0.4s ease forwards; }
                .tab-btn:hover { color: #f0ede8 !important; }
                .skill-tag:hover .skill-x { opacity: 1 !important; }
            `}</style>

            <div style={{
                position: "relative", overflow: "hidden",
                background: t.sidebar,
                borderBottom: `1px solid ${t.border}`,
            }}>

                <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
                    backgroundSize: "52px 52px",
                }} />

                <div style={{
                    position: "absolute", top: -60, right: 80,
                    width: 320, height: 320, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(232,255,71,0.06) 0%, transparent 70%)",
                    pointerEvents: "none",
                }} />

                <div style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto" }}>

                    <div style={{ display: "flex", alignItems: "flex-end", gap: 28, marginBottom: 32 }}>

                        <div style={{ position: "relative", flexShrink: 0 }}>
                            <div style={{
                                width: 88, height: 88, borderRadius: "50%",
                                background: "linear-gradient(135deg,#E8FF47,#c8dd00)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontFamily: "'Fraunces', serif", fontWeight: 800,
                                fontSize: "2rem", color: "#0a0a0e",
                                border: `3px solid ${t.bg}`,
                                boxShadow: "0 0 0 1px rgba(232,255,71,0.3)",
                            }}>
                                {initial}
                            </div>

                            <div style={{
                                position: "absolute", bottom: 4, right: 4,
                                width: 14, height: 14, borderRadius: "50%",
                                background: t.lime, border: `2px solid ${t.bg}`,
                                boxShadow: "0 0 8px rgba(232,255,71,0.6)",
                            }} />
                        </div>

                        <div style={{ flex: 1, paddingBottom: 4 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                                <h1 style={{
                                    fontFamily: "'Fraunces', serif", fontWeight: 800,
                                    fontSize: "clamp(1.5rem,3vw,2.1rem)", letterSpacing: "-0.04em",
                                    color: t.text,
                                }}>
                                    {data.name}
                                </h1>
                                <span style={{
                                    ...pill(true),
                                    fontSize: 9, padding: "2px 10px",
                                }}>
                                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.lime }} />
                                    {data.plan} Plan
                                </span>
                            </div>
                            <div style={{ fontSize: 13, color: t.muted, marginBottom: 10 }}>
                                {data.role}&nbsp;&nbsp;·&nbsp;&nbsp;{data.location}&nbsp;&nbsp;·&nbsp;&nbsp;Joined {data.joined}
                            </div>
                            <div style={{ fontSize: 12, color: t.faint, maxWidth: 480, lineHeight: 1.65 }}>
                                {data.bio}
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 8, paddingBottom: 8 }}>
                            {[
                                { label: "GitHub",    href: `https://${data.github}` },
                                { label: "LinkedIn",  href: `https://${data.linkedin}` },
                                { label: "Portfolio", href: `https://${data.portfolio}` },
                            ].filter(l => l.href !== "https://").map(l => (
                                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{
                                    fontSize: 11, padding: "7px 14px", borderRadius: 9,
                                    border: `1px solid ${t.border}`, color: t.muted,
                                    background: t.surface, textDecoration: "none",
                                    transition: "all 0.15s", fontWeight: 500,
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.color = t.lime; e.currentTarget.style.borderColor = "rgba(232,255,71,0.25)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.borderColor = t.border; }}
                                >
                                    ↗ {l.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${t.border}` }}>
                        {SECTIONS.map(s => (
                            <button key={s} onClick={() => setActive(s)} className="tab-btn" style={{
                                padding: "12px 22px", fontSize: 13, fontWeight: 500,
                                color: active === s ? t.text : t.faint,
                                background: "none", border: "none", cursor: "pointer",
                                borderBottom: active === s ? `2px solid ${t.lime}` : "2px solid transparent",
                                marginBottom: -1, transition: "all 0.15s",
                                fontFamily: "'DM Sans', sans-serif",
                            }}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 48px 80px" }}>


                {active === "Overview" && (
                    <div className="anim">

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, marginBottom: 36 }}>
                            {STATS.map((st, i) => (
                                <div key={st.label} style={{
                                    padding: "28px 32px",
                                    borderRight: i < 2 ? `1px solid ${t.border}` : "none",
                                    borderBottom: `1px solid ${t.border}`,
                                }}>
                                    <div style={{
                                        fontFamily: "'Fraunces', serif", fontWeight: 800,
                                        fontSize: "2.8rem", letterSpacing: "-0.04em", lineHeight: 1,
                                        color: st.color,
                                    }}>
                                        {st.value(data)}{st.suffix}
                                    </div>
                                    <div style={{ marginTop: 6, fontSize: 11, color: t.faint, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                        {st.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <Card title="Contact Information">
                                {[
                                    { icon: "✉", label: "Email",     val: data.email },
                                    { icon: "✆", label: "Phone",     val: data.phone },
                                    { icon: "⌖", label: "Location",  val: data.location },
                                    { icon: "in", label: "LinkedIn", val: data.linkedin },
                                    { icon: "⎇", label: "GitHub",    val: data.github },
                                    { icon: "⎋", label: "Portfolio", val: data.portfolio },
                                ].filter(r => r.val).map(r => (
                                    <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: `1px solid ${t.border}` }}>
                                        <span style={{ width: 28, height: 28, borderRadius: 8, background: t.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: t.faint, flexShrink: 0 }}>
                                            {r.icon}
                                        </span>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontSize: 10, color: t.faint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 1 }}>{r.label}</div>
                                            <div style={{ fontSize: 12, color: t.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.val}</div>
                                        </div>
                                    </div>
                                ))}
                            </Card>

                            <Card title="Skills">
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 4 }}>
                                    {data.skills.map(s => (
                                        <span key={s} style={{
                                            padding: "5px 14px", borderRadius: 8,
                                            background: "rgba(232,255,71,0.07)", border: "1px solid rgba(232,255,71,0.18)",
                                            color: t.lime, fontSize: 12, fontWeight: 500,
                                        }}>
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </Card>


                            <Card title="Resume Activity" style={{ gridColumn: "1 / -1" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, paddingTop: 4 }}>
                                    {[
                                        { label: "Total Resumes",   val: data.resumeCount, accent: t.lime  },
                                        { label: "Last Edited",     val: "2 days ago",      accent: t.muted },
                                        { label: "Avg ATS Score",   val: `${data.atsAvg}%`, accent: t.green },
                                        { label: "Downloads",       val: "18",              accent: t.blue  },
                                    ].map(item => (
                                        <div key={item.label} style={{
                                            padding: "16px 18px", borderRadius: 12,
                                            background: t.surface, border: `1px solid ${t.border}`,
                                        }}>
                                            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "1.6rem", letterSpacing: "-0.03em", color: item.accent }}>
                                                {item.val}
                                            </div>
                                            <div style={{ fontSize: 10, color: t.faint, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>
                                                {item.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {active === "Edit Profile" && (
                    <div className="anim">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

                            <Card title="Basic Info" style={{ gridColumn: "1 / -1" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                                    {[
                                        ["Full Name",   "name",      "Harshit Sharma"],
                                        ["Job Title",   "role",      "Software Engineer"],
                                        ["Email",       "email",     "you@email.com"],
                                        ["Phone",       "phone",     "+91 98765 43210"],
                                        ["Location",    "location",  "Dehradun, India"],
                                    ].map(([label, key, ph]) => (
                                        <div key={key} style={{ marginBottom: 18 }}>
                                            <label style={lbl}>{label}</label>
                                            <input
                                                type="text" value={data[key]}
                                                onChange={e => handleChange(key, e.target.value)}
                                                placeholder={ph} style={inp()}
                                                onFocus={focusIn} onBlur={focusOut}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginBottom: 18 }}>
                                    <label style={lbl}>Bio</label>
                                    <textarea
                                        value={data.bio}
                                        onChange={e => handleChange("bio", e.target.value)}
                                        rows={3}
                                        style={inp({ resize: "none" })}
                                        onFocus={focusIn} onBlur={focusOut}
                                    />
                                </div>
                            </Card>

                            <Card title="Links">
                                {[
                                    ["LinkedIn",  "linkedin",  "linkedin.com/in/you"],
                                    ["GitHub",    "github",    "github.com/you"],
                                    ["Portfolio", "portfolio", "yoursite.dev"],
                                ].map(([label, key, ph]) => (
                                    <div key={key} style={{ marginBottom: 16 }}>
                                        <label style={lbl}>{label}</label>
                                        <input
                                            type="text" value={data[key]}
                                            onChange={e => handleChange(key, e.target.value)}
                                            placeholder={ph} style={inp()}
                                            onFocus={focusIn} onBlur={focusOut}
                                        />
                                    </div>
                                ))}
                            </Card>

                            <Card title="Skills">
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                                    {data.skills.map(s => (
                                        <span key={s} className="skill-tag" style={{
                                            display: "inline-flex", alignItems: "center", gap: 6,
                                            padding: "5px 12px", borderRadius: 8,
                                            background: "rgba(232,255,71,0.07)", border: "1px solid rgba(232,255,71,0.18)",
                                            color: t.lime, fontSize: 12, fontWeight: 500,
                                        }}>
                                            {s}
                                            <button onClick={() => removeSkill(s)} className="skill-x" style={{
                                                opacity: 0, color: "rgba(232,255,71,0.5)", background: "none",
                                                border: "none", cursor: "pointer", padding: 0, fontSize: 14, lineHeight: 1,
                                                transition: "opacity 0.15s, color 0.15s",
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.color = t.lime}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(232,255,71,0.5)"}
                                            >×</button>
                                        </span>
                                    ))}
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <input
                                        type="text" value={editSkill}
                                        onChange={e => setEditSkill(e.target.value)}
                                        onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); } }}
                                        placeholder="Add a skill…"
                                        style={inp({ flex: 1 })}
                                        onFocus={focusIn} onBlur={focusOut}
                                    />
                                    <button onClick={addSkill} style={{
                                        padding: "10px 16px", borderRadius: 12,
                                        background: "rgba(232,255,71,0.08)", border: "1px solid rgba(232,255,71,0.2)",
                                        color: t.lime, fontSize: 12, fontWeight: 600,
                                        cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(232,255,71,0.14)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "rgba(232,255,71,0.08)"}
                                    >Add</button>
                                </div>
                                <p style={{ fontSize: 10, color: t.faint, marginTop: 6 }}>Press Enter or comma to add</p>
                            </Card>
                        </div>

                        <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 14 }}>
                            {saved && (
                                <span style={{ fontSize: 12, color: t.green, display: "flex", alignItems: "center", gap: 6 }}>
                                    <span>✓</span> Changes saved
                                </span>
                            )}
                            <button onClick={handleSave} style={{
                                padding: "11px 32px", borderRadius: 12,
                                background: t.lime, color: "#0a0a0e",
                                border: "none", cursor: "pointer",
                                fontWeight: 700, fontSize: 13, letterSpacing: "-0.01em",
                                fontFamily: "'DM Sans', sans-serif", transition: "opacity 0.15s",
                            }}
                                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {active === "Account" && (
                    <div className="anim">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <Card title="Current Plan">
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0 12px" }}>
                                    <div>
                                        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.03em", color: t.lime, marginBottom: 4 }}>
                                            {data.plan} Plan
                                        </div>
                                        <div style={{ fontSize: 12, color: t.faint }}>Full access to all features</div>
                                    </div>
                                    <span style={{ ...pill(true), fontSize: 10 }}>
                                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.lime }} />
                                        Active
                                    </span>
                                </div>
                                <div style={{ padding: "12px 0", borderTop: `1px solid ${t.border}` }}>
                                    {["Unlimited resume builds", "AI bullet enhancement", "PDF export", "ATS score analysis", "Job category prediction"].map(f => (
                                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                            <span style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(232,255,71,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: t.lime, flexShrink: 0 }}>✓</span>
                                            <span style={{ fontSize: 12, color: t.muted }}>{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card title="Account Details">
                                {[
                                    { label: "Member Since", val: data.joined },
                                    { label: "Email",        val: data.email  },
                                    { label: "Account ID",   val: "usr_hj8k29mx" },
                                    { label: "2FA",          val: "Not enabled" },
                                ].map(r => (
                                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: `1px solid ${t.border}` }}>
                                        <span style={{ fontSize: 12, color: t.faint }}>{r.label}</span>
                                        <span style={{ fontSize: 12, color: t.muted, fontWeight: 500 }}>{r.val}</span>
                                    </div>
                                ))}
                                <div style={{ paddingTop: 16 }}>
                                    <button style={{
                                        width: "100%", padding: "9px", borderRadius: 10,
                                        border: `1px solid ${t.border}`, background: t.surface,
                                        color: t.muted, fontSize: 12, cursor: "pointer",
                                        fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.borderColor = t.border2; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.borderColor = t.border; }}
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </Card>

                            <Card title="Danger Zone" style={{ gridColumn: "1 / -1", borderColor: "rgba(249,168,212,0.15)" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                                    <div>
                                        <div style={{ fontSize: 13, color: t.text, fontWeight: 500, marginBottom: 3 }}>Sign out of all devices</div>
                                        <div style={{ fontSize: 11, color: t.faint }}>Revoke all active sessions immediately.</div>
                                    </div>
                                    <DangerBtn>Sign out all</DangerBtn>
                                </div>
                                <div style={{ height: 1, background: "rgba(249,168,212,0.1)", margin: "4px 0" }} />
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                                    <div>
                                        <div style={{ fontSize: 13, color: t.text, fontWeight: 500, marginBottom: 3 }}>Log out</div>
                                        <div style={{ fontSize: 11, color: t.faint }}>End your current session.</div>
                                    </div>
                                    <DangerBtn onClick={onLogout}>Log out</DangerBtn>
                                </div>
                                <div style={{ height: 1, background: "rgba(249,168,212,0.1)", margin: "4px 0" }} />
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                                    <div>
                                        <div style={{ fontSize: 13, color: t.pink, fontWeight: 500, marginBottom: 3 }}>Delete account</div>
                                        <div style={{ fontSize: 11, color: t.faint }}>Permanently delete all data. This cannot be undone.</div>
                                    </div>
                                    <DangerBtn strong>Delete account</DangerBtn>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Card({ title, children, style = {} }) {
    return (
        <div style={{
            borderRadius: 16, border: `1px solid ${t.border}`,
            background: t.surface, padding: "20px 24px",
            ...style,
        }}>
            {title && (
                <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${t.border}` }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: t.faint }}>
                        {title}
                    </span>
                </div>
            )}
            {children}
        </div>
    );
}

function DangerBtn({ children, onClick, strong }) {
    return (
        <button onClick={onClick} style={{
            padding: "8px 18px", borderRadius: 10, fontSize: 12, fontWeight: 600,
            background: strong ? "rgba(249,168,212,0.08)" : "transparent",
            border: `1px solid ${strong ? "rgba(249,168,212,0.25)" : "rgba(249,168,212,0.15)"}`,
            color: t.pink, cursor: "pointer", transition: "all 0.15s",
            fontFamily: "'DM Sans', sans-serif",
        }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(249,168,212,0.14)"; e.currentTarget.style.borderColor = "rgba(249,168,212,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = strong ? "rgba(249,168,212,0.08)" : "transparent"; e.currentTarget.style.borderColor = strong ? "rgba(249,168,212,0.25)" : "rgba(249,168,212,0.15)"; }}
        >
            {children}
        </button>
    );
}



*/








import { useState } from "react";

const t = {
    bg:      "#0a0a0e",
    sidebar: "#08080b",
    surface: "rgba(255,255,255,0.03)",
    surface2:"rgba(255,255,255,0.055)",
    surface3:"rgba(255,255,255,0.08)",
    text:    "#f0ede8",
    muted:   "rgba(240,237,232,0.45)",
    faint:   "rgba(240,237,232,0.22)",
    border:  "rgba(255,255,255,0.07)",
    border2: "rgba(255,255,255,0.12)",
    lime:    "#E8FF47",
    limeD:   "#c8dd00",
    pink:    "#f9a8d4",
    blue:    "#93c5fd",
    green:   "#86efac",
};

const inp = (extra = {}) => ({
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${t.border}`,
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    color: t.text,
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
    ...extra,
});

const lbl = {
    display: "block",
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "rgba(240,237,232,0.3)",
    marginBottom: 7,
};

const focusIn  = e => {
    e.target.style.borderColor = "rgba(232,255,71,0.5)";
    e.target.style.background  = "rgba(255,255,255,0.05)";
    e.target.style.boxShadow   = "0 0 0 3px rgba(232,255,71,0.06)";
};
const focusOut = e => {
    e.target.style.borderColor = t.border;
    e.target.style.background  = "rgba(255,255,255,0.03)";
    e.target.style.boxShadow   = "none";
};

const INIT = {
    name:       "Harshit Gupta",
    email:      "harshit@careercrafter.com",
    phone:      "+91 98765 43210",
    location:   "Dehradun, India",
    linkedin:   "linkedin.com/in/harshithere",
    github:     "github.com/harshit-46",
    portfolio:  "harshit.dev",
    bio:        "Full-stack developer specialising in React, FastAPI and AI-integrated systems. Passionate about developer tooling and open-source.",
    plan:       "Pro",
    joined:     "January 2025",
    role:       "Software Engineer",
    skills:     ["React", "TypeScript", "FastAPI", "Python", "MongoDB", "Docker"],
    resumeCount: 4,
    atsAvg:      87,
    interviews:  12,
};

const SECTIONS = ["Overview", "Edit Profile", "Account"];

export default function Profile({ user, onLogout }) {
    const merged = { ...INIT, ...(user || {}) };
    const [data, setData]         = useState(merged);
    const [active, setActive]     = useState("Overview");
    const [saved, setSaved]       = useState(false);
    const [editSkill, setEditSkill] = useState("");

    const initial = data.name?.[0]?.toUpperCase() ?? "U";

    const handleChange = (k, v) => setData(p => ({ ...p, [k]: v }));

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const addSkill = () => {
        const s = editSkill.trim();
        if (s && !data.skills.includes(s)) setData(p => ({ ...p, skills: [...p.skills, s] }));
        setEditSkill("");
    };

    const removeSkill = (s) => setData(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));

    return (
        <div style={{ color: t.text, fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
                @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
                @keyframes shimmer { 0%,100%{opacity:.6} 50%{opacity:1} }
                .anim { animation: fadeUp 0.35s ease forwards; }
                .tab-btn { position:relative; }
                .tab-btn::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:2px; background:#E8FF47; border-radius:2px; transform:scaleX(0); transition:transform 0.2s ease; }
                .tab-btn.tab-active::after { transform:scaleX(1); }
                .tab-btn:hover::after { transform:scaleX(0.5); }
                .tab-btn.tab-active:hover::after { transform:scaleX(1); }
                .sk-hover:hover { background: rgba(255,255,255,0.055) !important; }
                .link-btn:hover { color: #E8FF47 !important; border-color: rgba(232,255,71,0.3) !important; background: rgba(232,255,71,0.05) !important; }
                .skill-chip:hover .sk-x { opacity:1 !important; }
                .save-btn:hover { opacity:.88; transform:translateY(-1px); box-shadow:0 8px 24px rgba(232,255,71,0.3) !important; }
                input::placeholder, textarea::placeholder { color: rgba(240,237,232,0.2); }
            `}</style>

            {/* ══ HERO ══════════════════════════════════════════════════════ */}
            <div style={{
                position: "relative",
                background: t.sidebar,
                borderBottom: `1px solid ${t.border}`,
                overflow: "hidden",
                marginBottom: 0,
            }}>
                {/* Subtle grid */}
                <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",
                    backgroundSize: "48px 48px",
                }} />
                {/* Lime radial glow */}
                <div style={{
                    position: "absolute", top: -80, right: 60, width: 400, height: 400,
                    borderRadius: "50%",
                    background: "radial-gradient(circle,rgba(232,255,71,0.055) 0%,transparent 65%)",
                    pointerEvents: "none",
                }} />
                {/* Second glow */}
                <div style={{
                    position: "absolute", bottom: -40, left: 120, width: 260, height: 260,
                    borderRadius: "50%",
                    background: "radial-gradient(circle,rgba(134,239,172,0.04) 0%,transparent 65%)",
                    pointerEvents: "none",
                }} />

                <div style={{ position: "relative", zIndex: 2, padding: "40px 48px 0" }}>
                    {/* Top row */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 28, marginBottom: 36 }}>

                        {/* Avatar */}
                        <div style={{ position: "relative", flexShrink: 0, marginTop: 4 }}>
                            {/* Outer ring */}
                            <div style={{
                                position: "absolute", inset: -4, borderRadius: "50%",
                                background: "conic-gradient(from 0deg, #E8FF47, #c8dd00, rgba(232,255,71,0.2), #E8FF47)",
                                opacity: 0.5,
                            }} />
                            <div style={{
                                position: "relative",
                                width: 92, height: 92, borderRadius: "50%",
                                background: "linear-gradient(135deg,#E8FF47,#c8dd00)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontFamily: "'Fraunces', serif", fontWeight: 800,
                                fontSize: "2.1rem", color: "#0a0a0e",
                                border: `3px solid ${t.bg}`,
                            }}>
                                {initial}
                            </div>
                            <div style={{
                                position: "absolute", bottom: 5, right: 5,
                                width: 13, height: 13, borderRadius: "50%",
                                background: t.lime, border: `2px solid ${t.bg}`,
                                boxShadow: "0 0 10px rgba(232,255,71,0.7)",
                            }} />
                        </div>

                        {/* Name + meta */}
                        <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 5, flexWrap: "wrap" }}>
                                <h1 style={{
                                    fontFamily: "'Fraunces', serif", fontWeight: 800,
                                    fontSize: "clamp(1.6rem,3vw,2.2rem)",
                                    letterSpacing: "-0.04em", color: t.text, margin: 0,
                                }}>
                                    {data.name}
                                </h1>
                                {/* Plan badge */}
                                <span style={{
                                    display: "inline-flex", alignItems: "center", gap: 5,
                                    padding: "3px 10px 3px 8px", borderRadius: 100,
                                    background: "rgba(232,255,71,0.08)",
                                    border: "1px solid rgba(232,255,71,0.22)",
                                    fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                                    color: t.lime, textTransform: "uppercase",
                                }}>
                                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.lime, boxShadow: "0 0 6px rgba(232,255,71,0.8)", display: "inline-block" }} />
                                    {data.plan}
                                </span>
                            </div>
                            <div style={{ fontSize: 13, color: t.muted, marginBottom: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <span>{data.role}</span>
                                <span style={{ color: t.faint, fontSize: 10 }}>◆</span>
                                <span>{data.location}</span>
                                <span style={{ color: t.faint, fontSize: 10 }}>◆</span>
                                <span>Joined {data.joined}</span>
                            </div>
                            <p style={{ fontSize: 12.5, color: t.faint, maxWidth: 500, lineHeight: 1.7, margin: 0 }}>
                                {data.bio}
                            </p>
                        </div>

                        {/* External links */}
                        <div style={{ display: "flex", gap: 8, flexShrink: 0, paddingTop: 4 }}>
                            {[
                                { label: "GitHub",    href: `https://${data.github}`,    icon: "⎇" },
                                { label: "LinkedIn",  href: `https://${data.linkedin}`,  icon: "in" },
                                { label: "Portfolio", href: `https://${data.portfolio}`, icon: "⚡" },
                            ].map(l => (
                                <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                                    className="link-btn"
                                    style={{
                                        display: "flex", alignItems: "center", gap: 6,
                                        padding: "8px 14px", borderRadius: 10,
                                        border: `1px solid ${t.border}`,
                                        background: t.surface,
                                        color: t.muted, fontSize: 11, fontWeight: 500,
                                        textDecoration: "none", transition: "all 0.18s",
                                    }}>
                                    <span style={{ fontSize: 10 }}>{l.icon}</span>
                                    {l.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Inline stats strip ── */}
                    <div style={{
                        display: "grid", gridTemplateColumns: "repeat(3,auto) 1fr",
                        gap: 0, marginBottom: 0,
                        borderTop: `1px solid ${t.border}`,
                        marginLeft: -48, marginRight: -48, paddingLeft: 48,
                    }}>
                        {[
                            { val: data.resumeCount, label: "Resumes Built",  color: t.lime  },
                            { val: `${data.atsAvg}%`, label: "Avg ATS Score", color: t.green },
                            { val: data.interviews,  label: "Interviews Won", color: t.blue  },
                        ].map((s, i) => (
                            <div key={s.label} style={{
                                padding: "18px 36px 18px 0",
                                marginRight: 36,
                                borderRight: `1px solid ${t.border}`,
                                display: "flex", alignItems: "center", gap: 12,
                            }}>
                                <span style={{
                                    fontFamily: "'Fraunces', serif", fontWeight: 800,
                                    fontSize: "1.9rem", letterSpacing: "-0.04em",
                                    color: s.color,
                                }}>{s.val}</span>
                                <span style={{ fontSize: 10, color: t.faint, textTransform: "uppercase", letterSpacing: "0.08em", lineHeight: 1.3 }}>{s.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* ── Tab nav ── */}
                    <div style={{ display: "flex", gap: 0, marginLeft: -48, paddingLeft: 48 }}>
                        {SECTIONS.map(s => (
                            <button key={s}
                                onClick={() => setActive(s)}
                                className={`tab-btn${active === s ? " tab-active" : ""}`}
                                style={{
                                    padding: "14px 20px",
                                    fontSize: 12.5, fontWeight: active === s ? 600 : 400,
                                    color: active === s ? t.text : t.faint,
                                    background: "none", border: "none", cursor: "pointer",
                                    transition: "color 0.15s",
                                    fontFamily: "'DM Sans', sans-serif",
                                    letterSpacing: "-0.01em",
                                }}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══ BODY ══════════════════════════════════════════════════════ */}
            <div style={{ padding: "36px 48px 80px" }}>

                {/* ━━ OVERVIEW ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                {active === "Overview" && (
                    <div className="anim" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

                        {/* Contact */}
                        <Card title="Contact Information">
                            {[
                                { icon: "✉", label: "Email",     val: data.email     },
                                { icon: "✆", label: "Phone",     val: data.phone     },
                                { icon: "⌖", label: "Location",  val: data.location  },
                                { icon: "in",label: "LinkedIn",  val: data.linkedin  },
                                { icon: "⎇", label: "GitHub",    val: data.github    },
                                { icon: "⚡", label: "Portfolio", val: data.portfolio },
                            ].filter(r => r.val).map((r, i, arr) => (
                                <div key={r.label} className="sk-hover" style={{
                                    display: "flex", alignItems: "center", gap: 12,
                                    padding: "9px 10px", marginLeft: -10, marginRight: -10,
                                    borderRadius: 10,
                                    borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : "none",
                                    transition: "background 0.15s", cursor: "default",
                                }}>
                                    <span style={{
                                        width: 30, height: 30, borderRadius: 9,
                                        background: t.surface2,
                                        border: `1px solid ${t.border}`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 11, color: t.faint, flexShrink: 0,
                                    }}>{r.icon}</span>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontSize: 9.5, color: t.faint, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{r.label}</div>
                                        <div style={{ fontSize: 12.5, color: t.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.val}</div>
                                    </div>
                                </div>
                            ))}
                        </Card>

                        {/* Skills */}
                        <Card title="Skills">
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {data.skills.map(s => (
                                    <span key={s} style={{
                                        padding: "5px 14px", borderRadius: 8,
                                        background: "rgba(232,255,71,0.06)",
                                        border: "1px solid rgba(232,255,71,0.15)",
                                        color: t.lime, fontSize: 12, fontWeight: 500,
                                        letterSpacing: "-0.01em",
                                    }}>{s}</span>
                                ))}
                            </div>
                        </Card>

                        {/* Resume Activity — full width */}
                        <Card title="Resume Activity" style={{ gridColumn: "1 / -1" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                                {[
                                    { label: "Total Resumes", val: data.resumeCount, accent: t.lime,  sub: "All time" },
                                    { label: "Last Edited",   val: "2 days ago",     accent: t.muted, sub: "Resume #3" },
                                    { label: "Avg ATS Score", val: `${data.atsAvg}%`,accent: t.green, sub: "+7% this week" },
                                    { label: "Downloads",     val: "18",             accent: t.blue,  sub: "This month" },
                                ].map(item => (
                                    <div key={item.label} style={{
                                        padding: "16px 18px", borderRadius: 12,
                                        background: t.surface,
                                        border: `1px solid ${t.border}`,
                                        position: "relative", overflow: "hidden",
                                    }}>
                                        {/* Subtle top accent line */}
                                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${item.accent}, transparent)`, opacity: 0.4 }} />
                                        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "1.7rem", letterSpacing: "-0.04em", color: item.accent, lineHeight: 1 }}>
                                            {item.val}
                                        </div>
                                        <div style={{ fontSize: 10, color: t.faint, textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 5 }}>{item.label}</div>
                                        <div style={{ fontSize: 10.5, color: t.faint, marginTop: 2, opacity: 0.7 }}>{item.sub}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {/* ━━ EDIT PROFILE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                {active === "Edit Profile" && (
                    <div className="anim">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

                            {/* Basic Info — full width */}
                            <Card title="Basic Info" style={{ gridColumn: "1 / -1" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
                                    {[
                                        ["Full Name", "name",     "Harshit Sharma"   ],
                                        ["Job Title", "role",     "Software Engineer"],
                                        ["Email",     "email",    "you@email.com"    ],
                                        ["Phone",     "phone",    "+91 98765 43210"  ],
                                        ["Location",  "location", "Dehradun, India"  ],
                                    ].map(([label, key, ph]) => (
                                        <div key={key} style={{ marginBottom: 18 }}>
                                            <label style={lbl}>{label}</label>
                                            <input type="text" value={data[key]}
                                                onChange={e => handleChange(key, e.target.value)}
                                                placeholder={ph} style={inp()}
                                                onFocus={focusIn} onBlur={focusOut} />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label style={lbl}>Bio</label>
                                    <textarea value={data.bio}
                                        onChange={e => handleChange("bio", e.target.value)}
                                        rows={3} style={inp({ resize: "none" })}
                                        onFocus={focusIn} onBlur={focusOut} />
                                </div>
                            </Card>

                            {/* Links */}
                            <Card title="Links">
                                {[
                                    ["LinkedIn",  "linkedin",  "linkedin.com/in/you"],
                                    ["GitHub",    "github",    "github.com/you"     ],
                                    ["Portfolio", "portfolio", "yoursite.dev"       ],
                                ].map(([label, key, ph]) => (
                                    <div key={key} style={{ marginBottom: 16 }}>
                                        <label style={lbl}>{label}</label>
                                        <input type="text" value={data[key]}
                                            onChange={e => handleChange(key, e.target.value)}
                                            placeholder={ph} style={inp()}
                                            onFocus={focusIn} onBlur={focusOut} />
                                    </div>
                                ))}
                            </Card>

                            {/* Skills editor */}
                            <Card title="Skills">
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                                    {data.skills.map(s => (
                                        <span key={s} className="skill-chip" style={{
                                            display: "inline-flex", alignItems: "center", gap: 6,
                                            padding: "5px 10px 5px 13px", borderRadius: 8,
                                            background: "rgba(232,255,71,0.06)",
                                            border: "1px solid rgba(232,255,71,0.15)",
                                            color: t.lime, fontSize: 12, fontWeight: 500,
                                        }}>
                                            {s}
                                            <button onClick={() => removeSkill(s)} className="sk-x" style={{
                                                opacity: 0, color: "rgba(232,255,71,0.4)",
                                                background: "none", border: "none",
                                                cursor: "pointer", padding: 0,
                                                fontSize: 16, lineHeight: 1,
                                                transition: "opacity 0.15s, color 0.15s",
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.color = t.lime}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(232,255,71,0.4)"}
                                            >×</button>
                                        </span>
                                    ))}
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <input type="text" value={editSkill}
                                        onChange={e => setEditSkill(e.target.value)}
                                        onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); } }}
                                        placeholder="Add a skill…"
                                        style={inp({ flex: 1 })}
                                        onFocus={focusIn} onBlur={focusOut} />
                                    <button onClick={addSkill} style={{
                                        padding: "10px 16px", borderRadius: 10,
                                        background: "rgba(232,255,71,0.07)",
                                        border: "1px solid rgba(232,255,71,0.18)",
                                        color: t.lime, fontSize: 12, fontWeight: 600,
                                        cursor: "pointer", transition: "all 0.15s",
                                        fontFamily: "'DM Sans', sans-serif", flexShrink: 0,
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(232,255,71,0.13)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "rgba(232,255,71,0.07)"}
                                    >Add</button>
                                </div>
                                <p style={{ fontSize: 10, color: t.faint, marginTop: 8, letterSpacing: "0.03em" }}>Press Enter or comma to add</p>
                            </Card>
                        </div>

                        {/* Save row */}
                        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 14 }}>
                            {saved && (
                                <span style={{ fontSize: 12, color: t.green, display: "flex", alignItems: "center", gap: 6, animation: "fadeUp 0.3s ease" }}>
                                    <span style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(134,239,172,0.15)", border: "1px solid rgba(134,239,172,0.3)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>✓</span>
                                    Changes saved
                                </span>
                            )}
                            <button onClick={handleSave} className="save-btn" style={{
                                padding: "11px 30px", borderRadius: 11,
                                background: t.lime, color: "#0a0a0e",
                                border: "none", cursor: "pointer",
                                fontWeight: 700, fontSize: 13,
                                letterSpacing: "-0.01em",
                                fontFamily: "'DM Sans', sans-serif",
                                transition: "all 0.2s",
                                boxShadow: "0 4px 16px rgba(232,255,71,0.2)",
                            }}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {/* ━━ ACCOUNT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                {active === "Account" && (
                    <div className="anim" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

                        {/* Plan card */}
                        <Card title="Current Plan" style={{ position: "relative", overflow: "hidden" }}>
                            {/* Top lime accent */}
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${t.lime},${t.limeD},transparent)` }} />

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0 16px" }}>
                                <div>
                                    <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "1.6rem", letterSpacing: "-0.04em", color: t.lime, marginBottom: 3 }}>
                                        {data.plan} Plan
                                    </div>
                                    <div style={{ fontSize: 11.5, color: t.faint }}>Full access to all features</div>
                                </div>
                                <span style={{
                                    display: "inline-flex", alignItems: "center", gap: 5,
                                    padding: "4px 11px", borderRadius: 100,
                                    background: "rgba(232,255,71,0.07)",
                                    border: "1px solid rgba(232,255,71,0.2)",
                                    fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
                                    color: t.lime, textTransform: "uppercase",
                                }}>
                                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.lime, boxShadow: "0 0 6px rgba(232,255,71,0.8)" }} />
                                    Active
                                </span>
                            </div>

                            <div style={{ paddingTop: 14, borderTop: `1px solid ${t.border}` }}>
                                {["Unlimited resume builds", "AI bullet enhancement", "PDF export", "ATS score analysis", "Job category prediction"].map(f => (
                                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                        <span style={{
                                            width: 17, height: 17, borderRadius: "50%",
                                            background: "rgba(232,255,71,0.1)",
                                            border: "1px solid rgba(232,255,71,0.2)",
                                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 8, color: t.lime, flexShrink: 0,
                                        }}>✓</span>
                                        <span style={{ fontSize: 12.5, color: t.muted }}>{f}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Account details */}
                        <Card title="Account Details">
                            {[
                                { label: "Member Since", val: data.joined       },
                                { label: "Email",        val: data.email        },
                                { label: "Account ID",   val: "usr_hj8k29mx"   },
                                { label: "2FA Status",   val: "Not enabled"     },
                            ].map(r => (
                                <div key={r.label} style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "11px 0", borderBottom: `1px solid ${t.border}`,
                                }}>
                                    <span style={{ fontSize: 12, color: t.faint, letterSpacing: "0.01em" }}>{r.label}</span>
                                    <span style={{ fontSize: 12, color: t.muted, fontWeight: 500 }}>{r.val}</span>
                                </div>
                            ))}
                            <div style={{ paddingTop: 16 }}>
                                <button style={{
                                    width: "100%", padding: "10px", borderRadius: 10,
                                    border: `1px solid ${t.border}`, background: t.surface,
                                    color: t.muted, fontSize: 12, cursor: "pointer",
                                    fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                                    fontWeight: 500,
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.borderColor = t.border2; e.currentTarget.style.background = t.surface2; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = t.surface; }}
                                >Change Password</button>
                            </div>
                        </Card>

                        {/* Danger zone — full width */}
                        <div style={{
                            gridColumn: "1 / -1",
                            borderRadius: 16,
                            border: "1px solid rgba(249,168,212,0.12)",
                            background: "rgba(249,168,212,0.02)",
                            overflow: "hidden",
                        }}>
                            {/* Top pink accent line */}
                            <div style={{ height: 2, background: "linear-gradient(90deg,rgba(249,168,212,0.5),transparent)" }} />
                            <div style={{ padding: "20px 24px" }}>
                                <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(249,168,212,0.1)" }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(249,168,212,0.4)" }}>
                                        Danger Zone
                                    </span>
                                </div>
                                {[
                                    { title: "Sign out of all devices", sub: "Revoke all active sessions immediately.", btn: "Sign out all", strong: false, onClick: null },
                                    { title: "Log out",                 sub: "End your current session.",             btn: "Log out",      strong: false, onClick: onLogout },
                                    { title: "Delete account",          sub: "Permanently delete all data. This cannot be undone.", btn: "Delete account", strong: true, onClick: null },
                                ].map((item, i, arr) => (
                                    <div key={item.title}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0" }}>
                                            <div>
                                                <div style={{ fontSize: 13, color: item.strong ? t.pink : t.text, fontWeight: 500, marginBottom: 3 }}>{item.title}</div>
                                                <div style={{ fontSize: 11, color: t.faint }}>{item.sub}</div>
                                            </div>
                                            <DangerBtn onClick={item.onClick} strong={item.strong}>{item.btn}</DangerBtn>
                                        </div>
                                        {i < arr.length - 1 && <div style={{ height: 1, background: "rgba(249,168,212,0.07)" }} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Card({ title, children, style = {} }) {
    return (
        <div style={{
            borderRadius: 16,
            border: `1px solid ${t.border}`,
            background: t.surface,
            padding: "20px 22px",
            ...style,
        }}>
            {title && (
                <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${t.border}` }}>
                    <span style={{
                        fontSize: 9.5, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.1em",
                        color: "rgba(240,237,232,0.28)",
                    }}>{title}</span>
                </div>
            )}
            {children}
        </div>
    );
}

function DangerBtn({ children, onClick, strong }) {
    return (
        <button onClick={onClick} style={{
            padding: "8px 16px", borderRadius: 9, fontSize: 12, fontWeight: 600,
            background: strong ? "rgba(249,168,212,0.07)" : "transparent",
            border: `1px solid ${strong ? "rgba(249,168,212,0.22)" : "rgba(249,168,212,0.12)"}`,
            color: t.pink, cursor: "pointer", transition: "all 0.15s",
            fontFamily: "'DM Sans', sans-serif", flexShrink: 0,
        }}
            onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(249,168,212,0.12)";
                e.currentTarget.style.borderColor = "rgba(249,168,212,0.32)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = strong ? "rgba(249,168,212,0.07)" : "transparent";
                e.currentTarget.style.borderColor = strong ? "rgba(249,168,212,0.22)" : "rgba(249,168,212,0.12)";
            }}
        >
            {children}
        </button>
    );
}