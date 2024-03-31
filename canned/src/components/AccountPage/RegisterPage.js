import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./RegisterPage.css";

const RegisterPage = () => {
	const [isRegistered, setIsRegistered] = useState(false);
	const [user, setUser] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
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

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	return (
		<div className="linear-gradient">
			<div className="form-div">
				<h1>Register</h1>
				<form onSubmit={handleSubmit}>
					<div>
						<label className="form-label">First Name:</label>
						<input
							type="text"
							name="firstName"
							value={formData.firstName}
							onChange={handleChange}
							className="form-input"
							placeholder="Type something..."
						/>
					</div>
					<div>
						<label className="form-label">Last Name:</label>
						<input
							type="text"
							name="lastName"
							value={formData.lastName}
							onChange={handleChange}
							className="form-input"
							placeholder="Type something..."
						/>
					</div>
					<div>
						<label className="form-label">Username:</label>
						<input
							type="text"
							name="lastName"
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
