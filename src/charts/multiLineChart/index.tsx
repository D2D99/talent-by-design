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
  Filler,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

export interface TrendData {
  labels: string[];
  manager: number[]; // Previous Test
  team: number[];    // Current Test
  descriptions?: string[];
}

interface MultiLineChartProps {
  data: TrendData;
}

const MultiLineChart: React.FC<MultiLineChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<"line", number[], string> | null>(null);

  useEffect(() => {
    // Destroy previous chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (canvasRef.current) {
      chartRef.current = new Chart(canvasRef.current, {
        type: "line",
        data: {
          labels: data.labels,
          datasets: [
            {
              label: "Current Test",
              data: data.team,
              borderColor: "#1A3652",
              backgroundColor: "transparent",
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 3,
              pointHoverRadius: 6,
              pointBackgroundColor: "#1A3652",
              fill: false,
            },
            {
              label: "Previous Test",
              data: data.manager,
              borderColor: "#4A90E2",
              backgroundColor: "transparent",
              borderWidth: 2,
              borderDash: [5, 5],
              tension: 0.4,
              pointRadius: 3,
              pointHoverRadius: 6,
              pointBackgroundColor: "#4A90E2",
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 10, // slight visual breathing space
            },
          },
          scales: {
            y: {
              min: 0,
              max: 12, // 👈 creates top space
              ticks: {
                stepSize: 2,
                font: { size: 10 },
                callback: (value) => (value === 12 ? "" : value), // 👈 hide top label
              },
              grid: {
                // drawBorder: false,
                color: (ctx) =>
                  ctx.tick.value === 12
                    ? "transparent" // 👈 remove top line
                    : "rgba(0,0,0,0.05)",
              },
            },
            x: {
              ticks: {
                font: { size: 10, weight: "bold" },
              },
              grid: {
                display: false,
                // drawBorder: false,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              titleColor: "#1A3652",
              bodyColor: "#474747",
              borderColor: "#E8E8E8",
              borderWidth: 1,
              padding: 12,
              displayColors: true,
              cornerRadius: 8,
              callbacks: {
                title: (context) => {
                  const index = context[0].dataIndex;
                  return data.descriptions && data.descriptions[index]
                    ? data.descriptions[index]
                    : context[0].label;
                },
                label: (context) =>
                  `${context.dataset.label}: ${context.parsed.y}/10`,
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={canvasRef} />;
};

export default MultiLineChart;