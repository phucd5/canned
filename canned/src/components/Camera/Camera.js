import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../scripts/database";
import axios from "axios";

// Assuming callOpenAIWithImage remains the same and is imported or defined elsewhere

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
								text: "Should this be disposed of in a 'recycle bin' or a 'waste bin'? Please answer with either 'recycle bin' or 'waste bin' only. Otherwise, answer 'invalid'.",
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
					Authorization: "Bearer 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",
				},
			}
		);

		console.log(response.data.choices[0].message.content);
		return response.data.choices[0].message.content;
	} catch (error) {
		console.error("Error calling the OpenAI API:", error.message);
	}
};

const Camera = ({ isOpen, onClose }) => {
	const videoRef = useRef(null);
	const canvasRef = useRef(null);

	useEffect(() => {
		if (isOpen) {
			startCamera();
		}
		return () => {
			if (videoRef.current && videoRef.current.srcObject) {
				const tracks = videoRef.current.srcObject.getTracks();
				tracks.forEach(track => track.stop());
			}
		};
	}, [isOpen]);

	const startCamera = () => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
				.then(stream => {
					if (videoRef.current) {
						videoRef.current.srcObject = stream;
					}
				})
				.catch(err => console.error("Error accessing the camera: ", err));
		}
	};

	const captureAndSubmitImage = async () => {
		const context = canvasRef.current.getContext('2d');
		context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
		const imageDataUrl = canvasRef.current.toDataURL('image/png');

		// Convert captured image to File
		const imageFile = dataURLtoFile(imageDataUrl, `captured_image_${new Date().getTime()}.png`);

		// Upload to Firebase and submit to OpenAI
		await uploadAndClassifyImage(imageFile);
		onClose(); // Close the dialog after capturing and submitting the image
	};

	const dataURLtoFile = (dataurl, filename) => {
		let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, { type: mime });
	};

	const uploadAndClassifyImage = async (imageFile) => {
		const storage = getStorage();
		const storageRef = ref(storage, `images/${imageFile.name}_${new Date().getTime()}`);

		try {
			const snapshot = await uploadBytes(storageRef, imageFile);
			const imageUrl = await getDownloadURL(snapshot.ref);
			const classification = await callOpenAIWithImage(imageUrl);
			console.log("Image URL: ", imageUrl);
			console.log("Classification: ", classification);

			// Add a document to Firestore
			const docRef = await addDoc(collection(db, "images"), {
				image_url: imageUrl,
				user: "stock",
				classification: classification
			});

			console.log("Document written with ID: ", docRef.id); // Print the document ID
		} catch (error) {
			console.error("Error processing the image: ", error);
		}
	};

	return (
		<Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Camera</DialogTitle>
			<DialogContent>
				<video ref={videoRef} autoPlay style={{ width: '100%' }}></video>
				<canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
				<Button onClick={captureAndSubmitImage} variant="contained" color="primary">Capture and Submit</Button>
			</DialogContent>
		</Dialog>
	);
};

export default Camera;
