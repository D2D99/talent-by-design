import { Icon } from "@iconify/react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { Modal, Ripple, initTWE } from "tw-elements";
import api from "../../services/axios";
import SpinnerLoader from "../../components/spinnerLoader";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import ProgressIcon from "../../../public/static/img/home/progress-icon.png";

interface UserMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
  assessmentStatus?: string;
}

const AdminAssessments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [members, setMembers] = useState<UserMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [roleFilter] = useState<string[]>([]);
  const [statusFilter] = useState<string[]>([]);
  const [resetingId, setResetingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const resetModalInstance = useRef<any>(null);

  useEffect(() => {
    initTWE({ Ripple, Modal });
  }, []);

  const adminId = user?._id;

  const fetchMembers = async () => {
    try {
      const res = await api.get("auth/organization-members");
      setMembers(res.data.members || []);

      // Fetch departments for filtering (using the user's organization)
      if (user?.orgName) {
        const filterRes = await api.get(`auth/organization-filters/${user.orgName}`);
        setDepartments(filterRes.data.departments || []);
      }
    } catch (err) {
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleResetAssessment = async (memberId: string) => {
    setIsProcessing(true);
    try {
      await api.post(`/auth/reset-individual-assessment/${memberId}`);
      toast.success("Assessment reset successfully");
      fetchMembers();
      // Close modal
      if (resetModalInstance.current) {
        resetModalInstance.current.hide();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reset assessment");
    } finally {
      setIsProcessing(false);
    }
  };

  const openResetModal = (memberId: string) => {
    setResetingId(memberId);
    const modalElement = document.getElementById("resetAssessmentModal");
    if (modalElement) {
      const modal = new Modal(modalElement);
      resetModalInstance.current = modal;
      modal.show();
    }
  };

  // Filter Logic
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      `${m.firstName} ${m.lastName} ${m.email} ${m.department || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === "" || m.department === selectedDept;

    const matchesRole =
      roleFilter.length === 0 || roleFilter.includes(m.role.toLowerCase());
    const matchesStatus =
      statusFilter.length === 0 ||
      statusFilter.includes(m.assessmentStatus?.toLowerCase() || "");

    return matchesSearch && matchesDept && matchesRole && matchesStatus;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <SpinnerLoader />;

  return (
    <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-162px)] grid items-start">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="md:text-3xl text-2xl font-bold text-gray-800">
            Team Assessments
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage assessment progress for your entire team.
          </p>
        </div>
        <div className="relative flex-1 max-w-md">
          <Icon
            icon="tabler:search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="20"
          />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] text-gray-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[var(--primary-color)] text-sm shadow-sm"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-100 bg-gray-50/50 text-left">
              <th className="px-6 py-4 font-semibold">#</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Department</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold text-nowrap">
                Assessment Status
              </th>
              <th className="px-6 py-4 font-semibold">Progress</th>
              <th className="px-6 py-4 font-semibold text-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentData.map((member, idx) => {
              const status = member.assessmentStatus || "Not Started";
              const percentage =
                status === "Completed"
                  ? 100
                  : status === "In Progress"
                    ? 50
                    : status === "Due"
                      ? 25
                      : 0;

              // Hide reset button for admins (own role) and for the logged-in admin themselves
              const isAdminRole = member.role?.toLowerCase() === "admin";
              const isSelf =
                adminId && member._id?.toString() === adminId?.toString();
              const canReset =
                !isAdminRole &&
                !isSelf &&
                (status === "Completed" || status === "In Progress");

              return (
                <tr
                  key={member._id}
                  className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                    {indexOfFirstItem + idx + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-nowrap">
                    <div className="font-bold">
                      {member.firstName === "-" ? (
                        <span className="text-gray-300">—</span>
                      ) : (
                        `${member.firstName} ${member.lastName}`
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {member.department || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="uppercase text-xs font-bold ">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border justify-center
                         ${status === "Completed"
                          ? "bg-[#EEF7ED] text-[#3F9933] border-[#3F9933] "
                          : status === "In Progress"
                            ? "bg-blue-100 text-blue-600 border-blue-600"
                            : status === "Due"
                              ? "bg-amber-100 text-amber-600 border-amber-600"
                              : "bg-gray-100 text-gray-400 border-gray-400"
                        }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="pt-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${percentage === 100
                            ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                            : percentage >= 50
                              ? "bg-gradient-to-r from-[#448CD2] to-[#5BA3E0]"
                              : "bg-gradient-to-r from-amber-400 to-amber-500"
                            }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span
                        className={`text-xs font-semibold w-10 ${percentage === 100
                          ? "text-green-600"
                          : percentage >= 50
                            ? "text-[#448CD2]"
                            : "text-neutral-300"
                          }`}
                      >
                        {percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {status === "Completed" && (
                        <button
                          onClick={() => {
                            const roleMapping: Record<string, string> = {
                              superadmin: "org-head",
                              super_admin: "org-head",
                              admin: "org-head",
                              "senior-leader": "senior-leader",
                              leader: "senior-leader",
                              manager: "manager",
                              employee: "employee",
                            };
                            const reportType =
                              roleMapping[member.role?.toLowerCase() || ""] ||
                              "employee";
                            navigate(
                              `/dashboard/reports/${reportType}?userId=${member._id}&email=${encodeURIComponent(member.email)}&orgName=${encodeURIComponent(user?.orgName || "")}`,
                            );
                          }}
                          title="View user's report"
                          className="inline-flex items-center gap-1 py-1 px-2 text-[10px] font-semibold rounded-full border border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-all"
                        >
                          <Icon icon="solar:eye-linear" width="12" />
                          View Report
                        </button>
                      )}
                      {canReset ? (
                        <button
                          onClick={() => openResetModal(member._id)}
                          title="Reset this user's assessment so they must retake it"
                          className="inline-flex items-center gap-1 py-1 px-2 text-[10px] font-semibold rounded-full border border-orange-300 text-orange-600 bg-orange-50 hover:bg-orange-100 hover:border-orange-400 transition-all"
                        >
                          <Icon icon="solar:restart-linear" width="12" />
                          Reset
                        </button>
                      ) : !(status === "Completed") ? (
                        <span className="text-gray-300 text-xs">—</span>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredMembers.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Icon
                      icon="solar:file-remove-linear"
                      width="40"
                      className="mb-2 opacity-50"
                    />
                    <p>No team members found matching "{searchTerm}"</p>
                  </div>
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

      {/* Reset Confirmation Modal */}
      <div
        data-twe-modal-init
        className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="resetAssessmentModal"
        tabIndex={-1}
        aria-labelledby="resetAssessmentModalLabel"
        aria-modal="true"
        role="dialog"
      >
        <div
          data-twe-modal-dialog-ref
          className="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]"
        >
          <div className="pointer-events-auto relative flex w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-2xl outline-none">
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-xl border-b border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                  <Icon
                    icon="solar:restart-bold"
                    className="text-orange-500"
                    width="24"
                  />
                </div>
                <h5
                  className="text-xl font-bold leading-normal text-gray-800"
                  id="resetAssessmentModalLabel"
                >
                  Reset Assessment
                </h5>
              </div>
              <button
                type="button"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                data-twe-modal-dismiss
                aria-label="Close"
              >
                <Icon icon="material-symbols:close" width="24" />
              </button>
            </div>

            <div className="relative p-6">
              <div className="mb-4 text-center">
                <img
                  src={ProgressIcon}
                  alt="Illustration"
                  className="w-32 mx-auto mb-4 opacity-80"
                />
                <p className="text-gray-600 leading-relaxed">
                  Are you sure you want to reset this assessment? The current
                  progress will be lost, and the user will need to start the
                  assessment from the beginning.
                </p>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-2 text-left">
                  <Icon
                    icon="solar:info-circle-bold"
                    className="text-blue-500 shrink-0 mt-0.5"
                    width="18"
                  />
                  <p className="text-xs text-blue-700">
                    This action is useful if a user wants to retake the
                    assessment or if their previous attempt was invalid.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-shrink-0 flex-wrap items-center justify-center gap-3 rounded-b-xl border-t border-gray-100 p-6">
              <button
                type="button"
                className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-full transition-all"
                data-twe-modal-dismiss
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() =>
                  resetingId && handleResetAssessment(resetingId)
                }
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-orange-200 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <Icon icon="line-md:loading-twotone-loop" />
                ) : (
                  <Icon icon="solar:restart-bold" />
                )}
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAssessments;
