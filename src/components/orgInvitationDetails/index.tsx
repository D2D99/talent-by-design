import { Icon } from "@iconify/react";
import { useEffect, useState, useCallback } from "react";
import Pagination from "../Pagination";
import api from "../../services/axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, Ripple, initTWE } from "tw-elements";

interface UserMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
  createdAt: string;
  status: string;
}

interface OrgDetails {
  orgName: string;
  createdAt: string;
  status: string;
  totalTeamMember: number;
}

const OrgInvitationDetails = () => {
  const { orgName: routeOrgName } = useParams();
  const navigate = useNavigate();

  const [members, setMembers] = useState<UserMember[]>([]);
  const [details, setDetails] = useState<OrgDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [roleFilter] = useState<string[]>([]);
  const [statusFilter] = useState<string[]>([]);

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
    initTWE({ Ripple, Modal });
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
      `${m.firstName} ${m.lastName} ${m.email} ${m.role} ${m.department || ""} ${m.status || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter.length === 0 || roleFilter.includes(m.role.toLowerCase());
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(m.status);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);

  const renderStatusBadge = (status: string) => {
    const base =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border justify-center";
    switch (status) {
      case "Accept":
        return (
          <span
            className={`${base} bg-[#EEF7ED] text-[#3F9933] border-[#3F9933] dark:bg-[#163423] dark:text-[#8CDFAC] dark:border-[#2DA367]`}
          >
            Accepted
          </span>
        );
      case "Expire":
        return (
          <span
            className={`${base} bg-[#FFEEEE] text-[#D71818] border-[#D71818] dark:bg-[#411F26] dark:text-[#FF9BAA] dark:border-[#E2687A]`}
          >
            Expired
          </span>
        );
      default:
        return (
          <span
            className={`${base} bg-[#FFF8EE] text-[#E39631] border-[#E39631] dark:bg-[#43361F] dark:text-[#FFD38A] dark:border-[#E0A84D]`}
          >
            Pending
          </span>
        );
    }
  };

  // Calculate stats (including admins)
  const membersList = members;
  const totalMembers = membersList.length;
  const acceptedMembers = membersList.filter(
    (m) => m.status === "Accept",
  ).length;
  const pendingMembers = membersList.filter(
    (m) => m.status === "Pending",
  ).length;
  const expiredMembers = membersList.filter(
    (m) => m.status === "Expire",
  ).length;

  return (
    <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-152px)] dark:bg-[var(--app-surface)] dark:border-[var(--app-border-color)] dark:shadow-[0_14px_34px_rgba(0,0,0,0.26)] dark:text-[var(--app-text-color)]">
      {/* Header Section */}
      <div className="mb-8 bg-white relative overflow-hidden dark:bg-transparent">
        <div
          className="flex items-center gap-1.5 text-xs font-bold mb-6 cursor-pointer text-[#448CD2] transition-colors w-fit"
          onClick={() => navigate("/dashboard/invite")}
        >
          <Icon icon="material-symbols:arrow-back-rounded" width="16" />
          <span className="uppercase tracking-wider">Back</span>
        </div>
        <h2 className="md:text-3xl text-2xl font-bold text-gray-800 mb-2 dark:text-[var(--app-heading-color)]">
          {details?.orgName || "Organization Details"}
        </h2>
        <p className="text-sm text-gray-500 mb-10 dark:text-[var(--app-text-muted)]">
          Manage invitation status and team members
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                  Accepted
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1 dark:text-[#dcffed]">
                  {acceptedMembers}
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
                  Pending
                </p>
                <p className="text-2xl font-bold text-yellow-600 mt-1 dark:text-[#fff0cf]">
                  {pendingMembers}
                </p>
              </div>
              <div className="p-3 bg-yellow-200/50 rounded-lg dark:bg-[#7f6b34]">
                <Icon
                  icon="solar:clock-circle-bold"
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
                  Expired
                </p>
                <p className="text-2xl font-bold text-red-600 mt-1 dark:text-[#ffe2e6]">
                  {expiredMembers}
                </p>
              </div>
              <div className="p-3 bg-red-200/50 rounded-lg dark:bg-[#7c3b46]">
                <Icon
                  icon="solar:close-circle-bold"
                  className="text-red-600 dark:text-[#ffe4ea]"
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
            autoComplete="off"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#448CD2] focus:ring-1 focus:ring-[#448CD2] transition-all text-gray-700 placeholder:text-gray-400 dark:bg-[var(--app-surface-muted)] dark:border-[var(--app-border-color)] dark:text-[var(--app-text-color)] dark:placeholder:text-[#88a7c4] dark:focus:border-[var(--primary-color)]"
          />
        </div>
        {/* <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border font-medium text-sm uppercase tracking-wider md:w-auto w-full ${
              showFilters
                ? "bg-[var(--primary-color)] text-white border-[var(--primary-color)]"
                : "bg-white text-blue-400 border-blue-200 hover:border-blue-300 dark:bg-[var(--app-surface)] dark:text-[#a5cdf3] dark:border-[var(--app-border-color)] dark:hover:border-[#79baf0]"
            }`}
          >
            <Icon icon="hugeicons:filter" width="16" height="16" />
            <span>Filters</span>
            {(statusFilter.length > 0 || roleFilter.length > 0) && (
              <span
                className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold transition-colors ml-1
                ${showFilters ? "bg-white text-[var(--primary-color)] dark:bg-[var(--app-surface-soft)] dark:text-[#d8ebff]" : "bg-[var(--primary-color)] text-white"}`}
              >
                {statusFilter.length + roleFilter.length}
              </span>
            )}
          </button>
        </div> */}
      </div>

      {/* {showFilters && (
        <div className="w-full md:w-80 bg-white shadow-[0_0_10px_rgba(68,140,210,0.4)] md:rounded-xl py-5 z-[55] md:absolute fixed md:top-16 top-1/2 right-0 md:translate-y-0 -translate-y-1/2 md:h-auto h-full dark:bg-[var(--app-surface)] dark:border dark:border-[var(--app-border-color)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.35)] transition-all animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex justify-between items-center mb-6 px-5 border-b pb-4 border-gray-100 dark:border-[var(--app-border-color)]/30">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-gray-800 dark:text-[var(--app-heading-color)]">
                Filters
              </h3>
              {(roleFilter.length > 0 || statusFilter.length > 0) && (
                <button
                  onClick={() => {
                    setRoleFilter([]);
                    setStatusFilter([]);
                  }}
                  className="text-[10px] font-bold text-blue-500 hover:text-blue-700 uppercase tracking-tighter bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 transition-colors dark:bg-[rgba(121,186,240,0.16)] dark:border-[rgba(121,186,240,0.35)] dark:text-[#cbe4fb]"
                >
                  Reset
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors dark:hover:bg-[var(--app-surface-soft)]"
            >
              <Icon icon="material-symbols:close" width="20" />
            </button>
          </div>

          <div className="px-5 space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 dark:text-[#88a7c4]">
                Staff Role
              </label>
              <div className="space-y-2.5 mt-2">
                {["leader", "manager", "employee", "admin"].map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center">
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
                        className="w-4.5 h-4.5 rounded border-gray-200 text-blue-600 focus:ring-blue-500/20 accent-blue-600 dark:border-[var(--app-border-color)] dark:bg-[var(--app-surface-muted)]"
                      />
                    </div>
                    <span
                      className={`text-sm capitalize transition-colors ${roleFilter.includes(r) ? "text-blue-600 font-bold dark:text-[#cbe4fb]" : "text-gray-500 dark:text-[var(--app-text-muted)]"}`}
                    >
                      {r}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <FilterSection title="Invitation Status" open>
              <div className="space-y-2.5 mt-2">
                {["Accept", "Pending", "Expire"].map((s) => (
                  <label
                    key={s}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={statusFilter.includes(s)}
                        onChange={() => {
                          setStatusFilter((prev) =>
                            prev.includes(s)
                              ? prev.filter((x) => x !== s)
                              : [...prev, s],
                          );
                        }}
                        className="w-4.5 h-4.5 rounded border-gray-200 text-blue-600 focus:ring-blue-500/20 accent-blue-600 dark:border-[var(--app-border-color)] dark:bg-[var(--app-surface-muted)]"
                      />
                    </div>
                    <span
                      className={`text-sm transition-colors ${statusFilter.includes(s) ? "text-blue-600 font-bold dark:text-[#cbe4fb]" : "text-gray-500 dark:text-[var(--app-text-muted)]"}`}
                    >
                      {s === "Accept"
                        ? "Accepted"
                        : s === "Expire"
                          ? "Expired"
                          : "Pending"}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>
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
                      className={`-mb-1.5 ${sortConfig?.key === "firstName" && sortConfig?.direction === "asc" ? "text-blue-600 opacity-100" : ""}`}
                    />
                    <Icon
                      icon="mdi:chevron-down"
                      className={`${sortConfig?.key === "firstName" && sortConfig?.direction === "desc" ? "text-blue-600 opacity-100" : ""}`}
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
                  <div className="flex flex-col opacity-75 size-5">
                    <Icon
                      icon="mdi:chevron-up"
                      className={`-mb-1.5 ${sortConfig?.key === "email" && sortConfig?.direction === "asc" ? "text-blue-600 opacity-100" : ""}`}
                    />
                    <Icon
                      icon="mdi:chevron-down"
                      className={`${sortConfig?.key === "email" && sortConfig?.direction === "desc" ? "text-blue-600 opacity-100" : ""}`}
                    />
                  </div>
                </div>
              </th>
              <th
                className="px-6 py-4 font-semibold dark:text-[#88a7c4]"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center justify-between">
                  <span>Created Date</span>
                  <div className="flex flex-col opacity-75 size-5">
                    <Icon
                      icon="mdi:chevron-up"
                      className={`-mb-1.5 ${sortConfig?.key === "createdAt" && sortConfig?.direction === "asc" ? "text-blue-600 opacity-100" : ""}`}
                    />
                    <Icon
                      icon="mdi:chevron-down"
                      className={`${sortConfig?.key === "createdAt" && sortConfig?.direction === "desc" ? "text-blue-600 opacity-100" : ""}`}
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
                  <div className="flex flex-col opacity-75 size-5">
                    <Icon
                      icon="mdi:chevron-up"
                      className={`-mb-1.5 ${sortConfig?.key === "role" && sortConfig?.direction === "asc" ? "text-blue-600 opacity-100" : ""}`}
                    />
                    <Icon
                      icon="mdi:chevron-down"
                      className={`${sortConfig?.key === "role" && sortConfig?.direction === "desc" ? "text-blue-600 opacity-100" : ""}`}
                    />
                  </div>
                </div>
              </th>
              <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">
                Invitation Status
              </th>
              <th className="px-6 text-center py-4 font-semibold dark:text-[#88a7c4]">
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
                    {renderStatusBadge(member.status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      disabled
                      className="p-2 rounded-full transition-all text-gray-300 cursor-not-allowed opacity-50"
                    >
                      <Icon icon="si:bin-line" width="16" height="16" />
                    </button>
                  </td>
                </tr>
              ))
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

export default OrgInvitationDetails;

