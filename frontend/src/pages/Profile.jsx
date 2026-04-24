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








import { useState, useEffect, useRef } from "react";

// ─── tokens ───────────────────────────────────────────────────────────────────
const C = {
    bg: "#07070b",
    panel: "#0c0c12",
    card: "#101018",
    card2: "#13131d",
    border: "rgba(255,255,255,0.06)",
    border2: "rgba(255,255,255,0.1)",
    text: "#edeae4",
    muted: "rgba(237,234,228,0.5)",
    faint: "rgba(237,234,228,0.24)",
    lime: "#d4f53c",
    limeD: "#a8c620",
    limeGlow: "rgba(212,245,60,0.12)",
    pink: "#f0abcb",
    blue: "#7eb8f7",
    green: "#6ee7b7",
    amber: "#fbbf5a",
};

const F = {
    sans: "'DM Sans', sans-serif",
    display: "'Fraunces', serif",
};

// ─── tiny helpers ──────────────────────────────────────────────────────────────
const px = n => `${n}px`;

const Pill = ({ children, color = C.lime, bg, border }) => (
    <span style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "3px 10px", borderRadius: 100,
        background: bg ?? `rgba(212,245,60,0.08)`,
        border: `1px solid ${border ?? "rgba(212,245,60,0.22)"}`,
        fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
        color, textTransform: "uppercase", whiteSpace: "nowrap",
        fontFamily: F.sans,
    }}>
        {children}
    </span>
);

const SkillTag = ({ label, tier = "core" }) => {
    const map = {
        core: { color: C.lime, bg: "rgba(212,245,60,0.07)", border: "rgba(212,245,60,0.18)" },
        sec: { color: C.blue, bg: "rgba(126,184,247,0.07)", border: "rgba(126,184,247,0.18)" },
        tool: { color: C.amber, bg: "rgba(251,191,90,0.07)", border: "rgba(251,191,90,0.18)" },
    };
    const { color, bg, border } = map[tier];
    return (
        <span style={{
            display: "inline-block", padding: "4px 12px", borderRadius: 7,
            background: bg, border: `1px solid ${border}`,
            color, fontSize: 11.5, fontWeight: 500,
            letterSpacing: "-0.01em", fontFamily: F.sans,
        }}>
            {label}
        </span>
    );
};

const Divider = ({ my = 16 }) => (
    <div style={{ height: 1, background: C.border, margin: `${my}px 0` }} />
);

// ─── animated number ───────────────────────────────────────────────────────────
function AnimNum({ target, suffix = "" }) {
    const [val, setVal] = useState(0);
    const raf = useRef();
    useEffect(() => {
        const start = performance.now();
        const dur = 900;
        const tick = now => {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(ease * target));
            if (p < 1) raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf.current);
    }, [target]);
    return <>{val}{suffix}</>;
}

// ─── stat ring ─────────────────────────────────────────────────────────────────
function Ring({ pct, color, size = 52, stroke = 5 }) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={color} strokeWidth={stroke}
                strokeDasharray={circ} strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(.22,1,.36,1)" }} />
        </svg>
    );
}

// ─── mini bar ──────────────────────────────────────────────────────────────────
function Bar({ pct, color }) {
    return (
        <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden", flex: 1 }}>
            <div style={{
                height: "100%", borderRadius: 4, background: color,
                width: `${pct}%`, transition: "width 0.8s cubic-bezier(.22,1,.36,1)",
            }} />
        </div>
    );
}

// ─── section heading ───────────────────────────────────────────────────────────
const SH = ({ label }) => (
    <div style={{
        fontSize: 9.5, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.13em", color: C.faint,
        marginBottom: 14, fontFamily: F.sans,
    }}>{label}</div>
);

// ─── card ──────────────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
    <div style={{
        background: C.card, borderRadius: 18,
        border: `1px solid ${C.border}`,
        padding: "22px 24px",
        ...style,
    }}>
        {children}
    </div>
);

// ─── nav tabs ──────────────────────────────────────────────────────────────────
const TABS = ["Profile", "Skills", "Activity", "Settings"];

