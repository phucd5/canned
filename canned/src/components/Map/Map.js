import React, { useEffect, useRef, useState } from "react";
import markerImage from "./recycle_marker.png";
import { APIProvider } from "@vis.gl/react-google-maps";
import { createRoot } from "react-dom/client";
import cameraIcon from "./camera_icon.png";
import scrapbookIcon from "./scrapbook_icon.png";
import wasteIcon from "./waste_icon.png";
import recycleIcon from "./recycle_icon.png";
import statsIcon from "./stats_icon.png";
import mapIcon from "./map_icon.png";
import CrowdsourcingButton from "../Crowdsourcing/CrowdsourcingButton";
import { getAllLocations, getAllImages } from "../../scripts/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CircularIndeterminate from "../CircularIndeterminate";
import RecycleMarker from "./recycle_marker.png";
import WasteMarker from "./waste_marker.png";
import { useNavigate } from 'react-router-dom';

import "./Map.css";
import Camera from "../Camera/Camera";

const InfoWindowScrapbookContent = ({ image, classification }) => {
	return (
		<div className="infoWindowContent">
			<h2>Scrapbook Entry</h2>

			<img
				src={image}
				alt="Scrapbook Entry"
				style={{ maxWidth: "100%", height: "auto" }}
			/>
			<p>Classification: {classification}</p>
		</div>
	);
};

const InfoWindowContent = ({ type, longitude, latitude }) => {
	const handleExportToMaps = (service) => {
		// Placeholder coordinates
		const url =
			service === "google"
				? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
				: `http://maps.apple.com/?q=${latitude},${longitude}`;
		window.open(url, "_blank");
	};

	return (
		<div className="infoWindowContent">
			<h2>{type} Bin</h2>

			{type === "Recycle Bin" ? (
				<p>Recycle here!</p>
			) : (
				<p>Throw waste here!</p>
			)}
			<div className="buttonContainer">
				<button onClick={() => handleExportToMaps("google")}>
					Open in Google Maps
				</button>
				<button onClick={() => handleExportToMaps("apple")}>
					Open in Apple Maps
				</button>
			</div>
		</div>
	);
};

