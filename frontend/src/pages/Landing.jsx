import { Link } from "react-router-dom";

export default function Landing() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col">

            {/* Navbar */}
            <nav className="flex justify-between items-center p-6">
                <h1 className="text-2xl font-bold text-blue-500">AI Career Assistant</h1>
                <div className="space-x-4">
                    <Link to="/login" className="hover:text-blue-400">Login</Link>
                    <Link to="/signup" className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">
                        Signup
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="flex flex-1 flex-col justify-center items-center text-center px-6">
                <h2 className="text-5xl font-bold mb-4">
                    Build Your Career with AI 🚀
                </h2>
                <p className="text-gray-400 max-w-xl mb-6">
                    Create resumes, find jobs, and get AI-powered career guidance — all in one place.
                </p>

                <Link
                    to="/signup"
                    className="bg-blue-500 px-6 py-3 rounded-xl text-lg hover:bg-blue-600"
                >
                    Get Started
                </Link>
            </div>

        </div>
    );
}