import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage/HomePage";
import LoginPage from "./components/AccountPage/LoginPage";
import RegisterPage from "./components/AccountPage/RegisterPage";
import Map from "./components/Map/Map";
import ImageUploader from "./components/ImageUploader/ImageUploader";

const gMapsApi = "AIzaSyBJnQgOyRfOmaXUJS-uZP7KrcFKdAjZFok";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/map" element={<Map />} />
					<Route path="/upload" element={<ImageUploader />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
