import React, { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

const LogoutButton = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const auth = getAuth();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setIsLoggedIn(!!user);
		});
		return () => unsubscribe();
	}, [auth]);

	const handleLogout = () => {
		signOut(auth)
			.then(() => {
				console.log("User signed out successfully");
			})
			.catch((error) => {
				console.error("Sign out error", error);
			});
	};

	if (!isLoggedIn) {
		return null;
	}

	return <button className="submit-btn" onClick={handleLogout}>
		Logout
		</button>;
};

export default LogoutButton;
