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
  assessmentStatus?: string;
}

interface OrgDetails {
  orgName: string;
  createdAt: string;
  status: string;
  totalTeamMember: number;
}

interface OrgUsersProps {
  isEmbedded?: boolean;
  showStatusSection?: boolean;
  isAdminView?: boolean;
  hideAdmin?: boolean;
}

const OrgUsers = ({
  isEmbedded = false,
  showStatusSection,
  hideAdmin = true,
}: OrgUsersProps) => {
  const { orgName: routeOrgName } = useParams();
  const navigate = useNavigate();

  const [members, setMembers] = useState<UserMember[]>([]);
  const [details, setDetails] = useState<OrgDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const [sortConfig, setSortConfig] = useState<{
    key: keyof UserMember;
    direction: "asc" | "desc";
  } | null>(null);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      let targetOrg = routeOrgName;
      if (!targetOrg) {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          targetOrg = parsed.orgName;
        }

        if (!targetOrg) {
          const profileRes = await api.get("auth/me");
          targetOrg = profileRes.data.orgName;
        }
      }

      if (!targetOrg) {
        toast.error("Organization not found");
        return;
      }

      const res = await api.get<{ details: OrgDetails; members: UserMember[] }>(
        `auth/organization/${targetOrg}`,
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
    // Exclude admins and only show accepted members
    if (hideAdmin && m.role.toLowerCase() === "admin") return false;
    if (m.status !== "Accept") return false;

    const matchesSearch =
      `${m.firstName} ${m.lastName} ${m.email} ${m.role} ${m.department || ""} ${m.assessmentStatus || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter.length === 0 || roleFilter.includes(m.role.toLowerCase());

    return matchesSearch && matchesRole;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);
  const showStatusColumn = showStatusSection ?? true;

  const handleSendInvite = async () => {
    if (!email || !role) {
      toast.warn("Please fill all fields.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("auth/send-invitation", { email, role });

      setEmail("");
      setRole("");

      const modalElem = document.getElementById("userInviteModal");
      const modalInstance = Modal.getInstance(modalElem);
      modalInstance?.hide();

      toast.success("Invitation sent successfully!");
      fetchMembers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send invitation.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats (excluding admins)
  const nonAdminMembers = members.filter((m) =>
    hideAdmin ? m.role.toLowerCase() !== "admin" : true,
  );
  const totalUsers = nonAdminMembers.length;
  const acceptedUsers = nonAdminMembers.filter(
    (m) => m.status === "Accept",
  ).length;
  const pendingUsers = nonAdminMembers.filter(
    (m) => m.status === "Pending",
  ).length;
  const expiredUsers = nonAdminMembers.filter(
    (m) => m.status === "Expire",
  ).length;

  return (
    <div
      className={`${isEmbedded ? "" : "bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-162px)] dark:bg-[var(--app-surface)] dark:border-[var(--app-border-color)] dark:shadow-[0_14px_34px_rgba(0,0,0,0.26)] dark:text-[var(--app-text-color)]"}`}
    >
      {!isEmbedded && (
        <div className="mb-8 bg-white relative overflow-hidden dark:bg-transparent">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              {/* <div
                className="flex items-center gap-1.5 text-xs font-bold mb-6 cursor-pointer text-[#448CD2] transition-colors w-fit"
                onClick={() => navigate(-1)}
              >
                <Icon icon="material-symbols:arrow-back-rounded" width="16" />
                <span className="uppercase tracking-wider">Back</span>
              </div> */}
              <h2 className="md:text-3xl text-2xl font-bold text-gray-800 dark:text-[var(--app-heading-color)]">
                {details?.orgName || "Organization Users"}
              </h2>
              <p className="text-sm text-gray-500 mt-1 mb-6 dark:text-[var(--app-text-muted)]">
                Manage and monitor all users in your organization
              </p>
            </div>

            <button
              type="button"
              data-twe-toggle="modal"
              data-twe-target="#userInviteModal"
              className="group hidden relative overflow-hidden z-0 text-[var(--white-color)] ps-2.5 pe-5 h-10 rounded-full  justify-center items-center gap-1.5 font-semibold text-base uppercase bg-[var(--primary-color)] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
            >
              <Icon icon="material-symbols:add-rounded" width="22" />
              Invite New User
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-200/25 border border-blue-200 rounded-xl p-4 dark:from-[#1b3650] dark:to-[#22486b] dark:border-[#3f78ab]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[var(--primary-color)] uppercase tracking-wider dark:text-[#8cc3f6]">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-[var(--primary-color)] mt-1 dark:text-[#d8ecff]">
                    {totalUsers}
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
                    {acceptedUsers}
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
                    {pendingUsers}
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
                    {expiredUsers}
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
      )}

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
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] text-gray-700 dark:bg-[var(--app-surface-muted)] dark:border-[var(--app-border-color)] dark:text-[var(--app-text-color)] dark:placeholder:text-[#88a7c4]"
          />
        </div>
        {/* <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm uppercase tracking-wider border transition-all md:w-auto w-full ${
              showFilters
                ? "bg-[var(--primary-color)] text-white"
                : "bg-white text-blue-400 border-blue-200 hover:border-blue-300 dark:bg-[var(--app-surface)] dark:text-[#a5cdf3] dark:border-[var(--app-border-color)] dark:hover:border-[#79baf0]"
            }`}
          >
            <Icon icon="hugeicons:filter" width="16" height="16" />
            <span>Filters</span>
            {roleFilter.length > 0 && (
              <span
                className={`flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold transition-colors ml-1
                ${showFilters ? "bg-white text-[var(--primary-color)] dark:bg-[var(--app-surface-soft)] dark:text-[#d8ebff]" : "bg-[var(--primary-color)] text-white"}`}
              >
                {roleFilter.length}
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
              {roleFilter.length > 0 && (
                <button
                  onClick={() => setRoleFilter([])}
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

          <div className="px-5">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 dark:text-[#88a7c4]">
              Staff Role
            </label>
            <div className="space-y-2.5 mt-2">
              {["leader", "manager", "employee"].map((r) => (
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
        </div>
      )} */}

      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-[var(--app-border-color)] border-b-0">
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
                  <Icon
                    icon="mdi:chevron-up-down"
                    className="opacity-75 size-3.5"
                  />
                </div>
              </th>
              <th
                className="px-6 py-4 font-semibold dark:text-[#88a7c4]"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center justify-between">
                  <span>Email</span>
                  <Icon
                    icon="mdi:chevron-up-down"
                    className="opacity-75 size-3.5"
                  />
                </div>
              </th>
              <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">
                Added On
              </th>
              <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">
                Role
              </th>
              {showStatusColumn && (
                <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">
                  Status
                </th>
              )}
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
                  {showStatusColumn && (
                    <td className="px-6 py-4">
                      {member.status === "Accept" ? (
                        <span className="bg-[#EEF7ED] text-[#3F9933] border-[#3F9933] dark:bg-[#163423] dark:text-[#8CDFAC] dark:border-[#2DA367 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border justify-center">
                          Accepted
                        </span>
                      ) : member.status === "Pending" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-50 text-yellow-500 border border-yellow-200 inline-flex items-center text-xs justify-center">
                          Pending
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-500 border border-red-200 uppercase tracking-wider inline-flex items-center text-xs justify-center">
                          Expired
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-20 text-center text-gray-400 dark:text-[#9cb8d2]"
                >
                  {isLoading ? "Loading directory..." : "No members found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Pagination
          totalItems={filteredMembers.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {/* Invite Modal */}
      <div
        data-twe-modal-init
        className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="userInviteModal"
        tabIndex={-1}
        data-twe-backdrop="static"
      >
        <div
          data-twe-modal-dialog-ref
          className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-xl mx-auto"
        >
          <div className="mx-3 pointer-events-auto relative flex w-full flex-col rounded-[24px] border-none bg-white bg-clip-padding text-current shadow-2xl outline-none overflow-hidden dark:bg-[var(--app-surface)] dark:text-[var(--app-text-color)]">
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-[var(--app-border-color)]">
              <h5 className="text-xl font-bold leading-normal text-neutral-800 dark:text-[var(--app-heading-color)]">
                Invite New Member
              </h5>
              <button
                type="button"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                data-twe-modal-dismiss
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="relative p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-[var(--app-text-muted)]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] dark:bg-[var(--app-surface-muted)] dark:border-[var(--app-border-color)] dark:text-[var(--app-text-color)]"
                  placeholder="e.g. user@example.com"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-[var(--app-text-muted)]">
                  Assigned Role
                </label>
                <select
                  value={role}
                  autoComplete="off"
                  onChange={(e) => setRole(e.target.value)}
                  className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] dark:bg-[var(--app-surface-muted)] dark:border-[var(--app-border-color)] dark:text-[var(--app-text-color)]"
                >
                  <option value="">Select a role...</option>
                  <option value="leader">Team Leader</option>
                  <option value="manager">Department Manager</option>
                  <option value="employee">Team Associate</option>
                </select>
              </div>
            </div>
            <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 gap-2 dark:border-[var(--app-border-color)]">
              <button
                type="button"
                data-twe-modal-dismiss
                className="group text-[var(--primary-color)] px-5 py-2 h-10 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase relative overflow-hidden z-0 duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendInvite}
                disabled={isLoading}
                className="group relative overflow-hidden z-0 text-[var(--white-color)] px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40"
              >
                {isLoading ? "Wait..." : "Send Invitation"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgUsers;
