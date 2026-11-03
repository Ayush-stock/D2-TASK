
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const responseText = await response.text();
            let data = {};

            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch {
                throw new Error("Server returned an invalid response.");
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to create your account."
                );
            }

            if (!data.token || !data.user) {
                throw new Error("Registration response is incomplete.");
            }

            login(data.token, data.user);
            navigate("/");

        } catch (err) {
            setError(
                err.message || "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Create Account</h1>

                <p className="auth-subtitle">
                    Join DEV@Deakin and get started.
                </p>

                {error && (
                    <div className="auth-error" role="alert">
                        {error}
                    </div>
                )}

                <div className="auth-field">
                    <label htmlFor="signup-name">Full Name</label>
                    <input
                        id="signup-name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        required
                    />
                </div>

                <div className="auth-field">
                    <label htmlFor="signup-email">Email Address</label>
                    <input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter your email"
                        autoComplete="email"
                        required
                    />
                </div>

                <div className="auth-field">
                    <label htmlFor="signup-password">Password</label>
                    <input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="At least 8 characters"
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />
                </div>

                <button
                    className="auth-submit"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Creating account..." : "Create Account"}
                </button>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>

                <Link to="/" className="auth-home-link">
                    Back to Home
                </Link>
            </form>
        </main>
    );
}

export default Signup;
