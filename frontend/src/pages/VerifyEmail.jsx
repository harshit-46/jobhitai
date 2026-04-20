import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function VerifyEmail() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState("loading"); // loading | success | error

    useEffect(() => {
        const verify = async () => {
            try {
                const token = params.get("token");

                if (!token) {
                    setStatus("error");
                    return;
                }

                await api.get(`/api/verify-email?token=${token}`);

                setStatus("success");

                setTimeout(() => {
                    navigate("/login");
                }, 2500);

            } catch (err) {
                setStatus("error");
            }
        };

        verify();
    }, []);

    return (
        <div style={{
            minHeight: "100vh",
            background: "#0a0a0e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'DM Sans', sans-serif"
        }}>
            <div style={{
                width: "100%",
                maxWidth: 420,
                padding: "32px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                textAlign: "center"
            }}>

                {/* Logo */}
                <h1 style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "1.8rem",
                    color: "#f0ede8",
                    marginBottom: 20
                }}>
                    Career<span style={{ color: "#E8FF47" }}>Crafter</span>
                </h1>

                {/* Content */}
                {status === "loading" && (
                    <>
                        <div style={{ fontSize: 28 }}>⏳</div>
                        <p style={{ color: "#aaa", marginTop: 12 }}>
                            Verifying your email...
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div style={{ fontSize: 32 }}>✅</div>
                        <h2 style={{ color: "#E8FF47", marginTop: 10 }}>
                            Email Verified!
                        </h2>
                        <p style={{ color: "#aaa", marginTop: 8 }}>
                            Redirecting to login...
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div style={{ fontSize: 32 }}>❌</div>
                        <h2 style={{ color: "#f87171", marginTop: 10 }}>
                            Verification Failed
                        </h2>
                        <p style={{ color: "#aaa", marginTop: 8 }}>
                            Invalid or expired link
                        </p>

                        <button
                            onClick={() => navigate("/login")}
                            style={{
                                marginTop: 20,
                                padding: "10px 16px",
                                borderRadius: 10,
                                background: "#E8FF47",
                                color: "#000",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: 500
                            }}
                        >
                            Go to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}