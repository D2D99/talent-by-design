import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from "chart.js";

// Register necessary Chart.js components
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface MultiRadarChartProps {
  data: {
    labels: string[];
    manager: number[];
    team: number[];
    peer?: number[];
    admin?: number[];
  };
  onLabelSelect?: (label: string) => void;
  datasetLabels?: string[];
  hiddenIndices?: number[];
}

const MultiRadarChart = ({ data, onLabelSelect, datasetLabels, hiddenIndices = [] }: MultiRadarChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (canvasRef.current) {
      chartRef.current = new Chart(canvasRef.current, {
        type: "radar",
        data: {
          labels: data.labels,
          datasets: [
            {
              label: datasetLabels?.[0] || "Manager",
              data: data.manager,
              backgroundColor: "transparent", // No fill inside
              borderColor: "#4A90E2",
              borderWidth: 2,
              pointBackgroundColor: "#4A90E2",
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: "origin", // Allow filling to the center (transparent)
              borderDash: [5, 5], // Dashed border lines
              hidden: hiddenIndices.includes(0),
            },
            {
              label: datasetLabels?.[1] || "Team",
              data: data.team,
              backgroundColor: "transparent",
              borderColor: "#2ECC71",
              borderWidth: 2,
              pointBackgroundColor: "#2ECC71",
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: "origin",
              borderDash: [5, 5], // Dashed border lines
              hidden: hiddenIndices.includes(1),
            },
            {
              label: datasetLabels?.[2] || "Peer",
              data: data.peer || [],
              backgroundColor: "transparent",
              borderColor: "#E74C3C",
              borderWidth: 2,
              pointBackgroundColor: "#E74C3C",
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: "origin",
              borderDash: [5, 5], // Dashed border lines
              hidden: hiddenIndices.includes(2),
            },
            ...(data.admin && data.admin.length > 0 ? [{
              label: datasetLabels?.[3] || "Admin",
              data: data.admin,
              backgroundColor: "transparent",
              borderColor: "#9B59B6",
              borderWidth: 2,
              pointBackgroundColor: "#9B59B6",
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: "origin",
              borderDash: [5, 5], // Dashed border lines
              hidden: hiddenIndices.includes(3),
            }] : []),
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
                circular: true, // Enable circular grid
                lineWidth: 1,
                color: "#CFCFCF", // Grid line color
              },
              angleLines: {
                color: "#CFCFCF", // Angle lines color
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
          events: ["click"],
        },
      });

      const clickHandler = (event: MouseEvent) => {
        if (chartRef.current && chartRef.current.data && onLabelSelect) {
          const points = chartRef.current.getElementsAtEventForMode(
            event as any,
            "nearest",
            { intersect: true },
            true
          );

          if (points.length > 0) {
            const label = chartRef.current.data.labels?.[points[0].index];
            if (label && typeof label === "string") {
              onLabelSelect(label);
            }
          }
        }
      };

      canvasRef.current.addEventListener("click", clickHandler);

      return () => {
        if (chartRef.current) {
          chartRef.current.destroy();
        }
        if (canvasRef.current) {
          canvasRef.current.removeEventListener("click", clickHandler);
        }
      };
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, onLabelSelect, datasetLabels, hiddenIndices]);

  return <canvas ref={canvasRef} />;
};

export default MultiRadarChart;