function TabBar({ active, onChange }) {
    return (
        <div style={{
            display: "flex", gap: 2,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${C.border}`,
            borderRadius: 12, padding: 4,
        }}>
            {TABS.map(t => {
                const on = active === t;
                return (
                    <button key={t} onClick={() => onChange(t)} style={{
                        flex: 1, padding: "8px 0", borderRadius: 9,
                        background: on ? C.card2 : "transparent",
                        border: on ? `1px solid ${C.border2}` : "1px solid transparent",
                        color: on ? C.text : C.faint,
                        fontSize: 12, fontWeight: on ? 600 : 400,
                        cursor: "pointer", fontFamily: F.sans,
                        letterSpacing: "-0.01em",
                        transition: "all 0.18s",
                    }}>
                        {t}
                    </button>
                );
            })}
        </div>
    );
}

// ─── data ──────────────────────────────────────────────────────────────────────
const USER = {
    name: "Harshit Gupta",
    role: "Full-Stack Engineer",
    company: "CareerCrafter · Pro",
    location: "Dehradun, India",
    email: "harshit@careercrafter.com",
    phone: "+91 98765 43210",
    joined: "January 2025",
    bio: "Building AI-integrated developer tools and scalable full-stack systems. Passionate about great UX, open source, and shipping things that matter.",
    github: "github.com/harshit-46",
    linkedin: "linkedin.com/in/harshithere",
    portfolio: "harshit.dev",
    skills: {
        core: ["React", "TypeScript", "Python", "FastAPI"],
        secondary: ["MongoDB", "Docker", "Node.js", "Redis"],
        tools: ["Figma", "Vercel", "GitHub Actions", "Postman"],
    },
    stats: {
        resumes: 4,
        ats: 87,
        interviews: 12,
        downloads: 18,
    },
    activity: [
        { label: "SWE — Google", ats: 93, date: "Apr 20", color: C.lime },
        { label: "Full-Stack — Startup", ats: 85, date: "Apr 14", color: C.green },
        { label: "React Eng — Fintech", ats: 82, date: "Apr 8", color: C.blue },
        { label: "Backend — SaaS", ats: 78, date: "Apr 1", color: C.amber },
    ],
};

// ─── PROFILE TAB ──────────────────────────────────────────────────────────────
function ProfileTab({ user }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* bio card */}
            <Card>
                <SH label="About" />
                <p style={{
                    fontSize: 13.5, color: C.muted, lineHeight: 1.8,
                    fontFamily: F.sans, margin: 0,
                }}>{user.bio}</p>
                <Divider my={18} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}>
                    {[
                        { k: "Email", v: user.email },
                        { k: "Phone", v: user.phone },
                        { k: "Location", v: user.location },
                        { k: "Joined", v: user.joined },
                    ].map(({ k, v }) => (
                        <div key={k}>
                            <div style={{ fontSize: 9.5, color: C.faint, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: F.sans, marginBottom: 3 }}>{k}</div>
                            <div style={{ fontSize: 13, color: C.muted, fontFamily: F.sans }}>{v}</div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* links */}
            <Card>
                <SH label="Links" />
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {[
                        { label: "GitHub", href: user.github, icon: "⎇" },
                        { label: "LinkedIn", href: user.linkedin, icon: "in" },
                        { label: "Portfolio", href: user.portfolio, icon: "⚡" },
                    ].map((l, i, arr) => (
                        <div key={l.label}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 9,
                                        background: "rgba(255,255,255,0.04)",
                                        border: `1px solid ${C.border}`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 11, color: C.faint, fontFamily: F.sans, flexShrink: 0,
                                    }}>{l.icon}</div>
                                    <div>
                                        <div style={{ fontSize: 10, color: C.faint, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: F.sans, marginBottom: 2 }}>{l.label}</div>
                                        <div style={{ fontSize: 12.5, color: C.muted, fontFamily: F.sans }}>{l.href}</div>
                                    </div>
                                </div>
                                <div style={{
                                    fontSize: 11, color: C.lime, padding: "5px 12px", borderRadius: 8,
                                    background: "rgba(212,245,60,0.06)", border: "1px solid rgba(212,245,60,0.16)",
                                    cursor: "pointer", fontFamily: F.sans, fontWeight: 600,
                                }}>Visit</div>
                            </div>
                            {i < arr.length - 1 && <Divider my={0} />}
                        </div>
                    ))}
                </div>
            </Card>

        </div>
    );
}

// ─── SKILLS TAB ───────────────────────────────────────────────────────────────
function SkillsTab({ user }) {
    const sections = [
        { label: "Core Stack", tier: "core", items: user.skills.core },
        { label: "Secondary Stack", tier: "sec", items: user.skills.secondary },
        { label: "Tools & Platforms", tier: "tool", items: user.skills.tools },
    ];
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {sections.map(s => (
                <Card key={s.label}>
                    <SH label={s.label} />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {s.items.map(sk => <SkillTag key={sk} label={sk} tier={s.tier} />)}
                    </div>
                </Card>
            ))}

            {/* proficiency bars */}
            <Card>
                <SH label="Proficiency" />
                {[
                    { lang: "React / TypeScript", pct: 92, color: C.lime },
                    { lang: "Python / FastAPI", pct: 85, color: C.green },
                    { lang: "MongoDB", pct: 78, color: C.blue },
                    { lang: "Docker / DevOps", pct: 65, color: C.amber },
                ].map(({ lang, pct, color }) => (
                    <div key={lang} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                            <span style={{ fontSize: 12, color: C.muted, fontFamily: F.sans }}>{lang}</span>
                            <span style={{ fontSize: 12, color, fontWeight: 600, fontFamily: F.sans }}>{pct}%</span>
                        </div>
                        <Bar pct={pct} color={color} />
                    </div>
                ))}
            </Card>
        </div>
    );
}

// ─── ACTIVITY TAB ─────────────────────────────────────────────────────────────
function ActivityTab({ user }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {[
                    { label: "Resumes", val: user.stats.resumes, suffix: "", color: C.lime },
                    { label: "Avg ATS", val: user.stats.ats, suffix: "%", color: C.green },
                    { label: "Interviews", val: user.stats.interviews, suffix: "", color: C.blue },
                    { label: "Downloads", val: user.stats.downloads, suffix: "", color: C.amber },
                ].map(({ label, val, suffix, color }) => (
                    <div key={label} style={{
                        background: C.card, border: `1px solid ${C.border}`,
                        borderRadius: 16, padding: "18px 16px",
                        position: "relative", overflow: "hidden",
                    }}>
                        <div style={{
                            position: "absolute", top: 0, left: 0, right: 0, height: 2,
                            background: `linear-gradient(90deg, ${color}, transparent)`,
                            opacity: 0.5,
                        }} />
                        <div style={{
                            fontFamily: F.display, fontWeight: 800,
                            fontSize: "1.8rem", letterSpacing: "-0.04em",
                            color, lineHeight: 1, marginBottom: 6,
                        }}>
                            <AnimNum target={val} suffix={suffix} />
                        </div>
                        <div style={{ fontSize: 9.5, color: C.faint, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: F.sans }}>
                            {label}
                        </div>
                    </div>
                ))}
            </div>

            {/* recent resumes */}
            <Card>
                <SH label="Recent Resumes" />
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {user.activity.map((r, i, arr) => (
                        <div key={r.label}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0" }}>
                                <div style={{
                                    width: 38, height: 38, borderRadius: 10,
                                    background: `${r.color}12`, border: `1px solid ${r.color}30`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontFamily: F.display, fontWeight: 900, fontSize: 14,
                                    color: r.color, flexShrink: 0,
                                }}>{r.ats}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 13, color: C.text, fontFamily: F.sans, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <Bar pct={r.ats} color={r.color} />
                                        <span style={{ fontSize: 11, color: r.color, fontWeight: 600, fontFamily: F.sans, flexShrink: 0 }}>{r.ats}%</span>
                                    </div>
                                </div>
                                <div style={{ fontSize: 11, color: C.faint, fontFamily: F.sans, flexShrink: 0 }}>{r.date}</div>
                            </div>
                            {i < arr.length - 1 && <Divider my={0} />}
                        </div>
                    ))}
                </div>
            </Card>

            {/* ATS rings */}
            <Card>
                <SH label="ATS Breakdown" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                    {[
                        { label: "Keywords matched", pct: 91, color: C.lime },
                        { label: "Format score", pct: 84, color: C.blue },
                        { label: "Readability", pct: 88, color: C.green },
                    ].map(({ label, pct, color }) => (
                        <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                            <div style={{ position: "relative" }}>
                                <Ring pct={pct} color={color} size={64} stroke={5} />
                                <div style={{
                                    position: "absolute", inset: 0,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontFamily: F.display, fontWeight: 800, fontSize: 13,
                                    color,
                                }}>{pct}</div>
                            </div>
                            <div style={{ fontSize: 11, color: C.faint, textAlign: "center", fontFamily: F.sans, lineHeight: 1.4 }}>{label}</div>
                        </div>
                    ))}
                </div>
            </Card>

        </div>
    );
}

// ─── SETTINGS TAB ─────────────────────────────────────────────────────────────
function SettingsTab({ user }) {
    const [notify, setNotify] = useState({ ats: true, tips: false, news: true });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* plan */}
            <Card style={{ position: "relative", overflow: "hidden" }}>
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(90deg, ${C.lime}, ${C.limeD}, transparent)`,
                }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 6 }}>
                    <div>
                        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: "1.5rem", letterSpacing: "-0.04em", color: C.lime, marginBottom: 3 }}>
                            Pro Plan
                        </div>
                        <div style={{ fontSize: 11.5, color: C.faint, fontFamily: F.sans }}>Renews June 12, 2025</div>
                    </div>
                    <Pill>Active</Pill>
                </div>
                <Divider my={16} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {["Unlimited resumes", "AI enhancement", "PDF export", "ATS analysis", "Job prediction"].map(f => (
                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{
                                width: 16, height: 16, borderRadius: "50%",
                                background: "rgba(212,245,60,0.1)", border: "1px solid rgba(212,245,60,0.2)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 8, color: C.lime, flexShrink: 0,
                            }}>✓</div>
                            <span style={{ fontSize: 12, color: C.muted, fontFamily: F.sans }}>{f}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* notifications */}
            <Card>
                <SH label="Notifications" />
                {[
                    { key: "ats", label: "ATS score alerts", sub: "Notify when score changes" },
                    { key: "tips", label: "Weekly resume tips", sub: "Improvement suggestions" },
                    { key: "news", label: "Product updates", sub: "New features & changelog" },
                ].map(({ key, label, sub }, i, arr) => (
                    <div key={key}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0" }}>
                            <div>
                                <div style={{ fontSize: 13, color: C.text, fontFamily: F.sans, marginBottom: 2 }}>{label}</div>
                                <div style={{ fontSize: 11, color: C.faint, fontFamily: F.sans }}>{sub}</div>
                            </div>
                            {/* toggle */}
                            <div onClick={() => setNotify(p => ({ ...p, [key]: !p[key] }))}
                                style={{
                                    width: 40, height: 22, borderRadius: 100,
                                    background: notify[key] ? C.lime : "rgba(255,255,255,0.08)",
                                    position: "relative", cursor: "pointer",
                                    transition: "background 0.2s", flexShrink: 0,
                                }}>
                                <div style={{
                                    position: "absolute", top: 3, left: notify[key] ? 21 : 3,
                                    width: 16, height: 16, borderRadius: "50%",
                                    background: notify[key] ? "#07070b" : "rgba(255,255,255,0.4)",
                                    transition: "left 0.2s",
                                }} />
                            </div>
                        </div>
                        {i < arr.length - 1 && <Divider my={0} />}
                    </div>
                ))}
            </Card>

            {/* account */}
            <Card>
                <SH label="Account" />
                {[
                    { label: "Member since", val: user.joined },
                    { label: "Account ID", val: "usr_hj8k29mx" },
                    { label: "2FA", val: "Not enabled", warn: true },
                ].map(({ label, val, warn }, i, arr) => (
                    <div key={label}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
                            <span style={{ fontSize: 12, color: C.faint, fontFamily: F.sans }}>{label}</span>
                            <span style={{ fontSize: 12, fontFamily: F.sans, fontWeight: 500, color: warn ? C.pink : C.muted }}>{val}</span>
                        </div>
                        {i < arr.length - 1 && <Divider my={0} />}
                    </div>
                ))}
                <div style={{ paddingTop: 14 }}>
                    <button style={{
                        width: "100%", padding: "10px", borderRadius: 10,
                        border: `1px solid ${C.border2}`,
                        background: "rgba(255,255,255,0.03)",
                        color: C.muted, fontSize: 12, cursor: "pointer",
                        fontFamily: F.sans, fontWeight: 500,
                        transition: "all 0.15s",
                    }}>Change Password</button>
                </div>
            </Card>

            {/* danger */}
            <div style={{
                borderRadius: 18, border: "1px solid rgba(240,171,203,0.12)",
                background: "rgba(240,171,203,0.02)", overflow: "hidden",
            }}>
                <div style={{ height: 2, background: "linear-gradient(90deg,rgba(240,171,203,0.5),transparent)" }} />
                <div style={{ padding: "20px 24px" }}>
                    <SH label="Danger Zone" />
                    {[
                        { t: "Sign out all devices", s: "Revoke all active sessions.", btn: "Sign out", strong: false },
                        { t: "Log out", s: "End your current session.", btn: "Log out", strong: false },
                        { t: "Delete account", s: "Permanently delete all data.", btn: "Delete", strong: true },
                    ].map(({ t, s, btn, strong }, i, arr) => (
                        <div key={t}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0" }}>
                                <div>
                                    <div style={{ fontSize: 13, color: strong ? C.pink : C.text, fontFamily: F.sans, fontWeight: 500, marginBottom: 2 }}>{t}</div>
                                    <div style={{ fontSize: 11, color: C.faint, fontFamily: F.sans }}>{s}</div>
                                </div>
                                <button style={{
                                    padding: "7px 15px", borderRadius: 9, fontSize: 11.5, fontWeight: 600,
                                    background: strong ? "rgba(240,171,203,0.07)" : "transparent",
                                    border: `1px solid ${strong ? "rgba(240,171,203,0.22)" : "rgba(240,171,203,0.12)"}`,
                                    color: C.pink, cursor: "pointer", fontFamily: F.sans,
                                    transition: "all 0.15s", flexShrink: 0,
                                }}>{btn}</button>
                            </div>
                            {i < arr.length - 1 && <Divider my={0} />}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
export default function ProfilePage({ user: userProp, onLogout }) {
    const user = { ...USER, ...(userProp || {}) };
    const [tab, setTab] = useState("Profile");

    const initial = user.name?.[0]?.toUpperCase() ?? "U";

    return (
        <div style={{ background: C.bg, minHeight: "100vh", fontFamily: F.sans, color: C.text }}>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tab-panel { animation: fadeSlideUp 0.32s cubic-bezier(.22,1,.36,1) both; }

        @keyframes haloSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .avatar-halo { animation: haloSpin 12s linear infinite; }
      `}</style>

            {/* ── SIDEBAR + MAIN layout ────────────────────────────────────────── */}
            <div style={{ display: "flex", minHeight: "100vh" }}>

                {/* SIDEBAR */}
                <aside style={{
                    width: 260, flexShrink: 0,
                    background: C.panel,
                    borderRight: `1px solid ${C.border}`,
                    display: "flex", flexDirection: "column",
                    padding: "36px 24px",
                    position: "sticky", top: 0, alignSelf: "flex-start",
                    minHeight: "100vh",
                }}>

                    {/* wordmark */}
                    <div style={{
                        fontFamily: F.display, fontWeight: 900,
                        fontSize: "1.1rem", letterSpacing: "-0.05em",
                        color: C.lime, marginBottom: 40,
                    }}>
                        career<span style={{ color: C.faint }}>crafter</span>
                    </div>

                    {/* avatar */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 32 }}>
                        <div style={{ position: "relative", width: 88, height: 88 }}>
                            {/* spinning halo */}
                            <div className="avatar-halo" style={{
                                position: "absolute", inset: -3, borderRadius: "50%",
                                background: `conic-gradient(from 0deg, ${C.lime}, ${C.limeD}, rgba(212,245,60,0.15), ${C.lime})`,
                                opacity: 0.55,
                            }} />
                            <div style={{
                                position: "relative", width: "100%", height: "100%",
                                borderRadius: "50%",
                                background: `linear-gradient(145deg, ${C.lime}, ${C.limeD})`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontFamily: F.display, fontWeight: 900, fontSize: "2rem",
                                color: C.bg, border: `3px solid ${C.bg}`,
                            }}>{initial}</div>
                            {/* online dot */}
                            <div style={{
                                position: "absolute", bottom: 5, right: 5,
                                width: 12, height: 12, borderRadius: "50%",
                                background: C.lime, border: `2px solid ${C.bg}`,
                            }} />
                        </div>

                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: "1.15rem", letterSpacing: "-0.04em", color: C.text, marginBottom: 4 }}>
                                {user.name}
                            </div>
                            <div style={{ fontSize: 11.5, color: C.faint, marginBottom: 8 }}>{user.role}</div>
                            <Pill>{user.company.split("·")[1]?.trim() ?? "Free"}</Pill>
                        </div>
                    </div>

                    {/* quick stats */}
                    <div style={{
                        background: C.card, border: `1px solid ${C.border}`,
                        borderRadius: 14, padding: "14px 16px", marginBottom: 28,
                    }}>
                        {[
                            { label: "Resumes", val: user.stats.resumes, color: C.lime },
                            { label: "Avg ATS", val: `${user.stats.ats}%`, color: C.green },
                            { label: "Interviews", val: user.stats.interviews, color: C.blue },
                        ].map(({ label, val, color }, i, arr) => (
                            <div key={label}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
                                    <span style={{ fontSize: 11.5, color: C.faint }}>{label}</span>
                                    <span style={{ fontSize: 13.5, fontFamily: F.display, fontWeight: 900, color, letterSpacing: "-0.03em" }}>{val}</span>
                                </div>
                                {i < arr.length - 1 && <Divider my={0} />}
                            </div>
                        ))}
                    </div>

                    {/* nav links */}
                    <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                        {TABS.map(t => {
                            const on = tab === t;
                            const icons = { Profile: "◉", Skills: "◈", Activity: "◎", Settings: "⊙" };
                            return (
                                <button key={t} onClick={() => setTab(t)} style={{
                                    display: "flex", alignItems: "center", gap: 10,
                                    padding: "10px 12px", borderRadius: 10,
                                    background: on ? C.limeGlow : "transparent",
                                    border: on ? "1px solid rgba(212,245,60,0.15)" : "1px solid transparent",
                                    color: on ? C.lime : C.faint,
                                    fontSize: 13, fontWeight: on ? 600 : 400,
                                    cursor: "pointer", textAlign: "left",
                                    fontFamily: F.sans, letterSpacing: "-0.01em",
                                    transition: "all 0.15s",
                                }}>
                                    <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{icons[t]}</span>
                                    {t}
                                    {on && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: C.lime }} />}
                                </button>
                            );
                        })}
                    </nav>

                    {/* logout */}
                    <button onClick={onLogout} style={{
                        marginTop: 24, display: "flex", alignItems: "center", gap: 8,
                        padding: "10px 12px", borderRadius: 10,
                        background: "transparent", border: "1px solid rgba(240,171,203,0.12)",
                        color: "rgba(240,171,203,0.5)", fontSize: 12,
                        cursor: "pointer", fontFamily: F.sans, fontWeight: 500,
                        transition: "all 0.15s",
                    }}>
                        <span>→</span> Log out
                    </button>
                </aside>

                {/* MAIN */}
                <main style={{ flex: 1, padding: "36px 40px", maxWidth: 720 }}>

                    {/* page header */}
                    <div style={{ marginBottom: 28 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
                            <div>
                                <h1 style={{
                                    fontFamily: F.display, fontWeight: 900,
                                    fontSize: "2.2rem", letterSpacing: "-0.05em",
                                    color: C.text, marginBottom: 5, lineHeight: 1.1,
                                }}>
                                    {tab === "Profile" && "Your Profile"}
                                    {tab === "Skills" && "Skills & Stack"}
                                    {tab === "Activity" && "Activity"}
                                    {tab === "Settings" && "Settings"}
                                </h1>
                                <p style={{ fontSize: 13, color: C.faint, fontFamily: F.sans, lineHeight: 1.6 }}>
                                    {tab === "Profile" && `${user.location} · ${user.company}`}
                                    {tab === "Skills" && "Core, secondary & tooling skills"}
                                    {tab === "Activity" && "Resume performance at a glance"}
                                    {tab === "Settings" && "Account, plan & notifications"}
                                </p>
                            </div>
                        </div>

                        <TabBar active={tab} onChange={setTab} />
                    </div>

                    {/* panel */}
                    <div key={tab} className="tab-panel">
                        {tab === "Profile" && <ProfileTab user={user} />}
                        {tab === "Skills" && <SkillsTab user={user} />}
                        {tab === "Activity" && <ActivityTab user={user} />}
                        {tab === "Settings" && <SettingsTab user={user} />}
                    </div>
                </main>
            </div>
        </div>
    );
}