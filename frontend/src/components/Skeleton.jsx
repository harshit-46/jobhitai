/**
 * Universal <Skeleton /> component
 *
 * Usage:
 *   <Skeleton />                          → auto-detects layout from current path
 *   <Skeleton layout="dashboard" />       → explicit layout
 *
 * Supported layouts:
 *   dashboard | resume-builder | career-advisor |
 *   skill-matcher | job-category | skill-match-set |
 *   career-guru | profile | myresumes
 */

import { useLocation } from "react-router-dom";

// ─── Design tokens (mirrors app-wide t object) ────────────────────────────────
const t = {
    bg: "#0a0a0e",
    surface: "rgba(255,255,255,0.03)",
    surface2: "rgba(255,255,255,0.055)",
    border: "rgba(255,255,255,0.07)",
    border2: "rgba(255,255,255,0.12)",
    lime: "#E8FF47",
    muted: "rgba(240,237,232,0.45)",
    faint: "rgba(240,237,232,0.22)",
    text: "#f0ede8",
    green: "#86efac",
    gold: "#fcd34d",
    pink: "#f9a8d4",
};

// ─── Shimmer ──────────────────────────────────────────────────────────────────
const SHIMMER_CSS = `
@keyframes _sk_shimmer {
    0%   { background-position: -700px 0; }
    100% { background-position:  700px 0; }
}
`;

const skBase = {
    background: "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%)",
    backgroundSize: "700px 100%",
    animation: "_sk_shimmer 1.6s infinite linear",
};

const skLime = {
    background: "linear-gradient(90deg,rgba(232,255,71,0.07) 25%,rgba(232,255,71,0.16) 50%,rgba(232,255,71,0.07) 75%)",
    backgroundSize: "700px 100%",
    animation: "_sk_shimmer 1.6s infinite linear",
};

const skGreen = {
    background: "linear-gradient(90deg,rgba(134,239,172,0.07) 25%,rgba(134,239,172,0.16) 50%,rgba(134,239,172,0.07) 75%)",
    backgroundSize: "700px 100%",
    animation: "_sk_shimmer 1.6s infinite linear",
};

const skGold = {
    background: "linear-gradient(90deg,rgba(252,211,77,0.07) 25%,rgba(252,211,77,0.16) 50%,rgba(252,211,77,0.07) 75%)",
    backgroundSize: "700px 100%",
    animation: "_sk_shimmer 1.6s infinite linear",
};

// ─── Primitives ───────────────────────────────────────────────────────────────
function Bone({ w = "100%", h = 12, r = 6, tint = "base", style = {} }) {
    const bg = tint === "lime" ? skLime : tint === "green" ? skGreen : tint === "gold" ? skGold : skBase;
    return <div style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...bg, ...style }} />;
}

function Card({ children, style = {} }) {
    return (
        <div style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 18,
            padding: "20px 22px",
            ...style,
        }}>
            {children}
        </div>
    );
}

function Stack({ gap = 10, children, style = {} }) {
    return <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>{children}</div>;
}

function Row({ gap = 12, children, style = {} }) {
    return <div style={{ display: "flex", alignItems: "center", gap, ...style }}>{children}</div>;
}

function Grid({ cols = 3, gap = 16, children, style = {} }) {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap,
            ...style,
        }}>
            {children}
        </div>
    );
}

// ─── Reusable sub-skeletons ───────────────────────────────────────────────────

// Stat card (Dashboard, Career Advisor)
function StatCard({ tint = "base" }) {
    return (
        <Card>
            <Stack gap={14}>
                <Row gap={10}>
                    <Bone w={32} h={32} r={10} tint={tint} />
                    <Bone w="55%" h={11} r={5} />
                </Row>
                <Bone w="40%" h={26} r={7} tint={tint} />
                <Bone w="70%" h={9} r={4} />
            </Stack>
        </Card>
    );
}

// List item row (Skill Matcher, Job Category)
function ListItemBone({ wide = "75%" }) {
    return (
        <Row gap={12} style={{ padding: "12px 0", borderBottom: `1px solid ${t.border}` }}>
            <Bone w={36} h={36} r={10} style={{ flexShrink: 0 }} />
            <Stack gap={8} style={{ flex: 1 }}>
                <Bone w={wide} h={12} r={5} />
                <Bone w="45%" h={9} r={4} />
            </Stack>
            <Bone w={60} h={24} r={999} tint="lime" style={{ flexShrink: 0 }} />
        </Row>
    );
}

