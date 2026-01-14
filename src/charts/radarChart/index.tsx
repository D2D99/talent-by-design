// RadarChart.tsx
import React, { useEffect } from "react";
import { Chart } from "chart.js";
import {
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";  // Import the necessary components

interface RadarChartProps {
  data: any;
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  useEffect(() => {
    // Register the necessary components
    Chart.register(
      RadarController,
      RadialLinearScale,  // Register the radial linear scale
      PointElement,
      LineElement,
      Tooltip,
      Legend,
      Filler
    );

    const canvas = document.getElementById("radarChart") as HTMLCanvasElement;
    if (!canvas) return;

    new Chart(canvas, {
      type: "radar",
      data: {
        labels: data.labels,  // Use the labels from chartData
        datasets: [
          {
            label: "Manager",
            data: data.manager,  // Manager data from chartData
            backgroundColor: "rgba(74, 144, 226, 0.3)",
            borderColor: "#4A90E2",
            pointBackgroundColor: "#4A90E2",
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
          },
        },
      },
    });
  }, [data]);  // Re-run the effect if `data` changes

  return <canvas id="radarChart" />;
};

export default RadarChart;
