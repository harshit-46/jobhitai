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
                <>
                    <p>📄 {filename}</p>

                    <a href={resumeUrl} target="_blank" rel="noreferrer">
                        View Resume
                    </a>

                    <br /><br />

                    <button onClick={handleDelete}>
                        Delete Resume
                    </button>
                </>
            )}
        </div>
    );
};