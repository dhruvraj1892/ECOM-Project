import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (!name.trim() || !email.trim() || !password.trim()) {
            setError("All fields are required");
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim(),
                        password: password
                    })
                }
            );

            const text = await response.text();

            if (response.ok) {
                console.log("Registration successful");
                navigate("/login");
            } else {
                let errorMessage = text;

                try {
                    const errorData = JSON.parse(text);

                    errorMessage =
                        errorData.message ||
                        errorData.error ||
                        text;
                } catch {
                    // Backend returned plain text
                }

                setError(
                    "User already exists"
                );
            }

        } catch (error) {
            console.error("Registration error:", error);
            setError("Unable to connect to server");
        }
    };

    return (
        <div className="register-page">
            <div className="register-wrapper">

                {/* LEFT SIDE */}
                <div className="register-form-section">
                    <div className="register-card">

                        <div className="mobile-register-logo">
                            <div className="register-icon">
                                <i className="bi bi-cart3"></i>
                            </div>
                            <span>SMART-KART</span>
                        </div>

                        <div className="register-heading">
                            <h2>Create your account</h2>
                            <p>
                                Join Smart-Kart and start shopping smarter
                            </p>
                        </div>

                        {error && (
                            <div className="register-error">
                                <i className="bi bi-exclamation-circle-fill"></i>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleRegister}>

                            <div className="register-input-group">
                                <label htmlFor="name">
                                    Full name
                                </label>

                                <div className="register-input-wrapper">
                                    <i className="bi bi-person"></i>

                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="register-input-group">
                                <label htmlFor="register-email">
                                    Email address
                                </label>

                                <div className="register-input-wrapper">
                                    <i className="bi bi-envelope"></i>

                                    <input
                                        id="register-email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="register-input-group">
                                <label htmlFor="register-password">
                                    Password
                                </label>

                                <div className="register-input-wrapper">
                                    <i className="bi bi-lock"></i>

                                    <input
                                        id="register-password"
                                        type="password"
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="register-submit-button"
                            >
                                <span>Create Account</span>
                                <i className="bi bi-arrow-right"></i>
                            </button>

                        </form>

                        <div className="register-divider">
                            <span>Already have an account?</span>
                        </div>

                        <Link
                            to="/login"
                            className="login-link-button"
                        >
                            Sign in to your account
                        </Link>

                        <p className="register-footer">
                            By creating an account, you agree to our
                            terms and privacy policy.
                        </p>

                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="register-brand-section">

                    <div className="register-brand-content">

                        <div className="register-brand-logo">
                            <div className="register-brand-icon">
                                <i className="bi bi-cart3"></i>
                            </div>

                            <span>SMART-KART</span>
                        </div>

                        <h1>
                            Your smarter
                            <br />
                            shopping journey
                            <br />
                            starts here.
                        </h1>

                        <p>
                            Create your account and unlock a smarter,
                            faster and more personalized shopping
                            experience.
                        </p>

                        <div className="register-benefits">

                            <div className="register-benefit">
                                <div className="benefit-icon">
                                    <i className="bi bi-bag-check-fill"></i>
                                </div>

                                <div>
                                    <strong>
                                        Everything in one place
                                    </strong>

                                    <span>
                                        Browse and manage your favorite products
                                    </span>
                                </div>
                            </div>

                            <div className="register-benefit">
                                <div className="benefit-icon">
                                    <i className="bi bi-lightning-fill"></i>
                                </div>

                                <div>
                                    <strong>
                                        Fast checkout
                                    </strong>

                                    <span>
                                        Enjoy a smooth and simple shopping flow
                                    </span>
                                </div>
                            </div>

                            <div className="register-benefit">
                                <div className="benefit-icon">
                                    <i className="bi bi-shield-lock-fill"></i>
                                </div>

                                <div>
                                    <strong>
                                        Secure account
                                    </strong>

                                    <span>
                                        Your account stays protected
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="register-circle register-circle-one"></div>
                    <div className="register-circle register-circle-two"></div>
                    <div className="register-circle register-circle-three"></div>

                </div>

            </div>
        </div>
    );
}

export default Register;