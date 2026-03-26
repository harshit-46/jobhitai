import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate , Link } from "react-router-dom";

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

export default function LoginPage() {
    const { user, loading, login } = useAuth();

    const [formData, setFormData] = useState({
        identifier: "",
        password: ""
    });

    const [focused, setFocused] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (loading) return null;

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.identifier || !formData.password) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            await login(formData);

        } catch (err) {
            setError(err?.response?.data?.detail || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>

            <div
                className="min-h-screen bg-[#09090f] text-[#f0eff8] overflow-hidden flex"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
            >

                <div className="fixed rounded-full pointer-events-none blur-[100px] z-0 w-175 h-175 bg-[radial-gradient(circle,rgba(124,106,247,0.13)_0%,transparent_70%)] -top-75 -left-50" />
                <div className="fixed rounded-full pointer-events-none blur-[80px] z-0 w-125 h-125 bg-[radial-gradient(circle,rgba(63,216,152,0.06)_0%,transparent_70%)] bottom-0 right-0" />
                <div className="fixed rounded-full pointer-events-none blur-[60px] z-0 w-75 h-75 bg-[radial-gradient(circle,rgba(240,192,96,0.07)_0%,transparent_70%)] top-[50%] right-[30%]" />


                <div
                    className="fixed inset-0 pointer-events-none z-9999 opacity-[0.028]"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                    }}
                />


                <div className="hidden lg:flex w-[52%] relative flex-col justify-between p-14 border-r border-white/6">


                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)",
                            backgroundSize: "48px 48px",
                        }}
                    />

                    <div className="absolute top-0 left-0 w-72 h-72 bg-[radial-gradient(circle,rgba(124,106,247,0.12)_0%,transparent_70%)] blur-2xl" />

                    <a
                        href="#"
                        className="relative z-10 no-underline text-[1.5rem] tracking-[-0.02em] text-[#f0eff8]"
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                        JobHit<span className="text-[#a599ff]">AI</span>
                    </a>

                    <div className="relative z-10 max-w-sm">
                        <div
                            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-widest mb-8 text-[#a599ff] bg-[rgba(124,106,247,0.1)] border border-[rgba(124,106,247,0.25)]"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3fd898] shadow-[0_0_8px_#3fd898] animate-pulse shrink-0" />
                            Trusted by 2.4M+ job seekers
                        </div>

                        <h2
                            className="text-[2.8rem] font-normal leading-[1.06] tracking-[-0.03em] mb-6 text-[#f0eff8]"
                            style={{ fontFamily: "'Instrument Serif', serif" }}
                        >
                            Your next offer
                            <br />
                            starts{" "}
                            <em className="italic text-[#a599ff]" style={{ fontFamily: "'Instrument Serif', serif" }}>
                                right here
                            </em>
                        </h2>

                        <p className="text-sm leading-relaxed font-light text-[#7b7a92] mb-10">
                            Build ATS-ready resumes, score against real jobs, and track every application — all in one place.
                        </p>

                        <div className="flex flex-col gap-3">
                            {[
                                { initial: "R", grad: "linear-gradient(135deg,#f067a6,#d04080)", name: "Rahul Verma", role: "ML Engineer @ FAANG", quote: "87% ATS score in one edit." },
                                { initial: "P", grad: "linear-gradient(135deg,#7c6af7,#5c4ed4)", name: "Priya Sharma", role: "SWE, Bangalore", quote: "3 interview calls in a week." },
                            ].map((t) => (
                                <div
                                    key={t.name}
                                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#111118] border border-white/[0.07]"
                                >
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                                        style={{ background: t.grad }}
                                    >
                                        {t.initial}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-xs font-medium text-[#f0eff8] truncate">{t.name} · <span className="text-[#7b7a92] font-normal">{t.role}</span></div>
                                        <div className="text-xs text-[#4a4963] mt-0.5 italic">"{t.quote}"</div>
                                    </div>
                                    <div className="text-[#f0c060] text-xs ml-auto shrink-0">★★★★★</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-8">
                        {[
                            { num: "89%", label: "Interview rate" },
                            { num: "4.9★", label: "User rating" },
                            { num: "6 wks", label: "Avg. to offer" },
                        ].map((s, i) => (
                            <div key={s.label} className={`${i > 0 ? "pl-8 border-l border-white/[0.07]" : ""}`}>
                                <div
                                    className="text-xl text-[#f0eff8] tracking-[-0.03em]"
                                    style={{ fontFamily: "'Instrument Serif', serif" }}
                                >
                                    {s.num}
                                </div>
                                <div className="text-xs text-[#4a4963] uppercase tracking-widest mt-0.5">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">

                    <a
                        href="#"
                        className="lg:hidden no-underline text-[1.4rem] tracking-[-0.02em] text-[#f0eff8] mb-12"
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                        JobHit<span className="text-[#a599ff]">AI</span>
                    </a>

                    <div className="w-full max-w-100">

                        <div className="mb-8">
                            <h1
                                className="text-[2rem] font-normal tracking-[-0.025em] text-[#f0eff8] mb-2"
                                style={{ fontFamily: "'Instrument Serif', serif" }}
                            >
                                Welcome back
                            </h1>
                            <p className="text-sm text-[#7b7a92] font-light">
                                New here?{" "}
                                <Link to="/signup" className="text-[#a599ff] no-underline hover:text-[#c4baff] transition-colors duration-200">
                                    Create a free account
                                </Link>
                            </p>
                        </div>

                        <div className="flex gap-3 mb-6">
                            <button className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-medium text-[#7b7a92] bg-[#111118] border border-white/8 hover:border-white/16 hover:text-[#f0eff8] hover:bg-[#16161f] transition-all duration-200 cursor-pointer">
                                <GoogleIcon />
                                Google
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-medium text-[#7b7a92] bg-[#111118] border border-white/8 hover:border-white/16 hover:text-[#f0eff8] hover:bg-[#16161f] transition-all duration-200 cursor-pointer">
                                <GitHubIcon />
                                GitHub
                            </button>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex-1 h-px bg-white/[0.07]" />
                            <span className="text-xs text-[#4a4963] uppercase tracking-widest">or</span>
                            <div className="flex-1 h-px bg-white/[0.07]" />
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium uppercase tracking-widest text-[#7b7a92]">
                                    Email address or Username
                                </label>
                                <div
                                    className={`relative flex items-center rounded-xl border transition-all duration-200 ${focused === "identifier"
                                            ? "border-[#7c6af7] shadow-[0_0_0_3px_rgba(124,106,247,0.15)] bg-[#111118]"
                                            : "border-white/8 bg-[#111118] hover:border-white/15"
                                        }`}
                                >
                                    <input
                                        type="text"
                                        value={formData.identifier}
                                        name="identifier"
                                        onChange={handleChange}
                                        onFocus={() => setFocused("identifier")}
                                        onBlur={() => setFocused(null)}
                                        placeholder="email or username"
                                        className="w-full bg-transparent px-4 py-3 text-sm text-[#f0eff8] placeholder-[#4a4963] outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium uppercase tracking-widest text-[#7b7a92]">
                                        Password
                                    </label>
                                    <Link to="#" className="text-xs text-[#a599ff] no-underline hover:text-[#c4baff] transition-colors duration-200">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div
                                    className={`relative flex items-center rounded-xl border transition-all duration-200 ${focused === "password"
                                            ? "border-[#7c6af7] shadow-[0_0_0_3px_rgba(124,106,247,0.15)] bg-[#111118]"
                                            : "border-white/8 bg-[#111118] hover:border-white/15"
                                        }`}
                                >
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        name="password"
                                        onChange={handleChange}
                                        onFocus={() => setFocused("password")}
                                        onBlur={() => setFocused(null)}
                                        placeholder="••••••••••"
                                        className="w-full bg-transparent px-4 py-3 text-sm text-[#f0eff8] placeholder-[#4a4963] outline-none pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 text-[#4a4963] hover:text-[#7b7a92] transition-colors duration-200 cursor-pointer"
                                    >
                                        <EyeIcon open={showPassword} />
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="relative mt-2 w-full py-3.5 rounded-xl text-white text-sm font-medium cursor-pointer overflow-hidden transition-all duration-200 disabled:opacity-70 hover:-translate-y-px"
                                style={{
                                    background: loading
                                        ? "linear-gradient(135deg,#5c4ed4,#4a3eb8)"
                                        : "linear-gradient(135deg,#7c6af7,#5c4ed4)",
                                    boxShadow: "0 4px 24px rgba(124,106,247,0.4), 0 0 0 1px rgba(124,106,247,0.2)",
                                }}
                            >
                                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/[0.07] to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />

                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
                                            <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                        </svg>
                                        Signing in…
                                    </span>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </form>

                        <p className="text-xs text-[#4a4963] text-center mt-6 leading-relaxed">
                            By signing in you agree to our{" "}
                            <a href="#" className="text-[#7b7a92] no-underline hover:text-[#f0eff8] transition-colors duration-200">Terms</a>
                            {" "}&amp;{" "}
                            <a href="#" className="text-[#7b7a92] no-underline hover:text-[#f0eff8] transition-colors duration-200">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}


/*

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const Login = () => {
    const { user, loading, login } = useAuth();

    const [formData, setFormData] = useState({
        identifier: "",
        password: ""
    });

    const [focused, setFocused] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (loading) return null;

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.identifier || !formData.password) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            await login(formData);

        } catch (err) {
            setError(err?.response?.data?.detail || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090f] text-white px-4">
            <div className="w-full max-w-md">


                <h1 className="text-3xl font-serif mb-2">Login</h1>
                <p className="text-[#7b7a92] mb-6">
                    Welcome back! Please enter your details.
                </p>


                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs uppercase tracking-widest text-[#7b7a92]">
                            Username or Email address
                        </label>

                        <input
                            type="text"
                            value={formData.identifier}
                            name="identifier"
                            onChange={handleChange}
                            onFocus={() => setFocused("identifier")}
                            onBlur={() => setFocused(null)}
                            placeholder="you@example.com"
                            className={`w-full px-4 py-3 rounded-xl bg-[#111118] border text-sm outline-none transition
                ${focused === "identifier"
                                    ? "border-[#7c6af7] ring-2 ring-[#7c6af7]/20"
                                    : "border-white/10 hover:border-white/20"
                                }`}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                            <label className="text-xs uppercase tracking-widest text-[#7b7a92]">
                                Password
                            </label>
                            <a className="text-xs text-[#a599ff] hover:text-[#c4baff]">
                                Forgot password?
                            </a>
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                name="password"
                                onChange={handleChange}
                                onFocus={() => setFocused("password")}
                                onBlur={() => setFocused(null)}
                                placeholder="••••••••"
                                className={`w-full px-4 py-3 rounded-xl bg-[#111118] border text-sm pr-12 outline-none transition
                                ${focused === "password"
                                        ? "border-[#7c6af7] ring-2 ring-[#7c6af7]/20"
                                        : "border-white/10 hover:border-white/20"
                                    }`}
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a4963] hover:text-white"
                            >
                                {showPassword ? "🙈" : "👁"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}


                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-2 w-full py-3.5 rounded-xl text-white text-sm font-medium transition
                        bg-linear-to-r from-[#7c6af7] to-[#5c4ed4]
                        hover:-translate-y-px
                        disabled:opacity-70"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
                                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2" fill="none" />
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            "Sign in →"
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default Login;


*/