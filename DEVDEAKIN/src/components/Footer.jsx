
import { useState } from "react";

function Footer() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubscribe(event) {
        event.preventDefault();

        setMessage("");
        setSuccess(false);

        const cleanEmail = email.trim();

        if (cleanEmail === "") {
            setMessage("Please enter your email address.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    email: cleanEmail
                })
            });

            const result = await response.text();

            if (!response.ok) {
                throw new Error(
                    result || "Subscription failed. Please try again."
                );
            }

            setSuccess(true);
            setMessage(result);
            setEmail("");
        } catch (error) {
            setSuccess(false);
            setMessage(
                error.message === "Failed to fetch"
                    ? "Unable to connect to the server. Please try again."
                    : error.message
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <footer id="contact" className="footer">
            <div className="newsletter">
                <h2>SIGN UP FOR OUR DAILY INSIDER</h2>

                <form onSubmit={handleSubscribe}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Subscribing..." : "Subscribe"}
                    </button>
                </form>

                {message && (
                    <p
                        role="status"
                        style={{
                            color: success ? "green" : "red",
                            marginTop: "10px"
                        }}
                    >
                        {message}
                    </p>
                )}
            </div>

            <div className="footer-content">
                <div className="footer-column">
                    <h2>Explore</h2>
                    <a href="/">Home</a>
                    <a href="/#articles">Articles</a>
                    <a href="/#tutorials">Tutorials</a>
                </div>

                <div className="footer-column">
                    <h2>Support</h2>
                    <a href="#">FAQs</a>
                    <a href="#">Help</a>
                    <a href="/#contact">Contact Us</a>
                </div>

                <div className="footer-column">
                    <h2>Stay Connected</h2>
                    <p>Facebook</p>
                    <p>Twitter</p>
                    <p>Instagram</p>
                </div>
            </div>

            <div className="copyright">
                <h3>DEV@Deakin 2026</h3>
                <p>Privacy Policy | Terms | Code of Conduct</p>
            </div>
        </footer>
    );
}

export default Footer;
