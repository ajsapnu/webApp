import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await API.post("/account/register", form);
            navigate("/login");
        } catch (err) {
            console.error(err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = form.username.trim() !== "" && form.password.trim() !== "";

    return (
        <div className="register-container">
            <form
                onSubmit={handleSubmit}
                noValidate
                className="register-form"
            >
                <h2
                    className="register-title"
                    style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}
                >
                    Create Account
                </h2>

                {error && (
                    <div
                        role="alert"
                        className="register-error"
                        style={{ boxShadow: "inset 0 0 5px #fca5a5" }}
                    >
                        {error}
                    </div>
                )}

                <label htmlFor="username" className="register-label">
                    Username
                </label>
                <input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                    autoComplete="username"
                    className="register-input"
                />

                <label htmlFor="password" className="register-label">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    autoComplete="new-password"
                    minLength={6}
                    title="Password must be at least 6 characters"
                    className="register-input"
                />

                <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className={`register-button ${loading || !isFormValid ? "disabled" : ""}`}
                    style={{ boxShadow: loading || !isFormValid ? "none" : "0 5px 15px rgba(34,197,94,0.5)" }}
                >
                    {loading ? "Registering..." : "Register"}
                </button>

                <p className="register-footer">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="register-login-link"
                    >
                        Login here
                    </Link>
                </p>
            </form>
        </div>
    );
}
