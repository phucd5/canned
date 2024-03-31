import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.css";

const HomePage = ({ onNavigate }) => {
	const navigate = useNavigate();

	const handleLogin = (e) => {
		e.preventDefault();
		navigate("/login");
	};

	const handleRegister = (e) => {
		e.preventDefault();
		navigate("/register");
	};

	return (
		<div className="linearGradient">
			<h1 className="title-text">Canned</h1>
			<div className="buttons-container">
				<button onClick={handleLogin} className="go-button">
					<span className="sub-text">Login!</span>
				</button>
				<button onClick={handleRegister} className="go-button">
					<span className="sub-text">Register!</span>
				</button>
			</div>
		</div>
	);
};

export default HomePage;
