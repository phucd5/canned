import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../scripts/database";

const RegisterPage = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		userName: "",
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const initializeUserImageIds = async (uid) => {
		const userRef = doc(db, "users", uid);
		try {
			await setDoc(userRef, { imageIds: [] }, { merge: true });
			console.log("User's imageIds array initialized.");
		} catch (error) {
			console.error("Error initializing imageIds array: ", error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const auth = getAuth();
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				formData.email,
				formData.password
			);
			console.log(
				"Registration successful, user is logged in:",
				userCredential.user
			);
			await initializeUserImageIds(userCredential.user.uid);
			navigate("/login");
		} catch (error) {
			alert(`Registration error: ${error.message}`);
			console.error("Registration error", error);
		}
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
