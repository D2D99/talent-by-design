import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";

// Register necessary Chart.js components
import {
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components in Chart.js
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

export interface TrendData {
  labels: string[];
  manager: number[];
  team: number[];
}

interface MultiLineChartProps {
  data: TrendData;
}

const MultiLineChart: React.FC<MultiLineChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<"line", number[], string> | null>(null);

  useEffect(() => {
    // Cleanup the previous chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create a new chart
    if (canvasRef.current) {
      chartRef.current = new Chart(canvasRef.current, {
        type: "line",
        data: {
          labels: data.labels,
          datasets: [
            {
              label: "Manager",
              data: data.manager,
              borderColor: "#4A90E2",
              backgroundColor: "rgba(74,144,226,0.15)",
              tension: 0.4,
              pointRadius: 5,
            },
            {
              label: "Team Average",
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
            },
          },
          plugins: {
            legend: {
              display: false
            }
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
  }, [data]); // Re-run effect when `data` changes

  return <canvas ref={canvasRef} />;
};

export default MultiLineChart;
