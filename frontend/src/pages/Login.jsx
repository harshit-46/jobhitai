import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form); // backend later
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-900 p-8 rounded-xl w-96 space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">Login</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-2 rounded bg-gray-800"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full p-2 rounded bg-gray-800"
                    onChange={handleChange}
                />

                <button className="w-full bg-blue-500 py-2 rounded hover:bg-blue-600">
                    Login
                </button>

                <p className="text-sm text-center">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-blue-400">
                        Signup
                    </Link>
                </p>
            </form>
        </div>
    );
}