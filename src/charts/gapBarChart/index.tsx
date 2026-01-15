import React, { useEffect, useRef } from "react";
import { Chart} from "chart.js"; // Ensure Chart is imported properly
import { radarLabels, deltaScores } from "../data"; // Assuming data is imported
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
  selectedLabel: string | null;
}

const GapBarChart: React.FC<GapBarChartProps> = ({ selectedLabel }) => {
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Custom plugin to draw value labels on bars
  const barValueLabelPlugin = {
    id: "barValueLabel",
    afterDatasetsDraw(chart: Chart) {
      const ctx = chart.ctx as CanvasRenderingContext2D;
      ctx.save();
      ctx.font = "12px Arial";
      ctx.textBaseline = "middle";

      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);

        meta.data.forEach((element, index) => {
          const bar = element as any;
          const value = dataset.data[index] as number;

          const label = `${value > 0 ? "+" : ""}${value} pts ${value > 0 ? "↑" : "↓"}`;

          ctx.fillStyle = value > 0 ? "#2E7D32" : "#C62828"; // Green for positive, red for negative

          const xOffset = value > 0 ? 6 : -6;
          ctx.textAlign = value > 0 ? "left" : "right";

          ctx.fillText(label, bar.x + xOffset, bar.y);
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
          labels: radarLabels,
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
          scales: {
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
              enabled: false, // Disable tooltips as per original requirement
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
  }, []); // Empty dependency array ensures the chart is created only once

  // Highlight the selected label in the GapBarChart
  useEffect(() => {
    if (selectedLabel && chartRef.current) {
      const chart = chartRef.current;
      const labelIndex = radarLabels.indexOf(selectedLabel);
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
  }, [selectedLabel]);

  return <canvas ref={canvasRef} />;
};

export default GapBarChart;
