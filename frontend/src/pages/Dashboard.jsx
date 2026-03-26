
/*

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


*/
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Home, FileText, BarChart, Brain, Folder, Settings } from "lucide-react";

export default function Dashboard() {
    const { user , logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const [active, setActive] = useState("Dashboard");

    const menu = [
        { name: "Dashboard", icon: Home },
        { name: "Resume Builder", icon: FileText },
        { name: "Analyzer", icon: BarChart },
        { name: "AI Predictions", icon: Brain },
        { name: "My Resumes", icon: Folder },
        { name: "Settings", icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-slate-900 text-white">
            {/* Sidebar */}
            <div className="w-64 bg-slate-800 p-4 flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-indigo-400">JobHitAI</h1>

                {menu.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.name}
                            onClick={() => setActive(item.name)}
                            className={`flex items-center gap-3 p-3 rounded-xl transition ${active === item.name
                                    ? "bg-indigo-500"
                                    : "hover:bg-slate-700"
                                }`}
                        >
                            <Icon size={18} />
                            {item.name}
                        </button>
                    );
                })}
            </div>

            {/* Main */}
            <div className="flex-1 p-6 overflow-y-auto">
                {/* Navbar */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Dashboard</h2>
                    <div className="flex gap-4 items-center">
                        <input
                            placeholder="Search..."
                            className="px-4 py-2 rounded-lg bg-slate-800"
                        />
                        <div className="w-10 h-10 bg-indigo-500 rounded-full" />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <StatCard title="Resumes" value="12" />
                    <StatCard title="Score" value="82%" />
                    <StatCard title="Category" value="AI Engineer" />
                    <StatCard title="Improvement" value="+15%" />
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-6">
                    <FeatureCard
                        title="Resume Builder"
                        desc="Create AI-powered resumes"
                    />
                    <FeatureCard
                        title="Resume Analyzer"
                        desc="Get ATS score & feedback"
                    />
                    <FeatureCard
                        title="AI Predictor"
                        desc="Predict job category"
                    />
                </div>

                {/* Activity */}
                <div className="mt-8 grid grid-cols-2 gap-6">
                    <div className="bg-slate-800 p-4 rounded-2xl">
                        <h3 className="text-lg mb-2">Recent Activity</h3>
                        <ul className="text-sm text-gray-300">
                            <li>Updated Resume</li>
                            <li>Analyzed Resume</li>
                            <li>Generated AI Suggestions</li>
                        </ul>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-2xl">
                        <h3 className="text-lg mb-2">AI Insights</h3>
                        <p className="text-sm text-gray-300">
                            Add more ML projects to improve score.
                        </p>
                    </div>
                </div>
            </div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="bg-slate-800 p-4 rounded-2xl hover:scale-105 transition">
            <h4 className="text-gray-400">{title}</h4>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}

function FeatureCard({ title, desc }) {
    return (
        <div className="bg-slate-800 p-6 rounded-2xl hover:scale-105 transition cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-400">{desc}</p>
            <button className="mt-4 px-4 py-2 bg-indigo-500 rounded-lg">
                Open
            </button>
        </div>
    );
}
