import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function ForgotPassword() {
    const [email, setEmail]       = useState("");
    const [focused, setFocused]   = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError]       = useState("");
    const [sent, setSent]         = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) { setError("Please enter your email address."); return; }

        try {
            setIsLoading(true);
            setError("");
            await api.post("/forgot-password", { email });
            setSent(true);
        } catch (err) {
            setError(err?.response?.data?.detail || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,800;1,9..144,300;1,9..144,700&display=swap');
                .font-fraunces { font-family: 'Fraunces', serif; }
                .font-dm       { font-family: 'DM Sans', sans-serif; }
                .grid-dots {
                    background-image:
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 52px 52px;
                }
                .btn-shimmer::before {
                    content: '';
                    position: absolute; inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.7s ease;
                }
                .btn-shimmer:hover::before { transform: translateX(100%); }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.88); }
                    to   { opacity: 1; transform: scale(1); }
                }
                .fade-up   { animation: fadeUp  0.5s cubic-bezier(0.22,1,0.36,1) both; }
                .scale-in  { animation: scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
                .d1 { animation-delay: 0.07s; }
                .d2 { animation-delay: 0.14s; }
                .d3 { animation-delay: 0.21s; }
            `}</style>

            <div className="font-dm min-h-screen bg-[#0a0a0e] text-[#f0ede8] overflow-hidden flex">

                {/* ── BG orbs ── */}
                <div className="fixed rounded-full pointer-events-none blur-[120px] z-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(232,255,71,0.05)_0%,transparent_70%)] -top-64 -left-48" />
                <div className="fixed rounded-full pointer-events-none blur-[80px] z-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(232,255,71,0.03)_0%,transparent_70%)] bottom-0 right-0" />
                <div className="fixed rounded-full pointer-events-none blur-[60px] z-0 w-[280px] h-[280px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] top-[50%] right-[30%]" />

                {/* Noise overlay */}
                <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.028]"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }}
                />

                {/* ── LEFT PANEL ── */}
                <div className="hidden lg:flex w-[52%] relative flex-col justify-between p-14 border-r border-white/[0.06]">

                    <div className="absolute inset-0 grid-dots" />
                    <div className="absolute top-0 left-0 w-72 h-72 bg-[radial-gradient(circle,rgba(232,255,71,0.07)_0%,transparent_70%)] blur-2xl pointer-events-none" />

                    {/* Corner mark */}
                    <svg className="absolute top-10 right-10 opacity-10" width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <path d="M48 0v48H0" stroke="#E8FF47" strokeWidth="1" />
                    </svg>

                    {/* Logo */}
                    <Link to="/login" className="relative z-10 no-underline font-fraunces font-black text-2xl tracking-tight text-[#f0ede8]">
                        Career<span className="text-lime-300">Crafter</span>
                    </Link>

                    {/* Hero copy */}
                    <div className="relative z-10 max-w-sm">
                        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest mb-8 text-lime-300 bg-lime-300/[0.07] border border-lime-300/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-300 shadow-[0_0_8px_rgba(232,255,71,0.8)] animate-pulse shrink-0" />
                            Account recovery
                        </div>

                        <h2 className="font-fraunces font-black text-[2.75rem] leading-[1.05] tracking-[-0.035em] mb-5 text-[#f0ede8]">
                            Happens to the <br />
                            <em className="italic text-lime-300">best of us.</em>
                        </h2>

                        <p className="text-sm leading-relaxed font-light text-white/40 mb-10">
                            Enter your email and we'll send you a secure link to reset your password. Back in seconds.
                        </p>

                        {/* Steps */}
                        <div className="flex flex-col gap-0">
                            {[
                                { n: "01", title: "Enter your email",    body: "Provide the email linked to your JobHitAI account." },
                                { n: "02", title: "Check your inbox",    body: "We'll send a secure reset link — valid for 15 minutes." },
                                { n: "03", title: "Set a new password",  body: "Choose a strong password and you're back in." },
                            ].map((s, i) => (
                                <div key={s.n} className={`flex gap-6 ${i < 2 ? "pb-7" : ""} relative`}
                                    style={i < 2 ? { position: "relative" } : {}}>
                                    {i < 2 && (
                                        <div style={{ position: "absolute", left: 19, top: 40, bottom: -4, width: 1, background: "linear-gradient(to bottom, rgba(232,255,71,0.3), transparent)" }} />
                                    )}
                                    <div className="shrink-0 w-10 h-10 rounded-full border border-lime-300/40 flex items-center justify-center bg-[#0a0a0e] relative z-10">
                                        <span className="text-[11px] font-bold text-lime-300 tracking-wider">{s.n}</span>
                                    </div>
                                    <div className="pt-2">
                                        <h4 className="font-fraunces font-bold text-[16px] mb-1 tracking-tight text-[#f0ede8]">{s.title}</h4>
                                        <p className="text-[12px] text-white/35 leading-relaxed">{s.body}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom stats */}
                    <div className="relative z-10 flex items-center gap-8">
                        {[
                            { num: "15 min", label: "Link validity" },
                            { num: "256-bit", label: "Encryption" },
                            { num: "< 30s",  label: "Delivery time" },
                        ].map((s, i) => (
                            <div key={s.label} className={`${i > 0 ? "pl-8 border-l border-white/[0.07]" : ""}`}>
                                <div className="font-fraunces font-black text-xl text-[#f0ede8] tracking-tight">{s.num}</div>
                                <div className="text-[10px] text-white/25 uppercase tracking-widest mt-0.5">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">

                    {/* Mobile logo */}
                    <Link to="/" className="lg:hidden no-underline font-fraunces font-black text-2xl tracking-tight text-[#f0ede8] mb-12">
                        JobHit<span className="text-lime-300">AI</span>
                    </Link>

                    <div className="w-full max-w-sm">

                        {!sent ? (
                            /* ── Step 1: Email form ── */
                            <>
                                <div className="fade-up mb-8">
                                    <h1 className="font-fraunces font-black text-[2rem] tracking-[-0.03em] text-[#f0ede8] mb-2">
                                        Reset password
                                    </h1>
                                    <p className="text-sm text-white/40 font-light">
                                        Remember it?{" "}
                                        <Link to="/login" className="text-lime-300 no-underline hover:text-yellow-200 transition-colors duration-200">
                                            Back to sign in
                                        </Link>
                                    </p>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="fade-up mb-4 bg-[rgba(249,168,212,0.06)] border border-[rgba(249,168,212,0.2)] rounded-xl px-4 py-3">
                                        <p className="text-[12px] text-[#f9a8d4] leading-relaxed">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="fade-up d1 flex flex-col gap-4">

                                    {/* Email field */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
                                            Email address
                                        </label>
                                        <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                                            focused
                                                ? "border-lime-300/60 shadow-[0_0_0_3px_rgba(232,255,71,0.1)] bg-white/[0.04]"
                                                : "border-white/8 bg-white/[0.03] hover:border-white/15"
                                        }`}>
                                            <input
                                                type="email"
                                                name="email"
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                                onFocus={() => setFocused(true)}
                                                onBlur={() => setFocused(false)}
                                                placeholder="you@company.com"
                                                className="w-full bg-transparent px-4 py-3 text-sm text-[#f0ede8] placeholder-white/20 outline-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="btn-shimmer relative mt-2 w-full py-3.5 rounded-xl text-[#0a0a0e] text-sm font-bold cursor-pointer overflow-hidden transition-all duration-200 disabled:opacity-70 hover:-translate-y-px bg-lime-300 hover:bg-yellow-200 shadow-[0_4px_24px_rgba(232,255,71,0.25),0_0_0_1px_rgba(232,255,71,0.15)]"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="12" r="10" stroke="rgba(10,10,14,0.25)" strokeWidth="2.5" />
                                                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#0a0a0e" strokeWidth="2.5" strokeLinecap="round" />
                                                </svg>
                                                Sending link…
                                            </span>
                                        ) : (
                                            "Send Reset Link →"
                                        )}
                                    </button>
                                </form>

                                {/* Legal */}
                                <p className="fade-up d2 text-[11px] text-white/20 text-center mt-6 leading-relaxed">
                                    We'll only use your email to send the reset link.{" "}
                                    <a href="#" className="text-white/35 no-underline hover:text-[#f0ede8] transition-colors duration-200">Privacy Policy</a>
                                </p>
                            </>

                        ) : (
                            /* ── Step 2: Success state ── */
                            <div className="scale-in flex flex-col items-center text-center gap-6">

                                {/* Success icon */}
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-full bg-lime-300/[0.08] border border-lime-300/20 flex items-center justify-center">
                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                            <path d="M6 16l7 7 13-13" stroke="#E8FF47" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    {/* Glow ring */}
                                    <div className="absolute inset-0 rounded-full shadow-[0_0_32px_rgba(232,255,71,0.2)] pointer-events-none" />
                                </div>

                                <div>
                                    <h1 className="font-fraunces font-black text-[1.9rem] tracking-[-0.03em] text-[#f0ede8] mb-2">
                                        Check your <em className="italic text-lime-300">inbox</em>
                                    </h1>
                                    <p className="text-sm text-white/40 font-light leading-relaxed max-w-xs">
                                        We sent a reset link to{" "}
                                        <span className="text-[#f0ede8] font-medium">{email}</span>.
                                        It expires in 15 minutes.
                                    </p>
                                </div>

                                {/* Info card */}
                                <div className="w-full bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-3 text-left">
                                    {[
                                        { icon: "📬", text: "Check your spam folder if you don't see it." },
                                        { icon: "⏱", text: "The link expires in 15 minutes." },
                                        { icon: "🔒", text: "For security, the link can only be used once." },
                                    ].map((tip, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="text-[14px] shrink-0 mt-0.5">{tip.icon}</span>
                                            <p className="text-[12px] text-white/40 leading-relaxed">{tip.text}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Resend + back */}
                                <div className="w-full flex flex-col gap-3">
                                    <button
                                        onClick={() => { setSent(false); setEmail(""); }}
                                        className="w-full py-3 rounded-xl text-[13px] font-medium text-white/40 border border-white/8 bg-transparent hover:border-white/16 hover:text-[#f0ede8] transition-all duration-200"
                                    >
                                        Try a different email
                                    </button>
                                    <Link
                                        to="/login"
                                        className="w-full py-3 rounded-xl text-[13px] font-bold text-[#0a0a0e] bg-lime-300 hover:bg-yellow-200 transition-colors duration-200 no-underline text-center shadow-[0_4px_20px_rgba(232,255,71,0.2)]"
                                    >
                                        Back to Sign In
                                    </Link>
                                </div>

                                <p className="text-[11px] text-white/20">
                                    Didn't get it?{" "}
                                    <button
                                        onClick={handleSubmit}
                                        className="text-lime-300 bg-transparent border-none cursor-pointer text-[11px] hover:text-yellow-200 transition-colors duration-200 p-0"
                                    >
                                        Resend email
                                    </button>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}