import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
} from "chart.js"
import annotationPlugin from "chartjs-plugin-annotation"

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  annotationPlugin
)
