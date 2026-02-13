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
    const overallProgress = totalUsers > 0 ? Math.round((totalCompleted / totalUsers) * 100) : 0;

    const filteredStats = stats.filter((org) =>
        org.orgName.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <h2 className="md:text-2xl text-xl font-bold text-gray-800">Assessment Analytics</h2>
                        <p className="text-gray-500 text-sm">Overview of organization performance</p>
                    </div>
                </div>

                <div className="relative">
                    <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" />
                    <input
                        type="text"
                        placeholder="Search organizations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:border-[#448CD2] focus:ring-1 focus:ring-[#448CD2]"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                    icon="solar:buildings-2-linear"
                    label="Total Organizations"
                    value={totalOrgs}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <StatCard
                    icon="solar:users-group-rounded-linear"
                    label="Total Participants"
                    value={totalUsers}
                    color="text-purple-600"
                    bgColor="bg-purple-50"
                />
                <StatCard
                    icon="solar:checklist-minimalistic-linear"
                    label="Completed"
                    value={totalCompleted}
                    color="text-green-600"
                    bgColor="bg-green-50"
                />
                <StatCard
                    icon="solar:pie-chart-2-linear"
                    label="Completion Rate"
                    value={`${overallProgress}%`}
                    color="text-orange-600"
                    bgColor="bg-orange-50"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 font-bold text-xs text-gray-400 uppercase tracking-widest">Organization</th>
                            <th className="px-6 py-4 font-bold text-xs text-gray-400 uppercase tracking-widest text-center">Participants</th>
                            <th className="px-6 py-4 font-bold text-xs text-gray-400 uppercase tracking-widest text-center">Completed</th>
                            <th className="px-6 py-4 font-bold text-xs text-gray-400 uppercase tracking-widest w-1/3">Progress</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredStats.map((org, idx) => {
                            const percentage = org.users > 0 ? Math.round((org.completed / org.users) * 100) : 0;
                            return (
                                <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div
                                            onClick={() => navigate(`/dashboard/org-assessments/${encodeURIComponent(org.orgName)}`)}
                                            className="font-bold text-gray-700 text-sm group-hover:text-[#448CD2] transition-colors cursor-pointer hover:underline"
                                        >
                                            {org.orgName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-md text-xs font-bold">{org.users}</span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`py-1 px-3 rounded-md text-xs font-bold ${org.completed > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                            {org.completed}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner">
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
                                            <span className={`text-xs font-bold w-10 text-right ${percentage === 100
                                                ? "text-emerald-600"
                                                : percentage >= 50
                                                    ? "text-[#448CD2]"
                                                    : "text-amber-600"
                                                }`}>{percentage}%</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredStats.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <Icon icon="solar:file-remove-linear" width="40" className="mb-2 opacity-50" />
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
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
        <div className={`p-3 rounded-lg ${bgColor} ${color}`}>
            <Icon icon={icon} width="24" />
        </div>
        <div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-wide">{label}</div>
            <div className="text-xl font-bold text-gray-800">{value}</div>
        </div>
    </div>
);

export default SuperAdminStats;
