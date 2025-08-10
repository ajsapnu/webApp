import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import './EmployeeList.css'; 

export default function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { data } = await API.post("/account/login", form);
            localStorage.setItem("token", data.token);
            navigate("/employees");
        } catch (err) {
            console.log(err);
            setError("Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} noValidate className="login-form">
                <h2 className="login-title">Welcome Back</h2>

                {error && (
                    <div className="login-error" role="alert">
                        {error}
                    </div>
                )}

                <label htmlFor="username" className="login-label">Username</label>
                <input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                    autoComplete="username"
                    className="login-input"
                />

                <label htmlFor="password" className="login-label">Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    autoComplete="current-password"
                    className="login-input"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="login-button"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="login-footer">
                    Don't have an account?{" "}
                    <Link to="/register" className="login-register-link">
                        Register here
                    </Link>
                </p>
            </form>
        </div>
    );
}
