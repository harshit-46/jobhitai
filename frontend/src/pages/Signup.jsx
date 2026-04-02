import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function EyeIcon({ open }) {
    return open ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
        </svg>
    ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2l12 12M6.5 6.6A2 2 0 0 0 9.4 9.5M4.2 4.3C2.8 5.3 2 8 2 8s2.5 5 6 5c1.3 0 2.4-.4 3.3-1M6 3.1C6.6 3 7.3 3 8 3c3.5 0 6 5 6 5s-.6 1.2-1.6 2.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
        </svg>
    );
}

function GitHubIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
    );
}

function StrengthBar({ password }) {
    const score =
        password.length === 0 ? 0
            : password.length < 6 ? 1
                : password.length < 10 ? 2
                    : /[^a-zA-Z0-9]/.test(password) ? 4
                        : 3;
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    // Remapped to landing palette: red → orange → lime-dim → lime-bright
    const colors = ["", "#f87171", "#fbbf24", "#a3e635", "#E8FF47"];
    return (
        <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: i <= score ? colors[score] : "rgba(255,255,255,0.07)" }}
                    />
                ))}
            </div>
            {password.length > 0 && (
                <p className="text-xs" style={{ color: colors[score] }}>{labels[score]} password</p>
            )}
        </div>
    );
}

