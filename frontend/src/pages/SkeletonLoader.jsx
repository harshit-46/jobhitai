import SidebarSkeleton from "../components/SidebarSkeleton";
import TopbarSkeleton from "../components/TopbarSkeleton";
import Skeleton from "../components/Skeleton";

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

export default function SkeletonLoader() {
    return (
        <>
            <style>{`
                * { box-sizing: border-box; }
                body { margin: 0; background: #0a0a0e; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(232,255,71,0.18); border-radius: 2px; }
            `}</style>

            <div style={{ fontFamily: "'DM Sans', sans-serif", background: t.bg, color: t.text, minHeight: "100vh", display: "flex" }}>
                <SidebarSkeleton />
                <TopbarSkeleton />

                <main style={{ marginLeft: 256, paddingTop: 68, flex: 1, minHeight: "100vh", position: "relative", zIndex: 10, overflowY: "auto" }}>
                    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "26px 28px" }}>
                        <Skeleton/>
                    </div>
                </main>
            </div>
        </>
    );
}