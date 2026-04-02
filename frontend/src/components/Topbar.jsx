import { Link } from "react-router-dom"

const t = {
    bg: "#0a0a0e",
    surface: "rgba(255,255,255,0.03)",
    surface2: "rgba(255,255,255,0.055)",
    sidebar: "#08080b",
    text: "#f0ede8",
    muted: "rgba(240,237,232,0.45)",
    faint: "rgba(240,237,232,0.22)",
    border: "rgba(255,255,255,0.07)",
    border2: "rgba(255,255,255,0.12)",
    lime: "#E8FF47",
    limeD: "#c8dd00",
    green: "#86efac",
    gold: "#fcd34d",
    pink: "#f9a8d4",
    serif: { fontFamily: "'Fraunces', serif", fontWeight: 800 },
    serifItalic: { fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300 },
};

export default function Topbar() {
    return (
        <header style={{
            position: "fixed", top: 0, left: 256, right: 0, zIndex: 30,
            background: "rgba(10,10,14,0.85)", backdropFilter: "blur(16px)",
            borderBottom: `1px solid ${t.border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "13px 30px", fontFamily: "'DM Sans', sans-serif",
        }}>
            {/* Greeting */}
            <div>
                <h2 style={{ ...t.serif, fontSize: "1.15rem", letterSpacing: "-0.03em", color: t.text, margin: 0 }}>
                    <p style={{ margin: 0}}>Good morning, <em style={t.serifItalic}>there</em> 👋</p>
                </h2>
                <p style={{ fontSize: 11, color: t.faint, marginTop: 2, margin: "2px 0 0" }}>
                    Here's what's happening with your job search today.
                </p>
            </div>

            {/* Right controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* New Resume CTA — lime */}
                <Link to="/resume-builder"
                    style={{
                        display: "flex", alignItems: "center", gap: 5,
                        padding: "7px 16px", borderRadius: 999,
                        fontSize: 12, fontWeight: 700, color: "#0a0a0e",
                        fontFamily: "'DM Sans', sans-serif",
                        background: t.lime, border: "none", cursor: "pointer",
                        boxShadow: "0 4px 18px rgba(232,255,71,0.25), 0 0 0 1px rgba(232,255,71,0.15)",
                        transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f5ff6e"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = t.lime; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                    + New Resume
                </Link>
            </div>
        </header>
    );
}