import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import CircularIndeterminate from "./CircularIndeterminate";

export const ProtectedRoute = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const auth = getAuth();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			setLoading(false);
		});

		return () => unsubscribe();
	}, [auth]);

	if (loading) {
		return <CircularIndeterminate></CircularIndeterminate>; // Or some loading indicator
	}

	return user ? children : <Navigate to="/" />;
};
