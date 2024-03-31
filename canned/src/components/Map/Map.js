import React, { useEffect, useRef, useState } from "react";
import { APIProvider, Marker } from "@vis.gl/react-google-maps";

const fetchDatabaseData = () => {
	return Promise.resolve({
		hotspots: [
			{
				locationName: "Central Library",
				lat: "27.771018",
				long: "-82.640291",
			},
			{
				locationName: "Starbucks at 5th Street",
				lat: "27.772123",
				long: "-82.634123",
			},
			{
				locationName: "Community Park",
				lat: "27.767456",
				long: "-82.638345",
			},
		],
	});
};

const Map = () => {
	const gMapsApi = "AIzaSyBJnQgOyRfOmaXUJS-uZP7KrcFKdAjZFok";
	const mapRef = useRef(null);
	const [map, setMap] = useState(null);

	// Initialize the map
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
			zoom: 12,
			center: mapCenter,
		});
		setMap(map);
	};

	// Fetch data and place markers
	useEffect(() => {
		if (map) {
			fetchDatabaseData().then((data) => {
				data.hotspots.forEach((spot) => {
					let icon;
					if (spot.locationName.includes("Library")) {
						icon = "small pins/library_mark.png";
					} else if (spot.locationName.includes("Starbucks")) {
						icon = "small pins/starbucks_mark.png";
					} else {
						icon = "small pins/default_mark.png";
					}

					new window.google.maps.Marker({
						position: new window.google.maps.LatLng(
							parseFloat(spot.lat),
							parseFloat(spot.long)
						),
						icon,
						map,
					});
				});
			});
		}
	}, [map]);

	return (
		<APIProvider apiKey={gMapsApi}>
			<div ref={mapRef} style={{ width: "100%", height: "400px" }}></div>
		</APIProvider>
	);
};

export default Map;
