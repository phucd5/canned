import React, { useState, useRef, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	IconButton,
} from "@mui/material";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, GeoPoint } from "firebase/firestore";
import { db, updateImageList } from "../../scripts/database";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const callOpenAIWithImage = async (path) => {
	try {
		const response = await axios.post(
			"https://api.openai.com/v1/chat/completions",
			{
				model: "gpt-4-1106-vision-preview",
				messages: [
					{
						role: "user",
						content: [
							{
								type: "text",
								text: "Should this be disposed of in a 'Recycle Bin' or a 'Waste Bin'? Please answer with either 'Recycle Bin' or 'Waste Bin' only. Otherwise, answer 'Invalid'.",
							},
							{
								type: "image_url",
								image_url: {
									url: path,
								},
							},
						],
					},
				],
			},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization:
						"Bearer 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",
				},
			}
		);

		console.log(response.data.choices[0].message.content);
		return response.data.choices[0].message.content;
	} catch (error) {
		console.error("Error calling the OpenAI API:", error.message);
	}
};

const Camera = ({ isOpen, onClose, onClassif }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const videoRef = useRef(null);
	const canvasRef = useRef(null);

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setCurrentUser(user);
			} else {
				setCurrentUser(null); // sign out
			}
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (isOpen) {
			startCamera();
		}
		return () => {
			if (videoRef.current && videoRef.current.srcObject) {
				const tracks = videoRef.current.srcObject.getTracks();
				tracks.forEach((track) => track.stop());
			}
		};
	}, [isOpen]);

	const startCamera = () => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices
				.getUserMedia({ video: { facingMode: "environment" } })
				.then((stream) => {
					if (videoRef.current) {
						videoRef.current.srcObject = stream;
					}
				})
				.catch((err) =>
					console.error("Error accessing the camera: ", err)
				);
		}
	};

	const captureAndSubmitImageMock = async () => {
		console.log("Mock async operation started");

		// Simulate an async operation with Promise and setTimeout
		await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 2 seconds

		console.log("Mock async operation completed");

		// Now close the dialog
		onClose();
	};

	const captureAndSubmitImage = async () => {
		const context = canvasRef.current.getContext("2d");
		context.drawImage(
			videoRef.current,
			0,
			0,
			canvasRef.current.width,
			canvasRef.current.height
		);
		const imageDataUrl = canvasRef.current.toDataURL("image/png");

		// Convert captured image to File
		const imageFile = dataURLtoFile(
			imageDataUrl,
			`captured_image_${new Date().getTime()}.png`
		);

		// Upload to Firebase and submit to OpenAI
		await uploadAndClassifyImage(imageFile);
		onClose(); // Close the dialog after capturing and submitting the image
	};

	const dataURLtoFile = (dataurl, filename) => {
		let arr = dataurl.split(","),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, { type: mime });
	};

	const uploadAndClassifyImage = async (imageFile) => {
		const storage = getStorage();
		const storageRef = ref(
			storage,
			`images/${imageFile.name}_${new Date().getTime()}`
		);
		navigator.geolocation.getCurrentPosition(async (position) => {
			const { latitude, longitude } = position.coords;
			try {
				if (currentUser) {
					const snapshot = await uploadBytes(storageRef, imageFile);
					const imageUrl = await getDownloadURL(snapshot.ref);
					const classification = await callOpenAIWithImage(imageUrl);
					console.log("Image URL: ", imageUrl);
					console.log("Classification: ", classification);

					onClassif(classification);

					// Add a document to Firestore
					const docRef = await addDoc(collection(db, "images"), {
						image_url: imageUrl,
						user: currentUser.uid,
						classification: classification,
						coordinate: new GeoPoint(latitude, longitude),
					});

					await updateImageList(currentUser.uid, docRef.id);
					console.log("Document written with ID: ", docRef.id); // Print the document ID
				}
			} catch (error) {
				console.error("Error processing the image: ", error);
			}
		});
	};

	return (
		<Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				Camera
				<IconButton
					aria-label="close"
					onClick={captureAndSubmitImageMock} // This should call the function passed as the onClose prop
					sx={{
						position: "absolute",
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<video
					ref={videoRef}
					autoPlay
					playsInline
					style={{ width: "100%" }}
				></video>
				<canvas ref={canvasRef} style={{ display: "none" }}></canvas>
				<Button
					onClick={captureAndSubmitImage}
					variant="contained"
					color="primary"
				>
					Capture and Submit
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default Camera;

const CloseIcon = ({ style = {}, onClick }) => (
	<svg
		onClick={onClick}
		style={{ cursor: "pointer", ...style }}
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
	>
		<path d="M0 0h24v24H0V0z" fill="none" />
		<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
	</svg>
);