const LocationMap = () => {
	const [currentUser, setCurrentUser] = useState(null);
	const gMapsApi = "AIzaSyBJnQgOyRfOmaXUJS-uZP7KrcFKdAjZFok";
	const mapRef = useRef(null);
	const [mapLoaded, setMapLoaded] = useState(false);
	const navigate = useNavigate();

	const [isCameraOpen, setCameraOpen] = useState(false);

	const [buttonState, setButtonState] = useState("Waste Bin");

	const [reRenderCrowdsource, setReRenderCrowdsource] = useState(false);
	const [locations, setLocations] = useState([]);
	const [isScrapBook, setIsScrapBook] = useState(false);

	const [images, setImages] = useState([]);

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
		console.log(buttonState);
	}, [buttonState]);

	const toggleScrapBook = () => {
		setIsScrapBook(!isScrapBook);
	};

	const handleToggleButton = () => {
		setButtonState((prevState) =>
			prevState === "Waste Bin" ? "Recycle Bin" : "Waste Bin"
		);
	};

	const handleSetButtonState = (classification) => {
		if (classification != "Invalid") {
			setButtonState(classification);
		}
	}

	var hotspots = [
		{
			locationName: "Silliman College",
			lat: 41.31084987085015,
			long: -72.92489647867404,
			type: "Waste Bin",
		},
		{
			locationName: "Starbucks at 5th Street",
			lat: 41.310156313455245,
			long: -72.92353293964047,
			type: "Recycle Bin",
		},
		{
			locationName: "Community Park",
			lat: 27.767456,
			long: -82.638345,
			type: "Recycle Bin",
		},
	];

	const handleOpenCamera = () => {
		setCameraOpen(true);
	};

	const handleCloseCamera = () => {
		console.log("CLOSE??");
		setCameraOpen(false);
		console.log(isCameraOpen);
	};

	useEffect(() => {
		const fetchLocationsAndInitMap = async () => {
			try {
				// Fetch locations
				const locationsList = await getAllLocations();
				setLocations(locationsList); // Update state with fetched locations

				// After fetching locations, check if geolocation is available
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
						(position) => {
							const { latitude, longitude } = position.coords;
							// Now with locations fetched, initialize the map
							initMap(latitude, longitude);
						},
						(error) => {
							alert(
								"Please allow us to access your location to use our service!"
							);
						}
					);
				} else {
					alert("Sorry, please use a new device!");
				}
			} catch (error) {
				console.error("Error fetching locations:", error);
			}
		};

		// Call the combined function
		fetchLocationsAndInitMap();
	}, []);

	useEffect(() => {
		const fetchLocations = async () => {
			try {
				const locationsList = await getAllLocations();
				setLocations(locationsList); // Update state with fetched locations
			} catch (error) {
				console.error("Error fetching locations:", error);
			}
		};

		fetchLocations();

		const loadGoogleMapsScript = () => {
			if (window.google && window.google.maps) {
				setMapLoaded(true);
				return; // Script already loaded
			}
			const script = document.createElement("script");
			script.src = `https://maps.googleapis.com/maps/api/js?key=${gMapsApi}`;
			script.async = true;
			script.defer = true;
			document.body.appendChild(script);
			script.onload = () => {
				setMapLoaded(true); // Set the state to true once the script is loaded
			};
		};

		loadGoogleMapsScript();
	}, [reRenderCrowdsource, isScrapBook]);

	useEffect(() => {
		// Only attempt to get the user's location and initialize the map if the Google Maps script has loaded
		if (mapLoaded) {
			const fetchLocations = async () => {
				try {
					const locationsList = await getAllLocations();
					setLocations(locationsList); // Update state with fetched locations
				} catch (error) {
					console.error("Error fetching locations:", error);
				}
			};

			fetchLocations();

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const { latitude, longitude } = position.coords;
						initMap(latitude, longitude);
					},
					(error) => {
						alert(
							"Please allow us to access your location to use our service!"
						);
					}
				);
			} else {
				alert("Sorry, please use a new device!");
			}
		}
	}, [mapLoaded, buttonState, reRenderCrowdsource, isScrapBook]); // Rerun this effect if mapLoaded changes

	const setMarkers = (map, locationList, imageList) => {
		console.log("Rendering markers");
		console.log("Locations 1", locationList);
		//set list for filters, whether recycle or waste

		//variable for scrapbook mod

		var filteredHotspots = null;

		//determine what to display on the map
		if (isScrapBook) {
			console.log("Scrapbook mode");
			//get the list of locations from the database for scrapbook
			filteredHotspots = imageList.filter(
				(image) => image.user == currentUser.uid
			);
			console.log("FILTERED", filteredHotspots);
		} else {
			filteredHotspots = locationList.filter(
				(spot) => spot.garbage_type === buttonState
			);
		}

		filteredHotspots.forEach((spot) => {
			console.log(
				spot.coordinate.latitude,
				spot.coordinate.longitude,
				spot.garbage_type
			);

			const marker = new window.google.maps.Marker({
				position: {
					lat: spot.coordinate.latitude,
					lng: spot.coordinate.longitude,
				},
				map: map,
				icon: {
					url: spot.garbage_type === "Recycle Bin" ? RecycleMarker : WasteMarker, // The URL of the image
					scaledSize: new window.google.maps.Size(50, 50), // Resize the marker to 50x50 pixels
				},
			});

			// Create a div to hold the React component
			const infoWindowContentElement = document.createElement("div");

			// Use createRoot to render the React component inside the div
			const root = createRoot(infoWindowContentElement);

			if (isScrapBook) {
				root.render(
					<InfoWindowScrapbookContent
						classification={spot.classification}
						image={spot.image_url}
					/>
				);
			} else {
				root.render(
					<InfoWindowContent
						type={spot.garbage_type}
						longitude={spot.coordinate.longitude}
						latitude={spot.coordinate.latitude}
					/>
				);
			}

			const infoWindow = new window.google.maps.InfoWindow({
				content: infoWindowContentElement,
			});

			marker.addListener("click", () => {
				infoWindow.open({
					anchor: marker,
					map,
					shouldFocus: false,
				});
			});
		});
	};

	// Function to place a marker at the current location
	const setCurrentLocationMarker = (map, location) => {
		new window.google.maps.Marker({
			position: location,
			map: map,
			title: "Your Location",
			// Optional: Use a custom icon for the current location marker
			icon: {
				path: window.google.maps.SymbolPath.CIRCLE,
				scale: 7,
				fillColor: "#4285F4",
				fillOpacity: 1,
				strokeWeight: 2,
				strokeColor: "white",
			},
		});
	};

	const initMap = async (lat, lng) => {
		const fetchLocations = async () => {
			try {
				const locationList = await getAllLocations();
				setLocations(locationList); // Update state with fetched locations
				const mapCenter = { lat, lng };
				const map = new window.google.maps.Map(mapRef.current, {
					zoom: 15,
					center: mapCenter,
				});

				const fetchImages = async () => {
					try {
						const imageList = await getAllImages();
						setImages(imageList); // Update state with fetched locations
						setMarkers(map, locationList, imageList);
					} catch (error) {
						console.error("Error fetching images:", error);
					}
				};

				await fetchImages();

				setCurrentLocationMarker(map, mapCenter);
			} catch (error) {
				console.error("Error fetching locations:", error);
			}
		};

		await fetchLocations();
	};

	// Define setMarkers and setCurrentLocationMarker functions here...


	return mapLoaded ? (
		<APIProvider apiKey={gMapsApi}>
			<div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
				<div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
				<div
					style={{
						position: "fixed",
						top: "17px",
						right: "0px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: "10px",
						height: "100%",
						width: "100px",
					}}
				>
					<CrowdsourcingButton
						setReRenderCrowdsource={setReRenderCrowdsource}
						reRenderCrowdsource={reRenderCrowdsource}
					/>
					{/* map nav button */}

					{/* Stats nav button */}
					<button
						onClick={() => navigate("/stats")}
						style={{
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
						}}
					>
						<img src={statsIcon} alt="Icon" style={{ width: "50px", height: "50px" }} />
					</button>
				</div>
				<div
					style={{
						position: "fixed",
						bottom: "20px",
						left: "50%",
						transform: "translateX(-50%)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						gap: "20px",
					}}
				>
					{/* Button 1 */}
					<button
						onClick={toggleScrapBook}
						style={{
							borderRadius: "50%",
							width: "70px",
							height: "70px",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							backgroundColor: "#1fa524",
							opacity: "0.90",
							color: "white",
							border: "none",
							cursor: "pointer",
						}}
					>
						<img src={scrapbookIcon} alt="Icon" style={{ width: "50px", height: "50px" }} />
					</button>
					{/* Button 2 */}
					<button
						onClick={handleOpenCamera}
						style={{
							borderRadius: "50%",
							width: "90px",
							height: "90px",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							backgroundColor: "#1fa524",
							opacity: "0.90",
							color: "white",
							border: "none",
							cursor: "pointer",
						}}
					>
						<img src={cameraIcon} alt="Icon" style={{ width: "66px", height: "66px" }} />
						<Camera isOpen={isCameraOpen} onClose={handleCloseCamera} onClassif={handleSetButtonState} />
					</button>
					{/* Button 3 */}
					<button
						onClick={handleToggleButton}
						style={{
							borderRadius: "50%",
							width: "70px",
							height: "70px",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							backgroundColor: buttonState === "Waste Bin" ? "#1fa524" : "#c6549e",
							opacity: "0.90",
							color: "white",
							border: "none",
							cursor: "pointer",
						}}
					>
						<img src={buttonState === "Waste Bin" ? wasteIcon : recycleIcon} alt="Icon" style={{ width: "54px", height: "54px" }} />
					</button>

				</div>
				<CrowdsourcingButton
					setReRenderCrowdsource={setReRenderCrowdsource}
					reRenderCrowdsource={reRenderCrowdsource}
				/>

			</div>
		</APIProvider>

	) : (
		<CircularIndeterminate />
	);
};

export default LocationMap;
