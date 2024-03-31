// Import the functions you need from the SDKs you need
import React, { useEffect, useRef, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
	getFirestore,
	collection,
	getDocs,
	doc,
	addDoc,
	GeoPoint,
	updateDoc,
	arrayUnion,
	query,
	where,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export const userRegister = async (username, email, password) => {
	try {
		const auth = getAuth();
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		// User is registered. You can now save additional user info to Firestore if needed
		console.log("User registered with email:", email);

		// Optionally, save additional user information to Firestore here
	} catch (error) {
		console.error("Error registering user: ", error.message);
	}
};
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyD0drlHbPvd9AnXWmQIKW47olLgo3V1CQ0",
	authDomain: "yhack2024.firebaseapp.com",
	projectId: "yhack2024",
	storageBucket: "yhack2024.appspot.com",
	messagingSenderId: "710934225305",
	appId: "1:710934225305:web:42f064e9909742114d7308",
	measurementId: "G-2RLRVPFX0C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const uploadGarbageBin = async (garbage_type, lat, long) => {
	navigator.geolocation.getCurrentPosition(async (position) => {
		const { latitude, longitude } = position.coords;
		try {
			await addDoc(collection(db, "locations"), {
				coordinate: new GeoPoint(lat, long),
				garbage_type: garbage_type,
			});
			console.log("Document successfully written!");
		} catch (err) {
			console.error("Error writing document: ", err);
		}
	});
};

export const getAllLocations = async () => {
	const locationsCollectionRef = collection(db, "locations");
	try {
		const snapshot = await getDocs(locationsCollectionRef);
		const locationsList = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		return locationsList; // Returns an array of location objects
	} catch (error) {
		console.error("Error fetching locations:", error);
		return []; // Return an empty array in case of error
	}
};

export const getAllImages = async () => {
	const imagesCollectionRef = collection(db, "images");
	try {
		const snapshot = await getDocs(imagesCollectionRef);
		const imageList = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		return imageList; // Returns an array of location objects
	} catch (error) {
		console.error("Error fetching images:", error);
		return []; // Return an empty array in case of error
	}
};

export const updateImageList = async (userId, imageRef) => {
	// Assuming currentUser.uid contains the user's UID
	const userDocRef = doc(db, "users", userId);

	// Update the user document to append the new image's document ID to the imageIds array
	await updateDoc(userDocRef, {
		imageIds: arrayUnion(imageRef),
	});
};

export const countUserBins = async (userId) => {
	const imagesCollectionRef = collection(db, "images");
	const q = query(imagesCollectionRef, where("user", "==", userId));

	try {
		const querySnapshot = await getDocs(q);
		let recycleBinCount = 0;
		let wasteBinCount = 0;

		querySnapshot.forEach((doc) => {
			const data = doc.data();
			if (data.classification === "Recycle Bin") {
				recycleBinCount += 1;
			} else if (data.classification === "Waste Bin") {
				wasteBinCount += 1;
			}
		});

		return { recycleBinCount, wasteBinCount };
	} catch (error) {
		console.error("Error counting bins: ", error);
		throw new Error("Failed to count bins");
	}
};
