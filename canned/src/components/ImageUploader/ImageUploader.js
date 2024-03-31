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

function ImageUploader() {
	const [isCameraOpen, setIsCameraOpen] = React.useState(false);
	// manage classification state here.

	return (
		<div>
			<Button variant="contained" onClick={() => setIsCameraOpen(true)}>Start Camera</Button>
			<Camera
				isOpen={isCameraOpen}
				onClose={() => setIsCameraOpen(false)}
			/>
		</div>
	);
}

export default ImageUploader;
