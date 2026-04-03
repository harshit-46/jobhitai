import { Home, FileText, BarChart, Brain, Folder, Settings, LogOut, Briefcase, Anchor, User, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

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
    serifItalic: { fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 800 },
};

const MENU = [
    { name: "Dashboard",      icon: Home,     path: "/dashboard" },
    { name: "Resume Builder", icon: FileText,  path: "/resume-builder" },
    { name: "Career Advisor", icon: BarChart,  path: "/career-advisor" },
    { name: "Skill Matcher",  icon: Brain,     path: "/skill-matcher" },
    { name: "Job Category",   icon: Briefcase, path: "/job-category" },
    { name: "Skill Match Set",icon: Anchor,    path: "/skill-match-set" },
];

const SETTINGS_MENU = [
    { name: "Profile",    icon: User,     path: "/profile" },
    { name: "My Resumes", icon: Folder,   path: "/myresumes" },
];

export default function Sidebar({ user, onLogout }) {
    const navigate = useNavigate();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const settingsRef = useRef(null);

    const initial     = user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U";
    const displayName = user?.name ?? user?.email?.split("@")[0] ?? "User";

    const handleClick = (path) => () => {
        navigate(path);
    };

    // Close popup when clicking outside
    useEffect(() => {
        const handleOutside = (e) => {
            if (settingsRef.current && !settingsRef.current.contains(e.target)) {
                setSettingsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    return (
        <aside style={{
            width: 256, minWidth: 256,
            background: t.sidebar,
            borderRight: `1px solid ${t.border}`,
            display: "flex", flexDirection: "column",
            position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 40,
        }}>

            {/* Logo */}
            <div style={{ padding: "19px 26px", borderBottom: `1px solid ${t.border}` }}>
                <span style={{ ...t.serif, fontSize: "1.42rem", letterSpacing: "-0.03em", color: t.text }}>
                    Career<span style={{ color: t.lime }}>Crafter</span>
                </span>
            </div>

            {/* User pill */}
            <div style={{
                margin: "14px 10px 4px", padding: "11px 12px", borderRadius: 16,
                background: t.surface, border: `1px solid ${t.border}`,
                display: "flex", alignItems: "center", gap: 10,
            }}>
                <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "linear-gradient(135deg,#E8FF47,#c8dd00)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: "#0a0a0e", flexShrink: 0,
                }}>
                    {initial}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em", color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {displayName}
                    </div>
                    <div style={{ fontSize: 11, color: t.faint, marginTop: 1 }}>Pro Plan</div>
                </div>
                {/* Online dot */}
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: t.lime, boxShadow: `0 0 8px rgba(232,255,71,0.7)`, flexShrink: 0 }} />
            </div>

            {/* Nav items */}
            <nav style={{ flex: 1, padding: "8px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
                {MENU.map(({ name, icon: Icon, path }) => {
                    const on = path === name;
                    return (
                        <button
                            key={name}
                            onClick={handleClick(path)}
                            style={{
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "10px 13px", borderRadius: 12, fontSize: 13,
                                fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                                background: on ? "rgba(232,255,71,0.08)" : "transparent",
                                color: on ? t.lime : t.muted,
                                border: on ? "1px solid rgba(232,255,71,0.18)" : "1px solid transparent",
                                cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                if (!on) {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                    e.currentTarget.style.color = t.text;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!on) {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = t.muted;
                                }
                            }}
                        >
                            <Icon size={14} />
                            {name}
                            {on && (
                                <span style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: t.lime }} />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Settings button with popup */}
            <div style={{ padding: "10px 8px", borderTop: `1px solid ${t.border}`, position: "relative" }} ref={settingsRef}>

                {/* Settings popup menu */}
                {settingsOpen && (
                    <div style={{
                        position: "absolute",
                        bottom: "calc(100% - 10px)",
                        left: 8,
                        right: 8,
                        background: "#111116",
                        border: `1px solid ${t.border2}`,
                        borderRadius: 14,
                        padding: "6px",
                        boxShadow: "0 -8px 32px rgba(0,0,0,0.5)",
                        zIndex: 50,
                        animation: "popupFadeIn 0.15s ease",
                    }}>
                        <style>{`
                            @keyframes popupFadeIn {
                                from { opacity: 0; transform: translateY(6px); }
                                to   { opacity: 1; transform: translateY(0); }
                            }
                        `}</style>

                        {/* Divider label */}
                        <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: t.faint, padding: "4px 10px 6px", fontFamily: "'DM Sans', sans-serif" }}>
                            Settings
                        </div>

                        {/* Profile & My Resumes */}
                        {SETTINGS_MENU.map(({ name, icon: Icon, path }) => (
                            <button
                                key={name}
                                onClick={() => { navigate(path); setSettingsOpen(false); }}
                                style={{
                                    display: "flex", alignItems: "center", gap: 10,
                                    padding: "9px 12px", borderRadius: 10, fontSize: 13,
                                    fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                                    background: "transparent", color: t.muted,
                                    border: "1px solid transparent",
                                    cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.13s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                                    e.currentTarget.style.color = t.text;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = t.muted;
                                }}
                            >
                                <Icon size={13} />
                                {name}
                            </button>
                        ))}

                        {/* Separator */}
                        <div style={{ height: 1, background: t.border, margin: "5px 6px" }} />

                        {/* Logout */}
                        <button
                            onClick={() => { setSettingsOpen(false); onLogout(); }}
                            style={{
                                display: "flex", alignItems: "center", gap: 10, width: "100%",
                                padding: "9px 12px", borderRadius: 10, fontSize: 13,
                                fontFamily: "'DM Sans', sans-serif",
                                background: "transparent", color: t.muted,
                                border: "1px solid transparent", cursor: "pointer", transition: "all 0.13s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = t.pink;
                                e.currentTarget.style.background = "rgba(249,168,212,0.07)";
                                e.currentTarget.style.borderColor = "rgba(249,168,212,0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = t.muted;
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.borderColor = "transparent";
                            }}
                        >
                            <LogOut size={13} /> Logout
                        </button>
                    </div>
                )}

                {/* Settings trigger button */}
                <button
                    onClick={() => setSettingsOpen((prev) => !prev)}
                    style={{
                        display: "flex", alignItems: "center", gap: 10, width: "100%",
                        padding: "10px 13px", borderRadius: 12, fontSize: 13,
                        fontFamily: "'DM Sans', sans-serif",
                        background: settingsOpen ? "rgba(232,255,71,0.06)" : "transparent",
                        color: settingsOpen ? t.lime : t.muted,
                        border: settingsOpen ? "1px solid rgba(232,255,71,0.15)" : "1px solid transparent",
                        cursor: "pointer", transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                        if (!settingsOpen) {
                            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                            e.currentTarget.style.color = t.text;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!settingsOpen) {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = t.muted;
                        }
                    }}
                >
                    <Settings size={14} />
                    Settings
                    <ChevronUp
                        size={12}
                        style={{
                            marginLeft: "auto",
                            transition: "transform 0.2s",
                            transform: settingsOpen ? "rotate(0deg)" : "rotate(180deg)",
                            opacity: 0.5,
                        }}
                    />
                </button>
            </div>
        </aside>
    );
}