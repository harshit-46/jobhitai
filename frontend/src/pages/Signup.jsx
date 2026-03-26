import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

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

function Input({ label, name, type = "text", placeholder, value, onChange, icon, hint }) {
    const [focused, setFocused] = useState(false);
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-widest" style={{ color: C.muted }}>{label}</label>
            <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200"
                style={{
                    background: C.surface2,
                    border: `1px solid ${focused ? C.accent : C.border2}`,
                    boxShadow: focused ? "0 0 0 3px rgba(124,106,247,0.12)" : "none",
                }}
            >
                {icon && <span style={{ color: focused ? C.accent2 : C.dim }}>{icon}</span>}
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{ color: C.text, fontFamily: "'DM Sans', sans-serif" }}
                />
            </div>
            {hint && <p className="text-xs" style={{ color: C.dim }}>{hint}</p>}
        </div>
    );
}

function StrengthBar({ password }) {
    const score = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[^a-zA-Z0-9]/.test(password) ? 4 : 3;
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    const colors = ["", "#f067a6", "#f0c060", "#a599ff", "#3fd898"];
    return (
        <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300" style={{ background: i <= score ? colors[score] : C.border2 }} />
                ))}
            </div>
            {password.length > 0 && <p className="text-xs" style={{ color: colors[score] }}>{labels[score]} password</p>}
        </div>
    );
}

export default function Signup({ onNavigate }) {
    const { user, signup } = useAuth();

    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signup(form);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.detail || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            <div className="relative min-h-screen flex" style={{ background: C.bg, fontFamily: "'DM Sans', sans-serif", color: C.text }}>

                <div className="fixed rounded-full pointer-events-none" style={{ width: 600, height: 600, top: -200, right: -200, background: "radial-gradient(circle,rgba(124,106,247,0.11) 0%,transparent 70%)", filter: "blur(80px)", zIndex: 0 }} />
                <div className="fixed rounded-full pointer-events-none" style={{ width: 400, height: 400, bottom: 0, left: -100, background: "radial-gradient(circle,rgba(240,192,96,0.07) 0%,transparent 70%)", filter: "blur(70px)", zIndex: 0 }} />

                {/* Left panel */}
                <div className="hidden lg:flex flex-col justify-between p-14 relative overflow-hidden" style={{ width: "42%", background: C.surface, borderRight: `1px solid ${C.border}` }}>
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                    <div className="absolute" style={{ width: 350, height: 350, top: "20%", right: "-100px", background: "radial-gradient(circle,rgba(124,106,247,0.14) 0%,transparent 70%)", filter: "blur(60px)" }} />

                    <a href="#" style={{ ...serif, fontSize: "1.5rem", color: C.text, textDecoration: "none", position: "relative", zIndex: 1 }}>
                        JobHit<span style={{ color: C.accent2 }}>AI</span>
                    </a>

                    <div className="relative z-10">
                        <p className="text-xs uppercase tracking-widest mb-6" style={{ color: C.dim }}>Everything you get</p>
                        <div className="flex flex-col gap-5">
                            {[
                                { icon: "🧠", title: "AI Resume Builder", desc: "Craft ATS-ready resumes tailored to any job." },
                                { icon: "📊", title: "Live Score Engine", desc: "Get real-time match scores vs. job descriptions." },
                                { icon: "⚡", title: "One-Click Apply", desc: "Apply to hundreds of jobs without manual effort." },
                                { icon: "💬", title: "Interview Prep AI", desc: "Practice with mock interviews before the real thing." },
                            ].map((f) => (
                                <div key={f.title} className="flex items-start gap-4">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0" style={{ background: "rgba(124,106,247,0.12)", border: "1px solid rgba(124,106,247,0.2)" }}>{f.icon}</div>
                                    <div>
                                        <div className="text-sm font-medium mb-0.5">{f.title}</div>
                                        <div className="text-xs leading-relaxed" style={{ color: C.dim }}>{f.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 text-xs" style={{ color: C.dim }}>Free forever — no credit card required.</div>
                </div>

                {/* Right panel */}
                <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
                    <div className="w-full max-w-md">
                        <div className="lg:hidden mb-8 text-center">
                            <span style={{ ...serif, fontSize: "1.5rem" }}>JobHit<span style={{ color: C.accent2 }}>AI</span></span>
                        </div>

                        <div>
                            <h1 className="text-3xl font-normal mb-2" style={serif}>Create your account</h1>
                            <p className="text-sm mb-8" style={{ color: C.muted }}>Start landing jobs smarter, not harder.</p>

                            {/* OAuth buttons */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {[
                                    {
                                        label: "Google", icon: (
                                            <svg width="16" height="16" viewBox="0 0 24 24">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                            </svg>
                                        )
                                    },
                                    {
                                        label: "LinkedIn", icon: (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill={C.text}>
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        )
                                    },
                                ].map((s) => (
                                    <button key={s.label} className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all duration-200"
                                        style={{ background: "transparent", border: `1px solid ${C.border2}`, color: C.muted, fontFamily: "'DM Sans',sans-serif", cursor: "pointer" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = C.surface2; e.currentTarget.style.color = C.text; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; }}
                                    >{s.icon} {s.label}</button>
                                ))}
                            </div>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex-1 h-px" style={{ background: C.border }} />
                                <span className="text-xs" style={{ color: C.dim }}>or with email</span>
                                <div className="flex-1 h-px" style={{ background: C.border }} />
                            </div>

                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                <Input label="Full name" name="name" placeholder="Arjun Mehta" value={form.name} onChange={handleChange} icon="👤" />
                                <Input label="Username" name="username" placeholder="arjunmehta" value={form.username} onChange={handleChange} icon="🪪" />
                                <Input label="Work email" name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange} icon="✉" />
                                <div className="flex flex-col gap-1.5">
                                    <Input label="Password" name="password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} icon="🔒" />
                                    <StrengthBar password={form.password} />
                                </div>

                                <label className="flex items-start gap-2.5 cursor-pointer mt-1">
                                    <div className="w-4 h-4 rounded shrink-0 mt-0.5" style={{ border: `1px solid ${C.border2}`, background: C.surface2 }} />
                                    <span className="text-xs leading-relaxed" style={{ color: C.muted }}>
                                        I agree to the <a href="#" style={{ color: C.accent2, textDecoration: "none" }}>Terms of Service</a> and <a href="#" style={{ color: C.accent2, textDecoration: "none" }}>Privacy Policy</a>
                                    </span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-xl text-sm font-medium text-white mt-1 transition-all duration-200"
                                    style={{ background: "linear-gradient(135deg,#7c6af7,#5c4ed4)", boxShadow: "0 4px 24px rgba(124,106,247,0.35)", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "'DM Sans',sans-serif" }}
                                    onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(124,106,247,0.5)"; } }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(124,106,247,0.35)"; }}
                                >
                                    {loading ? "Creating account…" : "Continue →"}
                                </button>
                            </form>
                        </div>

                        <p className="text-center text-sm mt-6" style={{ color: C.muted }}>
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium" style={{ color: C.accent2, textDecoration: "none" }}
                                onMouseEnter={(e) => (e.target.style.color = C.text)}
                                onMouseLeave={(e) => (e.target.style.color = C.accent2)}
                            >Sign in →</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}