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

// Register the components in Chart.js
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
  descriptions?: string[]; // Actual question text or subdomain info for tooltips
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
              label: "Current Test",
              data: data.team,
              borderColor: "#1A3652",
              backgroundColor: "rgba(26,54,82,0.1)",
              borderWidth: 3,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: "#1A3652",
              fill: true,
            },
            {
              label: "Previous Test",
              data: data.manager,
              borderColor: "#4A90E2",
              backgroundColor: "rgba(74,144,226,0.05)",
              borderWidth: 2,
              borderDash: [5, 5],
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: "#4A90E2",
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 0,
              max: 10,
              ticks: {
                stepSize: 2,
                font: { size: 10 }
              },
              grid: {
                color: "rgba(0,0,0,0.05)"
              }
            },
            x: {
              ticks: {
                font: { size: 10, weight: 'bold' }
              },
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false
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
                label: (context) => {
                  return `${context.dataset.label}: ${context.parsed.y}/10`;
                }
              }
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
  }, [data]);

  return <canvas ref={canvasRef} />;
};

export default MultiLineChart;
