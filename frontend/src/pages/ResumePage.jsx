import { useEffect, useState } from "react";
import axios from "axios";

export default function ResumePage () {
    const [loading, setLoading] = useState(true);
    const [hasResume, setHasResume] = useState(false);
    const [file, setFile] = useState(null);
    const [resumeUrl, setResumeUrl] = useState(null);
    const [filename, setFilename] = useState("");

    const API = "https://jobhitai-server.onrender.com/api/resume";

    // 🔥 Fetch status
    const fetchStatus = async () => {
        try {
            const res = await axios.get(`${API}/status`, { withCredentials: true });
            setHasResume(res.data.has_resume);
            setResumeUrl(res.data.resume_url);
            setFilename(res.data.resume_filename);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    // 🔥 Upload
    const handleUpload = async () => {
        if (!file) return alert("Select a file");

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            await axios.post(`${API}/upload`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            await fetchStatus();
            alert("Resume uploaded!");
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    // 🔥 Delete
    const handleDelete = async () => {
        if (!window.confirm("Delete resume?")) return;

        try {
            await axios.delete(`${API}/delete`, { withCredentials: true });
            setHasResume(false);
            setResumeUrl(null);
            setFilename("");
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p style={{ color: "#aaa" }}>Loading...</p>;

    return (
        <div style={{ textAlign: "center", padding: 40 }}>
            <h2>My Resume</h2>

            {!hasResume ? (
                <>
                    <p style={{ color: "#aaa" }}>
                        Upload your resume to unlock AI features
                    </p>

                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setFile(e.target.files[0])}
                    />

                    <br /><br />

                    <button onClick={handleUpload}>
                        Upload Resume
                    </button>
                </>
            ) : (
                <div style={{
                    maxWidth: 500,
                    margin: "0 auto",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: 16
                }}>
                
                    {/* 📄 File Name */}
                    <p style={{ marginBottom: 10, fontWeight: 500 }}>
                        📄 {filename}
                    </p>
                
                    {/* 🔥 PDF Preview */}
                    <iframe
                        src={resumeUrl}
                        width="100%"
                        height="300px"
                        style={{
                            borderRadius: 10,
                            border: "1px solid rgba(255,255,255,0.1)",
                            marginBottom: 12
                        }}
                    />
                
                    {/* 🔘 Actions */}
                    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                        
                        <button
                            onClick={() => window.open(resumeUrl, "_blank")}
                            style={{
                                padding: "8px 14px",
                                borderRadius: 8,
                                background: "#E8FF47",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: 600
                            }}
                        >
                            View Full
                        </button>
                
                        <button
                            onClick={handleDelete}
                            style={{
                                padding: "8px 14px",
                                borderRadius: 8,
                                background: "rgba(255,0,0,0.1)",
                                border: "1px solid rgba(255,0,0,0.3)",
                                color: "#ff6b6b",
                                cursor: "pointer"
                            }}
                        >
                            Delete
                        </button>
                
                    </div>
                </div>
            )}
        </div>
    );
};