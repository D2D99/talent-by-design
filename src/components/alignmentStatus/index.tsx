import { Bar } from "react-chartjs-2";
import "./chartSetup";
import type { ChartOptions, ScriptableContext } from "chart.js";

type RoleData = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  data: RoleData[];
};

const RoleProgressChart = ({ data }: Props) => {
  // Check if all values are 0 (no data at all)
  const allZero = data.every((d) => d.value === 0);

  if (allZero) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-[11px] text-gray-400 italic font-medium">
          No Data Available
        </p>
      </div>
    );
  }

  // Helper function to create gradient
  const getGradient = (context: ScriptableContext<"bar">) => {
    const { ctx, chartArea } = context.chart;
    if (!chartArea) return; // Wait until chart is initialized

    const dataIndex = context.dataIndex;
    const baseColor = data[dataIndex].color;

    // Create a gradient from left (0) to right (chart width)
    const gradient = ctx.createLinearGradient(
      chartArea.left,
      0,
      chartArea.right,
      0
    );

    // Add color stops: Dark (Base Color) to Light (Base Color with transparency or lighter tint)
    gradient.addColorStop(0, baseColor); // Darker/Solid start
    gradient.addColorStop(1, `${baseColor}00`); // Lighter end (adding 44 for hex transparency)

    return gradient;
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    layout: {
      padding: {
        right: 50,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        clamp: true,
        clip: false,
      },
    },
    scales: {
      x: {
        display: false,
        min: 0,
        max: 100,
      },
      y: {
        display: false,
      },
    },
  };

  return (
    <Bar
      data={{
        labels: data.map((d) => d.label),
        datasets: [
          {
            data: data.map((d) => d.value),
            // Pass the function here instead of a static array
            backgroundColor: getGradient,
            borderRadius: 6,
            borderSkipped: false,
            categoryPercentage: 1.6,
            barThickness: 30,

            datalabels: {
              labels: {
                role: {
                  anchor: "start",
                  align: "right",
                  formatter: (_, ctx) => ctx.chart.data.labels?.[ctx.dataIndex],
                  color: "#000",
                  padding: { left: 2 },
                  font: { size: 13, weight: "bold" },
                },
                value: {
                  anchor: "end",
                  align: "right",
                  formatter: (value) => {
                    // Show "No Data Available" for zero values
                    return value > 0 ? `${value}%` : "No Data Available";
                  },
                  color: (ctx) => {
                    const value = ctx.dataset.data[ctx.dataIndex];
                    return typeof value === "number" && value === 0
                      ? "#94A3B8"
                      : "#000";
                  },
                  font: (ctx) => {
                    const value = ctx.dataset.data[ctx.dataIndex];
                    if (typeof value === "number" && value === 0) {
                      return { size: 11, weight: "normal", style: "italic" };
                    }
                    return { size: 14, weight: "bold" };
                  },
                  // Shift the percentage to the right
                  offset: (ctx) => {
                    const value = ctx.dataset.data[ctx.dataIndex];
                    if (typeof value === "number") {
                      if (value === 0) return 140; // Push past the role label text
                      return value <= 20 ? 15 : 10;
                    }
                    return 4;
                  },
                },
              },
            },
          },
        ],
      }}
      options={options}
    />
  );
};

export default RoleProgressChart;
