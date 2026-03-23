/*

import { useState } from "react";
import { Navigate , useNavigate } from "react-router-dom";

export default function Login() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://127.0.0.1:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.detail);
                return;
            }

            // Save token
            localStorage.setItem("token", data.token);

            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }
    };

    if (token) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="email" onChange={handleChange} placeholder="Email" />
            <input name="password" onChange={handleChange} placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    );
}


*/






import { useState } from "react";

/* ─── Shared design tokens (mirror landing page) ─── */
const C = {
    bg: "#09090f",
    surface: "#111118",
    surface2: "#16161f",
    border: "rgba(255,255,255,0.07)",
    border2: "rgba(255,255,255,0.12)",
    text: "#f0eff8",
    muted: "#7b7a92",
    dim: "#4a4963",
    accent: "#7c6af7",
    accent2: "#a599ff",
    green: "#3fd898",
    gold: "#f0c060",
    pink: "#f067a6",
};

const serif = { fontFamily: "'Instrument Serif', serif" };
const serifItalic = { fontFamily: "'Instrument Serif', serif", fontStyle: "italic" };

/* ─── Reusable Input ─── */
function Input({ label, type = "text", placeholder, value, onChange, icon }) {
    const [focused, setFocused] = useState(false);
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-widest" style={{ color: C.muted }}>
                {label}
            </label>
            <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200"
                style={{
                    background: C.surface2,
                    border: `1px solid ${focused ? C.accent : C.border2}`,
                    boxShadow: focused ? `0 0 0 3px rgba(124,106,247,0.12)` : "none",
                }}
            >
                {icon && <span style={{ color: focused ? C.accent2 : C.dim, fontSize: "1rem" }}>{icon}</span>}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{ color: C.text, fontFamily: "'DM Sans', sans-serif" }}
                />
            </div>
        </div>
    );
}

/* ─── Social Button ─── */
function SocialBtn({ children, icon }) {
    const [hov, setHov] = useState(false);
    return (
        <button
            className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
                background: hov ? C.surface2 : "transparent",
                border: `1px solid ${hov ? C.border2 : C.border}`,
                color: hov ? C.text : C.muted,
                fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
        >
            {icon}
            {children}
        </button>
    );
}

