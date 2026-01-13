import "./chartSetup"; // Import chart setup to register components
import { Bar } from "react-chartjs-2";

interface ScoreBarProps {
  score: number; // 0–100
  label: string;
}

const curvedArrowPlugin = {
  id: "curvedArrowPlugin",
  afterDraw(chart: any) {
    const { ctx, scales, chartArea } = chart;
    const score =
      chart.options.plugins?.annotation?.annotations?.marker?.xMin ?? 0;
    const label = chart.options.plugins?.curvedArrowLabel ?? "";

    // Anchor on bar
    const x = scales.x.getPixelForValue(score);
    const y = (chartArea.top + chartArea.bottom) / 2;

    // Geometry
    const radius = 5;
    const endX = x + 45;
    const endY = y - 40;

    // Control points
    const cp1X = x + 16;
    const cp1Y = y + 5;
    const cp2X = x + 10;
    const cp2Y = y - 36;

    // Arrow head
    const headLength = 9;
    const headWidth = 5;

    // Arrow direction (tangent)
    const angle = Math.atan2(endY - cp2Y, endX - cp2X);

    // Stop line at arrow base
    const shaftEndX = endX - headLength * Math.cos(angle);
    const shaftEndY = endY - headLength * Math.sin(angle);

    ctx.save();
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#000";
    ctx.lineWidth = 2.7;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // ---- Circle ----
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // ---- Smooth curved connector ----
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, shaftEndX, shaftEndY);
    ctx.stroke();

    // ---- Arrow head ----
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headLength * Math.cos(angle) + headWidth * Math.sin(angle),
      endY - headLength * Math.sin(angle) - headWidth * Math.cos(angle)
    );
    ctx.lineTo(
      endX - headLength * Math.cos(angle) - headWidth * Math.sin(angle),
      endY - headLength * Math.sin(angle) + headWidth * Math.cos(angle)
    );
    ctx.closePath();
    ctx.fill();

    // ---- LABEL (RIGHT + ABOVE arrow) ----
    if (label) {
      const forwardOffset = 5; // distance from arrow tip
      const sideOffset = -10; // move to right
      const upOffset = 10; // move upward

      const labelX =
        endX + forwardOffset * Math.cos(angle) + sideOffset * Math.sin(angle);

      const labelY =
        endY +
        forwardOffset * Math.sin(angle) -
        sideOffset * Math.cos(angle) -
        upOffset;

      ctx.font = "600 12px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(label, labelX, labelY);
    }

    ctx.restore();
  },
};

export default function ScoreBar({ score, label }: ScoreBarProps) {
  const data = {
    labels: [""],
    datasets: [
      { data: [10], backgroundColor: "#d32f2f", stack: "score" },
      { data: [10], backgroundColor: "#f57c00", stack: "score" },
      { data: [10], backgroundColor: "#ffb74d", stack: "score" },
      { data: [10], backgroundColor: "#ffe082", stack: "score" },
      { data: [10], backgroundColor: "#fff9c4", stack: "score" },
      { data: [10], backgroundColor: "#dcedc8", stack: "score" },
      { data: [10], backgroundColor: "#a5d6a7", stack: "score" },
      { data: [10], backgroundColor: "#66bb6a", stack: "score" },
      { data: [10], backgroundColor: "#43a047", stack: "score" },
      { data: [10], backgroundColor: "#1b8e3e", stack: "score" },
    ],
  };

  const options: any = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 70,
        left: 10,
        right: 10,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      curvedArrowLabel: label,
      annotation: {
        annotations: {
          marker: {
            type: "line",
            xMin: score,
            xMax: score,
            borderWidth: 0,
          },
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        stacked: true,
        grid: { display: false },
        ticks: { stepSize: 10 },
      },
      y: {
        stacked: true,
        display: false,
      },
    },
    datasets: {
      bar: {
        barThickness: 100,
        borderWidth: 0,
      },
    },
  };

  return (
    <div style={{ height: 150, width: "100%" }}>
      {" "}
      {/* Increased height */}
      <Bar data={data} options={options} plugins={[curvedArrowPlugin]} />
    </div>
  );
}
