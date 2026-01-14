// GapBarChart.tsx
import React, { useEffect } from "react";
import { Chart } from "chart.js";

interface GapBarChartProps {
  data: any;  // The data passed from ManagerOverview
}

const GapBarChart: React.FC<GapBarChartProps> = ({ data }) => {
  useEffect(() => {
    const canvas = document.getElementById("barChart") as HTMLCanvasElement;
    if (!canvas) return;

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: data.labels,  // Use the labels from chartData
        datasets: [
          {
            label: "Points Difference",
            data: data.manager.map((score: number, index: number) => data.team[index] - score),  // Calculate the delta (team - manager)
            barThickness: 16,
            backgroundColor: (ctx: any) => {
              const value = ctx.raw as number;
              return value >= 0 ? "#7FBF7F" : "#E57373";  // Green for positive, Red for negative
            },
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        scales: {
          x: {
            min: -1,
            max: 1,
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
            enabled: false,
          },
        },
      },
    });
  }, [data]); // Re-run the effect if `data` changes

  return <canvas id="barChart" />;
};

export default GapBarChart;
