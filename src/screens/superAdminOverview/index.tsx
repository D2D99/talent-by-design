import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import IconamoonArrow from "../../../public/static/img/icons/iconamoon_arrow.png";
// import DeleteImg from "../../../public/static/img/icons/delete-img.svg";
import { Ripple, initTWE, Modal, Offcanvas } from "tw-elements";
import Sidebar from "../../components/sidebar";
import axios from "axios";

const SuperAdminOverview = () => {
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  useEffect(() => {
    initTWE({ Ripple, Modal, Offcanvas });

    // Identify current user role from storage
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

  const handleSendInvite = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !email || !role) {
      setErrorMessage("Please ensure email and role are selected.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}auth/send-invitation`,
        { email, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Invitation sent successfully");
      setEmail("");
      setRole("");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to send invitation.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleOptions = () => {
    if (currentUserRole === "superadmin") return <option value="admin">Admin</option>;
    if (currentUserRole === "admin") {
      return (
        <>
          <option value="leader">Leader</option>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </>
      );
    }
    return <option disabled>No permissions</option>;
  };

  return (
    <div>
      {/* Mobile Sidebar Offcanvas */}
      <div
        className="invisible fixed bottom-0 left-0 top-0 z-[1045] flex w-96 max-w-full -translate-x-full flex-col border-none bg-white shadow-sm outline-none transition duration-300 ease-in-out data-[twe-offcanvas-show]:transform-none"
        tabIndex={-1}
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
        data-twe-offcanvas-init
      >
        <div className="flex items-center justify-end p-4">
          <button type="button" data-twe-offcanvas-dismiss aria-label="Close">
            <span className="[&>svg]:h-6 [&>svg]:w-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </button>
        </div>
        <Sidebar />
      </div>

      {/* Sticky Header */}
      <div className="sticky top-6 z-10 flex items-center gap-2 justify-between bg-white border border-[#448CD2] border-opacity-20 shadow-[0px_0px_5px_0px_#4B9BE980] sm:p-6 rounded-[12px] py-3 px-3">
        <div>
          <div className="md:hidden visible absolute top-1/2 transform -translate-y-1/2 left-[-12px] cursor-pointer">
            <button type="button" data-twe-offcanvas-toggle data-twe-target="#offcanvasExample">
              <img src={IconamoonArrow} alt="arrow" className="w-5 h-5" />
            </button>
          </div>
          <h3 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)]">
            Welcome back, Travis S!
          </h3>
          <p className="sm:text-sm text-xs font-normal text-[var(--secondary-color)] mt-1">
            Manage your organization invitations and member access levels here.
          </p>
        </div>
        <div className="relative">
          <Icon icon="tabler:bell" width="28" height="28" className="sm:w-7 sm:h-7 w-5 h-5" />
          <p className="w-[6px] h-[6px] bg-[#FF0000] rounded-full absolute top-0 right-[8px] border border-white"></p>
        </div>
      </div>

      {/* Invite Table Section */}
      <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[0px_0px_5px_0px_#4B9BE980] sm:p-6 p-3 rounded-[12px] mt-6">
        <div className="flex items-center md:justify-between justify-center gap-3 flex-wrap">
          <h2 className="text-2xl font-bold text-[var(--secondary-color)]">Organization Invitations</h2>
          <button
            type="button"
            data-twe-toggle="modal"
            data-twe-target="#inviteModal"
            className="group text-white rounded-full py-2 px-5 flex items-center gap-1.5 font-semibold text-lg uppercase bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)]"
          >
            <Icon icon="material-symbols:add-rounded" width="24" height="24" />
            Send New Invite
          </button>
        </div>

        <div className="mt-7 mb-4 overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#edf5fd]">
                <th className="px-6 py-2 text-left font-semibold">#</th>
                <th className="px-6 py-2 text-left font-semibold">Email</th>
                <th className="px-6 py-2 text-left font-semibold">Role</th>
                <th className="px-6 py-2 text-left font-semibold">Status</th>
                <th className="px-6 py-2 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#edf5fd] hover:bg-[#edf5fd]">
                <td className="px-6 py-4">1</td>
                <td className="px-6 py-4">example@user.com</td>
                <td className="px-6 py-4 capitalize">{role || "Manager"}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Pending</span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-red-500 hover:text-red-700">
                    <Icon icon="la:trash-alt-solid" width="20" height="20" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      <div
        data-twe-modal-init
        className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto outline-none"
        id="inviteModal"
        tabIndex={-1}
      >
        <div data-twe-modal-dialog-ref className="relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-xl mx-auto">
          <div className="mx-3 pointer-events-auto relative flex w-full flex-col rounded-2xl border-none bg-white shadow-lg outline-none">
            <div className="flex items-center justify-between p-4">
              <h5 className="text-xl font-bold">Send Invitation</h5>
              <button type="button" data-twe-modal-dismiss aria-label="Close">
                <Icon icon="material-symbols:close" width="24" height="24" />
              </button>
            </div>
            <div className="px-4 pb-4">
              <div className="mb-4">
                <label className="font-bold text-sm">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full p-3 mt-2 border rounded-lg outline-none focus:border-[var(--primary-color)]"
                />
              </div>
              <div className="mb-4">
                <label className="font-bold text-sm">Assign Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 mt-2 border rounded-lg outline-none appearance-none bg-no-repeat bg-[right_1rem_center]"
                >
                  <option value="">Select a role</option>
                  {renderRoleOptions()}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t p-4">
              <button type="button" data-twe-modal-dismiss className="px-6 py-2 border rounded-full font-semibold uppercase text-sm">Cancel</button>
              <button
                type="button"
                onClick={handleSendInvite}
                className="px-6 py-2 bg-gradient-to-r from-[#1a3652] to-[#448bd2] text-white rounded-full font-semibold uppercase text-sm"
              >
                {isLoading ? "Sending..." : "Send Invite"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-[2000]">
          {errorMessage}
          <button onClick={() => setErrorMessage(null)} className="ml-2 font-bold">×</button>
        </div>
      )}
    </div>
  );
};

export default SuperAdminOverview;