// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
	getFirestore,
	collection,
	getDocs,
	doc,
	setDoc,
	addDoc,
	GeoPoint,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const analytics = getAnalytics(app);

export const db = getFirestore(app);

export const uploadGarbageBin = async (garbage_type, long, lat) => {
	try {
		await addDoc(collection(db, "locations"), {
			coordinate: new GeoPoint(long, lat),
			garbage_type: garbage_type,
		});
		console.log("Document successfully written!");
	} catch (err) {
		console.error("Error writing document: ", err);
	}
};

export const getImageURL = async (imageURL) => {};
