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

// Shimmer keyframe injected once
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

// Generic skeleton block
function Bone({ width = "100%", height = 12, radius = 6, style = {} }) {
    return (
        <div
            style={{
                width,
                height,
                borderRadius: radius,
                ...shimmerBg,
                ...style,
            }}
        />
    );
}

// One nav-item skeleton row  (icon placeholder + label placeholder)
function NavItemBone({ labelWidth = "65%" }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 13px",
                borderRadius: 12,
                border: "1px solid transparent",
            }}
        >
            {/* icon */}
            <Bone width={14} height={14} radius={4} style={{ flexShrink: 0 }} />
            {/* label */}
            <Bone width={labelWidth} height={11} radius={5} />
        </div>
    );
}

// Label widths mirror the real menu names roughly
const NAV_WIDTHS   = ["62%", "72%", "70%", "62%", "65%", "75%", "62%"];
const MENU_COUNT   = 7; // matches MENU array length

export default function SidebarSkeleton() {
    return (
        <>
            <style>{SHIMMER_STYLE}</style>

            <aside
                style={{
                    width: 256,
                    minWidth: 256,
                    background: t.sidebar,
                    borderRight: `1px solid ${t.border}`,
                    display: "flex",
                    flexDirection: "column",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    zIndex: 40,
                }}
            >
                {/* ── Logo ───────────────────────────────────── */}
                <div
                    style={{
                        padding: "19px 26px",
                        borderBottom: `1px solid ${t.border}`,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                    }}
                >
                    {/* "Career" word */}
                    <Bone width={68} height={18} radius={5} />
                    {/* "Crafter" word — lime accent */}
                    <Bone
                        width={64} height={18} radius={5}
                        style={{
                            ...shimmerBg,
                            background: "linear-gradient(90deg, rgba(232,255,71,0.10) 25%, rgba(232,255,71,0.22) 50%, rgba(232,255,71,0.10) 75%)",
                            backgroundSize: "600px 100%",
                        }}
                    />
                </div>

                {/* ── User pill ──────────────────────────────── */}
                <div
                    style={{
                        margin: "14px 10px 4px",
                        padding: "11px 12px",
                        borderRadius: 16,
                        background: t.surface,
                        border: `1px solid ${t.border}`,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    {/* Avatar circle */}
                    <Bone
                        width={34} height={34} radius="50%"
                        style={{ flexShrink: 0, ...shimmerBg }}
                    />
                    {/* Name */}
                    <Bone width="55%" height={11} radius={5} style={{ flex: 1 }} />
                    {/* Online dot */}
                    <div
                        style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "rgba(232,255,71,0.25)",
                            flexShrink: 0,
                        }}
                    />
                </div>

                {/* ── Nav items ──────────────────────────────── */}
                <nav
                    style={{
                        flex: 1,
                        padding: "8px 8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    {Array.from({ length: MENU_COUNT }).map((_, i) => (
                        <NavItemBone key={i} labelWidth={NAV_WIDTHS[i]} />
                    ))}
                </nav>

                {/* ── Settings button ────────────────────────── */}
                <div
                    style={{
                        padding: "10px 8px",
                        borderTop: `1px solid ${t.border}`,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 13px",
                            borderRadius: 12,
                            border: "1px solid transparent",
                        }}
                    >
                        {/* Settings icon */}
                        <Bone width={14} height={14} radius={4} style={{ flexShrink: 0 }} />
                        {/* "Settings" label */}
                        <Bone width="48%" height={11} radius={5} />
                        {/* ChevronUp placeholder */}
                        <Bone
                            width={12} height={12} radius={3}
                            style={{ marginLeft: "auto", flexShrink: 0 }}
                        />
                    </div>
                </div>
            </aside>
        </>
    );
}