export default function SignupPage() {
    const { user, signup } = useAuth();

    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    const [focused, setFocused] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

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

    const loginGoogle = () => {
        window.location.href = "https://jobhitai-server.onrender.com/auth/google";
    };

    const loginGithub = () => {
        window.location.href = "https://jobhitai-server.onrender.com/auth/github";
    };

    const inputClass = (field) =>
        `relative flex items-center rounded-xl border transition-all duration-200 ${focused === field
            ? "border-lime-300/60 shadow-[0_0_0_3px_rgba(232,255,71,0.1)] bg-white/[0.04]"
            : "border-white/8 bg-white/[0.03] hover:border-white/15"
        }`;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,800;1,9..144,300;1,9..144,700&display=swap');
                .font-fraunces { font-family: 'Fraunces', serif; }
                .font-dm { font-family: 'DM Sans', sans-serif; }
                .grid-dots {
                    background-image:
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 52px 52px;
                }
                .btn-shimmer::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.7s ease;
                }
                .btn-shimmer:hover::before { transform: translateX(100%); }
            `}</style>

            <div className="font-dm min-h-screen bg-[#0a0a0e] text-[#f0ede8] overflow-hidden flex">

                {/* ── BG orbs (landing palette) ── */}
                <div className="fixed rounded-full pointer-events-none blur-[120px] z-0 w-150 h-150 bg-[radial-gradient(circle,rgba(232,255,71,0.05)_0%,transparent_70%)] -top-64 -left-48" />
                <div className="fixed rounded-full pointer-events-none blur-[80px] z-0 w-100 h-100 bg-[radial-gradient(circle,rgba(232,255,71,0.03)_0%,transparent_70%)] bottom-0 right-0" />
                <div className="fixed rounded-full pointer-events-none blur-[60px] z-0 w-70 h-70 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] top-[50%] right-[30%]" />

                {/* Noise overlay */}
                <div
                    className="fixed inset-0 pointer-events-none z-9999 opacity-[0.028]"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                    }}
                />

                {/* ── LEFT PANEL ── */}
                <div className="hidden lg:flex w-[52%] relative flex-col justify-between p-14 border-r border-white/6">

                    {/* Grid dots */}
                    <div className="absolute inset-0 grid-dots" />

                    {/* Corner glow */}
                    <div className="absolute top-0 left-0 w-72 h-72 bg-[radial-gradient(circle,rgba(232,255,71,0.07)_0%,transparent_70%)] blur-2xl pointer-events-none" />

                    {/* Corner mark */}
                    <svg className="absolute top-10 right-10 opacity-10" width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <path d="M48 0v48H0" stroke="#E8FF47" strokeWidth="1" />
                    </svg>

                    {/* Logo */}
                    <Link
                        to="/"
                        className="relative z-10 no-underline font-fraunces font-black text-2xl tracking-tight text-[#f0ede8]"
                    >
                        JobHit<span className="text-lime-300">AI</span>
                    </Link>

                    {/* Hero copy */}
                    <div className="relative z-10 max-w-sm">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest mb-8 text-lime-300 bg-lime-300/[0.07] border border-lime-300/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-300 shadow-[0_0_8px_rgba(232,255,71,0.8)] animate-pulse shrink-0" />
                            Free forever — no card needed
                        </div>

                        <h2 className="font-fraunces font-black text-[2.75rem] leading-[1.05] tracking-[-0.035em] mb-5 text-[#f0ede8]">
                            Land your next job
                            <br />
                            <em className="italic text-lime-300">smarter</em>{" "}not harder
                        </h2>

                        <p className="text-sm leading-relaxed font-light text-white/40 mb-10">
                            Build ATS-ready resumes, score against real jobs, and track every application — all in one place.
                        </p>

                        {/* Feature cards */}
                        <div className="flex flex-col gap-3">
                            {[
                                { icon: "🧠", title: "AI Resume Builder", desc: "Craft ATS-ready resumes tailored to any job." },
                                { icon: "📊", title: "Live Score Engine", desc: "Get real-time match resume vs. job description score." },
                                { icon: "⚡", title: "One-Click Apply", desc: "Apply to hundreds of jobs without manual effort." },
                            ].map((f) => (
                                <div
                                    key={f.title}
                                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/3 border border-white/[0.07]"
                                >
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 bg-lime-300/8 border border-lime-300/18">
                                        {f.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-xs font-medium text-[#f0ede8]">{f.title}</div>
                                        <div className="text-xs text-white/20 mt-0.5">{f.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="relative z-10 flex items-center gap-8">
                        {[
                            { num: "89%", label: "Interview rate" },
                            { num: "4.9★", label: "User rating" },
                            { num: "6 wks", label: "Avg. to offer" },
                        ].map((s, i) => (
                            <div key={s.label} className={`${i > 0 ? "pl-8 border-l border-white/[0.07]" : ""}`}>
                                <div className="font-fraunces font-black text-xl text-[#f0ede8] tracking-tight">
                                    {s.num}
                                </div>
                                <div className="text-[10px] text-white/25 uppercase tracking-widest mt-0.5">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">

                    {/* Mobile logo */}
                    <Link
                        to="/"
                        className="lg:hidden no-underline font-fraunces font-black text-2xl tracking-tight text-[#f0ede8] mb-12"
                    >
                        JobHit<span className="text-lime-300">AI</span>
                    </Link>

                    <div className="w-full max-w-sm">

                        {/* Heading */}
                        <div className="mb-8">
                            <h1 className="font-fraunces font-black text-[2rem] tracking-[-0.03em] text-[#f0ede8] mb-2">
                                Create your account
                            </h1>
                            <p className="text-sm text-white/40 font-light">
                                Already have one?{" "}
                                <Link to="/login" className="text-lime-300 no-underline hover:text-yellow-200 transition-colors duration-200">
                                    Sign in instead
                                </Link>
                            </p>
                        </div>

                        {/* OAuth buttons */}
                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={loginGoogle}
                                className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-medium text-white/40 bg-white/3 border border-white/8 hover:border-white/16 hover:text-[#f0ede8] hover:bg-white/6 transition-all duration-200 cursor-pointer"
                            >
                                <GoogleIcon />
                                Google
                            </button>
                            <button
                                onClick={loginGithub}
                                className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-medium text-white/40 bg-white/3 border border-white/8 hover:border-white/16 hover:text-[#f0ede8] hover:bg-white/6 transition-all duration-200 cursor-pointer"
                            >
                                <GitHubIcon />
                                GitHub
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex-1 h-px bg-white/[0.07]" />
                            <span className="text-[10px] text-white/20 uppercase tracking-widest">or</span>
                            <div className="flex-1 h-px bg-white/[0.07]" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                            {/* Full name */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
                                    Full name
                                </label>
                                <div className={inputClass("name")}>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocused("name")}
                                        onBlur={() => setFocused(null)}
                                        placeholder="Arjun Mehta"
                                        className="w-full bg-transparent px-4 py-3 text-sm text-[#f0ede8] placeholder-white/20 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
                                    Username
                                </label>
                                <div className={inputClass("username")}>
                                    <input
                                        type="text"
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        onFocus={() => setFocused("username")}
                                        onBlur={() => setFocused(null)}
                                        placeholder="arjunmehta"
                                        className="w-full bg-transparent px-4 py-3 text-sm text-[#f0ede8] placeholder-white/20 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
                                    Email address
                                </label>
                                <div className={inputClass("email")}>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocused("email")}
                                        onBlur={() => setFocused(null)}
                                        placeholder="you@company.com"
                                        className="w-full bg-transparent px-4 py-3 text-sm text-[#f0ede8] placeholder-white/20 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
                                    Password
                                </label>
                                <div className={inputClass("password")}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocused("password")}
                                        onBlur={() => setFocused(null)}
                                        placeholder="Min. 8 characters"
                                        className="w-full bg-transparent px-4 py-3 text-sm text-[#f0ede8] placeholder-white/20 outline-none pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 text-white/20 hover:text-white/50 transition-colors duration-200 cursor-pointer"
                                    >
                                        <EyeIcon open={showPassword} />
                                    </button>
                                </div>
                                <StrengthBar password={form.password} />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-shimmer relative mt-2 w-full py-3.5 rounded-xl text-[#0a0a0e] text-sm font-bold cursor-pointer overflow-hidden transition-all duration-200 disabled:opacity-70 hover:-translate-y-px bg-lime-300 hover:bg-yellow-200 shadow-[0_4px_24px_rgba(232,255,71,0.25),0_0_0_1px_rgba(232,255,71,0.15)]"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="rgba(10,10,14,0.25)" strokeWidth="2.5" />
                                            <path d="M12 2a10 10 0 0 1 10 10" stroke="#0a0a0e" strokeWidth="2.5" strokeLinecap="round" />
                                        </svg>
                                        Creating account…
                                    </span>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}