export default function Login({ onNavigate }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.8); } }
      `}</style>

            <div className="relative min-h-screen flex" style={{ background: C.bg, fontFamily: "'DM Sans', sans-serif", color: C.text }}>
                {/* ── Ambient orbs ── */}
                <div className="fixed rounded-full pointer-events-none" style={{ width: 500, height: 500, top: -150, left: -150, background: "radial-gradient(circle, rgba(124,106,247,0.13) 0%, transparent 70%)", filter: "blur(70px)", zIndex: 0 }} />
                <div className="fixed rounded-full pointer-events-none" style={{ width: 400, height: 400, bottom: -100, right: -100, background: "radial-gradient(circle, rgba(63,216,152,0.07) 0%, transparent 70%)", filter: "blur(70px)", zIndex: 0 }} />

                {/* ── Left decorative panel ── */}
                <div
                    className="hidden lg:flex flex-col justify-between p-14 relative overflow-hidden"
                    style={{ width: "45%", background: C.surface, borderRight: `1px solid ${C.border}` }}
                >
                    {/* Decorative grid pattern */}
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

                    {/* Accent blob */}
                    <div className="absolute" style={{ width: 300, height: 300, bottom: "15%", left: "10%", background: "radial-gradient(circle, rgba(124,106,247,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />

                    {/* Logo */}
                    <a href="#" style={{ ...serif, fontSize: "1.5rem", letterSpacing: "-0.02em", color: C.text, textDecoration: "none", position: "relative", zIndex: 1 }}>
                        JobHit<span style={{ color: C.accent2 }}>AI</span>
                    </a>

                    {/* Center quote */}
                    <div className="relative z-10" style={{ animation: "fadeUp 0.8s ease both" }}>
                        <div className="text-6xl mb-6" style={{ color: C.accent, opacity: 0.4, ...serif }}>"</div>
                        <blockquote className="text-2xl font-normal leading-snug mb-6" style={{ ...serif, color: C.text, letterSpacing: "-0.02em" }}>
                            JobHitAI helped me land my <em style={serifItalic}>dream role</em> at Google — in just 3 weeks.
                        </blockquote>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#7c6af7,#5c4ed4)" }}>A</div>
                            <div>
                                <div className="text-sm font-medium">Arjun Mehta</div>
                                <div className="text-xs" style={{ color: C.dim }}>Software Engineer · Google</div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom stats row */}
                    <div className="relative z-10 flex gap-8">
                        {[["2.4M+", "Resumes"], ["89%", "Interview Rate"], ["4.9★", "Rating"]].map(([n, l]) => (
                            <div key={l}>
                                <div className="text-xl font-normal" style={{ ...serif, color: C.accent2, letterSpacing: "-0.03em" }}>{n}</div>
                                <div className="text-xs mt-0.5" style={{ color: C.dim }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right: form panel ── */}
                <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
                    <div className="w-full max-w-md" style={{ animation: "fadeUp 0.6s 0.1s ease both" }}>
                        {/* Mobile logo */}
                        <div className="lg:hidden mb-8 text-center">
                            <span style={{ ...serif, fontSize: "1.5rem", color: C.text }}>
                                JobHit<span style={{ color: C.accent2 }}>AI</span>
                            </span>
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-normal mb-2" style={{ ...serif, letterSpacing: "-0.025em" }}>Welcome back</h1>
                            <p className="text-sm" style={{ color: C.muted }}>Sign in to continue your job search journey.</p>
                        </div>

                        {/* Social logins */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <SocialBtn icon={
                                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            }>Continue with Google</SocialBtn>
                            <SocialBtn icon={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill={C.text}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            }>Continue with LinkedIn</SocialBtn>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex-1 h-px" style={{ background: C.border }} />
                            <span className="text-xs" style={{ color: C.dim }}>or sign in with email</span>
                            <div className="flex-1 h-px" style={{ background: C.border }} />
                        </div>

                        {/* Form */}
                        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                            <Input label="Email address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon="✉" />

                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium uppercase tracking-widest" style={{ color: C.muted }}>Password</label>
                                    <a href="#" className="text-xs transition-colors duration-150" style={{ color: C.accent2, textDecoration: "none" }}
                                        onMouseEnter={(e) => (e.target.style.color = C.text)}
                                        onMouseLeave={(e) => (e.target.style.color = C.accent2)}
                                    >Forgot password?</a>
                                </div>
                                <div className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200" style={{ background: C.surface2, border: `1px solid ${C.border2}` }}>
                                    <span style={{ color: C.dim }}>🔒</span>
                                    <input
                                        type={showPass ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="flex-1 bg-transparent outline-none text-sm"
                                        style={{ color: C.text, fontFamily: "'DM Sans', sans-serif" }}
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="text-xs transition-colors" style={{ color: C.dim, background: "none", border: "none", cursor: "pointer" }}>
                                        {showPass ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me */}
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" className="hidden" />
                                <div className="w-4 h-4 rounded flex items-center justify-center shrink-0" style={{ border: `1px solid ${C.border2}`, background: C.surface2 }} />
                                <span className="text-sm" style={{ color: C.muted }}>Remember me for 30 days</span>
                            </label>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-xl text-sm font-medium text-white mt-2 transition-all duration-200"
                                style={{ background: "linear-gradient(135deg,#7c6af7,#5c4ed4)", boxShadow: "0 4px 24px rgba(124,106,247,0.35)", fontFamily: "'DM Sans', sans-serif", border: "none", cursor: "pointer" }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(124,106,247,0.5)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(124,106,247,0.35)"; }}
                                onClick={() => onNavigate && onNavigate("dashboard")}
                            >
                                Sign in to JobHitAI →
                            </button>
                        </form>

                        {/* Sign up link */}
                        <p className="text-center text-sm mt-6" style={{ color: C.muted }}>
                            Don't have an account?{" "}
                            <a href="#" className="font-medium transition-colors" style={{ color: C.accent2, textDecoration: "none" }}
                                onClick={(e) => { e.preventDefault(); onNavigate && onNavigate("signup"); }}
                                onMouseEnter={(e) => (e.target.style.color = C.text)}
                                onMouseLeave={(e) => (e.target.style.color = C.accent2)}
                            >
                                Create one free →
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}