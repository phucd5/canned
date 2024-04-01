import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage/HomePage";
import LoginPage from "./components/AccountPage/LoginPage";
import RegisterPage from "./components/AccountPage/RegisterPage";
import LocationMap from "./components/Map/Map";
import StatsPage from "./components/StatsPage/StatsPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route
						path="/map"
						element={
							<ProtectedRoute>
								<LocationMap />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/stats"
						element={
							<ProtectedRoute>
								<StatsPage />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
