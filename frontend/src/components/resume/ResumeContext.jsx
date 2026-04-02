/*

// LWF


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
            const saved = localStorage.getItem("jobhitai_resume_draft");
            return saved ? JSON.parse(saved) : defaultResume;
        } catch {
            return defaultResume;
        }
    });

    const updateSection = useCallback((section, data) => {
        setResume((prev) => {
            const updated = { ...prev, [section]: data };
            localStorage.setItem("jobhitai_resume_draft", JSON.stringify(updated));
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
        localStorage.removeItem("jobhitai_resume_draft");
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
            const saved = localStorage.getItem("jobhitai_resume_draft");
            return saved ? JSON.parse(saved) : defaultResume;
        } catch {
            return defaultResume;
        }
    });

    const updateSection = useCallback((section, data) => {
        setResume((prev) => {
            const updated = { ...prev, [section]: data };
            localStorage.setItem("jobhitai_resume_draft", JSON.stringify(updated));
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
        localStorage.removeItem("jobhitai_resume_draft");
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