// Tag pill cluster
function TagCluster({ count = 5 }) {
    const widths = ["52px", "68px", "44px", "80px", "60px", "72px", "48px"];
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {Array.from({ length: count }).map((_, i) => (
                <Bone key={i} w={widths[i % widths.length]} h={26} r={999} />
            ))}
        </div>
    );
}

// Section header (label + optional action)
function SectionHeader({ actionWidth = 80 }) {
    return (
        <Row style={{ justifyContent: "space-between", marginBottom: 14 }}>
            <Stack gap={6}>
                <Bone w={140} h={15} r={6} />
                <Bone w={200} h={10} r={4} />
            </Stack>
            <Bone w={actionWidth} h={30} r={999} tint="lime" />
        </Row>
    );
}

// Chat bubble
function ChatBubble({ align = "left" }) {
    const isRight = align === "right";
    return (
        <div style={{ display: "flex", justifyContent: isRight ? "flex-end" : "flex-start", marginBottom: 12 }}>
            {!isRight && <Bone w={30} h={30} r="50%" style={{ marginRight: 10, flexShrink: 0 }} />}
            <div style={{
                maxWidth: "62%",
                background: isRight ? "rgba(232,255,71,0.07)" : t.surface,
                border: `1px solid ${isRight ? "rgba(232,255,71,0.14)" : t.border}`,
                borderRadius: isRight ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "12px 14px",
            }}>
                <Stack gap={7}>
                    <Bone w="90%" h={10} r={4} />
                    <Bone w="70%" h={10} r={4} />
                    {!isRight && <Bone w="50%" h={10} r={4} />}
                </Stack>
            </div>
        </div>
    );
}

// Resume preview card
function ResumeCard() {
    return (
        <Card style={{ padding: 0, overflow: "hidden" }}>
            {/* color band top */}
            <Bone w="100%" h={6} r={0} tint="lime" style={{ borderRadius: "18px 18px 0 0" }} />
            <Stack gap={12} style={{ padding: "18px 20px" }}>
                <Bone w="60%" h={14} r={5} />
                <Bone w="40%" h={9} r={4} />
                <div style={{ height: 1, background: t.border }} />
                <Stack gap={7}>
                    <Bone w="85%" h={9} r={4} />
                    <Bone w="70%" h={9} r={4} />
                    <Bone w="75%" h={9} r={4} />
                </Stack>
                <Row gap={8} style={{ marginTop: 4 }}>
                    <Bone w={70} h={26} r={999} tint="lime" />
                    <Bone w={60} h={26} r={999} />
                </Row>
            </Stack>
        </Card>
    );
}

// ─── Layout skeletons ─────────────────────────────────────────────────────────

function DashboardSkeleton() {
    return (
        <Stack gap={28}>
            {/* Stat cards */}
            <Grid cols={3} gap={16}>
                <StatCard tint="lime" />
                <StatCard tint="green" />
                <StatCard tint="gold" />
            </Grid>

            {/* Two-col: activity + sidebar */}
            <Grid cols={3} gap={16}>
                {/* Activity feed */}
                <Card style={{ gridColumn: "span 2" }}>
                    <SectionHeader actionWidth={70} />
                    <Stack gap={0}>
                        {[...Array(5)].map((_, i) => (
                            <ListItemBone key={i} wide={`${60 + (i % 3) * 10}%`} />
                        ))}
                    </Stack>
                </Card>

                {/* Quick info panel */}
                <Stack gap={16}>
                    <Card>
                        <Stack gap={12}>
                            <Bone w="55%" h={13} r={5} />
                            <Bone w={64} h={64} r="50%" style={{ margin: "4px auto" }} tint="lime" />
                            <Bone w="70%" h={9} r={4} style={{ margin: "0 auto" }} />
                            <Bone w="45%" h={9} r={4} style={{ margin: "0 auto" }} />
                        </Stack>
                    </Card>
                    <Card>
                        <Stack gap={10}>
                            <Bone w="60%" h={13} r={5} />
                            {[...Array(3)].map((_, i) => (
                                <Row key={i} gap={10}>
                                    <Bone w={8} h={8} r="50%" tint="lime" />
                                    <Bone w={`${55 + i * 8}%`} h={9} r={4} />
                                </Row>
                            ))}
                        </Stack>
                    </Card>
                </Stack>
            </Grid>
        </Stack>
    );
}

