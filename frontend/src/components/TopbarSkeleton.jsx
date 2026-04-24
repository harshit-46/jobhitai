const t = {
    bg: "#0a0a0e",
    surface: "rgba(255,255,255,0.03)",
    sidebar: "#08080b",
    text: "#f0ede8",
    muted: "rgba(240,237,232,0.45)",
    faint: "rgba(240,237,232,0.22)",
    border: "rgba(255,255,255,0.07)",
    lime: "#E8FF47",
};

const SHIMMER_STYLE = `
@keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
}
`;

const shimmerBg = {
    background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)",
    backgroundSize: "600px 100%",
    animation: "shimmer 1.6s infinite linear",
};

function Bone({ width = "100%", height = 12, radius = 6, style = {} }) {
    return (
        <div
            style={{
                width,
                height,
                borderRadius: radius,
                flexShrink: 0,
                ...shimmerBg,
                ...style,
            }}
        />
    );
}

export default function TopbarSkeleton() {
    return (
        <>
            <style>{SHIMMER_STYLE}</style>

            <header
                style={{
                    position: "fixed",
                    top: 0,
                    left: 256,
                    right: 0,
                    zIndex: 30,
                    background: "rgba(10,10,14,0.85)",
                    backdropFilter: "blur(16px)",
                    borderBottom: `1px solid ${t.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "13px 30px",
                    fontFamily: "'DM Sans', sans-serif",
                }}
            >
                {/* Greeting skeleton */}
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {/* "Good morning, there 👋" — wider, taller to match h2 */}
                    <Bone width={188} height={17} radius={6} />
                    {/* subtitle line */}
                    <Bone width={248} height={10} radius={5} />
                </div>

                {/* Right controls skeleton */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {/* "+ New Resume" pill */}
                    <Bone
                        width={108}
                        height={32}
                        radius={999}
                        style={{
                            ...shimmerBg,
                            background: "linear-gradient(90deg, rgba(232,255,71,0.10) 25%, rgba(232,255,71,0.20) 50%, rgba(232,255,71,0.10) 75%)",
                            backgroundSize: "600px 100%",
                            boxShadow: "0 4px 18px rgba(232,255,71,0.08), 0 0 0 1px rgba(232,255,71,0.10)",
                        }}
                    />
                </div>
            </header>
        </>
    );
}