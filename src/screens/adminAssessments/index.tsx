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
import { Tooltip } from "react-tooltip";

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
      await api.delete(`/auth/reset-assessment/${memberId}`);
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

    return matchesSearch;
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Team",
            value: members.length,
            icon: "solar:users-group-two-rounded-broken",
            color: "#448CD2",
            bg: "bg-blue-50/50"
          },
          {
            label: "Completed",
            value: members.filter((m) => m.assessmentStatus === "Completed").length,
            icon: "prime:check-circle",
            color: "#10B981",
            bg: "bg-green-50/50"
          },
          {
            label: "In Progress",
            value: members.filter((m) => m.assessmentStatus === "In Progress").length,
            icon: "basil:sand-watch-outline",
            color: "#6366F1",
            bg: "bg-indigo-50/50"
          },
          {
            label: "Not Started",
            value: members.filter((m) => !m.assessmentStatus || m.assessmentStatus === "Not Started").length,
            icon: "hugeicons:time-04",
            color: "#F59E0B",
            bg: "bg-amber-50/50"
          }
        ].map((stat, i) => (
          <div key={i} className={`border border-neutral-100 rounded-xl p-5 flex items-center gap-5 transition-all hover:shadow-md bg-white`}>
            <div className={`w-12 h-12 rounded-lg shrink-0 flex items-center justify-center`} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <Icon icon={stat.icon} width="24" height="24" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold leading-tight mt-0.5" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-14 mb-8">
        <div className="relative flex-1 max-w-md">
          <Icon
            icon="tabler:search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="20"
          />
          <input
            type="text"
            placeholder="Search team members by name, email..."
            value={searchTerm}
            autoComplete="off"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] text-gray-700"
          />
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
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold text-nowrap">
                Assessment Status
              </th>
              <th className="px-6 py-4 font-semibold">Progress</th>
              <th className="px-6 py-4 font-semibold text-nowrap text-start">
                Actions
              </th>
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
                    <div className="flex items-center justify-start gap-2">
                      {status === "Completed" && (
                        <>
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
                            id="viewReport"
                            className="flex justify-center items-center text-[10px] font-semibold rounded-full size-7 text-gray-500 hover:text-[var(--primary-color)]  hover:bg-blue-100 transition-all"
                          >
                            <Icon icon="solar:eye-linear" width="16" />
                          </button>
                          <Tooltip anchorSelect="#viewReport">
                            View Report
                          </Tooltip>
                        </>
                      )}
                      {canReset ? (
                        <>
                          <button
                            id="resetReport"
                            onClick={() => openResetModal(member._id)}
                            className="flex justify-center items-center text-[10px] font-semibold rounded-full size-7 text-gray-500 hover:text-red-500  hover:bg-red-100 transition-all"
                          >
                            <Icon icon="solar:restart-linear" width="16" />
                            {/* Reset */}
                          </button>
                          <Tooltip anchorSelect="#resetReport">
                            Reset Assessment
                          </Tooltip>
                        </>
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
        data-twe-backdrop="static"
      >
        <div
          data-twe-modal-dialog-ref
          className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto items-center max-w-xl mx-auto px-4"
        >
          <div className="pointer-events-auto relative flex max-w-xl w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none">
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 sm:pb-0 pb-2">
              <h5
                className="sm:text-xl text-lg text-[var(--secondary-color)] invisible font-bold"
                id="resetAssessmentModalLabel"
              >
                Reset Assessment
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
                  Are you sure you want to reset this assessment?
                </h5>
                <p className="text-sm text-neutral-600 mt-2">
                  The current progress will be lost, and the user will need to
                  start the assessment from the beginning.
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
                onClick={() => resetingId && handleResetAssessment(resetingId)}
                disabled={isProcessing}
                className="group relative overflow-hidden z-0 bg-red-500 px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase text-white duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-white/15 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                {isProcessing ? "Resetting..." : "Reset"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAssessments;
