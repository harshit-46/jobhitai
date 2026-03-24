const STATS = [
    { num: "2.4M+", label: "Resumes Built" },
    { num: "89%", label: "Interview Rate" },
    { num: "140K+", label: "Jobs Applied" },
    { num: "4.9★", label: "User Rating" },
];

export default function Hero() {
    return (
        <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-35 pb-20">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest mb-9 bg-[#7c6af71a] border border-[#7c6af740] text-[#a599ff]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3fd898] animate-pulse" />
                AI-Powered Career Platform
            </div>

            {/* Title */}
            <h1 className="max-w-4xl mb-7 font-serif text-[clamp(3rem,7vw,5.8rem)] leading-[1.05] tracking-[-0.03em]">
                Land your dream job <br />
                with <em className="text-[#a599ff] not-italic">AI precision</em>
            </h1>

            {/* Subtitle */}
            <p className="text-lg max-w-xl mb-11 text-[#7b7a92]">
                Build ATS-ready resumes, score against real job descriptions, and get personalized career coaching.
            </p>

            {/* Buttons */}
            <div className="flex gap-3 flex-wrap justify-center">
                <button className="px-8 py-3.5 rounded-full bg-linear-to-r from-[#7c6af7] to-[#5c4ed4] text-white shadow-[0_4px_30px_rgba(124,106,247,0.4)] hover:-translate-y-0.5 transition">
                    Start for free →
                </button>

                <button className="px-7 py-3.5 rounded-full border border-white/20 text-[#7b7a92] hover:text-white hover:bg-white/5 transition">
                    See how it works
                </button>
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row mt-16 rounded-2xl overflow-hidden border border-white/10 bg-[#111118]">
                {STATS.map((s, i) => (
                    <div key={s.label} className="px-10 py-6 text-center border-r last:border-none border-white/10">
                        <span className="block text-3xl font-serif text-white">{s.num}</span>
                        <div className="text-xs uppercase text-[#4a4963]">{s.label}</div>
                    </div>
                ))}
            </div>

        </section>
    );
}