import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { radarLabels, managerScores, teamScores, peerScores } from "../data";

// Register necessary Chart.js components
import {
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register the components in Chart.js
Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const MultiRadarChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<"radar", number[], string> | null>(null);

  useEffect(() => {
    // Cleanup the previous chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create a new chart
    if (canvasRef.current) {
      chartRef.current = new Chart(canvasRef.current, {
        type: "radar",
        data: {
          labels: radarLabels,
          datasets: [
            {
              label: "Manager",
              data: managerScores,
              backgroundColor: "rgba(74, 144, 226, 0.3)",
              borderColor: "#4A90E2",
              pointBackgroundColor: "#4A90E2",
              borderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: "origin",
            },
            {
              label: "Team",
              data: teamScores,
              backgroundColor: "rgba(46, 204, 113, 0.3)",
              borderColor: "#2ECC71",
              pointBackgroundColor: "#2ECC71",
              borderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: "origin",
            },
            {
              label: "Peer",
              data: peerScores,
              backgroundColor: "rgba(231, 76, 60, 0.3)",
              borderColor: "#E74C3C",
              pointBackgroundColor: "#E74C3C",
              borderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: "origin",
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
              // position: "top",
              display: false
            },
          },
        },
      });
    }

    // Cleanup the chart when the component unmounts
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []); // Only run on mount and unmount

  return <canvas ref={canvasRef} />;
};

export default MultiRadarChart;
