import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material';

const Camera = ({ onCapture, isOpen, onClose }) => {
	const [image, setImage] = useState('');
	const videoRef = useRef(null);
	const canvasRef = useRef(null);

	useEffect(() => {
		if (isOpen) {
			startCamera();
		}
		// Cleanup the stream on component unmount
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

	const captureImage = () => {
		const context = canvasRef.current.getContext('2d');
		context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
		const imageDataUrl = canvasRef.current.toDataURL('image/png');
		onCapture(imageDataUrl); // Pass the image data URL to the parent
		onClose(); // Close the dialog after capturing the image
	};


	return (
		<Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Camera</DialogTitle>
			<DialogContent>
				<video ref={videoRef} autoPlay style={{ width: '100%' }}></video>
				<canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
				<Button onClick={captureImage} variant="contained" color="primary">Capture Image</Button>
			</DialogContent>
		</Dialog>
	);
};

export default Camera;
