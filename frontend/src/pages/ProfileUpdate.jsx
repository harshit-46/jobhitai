import { useEffect, useState } from "react";
import api from "../api/axios";

// ── Design tokens ─────────────────────────────────────────────────────────────
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
    redDim: "rgba(252,165,165,0.08)",
    gold: "#fcd34d",
};

const API = "/profile";

// ── Global CSS ────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
    @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px) scale(0.975)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes spin    { to{transform:rotate(360deg)} }
    @keyframes toastIn { from{opacity:0;transform:translateY(10px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.45} }
    @keyframes floatDot{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
    @keyframes shimmer { from{background-position:-600px 0} to{background-position:600px 0} }

    .pf-input {
        width: 100%; padding: 11px 14px; border-radius: 11px;
        background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
        color: #f0ede8; font-size: 13px; font-family: 'DM Sans', sans-serif;
        outline: none; transition: border-color 0.18s, background 0.18s;
        box-sizing: border-box;
    }
    .pf-input:focus { border-color: rgba(232,255,71,0.35); background: rgba(232,255,71,0.03); }
    .pf-input::placeholder { color: rgba(240,237,232,0.22); }
    .pf-input:disabled { opacity: 0.4; cursor: not-allowed; }

    .pf-textarea {
        width: 100%; padding: 11px 14px; border-radius: 11px;
        background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
        color: #f0ede8; font-size: 13px; font-family: 'DM Sans', sans-serif;
        outline: none; transition: border-color 0.18s, background 0.18s;
        box-sizing: border-box; resize: vertical; min-height: 90px;
    }
    .pf-textarea:focus { border-color: rgba(232,255,71,0.35); background: rgba(232,255,71,0.03); }
    .pf-textarea::placeholder { color: rgba(240,237,232,0.22); }

    .skill-tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 600; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); color: rgba(240,237,232,0.7); transition: all 0.15s; }
    .skill-tag:hover { border-color: rgba(252,165,165,0.3); background: rgba(252,165,165,0.06); }
    .skill-tag button { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; color: rgba(240,237,232,0.3); transition: color 0.15s; }
    .skill-tag button:hover { color: #fca5a5; }

    .danger-zone-btn { transition: all 0.18s ease; }
    .danger-zone-btn:hover { background: rgba(252,165,165,0.12) !important; border-color: rgba(252,165,165,0.35) !important; }

    .section-card { border-radius: 20px; background: rgba(255,255,255,0.028); border: 1px solid rgba(255,255,255,0.07); overflow: hidden; }
    .section-card-header { padding: 20px 22px 0; display: flex; align-items: center; justify-content: space-between; }
    .section-card-body { padding: 18px 22px 22px; }
`;

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = {
    user:    (c=t.lime,s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    edit:    (c=t.muted,s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    check:   (c=t.green,s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    x:       (c=t.faint,s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    lock:    (c=t.muted,s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    trash:   (c=t.red,s=16)   => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    warning: (c=t.red,s=14)   => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    github:  (c=t.muted,s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>,
    linkedin:(c=t.muted,s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    globe:   (c=t.muted,s=15) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    camera:  (c=t.text,s=16)  => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    map:     (c=t.muted,s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    book:    (c=t.muted,s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    eye:     (c=t.muted,s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeOff:  (c=t.muted,s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    plus:    (c=t.lime,s=13)  => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
};

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
    const isErr = type === "error";
    return (
        <div style={{ position:"fixed",bottom:28,right:28,zIndex:3000,padding:"12px 18px",borderRadius:14,background:"rgba(10,10,14,0.95)",border:`1px solid ${isErr?"rgba(252,165,165,0.25)":"rgba(134,239,172,0.25)"}`,color:isErr?t.red:t.green,fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",animation:"toastIn 0.35s cubic-bezier(0.22,1,0.36,1) both",backdropFilter:"blur(20px)",display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 32px rgba(0,0,0,0.6)",minWidth:220 }}>
            <div style={{ width:24,height:24,borderRadius:8,flexShrink:0,background:isErr?"rgba(252,165,165,0.12)":"rgba(134,239,172,0.12)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                {isErr ? Icon.warning(t.red,12) : Icon.check(t.green,12)}
            </div>
            {msg}
        </div>
    );
}

// ── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ title, description, confirmLabel, onConfirm, onCancel, loading, danger = true }) {
    return (
        <div style={{ position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn 0.18s ease both" }}>
            <div style={{ width:"100%",maxWidth:380,background:"rgba(16,16,20,0.98)",border:`1px solid ${danger?"rgba(252,165,165,0.15)":"rgba(255,255,255,0.1)"}`,borderRadius:22,overflow:"hidden",animation:"slideUp 0.3s cubic-bezier(0.22,1,0.36,1) both",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 32px 80px rgba(0,0,0,0.7)" }}>
                <div style={{ height:2,background:`linear-gradient(90deg,transparent,${danger?t.red:t.lime},transparent)` }} />
                <div style={{ padding:"24px" }}>
                    <div style={{ display:"flex",alignItems:"flex-start",gap:14,marginBottom:20 }}>
                        <div style={{ width:42,height:42,borderRadius:13,flexShrink:0,background:danger?"rgba(252,165,165,0.08)":t.limeDim,border:`1px solid ${danger?"rgba(252,165,165,0.2)":"rgba(232,255,71,0.2)"}`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                            {danger ? Icon.warning(t.red,18) : Icon.check(t.lime,18)}
                        </div>
                        <div>
                            <h3 style={{ fontFamily:"'Fraunces',serif",fontWeight:800,fontSize:17,color:t.text,margin:"0 0 6px",letterSpacing:"-0.025em" }}>{title}</h3>
                            <p style={{ fontSize:12.5,color:t.muted,margin:0,lineHeight:1.6 }}>{description}</p>
                        </div>
                    </div>
                    <div style={{ display:"flex",gap:9 }}>
                        <button onClick={onConfirm} disabled={loading} style={{ flex:1,padding:"11px 0",borderRadius:12,fontSize:13,fontWeight:700,fontFamily:"'DM Sans',sans-serif",background:danger?"rgba(252,165,165,0.1)":t.limeDim,border:`1px solid ${danger?"rgba(252,165,165,0.25)":"rgba(232,255,71,0.25)"}`,color:danger?t.red:t.lime,cursor:loading?"not-allowed":"pointer",opacity:loading?0.6:1,display:"flex",alignItems:"center",justifyContent:"center",gap:7,transition:"all 0.15s" }}>
                            {loading ? <><div style={{ width:12,height:12,borderRadius:"50%",border:`2px solid ${danger?"rgba(252,165,165,0.2)":"rgba(232,255,71,0.2)"}`,borderTopColor:danger?t.red:t.lime,animation:"spin 0.75s linear infinite" }} />Working…</> : confirmLabel}
                        </button>
                        <button onClick={onCancel} disabled={loading} style={{ flex:1,padding:"11px 0",borderRadius:12,fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:"transparent",border:`1px solid ${t.border}`,color:t.muted,cursor:"pointer" }}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({ title, subtitle, icon, children, accentColor = t.lime }) {
    return (
        <div className="section-card">
            <div style={{ height:2,background:`linear-gradient(90deg,transparent,${accentColor},transparent)` }} />
            <div className="section-card-header">
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                    <div style={{ width:36,height:36,borderRadius:11,background:`rgba(${accentColor===t.lime?"232,255,71":"252,165,165"},0.08)`,border:`1px solid rgba(${accentColor===t.lime?"232,255,71":"252,165,165"},0.18)`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                        {icon}
                    </div>
                    <div>
                        <p style={{ fontSize:13.5,fontWeight:700,color:t.text,margin:0,letterSpacing:"-0.01em" }}>{title}</p>
                        {subtitle && <p style={{ fontSize:11.5,color:t.faint,margin:0 }}>{subtitle}</p>}
                    </div>
                </div>
            </div>
            <div className="section-card-body">{children}</div>
        </div>
    );
}

// ── Field Label ───────────────────────────────────────────────────────────────
function FieldLabel({ children }) {
    return <p style={{ fontSize:11,fontWeight:700,color:t.faint,textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 7px" }}>{children}</p>;
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function AvatarSection({ profile }) {
    const initials = profile.name ? profile.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) : "?";

    return (
        <div style={{ display:"flex",alignItems:"center",gap:20 }}>
            <div style={{ position:"relative",flexShrink:0 }}>
                <div style={{ width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,rgba(232,255,71,0.15),rgba(232,255,71,0.05))",border:"2px solid rgba(232,255,71,0.2)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
                    {profile.avatar
                        ? <img src={profile.avatar} alt="avatar" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                        : <span style={{ fontFamily:"'Fraunces',serif",fontWeight:800,fontSize:26,color:t.lime,letterSpacing:"-0.02em" }}>{initials}</span>
                    }
                </div>
                <div title="Coming soon" style={{ position:"absolute",bottom:0,right:0,width:26,height:26,borderRadius:"50%",background:"rgba(16,16,20,0.9)",border:`1px solid ${t.border2}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"not-allowed",opacity:0.6 }}>
                    {Icon.camera(t.muted,12)}
                </div>
            </div>
            <div style={{ minWidth:0 }}>
                <p style={{ fontFamily:"'Fraunces',serif",fontWeight:800,fontSize:20,color:t.text,margin:"0 0 4px",letterSpacing:"-0.03em",lineHeight:1 }}>{profile.name || "—"}</p>
                <p style={{ fontSize:12.5,color:t.muted,margin:"0 0 8px" }}>{profile.headline || <em style={{ color:t.faint }}>No headline set</em>}</p>
                <div style={{ display:"flex",alignItems:"center",gap:12,flexWrap:"wrap" }}>
                    {profile.location && (
                        <span style={{ display:"flex",alignItems:"center",gap:5,fontSize:12,color:t.faint }}>
                            {Icon.map(t.faint,12)} {profile.location}
                        </span>
                    )}
                    {profile.college && (
                        <span style={{ display:"flex",alignItems:"center",gap:5,fontSize:12,color:t.faint }}>
                            {Icon.book(t.faint,12)} {profile.college}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Skills Input ──────────────────────────────────────────────────────────────
function SkillsInput({ skills, onChange }) {
    const [input, setInput] = useState("");

    const add = () => {
        const trimmed = input.trim();
        if (!trimmed || skills.includes(trimmed) || skills.length >= 20) return;
        onChange([...skills, trimmed]);
        setInput("");
    };

    const remove = (skill) => onChange(skills.filter(s => s !== skill));

    return (
        <div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:7,marginBottom:10 }}>
                {skills.map(skill => (
                    <span key={skill} className="skill-tag">
                        {skill}
                        <button onClick={()=>remove(skill)}>{Icon.x(t.faint,10)}</button>
                    </span>
                ))}
                {skills.length === 0 && <span style={{ fontSize:12,color:t.faint,fontStyle:"italic" }}>No skills added yet</span>}
            </div>
            <div style={{ display:"flex",gap:8 }}>
                <input
                    className="pf-input"
                    value={input}
                    onChange={e=>setInput(e.target.value)}
                    onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); add(); } }}
                    placeholder="e.g. React, Python, FastAPI…"
                    style={{ flex:1 }}
                />
                <button onClick={add} style={{ padding:"0 16px",borderRadius:11,background:t.limeDim,border:"1px solid rgba(232,255,71,0.22)",color:t.lime,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s",display:"flex",alignItems:"center",gap:6,flexShrink:0 }}>
                    {Icon.plus(t.lime,12)} Add
                </button>
            </div>
            <p style={{ fontSize:11,color:t.faint,margin:"6px 0 0" }}>Press Enter or click Add · Max 20 skills</p>
        </div>
    );
}

