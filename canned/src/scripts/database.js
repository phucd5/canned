import { initializeApp } from "firebase/app";
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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export const userRegister = async (username, email, password) => {
	try {
		const auth = getAuth();
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		console.log("User registered with email:", email);
	} catch (error) {
		console.error("Error registering user: ", error.message);
	}
};

// INSERT API KEY HERE
const firebaseConfig = {};

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
		return locationsList;
	} catch (error) {
		console.error("Error fetching locations:", error);
		return [];
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
		return imageList;
	} catch (error) {
		console.error("Error fetching images:", error);
		return [];
	}
};

export const updateImageList = async (userId, imageRef) => {
	const userDocRef = doc(db, "users", userId);

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
