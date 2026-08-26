import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function OAuth2Success() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        const name = searchParams.get("name");
        const email = searchParams.get("email");
        const role = searchParams.get("role");

        if (token) {
            localStorage.setItem("token", token);

            localStorage.setItem(
                "user",
                JSON.stringify({
                    name,
                    email,
                    role
                })
            );

            navigate("/");
        } else {
            navigate("/login");
        }
    }, [navigate, searchParams]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <div
                    className="spinner-border text-primary"
                    role="status"
                >
                    <span className="visually-hidden">
                        Logging in...
                    </span>
                </div>

                <p className="mt-3">
                    Completing Google login...
                </p>
            </div>
        </div>
    );
}

export default OAuth2Success;