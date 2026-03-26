// src/pages/Dashboard.jsx
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user , logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div>
            <h1>This is the Dashboard 🔥</h1>
            <p>Welcome, {user.name}!</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;