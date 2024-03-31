// Assuming you've set up Firebase elsewhere and have a function to upload the image URL
// import { uploadImageUrlToFirebase } from './yourFirebaseService';

import React from "react";
import ImageUploading from "react-images-uploading";
import { Box, Button, Paper, Typography } from "@mui/material";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../scripts/database";
import axios from "axios";
import Camera from "../Camera/Camera";

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

function ImageUploader() {
	const [images, setImages] = React.useState([]);
	const maxNumber = 1; // Allow only 1 image
	const [isCameraOpen, setIsCameraOpen] = React.useState(false);

	const handleCapture = (capturedImage) => {
		setImages([{ name: "test", data_url: capturedImage, file: null }]); // Use a custom object structure to fit the expected format
	};

	const onChange = (imageList) => {
		setImages(imageList);
	};

	function dataURLtoFile(dataurl, filename) {
		let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, { type: mime });
	}
	// Define the submit function
	const handleSubmit = async () => {
		if (images.length > 0) {
			// Check if the image is from the camera or an uploaded file
			let imageFile = images[0].file;
			if (!imageFile) { // If it's from the camera capture, convert data_url to a file object
				const filename = `captured_image_${new Date().getTime()}.png`;
				imageFile = dataURLtoFile(images[0].data_url, filename);
			}

			const storage = getStorage();
			const storageRef = ref(storage, `images/${imageFile.name}_${new Date().getTime()}`);

			try {
				// Upload the file to Firebase Storage
				const snapshot = await uploadBytes(storageRef, imageFile);
				// Get the URL to the uploaded file
				const imageUrl = await getDownloadURL(snapshot.ref);
				const classification = await callOpenAIWithImage(imageUrl);
				console.log(imageUrl);

				// Add a document to Firestore
				const docRef = await addDoc(collection(db, "images"), {
					image_url: imageUrl,
					user: "stock",
					classification: classification
				});

				console.log("Document written with ID: ", docRef.id);
				setImages([]); // Clear images after submission
			} catch (error) {
				console.error("Error adding document: ", error);
			}
		}
	};

	return (
		<div>
			<Button variant="contained" onClick={() => setIsCameraOpen(true)}>Start Camera</Button>
			<Camera
				isOpen={isCameraOpen}
				onClose={() => setIsCameraOpen(false)}
				onCapture={handleCapture}
			/>
			<ImageUploading
				multiple={false} // Changed to false to only allow one image
				value={images}
				onChange={onChange}
				maxNumber={maxNumber}
				dataURLKey="data_url"
			>
				{({ imageList, onImageUpload, onImageRemove, dragProps }) => (
					<Box sx={{ p: 2 }}>
						<Button
							variant="contained"
							color="primary"
							onClick={onImageUpload}
							{...dragProps}
							sx={{ mt: 2, mr: 2 }}
						>
							Click or Drop here
						</Button>
						{imageList.map((image, index) => (
							<Paper
								key={index}
								elevation={3}
								sx={{
									p: 1,
									mb: 1,
									mt: 3,
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<img
									src={image["data_url"]}
									alt=""
									width="100"
									style={{ marginRight: "10px" }}
								/>
								<Box>
									<Typography variant="body1">
										Selected Image
									</Typography>
									<Button
										size="small"
										color="error"
										onClick={() => onImageRemove(index)}
									>
										Remove
									</Button>
								</Box>
							</Paper>
						))}
						<Button
							variant="contained"
							color="secondary"
							disabled={images.length === 0} // Disable if no image is selected
							onClick={handleSubmit}
							sx={{ mt: 2 }}
						>
							Submit Image
						</Button>
					</Box>
				)}
			</ImageUploading>
		</div>
	);
}

export default ImageUploader;
