import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage/HomePage";
import LoginPage from "./components/AccountPage/LoginPage";
import RegisterPage from "./components/AccountPage/RegisterPage";
import LocationMap from "./components/Map/Map";
import ImageUploader from "./components/ImageUploader/ImageUploader";
import StatsPage from "./components/StatsPage/StatsPage";

const gMapsApi = "AIzaSyBJnQgOyRfOmaXUJS-uZP7KrcFKdAjZFok";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/map" element={<LocationMap />} />
					<Route path="/upload" element={<ImageUploader />} />
					<Route path="/stats" element={<StatsPage />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
