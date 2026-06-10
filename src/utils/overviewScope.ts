export type ScopeRoleChip = {
  role: string;
  label: string;
  count: number;
};

export type HierarchyStep = {
  key: string;
  label: string;
  active: boolean;
};

export type OverviewScope = {
  level: "organization" | "department" | "team";
  title: string;
  subtitle: string;
  orgName?: string;
  department?: string | null;
  activeLevel: string;
  hierarchy: HierarchyStep[];
  includesRoles: ScopeRoleChip[];
  totalMembers: number;
};

const ROLE_COLORS: Record<string, string> = {
  leader: "#6366F1",
  manager: "#10B981",
  employee: "#F59E0B",
};

export const getRoleColor = (role: string) =>
  ROLE_COLORS[role.toLowerCase()] || "#448CD2";

const HIERARCHY_ICONS: Record<string, string> = {
  organization: "solar:buildings-3-bold",
  department: "solar:users-group-rounded-bold",
  team: "solar:user-speak-bold",
};

export const getHierarchyIcon = (key: string) =>
  HIERARCHY_ICONS[key] || "solar:chart-square-bold";

export const buildFallbackScope = ({
  role,
  orgName = "Organization",
  department,
  counts = {},
}: {
  role?: string;
  orgName?: string;
  department?: string;
  counts?: {
    leaders?: number;
    managers?: number;
    employees?: number;
    total?: number;
  };
}): OverviewScope => {
  const r = (role || "admin").toLowerCase();
  const dept = department || "Your Department";

  if (r === "admin" || r === "superadmin" || r === "super_admin") {
    return {
      level: "organization",
      title: "Organization Overview",
      subtitle: `All departments in ${orgName}`,
      orgName,
      department: null,
      activeLevel: "organization",
      hierarchy: [{ key: "organization", label: orgName, active: true }],
      includesRoles: [
        { role: "leader", label: "Leaders", count: counts.leaders ?? 0 },
        { role: "manager", label: "Managers", count: counts.managers ?? 0 },
        { role: "employee", label: "Employees", count: counts.employees ?? 0 },
      ],
      totalMembers: counts.total ?? 0,
    };
  }

  if (r === "leader") {
    return {
      level: "department",
      title: "Department Overview",
      subtitle: `${dept} · Managers and employees under your leadership`,
      orgName,
      department: dept,
      activeLevel: "department",
      hierarchy: [
        { key: "organization", label: orgName, active: false },
        { key: "department", label: dept, active: true },
      ],
      includesRoles: [
        { role: "manager", label: "Managers", count: counts.managers ?? 0 },
        { role: "employee", label: "Employees", count: counts.employees ?? 0 },
      ],
      totalMembers: (counts.managers ?? 0) + (counts.employees ?? 0),
    };
  }

  return {
    level: "team",
    title: "Team Overview",
    subtitle: `${dept} · Employees in your department`,
    orgName,
    department: dept,
    activeLevel: "team",
    hierarchy: [
      { key: "organization", label: orgName, active: false },
      { key: "department", label: dept, active: false },
      { key: "team", label: "Your Team", active: true },
    ],
    includesRoles: [
      { role: "employee", label: "Employees", count: counts.employees ?? 0 },
    ],
    totalMembers: counts.employees ?? 0,
  };
};

export const scopePrioritySubtitle = (scope: OverviewScope) => {
  if (scope.level === "organization") {
    return "Ranked by lowest subdomain performance across the entire organization";
  }
  if (scope.level === "department") {
    return `Ranked by performance gaps within ${scope.department || "your department"}`;
  }
  return "Ranked by performance gaps among your direct-report employees";
};
