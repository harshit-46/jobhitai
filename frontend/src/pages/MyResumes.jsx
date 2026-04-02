/*

import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const ResumePage = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 420, gap: 16, textAlign: "center" }}>
            <div style={{ width: 68, height: 68, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, background: "rgba(124,106,247,0.1)", border: "1px solid rgba(124,106,247,0.2)" }}>{"🔧"}</div>
            <div>
                <h3 style={{ ...t.serif, fontSize: "1.7rem", letterSpacing: "-0.025em", marginBottom: 6, color: t.text }}>{name}</h3>
                <p style={{ fontSize: 13, color: t.muted, fontWeight: 300 }}>This section is coming soon. Stay tuned!</p>
            </div>
            <div style={{ padding: "7px 18px", borderRadius: 999, fontSize: 12, background: "rgba(124,106,247,0.1)", border: "1px solid rgba(124,106,247,0.2)", color: t.purpleL }}>Under Construction</div>
        </div>
    )
};

const FontLoader = () => {
    useEffect(() => {
        const link = document.createElement("link");
        link.href =
            "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }, []);
    return null;
};

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

export default function MyResumes() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(path);
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            <FontLoader />
            <style>{`
                * { box-sizing: border-box; }
                body { margin: 0; background: #09090f; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(124,106,247,0.2); border-radius: 2px; }
            `}</style>

            <div style={{ fontFamily: "'DM Sans', sans-serif", background: t.bg, color: t.text, minHeight: "100vh", display: "flex" }}>
                <div style={{ position: "fixed", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,106,247,0.11) 0%,transparent 70%)", top: -140, left: 60, filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
                <div style={{ position: "fixed", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,rgba(63,216,152,0.07) 0%,transparent 70%)", bottom: "4%", right: "6%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />

                <Sidebar user={user} onLogout={handleLogout} onClick={handleClick} />
                <Topbar />

                <main style={{ marginLeft: 256, paddingTop: 68, flex: 1, minHeight: "100vh", position: "relative", zIndex: 10, overflowY: "auto" }}>
                    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "26px 28px" }}>
                        <ResumePage />
                    </div>
                </main>
            </div>
        </>
    );
}

*/





import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

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
    green: "#86efac",
    gold: "#fcd34d",
    pink: "#f9a8d4",
    serif: { fontFamily: "'Fraunces', serif", fontWeight: 800 },
    serifItalic: { fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300 },
};

const ResumePage = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 420, gap: 16, textAlign: "center" }}>
            <div style={{ width: 68, height: 68, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, background: "rgba(232,255,71,0.07)", border: "1px solid rgba(232,255,71,0.18)" }}>
                {"🔧"}
            </div>
            <div>
                <h3 style={{ ...t.serif, fontSize: "1.7rem", letterSpacing: "-0.03em", marginBottom: 6, color: t.text }}>My Resumes</h3>
                <p style={{ fontSize: 13, color: t.muted, fontWeight: 300 }}>This section is coming soon. Stay tuned!</p>
            </div>
            <div style={{ padding: "7px 18px", borderRadius: 999, fontSize: 12, background: "rgba(232,255,71,0.07)", border: "1px solid rgba(232,255,71,0.2)", color: t.lime, fontWeight: 600, letterSpacing: "0.04em" }}>
                Under Construction
            </div>
        </div>
    );
};

const FontLoader = () => {
    useEffect(() => {
        const link = document.createElement("link");
        link.href =
            "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,800;1,9..144,300;1,9..144,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }, []);
    return null;
};

export default function MyResumes() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(path);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            <FontLoader />
            <style>{`
                * { box-sizing: border-box; }
                body { margin: 0; background: #0a0a0e; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(232,255,71,0.18); border-radius: 2px; }
            `}</style>

            <div style={{ fontFamily: "'DM Sans', sans-serif", background: t.bg, color: t.text, minHeight: "100vh", display: "flex" }}>
                <Sidebar user={user} onLogout={handleLogout} onClick={handleClick} />
                <Topbar />
                <main style={{ marginLeft: 256, paddingTop: 68, flex: 1, minHeight: "100vh", position: "relative", zIndex: 10, overflowY: "auto" }}>
                    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "26px 28px" }}>
                        <ResumePage />
                    </div>
                </main>
            </div>
        </>
    );
}