import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import SkillMatcher from "./SkillMatcher";

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

const t = {
    bg: "#0a0a0e",
    text: "#f0ede8",
};

export default function SkillMatcherPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleClick = (path) => {
        if (!path) return;
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
                <Topbar user={user} />
                <main style={{ marginLeft: 256, paddingTop: 68, flex: 1, minHeight: "100vh", position: "relative", zIndex: 10, overflowY: "auto" }}>
                    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "26px 28px" }}>
                        <SkillMatcher />
                    </div>
                </main>
            </div>
        </>
    );
}