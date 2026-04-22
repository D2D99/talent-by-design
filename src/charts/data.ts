/**
 * SINGLE SOURCE OF TRUTH
 * Radar + Gap charts are derived from this data
 */

export interface ScoreItem {
  label: string;
  manager: number;
  team: number;
  peer: number;
}

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

export const radarLabels = scoreData.map(item => item.label);
export const managerScores = scoreData.map(item => item.manager);
export const teamScores = scoreData.map(item => item.team);
export const peerScores = scoreData.map(item => item.peer);

export const deltaScores = scoreData.map(item =>
  +(item.team - item.manager).toFixed(2)
);
