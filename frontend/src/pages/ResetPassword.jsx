import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

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

function StrengthBar({ password }) {
    const score =
        password.length === 0 ? 0
            : password.length < 6 ? 1
                : password.length < 10 ? 2
                    : /[^a-zA-Z0-9]/.test(password) ? 4
                        : 3;
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
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

export default function ResetPassword() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const token = params.get("token");

    const [form, setForm] = useState({ password: "", confirm: "" });
    const [focused, setFocused] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const passwordsMatch = form.password === form.confirm;
    const confirmTouched = form.confirm.length > 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!passwordsMatch) {
            setError("Passwords do not match.");
            return;
        }
        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await api.post("/resetpassword", {
                token,
                new_password: form.password,
            });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.response?.data?.detail || "Reset failed. The link may have expired.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field) =>
        `relative flex items-center rounded-xl border transition-all duration-200 ${
            focused === field
                ? "border-lime-300/60 shadow-[0_0_0_3px_rgba(232,255,71,0.1)] bg-white/[0.04]"
                : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15]"
        }`;

    // No token in URL
    if (!token) {
        return (
            <div className="font-dm min-h-screen bg-[#0a0a0e] flex items-center justify-center px-6">
                <div className="text-center max-w-sm">
                    <p className="text-white/40 text-sm mb-4">Invalid or missing reset token.</p>
                    <Link to="/forgot-password" className="text-[#E8FF47] text-sm no-underline">
                        Request a new reset link
                    </Link>
                </div>
            </div>
        );
    }

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
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                }
                @keyframes pulse-ring {
                    0% { transform: scale(1); opacity: 0.3; }
                    100% { transform: scale(1.6); opacity: 0; }
                }
                @keyframes checkDraw {
                    from { stroke-dashoffset: 40; }
                    to { stroke-dashoffset: 0; }
                }
                @keyframes circleDraw {
                    from { stroke-dashoffset: 120; }
                    to { stroke-dashoffset: 0; }
                }
                @keyframes progressFill {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .anim-1 { animation: fadeUp 0.5s ease forwards; opacity: 0; }
                .anim-2 { animation: fadeUp 0.5s 0.1s ease forwards; opacity: 0; }
                .anim-3 { animation: fadeUp 0.5s 0.2s ease forwards; opacity: 0; }
                .anim-4 { animation: fadeUp 0.5s 0.3s ease forwards; opacity: 0; }
                .anim-5 { animation: fadeUp 0.5s 0.4s ease forwards; opacity: 0; }
                .anim-6 { animation: fadeUp 0.5s 0.5s ease forwards; opacity: 0; }
                .icon-float { animation: float 3s ease-in-out infinite; }
                .pulse-ring {
                    position: absolute; inset: -10px; border-radius: 50%;
                    border: 1px solid rgba(232,255,71,0.25);
                    animation: pulse-ring 2.2s ease-out infinite;
                }
                .pulse-ring-2 {
                    position: absolute; inset: -10px; border-radius: 50%;
                    border: 1px solid rgba(232,255,71,0.15);
                    animation: pulse-ring 2.2s 0.7s ease-out infinite;
                }
                .check-circle { stroke-dasharray: 120; animation: circleDraw 0.6s 0.2s ease forwards; stroke-dashoffset: 120; }
                .check-mark { stroke-dasharray: 40; animation: checkDraw 0.4s 0.7s ease forwards; stroke-dashoffset: 40; }
                .progress-bar { animation: progressFill 3s 0.8s linear forwards; width: 0%; }
                .shimmer-text {
                    background: linear-gradient(90deg, #E8FF47 0%, #ffffff 40%, #E8FF47 60%, #a3e635 100%);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 3s 1s linear infinite;
                }
                .btn-shimmer { position: relative; overflow: hidden; }
                .btn-shimmer::before {
                    content: '';
                    position: absolute; inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.7s ease;
                }
                .btn-shimmer:hover::before { transform: translateX(100%); }
            `}</style>

            <div className="font-dm min-h-screen bg-[#0a0a0e] text-[#f0ede8] flex items-center justify-center relative overflow-hidden">

                {/* Grid dots */}
                <div className="absolute inset-0 grid-dots" />

                {/* BG orbs */}
                <div className="fixed rounded-full pointer-events-none blur-[120px] z-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(232,255,71,0.05)_0%,transparent_70%)] -top-64 -left-48" />
                <div className="fixed rounded-full pointer-events-none blur-[80px] z-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(232,255,71,0.03)_0%,transparent_70%)] bottom-0 right-0" />
                <div className="fixed rounded-full pointer-events-none blur-[60px] z-0 w-[280px] h-[280px] bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,transparent_70%)] top-[50%] right-[30%]" />

                {/* Noise */}
                <div
                    className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.028]"
                    style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                    }}
                />

                <div className="relative z-10 w-full max-w-md px-6">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-10">

                        {/* Logo */}
                        <div className="anim-1 font-fraunces font-black text-2xl tracking-tight text-[#f0ede8] mb-8 text-center">
                            Career<span className="text-[#E8FF47]">Crafter</span>
                        </div>

                        {!success ? (
                            <>
                                {/* Icon */}
                                <div className="anim-2 flex justify-center mb-7">
                                    <div className="relative">
                                        <div className="pulse-ring" />
                                        <div className="pulse-ring-2" />
                                        <div className="icon-float w-16 h-16 rounded-full bg-[#E8FF47]/10 border border-[#E8FF47]/20 flex items-center justify-center">
                                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="#E8FF47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Heading */}
                                <div className="anim-3 text-center mb-8">
                                    <h1 className="font-fraunces font-black text-[1.75rem] tracking-[-0.03em] text-[#f0ede8] mb-2">
                                        Set new password
                                    </h1>
                                    <p className="text-sm text-white/40 font-light">
                                        Choose something strong you'll remember.
                                    </p>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="mb-5 px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/20 text-sm text-red-400 text-center">
                                        {error}
                                    </div>
                                )}

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                                    {/* New password */}
                                    <div className="anim-4 flex flex-col gap-1.5">
                                        <label className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
                                            New Password
                                        </label>
                                        <div className={inputClass("password")}>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={form.password}
                                                onChange={(e) => setForm({ ...form, password: e.target.value })}
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

                                    {/* Confirm password */}
                                    <div className="anim-5 flex flex-col gap-1.5">
                                        <label className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
                                            Confirm Password
                                        </label>
                                        <div className={`${inputClass("confirm")} ${
                                            confirmTouched && !passwordsMatch
                                                ? "!border-red-400/50 !shadow-[0_0_0_3px_rgba(248,113,113,0.08)]"
                                                : confirmTouched && passwordsMatch
                                                    ? "!border-[#E8FF47]/40"
                                                    : ""
                                        }`}>
                                            <input
                                                type={showConfirm ? "text" : "password"}
                                                value={form.confirm}
                                                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                                                onFocus={() => setFocused("confirm")}
                                                onBlur={() => setFocused(null)}
                                                placeholder="Repeat your password"
                                                className="w-full bg-transparent px-4 py-3 text-sm text-[#f0ede8] placeholder-white/20 outline-none pr-12"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirm(!showConfirm)}
                                                className="absolute right-4 text-white/20 hover:text-white/50 transition-colors duration-200 cursor-pointer"
                                            >
                                                <EyeIcon open={showConfirm} />
                                            </button>
                                        </div>
                                        {confirmTouched && !passwordsMatch && (
                                            <p className="text-xs text-red-400">Passwords don't match</p>
                                        )}
                                        {confirmTouched && passwordsMatch && (
                                            <p className="text-xs text-[#E8FF47]">Passwords match ✓</p>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <div className="anim-6">
                                        <button
                                            type="submit"
                                            disabled={loading || (confirmTouched && !passwordsMatch)}
                                            className="btn-shimmer w-full py-3.5 rounded-xl text-[#0a0a0e] text-sm font-bold cursor-pointer transition-all duration-200 disabled:opacity-70 hover:-translate-y-px bg-[#E8FF47] hover:bg-yellow-200 shadow-[0_4px_24px_rgba(232,255,71,0.25),0_0_0_1px_rgba(232,255,71,0.15)]"
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                        <circle cx="12" cy="12" r="10" stroke="rgba(10,10,14,0.25)" strokeWidth="2.5" />
                                                        <path d="M12 2a10 10 0 0 1 10 10" stroke="#0a0a0e" strokeWidth="2.5" strokeLinecap="round" />
                                                    </svg>
                                                    Updating…
                                                </span>
                                            ) : (
                                                "Reset Password"
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {/* Back */}
                                <div className="anim-6 text-center mt-6">
                                    <Link
                                        to="/login"
                                        className="text-sm text-white/30 no-underline hover:text-white/50 transition-colors duration-200"
                                    >
                                        ← Back to Login
                                    </Link>
                                </div>
                            </>
                        ) : (
                            /* ── Success state ── */
                            <div className="text-center py-4">
                                <div className="flex justify-center mb-6">
                                    <div className="relative w-16 h-16">
                                        <div className="absolute inset-0 rounded-full bg-[#E8FF47]/10 blur-lg" />
                                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                            <circle cx="32" cy="32" r="28" stroke="#E8FF47" strokeWidth="1.5" strokeLinecap="round" className="check-circle" fill="rgba(232,255,71,0.06)" />
                                            <path d="M20 32l9 9 15-15" stroke="#E8FF47" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="check-mark" />
                                        </svg>
                                    </div>
                                </div>

                                <h2 className="font-fraunces font-black text-[1.75rem] tracking-[-0.03em] mb-2">
                                    <span className="shimmer-text">Password Updated!</span>
                                </h2>
                                <p className="text-sm text-white/40 font-light mb-6">
                                    Your password has been reset. Redirecting to login…
                                </p>

                                {/* Progress bar */}
                                <div className="w-full h-0.5 bg-white/[0.06] rounded-full mb-6 overflow-hidden">
                                    <div className="progress-bar h-full bg-[#E8FF47] rounded-full" />
                                </div>

                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-sm text-[#E8FF47] no-underline hover:text-yellow-200 transition-colors duration-200"
                                >
                                    Go to Login now
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}