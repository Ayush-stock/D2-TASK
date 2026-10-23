
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "firebase/auth";
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);

    const navigate = useNavigate();

    async function handleLogin(event) {
        event.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            // Sign in with Firebase Authentication
            const result = await signInWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            // Find the user's Firestore profile
            const userRef = doc(db, "users", result.user.uid);
            const userSnap = await getDoc(userRef);

            // Create a profile if one does not exist
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    name: result.user.displayName || "",
                    email: result.user.email,
                    createdAt: serverTimestamp()
                });
            }

            navigate("/");
        } catch (err) {
            console.error("Login/profile error:", err.code, err.message);

            if (
                err.code === "auth/invalid-credential" ||
                err.code === "auth/wrong-password" ||
                err.code === "auth/user-not-found"
            ) {
                setError("Incorrect email or password.");
            } else if (
                err.code === "permission-denied" ||
                err.code === "firestore/permission-denied"
            ) {
                setError(
                    "Login succeeded, but the profile could not be accessed. Check Firestore rules."
                );
            } else {
                setError("Unable to complete login. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleReset() {
        setError("");
        setMessage("");

        const userEmail = email.trim();

        if (!userEmail) {
            setError("Enter your email address first.");
            return;
        }

        setResetLoading(true);

        try {
            await sendPasswordResetEmail(auth, userEmail);
            setMessage(
                "If an account exists for this email, check your inbox for reset instructions."
            );
        } catch (err) {
            console.error("Password reset error:", err.code, err.message);
            setError("Unable to send the reset email. Please try again.");
        } finally {
            setResetLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <h1>Login</h1>
            <p>Welcome back to DEV@Deakin.</p>

            <form onSubmit={handleLogin}>
                <label htmlFor="login-email">Email</label>
                <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                />

                <label htmlFor="login-password">Password</label>
                <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                />

                {error && (
                    <p className="auth-error" role="alert">
                        {error}
                    </p>
                )}

                {message && (
                    <p className="auth-message" role="status">
                        {message}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <button
                    type="button"
                    className="reset-button"
                    onClick={handleReset}
                    disabled={resetLoading}
                >
                    {resetLoading ? "Sending email..." : "Forgot Password?"}
                </button>
            </form>

            <p>
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </main>
    );
}

export default Login;
