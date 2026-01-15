import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { radarLabels, managerScores, teamScores, peerScores } from "../data";

import {
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register required components for Chart.js
Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

interface RadarChartProps {
  selectedLabel: string | null;
  onLabelSelect: (label: string) => void;
}

//selectedLabel,    can use this below if needed 

const RadarChart: React.FC<RadarChartProps> = ({  onLabelSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<"radar", number[], string> | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy(); // Clean up the previous chart instance
    }

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
              position: "top",
              display: false
            },
          },
          events: ["click"], // Allow clicks on points
        },
      });

      // Handle click events on the radar chart
      canvasRef.current?.addEventListener("click", (event) => {
        if (chartRef.current && chartRef.current.data) {
          const points = chartRef.current.getElementsAtEventForMode(
            event,
            "nearest",
            { intersect: true },
            true
          );

          if (points.length > 0) {
            // Safe access to labels array, now we can access chartRef.current?.data?.labels
            const label = chartRef.current.data.labels?.[points[0].index];
            if (label) {
              onLabelSelect(label); // Update the parent state with selected label
            }
          }
        }
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Clean up the chart instance
      }
    };
  }, [onLabelSelect]); // Only re-run when `onLabelSelect` changes

  return <canvas ref={canvasRef} />;
};

export default RadarChart;
