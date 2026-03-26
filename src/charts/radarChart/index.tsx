import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";
// import { radarLabels, managerScores, teamScores, peerScores } from "../data";

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

export interface RadarData {
  labels: string[];
  manager: number[];
  team: number[];
  peer: number[];
  admin?: number[];
}

interface RadarChartProps {
  data: RadarData;
  selectedLabel: string | null;
  onLabelSelect: (label: string) => void;
  datasetLabels?: [string, string?, string?]; // Optional custom labels
  hiddenIndices?: number[];
}

//selectedLabel,    can use this below if needed 

const RadarChart: React.FC<RadarChartProps> = ({ data, onLabelSelect, datasetLabels, hiddenIndices = [] }) => {
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
          labels: data.labels,
          datasets: [
            {
              label: datasetLabels?.[0] || "Manager",
              data: data.manager,
              backgroundColor: "transparent",
              borderColor: "#4A90E2",
              pointBackgroundColor: "#4A90E2",
              borderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: "origin",
              borderDash: [5, 5],
              hidden: hiddenIndices.includes(0),
            },
            ...(data.team && data.team.length > 0 ? [{
              label: datasetLabels?.[1] || "Team",
              data: data.team,
              backgroundColor: "transparent",
              borderColor: "#2ECC71",
              pointBackgroundColor: "#2ECC71",
              borderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: "origin",
              borderDash: [5, 5],
              hidden: hiddenIndices.includes(1),
            }] : []),
            ...(data.peer && data.peer.length > 0 ? [{
              label: datasetLabels?.[2] || "Peer",
              data: data.peer,
              backgroundColor: "transparent",
              borderColor: "#E74C3C",
              pointBackgroundColor: "#E74C3C",
              borderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: "origin",
              borderDash: [5, 5],
              hidden: hiddenIndices.includes(2),
            }] : []),
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 100,
              right: 100,
              top: 20,
              bottom: 20
            }
          },
          scales: {
            r: {
              suggestedMin: 0,
              suggestedMax: 10,
              ticks: {
                stepSize: 2,
                backdropColor: "transparent",
              },
              pointLabels: {
                padding: 10,
                font: {
                  size: 10,
                  weight: 'bold'
                },
              },
              grid: {
                circular: true, // Enable circular grid
                lineWidth: 1,
                color: "#CFCFCF"
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
  }, [onLabelSelect, data, hiddenIndices]); // Only re-run when `onLabelSelect`, `data` or `hiddenIndices` changes

  return <canvas ref={canvasRef} />;
};

export default RadarChart;
