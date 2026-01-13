import { useEffect, useRef } from "react";

// Declare Highcharts if it's loaded from a <script> tag
declare global {
  interface Window {
    Highcharts: typeof import("highcharts");
  }
}

const SpeedMeter = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if Highcharts is loaded and available
    if (window.Highcharts) {
      const Highcharts = window.Highcharts; // Use the global Highcharts object

      const options: Highcharts.Options = {
        chart: {
          type: "gauge",
          height: "100%", // Ensure the chart scales to the div size
        },

        // Removed the title from the options
        title: undefined,

        pane: {
          startAngle: -90, // Start the arc at -90° (left side of the arc)
          endAngle: 90, // End the arc at 90° (right side of the arc)
          background: undefined,
          center: ["50%", "75%"], // Position of the arc in the container
          size: "100%", // Size of the arc in relation to the container (full arc)
        },

        yAxis: {
          min: 0,
          max: 100, // Set the value range from 0 to 100
          tickLength: 0,
          tickWidth: 0,
          minorTickLength: 0,
          lineWidth: 0,
          labels: {
            enabled: false, // Hide the axis labels
          },

          plotBands: [
            { from: 0, to: 16.6, color: "#ff5c5c", thickness: 18, borderWidth: 4, borderColor: "#ffffff" },
            { from: 16.6, to: 33.3, color: "#ff8c8c", thickness: 18, borderWidth: 4, borderColor: "#ffffff" },
            { from: 33.3, to: 50, color: "#ffd400", thickness: 18, borderWidth: 4, borderColor: "#ffffff" },
            { from: 50, to: 66.6, color: "#cddc39", thickness: 18, borderWidth: 4, borderColor: "#ffffff" },
            { from: 66.6, to: 83.3, color: "#8bc34a", thickness: 18, borderWidth: 4, borderColor: "#ffffff" },
            { from: 83.3, to: 100, color: "#4caf50", thickness: 18, borderWidth: 4, borderColor: "#ffffff" },
          ],

          title: {
            text: "",
          },
        },

        series: [
          {
            type: "gauge",
            data: [75], // You can adjust the value between 0 and 100
            dial: {
              radius: "60%", // Control the size of the dial within the arc
              backgroundColor: "#222", // Dial color
              baseWidth: 10, // Width of the dial base
              baseLength: "0%", // Dial base length
              rearLength: "0%", // Rear length of the dial
            },

            pivot: {
              radius: 7, // Radius of the pivot (center of the gauge)
              backgroundColor: "#222", // Pivot color
            },

            dataLabels: {
              enabled: false, // Disable data labels
            },
          } as any, // Cast the series as `any` to bypass strict typing
        ],

        // Add responsiveness and ensure needle stays in correct place
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500, // Adjust this breakpoint as necessary
              },
              chartOptions: {
                chart: {
                  height: "100%", // Ensure the chart adjusts to container
                },
              },
            },
          ],
        },
      };

      // Initialize the Highcharts chart once the component is mounted
      if (chartRef.current) {
        new Highcharts.Chart(chartRef.current, options);
      }
    }
  }, []);

  return (
    <div
      style={{
        width: "100%", // Make the div container take full width
        maxWidth: "500px", // Set the maximum width
        height: "300px", // Set the height of the div
        margin: "auto", // Center the div container
      }}
      ref={chartRef}
    ></div>
  );
};

export default SpeedMeter;