function ResumeBuilderSkeleton() {
    return (
        <Grid cols={2} gap={20} style={{ alignItems: "start" }}>
            {/* Left: form */}
            <Stack gap={20}>
                <Card>
                    <Stack gap={14}>
                        <Bone w="45%" h={15} r={5} />
                        <Stack gap={10}>
                            {[...Array(4)].map((_, i) => (
                                <Stack key={i} gap={6}>
                                    <Bone w={80} h={9} r={4} />
                                    <Bone w="100%" h={36} r={10} />
                                </Stack>
                            ))}
                        </Stack>
                        <Bone w={120} h={34} r={999} tint="lime" />
                    </Stack>
                </Card>
                <Card>
                    <Stack gap={12}>
                        <Bone w="40%" h={13} r={5} />
                        <TagCluster count={6} />
                        <Bone w="100%" h={80} r={10} />
                    </Stack>
                </Card>
            </Stack>

            {/* Right: preview */}
            <Card style={{ minHeight: 520 }}>
                <Stack gap={14}>
                    <Bone w="50%" h={18} r={6} />
                    <Bone w="35%" h={10} r={4} />
                    <div style={{ height: 1, background: t.border }} />
                    <Bone w="30%" h={11} r={5} tint="lime" />
                    {[...Array(3)].map((_, i) => (
                        <Stack key={i} gap={6}>
                            <Bone w="60%" h={10} r={4} />
                            <Bone w="85%" h={8} r={4} />
                            <Bone w="75%" h={8} r={4} />
                        </Stack>
                    ))}
                    <div style={{ height: 1, background: t.border }} />
                    <Bone w="30%" h={11} r={5} tint="lime" />
                    <TagCluster count={5} />
                </Stack>
            </Card>
        </Grid>
    );
}

function CareerAdvisorSkeleton() {
    return (
        <Stack gap={24}>
            <Grid cols={4} gap={14}>
                {["lime", "green", "gold", "base"].map((tint, i) => (
                    <StatCard key={i} tint={tint} />
                ))}
            </Grid>

            <Grid cols={3} gap={16}>
                {/* Career path chart placeholder */}
                <Card style={{ gridColumn: "span 2", minHeight: 240 }}>
                    <SectionHeader actionWidth={90} />
                    {/* Fake chart bars */}
                    <Row gap={10} style={{ alignItems: "flex-end", height: 160, padding: "0 8px" }}>
                        {[70, 45, 85, 55, 90, 60, 75].map((pct, i) => (
                            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                <Bone
                                    w="100%"
                                    h={`${pct}%`}
                                    r={6}
                                    tint={i === 4 ? "lime" : "base"}
                                    style={{ height: `${pct * 1.4}px` }}
                                />
                                <Bone w="60%" h={7} r={3} />
                            </div>
                        ))}
                    </Row>
                </Card>

                {/* Recommendations */}
                <Card>
                    <Stack gap={12}>
                        <Bone w="65%" h={13} r={5} />
                        {[...Array(4)].map((_, i) => (
                            <Row key={i} gap={10} style={{ padding: "8px 0", borderBottom: `1px solid ${t.border}` }}>
                                <Bone w={28} h={28} r={8} tint={i === 0 ? "lime" : "base"} />
                                <Stack gap={6} style={{ flex: 1 }}>
                                    <Bone w="80%" h={10} r={4} />
                                    <Bone w="55%" h={8} r={4} />
                                </Stack>
                            </Row>
                        ))}
                    </Stack>
                </Card>
            </Grid>
        </Stack>
    );
}

function SkillMatcherSkeleton() {
    return (
        <Stack gap={24}>
            {/* Search bar */}
            <Card style={{ padding: "14px 18px" }}>
                <Row gap={12}>
                    <Bone w={18} h={18} r={4} style={{ flexShrink: 0 }} />
                    <Bone w="100%" h={13} r={5} />
                    <Bone w={80} h={30} r={999} tint="lime" style={{ flexShrink: 0 }} />
                </Row>
            </Card>

            <Grid cols={2} gap={16}>
                {/* Your skills */}
                <Card>
                    <Stack gap={14}>
                        <Bone w="45%" h={13} r={5} />
                        <TagCluster count={7} />
                        <div style={{ height: 1, background: t.border }} />
                        <Bone w="55%" h={11} r={5} tint="lime" />
                        <TagCluster count={4} />
                    </Stack>
                </Card>

                {/* Match list */}
                <Card>
                    <Stack gap={0}>
                        <Bone w="50%" h={13} r={5} style={{ marginBottom: 14 }} />
                        {[...Array(5)].map((_, i) => (
                            <ListItemBone key={i} wide={`${60 + (i % 3) * 10}%`} />
                        ))}
                    </Stack>
                </Card>
            </Grid>
        </Stack>
    );
}

