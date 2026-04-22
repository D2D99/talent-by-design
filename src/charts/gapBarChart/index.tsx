import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js"; // Ensure Chart is imported properly
// import { radarLabels, deltaScores } from "../data"; 
// import type { ChartOptions } from "chart.js";

import {
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

// Register necessary components for Chart.js
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
);

interface GapBarChartProps {
  labels: string[];
  deltaScores: number[];
  selectedLabel: string | null;
  managerScores?: number[];
  employeeScores?: number[];
}

const GapBarChart: React.FC<GapBarChartProps> = ({ labels, deltaScores, selectedLabel, managerScores = [], employeeScores = [] }) => {
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Custom plugin to draw value labels on bars
  const barValueLabelPlugin = {
    id: "barValueLabel",
    afterDatasetsDraw(chart: Chart) {
      const ctx = chart.ctx as CanvasRenderingContext2D;
      ctx.save();
      ctx.font = "11px Arial";
      ctx.textBaseline = "middle";

      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);

        meta.data.forEach((element, index) => {
          const bar = element as any;
          const delta = dataset.data[index] as number;
          const mVal = managerScores[index] !== undefined ? (managerScores[index] * 10).toFixed(0) : "N/A";
          const eVal = employeeScores[index] !== undefined ? (employeeScores[index] * 10).toFixed(0) : "N/A";

          // Label: "+2 pts ↑ (Manager: 70 | Employee: 90)"
          const label = `${delta > 0 ? "+" : ""}${delta} pts ${delta > 0 ? "↑" : "↓"} [M:${mVal} | E:${eVal}]`;

          ctx.fillStyle = delta > 0 ? "#2E7D32" : "#C62828"; // Green for positive, red for negative

          // Change alignment to point inwards towards 0 to avoid overlapping Y-axis
          const xOffset = delta > 0 ? -6 : 6;
          ctx.textAlign = delta > 0 ? "right" : "left";

          ctx.fillText(label, bar.x + xOffset, bar.y -18);
        });
      });

      ctx.restore();
    },
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy(); // Destroy previous chart instance if any
    }

    if (canvasRef.current) {
      chartRef.current = new Chart(canvasRef.current, {
        type: "bar", // Define the chart type
        data: {
          labels: labels,
          datasets: [
            {
              label: "Points Difference",
              data: deltaScores,
              backgroundColor: (ctx: any) => {
                const value = ctx.raw as number;
                return value >= 0 ? "#7FBF7F" : "#E57373"; // Green for positive, red for negative
              },
              barThickness: 16,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              ticks: {
                callback: function (value) {
                  const label = this.getLabelForValue(value as number);
                  if (!label) return "";
                  // Get acronym for multiple words
                  const words = (label as string).split(/[\s&/_-]+/);
                  return words
                    .map((w) => w.charAt(0).toUpperCase())
                    .join("");
                },
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
            },
            x: {
              min: -10,
              max: 10,
              grid: {
                color: "#ddd",
              },
              title: {
                display: true,
                text: "Points Difference",
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
              backgroundColor: "#2E3B4E",
              titleColor: "#ffffff",
              bodyColor: "#ffffff",
              padding: 10,
              displayColors: false,
              callbacks: {
                title: (tooltipItems) => {
                  return tooltipItems[0].label; // Full name from data.labels
                },
                label: (tooltipItem) => {
                  const val = tooltipItem.raw as number;
                  return `Gap: ${val > 0 ? "+" : ""}${val} pts`;
                },
              },
            },
          },
        },
        plugins: [barValueLabelPlugin], // Register the custom label plugin
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Clean up chart on component unmount
      }
    };
  }, [labels, deltaScores]); // Re-run when labels or deltaScores change

  // Highlight the selected label in the GapBarChart
  useEffect(() => {
    if (selectedLabel && chartRef.current) {
      const chart = chartRef.current;
      const labelIndex = labels.indexOf(selectedLabel);
      if (labelIndex >= 0) {
        chart.data.datasets[0].backgroundColor = (ctx: any) => {
          const value = ctx.raw as number;
          return value >= 0
            ? "#2E7D32" // Green for positive values
            : "#C62828"; // Red for negative values
        };
        chart.update(); // Update chart with the new highlight
      }
    }
  }, [selectedLabel, labels]);

  return <canvas ref={canvasRef} />;
};

export default GapBarChart;
