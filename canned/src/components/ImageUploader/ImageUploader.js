import React from "react";
import { Button } from "@mui/material";

import Camera from "../Camera/Camera";

function ImageUploader() {
	const [isCameraOpen, setIsCameraOpen] = React.useState(false);

	return (
		<div>
			<Button variant="contained" onClick={() => setIsCameraOpen(true)}>
				Start Camera
			</Button>
			<Camera
				isOpen={isCameraOpen}
				onClose={() => setIsCameraOpen(false)}
			/>
		</div>
	);
}

export default ImageUploader;
