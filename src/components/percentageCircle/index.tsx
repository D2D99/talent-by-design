import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface CircularProgressProps {
  value: number;
  maxValue?: number;
  text?: string;
  width?: number;  // Add width as a prop
  textColor?: string;  // Add text color as a prop
  pathColor?: string;  // Add path color as a prop
  trailColor?: string;  // Add trail color as a prop
  // textSize?: number | string;  // Add text size as a prop
}

function CircularProgress({
  value,
  maxValue = 100,
  text,
  width = 180,  // Default width to 180 if not provided
  textColor = "#31A431",  // Default text color
  pathColor = "#31A431",  // Default path color
  trailColor = "#30ad434b",  // Default trail color
  // textSize = "18px",
}: CircularProgressProps) {
  return (
    <div style={{ width }} className="font-bold !text-5xl">  {/* Use the dynamic width */}
      <CircularProgressbar
        value={value}
        maxValue={maxValue}
        text={text ?? `${value}%`}
        styles={buildStyles({
          textColor: textColor,
          pathColor: pathColor,
          trailColor: trailColor,
          textSize: "18px",
        })}
      />
    </div>
  );
}

export default CircularProgress;
