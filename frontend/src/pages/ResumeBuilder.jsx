import React from 'react'

const ResumeBuilder = () => {
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
}

export default ResumeBuilder