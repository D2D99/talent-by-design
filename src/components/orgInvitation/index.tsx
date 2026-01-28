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
        }
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
        { headers: { Authorization: `Bearer ${token}` } }
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

  // --- Helper Functions ---
  const renderStatusBadge = (status: string) => {
    const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border justify-center";
    switch (status) {
      case "Accept":
        return <span className={`${base} bg-[#EEF7ED] text-[#3F9933] border-[#3F9933]`}>Accepted</span>;
      case "Expire":
        return <span className={`${base} bg-[#FFEEEE] text-[#D71818] border-[#D71818]`}>Expired</span>;
      default:
        return <span className={`${base} bg-[#FFF8EE] text-[#E39631] border-[#E39631]`}>Pending</span>;
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[0px_0px_5px_0px_#4B9BE980] sm:p-6 p-3 rounded-[12px] mt-6">
        
        {/* Header Section */}
        <div className="flex items-center md:justify-between justify-center gap-4 flex-wrap mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1A3652]">
              {isSuperAdmin ? "Organization Management" : "Team Member Management"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isSuperAdmin ? "Manage all client organizations and their admins." : "Invite and manage your organization team."}
            </p>
          </div>
          <button
            type="button"
            data-twe-toggle="modal"
            data-twe-target="#inviteModal"
            className="text-white rounded-full py-2.5 px-6 flex items-center gap-2 font-semibold text-sm uppercase bg-gradient-to-r from-[#1A3652] to-[#448CD2] shadow-lg hover:scale-105 transition-all"
          >
            <Icon icon="material-symbols:add-rounded" width="22" />
            {isSuperAdmin ? "Add New Organization" : "Invite New User"}
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full whitespace-nowrap border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-left text-sm font-bold text-[#1A3652]">#</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#1A3652]">
                  {isSuperAdmin ? "Organization" : "Full Name"}
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#1A3652]">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#1A3652]">Created Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#1A3652]">
                  {isSuperAdmin ? "Users Under Admin" : "Assigned Role"}
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#1A3652]">Status</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-[#1A3652]">Action</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 ? (
                dataList.map((item, index) => (
                  <tr key={item._id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#1A3652]">
                      {isSuperAdmin ? (item.orgName || "Unnamed Org") : (item.name || "—")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isSuperAdmin ? (
                        <div className="flex items-center gap-2 bg-blue-50 text-[#448CD2] px-3 py-1 rounded-lg w-fit border border-blue-100">
                          <Icon icon="solar:users-group-rounded-bold" width="16" />
                          <span className="font-bold">{item.totalUsers || 0}</span>
                        </div>
                      ) : (
                        <span className="capitalize px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                          {item.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{renderStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-all">
                        <Icon icon="solar:trash-bin-trash-bold" width="20" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-gray-400">
                    {isLoading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#448CD2]"></div>
                        <span>Loading records...</span>
                      </div>
                    ) : "No invitations found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
      <div data-twe-modal-init className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto outline-none" id="inviteModal" tabIndex={-1}>
        <div data-twe-modal-dialog-ref className="relative flex min-h-[calc(100%-1rem)] w-auto items-center max-w-xl mx-auto p-4 transition-all">
          <div className="bg-white w-full rounded-3xl shadow-2xl flex flex-col p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h5 className="text-2xl font-bold text-[#1A3652]">
                  {isSuperAdmin ? "New Organization Admin" : "Invite Team Member"}
                </h5>
                <p className="text-sm text-gray-500">Access will be sent via email.</p>
              </div>
              <button data-twe-modal-dismiss className="text-gray-400 hover:text-black p-2 bg-gray-50 rounded-full">
                <Icon icon="material-symbols:close" width="24" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#1A3652] mb-2 uppercase tracking-widest">Recipient Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full p-4 border-2 border-[#F3F4F6] rounded-2xl outline-none focus:border-[#448CD2] bg-[#F9FAFB] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A3652] mb-2 uppercase tracking-widest">Select Permission Level</label>
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
              <button data-twe-modal-dismiss className="px-8 py-3 rounded-full font-bold text-gray-500 hover:bg-gray-100 transition-all uppercase text-xs tracking-widest">
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
      </div>

      {/* Error Message Toast */}
      {errorMessage && (
        <div className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-[9999] flex items-center gap-4 animate-bounce">
          <Icon icon="solar:danger-bold" width="24" />
          <span className="font-semibold">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="ml-2 bg-white/20 rounded-full p-1 hover:bg-white/40">
            <Icon icon="material-symbols:close" width="18" />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrgInvitation;