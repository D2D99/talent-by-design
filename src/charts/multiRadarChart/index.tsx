import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";
// import { radarLabels, managerScores, teamScores, peerScores } from "../data";
import type { RadarData } from "../radarChart";

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

interface MultiRadarChartProps {
  data: RadarData;
  onLabelSelect?: (label: string) => void;
}

const MultiRadarChart: React.FC<MultiRadarChartProps> = ({ data, onLabelSelect }) => {
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
          labels: data.labels,
          datasets: [
            {
              label: "Manager",
              data: data.manager,
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
              data: data.team,
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
              data: data.peer,
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
              display: false
            },
          },
          events: ["click"],
        },
      });

      // Handle click events on the radar chart
      canvasRef.current?.addEventListener("click", (event) => {
        if (chartRef.current && chartRef.current.data && onLabelSelect) {
          const points = chartRef.current.getElementsAtEventForMode(
            event,
            "nearest",
            { intersect: true },
            true
          );

          if (points.length > 0) {
            const label = chartRef.current.data.labels?.[points[0].index];
            if (label && typeof label === 'string') {
              onLabelSelect(label);
            }
          }
        }
      });
    }

    // Cleanup the chart when the component unmounts
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, onLabelSelect]); // Re-run when data or onLabelSelect changes

  return <canvas ref={canvasRef} />;
};

export default MultiRadarChart;
