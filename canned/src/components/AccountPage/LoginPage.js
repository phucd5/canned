import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import "./LoginPage.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            // If successful, navigate to your desired route
            navigate("/map");
        } catch (error) {
            alert("Password/Email is incorrect or user does not exist.");
            console.error("Login error", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div className="linear-gradient">
            <div className="form-div">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="form-label">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Type something..."
                        />
                    </div>
                    <div>
                        <label className="form-label">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Type something..."
                        />
                    </div>
                    <button className="submit-btn" type="submit">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;