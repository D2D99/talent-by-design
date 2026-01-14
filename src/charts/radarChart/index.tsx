import React, { useEffect, useRef } from "react";
import { Chart, RadialLinearScale, CategoryScale, Tooltip, Legend, Filler } from "chart.js";


// Register the necessary components for Chart.js v3+
Chart.register(RadialLinearScale, CategoryScale, Tooltip, Legend, Filler); // Register the Filler plugin

interface RadarChartProps {
  data: any;  // The data passed from ManagerOverview
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);  // Use useRef to reference the canvas

  useEffect(() => {
    if (!canvasRef.current) return;  // If the canvas doesn't exist, do nothing

    new Chart(canvasRef.current, {
      type: "radar",
      data: {
        labels: data.labels,  // Use the labels from chartData
        datasets: [
          {
            label: "Manager",
            data: data.manager,  // Manager data from chartData
            backgroundColor: "rgba(74, 144, 226, 0.8)", // Fully opaque color for fill
            borderColor: "#4A90E2",
            pointBackgroundColor: "#4A90E2",
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            fill: true, // This ensures that the area is filled
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 16,  // Adjust this based on your data range
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
            position: "bottom",
            display: false,
          },
        },
      },
    });
  }, [data]); // Re-run the effect if `data` changes

  return <canvas ref={canvasRef} style={{ width: "100%", height: "400px" }} />;
};

export default RadarChart;
