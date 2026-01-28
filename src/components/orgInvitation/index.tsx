import { Icon } from "@iconify/react";
import { useEffect, useState, useCallback } from "react";
import Pagination from "../Pagination";
import { Modal, Ripple, initTWE } from "tw-elements";
import axios from "axios";

const OrgInvitation = () => {
  // States
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

  // --- Initial Setup ---
  useEffect(() => {
    initTWE({ Ripple, Modal });

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // We normalize to lowercase to make logic checks easier
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
      // Backend returns the formattedData array we built earlier
      setDataList(res.data);
      setTotalItems(res.data.length);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setErrorMessage(err.response?.data?.message || "Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on load and whenever a new invite is sent
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

      alert("Invitation sent successfully!");
      setEmail("");
      setRole("");

      // Close modal (standard way for TW-Elements)
      const modalElem = document.getElementById("inviteModal");
      const modalInstance = Modal.getInstance(modalElem);
      modalInstance?.hide();

      // Refresh table data
      fetchData();
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to send.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Helper Functions ---
  const renderStatusBadge = (status: string) => {
    const base =
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border justify-center";
    switch (status) {
      case "Accept":
        return (
          <span
            className={`${base} bg-[#EEF7ED] text-[#3F9933] border-[#3F9933]`}
          >
            Accept
          </span>
        );
      case "Expire":
        return (
          <span
            className={`${base} bg-[#FFEEEE] text-[#D71818] border-[#D71818]`}
          >
            Expire
          </span>
        );
      case "Pending":
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

  const isSuperAdmin = currentUserRole === "superadmin";

  return (
    <div>
      <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[0px_0px_5px_0px_#4B9BE980] sm:p-6 p-3 rounded-[12px] mt-6">
        {/* Header Section */}
        <div className="flex items-center md:justify-between justify-center gap-3 flex-wrap mb-8">
          <h2 className="text-2xl font-bold text-[#1A3652]">
            {isSuperAdmin
              ? "Organization Management"
              : "Team Member Management"}
          </h2>
          <button
            type="button"
            data-twe-toggle="modal"
            data-twe-target="#inviteModal"
            className="text-white rounded-full py-2.5 px-6 flex items-center gap-2 font-semibold text-sm uppercase bg-gradient-to-r from-[#1A3652] to-[#448CD2] shadow-md hover:opacity-90 transition-all"
          >
            <Icon icon="material-symbols:add-rounded" width="22" />
            {isSuperAdmin ? "Add New Organization" : "Invite New User"}
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <div className="shadow-sm overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="border-b border-[var(--light-primary-color)]">
                  <th className="px-6 py-2.5 text-left text-base font-semibold text-[#000000]">
                    #
                  </th>
                  <th className="px-6 py-2.5 text-left text-base font-semibold text-[#000000]">
                    {isSuperAdmin ? "Org Name" : "Name / Email"}
                  </th>
                  <th className="px-6 py-2.5 text-left text-base font-semibold text-[#000000]">
                    Role
                  </th>
                  <th className="px-6 py-2.5 text-left text-base font-semibold text-[#000000]">
                    Start Date
                  </th>
                  <th className="px-6 py-2.5 text-left text-base font-semibold text-[#000000]">
                    Status
                  </th>
                  <th className="px-6 py-2.5 text-left text-base font-semibold text-[#000000]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataList.length > 0 ? (
                  dataList.map((item, index) => (
                    <tr
                      key={item._id}
                      className="border-b border-[var(--light-primary-color)] hover:bg-[#448bd20f]"
                    >
                      <td className="px-6 py-2.5 text-left text-sm font-semibold text-[#000000]">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-2.5 text-left text-sm font-normal text-[#000000]">
                        {isSuperAdmin ? item.orgName || "No Name" : item.email}
                      </td>
                      <td className="px-6 py-2.5 text-left text-sm font-normal text-[#000000]">
                        {item.role}
                      </td>
                      <td className="px-6 py-2.5 text-left text-sm font-normal text-[#000000]">
                        {new Date(item.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-6 py-2.5 text-left text-sm font-normal text-[#000000]">
                        {renderStatusBadge(item.status)}
                      </td>
                      <td className="pe-6 ps-9 py-2.5">
                        <button className="text-red-500 hover:text-red-700 transition-colors">
                          <Icon icon="la:trash-alt-solid" width="18" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-gray-400">
                      {isLoading ? "Fetching data..." : "No invitations found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Section */}
        <div className="mt-6">
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
        </div>
      </div>

      {/* --- Invite Modal --- */}
      <div
        data-twe-modal-init
        className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto outline-none"
        id="inviteModal"
        tabIndex={-1}
      >
        <div
          data-twe-modal-dialog-ref
          className="relative flex min-h-[calc(100%-1rem)] w-auto items-center max-w-xl mx-auto p-4 transition-all"
        >
          <div className="bg-white w-full rounded-3xl shadow-2xl flex flex-col p-6">
            <div className="flex items-center justify-between mb-6">
              <h5 className="text-2xl font-bold text-[#1A3652]">
                {isSuperAdmin
                  ? "Create Admin Organization"
                  : "Send Team Invitation"}
              </h5>
              <button
                data-twe-modal-dismiss
                className="text-gray-500 hover:text-black"
              >
                <Icon icon="material-symbols:close" width="28" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#1A3652] mb-2 uppercase tracking-wide">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full p-3.5 border-2 border-[#E8E8E8] rounded-xl outline-none focus:border-[#448CD2] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1A3652] mb-2 uppercase tracking-wide">
                  Assigned Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3.5 border-2 border-[#E8E8E8] rounded-xl outline-none focus:border-[#448CD2] bg-white transition-all capitalize"
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

            <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-100">
              <button
                data-twe-modal-dismiss
                className="px-8 py-2.5 border-2 border-gray-200 rounded-full font-bold text-gray-500 hover:bg-gray-50 transition-all uppercase text-xs tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvite}
                disabled={isLoading}
                className="px-8 py-2.5 bg-gradient-to-r from-[#1A3652] to-[#448CD2] text-white rounded-full font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50 uppercase text-xs tracking-widest"
              >
                {isLoading ? "Sending..." : "Confirm Invitation"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message Toast */}
      {errorMessage && (
        <div className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-3 rounded-2xl shadow-2xl z-[9999] flex items-center gap-4">
          <Icon icon="material-symbols:error-outline" width="24" />
          <span className="font-semibold">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="ml-2 font-black text-xl hover:scale-125"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default OrgInvitation;