function JobCategorySkeleton() {
    return (
        <Stack gap={24}>
            <SectionHeader actionWidth={100} />

            {/* Category grid */}
            <Grid cols={3} gap={14}>
                {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                        <Stack gap={12}>
                            <Row gap={10}>
                                <Bone w={40} h={40} r={12} tint={i % 3 === 0 ? "lime" : i % 3 === 1 ? "green" : "gold"} />
                                <Stack gap={6} style={{ flex: 1 }}>
                                    <Bone w="70%" h={12} r={5} />
                                    <Bone w="45%" h={9} r={4} />
                                </Stack>
                            </Row>
                            <Bone w="100%" h={8} r={4} />
                            <Bone w="80%" h={8} r={4} />
                            <Row gap={8} style={{ marginTop: 4 }}>
                                <Bone w={50} h={22} r={999} />
                                <Bone w={50} h={22} r={999} />
                                <Bone w={50} h={22} r={999} />
                            </Row>
                        </Stack>
                    </Card>
                ))}
            </Grid>
        </Stack>
    );
}

function SkillMatchSetSkeleton() {
    return (
        <Grid cols={3} gap={16} style={{ alignItems: "start" }}>
            {/* Left: skill sets list */}
            <Stack gap={14}>
                <Card>
                    <Stack gap={10}>
                        <Bone w="60%" h={13} r={5} />
                        {[...Array(5)].map((_, i) => (
                            <Row key={i} gap={10} style={{
                                padding: "10px 12px", borderRadius: 10,
                                background: i === 0 ? "rgba(232,255,71,0.06)" : "transparent",
                                border: `1px solid ${i === 0 ? "rgba(232,255,71,0.15)" : "transparent"}`,
                            }}>
                                <Bone w={8} h={8} r="50%" tint={i === 0 ? "lime" : "base"} />
                                <Bone w={`${50 + i * 6}%`} h={10} r={4} />
                            </Row>
                        ))}
                    </Stack>
                </Card>
            </Stack>

            {/* Right: detail panel */}
            <Card style={{ gridColumn: "span 2" }}>
                <Stack gap={18}>
                    <Row gap={12}>
                        <Bone w={48} h={48} r={14} tint="lime" />
                        <Stack gap={8} style={{ flex: 1 }}>
                            <Bone w="50%" h={15} r={6} />
                            <Bone w="35%" h={10} r={4} />
                        </Stack>
                        <Bone w={90} h={32} r={999} tint="lime" />
                    </Row>
                    <div style={{ height: 1, background: t.border }} />
                    <Bone w="30%" h={12} r={5} />
                    <TagCluster count={8} />
                    <Bone w="30%" h={12} r={5} />
                    <Stack gap={8}>
                        {[...Array(4)].map((_, i) => (
                            <Stack key={i} gap={4}>
                                <Row style={{ justifyContent: "space-between" }}>
                                    <Bone w="30%" h={9} r={4} />
                                    <Bone w={30} h={9} r={4} />
                                </Row>
                                <div style={{ height: 6, background: t.surface2, borderRadius: 999, overflow: "hidden" }}>
                                    <Bone w={`${40 + i * 12}%`} h="100%" r={999} tint="lime" />
                                </div>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </Card>
        </Grid>
    );
}

function CareerGuruSkeleton() {
    return (
        <Stack gap={0} style={{ height: "calc(100vh - 120px)" }}>
            <Card style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", padding: 0, overflow: "hidden" }}>
                {/* Chat header */}
                <Row gap={12} style={{ padding: "16px 20px", borderBottom: `1px solid ${t.border}` }}>
                    <Bone w={36} h={36} r="50%" tint="lime" />
                    <Stack gap={6}>
                        <Bone w={100} h={12} r={5} />
                        <Bone w={70} h={8} r={4} />
                    </Stack>
                </Row>

                {/* Chat messages */}
                <Stack gap={0} style={{ flex: 1, padding: "20px 20px 10px", overflowY: "auto" }}>
                    <ChatBubble align="left" />
                    <ChatBubble align="right" />
                    <ChatBubble align="left" />
                    <ChatBubble align="right" />
                    <ChatBubble align="left" />
                </Stack>

                {/* Input bar */}
                <Row gap={10} style={{ padding: "14px 18px", borderTop: `1px solid ${t.border}` }}>
                    <Bone w="100%" h={42} r={12} />
                    <Bone w={42} h={42} r={12} tint="lime" style={{ flexShrink: 0 }} />
                </Row>
            </Card>
        </Stack>
    );
}

function ProfileSkeleton() {
    return (
        <Stack gap={24}>
            {/* Profile header */}
            <Card>
                <Row gap={20}>
                    <Bone w={80} h={80} r="50%" tint="lime" />
                    <Stack gap={10} style={{ flex: 1 }}>
                        <Bone w="40%" h={18} r={6} />
                        <Bone w="30%" h={11} r={4} />
                        <Row gap={8}>
                            <Bone w={80} h={26} r={999} tint="lime" />
                            <Bone w={80} h={26} r={999} />
                        </Row>
                    </Stack>
                </Row>
            </Card>

            <Grid cols={2} gap={16}>
                {/* Personal info */}
                <Card>
                    <Stack gap={14}>
                        <Bone w="45%" h={13} r={5} />
                        {[...Array(5)].map((_, i) => (
                            <Stack key={i} gap={5}>
                                <Bone w={70} h={8} r={4} />
                                <Bone w="100%" h={34} r={9} />
                            </Stack>
                        ))}
                    </Stack>
                </Card>

                {/* Skills & info */}
                <Stack gap={16}>
                    <Card>
                        <Stack gap={12}>
                            <Bone w="50%" h={13} r={5} />
                            <TagCluster count={6} />
                        </Stack>
                    </Card>
                    <Card>
                        <Stack gap={12}>
                            <Bone w="55%" h={13} r={5} />
                            {[...Array(3)].map((_, i) => (
                                <Row key={i} gap={10}>
                                    <Bone w={10} h={10} r="50%" tint="lime" />
                                    <Bone w={`${50 + i * 10}%`} h={9} r={4} />
                                </Row>
                            ))}
                        </Stack>
                    </Card>
                </Stack>
            </Grid>
        </Stack>
    );
}

function MyResumesSkeleton() {
    return (
        <Stack gap={24}>
            <SectionHeader actionWidth={120} />
            <Grid cols={3} gap={16}>
                {[...Array(6)].map((_, i) => (
                    <ResumeCard key={i} />
                ))}
            </Grid>
        </Stack>
    );
}

// ─── Path → layout map ────────────────────────────────────────────────────────
const PATH_MAP = {
    "/dashboard":       "dashboard",
    "/resume-builder":  "resume-builder",
    "/career-advisor":  "career-advisor",
    "/skill-matcher":   "skill-matcher",
    "/job-category":    "job-category",
    "/skill-match-set": "skill-match-set",
    "/career-guru":     "career-guru",
    "/profile":         "profile",
    "/myresumes":       "myresumes",
};

const LAYOUT_MAP = {
    "dashboard":       DashboardSkeleton,
    "resume-builder":  ResumeBuilderSkeleton,
    "career-advisor":  CareerAdvisorSkeleton,
    "skill-matcher":   SkillMatcherSkeleton,
    "job-category":    JobCategorySkeleton,
    "skill-match-set": SkillMatchSetSkeleton,
    "career-guru":     CareerGuruSkeleton,
    "profile":         ProfileSkeleton,
    "myresumes":       MyResumesSkeleton,
};

// ─── Main export ──────────────────────────────────────────────────────────────
export default function Skeleton({ layout }) {
    const location = useLocation();

    // Resolve layout: prop → path match → fallback
    const resolvedLayout = layout
        ?? PATH_MAP[location?.pathname]
        ?? "dashboard";

    const LayoutSkeleton = LAYOUT_MAP[resolvedLayout] ?? DashboardSkeleton;

    return (
        <>
            <style>{SHIMMER_CSS}</style>
            <LayoutSkeleton />
        </>
    );
}