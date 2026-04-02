import { ChevronRight } from "lucide-react";
import { useState } from "react";

const t = {
    bg: "#09090f",
    surface: "#111118",
    surface2: "#16161f",
    sidebar: "#0d0d14",
    text: "#f0eff8",
    muted: "#7b7a92",
    faint: "#4a4963",
    border: "rgba(255,255,255,0.07)",
    border2: "rgba(255,255,255,0.12)",
    purple: "#7c6af7",
    purpleL: "#a599ff",
    purpleD: "#5c4ed4",
    green: "#3fd898",
    gold: "#f0c060",
    pink: "#f067a6",
    serif: { fontFamily: "'Instrument Serif', serif" },
    serifItalic: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic" },
};

export default function FeatureCard({ title, desc, icon, iconBg, iconBorder, btnBg, btnBorder, btnColor, topLine , onClick }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            style={{ position: "relative", borderRadius: 20, padding: "26px 24px", background: hov ? t.surface2 : t.surface, border: `1px solid ${t.border}`, overflow: "hidden", transition: "background 0.2s", cursor: "pointer" }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        >
            {hov && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: topLine }} />}
            <div style={{ width: 42, height: 42, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, background: iconBg, border: `1px solid ${iconBorder}`, marginBottom: 16 }}>{icon}</div>
            <h3 style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em", color: t.text, marginBottom: 7 }}>{title}</h3>
            <p style={{ fontSize: 12, lineHeight: 1.65, color: t.muted, fontWeight: 300, marginBottom: 18 }}>{desc}</p>
            <button
                onClick={onClick}
                style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 16px", borderRadius: 999, fontSize: 12, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", background: btnBg, border: `1px solid ${btnBorder}`, color: btnColor, cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.75"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
                Open <ChevronRight size={11} />
            </button>
        </div>
    );
}