import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./RegisterPage.css";
import { userRegister } from "../../scripts/database";

const RegisterPage = () => {
	const navigate = useNavigate();
	const [isRegistered, setIsRegistered] = useState(false);
	const [user, setUser] = useState(false);
	const [formData, setFormData] = useState({
		userName: "",
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await userRegister(
			formData.userName,
			formData.email,
			formData.password
		);
		// if successful
		navigate("/login");
	};

	return (
		<div className="linear-gradient">
			<div className="form-div">
				<h1 className="form-header">Register</h1>
				<form onSubmit={handleSubmit}>
					<div>
						<label className="form-label">Username:</label>
						<input
							type="text"
							name="userName"
							value={formData.userName}
							onChange={handleChange}
							className="form-input"
							placeholder="Type something..."
						/>
					</div>
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
						Register
					</button>
				</form>
			</div>
		</div>
	);
};

export default RegisterPage;
