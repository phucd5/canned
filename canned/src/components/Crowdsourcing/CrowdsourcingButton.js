import React from "react";
import { uploadGarbageBin } from "../../scripts/database";
import LogoutButton from "../AccountPage/LogoutButton";
import recycleIcon from "./log_recycle.png";
import wasteIcon from "./log_waste.png";

function CrowdsourcingButton({ setReRenderCrowdsource, reRenderCrowdsource }) {
	const getLocation = async (binType) => {
		// Show confirmation dialog with the binType
		const isConfirmed = window.confirm(
			`Do you want to log your current location as a ${binType}?`
		);

		if (isConfirmed && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const { latitude, longitude } = position.coords;

					// Call uploadGarbageBin with binType along with latitude and longitude
					try {
						await uploadGarbageBin(binType, latitude, longitude);
						alert(`${binType} location logged successfully.`);
						setReRenderCrowdsource(!reRenderCrowdsource);
					} catch (error) {
						console.error(
							"Error uploading location:",
							error.message
						);
						alert(`Error uploading location: ${error.message}`);
					}
				},
				(error) => {
					console.error("Error fetching location:", error.message);
					alert(`Error fetching location: ${error.message}`);
				}
			);
		} else if (!isConfirmed) {
			console.log("Location logging cancelled by user.");
		} else {
			console.error("Geolocation is not supported by your browser.");
			alert("Geolocation is not supported by your browser.");
		}
	};

	const buttonStyle = {
		borderRadius: "50%",
		width: "65px",
		height: "65px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#1fa524",
		opacity: "0.90",
		color: "white",
		border: "none",
		cursor: "pointer",
		margin: "0 10px", // Added to create some spacing between buttons
	};
	
	return (
		<div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: "10px"}}>
		{/* Assuming LogoutButton also needs styling */}
		<button style={buttonStyle} onClick={() => getLocation("Waste Bin")}>
			<img src={wasteIcon} alt="Icon" style={{ width: "50px", height: "50px" }} />
		</button>
		<button style={buttonStyle} onClick={() => getLocation("Recycle Bin")}>
			<img src={recycleIcon} alt="Icon" style={{ width: "50px", height: "50px" }} />
		</button>
		</div>
	);
}

export default CrowdsourcingButton;
