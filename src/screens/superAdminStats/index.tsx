import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import SpinnerLoader from "../../components/spinnerLoader";

interface OrgStats {
  orgName: string;
  users: number;
  completed: number;
}

const SuperAdminStats = () => {
  const [stats, setStats] = useState<OrgStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("assessment/super-admin/stats");
        setStats(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalOrgs = stats.length;
  const totalUsers = stats.reduce((acc, curr) => acc + curr.users, 0);
  const totalCompleted = stats.reduce((acc, curr) => acc + curr.completed, 0);
  const overallProgress =
    totalUsers > 0 ? Math.round((totalCompleted / totalUsers) * 100) : 0;

  const filteredStats = stats.filter((org) =>
    org.orgName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <SpinnerLoader />;

  return (
    <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-178px)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          {/* <div className="p-2 bg-blue-50 rounded-lg">
                        <Icon icon="solar:chart-square-linear" className="text-[#448CD2]" width="28" />
                    </div> */}
          <div>
            <h2 className="md:text-2xl mb-1 text-xl font-bold text-gray-800">
              Organization Analytics
            </h2>
            <p className="text-gray-500 text-sm">
              Overview of organization performances
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
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] text-gray-700 dark:bg-[var(--app-surface-muted)] dark:border-[var(--app-border-color)] dark:text-[var(--app-text-color)] dark:placeholder:text-[#88a7c4]"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="solar:buildings-2-linear"
          label="Total Organizations"
          value={totalOrgs}
          color="text-[var(--primary-color)]"
          bgColor="bg-blue-200/25"
        />
        <StatCard
          icon="solar:users-group-rounded-linear"
          label="Total Participants"
          value={totalUsers}
          color="text-purple-600"
          bgColor="bg-purple-200/25"
        />
        <StatCard
          icon="solar:checklist-minimalistic-linear"
          label="Completed"
          value={totalCompleted}
          color="text-green-600"
          bgColor="bg-green-200/25"
        />
        <StatCard
          icon="solar:pie-chart-2-linear"
          label="Completion Rate"
          value={`${overallProgress}%`}
          color="text-orange-600"
          bgColor="bg-orange-200/25"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-100 bg-gray-50/50 text-left dark:border-[var(--app-border-color)] dark:bg-[var(--app-surface-muted)]">
              <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">
                Organization
              </th>
              <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">
                Participants
              </th>
              <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">
                Completed
              </th>
              <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">
                Progress
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStats.map((org, idx) => {
              const percentage =
                org.users > 0
                  ? Math.round((org.completed / org.users) * 100)
                  : 0;
              return (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors dark:border-[var(--app-border-color)] dark:hover:bg-[rgba(121,186,240,0.08)]"
                >
                  <td className="px-6 py-4 text-sm font-medium dark:text-[var(--app-text-color)]">
                    <div
                      onClick={() =>
                        navigate(
                          `/dashboard/org-assessments/${encodeURIComponent(org.orgName)}`,
                        )
                      }
                      className="text-[#448CD2] hover:underline font-bold cursor-pointer"
                    >
                      {org.orgName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600 dark:text-[var(--app-text-muted)]">
                    <span className="flex items-center gap-2 bg-blue-50 text-[#448CD2] px-2 py-1 rounded-lg w-fit border border-blue-100 font-bold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        aria-hidden="true"
                        role="img"
                        class="iconify iconify--solar"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="9.001"
                          cy="6"
                          r="4"
                          fill="currentColor"
                        ></circle>
                        <ellipse
                          cx="9.001"
                          cy="17.001"
                          fill="currentColor"
                          rx="7"
                          ry="4"
                        ></ellipse>
                        <path
                          fill="currentColor"
                          d="M21 17c0 1.657-2.036 3-4.521 3c.732-.8 1.236-1.805 1.236-2.998c0-1.195-.505-2.2-1.239-3.001C18.962 14 21 15.344 21 17M18 6a3 3 0 0 1-4.029 2.82A5.7 5.7 0 0 0 14.714 6c0-1.025-.27-1.987-.742-2.819A3 3 0 0 1 18 6.001"
                        ></path>
                      </svg>
                      {org.users}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-[var(--app-text-muted)]">
                    <span
                      className={`rounded-md text-sm ${org.completed > 0 ? "text-neutral-800 font-bold" : "text-gray-400"}`}
                    >
                      {org.completed}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="pt-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            percentage === 100
                              ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                              : percentage >= 50
                                ? "bg-gradient-to-r from-[#448CD2] to-[#5BA3E0]"
                                : "bg-gradient-to-r from-amber-400 to-amber-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span
                        className={`text-xs font-semibold w-10 ${
                          percentage === 100
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
            {filteredStats.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Icon
                      icon="solar:file-remove-linear"
                      width="40"
                      className="mb-2 opacity-50"
                    />
                    <p>No organizations found matching "{searchTerm}"</p>
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

export default SuperAdminStats;
