const NAV_LINKS = ["Features", "How it works", "Pricing"];

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-5 backdrop-blur-xl border-b border-white/10 bg-[rgba(9,9,15,0.7)]">

            <a className="text-xl font-serif text-white">
                JobHit<span className="text-[#a599ff]">AI</span>
            </a>

            <ul className="hidden md:flex items-center gap-9">
                {NAV_LINKS.map((l) => (
                    <li key={l}>
                        <a
                            href={`#${l.toLowerCase().replace(/\s/g, "")}`}
                            className="text-sm text-[#7b7a92] hover:text-white transition"
                        >
                            {l}
                        </a>
                    </li>
                ))}

                <li>
                    <button className="px-6 py-2 rounded-full bg-[#7c6af7] text-white shadow-[0_0_20px_rgba(124,106,247,0.3)] hover:bg-[#a599ff] transition">
                        Get Started →
                    </button>
                </li>
            </ul>
        </nav>
    );
}