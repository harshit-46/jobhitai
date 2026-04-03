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

            {/* ── Top hero banner ── */}
            <div style={{
                position: "relative", overflow: "hidden",
                background: t.sidebar,
                borderBottom: `1px solid ${t.border}`,
            }}>
                {/* Grid bg decoration */}
                <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
                    backgroundSize: "52px 52px",
                }} />
                {/* Lime glow */}
                <div style={{
                    position: "absolute", top: -60, right: 80,
                    width: 320, height: 320, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(232,255,71,0.06) 0%, transparent 70%)",
                    pointerEvents: "none",
                }} />

                <div style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto" }}>
                    {/* Avatar + name row */}
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 28, marginBottom: 32 }}>
                        {/* Avatar */}
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
                            {/* Online dot */}
                            <div style={{
                                position: "absolute", bottom: 4, right: 4,
                                width: 14, height: 14, borderRadius: "50%",
                                background: t.lime, border: `2px solid ${t.bg}`,
                                boxShadow: "0 0 8px rgba(232,255,71,0.6)",
                            }} />
                        </div>

                        {/* Name + meta */}
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

                        {/* Quick links */}
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

                    {/* Tab nav */}
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

            {/* ── Page body ── */}
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 48px 80px" }}>

                {/* ━━ OVERVIEW ━━ */}
                {active === "Overview" && (
                    <div className="anim">
                        {/* Stats row */}
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
                            {/* Contact info card */}
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

                            {/* Skills card */}
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

                            {/* Resume activity card — full width */}
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

                {/* ━━ EDIT PROFILE ━━ */}
                {active === "Edit Profile" && (
                    <div className="anim">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            {/* Basic info */}
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

                            {/* Links */}
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

                            {/* Skills editor */}
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

                        {/* Save */}
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

                {/* ━━ ACCOUNT ━━ */}
                {active === "Account" && (
                    <div className="anim">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            {/* Plan card */}
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

                            {/* Account info */}
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

                            {/* Danger zone */}
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