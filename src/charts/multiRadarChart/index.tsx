import React from "react";
import { Chart, RadialLinearScale, CategoryScale, LineElement, PointElement, Tooltip, Legend, RadarController, Filler } from "chart.js"; // Import necessary chart components
import { radarLabels, managerScores, teamScores, peerScores } from "../data"; // Import your data

// Register required components in Chart.js
Chart.register(
  RadarController,  // Register the radar chart controller
  RadialLinearScale,  // Register the radial linear scale for radar charts
  CategoryScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler // Register the Filler plugin to enable the fill property
);



const MultiRadarChart: React.FC = () => {
  React.useEffect(() => {
    const canvas = document.getElementById("multiRadarChart") as HTMLCanvasElement;
    if (!canvas) return;

    new Chart(canvas, {
      type: "radar",
      data: {
        labels: radarLabels,
        datasets: [
          {
            label: "Manager",
            data: managerScores,
            backgroundColor: "rgba(74, 144, 226, 0.25)", // Light blue
            borderColor: "#4A90E2",
            pointBackgroundColor: "#4A90E2",
            pointRadius: 3,
            fill: true,
          },
          {
            label: "Team",
            data: teamScores,
            backgroundColor: "rgba(46, 204, 113, 0.25)", // Light green
            borderColor: "#2ECC71",
            pointBackgroundColor: "#2ECC71",
            pointRadius: 3,
            fill: true,
          },
          {
            label: "Peer",
            data: peerScores,
            backgroundColor: "rgba(231, 76, 60, 0.3)", // Lighter red (slightly adjusted)
            borderColor: "#E74C3C",
            pointBackgroundColor: "#E74C3C",
            pointRadius: 3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 10,
            ticks: {
              stepSize: 2,
              backdropColor: "transparent",
            },
            pointLabels: {
              padding: 20,
              font: {
                size: 12,
              },
            },
            grid: {
              circular: false,
            },
            angleLines: {
              color: "#CFCFCF",
            },
          },
        },
        plugins: {
          legend: {
            display: false, // Hide the legend
          },
        },
      },
    });
  }, []); // Empty dependency array to only run once

  return <canvas id="multiRadarChart" />;
};

export default MultiRadarChart;
