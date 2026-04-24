/*

# Last working file

import { createContext, useContext, useState, useCallback } from "react";

const ResumeContext = createContext(null);

const defaultResume = {
    template: "modern",
    personal: {
        name: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        portfolio: "",
        summary: "",
    },
    experience: [],
    education: [],
    skills: { technical: [], soft: [] },
    projects: [],
    certifications: [],
};

export function ResumeProvider({ children }) {
    const [resume, setResume] = useState(() => {
        try {
            const saved = localStorage.getItem("careercrafter_resume_draft");
            return saved ? JSON.parse(saved) : defaultResume;
        } catch {
            return defaultResume;
        }
    });

    const updateSection = useCallback((section, data) => {
        setResume((prev) => {
            const updated = { ...prev, [section]: data };
            localStorage.setItem("careercrafter_resume_draft", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const updatePersonal = useCallback((data) => updateSection("personal", data), [updateSection]);
    const updateExperience = useCallback((data) => updateSection("experience", data), [updateSection]);
    const updateEducation = useCallback((data) => updateSection("education", data), [updateSection]);
    const updateSkills = useCallback((data) => updateSection("skills", data), [updateSection]);
    const updateProjects = useCallback((data) => updateSection("projects", data), [updateSection]);
    const updateCertifications = useCallback((data) => updateSection("certifications", data), [updateSection]);
    const setTemplate = useCallback((template) => updateSection("template", template), [updateSection]);

    const clearDraft = useCallback(() => {
        localStorage.removeItem("cc_resume_draft");
        setResume(defaultResume);
    }, []);

    return (
        <ResumeContext.Provider
            value={{
                resume,
                updatePersonal,
                updateExperience,
                updateEducation,
                updateSkills,
                updateProjects,
                updateCertifications,
                setTemplate,
                clearDraft,
            }}
        >
            {children}
        </ResumeContext.Provider>
    );
}

export function useResume() {
    const ctx = useContext(ResumeContext);
    if (!ctx) throw new Error("useResume must be used inside ResumeProvider");
    return ctx;
}

*/






import { createContext, useContext, useState, useCallback, useRef } from "react";
import api from "../../api/axios";

const ResumeContext = createContext(null);

const BUILDER_API = "https://jobhitai-server.onrender.com/api/builder";

const defaultResume = {
    resume_id: null,          // null = unsaved / new
    filename: "My Resume",    // shown in vault card
    template: "modern",
    personal: {
        name: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        portfolio: "",
        summary: "",
    },
    experience: [],
    education: [],
    skills: { technical: [], soft: [] },
    projects: [],
    certifications: [],
};

export function ResumeProvider({ children, initialResumeId = null }) {
    // ── State ─────────────────────────────────────────────────────────────────
    const [resume, setResume] = useState(() => {
        // If we're editing an existing resume (initialResumeId provided),
        // start with defaults — the builder will load from server on mount.
        if (initialResumeId) return { ...defaultResume, resume_id: initialResumeId };

        // Otherwise try localStorage draft
        try {
            const saved = localStorage.getItem("careercrafter_resume_draft");
            return saved ? JSON.parse(saved) : defaultResume;
        } catch {
            return defaultResume;
        }
    });

    const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | error
    const [loadStatus, setLoadStatus] = useState(initialResumeId ? "loading" : "idle");
    const saveTimerRef = useRef(null);

    // ── Internal helpers ──────────────────────────────────────────────────────

    const persistLocally = useCallback((updated) => {
        // Don't clog localStorage with server-backed resumes
        if (!updated.resume_id) {
            localStorage.setItem("careercrafter_resume_draft", JSON.stringify(updated));
        }
    }, []);

    // ── Section updaters ──────────────────────────────────────────────────────

    const updateSection = useCallback((section, data) => {
        setResume((prev) => {
            const updated = { ...prev, [section]: data };
            persistLocally(updated);
            return updated;
        });
    }, [persistLocally]);

    const updatePersonal      = useCallback((d) => updateSection("personal", d),       [updateSection]);
    const updateExperience    = useCallback((d) => updateSection("experience", d),     [updateSection]);
    const updateEducation     = useCallback((d) => updateSection("education", d),      [updateSection]);
    const updateSkills        = useCallback((d) => updateSection("skills", d),         [updateSection]);
    const updateProjects      = useCallback((d) => updateSection("projects", d),       [updateSection]);
    const updateCertifications= useCallback((d) => updateSection("certifications", d), [updateSection]);
    const updateFilename      = useCallback((name) => updateSection("filename", name), [updateSection]);

    const setTemplate = useCallback((template) => updateSection("template", template), [updateSection]);

    // ── Load from server (edit mode) ──────────────────────────────────────────

    const loadFromServer = useCallback(async (resumeId) => {
        setLoadStatus("loading");
        try {
            const res = await api.get(`${BUILDER_API}/${resumeId}`, { withCredentials: true });
            setResume(res.data);
            setLoadStatus("idle");
        } catch (err) {
            console.error("Failed to load resume:", err);
            setLoadStatus("error");
        }
    }, []);

    // ── Save to server ────────────────────────────────────────────────────────

    const saveToServer = useCallback(async (silent = false) => {
        if (!silent) setSaveStatus("saving");
        try {
            const res = await api.post(
                `${BUILDER_API}/save`,
                resume,
                { withCredentials: true }
            );

            const returnedId = res.data.resume_id;

            // Store the resume_id so all future saves are updates, not inserts
            setResume((prev) => {
                const updated = { ...prev, resume_id: returnedId };
                // Clear the localStorage draft now that it's server-backed
                localStorage.removeItem("careercrafter_resume_draft");
                return updated;
            });

            setSaveStatus("saved");

            // Auto-reset "saved" indicator after 2.5s
            clearTimeout(saveTimerRef.current);
            saveTimerRef.current = setTimeout(() => setSaveStatus("idle"), 2500);

            return returnedId;
        } catch (err) {
            console.error("Save failed:", err);
            setSaveStatus("error");
            clearTimeout(saveTimerRef.current);
            saveTimerRef.current = setTimeout(() => setSaveStatus("idle"), 3000);
            return null;
        }
    }, [resume]);

    // ── Auto-save (debounced, 3s after last change) ───────────────────────────
    // Only kicks in once the resume has been saved at least once (has a resume_id)

    const autoSave = useCallback(() => {
        if (!resume.resume_id) return; // don't auto-save unsaved drafts
        clearTimeout(saveTimerRef.current);
        setSaveStatus("saving");
        saveTimerRef.current = setTimeout(() => saveToServer(true), 3000);
    }, [resume.resume_id, saveToServer]);

    // ── Clear / reset ─────────────────────────────────────────────────────────

    const clearDraft = useCallback(() => {
        localStorage.removeItem("careercrafter_resume_draft");
        localStorage.removeItem("cc_resume_draft"); // old key cleanup
        setResume(defaultResume);
        setSaveStatus("idle");
    }, []);

    return (
        <ResumeContext.Provider value={{
            resume,
            saveStatus,
            loadStatus,
            updatePersonal,
            updateExperience,
            updateEducation,
            updateSkills,
            updateProjects,
            updateCertifications,
            updateFilename,
            setTemplate,
            saveToServer,
            loadFromServer,
            autoSave,
            clearDraft,
        }}>
            {children}
        </ResumeContext.Provider>
    );
}

export function useResume() {
    const ctx = useContext(ResumeContext);
    if (!ctx) throw new Error("useResume must be used inside ResumeProvider");
    return ctx;
}