import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

   const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
        setError("Email and password can't be empty");
        return;
    }

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const text = await response.text();

if (response.ok) {
    const data = JSON.parse(text);

    localStorage.setItem("token", data.token);

    localStorage.setItem(
        "user",
        JSON.stringify({
            name: data.name,
            email: data.email,
            role: data.role
        })
    );

    navigate("/");
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
        errorMessage || "Invalid email or password"
    );
}
    } catch (error) {

        console.error("Login error:", error);

        setError("Invalid email or password");
    }
};

    const handleGoogleLogin = () => {
        window.location.href =
            `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`;
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-header">
                    <div className="login-icon">
                        <i className="bi bi-cart3"></i>
                    </div>

                    <h2>Welcome Back</h2>
                    <p>Sign in to continue to Smart Ikart</p>
                </div>

                {error && (
                    <div className="alert alert-danger login-error">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>

                    <div className="input-group-custom">
                        <label>Email Address</label>

                        <div className="input-wrapper">
                            <i className="bi bi-envelope"></i>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group-custom">
                        <label>Password</label>

                        <div className="input-wrapper">
                            <i className="bi bi-lock"></i>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Sign In
                    </button>

                </form>

                <div className="divider">
                    <span>or continue with</span>
                </div>

                <button
                    type="button"
                    className="google-button"
                    onClick={handleGoogleLogin}
                >
                    <span className="google-icon">G</span>
                    <span>Continue with Google</span>
                </button>

                <div className="register-section">
                    <span>Don't have an account?</span>

                    <Link
                        to="/register"
                        className="register-button"
                    >
                        Create an account
                    </Link>
                </div>

                <Link
                    to="/"
                    className="browse-products-link"
                >
                    <i className="bi bi-shop"></i>
                    <span>Browse products</span>
                </Link>

            </div>
        </div>
    );
}

export default Login;