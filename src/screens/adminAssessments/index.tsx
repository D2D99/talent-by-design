import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import api from "../../services/axios";
import SpinnerLoader from "../../components/spinnerLoader";
import { toast } from "react-toastify";

interface UserMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  assessmentStatus?: string;
}

const AdminAssessments = () => {
  const [members, setMembers] = useState<UserMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter] = useState<string[]>([]);
  const [statusFilter] = useState<string[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Get admin's organization name
        const savedUser = localStorage.getItem("user");
        let orgName = "";

        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          orgName = parsed.orgName;
        }

        if (!orgName) {
          const profileRes = await api.get("auth/me");
          orgName = profileRes.data.orgName;
        }

        if (!orgName) {
          toast.error("Organization not found");
          return;
        }

        const res = await api.get(`auth/organization/${orgName}`);
        setMembers(res.data.members);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load team members");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const totalMembers = members.length;
  const completedMembers = members.filter(
    (m) => m.assessmentStatus === "Completed",
  ).length;
  const inProgressMembers = members.filter(
    (m) => m.assessmentStatus === "In Progress",
  ).length;
  const overallProgress =
    totalMembers > 0 ? Math.round((completedMembers / totalMembers) * 100) : 0;

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      `${member.firstName} ${member.lastName} ${member.email} ${member.role} ${member.assessmentStatus || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter.length === 0 || roleFilter.includes(member.role.toLowerCase());
    const matchesStatus =
      statusFilter.length === 0 ||
      statusFilter.includes(member.assessmentStatus || "Not Started");

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) return <SpinnerLoader />;

  return (
    <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-178px)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="md:text-2xl text-xl font-bold text-gray-800">
              Assessment Overview
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Track your team's assessment progress
            </p>
          </div>
        </div>

        <div className="relative flex-1 max-w-md">
          <Icon
            icon="tabler:search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#88a7c4]"
            width="20"
          />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] text-gray-700 dark:bg-[var(--app-surface-muted)] dark:border-[var(--app-border-color)] dark:text-[var(--app-text-color)] dark:placeholder:text-[#88a7c4]"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="solar:users-group-rounded-linear"
          label="Total Team Members"
          value={totalMembers}
          color="text-[var(--primary-color)]"
          bgColor="bg-blue-200/25"
        />
        <StatCard
          icon="solar:checklist-minimalistic-linear"
          label="Completed"
          value={completedMembers}
          color="text-green-600"
          bgColor="bg-green-200/25"
        />
        <StatCard
          icon="solar:hourglass-linear"
          label="In Progress"
          value={inProgressMembers}
          color="text-orange-600"
          bgColor="bg-orange-200/25"
        />
        <StatCard
          icon="solar:pie-chart-2-linear"
          label="Completion Rate"
          value={`${overallProgress}%`}
          color="text-purple-600"
          bgColor="bg-purple-200/25"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-100 bg-gray-50/50 text-left dark:border-[var(--app-border-color)] dark:bg-[var(--app-surface-muted)]">
              <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">
                Name
              </th>
              <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">
                Email
              </th>
              <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">
                Role
              </th>
              <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">
                Assessment Status
              </th>
              <th className="px-6 py-4 font-semibold dark:text-[#88a7c4] ">
                Progress
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredMembers.map((member, idx) => {
              const status = member.assessmentStatus || "Not Started";
              const percentage =
                status === "Completed"
                  ? 100
                  : status === "In Progress"
                    ? 50
                    : status === "Due"
                      ? 25
                      : 0;

              return (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors dark:border-[var(--app-border-color)] dark:hover:bg-[rgba(121,186,240,0.08)]"
                >
                  <td className="px-6 py-4 text-sm font-medium dark:text-[var(--app-text-color)]">
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
                    <span className="uppercase text-xs font-bold dark:text-[var(--app-text-color)]">
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
                </tr>
              );
            })}
            {filteredMembers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12">
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
    </div>
  );
};

const StatCard = ({ icon, label, value, color, bgColor }: any) => (
  <div className="bg-white border border-neutral-100 rounded-xl p-4 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${bgColor} ${color}`}>
      <Icon icon={icon} width="24" />
    </div>
    <div>
      <div className="text-gray-400 text-xs font-bold uppercase tracking-wide">
        {label}
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  </div>
);

export default AdminAssessments;
