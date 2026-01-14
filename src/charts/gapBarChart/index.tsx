import React, { useEffect, useRef } from "react";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";

type TrendData = {
  labels: string[];
  manager: number[];
  team: number[];
};

interface GapBarChartProps {
  data: TrendData;
}

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
);

/**
 * Custom plugin to draw value labels on bars with arrows
 */
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

        // Label with arrow indicating direction of change
        const label = `${value > 0 ? "+" : ""}${value} pts ${value > 0 ? "↑" : "↓"}`;

        ctx.fillStyle = value > 0 ? "#2E7D32" : "#C62828";  // Green for up, Red for down

        const xOffset = value > 0 ? 6 : -6;
        ctx.textAlign = value > 0 ? "left" : "right";

        // Position the label near the bar, right or left depending on value
        ctx.fillText(label, bar.x + xOffset, bar.y);
      });
    });

    ctx.restore();
  }
};

/**
 * Gap Bar Chart Component
 */
const GapBarChart: React.FC<GapBarChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

 useEffect(() => {
  if (chartRef.current) {
    // Calculate deltas and round them to one decimal place
    const deltaScores = data.manager.map((score, index) => {
      const delta = score - data.team[index];
      return Math.round(delta * 10) / 10;  // Rounds to 1 decimal place
    });

    new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: data.labels,  // Labels from data
        datasets: [
          {
            label: "Points Difference",
            data: deltaScores,  // Delta scores calculated from manager - team

            barThickness: 16,
            backgroundColor: (ctx: any) => {
              const value = ctx.raw as number;
              return value >= 0 ? "#7FBF7F" : "#E57373";  // Green for positive, Red for negative
            }
          }
        ]
      },
      options: {
        indexAxis: "y",  // Horizontal bars
        responsive: true,
        scales: {
          x: {
            min: -10,  // Adjust based on the range of delta scores
            max: 10,   // Adjust based on the range of delta scores
            grid: {
              color: "#ddd"
            },
            title: {
              display: true,
              text: "Points Difference"
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        }
      },
      plugins: [barValueLabelPlugin]  // Add the custom plugin for the arrows and value labels
    });
  }
}, [data]);


  return <canvas ref={chartRef}></canvas>;
};

export default GapBarChart;
