// data.ts

// Interface for a single score item
export interface ScoreItem {
  label: string;
  manager: number;
  team: number;
  peer: number;
}

// Your raw data (scoreData)
export const scoreData: ScoreItem[] = [
  {
    label: "Psychological Safety",
    manager: 4.5,
    team: 6.89,
    peer: 8.7
  },
  {
    label: "Dependability & Clarity",
    manager: 4.0,
    team: 1.77,
    peer: 7.1
  },
  {
    label: "Team Average",
    manager: 4.6,
    team: 7.3,
    peer: 2.9
  },
  {
    label: "Impact of Work",
    manager: 9.2,
    team: 9.5,
    peer: 1.4
  },
  {
    label: "Structure & Clarity",
    manager: 8.9,
    team: 3.52,
    peer: 8.7
  },
  {
    label: "Manager",
    manager: 1.0,
    team: 2.66,
    peer: 3.2
  }
];

// Derived data arrays (to be used in charts)
export const radarLabels = scoreData.map(item => item.label); // Extract labels for the radar charts
export const managerScores = scoreData.map(item => item.manager); // Extract manager scores for the radar chart
export const teamScores = scoreData.map(item => item.team); // Extract team scores for the radar chart
export const peerScores = scoreData.map(item => item.peer); // Extract peer scores for the radar chart

// Delta (difference) between team and manager scores (for the gap bar chart)
export const deltaScores = scoreData.map(item => +(item.team - item.manager).toFixed(2));

export interface TrendData {
  labels: string[];
  manager: number[];
  team: number[];
}
// Optional: Additional data for line charts or any other dynamic charts
export const TrendData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  manager: [4.5, 5, 5.8, 6.5, 7],
  team: [4.8, 5.2, 5.5, 6, 6.4]
};