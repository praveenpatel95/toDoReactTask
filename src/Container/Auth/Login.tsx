import { Link, useNavigate } from "react-router-dom";
import api from "../../utlis/api";
import { useState } from "react";

// Define types for errors and form data
interface Errors {
    email?: string[];
    password?: string[];
    error?: string;
}

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<Errors>({});
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        // Prepare form-data
        const formData = new URLSearchParams();
        formData.append("email", email);
        formData.append("password", password);

        try {
            const { data } = await api.post("login", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            if (data.success === false) {
                // Handle validation errors
                setErrors(data.data); // Set validation errors
                return;
            }

            if (data.data.token) {
                localStorage.removeItem('tasks');
                localStorage.setItem("token", data.data.token);
                navigate("/todo-list");
            }
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 500) {
                    // Handle 500 error with plain string message
                    setErrors({
                        error: error.response.data.message || error.response.data.data || "Invalid credentials",
                    });
                } else if (error.response.data?.data) {
                    // Handle validation errors
                    setErrors(error.response.data.data);
                }
            } else {
                // Handle network or other errors
                setErrors({
                    error: error.message || "An error occurred during login",
                });
            }
        }
    };

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-4 m-auto">
                    <div className="card">
                        <div className="card-body">
                            <h4>Login</h4>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label>Email ID</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback d-block">
                                            {errors.email.map((err, index) => (
                                                <div key={index}>{err}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback d-block">
                                            {errors.password.map((err, index) => (
                                                <div key={index}>{err}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {errors?.error && (
                                    <h6 className="text-danger">
                                        {errors.error}
                                    </h6>
                                )}
                                <div className="mb-3">
                                    <button type="submit" className="btn btn-success">
                                        Login
                                    </button>
                                </div>
                            </form>
                            <Link to="/register">Create an Account</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}