import { Icon } from "@iconify/react";
import { useEffect, useState, useCallback } from "react";
import Pagination from "../Pagination";
import api from "../../services/axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [assessmentFilter, setAssessmentFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof UserMember;
    direction: "asc" | "desc";
  } | null>(null);

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
          className={`${base} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border justify-center bg-[#EEF7ED] text-[#3F9933] border-[#3F9933] dark:bg-[#163423] dark:text-[#8CDFAC] dark:border-[#2DA367]]`}
        >
          Completed
        </span>
      );
    } else if (status === "In Progress") {
      return (
        <span
          className={`${base} bg-blue-50 text-blue-600 border-blue-200 dark:bg-[#1b3650] dark:text-[#8cc3f6] dark:border-[#3f78ab]`}
        >
          In Progress
        </span>
      );
    } else if (status === "Due") {
      return (
        <span
          className={`${base} bg-amber-50 text-amber-600 border-amber-200 dark:bg-[#433718] dark:text-[#ffd27b] dark:border-[#8f7440]`}
        >
          Due
        </span>
      );
    } else {
      return (
        <span
          className={`${base} bg-gray-50 text-gray-400 border-gray-200 dark:bg-[#123049] dark:text-[#9cb8d2] dark:border-[var(--app-border-color)]`}
        >
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

  return (
    <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-152px)] dark:bg-[var(--app-surface)] dark:border-[var(--app-border-color)] dark:shadow-[0_14px_34px_rgba(0,0,0,0.26)] dark:text-[var(--app-text-color)]">
      {/* Header Section */}
      <div className="mb-8 bg-white relative overflow-hidden dark:bg-transparent">
        <div
          className="flex items-center gap-1.5 text-xs font-bold mb-6 cursor-pointer text-[#448CD2] transition-colors w-fit"
          onClick={() => navigate("/dashboard/org-assessments")}
        >
          <Icon icon="material-symbols:arrow-back-rounded" width="16" />
          <span className="uppercase tracking-wider">Back</span>
        </div>
        <h2 className="md:text-3xl text-2xl font-bold text-gray-800 mb-2 dark:text-[var(--app-heading-color)]">
          {details?.orgName || "Organization Details"}
        </h2>
        <p className="text-sm text-gray-500 mb-10 dark:text-[var(--app-text-muted)]">
          Track assessment completion and participant progress
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-200/25 border border-blue-200 rounded-xl p-4 dark:from-[#1b3650] dark:to-[#22486b] dark:border-[#3f78ab]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[var(--primary-color)] uppercase tracking-wider dark:text-[#8cc3f6]">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-[var(--primary-color)] mt-1 dark:text-[#d8ecff]">
                  {totalMembers}
                </p>
              </div>
              <div className="p-3 bg-blue-200/50 rounded-lg dark:bg-[#2d5a7f]">
                <Icon
                  icon="solar:users-group-rounded-bold"
                  className="text-[var(--primary-color)] dark:text-[#d5ebff]"
                  width="24"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-xl p-4 dark:from-[#1b3f33] dark:to-[#1f4e3d] dark:border-[#3c8a71]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider dark:text-[#95e7ba]">
                  Completed
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1 dark:text-[#dcffed]">
                  {completedMembers}
                </p>
              </div>
              <div className="p-3 bg-green-200/50 rounded-lg dark:bg-[#2d7058]">
                <Icon
                  icon="solar:check-circle-bold"
                  className="text-green-600 dark:text-[#defeee]"
                  width="24"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200 rounded-xl p-4 dark:from-[#433718] dark:to-[#55441d] dark:border-[#8f7440]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider dark:text-[#ffd27b]">
                  In Progress
                </p>
                <p className="text-2xl font-bold text-yellow-600 mt-1 dark:text-[#fff0cf]">
                  {inProgressMembers}
                </p>
              </div>
              <div className="p-3 bg-yellow-200/50 rounded-lg dark:bg-[#7f6b34]">
                <Icon
                  icon="solar:hourglass-bold"
                  className="text-yellow-600 dark:text-[#fff1d4]"
                  width="24"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 rounded-xl p-4 dark:from-[#4a2228] dark:to-[#5b2930] dark:border-[#9f4d5b]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider dark:text-[#ffb2bd]">
                  Due
                </p>
                <p className="text-2xl font-bold text-red-600 mt-1 dark:text-[#ffe2e6]">
                  {dueMembers}
                </p>
              </div>
              <div className="p-3 bg-red-200/50 rounded-lg dark:bg-[#7c3b46]">
                <Icon
                  icon="solar:bell-bold"
                  className="text-red-600 dark:text-[#ffe4ea]"
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
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#88a7c4]"
            width="20"
          />
          <input
            type="text"
            placeholder="Search by name, email, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#448CD2] focus:ring-1 focus:ring-[#448CD2] transition-all text-gray-700 dark:bg-[var(--app-surface-muted)] dark:border-[var(--app-border-color)] dark:text-[var(--app-text-color)] dark:placeholder:text-[#88a7c4]"
          />
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
      </div>

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
      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-[var(--app-border-color)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 dark:bg-[var(--app-surface-muted)] dark:border-[var(--app-border-color)]">
              <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">#</th>
              <th
                className="px-6 py-4 font-semibold dark:text-[#88a7c4]"
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
                className="px-6 py-4 font-semibold dark:text-[#88a7c4]"
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
              <th
                className="px-6 py-4 font-semibold dark:text-[#88a7c4]"
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
                className="px-6 py-4 font-semibold dark:text-[#88a7c4]"
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
              <th className="px-6 py-4 text-nowrap font-semibold dark:text-[#88a7c4]">
                Assessment Status
              </th>
              <th className="px-6 py-4 text-center font-semibold dark:text-[#88a7c4]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((member, index) => (
                <tr
                  key={member._id}
                  className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors dark:border-[var(--app-border-color)] dark:hover:bg-[rgba(121,186,240,0.08)]"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium dark:text-[var(--app-text-color)]">
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
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="uppercase text-xs font-bold dark:text-[var(--app-text-color)]">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {renderAssessmentBadge(member.assessmentStatus)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-gray-400 hover:text-[#448CD2] transition-colors dark:text-[#88a7c4] dark:hover:text-[#cbe4fb]">
                      <Icon icon="solar:eye-linear" width="16" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-20 text-center text-gray-400 dark:text-[#9cb8d2]"
                >
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
