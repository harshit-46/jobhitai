import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/me");
                setUser(res.data);
            } catch (err) {
                if (err.response?.status !== 401) {
                    console.error(err);
                }
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const signup = async (userData) => {
        await api.post("/signup", userData);
        await new Promise(res => setTimeout(res, 100));

        const res = await api.get("/me");
        setUser(res.data);
    };

    const login = async (userData) => {
        await api.post("/login", userData);
        await new Promise(res => setTimeout(res, 100));

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

export const useAuth = () => useContext(AuthContext);