import React, { useEffect, useRef, useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { createRoot } from "react-dom/client";

import markerImage from "./recycle_marker.png";

const InfoWindowContent = ({ name }) => (
	<div>
		<h2>{name}</h2>
		<p>You can recycle here!!!!!</p>
	</div>
);

const LocationMap = () => {
	const gMapsApi = "AIzaSyBJnQgOyRfOmaXUJS-uZP7KrcFKdAjZFok";
	const mapRef = useRef(null);
	const [map, setMap] = useState(null);

	var hotspots = [
		{
			locationName: "Silliman College",
			lat: 41.31084987085015,
			long: -72.92489647867404,
			type: "waste",
		},
		{
			locationName: "Starbucks at 5th Street",
			lat: 27.772123,
			long: -82.634123,
			type: "recycle",
		},
		{
			locationName: "Community Park",
			lat: 27.767456,
			long: -82.638345,
			type: "waste",
		},
	];

	var scrapbooks = [];

	useEffect(() => {
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
	}, []);

	const initMap = (lat, lng) => {
		const mapCenter = { lat, lng };
		const map = new window.google.maps.Map(mapRef.current, {
			zoom: 15,
			center: mapCenter,
		});
		setMap(map);
		setMarkers(map);
		setCurrentLocationMarker(map, mapCenter);
	};

	//set list for filters, whether recycle or waste
	const filters = ["recycle", "waste"];

	//variable for scrapbook mode
	var scrapbook = false;

	const setMarkers = (map) => {
		var filteredHotspots = null;

		//determine what to display on the map
		if (scrapbook) {
			//get the list of locations from the database for scrapbook
			filteredHotspots = scrapbooks;
		} else {
			const filteredHotspots = hotspots.filter((spot) =>
				filters.includes(spot.type)
			);
		}

		//create markers for each location
		filteredHotspots.forEach((spot) => {
			const marker = new window.google.maps.Marker({
				position: { lat: spot.lat, lng: spot.long },
				map: map,
				title: spot.locationName,
				icon: {
					url: markerImage, // The URL of the image
					scaledSize: new window.google.maps.Size(50, 50), // Resize the marker to 50x50 pixels
				},
			});

			// Create a div to hold the React component
			const infoWindowContentElement = document.createElement("div");

			// Use createRoot to render the React component inside the div
			const root = createRoot(infoWindowContentElement);
			root.render(<InfoWindowContent name={spot.locationName} />);

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

	return (
		<APIProvider apiKey={gMapsApi}>
			<div ref={mapRef} style={{ width: "100%", height: "1000px" }}></div>
		</APIProvider>
	);
};

export default LocationMap;
