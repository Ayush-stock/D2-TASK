
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    updateProfile
} from "firebase/auth";
import {
    doc,
    setDoc,
    serverTimestamp
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSignup(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        let result = null;

        try {
            // Create the Firebase Authentication account
            result = await createUserWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            // Set the user's display name
            await updateProfile(result.user, {
                displayName: name.trim()
            });

            // Save profile information in Firestore
            await setDoc(doc(db, "users", result.user.uid), {
                name: name.trim(),
                email: email.trim(),
                createdAt: serverTimestamp()
            });

            // Go to the homepage after successful registration
            navigate("/");
        } catch (err) {
            console.error("Signup error:", err.code, err.message);

            if (result) {
                setError(
                    "Your authentication account was created, but profile setup failed. Check the browser console and Firestore rules."
                );
            } else if (err.code === "auth/email-already-in-use") {
                setError("This email is already registered. Please log in.");
            } else if (err.code === "auth/weak-password") {
                setError("Please choose a stronger password.");
            } else if (err.code === "auth/invalid-email") {
                setError("Please enter a valid email address.");
            } else if (err.code === "auth/operation-not-allowed") {
                setError("Email and password sign-up is not enabled in Firebase.");
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <h1>Create an Account</h1>
            <p>Join the DEV@Deakin community.</p>

            <form onSubmit={handleSignup}>
                <label htmlFor="signup-name">Full Name</label>
                <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    required
                />

                <label htmlFor="signup-email">Email</label>
                <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                />

                <label htmlFor="signup-password">Password</label>
                <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    minLength={6}
                    required
                />

                {error && (
                    <p className="auth-error" role="alert">
                        {error}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                </button>
            </form>

            <p>
                Already registered? <Link to="/login">Login</Link>
            </p>
        </main>
    );
}

export default Signup;
