import { Icon } from "@iconify/react";
import { useEffect, useState, useCallback } from "react";
import Pagination from "../Pagination";
import { Modal, Ripple, initTWE } from "tw-elements";
import axios from "axios";

const OrgInvitation = () => {
  // --- States ---
  const [dataList, setDataList] = useState<any[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Form States (Modal)
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const isSuperAdmin = currentUserRole === "superadmin";

  // --- Initial Setup ---
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

  // --- API Functions ---
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}auth/invitations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setDataList(res.data);
      setTotalItems(res.data.length);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSendInvite = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !email || !role) {
      setErrorMessage("Please fill all fields.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}auth/send-invitation`,
        { email, role },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setEmail("");
      setRole("");

      const modalElem = document.getElementById("inviteModal");
      const modalInstance = Modal.getInstance(modalElem);
      modalInstance?.hide();

      fetchData();
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to send.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- DELETE FUNCTION (With Logic Check) ---
  const handleDelete = async (id: string, status: string) => {
    // Extra safety check: Prevent deletion if not Expired
    if (status !== "Expire") return;

    if (
      !window.confirm(
        "Are you sure you want to delete this expired invitation?",
      )
    )
      return;

    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}auth/invitation/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchData(); // Refresh list
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to delete.");
    }
  };

  // --- Helper Functions ---
  const renderStatusBadge = (status: string) => {
    const base =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border justify-center";
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
        <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[0px_0px_5px_0px_#4B9BE980] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-180px)]">
          <div className="grid">
            {/* Header Section */}
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
                className="text-white rounded-full py-2 px-4 flex items-center gap-2 font-semibold text-sm uppercase bg-gradient-to-r from-[#1A3652] to-[#448CD2] shadow-lg transition-all"
              >
                <Icon icon="material-symbols:add-rounded" width="22" />
                {isSuperAdmin ? "Add New Organization" : "Invite New User"}
              </button>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full whitespace-nowrap border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100 bg-gray-50/50 text-left">
                    <th className="px-6 py-4 font-semibold">#</th>
                    <th className="px-6 py-4 font-semibold">
                      {isSuperAdmin ? "Organization" : "Full Name"}
                    </th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Created Date</th>
                    <th className="px-6 py-4 font-semibold">
                      {isSuperAdmin ? "Total Users" : "Assigned Role"}
                    </th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataList.length > 0 ? (
                    dataList.map((item, index) => {
                      // Logic to determine if button should be disabled
                      const canDelete = item.status === "Expire";

                      return (
                        <tr
                          key={item._id}
                          className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-[#1A3652]">
                            {isSuperAdmin
                              ? item.orgName || "Unnamed Org"
                              : item.name || "—"}
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
                              <span className="capitalize px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                                {item.role}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {renderStatusBadge(item.status)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() =>
                                handleDelete(item._id, item.status)
                              }
                              disabled={!canDelete}
                              title={
                                !canDelete
                                  ? "Only expired invitations can be deleted"
                                  : "Delete Invitation"
                              }
                              className={`p-2 rounded-full transition-all ${
                                canDelete
                                  ? "text-red-400 hover:text-red-600 hover:bg-red-50"
                                  : "text-gray-300 cursor-not-allowed opacity-50"
                              }`}
                            >
                              <Icon
                                icon="solar:trash-bin-trash-bold"
                                width="20"
                              />
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

            {/* Pagination Section */}
            {/* <div className="mt-6">
            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(val) => {
                setItemsPerPage(val);
                setCurrentPage(1);
              }}
            />
          </div> */}
          </div>
        </div>

        {/* --- Invite Modal --- */}
        {/* <div
          data-twe-modal-init
          className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto outline-none"
          id="inviteModal"
          tabIndex={-1}
        >
          <div
            data-twe-modal-dialog-ref
            className="relative flex min-h-[calc(100%-1rem)] w-auto items-center max-w-xl mx-auto p-4 transition-all"
          >
            <div className="bg-white w-full rounded-3xl shadow-2xl flex flex-col p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h5 className="text-2xl font-bold text-[#1A3652]">
                    {isSuperAdmin
                      ? "New Organization Admin"
                      : "Invite Team Member"}
                  </h5>
                  <p className="text-sm text-gray-500">
                    Access will be sent via email.
                  </p>
                </div>
                <button
                  data-twe-modal-dismiss
                  className="text-gray-400 hover:text-black p-2 bg-gray-50 rounded-full"
                >
                  <Icon icon="material-symbols:close" width="24" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[#1A3652] mb-2 uppercase tracking-widest">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full p-4 border-2 border-[#F3F4F6] rounded-2xl outline-none focus:border-[#448CD2] bg-[#F9FAFB] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A3652] mb-2 uppercase tracking-widest">
                    Select Permission Level
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-4 border-2 border-[#F3F4F6] rounded-2xl outline-none focus:border-[#448CD2] bg-[#F9FAFB] transition-all capitalize"
                  >
                    <option value="">Select a role...</option>
                    {isSuperAdmin ? (
                      <option value="admin">Admin (Full Org Access)</option>
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

              <div className="flex justify-end gap-3 mt-10">
                <button
                  data-twe-modal-dismiss
                  className="px-8 py-3 rounded-full font-bold text-gray-500 hover:bg-gray-100 transition-all uppercase text-xs tracking-widest"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendInvite}
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-[#1A3652] to-[#448CD2] text-white rounded-full font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50 uppercase text-xs tracking-widest"
                >
                  {isLoading ? "Sending..." : "Send Invitation"}
                </button>
              </div>
            </div>
          </div>
        </div> */}

        <div
          data-twe-modal-init
          className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
          id="inviteModal"
          tabIndex={-1}
          aria-labelledby="inviteModalTitle"
          aria-modal="true"
          role="dialog"
          data-twe-backdrop="static"
          data-twe-keyboard="false"
          aria-hidden="true"
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
                  className="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none"
                  data-twe-modal-dismiss
                  aria-label="Close"
                >
                  <span className="[&>svg]:h-6 [&>svg]:w-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </span>
                </button>
              </div>

              <div className="relative sm:py-8 py-4 px-4">
                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="email"
                    className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className={`font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)]`}
                    placeholder="Enter email"
                  />
                </div>

                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="role"
                    className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
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
                      className={`font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]`}
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
                  className="group text-[var(--primary-color)] pl-4 py-2 h-10 pr-2 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase   hover:opacity-100 duration-200"
                  data-twe-modal-dismiss
                  data-twe-ripple-init
                  data-twe-ripple-color="light"
                >
                  Cancel
                  <Icon
                    icon="mynaui:arrow-right-circle-solid"
                    width="25"
                    height="25"
                    className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                  />
                </button>

                <button
                  type="button"
                  className="group text-[var(--white-color)] pl-4 h-10 pr-2 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:pointer-events-none disabled:opacity-40"
                >
                  Send Invite
                  <Icon
                    icon="mynaui:arrow-right-circle-solid"
                    width="25"
                    height="25"
                    className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message Toast */}
        {errorMessage && (
          <div className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-[9999] flex items-center gap-4 animate-bounce">
            <Icon icon="solar:danger-bold" width="24" />
            <span className="font-semibold">{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="ml-2 bg-white/20 rounded-full p-1 hover:bg-white/40"
            >
              <Icon icon="material-symbols:close" width="18" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default OrgInvitation;
