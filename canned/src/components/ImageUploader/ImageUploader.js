// Assuming you've set up Firebase elsewhere and have a function to upload the image URL
// import { uploadImageUrlToFirebase } from './yourFirebaseService';

import React from "react";
import ImageUploading from "react-images-uploading";
import { Box, Button, Paper, Typography } from "@mui/material";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../scripts/database";

function ImageUploader() {
	const [images, setImages] = React.useState([]);
	const maxNumber = 1; // Allow only 1 image

	const onChange = (imageList) => {
		setImages(imageList);
	};

	// Define the submit function
	const handleSubmit = async () => {
		if (images.length > 0) {
			const imageFile = images[0].file; // Get the image file
			const storage = getStorage();
			const storageRef = ref(
				storage,
				`images/${imageFile.name}_${new Date().getTime()}`
			);

			try {
				// Upload the file to Firebase Storage
				const snapshot = await uploadBytes(storageRef, imageFile);

				// Get the URL to the uploaded file
				const imageUrl = await getDownloadURL(snapshot.ref);

				const docRef = await addDoc(collection(db, "images"), {
					imageUrl,
				});

				console.log("Document written with ID: ", docRef.id);
				setImages([]); // Clear images after submission
			} catch (error) {
				console.error("Error adding document: ", error);
			}
		}
	};

	return (
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
	);
}

export default ImageUploader;
