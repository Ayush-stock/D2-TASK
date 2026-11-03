
import { useState } from "react";
import { useAuth } from "../AuthContext";

function Pricing() {
    const { user, login } = useAuth();

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    function startUpgrade() {
        setMessage("");

        if (!user) {
            setMessage("Please log in to subscribe.");
            return;
        }

        if (user.plan === "Paid") {
            setMessage("You are already subscribed.");
            return;
        }

        setShowPayment(true);
    }

    async function handleUpgrade(event) {
        event.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Please log in to continue.");
            }

            const response = await fetch("/api/upgrade", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Subscription failed.");
            }

            login(token, {
                ...user,
                ...(data.user || {}),
                plan: "Paid"
            });

            setShowPayment(false);
            setMessage("Your subscription is now active.");

            setCardName("");
            setCardNumber("");
            setExpiry("");
            setCvv("");
        } catch (error) {
            setMessage(
                error.message || "Unable to complete subscription."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="pricing-page">
            <h1>Choose Your Plan</h1>

            <p className="pricing-subtitle">
                Find the plan that works for you.
            </p>

            {message && (
                <p className="pricing-message" role="status">
                    {message}
                </p>
            )}

            <div className="pricing-cards">
                <section className="pricing-card">
                    <h2>Free</h2>

                    <h3>
                        ₹0 <small>/ forever</small>
                    </h3>

                    <p>Get started with the essentials.</p>

                    <ul>
                        <li>Access to the home page</li>
                        <li>Browse articles and tutorials</li>
                        <li>Basic account access</li>
                    </ul>

                    <p className="plan-status">
                        {user?.plan === "Free"
                            ? "Your current plan"
                            : user?.plan === "Paid"
                                ? "Free plan"
                                : "Available to everyone"}
                    </p>
                </section>

                <section className="pricing-card">
                    <h2>Paid</h2>

                    <h3>
                        ₹1,500 <small>/ month</small>
                    </h3>

                    <p>Get more from your membership.</p>

                    <ul>
                        <li>All Free plan features</li>
                        <li>Access to premium content</li>
                        <li>Paid membership status</li>
                    </ul>

                    <button
                        type="button"
                        className="pricing-button"
                        onClick={startUpgrade}
                        disabled={loading || user?.plan === "Paid"}
                    >
                        {user?.plan === "Paid"
                            ? "Current Plan"
                            : "Subscribe"}
                    </button>
                </section>
            </div>

            {showPayment && (
                <div
                    className="payment-overlay"
                    onClick={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !loading
                        ) {
                            setShowPayment(false);
                        }
                    }}
                >
                    <form
                        className="payment-modal"
                        onSubmit={handleUpgrade}
                    >
                        <button
                            type="button"
                            className="payment-close"
                            onClick={() => setShowPayment(false)}
                            disabled={loading}
                            aria-label="Close subscription form"
                        >
                            ×
                        </button>

                        <h2>Complete Your Subscription</h2>

                        <p className="payment-price">
                            ₹1,500 <small>/ month</small>
                        </p>

                        <div className="payment-field">
                            <label htmlFor="cardName">
                                Name on card
                            </label>

                            <input
                                id="cardName"
                                type="text"
                                value={cardName}
                                onChange={(event) =>
                                    setCardName(event.target.value)
                                }
                                autoComplete="off"
                                required
                            />
                        </div>

                        <div className="payment-field">
                            <label htmlFor="cardNumber">
                                Card number
                            </label>

                            <input
                                id="cardNumber"
                                type="text"
                                inputMode="numeric"
                                value={cardNumber}
                                onChange={(event) =>
                                    setCardNumber(event.target.value)
                                }
                                placeholder="Card number"
                                autoComplete="off"
                                required
                            />
                        </div>

                        <div className="payment-row">
                            <div className="payment-field">
                                <label htmlFor="expiry">
                                    Expiry date
                                </label>

                                <input
                                    id="expiry"
                                    type="text"
                                    value={expiry}
                                    onChange={(event) =>
                                        setExpiry(event.target.value)
                                    }
                                    placeholder="MM/YY"
                                    autoComplete="off"
                                    required
                                />
                            </div>

                            <div className="payment-field">
                                <label htmlFor="cvv">
                                    Security code
                                </label>

                                <input
                                    id="cvv"
                                    type="password"
                                    inputMode="numeric"
                                    value={cvv}
                                    onChange={(event) =>
                                        setCvv(event.target.value)
                                    }
                                    placeholder="CVV"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="pricing-button"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Subscribe"}
                        </button>

                        <button
                            type="button"
                            className="payment-cancel"
                            onClick={() => setShowPayment(false)}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </main>
    );
}

export default Pricing;
