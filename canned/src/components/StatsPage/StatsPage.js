import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./StatsPage.css"; // Ensure this path matches the location of your CSS file
import Camera from "../Camera/Camera";

const StatsPage = ({ itemsRecycled = 10, itemsOtherWaste = 5 }) => {
	const totalItems = itemsRecycled + itemsOtherWaste;

	// Assumptions for calculations
	const carbonSavingsPerItem = 0.1; // kg CO2 saved per item
	const energySavingsPerItem = 0.05; // kWh saved per item
	const landfillSpacePerItem = 0.003; // square feet saved per item

	// User's actual stats
	const carbonFootprintReduction = itemsRecycled * carbonSavingsPerItem;
	const energySaved = itemsRecycled * energySavingsPerItem;
	const landfillSpaceSaved = itemsRecycled * landfillSpacePerItem;
	const wasteDiversionRate = (itemsRecycled / totalItems) * 100;

	// Average stats for comparison
	const averageStats = {
		carbonFootprintReduction: 2.5, // kg CO2 saved
		energySaved: 1.25, // kWh saved
		landfillSpaceSaved: 0.75, // sq ft saved
		wasteDiversionRate: 30, // % of waste diverted
	};

	const compareWithAverage = (userStat, average, unit) => {
		const difference = userStat - average;
		const direction = difference >= 0 ? "above" : "below";
		const magnitude = Math.abs(difference).toFixed(2);
		const className = difference >= 0 ? "positive" : "negative";
		return (
			<span className={className}>
				{magnitude} {unit} {direction} average
			</span>
		);
	};

	const data = [
		{ name: "Recycle", value: itemsRecycled, color: "#00C49F" },
		{ name: "Other Waste", value: itemsOtherWaste, color: "#FF8042" },
	];

	const creativeStats = [
		{
			text: "Carbon Footprint Reduction",
			detail: `${carbonFootprintReduction.toFixed(2)} kg CO2`,
			comparison: compareWithAverage(
				carbonFootprintReduction,
				averageStats.carbonFootprintReduction,
				"kg CO2"
			),
		},
		{
			text: "Energy Saved",
			detail: `${energySaved.toFixed(2)} kWh`,
			comparison: compareWithAverage(
				energySaved,
				averageStats.energySaved,
				"kWh"
			),
		},
		{
			text: "Landfill Space Saved",
			detail: `${landfillSpaceSaved.toFixed(2)} sq ft`,
			comparison: compareWithAverage(
				landfillSpaceSaved,
				averageStats.landfillSpaceSaved,
				"sq ft"
			),
		},
		{
			text: "Waste Diversion Rate",
			detail: `${wasteDiversionRate.toFixed(2)}%`,
			comparison: compareWithAverage(
				wasteDiversionRate,
				averageStats.wasteDiversionRate,
				"%"
			),
		},
	];

	return (
		<div className="stats-page">
			<Camera />
			<h1>Environmental Impact</h1>
			<Camera />
			<div className="chart-section">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							dataKey="value"
							data={data}
							cx="50%"
							cy="50%"
							outerRadius="70%"
							label={({ name, percent }) =>
								`${name}: ${(percent * 100).toFixed(0)}%`
							}
						>
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={entry.color}
								/>
							))}
						</Pie>
						<Tooltip />
					</PieChart>
				</ResponsiveContainer>
			</div>
			<div className="creative-stats">
				{creativeStats.map((stat, index) => (
					<div key={index} className="stat-item">
						<h3>{stat.text}</h3>
						<p>{stat.detail}</p>
						<p>{stat.comparison}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default StatsPage;
