import { Icon } from "@iconify/react";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import { Modal, Ripple, initTWE } from "tw-elements";
import api from "../../services/axios";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const ProgressIcon = "/static/img/home/progress-icon.png";

// Defined Interface
interface Invitation {
  _id: string;
  orgName?: string;
  name?: string;
  email: string;
  createdAt: string;
  totalUsers?: number;
  role: string;
  status: string;
}

const OrgInvitation = () => {
  // --- States ---
  const [dataList, setDataList] = useState<Invitation[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);


  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");

  // New state to track which item is being deleted
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const isSuperAdmin = currentUserRole === "superadmin";

  const sortedData = [...dataList].filter(item => {
    const matchesSearch =
      (item.orgName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(item.status);

    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    initTWE({ Ripple, Modal });

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUserRole(parsedUser.role?.toLowerCase());
      } catch (err) {
        console.error("Error parsing user data", err);
      }
    }
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get<Invitation[]>("auth/invitations");
      setDataList(res.data);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      // Only show error if it's not a session expiry (401)
      if (error.response?.status !== 401) {
        const message = error.response?.data?.message || "Failed to load invitations.";
        if (message.includes(",")) {
          message.split(",").forEach((msg: string) => toast.error(msg.trim()));
        } else {
          toast.error(message);
        }
      }


    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

      const modalElem = document.getElementById("inviteModal");
      const modalInstance = Modal.getInstance(modalElem);
      modalInstance?.hide();

      toast.success(isSuperAdmin ? "Organization added successfully!" : "Invitation sent successfully!");
      fetchData();
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response?.status !== 401) {
        const message = error.response?.data?.message || "Failed to send invitation.";
        if (message.includes(",")) {
          message.split(",").forEach((msg: string) => toast.error(msg.trim()));
        } else {
          toast.error(message);
        }
      }

    } finally {

      setIsLoading(false);
    }
  };

  // Triggered when clicking the trash icon in the table
  const openDeleteModal = (id: string, status: string) => {
    if (status !== "Expire") return;
    setSelectedId(id);

    // The data-twe-target on the button usually handles opening,
    // but we ensure the ID is set first.
  };

  // Triggered when clicking "Delete" inside the actual Modal
  const confirmDelete = async () => {
    if (!selectedId) return;

    setIsLoading(true);
    try {
      await api.delete(`auth/invitation/${selectedId}`);

      // Close the modal
      const modalElem = document.getElementById("deleteModal");
      const modalInstance = Modal.getInstance(modalElem);
      modalInstance?.hide();

      toast.success("Invitation deleted successfully.");
      fetchData();
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response?.status !== 401) {
        toast.error(error.response?.data?.message || "Failed to delete invitation.");
      }
    } finally {

      setIsLoading(false);
      setSelectedId(null);
    }
  };

  const renderStatusBadge = (status: string) => {
    const base =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border justify-center";
    switch (status) {
      case "Accept":
        return (
          <span
            className={`${base} bg-[#EEF7ED] text-[#3F9933] border-[#3F9933]`}
          >
            Accepted
          </span>
        );
      case "Expire":
        return (
          <span
            className={`${base} bg-[#FFEEEE] text-[#D71818] border-[#D71818]`}
          >
            Expired
          </span>
        );
      default:
        return (
          <span
            className={`${base} bg-[#FFF8EE] text-[#E39631] border-[#E39631]`}
          >
            Pending
          </span>
        );
    }
  };

  return (
    <>
      <div>
        <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-152px)]">
          <div className="grid">
            <div className="flex items-center md:justify-between gap-4 flex-wrap mb-8">
              <div>
                <h2 className="md:text-2xl text-xl font-bold">
                  {isSuperAdmin
                    ? "Organization Management"
                    : "Team Member Management"}
                </h2>
                <p className="text-sm text-gray-500 md:mt-1">
                  {isSuperAdmin
                    ? "Manage all client organizations and their admins."
                    : "Invite and manage your organization team."}
                </p>
              </div>
              <button
                type="button"
                data-twe-toggle="modal"
                data-twe-target="#inviteModal"
                className="relative overflow-hidden z-0 text-[var(--white-color)] ps-2.5 pe-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                <Icon icon="material-symbols:add-rounded" width="22" />
                {isSuperAdmin ? "Add New Organization" : "Invite New User"}
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Icon icon="tabler:search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" />
                <input
                  type="text"
                  placeholder={isSuperAdmin ? "Search organizations, emails..." : "Search members, emails..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border  rounded-lg outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${showFilters || statusFilter.length > 0
                    ? "bg-blue-50 border-blue-200 text-blue-600 font-bold"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Icon icon="mi:filter" width="18" />
                  <span>Filters</span>
                  {statusFilter.length > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full ml-1">{statusFilter.length}</span>
                  )}
                </button>
              </div>
            </div>

            {/* --- FILTER SIDEBAR --- */}
            {showFilters && (
              <div className="absolute right-0 top-32 w-72 bg-white shadow-2xl rounded-xl border border-gray-100 z-50 p-5 transform transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-800">Filters</h3>
                    {statusFilter.length > 0 && (
                      <button
                        onClick={() => setStatusFilter([])}
                        className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold uppercase"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                    <Icon icon="material-symbols:close" width="20" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Status Filter Component */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Status</label>
                    <div className="space-y-2">
                      {["Accept", "Pending", "Expire"].map((s) => (
                        <label key={s} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={statusFilter.includes(s)}
                            onChange={() => {
                              setStatusFilter(prev =>
                                prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
                              );
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={`text-sm ${statusFilter.includes(s) ? "text-blue-600 font-bold" : "text-gray-600"}`}>
                            {s === "Accept" ? "Accepted" : s === "Expire" ? "Expired" : "Pending"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto rounded-xl">
              <table className="w-full whitespace-nowrap border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100 bg-gray-50/50 text-left">
                    <th className="px-6 py-4 font-semibold">#</th>
                    <th className="px-6 py-4 font-semibold">
                      {isSuperAdmin ? "Organization" : "Name"}
                    </th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Created Date</th>
                    <th className="px-6 py-4 font-semibold">
                      {isSuperAdmin ? "Total Users" : "Role"}
                    </th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((item, index) => {
                      const canDelete = item.status === "Expire";
                      return (
                        <tr
                          key={item._id}
                          className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">
                            {isSuperAdmin ? (
                              <Link
                                to={`/dashboard/organization/${item.orgName}`}
                                className="text-[#448CD2] hover:underline font-bold"
                              >
                                {item.orgName || "Unnamed Org"}
                              </Link>
                            ) : (
                              item.name || "—"
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {item.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-GB",
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs">
                            {isSuperAdmin ? (
                              <div className="flex items-center gap-2 bg-blue-50 text-[#448CD2] px-2 py-1 rounded-lg w-fit border border-blue-100">
                                <Icon
                                  icon="solar:users-group-rounded-bold"
                                  width="12"
                                />
                                <span className="font-bold">
                                  {item.totalUsers || 0}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500 capitalize">
                                {item.role}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {renderStatusBadge(item.status)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              data-twe-toggle="modal"
                              data-twe-target="#deleteModal"
                              onClick={() =>
                                openDeleteModal(item._id, item.status)
                              }
                              disabled={!canDelete}
                              className={`p-2 rounded-full transition-all ${canDelete
                                ? "text-red-600 hover:bg-red-50"
                                : "text-gray-300 cursor-not-allowed opacity-50"
                                }`}
                            >
                              <Icon icon="si:bin-line" width="16" height="16" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-20 text-gray-400"
                      >
                        {isLoading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#448CD2]"></div>
                            <span>Loading records...</span>
                          </div>
                        ) : (
                          "No invitations found."
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              totalItems={dataList.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </div>

        {/* --- Invite Modal --- */}
        <div
          data-twe-modal-init
          className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
          id="inviteModal"
          tabIndex={-1}
          aria-labelledby="inviteModalTitle"
          aria-modal="true"
          role="dialog"
          data-twe-backdrop="static"
        >
          <div
            data-twe-modal-dialog-ref
            className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-xl mx-auto"
          >
            <div className="mx-3 pointer-events-auto relative flex max-w-xl w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none">
              <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 sm:pb-0 pb-2">
                <h5
                  className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold"
                  id="inviteModalTitle"
                >
                  {isSuperAdmin ? "Add New Organization" : "Add New Member"}
                </h5>
                <button
                  type="button"
                  data-twe-modal-dismiss
                  className="text-neutral-500 hover:text-neutral-800"
                >
                  <Icon icon="material-symbols:close" width="24" />
                </button>
              </div>

              <div className="relative sm:py-8 py-4 px-4">
                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="email"
                    className="font-bold text-[var(--secondary-color)] text-sm"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="invitation-email-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    autoComplete="new-password"
                    readOnly
                    className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg outline-none border-[#E8E8E8] focus:border-[var(--primary-color)] focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] transition-all"
                    placeholder="Enter email"
                  />
                </div>

                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="role"
                    className="font-bold text-[var(--secondary-color)] text-sm"
                  >
                    Role
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 top-2 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-[#5D5D5D]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="font-medium text-sm appearance-none text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg outline-none border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    >
                      <option value="">Select a role...</option>
                      {isSuperAdmin ? (
                        <option value="admin">Admin</option>
                      ) : (
                        <>
                          <option value="leader">Leader</option>
                          <option value="manager">Manager</option>
                          <option value="employee">Employee</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-neutral-200 py-4 px-4">
                <button
                  type="button"
                  data-twe-modal-dismiss
                  className="group text-[var(--primary-color)] px-5 py-2 h-10 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase relative overflow-hidden z-0 duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/10 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendInvite}
                  disabled={isLoading}
                  className="group relative overflow-hidden z-0 text-[var(--white-color)] px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
                >
                  {isLoading ? "Sending..." : "Send Invite"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Delete Modal --- */}
        <div
          data-twe-modal-init
          className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
          id="deleteModal"
          tabIndex={-1}
          aria-labelledby="deleteModalTitle"
          aria-modal="true"
          role="dialog"
          data-twe-backdrop="static"
        >
          <div
            data-twe-modal-dialog-ref
            className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-xl mx-auto"
          >
            <div className="mx-3 pointer-events-auto relative flex max-w-xl w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none">
              <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 sm:pb-0 pb-2">
                <h5
                  className="sm:text-xl text-lg text-[var(--secondary-color)] invisible font-bold"
                  id="deleteModalTitle"
                >
                  Delete
                </h5>
                <button
                  type="button"
                  data-twe-modal-dismiss
                  className="text-neutral-500 hover:text-neutral-800"
                >
                  <Icon icon="material-symbols:close" width="24" />
                </button>
              </div>

              <div className="relative sm:py-8 py-4 px-4 grid place-items-center gap-4">
                <img src={ProgressIcon} alt="Progress Icon" width={80} />
                <div className="text-center">
                  <h5 className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold">
                    Are you sure to delete the user?
                  </h5>
                  <p className="text-sm text-neutral-600">
                    This action is permanent and the data cannot be retrieved.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-neutral-200 py-4 px-4">
                <button
                  type="button"
                  data-twe-modal-dismiss
                  className="group text-[var(--primary-color)] px-5 py-2 h-10 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase relative overflow-hidden z-0 duration-200 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/10 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isLoading}
                  className="group relative overflow-hidden z-0 bg-red-500 px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase text-white duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-white/15 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Toaster removed, using react-toastify */}
      </div>
    </>

  );
};

export default OrgInvitation;
