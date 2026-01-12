import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// ⬇️ side-effect import (no function call needed)
import "highcharts/highcharts-more";


const options: Highcharts.Options = {
  chart: {
    type: "gauge"
  },
  title: { text: "" },
  pane: {
    startAngle: -90,
    endAngle: 90,
    background: undefined,
    center: ["50%", "75%"],
    size: "120%"
  },
  yAxis: {
    min: 0,
    max: 100,
    tickLength: 0,
    tickWidth: 0,
    minorTickLength: 0,
    lineWidth: 0,
    labels: { enabled: false },
    plotBands: [
      { from: 0, to: 16.6, color: "#ff5c5c", thickness: 18 },
      { from: 16.6, to: 33.3, color: "#ff8c8c", thickness: 18 },
      { from: 33.3, to: 50, color: "#ffd400", thickness: 18 },
      { from: 50, to: 66.6, color: "#cddc39", thickness: 18 },
      { from: 66.6, to: 83.3, color: "#8bc34a", thickness: 18 },
      { from: 83.3, to: 100, color: "#4caf50", thickness: 18 }
    ]
  },
  series: [
    {
      type: "gauge",
      data: [55],
      dial: {
        radius: "75%",
        backgroundColor: "#222",
        baseWidth: 10
      },
      pivot: {
        radius: 7,
        backgroundColor: "#222"
      },
      dataLabels: { enabled: false }
    }
  ]
};

export default function Speedometer() {
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
