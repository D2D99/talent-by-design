import type { TopPriority } from "../components/needsAttentionCard";

export type ScoreDomains = {
  domains?: Record<
    string,
    {
      score?: number;
      subdomains?: Record<string, number | { score?: number }>;
      subdomainFeedback?: Record<
        string,
        {
          insight?: string;
          modelDescription?: string;
        }
      >;
    }
  >;
};

export type TeamAvgShape = Record<
  string,
  {
    avgScore?: number;
    subdomains?: Record<string, number>;
  }
>;

export const getClassification = (
  score: number,
): "Low" | "Medium" | "High" => {
  if (score < 50) return "Low";
  if (score < 75) return "Medium";
  return "High";
};

const truncate = (text: string, max = 280) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
};

const firstStep = (text?: string) => {
  if (!text) return "";
  const line = text
    .split(/\n|(?=•)/)
    .map((s) => s.trim().replace(/^[•\-*]\s*/, ""))
    .find(Boolean);
  return line || text.trim();
};

const defaultImpact = (area: string, domain: string, classification: string) => {
  if (classification === "Low") {
    return `${area} is underperforming within ${domain} and may be creating friction that limits team and organizational outcomes.`;
  }
  if (classification === "Medium") {
    return `${area} shows inconsistent performance in ${domain}. Without focused attention, this area may decline and affect broader results.`;
  }
  return `${area} is performing well but should be monitored to sustain momentum within ${domain}.`;
};

const defaultStep = (classification: string) => {
  if (classification === "Low") {
    return "Schedule a leadership review within 7 days and define targeted 30-day improvement actions for this area.";
  }
  if (classification === "Medium") {
    return "Review current practices with your team this quarter and reinforce clear priorities for this area.";
  }
  return "Document what is working well and share practices across other teams.";
};

const parseSubScore = (raw: number | { score?: number } | undefined) => {
  if (raw == null) return NaN;
  return typeof raw === "object" ? Number(raw.score) : Number(raw);
};

export const computePrioritiesFromScores = (
  scores?: ScoreDomains | null,
  limit = 2,
): TopPriority[] => {
  const entries: TopPriority[] = [];
  const domains = scores?.domains || {};

  for (const [domainName, domainData] of Object.entries(domains)) {
    const subdomains = domainData?.subdomains || {};
    for (const [subName, subScoreRaw] of Object.entries(subdomains)) {
      const score = Math.round(parseSubScore(subScoreRaw));
      if (Number.isNaN(score)) continue;

      const classification = getClassification(score);
      const storedFb = domainData?.subdomainFeedback?.[subName];
      const impact = storedFb?.insight
        ? truncate(storedFb.insight)
        : defaultImpact(subName, domainName, classification);
      const recommendedStep = storedFb?.modelDescription
        ? truncate(firstStep(storedFb.modelDescription), 200)
        : defaultStep(classification);

      entries.push({
        domain: domainName,
        subdomain: subName,
        area: subName,
        score,
        classification,
        issue: `${subName} — ${classification} performance (${score}%)`,
        impact,
        recommendedStep,
      });
    }
  }

  return entries
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
    .slice(0, limit)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));
};

export const computePrioritiesFromTeamAvg = (
  teamAvg?: TeamAvgShape | null,
  limit = 2,
): TopPriority[] => {
  if (!teamAvg) return [];

  const scores: ScoreDomains = {
    domains: Object.fromEntries(
      Object.entries(teamAvg).map(([domainName, domainData]) => [
        domainName,
        {
          score: domainData?.avgScore,
          subdomains: domainData?.subdomains || {},
        },
      ]),
    ),
  };

  return computePrioritiesFromScores(scores, limit).filter(
    (p) => (p.score ?? 100) < 75,
  );
};

export type TeamStats = {
  completionRate?: number;
  completedAssessments?: number;
  totalMembers?: number;
  notStartedAssessments?: number;
  activeInvites?: number;
};

export const computeOperationalPriorities = (
  stats?: TeamStats | null,
  limit = 2,
): TopPriority[] => {
  if (!stats) return [];

  const priorities: TopPriority[] = [];
  const completionRate = stats.completionRate ?? 0;
  const completed = stats.completedAssessments ?? 0;
  const total = stats.totalMembers ?? 0;
  const pending = stats.notStartedAssessments ?? 0;
  const activeInvites = stats.activeInvites ?? 0;

  if (completionRate < 70 && total > 0) {
    priorities.push({
      domain: "Team Assessment",
      area: "Low Completion Rate",
      classification: "Low",
      issue: `Only ${completionRate}% of assessments are complete (${completed}/${total})`,
      impact:
        "Incomplete assessments delay insight generation and prevent accurate identification of team development gaps.",
      recommendedStep:
        "Send reminder invitations to pending members and set a team deadline within the next 7 days.",
    });
  }

  if (pending > 0) {
    priorities.push({
      domain: "Team Assessment",
      area: "Pending Assessments",
      classification: "Medium",
      issue: `${pending} team member${pending === 1 ? "" : "s"} have not started their assessment`,
      impact:
        "Unstarted assessments block team-level reporting and reduce visibility into organizational readiness.",
      recommendedStep:
        "Follow up directly with pending members and confirm they received their invitation email.",
    });
  }

  if (activeInvites > 0 && priorities.length < limit) {
    priorities.push({
      domain: "Team Invitations",
      area: "Awaiting Invitations",
      classification: "Medium",
      issue: `${activeInvites} active invitation${activeInvites === 1 ? "" : "s"} awaiting response`,
      impact:
        "Outstanding invitations prevent new team members from contributing to assessment data.",
      recommendedStep:
        "Resend invitations or confirm email addresses for pending team members.",
    });
  }

  return priorities.slice(0, limit).map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
};

/** Prefer API priorities; fall back to score-derived; optionally blend operational items. */
export const resolveDashboardPriorities = ({
  apiPriorities = [],
  scores,
  teamAvg,
  operationalStats,
  limit = 2,
  scoreThreshold = 75,
}: {
  apiPriorities?: TopPriority[];
  scores?: ScoreDomains | null;
  teamAvg?: TeamAvgShape | null;
  operationalStats?: TeamStats | null;
  limit?: number;
  scoreThreshold?: number;
}): TopPriority[] => {
  let performance: TopPriority[] = [];

  if (apiPriorities.length > 0) {
    performance = apiPriorities;
  } else if (scores?.domains) {
    performance = computePrioritiesFromScores(scores, limit);
  } else if (teamAvg) {
    performance = computePrioritiesFromTeamAvg(teamAvg, limit);
  }

  performance = performance
    .filter((p) => (p.score ?? 0) < scoreThreshold || p.score == null)
    .slice(0, limit);

  if (performance.length >= limit) {
    return performance.map((p, i) => ({ ...p, rank: i + 1 }));
  }

  const operational = computeOperationalPriorities(operationalStats, limit);
  const merged = [...performance];

  for (const op of operational) {
    if (merged.length >= limit) break;
    if (!merged.some((p) => p.area === op.area)) {
      merged.push(op);
    }
  }

  return merged.slice(0, limit).map((p, i) => ({ ...p, rank: i + 1 }));
};

export const getPrioritySummary = (priorities: TopPriority[]) => {
  const critical = priorities.filter((p) => (p.score ?? 0) < 50).length;
  const atRisk = priorities.filter(
    (p) => p.score != null && p.score >= 50 && p.score < 75,
  ).length;
  const operational = priorities.filter((p) => p.score == null).length;

  return { critical, atRisk, operational, total: priorities.length };
};
