import React from "react";
import { Chart } from "chart.js";
import { radarLabels, managerScores, teamScores, peerScores } from "../data";

const MultiRadarChart: React.FC = () => {
  React.useEffect(() => {
    const canvas = document.getElementById("multiRadarChart") as HTMLCanvasElement;
    if (!canvas) return;

    new Chart(canvas, {
      type: "radar",
      data: {
        labels: radarLabels,
        datasets: [
          {
            label: "Manager",
            data: managerScores,
            backgroundColor: "rgba(74, 144, 226, 0.25)",
            borderColor: "#4A90E2",
            pointBackgroundColor: "#4A90E2",
            pointRadius: 3,
            fill: true,
          },
          {
            label: "Team",
            data: teamScores,
            backgroundColor: "rgba(46, 204, 113, 0.25)",
            borderColor: "#2ECC71",
            pointBackgroundColor: "#2ECC71",
            pointRadius: 3,
            fill: true,
          },
          {
            label: "Peer",
            data: peerScores,
            backgroundColor: "rgba(231, 76, 60, 0.25)",
            borderColor: "#E74C3C",
            pointBackgroundColor: "#E74C3C",
            pointRadius: 3,
            fill: true,
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
  }, []);

  return <canvas id="multiRadarChart" />;
};

export default MultiRadarChart;
