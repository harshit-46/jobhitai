import { Link } from "react-router-dom";

export default function CheckEmail() {
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
                @keyframes pulse-ring {
                    0% { transform: scale(1); opacity: 0.4; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                }
                .anim-1 { animation: fadeUp 0.5s ease forwards; opacity: 0; }
                .anim-2 { animation: fadeUp 0.5s 0.1s ease forwards; opacity: 0; }
                .anim-3 { animation: fadeUp 0.5s 0.2s ease forwards; opacity: 0; }
                .anim-4 { animation: fadeUp 0.5s 0.3s ease forwards; opacity: 0; }
                .anim-5 { animation: fadeUp 0.5s 0.4s ease forwards; opacity: 0; }
                .icon-float { animation: float 3s ease-in-out infinite; }
                .pulse-ring {
                    position: absolute;
                    inset: -8px;
                    border-radius: 50%;
                    border: 1px solid rgba(232,255,71,0.3);
                    animation: pulse-ring 2s ease-out infinite;
                }
                .pulse-ring-2 {
                    position: absolute;
                    inset: -8px;
                    border-radius: 50%;
                    border: 1px solid rgba(232,255,71,0.2);
                    animation: pulse-ring 2s 0.6s ease-out infinite;
                }
            `}</style>

            <div className="font-dm min-h-screen bg-[#0a0a0e] text-[#f0ede8] flex items-center justify-center relative overflow-hidden">

                {/* Grid dots */}
                <div className="absolute inset-0 grid-dots" />

                {/* BG orbs */}
                <div className="fixed rounded-full pointer-events-none blur-[120px] z-0 w-150 h-150 bg-[radial-gradient(circle,rgba(232,255,71,0.05)_0%,transparent_70%)] -top-64 -left-48" />
                <div className="fixed rounded-full pointer-events-none blur-[80px] z-0 w-100 h-100 bg-[radial-gradient(circle,rgba(232,255,71,0.03)_0%,transparent_70%)] bottom-0 right-0" />

                {/* Noise */}
                <div
                    className="fixed inset-0 pointer-events-none z-9999 opacity-[0.028]"
                    style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                    }}
                />

                <div className="relative z-10 w-full max-w-md px-6">
                    <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-10 text-center">

                        {/* Logo */}
                        <div className="anim-1 font-fraunces font-black text-2xl tracking-tight text-[#f0ede8] mb-8">
                            Career<span className="text-[#E8FF47]">Crafter</span>
                        </div>

                        {/* Icon */}
                        <div className="anim-2 flex justify-center mb-7">
                            <div className="relative">
                                <div className="pulse-ring" />
                                <div className="pulse-ring-2" />
                                <div className="icon-float w-16 h-16 rounded-full bg-[#E8FF47]/10 border border-[#E8FF47]/20 flex items-center justify-center">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="#E8FF47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Heading */}
                        <h2 className="anim-3 font-fraunces font-black text-[1.75rem] tracking-[-0.03em] text-[#f0ede8] mb-3">
                            Check your inbox
                        </h2>

                        {/* Body */}
                        <p className="anim-4 text-sm text-white/40 font-light leading-relaxed mb-2">
                            We've sent a verification link to your email address.
                        </p>
                        <p className="anim-4 text-sm text-white/40 font-light leading-relaxed mb-7">
                            Click the link to verify your account before logging in.
                        </p>

                        {/* Tip box */}
                        <div className="anim-4 rounded-xl bg-white/3 border border-white/6 px-4 py-3 mb-7 text-left flex gap-3 items-start">
                            <span className="text-[#E8FF47] mt-0.5 text-sm">💡</span>
                            <p className="text-xs text-white/30 leading-relaxed">
                                Can't find the email? Check your <span className="text-white/50">spam or junk folder</span>. It may take a minute to arrive.
                            </p>
                        </div>

                        {/* Back to login */}
                        <div className="anim-5">
                            <Link
                                to="/login"
                                className="text-sm text-[#E8FF47] no-underline hover:text-yellow-200 transition-colors duration-200"
                            >
                                ← Back to login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}