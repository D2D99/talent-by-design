import { Icon } from "@iconify/react";
import { useEffect, useState, useCallback } from "react";
import Pagination from "../Pagination";
import api from "../../services/axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Ripple, initTWE } from "tw-elements";

interface UserMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
  createdAt: string;
  status: string;
  assessmentStatus?: string;
  lastAssessmentId?: string | null;
}

interface OrgDetails {
  orgName: string;
  createdAt: string;
  status: string;
  totalTeamMember: number;
}

const OrgAssessmentDetails = () => {
  const { orgName: routeOrgName } = useParams();
  const navigate = useNavigate();

  const [members, setMembers] = useState<UserMember[]>([]);
  const [details, setDetails] = useState<OrgDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [assessmentFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [roleFilter] = useState<string[]>([]);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof UserMember;
    direction: "asc" | "desc";
  } | null>(null);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!routeOrgName) {
        toast.error("Organization not found");
        return;
      }

      const res = await api.get<{ details: OrgDetails; members: UserMember[] }>(
        `auth/organization/${routeOrgName}`,
      );
      setMembers(res.data.members);
      setDetails(res.data.details);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load members");
    } finally {
      setIsLoading(false);
    }
  }, [routeOrgName]);

  useEffect(() => {
    fetchMembers();
    initTWE({ Ripple });
  }, [fetchMembers]);

  const handleSort = (key: keyof UserMember) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedMembers = [...members].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key]! < b[key]!) return direction === "asc" ? -1 : 1;
    if (a[key]! > b[key]!) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredMembers = sortedMembers.filter((m) => {
    const matchesSearch =
      `${m.firstName} ${m.lastName} ${m.email} ${m.role} ${m.department || ""} ${m.assessmentStatus || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter.length === 0 || roleFilter.includes(m.role.toLowerCase());
    const matchesAssessment =
      assessmentFilter.length === 0 ||
      assessmentFilter.includes(m.assessmentStatus || "Not Started");

    return matchesSearch && matchesRole && matchesAssessment;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);

  const renderAssessmentBadge = (status?: string) => {
    const base =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border justify-center";

    if (status === "Completed") {
      return (
        <span
          className={`${base} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border justify-center bg-[#EEF7ED] text-[#3F9933] border-[#3F9933]`}
        >
          Completed
        </span>
      );
    } else if (status === "In Progress") {
      return (
        <span className={`${base} bg-blue-50 text-blue-600 border-blue-200`}>
          In Progress
        </span>
      );
    } else if (status === "Due") {
      return (
        <span className={`${base} bg-amber-50 text-amber-600 border-amber-200`}>
          Due
        </span>
      );
    } else {
      return (
        <span className={`${base} bg-gray-50 text-gray-400 border-gray-200`}>
          Not Started
        </span>
      );
    }
  };

  // Calculate stats
  const totalMembers = members.length;
  const completedMembers = members.filter(
    (m) => m.assessmentStatus === "Completed",
  ).length;
  const inProgressMembers = members.filter(
    (m) => m.assessmentStatus === "In Progress",
  ).length;
  const dueMembers = members.filter((m) => m.assessmentStatus === "Due").length;
  const completionRate =
    totalMembers > 0 ? Math.round((completedMembers / totalMembers) * 100) : 0;

  const handleActionClick = (
    member: UserMember,
    type: "Report" | "Response",
  ) => {
    setActiveDropdown(null);
    if (type === "Report") {
      const roleMapping: Record<string, string> = {
        superAdmin: "org-head",
        superadmin: "org-head",
        super_admin: "org-head",
        admin: "org-head",
        "senior-leader": "senior-leader",
        leader: "senior-leader",
        manager: "manager",
        employee: "employee",
      };
      const reportType = roleMapping[member.role.toLowerCase()] || "employee";
      navigate(
        `/dashboard/reports/${reportType}?userId=${member._id}&orgName=${encodeURIComponent(details?.orgName || "")}`,
      );
    } else {
      if (member.lastAssessmentId) {
        const userName = `${member.firstName} ${member.lastName}`;
        navigate(
          `/dashboard/user-responses/${member.lastAssessmentId}?userName=${encodeURIComponent(userName)}`,
        );
      } else {
        toast.info("No completed assessment found for this member.");
      }
    }
  };

  return (
    <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-162px)] grid items-start">
      {/* Header Section */}
      <div className="mb-8 bg-white relative overflow-hidden">
        <div
          className="flex items-center gap-1.5 text-xs font-bold mb-6 cursor-pointer text-[#448CD2] transition-colors w-fit"
          onClick={() => navigate("/dashboard/org-assessments")}
        >
          <Icon icon="material-symbols:arrow-back-rounded" width="16" />
          <span className="uppercase tracking-wider">Back</span>
        </div>
        <h2 className="md:text-3xl text-2xl font-bold text-gray-800 mb-2">
          {details?.orgName || "Organization Details"}
        </h2>
        <p className="text-sm text-gray-500 mb-10">
          Track assessment completion and participant progress
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xxl:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-200/25 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[var(--primary-color)] uppercase tracking-wider">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-[var(--primary-color)] mt-1">
                  {totalMembers}
                </p>
              </div>
              <div className="p-3 bg-blue-200/50 rounded-lg">
                <Icon
                  icon="solar:users-group-rounded-bold"
                  className="text-[var(--primary-color)]"
                  width="24"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider">
                  Completed
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {completedMembers}
                </p>
              </div>
              <div className="p-3 bg-green-200/50 rounded-lg">
                <Icon
                  icon="solar:check-circle-bold"
                  className="text-green-600"
                  width="24"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider">
                  In Progress
                </p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {inProgressMembers}
                </p>
              </div>
              <div className="p-3 bg-yellow-200/50 rounded-lg">
                <Icon
                  icon="solar:hourglass-bold"
                  className="text-yellow-600"
                  width="24"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  Due
                </p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {dueMembers}
                </p>
              </div>
              <div className="p-3 bg-red-200/50 rounded-lg">
                <Icon
                  icon="solar:bell-bold"
                  className="text-red-600"
                  width="24"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                  Completion
                </p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {completionRate}%
                </p>
              </div>
              <div className="p-3 bg-purple-200/50 rounded-lg">
                <Icon
                  icon="solar:pie-chart-2-bold"
                  className="text-purple-600"
                  width="24"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Icon
            icon="tabler:search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="20"
          />
          <input
            type="text"
            placeholder="Search by name, email, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#448CD2] focus:ring-1 focus:ring-[#448CD2] transition-all text-gray-700"
          />
        </div>
      </div>
      {/* <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
              showFilters ||
              roleFilter.length > 0 ||
              assessmentFilter.length > 0
                ? "bg-blue-50 border-blue-200 text-blue-600 font-bold dark:bg-[rgba(121,186,240,0.16)] dark:border-[rgba(121,186,240,0.35)] dark:text-[#cbe4fb]"
                : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-[var(--app-border-color)] dark:text-[var(--app-text-muted)] dark:hover:bg-[var(--app-surface-muted)]"
            }`}
          >
            <Icon icon="mi:filter" width="18" />
            <span>Filters</span>
            {(roleFilter.length > 0 || assessmentFilter.length > 0) && (
              <span className="bg-blue-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full ml-1">
                {roleFilter.length + assessmentFilter.length}
              </span>
            )}
          </button>
        </div> */}

      {/* Filter Sidebar */}
      {/* {showFilters && (
        <div className="absolute right-6 top-[500px] w-72 bg-white shadow-2xl rounded-xl border border-gray-100 z-50 p-5 transform transition-all duration-300 dark:bg-[var(--app-surface)] dark:border-[var(--app-border-color)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-800 dark:text-[var(--app-heading-color)]">
                Filters
              </h3>
              {(roleFilter.length > 0 || assessmentFilter.length > 0) && (
                <button
                  onClick={() => {
                    setRoleFilter([]);
                    setAssessmentFilter([]);
                  }}
                  className="text-[10px] font-bold text-blue-500 hover:text-blue-700 uppercase tracking-tighter bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 transition-colors dark:bg-[rgba(121,186,240,0.16)] dark:border-[rgba(121,186,240,0.35)] dark:text-[#cbe4fb]"
                >
                  Reset
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600 dark:text-[#88a7c4] dark:hover:text-[#d6e8f8]"
            >
              <Icon icon="material-symbols:close" width="20" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 dark:text-[#88a7c4]">
                Role
              </label>
              <div className="space-y-2">
                {["leader", "manager", "employee", "admin"].map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={roleFilter.includes(r)}
                      onChange={() => {
                        setRoleFilter((prev) =>
                          prev.includes(r)
                            ? prev.filter((x) => x !== r)
                            : [...prev, r],
                        );
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-[var(--app-border-color)] dark:bg-[var(--app-surface-muted)]"
                    />
                    <span
                      className={`text-sm capitalize ${roleFilter.includes(r) ? "text-blue-600 font-bold dark:text-[#cbe4fb]" : "text-gray-600 dark:text-[var(--app-text-muted)]"}`}
                    >
                      {r}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 dark:text-[#88a7c4]">
                Assessment Status
              </label>
              <div className="space-y-2">
                {["Completed", "In Progress", "Due", "Not Started"].map((s) => (
                  <label
                    key={s}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={assessmentFilter.includes(s)}
                      onChange={() => {
                        setAssessmentFilter((prev) =>
                          prev.includes(s)
                            ? prev.filter((x) => x !== s)
                            : [...prev, s],
                        );
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-[var(--app-border-color)] dark:bg-[var(--app-surface-muted)]"
                    />
                    <span
                      className={`text-sm ${assessmentFilter.includes(s) ? "text-blue-600 font-bold dark:text-[#cbe4fb]" : "text-gray-600 dark:text-[var(--app-text-muted)]"}`}
                    >
                      {s}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 font-semibold">#</th>
              <th
                className="px-6 py-4 font-semibold"
                onClick={() => handleSort("firstName")}
              >
                <div className="flex items-center justify-between">
                  <span>Name</span>
                  <div className="flex flex-col opacity-75 cursor-pointer size-5">
                    <Icon
                      icon="mdi:chevron-up"
                      className={`-mb-1.5 ${sortConfig?.key === "firstName" && sortConfig.direction === "asc" ? "text-blue-600 opacity-100" : ""}`}
                    />
                    <Icon
                      icon="mdi:chevron-down"
                      className={`${sortConfig?.key === "firstName" && sortConfig.direction === "desc" ? "text-blue-600 opacity-100" : ""}`}
                    />
                  </div>
                </div>
              </th>
              <th
                className="px-6 py-4 font-semibold"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center justify-between">
                  <span>Email</span>
                  <div className="flex flex-col opacity-75 cursor-pointer size-5">
                    <Icon
                      icon="mdi:chevron-up"
                      className={`-mb-1.5 ${sortConfig?.key === "email" && sortConfig.direction === "asc" ? "text-blue-600 opacity-100" : ""}`}
                    />
                    <Icon
                      icon="mdi:chevron-down"
                      className={`${sortConfig?.key === "email" && sortConfig.direction === "desc" ? "text-blue-600 opacity-100" : ""}`}
                    />
                  </div>
                </div>
              </th>
              <th className="px-6 py-4 font-semibold">Department</th>
              <th
                className="px-6 py-4 font-semibold"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center justify-between">
                  <span className="text-nowrap">Created Date</span>
                  <div className="flex flex-col opacity-75 cursor-pointer size-5">
                    <Icon
                      icon="mdi:chevron-up"
                      className={`-mb-1.5 ${sortConfig?.key === "createdAt" && sortConfig.direction === "asc" ? "text-blue-600 opacity-100" : ""}`}
                    />
                    <Icon
                      icon="mdi:chevron-down"
                      className={`${sortConfig?.key === "createdAt" && sortConfig.direction === "desc" ? "text-blue-600 opacity-100" : ""}`}
                    />
                  </div>
                </div>
              </th>
              <th
                className="px-6 py-4 font-semibold"
                onClick={() => handleSort("role")}
              >
                <div className="flex items-center justify-between">
                  <span>Role</span>
                  <div className="flex flex-col opacity-75 cursor-pointer size-5">
                    <Icon
                      icon="mdi:chevron-up"
                      className={`-mb-1.5 ${sortConfig?.key === "role" && sortConfig.direction === "asc" ? "text-blue-600 opacity-100" : ""}`}
                    />
                    <Icon
                      icon="mdi:chevron-down"
                      className={`${sortConfig?.key === "role" && sortConfig.direction === "desc" ? "text-blue-600 opacity-100" : ""}`}
                    />
                  </div>
                </div>
              </th>
              <th className="px-6 py-4 text-nowrap font-semibold">
                Assessment Status
              </th>
              <th className="px-6 py-4 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((member, index) => {
                return (
                  <tr
                    key={member._id}
                    className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <span className="font-bold text-gray-800 tracking-tight text-nowrap">
                        {member.firstName === "-" ? (
                          <span className="text-gray-300 font-black">—</span>
                        ) : (
                          `${member.firstName} ${member.lastName}`
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-500">
                      {member.email}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-500">
                      {member.department || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-500">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="uppercase text-xs font-bold">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {renderAssessmentBadge(member.assessmentStatus)}
                    </td>
                    <td className="px-6 py-4 text-center relative">
                      {member.assessmentStatus === "Completed" ? (
                        <div className="flex justify-center">
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === member._id
                                  ? null
                                  : member._id,
                              )
                            }
                            className={`p-1.5 rounded-full transition-all ${activeDropdown === member._id ? "bg-[#448CD2] text-white shadow-md" : "text-neutral-800 hover:bg-slate-100"}`}
                          >
                            <Icon
                              icon="solar:menu-dots-bold"
                              width="16"
                              className="rotate-90"
                            />
                          </button>

                          {activeDropdown === member._id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setActiveDropdown(null)}
                              ></div>
                              <div className="absolute right-12 top-12 w-32 bg-white border border-gray-100 rounded-lg shadow-xl z-50  overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200  ring-1 ring-black/5">
                                <button
                                  onClick={() =>
                                    handleActionClick(member, "Report")
                                  }
                                  className="w-full px-4 py-2 text-sm font-medium text-neutral-700 flex items-center gap-1.5 bg-white hover:bg-neutral-100"
                                >
                                  <Icon
                                    icon="hugeicons:analysis-text-link"
                                    width="14"
                                    height="14"
                                  />

                                  <span>Report</span>
                                </button>
                                <button
                                  onClick={() =>
                                    handleActionClick(member, "Response")
                                  }
                                  className="w-full px-4 py-2 text-sm font-medium text-neutral-700 flex items-center gap-1.5 bg-white hover:bg-neutral-100"
                                >
                                  <Icon
                                    icon="mage:file-3"
                                    width="14"
                                    height="14"
                                  />
                                  <span>Response</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-300 italic text-xs">
                          No Actions
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-20 text-center text-gray-400">
                  {isLoading ? "Loading members..." : "No members found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={filteredMembers.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
};

export default OrgAssessmentDetails;
