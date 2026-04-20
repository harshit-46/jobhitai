import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function VerifySuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => navigate("/login"), 4000);
        return () => clearTimeout(timer);
    }, []);

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
                .anim-2 { animation: fadeUp 0.5s 0.15s ease forwards; opacity: 0; }
                .anim-3 { animation: fadeUp 0.5s 0.3s ease forwards; opacity: 0; }
                .anim-4 { animation: fadeUp 0.5s 0.45s ease forwards; opacity: 0; }
                .anim-5 { animation: fadeUp 0.5s 0.6s ease forwards; opacity: 0; }
                .check-circle { stroke-dasharray: 120; animation: circleDraw 0.6s 0.2s ease forwards; stroke-dashoffset: 120; }
                .check-mark { stroke-dasharray: 40; animation: checkDraw 0.4s 0.7s ease forwards; stroke-dashoffset: 40; }
                .progress-bar { animation: progressFill 4s 0.8s linear forwards; width: 0%; }
                .shimmer-text {
                    background: linear-gradient(90deg, #E8FF47 0%, #ffffff 40%, #E8FF47 60%, #a3e635 100%);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 3s 1s linear infinite;
                }
            `}</style>

            <div className="font-dm min-h-screen bg-[#0a0a0e] text-[#f0ede8] flex items-center justify-center relative overflow-hidden">

                {/* Grid dots */}
                <div className="absolute inset-0 grid-dots" />

                {/* BG orbs - success green tint */}
                <div className="fixed rounded-full pointer-events-none blur-[120px] z-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(232,255,71,0.07)_0%,transparent_70%)] -top-64 -left-48" />
                <div className="fixed rounded-full pointer-events-none blur-[80px] z-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(163,230,53,0.05)_0%,transparent_70%)] bottom-0 right-0" />

                {/* Noise */}
                <div
                    className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.028]"
                    style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                    }}
                />

                <div className="relative z-10 w-full max-w-md px-6">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-10 text-center overflow-hidden">

                        {/* Logo */}
                        <div className="anim-1 font-fraunces font-black text-2xl tracking-tight text-[#f0ede8] mb-8">
                            Career<span className="text-[#E8FF47]">Crafter</span>
                        </div>

                        {/* Animated check */}
                        <div className="anim-2 flex justify-center mb-7">
                            <div className="relative w-16 h-16">
                                {/* Glow */}
                                <div className="absolute inset-0 rounded-full bg-[#E8FF47]/10 blur-lg" />
                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                    <circle
                                        cx="32" cy="32" r="28"
                                        stroke="#E8FF47"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        className="check-circle"
                                        fill="rgba(232,255,71,0.06)"
                                    />
                                    <path
                                        d="M20 32l9 9 15-15"
                                        stroke="#E8FF47"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="check-mark"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Heading */}
                        <h2 className="anim-3 font-fraunces font-black text-[1.75rem] tracking-[-0.03em] mb-2">
                            <span className="shimmer-text">Email Verified!</span>
                        </h2>

                        <p className="anim-4 text-sm text-white/40 font-light leading-relaxed mb-8">
                            Your account is now active. Redirecting you to login in a moment…
                        </p>

                        {/* Progress bar */}
                        <div className="anim-4 w-full h-0.5 bg-white/[0.06] rounded-full mb-8 overflow-hidden">
                            <div className="progress-bar h-full bg-[#E8FF47] rounded-full" />
                        </div>

                        {/* CTA */}
                        <div className="anim-5">
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
                    </div>
                </div>
            </div>
        </>
    );
}