const BASE_URL = import.meta.env.VITE_API_URL;

// Save resume to backend
export async function saveResume(resumeData) {
    const res = await fetch(`${BASE_URL}/resume/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(resumeData),
    });
    if (!res.ok) throw new Error("Failed to save resume");
    return res.json();
}

// Fetch user's saved resume
export async function fetchResume() {
    const res = await fetch(`${BASE_URL}/resume/me`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch resume");
    return res.json();
}

// Export resume as PDF (returns Blob)
export async function exportResumePDF(resumeData) {
    const res = await fetch(`${BASE_URL}/resume/export-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(resumeData),
    });
    if (!res.ok) throw new Error("PDF export failed");
    return res.blob();
}

// AI: Generate professional summary
export async function generateSummaryWithAI(resumeData) {
    const res = await fetch(`${BASE_URL}/resume/ai/generate-summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(resumeData),
    });
    if (!res.ok) throw new Error("AI summary generation failed");
    const data = await res.json();
    return data.summary;
}

// AI: Enhance a single bullet point
export async function enhanceBulletWithAI(bulletText) {
    const res = await fetch(`${BASE_URL}/resume/ai/enhance-bullet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bullet: bulletText }),
    });
    if (!res.ok) throw new Error("AI bullet enhancement failed");
    const data = await res.json();
    return data.enhanced;
}