import React from "react";
import { Chart, LinearScale, CategoryScale, LineController, LineElement, PointElement, Tooltip, Legend } from "chart.js"; // Import necessary chart components
import { TrendData } from "../data"; // Import the type

// Register required components in Chart.js
Chart.register(
  LinearScale,
  CategoryScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

interface MultiLineChartProps {
  data: TrendData;
}

const MultiLineChart: React.FC<MultiLineChartProps> = ({ data }) => {
  React.useEffect(() => {
    const canvas = document.getElementById("lineChart") as HTMLCanvasElement;
    if (!canvas) return;

    new Chart(canvas, {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Previous test",
            data: data.manager,
            borderColor: "#4A90E2",
            backgroundColor: "rgba(74,144,226,0.15)",
            tension: 0.4,
            pointRadius: 5,
          },
          {
            label: "Current test",
            data: data.team,
            borderColor: "#7ED321",
            backgroundColor: "rgba(126,211,33,0.15)",
            tension: 0.4,
            pointRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: 0,
            max: 10,
            type: "linear", // Make sure the scale is set to "linear"
          },
        },
        plugins: {
          legend: {
            display: false, // This will hide the legend
          },
        },
      },
    });
  }, [data]);

  return <canvas id="lineChart" />;
};

export default MultiLineChart;
