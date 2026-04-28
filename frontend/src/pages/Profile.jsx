import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

// ── Design tokens (matches existing system) ───────────────────────────────────
const t = {
    bg: "#0a0a0e",
    surface: "rgba(255,255,255,0.028)",
    surface2: "rgba(255,255,255,0.055)",
    surface3: "rgba(255,255,255,0.085)",
    text: "#f0ede8",
    muted: "rgba(240,237,232,0.48)",
    faint: "rgba(240,237,232,0.22)",
    border: "rgba(255,255,255,0.07)",
    border2: "rgba(255,255,255,0.13)",
    lime: "#E8FF47",
    limeDim: "rgba(232,255,71,0.08)",
    limeGlow: "rgba(232,255,71,0.18)",
    green: "#86efac",
    greenDim: "rgba(134,239,172,0.08)",
    red: "#fca5a5",
    gold: "#fcd34d",
    blue: "#93c5fd",
};

const GLOBAL_CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,700;0,800;0,900;1,300;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

    @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
    @keyframes slideUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes floatDot  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
    @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes shimmer   { from{background-position:-600px 0} to{background-position:600px 0} }
    @keyframes glow      { 0%,100%{opacity:0.5} 50%{opacity:1} }

    .pv-edit-btn {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 10px 22px; border-radius: 12px;
        font-size: 13px; font-weight: 700; font-family: 'DM Sans', sans-serif;
        background: #E8FF47; color: #0a0a0e; border: none; cursor: pointer;
        box-shadow: 0 4px 20px rgba(232,255,71,0.22), 0 0 0 1px rgba(232,255,71,0.12);
        transition: all 0.18s ease;
    }
    .pv-edit-btn:hover {
        background: #f5ff6e;
        transform: translateY(-1px);
        box-shadow: 0 8px 28px rgba(232,255,71,0.32);
    }

    .pv-skill-tag {
        display: inline-flex; align-items: center;
        padding: 5px 12px; border-radius: 9px;
        font-size: 12px; font-weight: 600;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.09);
        color: rgba(240,237,232,0.65);
        transition: all 0.15s;
    }
    .pv-skill-tag:hover {
        border-color: rgba(232,255,71,0.25);
        background: rgba(232,255,71,0.05);
        color: rgba(240,237,232,0.9);
    }

    .pv-social-link {
        display: flex; align-items: center; gap: 10px;
        padding: 12px 14px; border-radius: 12px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.07);
        color: rgba(240,237,232,0.55);
        font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif;
        text-decoration: none;
        transition: all 0.18s ease;
    }
    .pv-social-link:hover {
        background: rgba(255,255,255,0.06);
        border-color: rgba(255,255,255,0.13);
        color: rgba(240,237,232,0.9);
        transform: translateX(3px);
    }

    .pv-stat-card {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        padding: 16px 12px; border-radius: 14px;
        background: rgba(255,255,255,0.028);
        border: 1px solid rgba(255,255,255,0.07);
        transition: all 0.18s;
        text-align: center;
    }
    .pv-stat-card:hover {
        background: rgba(255,255,255,0.05);
        border-color: rgba(255,255,255,0.12);
    }

    .pv-info-row {
        display: flex; align-items: flex-start; gap: 10px;
        padding: 11px 0;
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .pv-info-row:last-child { border-bottom: none; }

    .pv-section {
        border-radius: 20px;
        background: rgba(255,255,255,0.028);
        border: 1px solid rgba(255,255,255,0.07);
        overflow: hidden;
        animation: slideUp 0.45s cubic-bezier(0.22,1,0.36,1) both;
    }
`;

// ── Icons ─────────────────────────────────────────────────────────────────────
const Ic = {
    edit:     (c=t.text,s=14)  => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    map:      (c=t.faint,s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    book:     (c=t.faint,s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    mail:     (c=t.faint,s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    link:     (c=t.faint,s=13) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    github:   (c=t.muted,s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>,
    linkedin: (c=t.muted,s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    globe:    (c=t.muted,s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    twitter:  (c=t.muted,s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    check:    (c=t.green,s=13) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    externalLink: (c=t.faint,s=11) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
    const bar = (w, h = 12, mb = 0, mt = 0) => (
        <div style={{ height: h, width: w, borderRadius: h / 2, marginBottom: mb, marginTop: mt, background: `linear-gradient(90deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 100%)`, backgroundSize: "600px 100%", animation: "shimmer 1.8s ease-in-out infinite" }} />
    );
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Hero card skeleton */}
            <div style={{ borderRadius: 24, background: t.surface, border: `1px solid ${t.border}`, padding: 28 }}>
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                    <div style={{ width: 96, height: 96, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.06)", animation: "pulse 1.6s ease-in-out infinite" }} />
                    <div style={{ flex: 1 }}>
                        {bar("45%", 20, 10)}{bar("30%", 13, 8)}{bar("22%", 11)}
                    </div>
                </div>
                <div style={{ height: 1, background: t.border, margin: "22px 0" }} />
                {bar("100%", 10, 8)}{bar("80%", 10)}
            </div>
            {[1, 2].map(i => (
                <div key={i} style={{ borderRadius: 20, background: t.surface, border: `1px solid ${t.border}`, padding: 22 }}>
                    {bar("35%", 13, 14)}{bar("100%", 10, 8)}{bar("70%", 10, 8)}{bar("50%", 10)}
                </div>
            ))}
        </div>
    );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, icon, accentColor = t.lime, delay = 0, children }) {
    return (
        <div className="pv-section" style={{ animationDelay: `${delay}ms` }}>
            <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${accentColor},transparent)` }} />
            <div style={{ padding: "18px 22px 0", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: `rgba(${accentColor === t.lime ? "232,255,71" : accentColor === t.blue ? "147,197,253" : "134,239,172"},0.08)`, border: `1px solid rgba(${accentColor === t.lime ? "232,255,71" : accentColor === t.blue ? "147,197,253" : "134,239,172"},0.18)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {icon}
                </div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, color: t.text, margin: 0 }}>{title}</p>
            </div>
            <div style={{ padding: "14px 22px 22px" }}>{children}</div>
        </div>
    );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function Empty({ label }) {
    return <span style={{ fontSize: 12.5, color: t.faint, fontStyle: "italic" }}>{label}</span>;
}

// ── Social icon map ───────────────────────────────────────────────────────────
const socialConfig = {
    github:    { icon: Ic.github,   label: "GitHub",      color: "#f0ede8" },
    linkedin:  { icon: Ic.linkedin, label: "LinkedIn",    color: "#93c5fd" },
    portfolio: { icon: Ic.globe,    label: "Portfolio",   color: t.lime },
    twitter:   { icon: Ic.twitter,  label: "Twitter / X", color: "#93c5fd" },
};

// ── Main component ────────────────────────────────────────────────────────────
export default function ProfileView() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/profile", { withCredentials: true });
                setProfile(res.data);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return (
        <>
            <style>{GLOBAL_CSS}</style>
            <div style={{ fontFamily: "'DM Sans',sans-serif" }}><Skeleton /></div>
        </>
    );

    if (error || !profile) return (
        <>
            <style>{GLOBAL_CSS}</style>
            <div style={{ fontFamily: "'DM Sans',sans-serif", textAlign: "center", padding: "60px 20px", color: t.muted, fontSize: 14 }}>
                Failed to load profile.{" "}
                <button onClick={() => window.location.reload()} style={{ background: "none", border: "none", color: t.lime, cursor: "pointer", fontWeight: 700 }}>Retry</button>
            </div>
        </>
    );

    const initials = profile.name
        ? profile.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
        : "?";

    const socials = Object.entries(socialConfig)
        .map(([key, cfg]) => ({ key, ...cfg, url: profile.socials?.[key] }))
        .filter(s => s.url);

    const completionFields = [
        profile.name, profile.headline, profile.bio,
        profile.location, profile.college,
        profile.skills?.length, socials.length,
    ];
    const completionScore = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

    return (
        <>
            <style>{GLOBAL_CSS}</style>
            <div style={{ fontFamily: "'DM Sans',sans-serif", display: "flex", flexDirection: "column", gap: 20 }}>

                {/* ── Page header ── */}
                <div style={{ animation: "slideUp 0.35s ease both" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 10, color: t.lime, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>Account</span>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: t.lime, opacity: 0.6, animation: "floatDot 2.2s ease-in-out infinite" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div>
                            <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 800, fontSize: "clamp(24px,3.5vw,38px)", letterSpacing: "-0.04em", color: t.text, margin: "0 0 6px", lineHeight: 1 }}>
                                My <em style={{ fontStyle: "italic", color: t.lime, textShadow: "0 0 40px rgba(232,255,71,0.3)" }}>Profile</em>
                            </h1>
                            <p style={{ fontSize: 13.5, color: t.muted, margin: 0 }}>Your public profile as seen by employers and AI tools.</p>
                        </div>
                        <button className="pv-edit-btn" onClick={() => navigate("/profile/edit")}>
                            {Ic.edit("#0a0a0e", 13)} Edit Profile
                        </button>
                    </div>
                </div>

                {/* ── Hero identity card ── */}
                <div style={{ borderRadius: 24, background: "rgba(255,255,255,0.028)", border: `1px solid rgba(255,255,255,0.07)`, overflow: "hidden", animation: "slideUp 0.4s cubic-bezier(0.22,1,0.36,1) 50ms both" }}>
                    <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#E8FF47,transparent)" }} />

                    {/* Top: avatar + name + badges */}
                    <div style={{ padding: "24px 24px 0" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
                            {/* Avatar */}
                            <div style={{ position: "relative", flexShrink: 0 }}>
                                <div style={{ width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg,rgba(232,255,71,0.15),rgba(232,255,71,0.04))", border: "2px solid rgba(232,255,71,0.22)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                    {profile.avatar
                                        ? <img src={profile.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        : <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 800, fontSize: 32, color: t.lime }}>{initials}</span>
                                    }
                                </div>
                                {/* Verified dot */}
                                {profile.is_verified && (
                                    <div title="Verified" style={{ position: "absolute", bottom: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(134,239,172,0.15)", border: "1px solid rgba(134,239,172,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {Ic.check(t.green, 11)}
                                    </div>
                                )}
                            </div>

                            {/* Name + headline + meta */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                                    <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 800, fontSize: 24, color: t.text, margin: 0, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                                        {profile.name || <em style={{ color: t.faint }}>No name set</em>}
                                    </h2>
                                    {/* Providers */}
                                    {profile.providers?.map(p => (
                                        <span key={p} style={{ padding: "3px 9px", borderRadius: 7, fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.05)", border: `1px solid rgba(255,255,255,0.1)`, color: t.faint, textTransform: "capitalize" }}>{p}</span>
                                    ))}
                                </div>

                                {/* Headline */}
                                {profile.headline
                                    ? <p style={{ fontSize: 14, color: t.muted, margin: "0 0 10px", lineHeight: 1.5 }}>{profile.headline}</p>
                                    : <p style={{ fontSize: 13, color: t.faint, fontStyle: "italic", margin: "0 0 10px" }}>No headline set</p>
                                }

                                {/* Location + college */}
                                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                                    {profile.location && (
                                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: t.faint }}>
                                            {Ic.map(t.faint, 13)} {profile.location}
                                        </span>
                                    )}
                                    {profile.college && (
                                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: t.faint }}>
                                            {Ic.book(t.faint, 13)} {profile.college}
                                        </span>
                                    )}
                                    {profile.email && (
                                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: t.faint }}>
                                            {Ic.mail(t.faint, 13)} {profile.email}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Profile completion ring (right side) */}
                            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                                <svg width={64} height={64} viewBox="0 0 64 64">
                                    <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                                    <circle cx="32" cy="32" r="26" fill="none" stroke={completionScore === 100 ? t.green : t.lime}
                                        strokeWidth="5" strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 26}`}
                                        strokeDashoffset={`${2 * Math.PI * 26 * (1 - completionScore / 100)}`}
                                        transform="rotate(-90 32 32)"
                                        style={{ transition: "stroke-dashoffset 0.6s ease" }}
                                    />
                                    <text x="32" y="32" textAnchor="middle" dominantBaseline="central"
                                        style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, fill: completionScore === 100 ? t.green : t.lime }}>
                                        {completionScore}%
                                    </text>
                                </svg>
                                <span style={{ fontSize: 10, color: t.faint, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Complete</span>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: t.border, margin: "20px 24px 0" }} />

                    {/* Email row + verification */}
                    <div style={{ padding: "14px 24px 20px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, padding: "8px 13px", borderRadius: 10, background: t.surface2, border: `1px solid ${t.border}`, fontSize: 13, color: t.muted, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {profile.email}
                        </div>
                        <div style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: profile.is_verified ? "rgba(134,239,172,0.08)" : "rgba(252,165,165,0.08)", border: `1px solid ${profile.is_verified ? "rgba(134,239,172,0.22)" : "rgba(252,165,165,0.22)"}`, color: profile.is_verified ? t.green : t.red, flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
                            {profile.is_verified ? Ic.check(t.green, 11) : null}
                            {profile.is_verified ? "Verified" : "Unverified"}
                        </div>
                    </div>

                    {/* Incomplete notice */}
                    {completionScore < 100 && (
                        <div style={{ margin: "0 24px 20px", padding: "11px 14px", borderRadius: 12, background: "rgba(232,255,71,0.04)", border: "1px solid rgba(232,255,71,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                            <p style={{ fontSize: 12, color: "rgba(232,255,71,0.7)", margin: 0 }}>
                                Profile is <strong style={{ color: t.lime }}>{completionScore}%</strong> complete — a complete profile improves AI job matching accuracy.
                            </p>
                            <button className="pv-edit-btn" style={{ padding: "6px 14px", fontSize: 12, flexShrink: 0 }} onClick={() => navigate("/profile/edit")}>
                                Complete
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Stats row ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, animation: "slideUp 0.4s cubic-bezier(0.22,1,0.36,1) 100ms both" }}>
                    {[
                        { label: "Skills", value: profile.skills?.length || 0, color: t.lime },
                        { label: "Socials", value: socials.length, color: t.blue },
                        { label: "Providers", value: profile.providers?.length || 1, color: t.green },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="pv-stat-card">
                            <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 800, fontSize: 28, color, letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</span>
                            <span style={{ fontSize: 11, color: t.faint, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 4 }}>{label}</span>
                        </div>
                    ))}
                </div>

                {/* ── Bio ── */}
                {profile.bio && (
                    <Section title="About" icon={
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={t.lime} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    } accentColor={t.lime} delay={120}>
                        <p style={{ fontSize: 13.5, color: t.muted, lineHeight: 1.75, margin: 0 }}>{profile.bio}</p>
                    </Section>
                )}

                {/* ── Skills ── */}
                <Section title="Skills & Tech Stack" icon={
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={t.lime} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                } accentColor={t.lime} delay={150}>
                    {profile.skills?.length > 0
                        ? (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {profile.skills.map(skill => (
                                    <span key={skill} className="pv-skill-tag">{skill}</span>
                                ))}
                            </div>
                        )
                        : <Empty label="No skills added yet — add them to improve job matching." />
                    }
                </Section>

                {/* ── Info details ── */}
                <Section title="Details" icon={Ic.map(t.lime, 14)} accentColor={t.lime} delay={180}>
                    <div>
                        {[
                            { icon: Ic.map(t.faint, 13),  label: "Location",    value: profile.location },
                            { icon: Ic.book(t.faint, 13), label: "College",     value: profile.college },
                            { icon: Ic.mail(t.faint, 13), label: "Email",       value: profile.email },
                        ].map(({ icon, label, value }) => (
                            <div key={label} className="pv-info-row">
                                <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 100, flexShrink: 0 }}>
                                    {icon}
                                    <span style={{ fontSize: 11, fontWeight: 700, color: t.faint, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
                                </div>
                                <span style={{ fontSize: 13.5, color: value ? t.muted : t.faint, fontStyle: value ? "normal" : "italic" }}>
                                    {value || "Not set"}
                                </span>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* ── Social links ── */}
                <Section title="Social Links" icon={Ic.link(t.blue, 13)} accentColor={t.blue} delay={210}>
                    {socials.length > 0
                        ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {socials.map(({ key, icon, label, url, color }) => (
                                    <a key={key} href={url.startsWith("http") ? url : `https://${url}`} target="_blank" rel="noopener noreferrer" className="pv-social-link">
                                        <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.08)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            {icon(color, 14)}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: t.faint, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</p>
                                            <p style={{ margin: 0, fontSize: 12.5, color: t.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</p>
                                        </div>
                                        {Ic.externalLink(t.faint, 11)}
                                    </a>
                                ))}
                            </div>
                        )
                        : <Empty label="No social links added yet." />
                    }
                </Section>
            </div>
        </>
    );
}