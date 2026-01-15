import { Bar } from 'react-chartjs-2'
import './chartSetup'
import type { ChartOptions, ScriptableContext } from 'chart.js'

type RoleData = {
  label: string
  value: number
  color: string
}

type Props = {
  data: RoleData[]
}

const RoleProgressChart = ({ data }: Props) => {
  // Helper function to create gradient
  const getGradient = (context: ScriptableContext<'bar'>) => {
    const { ctx, chartArea } = context.chart;
    if (!chartArea) return; // Wait until chart is initialized

    const dataIndex = context.dataIndex;
    const baseColor = data[dataIndex].color;

    // Create a gradient from left (0) to right (chart width)
    const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
    
    // Add color stops: Dark (Base Color) to Light (Base Color with transparency or lighter tint)
    gradient.addColorStop(0, baseColor); // Darker/Solid start
    gradient.addColorStop(1, `${baseColor}00`); // Lighter end (adding 44 for hex transparency)

    return gradient;
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        clamp: true,
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
  }

  return (
    <Bar
      data={{
        labels: data.map(d => d.label),
        datasets: [
          {
            data: data.map(d => d.value),
            // Pass the function here instead of a static array
            backgroundColor: getGradient, 
            borderRadius: 6,
            borderSkipped: false,
            categoryPercentage: 1.6,
            barThickness: 30,

            datalabels: {
              labels: {
                role: {
                  anchor: 'start',
                  align: 'right',
                  formatter: (_, ctx) => ctx.chart.data.labels?.[ctx.dataIndex],
                  color: '#000',
                  padding: { left: 2 },
                  font: { size: 13, weight: 'bold' },
                },
                value: {
                  anchor: 'end',
                  align: 'right',
                  formatter: value => `${value}%`,
                  color: '#000',
                  offset: 4,
                  font: { size: 14, weight: 'bold' },
                },
              },
            },
          },
        ],
      }}
      options={options}
    />
  )
}

export default RoleProgressChart