// ── Password input with show/hide ─────────────────────────────────────────────
function PasswordField({ label, value, onChange, placeholder }) {
    const [show, setShow] = useState(false);
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <div style={{ position:"relative" }}>
                <input className="pf-input" type={show?"text":"password"} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{ paddingRight:40 }} />
                <button onClick={()=>setShow(s=>!s)} style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center" }}>
                    {show ? Icon.eyeOff(t.muted,14) : Icon.eye(t.muted,14)}
                </button>
            </div>
        </div>
    );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function ProfileSkeleton() {
    const bar = (w,h=12,mb=0) => <div style={{ height:h,width:w,borderRadius:h/2,background:`linear-gradient(90deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 100%)`,backgroundSize:"600px 100%",animation:"shimmer 1.8s ease-in-out infinite",marginBottom:mb }} />;
    return (
        <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
            <div style={{ borderRadius:20,background:t.surface,border:`1px solid ${t.border}`,padding:"24px 22px",display:"flex",gap:20,alignItems:"center" }}>
                <div style={{ width:80,height:80,borderRadius:"50%",background:t.surface2,animation:"pulse 1.6s ease-in-out infinite",flexShrink:0 }} />
                <div style={{ flex:1 }}>{bar("50%",16,10)}{bar("35%",11,8)}{bar("25%",10)}</div>
            </div>
            {[1,2,3].map(i=>(
                <div key={i} style={{ borderRadius:20,background:t.surface,border:`1px solid ${t.border}`,padding:"22px" }}>
                    {bar("40%",14,16)}{bar("100%",10,8)}{bar("80%",10,8)}{bar("60%",10)}
                </div>
            ))}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Profile() {
    const [profile, setProfile]             = useState(null);
    const [loading, setLoading]             = useState(true);
    const [saving, setSaving]               = useState(false);
    const [form, setForm]                   = useState({});
    const [toast, setToast]                 = useState(null);
    const [modal, setModal]                 = useState(null);
    const [pwForm, setPwForm]               = useState({ current:"", next:"", confirm:"" });
    const [pwSaving, setPwSaving]           = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3400); };

    // ── Fetch profile ─────────────────────────────────────────────────────────
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get(API, { withCredentials:true });
                setProfile(res.data);
                setForm({
                    name:     res.data.name     || "",
                    headline: res.data.headline || "",
                    bio:      res.data.bio      || "",
                    location: res.data.location || "",
                    college:  res.data.college  || "",
                    skills:   res.data.skills   || [],
                    socials: {
                        github:    res.data.socials?.github    || "",
                        linkedin:  res.data.socials?.linkedin  || "",
                        portfolio: res.data.socials?.portfolio || "",
                        twitter:   res.data.socials?.twitter   || "",
                    },
                });
            } catch (err) { showToast("Failed to load profile.", "error"); }
            finally { setLoading(false); }
        })();
    }, []);

    // ── Save profile ──────────────────────────────────────────────────────────
    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put(API, form, { withCredentials:true });
            setProfile(prev=>({...prev,...form}));
            showToast("Profile saved successfully.");
        } catch (err) { showToast(err.response?.data?.detail||"Failed to save.", "error"); }
        finally { setSaving(false); }
    };

    // ── Change password ───────────────────────────────────────────────────────
    const handleChangePassword = async () => {
        if (pwForm.next !== pwForm.confirm) { showToast("Passwords don't match.", "error"); return; }
        if (pwForm.next.length < 8) { showToast("Password must be at least 8 characters.", "error"); return; }
        setPwSaving(true);
        try {
            await api.post(`${API}/change-password`, { current_password:pwForm.current, new_password:pwForm.next }, { withCredentials:true });
            showToast("Password changed successfully.");
            setPwForm({ current:"", next:"", confirm:"" });
            setModal(null);
        } catch (err) { showToast(err.response?.data?.detail||"Failed to change password.", "error"); }
        finally { setPwSaving(false); }
    };

    // ── Delete account ────────────────────────────────────────────────────────
    const handleDeleteAccount = async () => {
        setDeleteLoading(true);
        try {
            await api.delete(`${API}/account`, { withCredentials:true });
            window.location.href = "/login";
        } catch (err) { showToast("Failed to delete account.", "error"); setDeleteLoading(false); setModal(null); }
    };

    const set = (field, value) => setForm(prev=>({...prev,[field]:value}));
    const setSocial = (field, value) => setForm(prev=>({...prev,socials:{...prev.socials,[field]:value}}));

    if (loading) return (
        <>
            <style>{GLOBAL_CSS}</style>
            <div style={{ fontFamily:"'DM Sans',sans-serif" }}><ProfileSkeleton /></div>
        </>
    );

    const isOAuthUser = profile && !profile.providers?.includes("local");

    return (
        <>
            <style>{GLOBAL_CSS}</style>
            <div style={{ fontFamily:"'DM Sans',sans-serif",display:"flex",flexDirection:"column",gap:22 }}>

                {/* ── Header ── */}
                <div>
                    <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                        <span style={{ fontSize:10,color:t.lime,letterSpacing:"0.18em",textTransform:"uppercase",fontWeight:700 }}>Account</span>
                        <div style={{ width:5,height:5,borderRadius:"50%",background:t.lime,opacity:0.6,animation:"floatDot 2.2s ease-in-out infinite" }} />
                    </div>
                    <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:12,flexWrap:"wrap" }}>
                        <div>
                            <h1 style={{ fontFamily:"'Fraunces',serif",fontWeight:800,fontSize:"clamp(24px,3.5vw,38px)",letterSpacing:"-0.04em",color:t.text,margin:"0 0 6px",lineHeight:1 }}>
                                My <em style={{ fontStyle:"italic",color:t.lime,textShadow:"0 0 40px rgba(232,255,71,0.3)" }}>Profile</em>
                            </h1>
                            <p style={{ fontSize:13.5,color:t.muted,margin:0 }}>Manage your personal info, skills, and account settings.</p>
                        </div>
                        <button onClick={handleSave} disabled={saving} style={{ padding:"10px 24px",borderRadius:12,fontSize:13,fontWeight:700,fontFamily:"'DM Sans',sans-serif",background:saving?"rgba(232,255,71,0.6)":t.lime,color:"#0a0a0e",border:"none",cursor:saving?"not-allowed":"pointer",boxShadow:"0 4px 18px rgba(232,255,71,0.22)",display:"flex",alignItems:"center",gap:8,flexShrink:0,transition:"all 0.15s" }}>
                            {saving ? <><div style={{ width:12,height:12,borderRadius:"50%",border:"2px solid rgba(10,10,14,0.2)",borderTopColor:"#0a0a0e",animation:"spin 0.75s linear infinite" }} />Saving…</> : <>{Icon.check("#0a0a0e",14)} Save changes</>}
                        </button>
                    </div>
                </div>

                {/* ── Avatar / Identity card ── */}
                <div className="section-card">
                    <div style={{ height:2,background:`linear-gradient(90deg,transparent,${t.lime},transparent)` }} />
                    <div style={{ padding:"22px" }}>
                        <AvatarSection profile={profile} />
                        <div style={{ height:1,background:t.border,margin:"20px 0" }} />
                        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                            <div style={{ padding:"7px 12px",borderRadius:9,background:t.surface2,border:`1px solid ${t.border}`,fontSize:13,color:t.muted,flex:1 }}>
                                {profile.email}
                            </div>
                            <div style={{ padding:"5px 11px",borderRadius:8,fontSize:11,fontWeight:700,background:"rgba(134,239,172,0.08)",border:"1px solid rgba(134,239,172,0.2)",color:t.green }}>
                                {profile.is_verified ? "Verified" : "Unverified"}
                            </div>
                            {profile.providers?.map(p => (
                                <div key={p} style={{ padding:"5px 11px",borderRadius:8,fontSize:11,fontWeight:700,background:t.surface2,border:`1px solid ${t.border}`,color:t.muted,textTransform:"capitalize" }}>{p}</div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Personal Info ── */}
                <SectionCard title="Personal Info" subtitle="Your public-facing details" icon={Icon.user(t.lime,16)}>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
                        <div style={{ gridColumn:"1 / -1" }}>
                            <FieldLabel>Full Name</FieldLabel>
                            <input className="pf-input" value={form.name||""} onChange={e=>set("name",e.target.value)} placeholder="Your full name" />
                        </div>
                        <div style={{ gridColumn:"1 / -1" }}>
                            <FieldLabel>Headline</FieldLabel>
                            <input className="pf-input" value={form.headline||""} onChange={e=>set("headline",e.target.value)} placeholder="e.g. Full Stack Dev | Open to work" />
                        </div>
                        <div style={{ gridColumn:"1 / -1" }}>
                            <FieldLabel>Bio</FieldLabel>
                            <textarea className="pf-textarea" value={form.bio||""} onChange={e=>set("bio",e.target.value)} placeholder="A short description about yourself…" />
                        </div>
                        <div>
                            <FieldLabel>Location</FieldLabel>
                            <input className="pf-input" value={form.location||""} onChange={e=>set("location",e.target.value)} placeholder="City, State" />
                        </div>
                        <div>
                            <FieldLabel>College / University</FieldLabel>
                            <input className="pf-input" value={form.college||""} onChange={e=>set("college",e.target.value)} placeholder="e.g. AKTU, IIT Delhi" />
                        </div>
                    </div>
                </SectionCard>

                {/* ── Skills ── */}
                <SectionCard title="Skills & Tech Stack" subtitle="Used for AI job matching" icon={Icon.plus(t.lime,15)}>
                    <SkillsInput skills={form.skills||[]} onChange={v=>set("skills",v)} />
                </SectionCard>

                {/* ── Social Links ── */}
                <SectionCard title="Social Links" subtitle="GitHub, LinkedIn, portfolio" icon={Icon.globe(t.lime,15)}>
                    <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                        {[
                            { key:"github",    icon:Icon.github(t.faint,14),   label:"GitHub",      placeholder:"github.com/username" },
                            { key:"linkedin",  icon:Icon.linkedin(t.faint,14), label:"LinkedIn",    placeholder:"linkedin.com/in/username" },
                            { key:"portfolio", icon:Icon.globe(t.faint,14),    label:"Portfolio",   placeholder:"yoursite.com" },
                            { key:"twitter",   icon:null,                       label:"Twitter / X", placeholder:"twitter.com/username" },
                        ].map(({ key, icon, label, placeholder }) => (
                            <div key={key}>
                                <FieldLabel>{label}</FieldLabel>
                                <div style={{ position:"relative" }}>
                                    {icon && <div style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}>{icon}</div>}
                                    <input className="pf-input" value={form.socials?.[key]||""} onChange={e=>setSocial(key,e.target.value)} placeholder={placeholder} style={{ paddingLeft:icon?36:14 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* ── Account Settings ── */}
                <SectionCard title="Account Settings" subtitle="Password and danger zone" icon={Icon.lock(t.lime,15)} accentColor={t.red}>
                    <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                        {!isOAuthUser ? (
                            <div style={{ padding:"16px",borderRadius:14,background:t.surface2,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12 }}>
                                <div>
                                    <p style={{ fontSize:13,fontWeight:600,color:t.text,margin:"0 0 3px" }}>Change Password</p>
                                    <p style={{ fontSize:12,color:t.faint,margin:0 }}>Update your login password</p>
                                </div>
                                <button onClick={()=>setModal("change-password")} style={{ padding:"8px 18px",borderRadius:10,fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",background:"rgba(255,255,255,0.04)",border:`1px solid ${t.border2}`,color:t.text,cursor:"pointer",flexShrink:0,transition:"all 0.15s",display:"flex",alignItems:"center",gap:7 }}>
                                    {Icon.lock(t.muted,13)} Change
                                </button>
                            </div>
                        ) : (
                            <div style={{ padding:"14px 16px",borderRadius:14,background:t.surface2,border:`1px solid ${t.border}` }}>
                                <p style={{ fontSize:12.5,color:t.faint,margin:0 }}>
                                    Password change is unavailable — you signed in with <strong style={{ color:t.muted,textTransform:"capitalize" }}>{profile.providers?.[0]}</strong>.
                                </p>
                            </div>
                        )}

                        <div style={{ height:1,background:t.border,margin:"4px 0" }} />

                        <div style={{ padding:"16px",borderRadius:14,background:"rgba(252,165,165,0.04)",border:"1px solid rgba(252,165,165,0.1)" }}>
                            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:12 }}>
                                <div>
                                    <p style={{ fontSize:13,fontWeight:600,color:t.red,margin:"0 0 3px",display:"flex",alignItems:"center",gap:7 }}>{Icon.warning(t.red,13)} Delete Account</p>
                                    <p style={{ fontSize:12,color:t.faint,margin:0 }}>Permanently remove your account and all data. This cannot be undone.</p>
                                </div>
                                <button className="danger-zone-btn" onClick={()=>setModal("delete-account")} style={{ padding:"8px 18px",borderRadius:10,fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",background:"rgba(252,165,165,0.08)",border:"1px solid rgba(252,165,165,0.2)",color:t.red,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",gap:7 }}>
                                    {Icon.trash(t.red,13)} Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </SectionCard>

            </div>

            {/* ── Change Password Modal ── */}
            {modal === "change-password" && (
                <div style={{ position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn 0.18s ease both" }}>
                    <div style={{ width:"100%",maxWidth:400,background:"rgba(16,16,20,0.98)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:22,overflow:"hidden",animation:"slideUp 0.3s cubic-bezier(0.22,1,0.36,1) both",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 32px 80px rgba(0,0,0,0.7)" }}>
                        <div style={{ height:2,background:`linear-gradient(90deg,transparent,${t.lime},transparent)` }} />
                        <div style={{ padding:"24px" }}>
                            <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:22 }}>
                                <div style={{ width:40,height:40,borderRadius:12,background:t.limeDim,border:"1px solid rgba(232,255,71,0.2)",display:"flex",alignItems:"center",justifyContent:"center" }}>{Icon.lock(t.lime,16)}</div>
                                <div>
                                    <p style={{ fontFamily:"'Fraunces',serif",fontWeight:800,fontSize:16,color:t.text,margin:0,letterSpacing:"-0.025em" }}>Change Password</p>
                                    <p style={{ fontSize:12,color:t.faint,margin:0 }}>Min 8 characters</p>
                                </div>
                            </div>
                            <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
                                <PasswordField label="Current Password" value={pwForm.current} onChange={v=>setPwForm(p=>({...p,current:v}))} placeholder="Your current password" />
                                <PasswordField label="New Password" value={pwForm.next} onChange={v=>setPwForm(p=>({...p,next:v}))} placeholder="At least 8 characters" />
                                <PasswordField label="Confirm New Password" value={pwForm.confirm} onChange={v=>setPwForm(p=>({...p,confirm:v}))} placeholder="Repeat new password" />
                            </div>
                            <div style={{ display:"flex",gap:9,marginTop:22 }}>
                                <button onClick={handleChangePassword} disabled={pwSaving||!pwForm.current||!pwForm.next||!pwForm.confirm} style={{ flex:1,padding:"11px 0",borderRadius:12,fontSize:13,fontWeight:700,fontFamily:"'DM Sans',sans-serif",background:t.limeDim,border:"1px solid rgba(232,255,71,0.25)",color:t.lime,cursor:(pwSaving||!pwForm.current||!pwForm.next||!pwForm.confirm)?"not-allowed":"pointer",opacity:(pwSaving||!pwForm.current||!pwForm.next||!pwForm.confirm)?0.5:1,display:"flex",alignItems:"center",justifyContent:"center",gap:7 }}>
                                    {pwSaving?<><div style={{ width:12,height:12,borderRadius:"50%",border:"2px solid rgba(232,255,71,0.2)",borderTopColor:t.lime,animation:"spin 0.75s linear infinite" }} />Updating…</>:"Update password"}
                                </button>
                                <button onClick={()=>{setModal(null);setPwForm({current:"",next:"",confirm:""});}} disabled={pwSaving} style={{ flex:1,padding:"11px 0",borderRadius:12,fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:"transparent",border:`1px solid ${t.border}`,color:t.muted,cursor:"pointer" }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Account Modal ── */}
            {modal === "delete-account" && (
                <ConfirmModal
                    title="Delete your account?"
                    description="This will permanently remove your account, all uploaded resumes, built resumes, and profile data. This action cannot be undone."
                    confirmLabel="Yes, delete everything"
                    onConfirm={handleDeleteAccount}
                    onCancel={()=>setModal(null)}
                    loading={deleteLoading}
                    danger
                />
            )}

            {toast && <Toast msg={toast.msg} type={toast.type} />}
        </>
    );
}