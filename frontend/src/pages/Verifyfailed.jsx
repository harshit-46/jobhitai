import { Link } from "react-router-dom";

export default function VerifyFailed() {
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
                @keyframes xDraw1 {
                    from { stroke-dashoffset: 40; }
                    to { stroke-dashoffset: 0; }
                }
                @keyframes xDraw2 {
                    from { stroke-dashoffset: 40; }
                    to { stroke-dashoffset: 0; }
                }
                @keyframes circleDraw {
                    from { stroke-dashoffset: 120; }
                    to { stroke-dashoffset: 0; }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-4px); }
                    40% { transform: translateX(4px); }
                    60% { transform: translateX(-3px); }
                    80% { transform: translateX(3px); }
                }
                .anim-1 { animation: fadeUp 0.5s ease forwards; opacity: 0; }
                .anim-2 { animation: fadeUp 0.5s 0.15s ease forwards; opacity: 0; }
                .anim-3 { animation: fadeUp 0.5s 0.3s ease forwards; opacity: 0; }
                .anim-4 { animation: fadeUp 0.5s 0.45s ease forwards; opacity: 0; }
                .anim-5 { animation: fadeUp 0.5s 0.6s ease forwards; opacity: 0; }
                .x-circle { stroke-dasharray: 120; animation: circleDraw 0.6s 0.2s ease forwards; stroke-dashoffset: 120; }
                .x-line-1 { stroke-dasharray: 40; animation: xDraw1 0.3s 0.7s ease forwards; stroke-dashoffset: 40; }
                .x-line-2 { stroke-dasharray: 40; animation: xDraw2 0.3s 0.9s ease forwards; stroke-dashoffset: 40; }
                .icon-shake { animation: shake 0.5s 1.2s ease forwards; }
                .btn-shimmer { position: relative; overflow: hidden; }
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

            <div className="font-dm min-h-screen bg-[#0a0a0e] text-[#f0ede8] flex items-center justify-center relative overflow-hidden">

                {/* Grid dots */}
                <div className="absolute inset-0 grid-dots" />

                {/* BG orbs - red tint for error */}
                <div className="fixed rounded-full pointer-events-none blur-[120px] z-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(248,113,113,0.04)_0%,transparent_70%)] -top-64 -left-48" />
                <div className="fixed rounded-full pointer-events-none blur-[80px] z-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(232,255,71,0.02)_0%,transparent_70%)] bottom-0 right-0" />

                {/* Noise */}
                <div
                    className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.028]"
                    style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                    }}
                />

                <div className="relative z-10 w-full max-w-md px-6">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-10 text-center">

                        {/* Logo */}
                        <div className="anim-1 font-fraunces font-black text-2xl tracking-tight text-[#f0ede8] mb-8">
                            Career<span className="text-[#E8FF47]">Crafter</span>
                        </div>

                        {/* Animated X */}
                        <div className="anim-2 flex justify-center mb-7">
                            <div className="relative w-16 h-16 icon-shake">
                                {/* Glow */}
                                <div className="absolute inset-0 rounded-full bg-red-400/10 blur-lg" />
                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                    <circle
                                        cx="32" cy="32" r="28"
                                        stroke="#f87171"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        className="x-circle"
                                        fill="rgba(248,113,113,0.06)"
                                    />
                                    <path
                                        d="M22 22l20 20"
                                        stroke="#f87171"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        className="x-line-1"
                                    />
                                    <path
                                        d="M42 22L22 42"
                                        stroke="#f87171"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        className="x-line-2"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Heading */}
                        <h2 className="anim-3 font-fraunces font-black text-[1.75rem] tracking-[-0.03em] text-[#f87171] mb-2">
                            Verification Failed
                        </h2>

                        <p className="anim-4 text-sm text-white/40 font-light leading-relaxed mb-7">
                            This link is invalid or has already expired. Verification links are single-use only.
                        </p>

                        {/* What to do box */}
                        <div className="anim-4 rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3 mb-7 text-left flex gap-3 items-start">
                            <span className="text-[#E8FF47] mt-0.5 text-sm">💡</span>
                            <p className="text-xs text-white/30 leading-relaxed">
                                Try signing up again with the same email — a new verification link will be sent to your inbox.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="anim-5 flex flex-col gap-3">
                            <Link
                                to="/signup"
                                className="btn-shimmer w-full py-3 rounded-xl text-[#0a0a0e] text-sm font-bold no-underline bg-[#E8FF47] hover:bg-yellow-200 transition-colors duration-200 flex items-center justify-center shadow-[0_4px_24px_rgba(232,255,71,0.2)]"
                            >
                                Try Signing Up Again
                            </Link>

                            <Link
                                to="/login"
                                className="text-sm text-white/30 no-underline hover:text-white/50 transition-colors duration-200"
                            >
                                Already verified? Go to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}