import { useEffect, useState } from "react";
import api from "../api/axios";
import AuthContext from "./AuthContext";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            api.get("/me", {
                withCredentials: true
            })
                .then(res => {
                    setUser(res.data);
                })
                .catch(err => {
                    if (err.response?.status === 401) {
                        setUser(null);
                    } else {
                        console.error(err);
                    }
                })
                .finally(() => setLoading(false));
        };

        fetchUser();
    }, []);

    const signup = async (userData) => {
        await api.post("/signup", userData);
        const res = await api.get("/me");
        setUser(res.data);
    };

    const login = async (userData) => {
        await api.post("/login", userData);
        const res = await api.get("/me");
        setUser(res.data);
    };

    const logout = async () => {
        await api.post("/logout");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};