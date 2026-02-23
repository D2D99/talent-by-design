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
    const [roleFilter, setRoleFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState<boolean>(false);

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
    const completedMembers = members.filter((m) => m.assessmentStatus === "Completed").length;
    const inProgressMembers = members.filter((m) => m.assessmentStatus === "In Progress").length;
    const overallProgress = totalMembers > 0 ? Math.round((completedMembers / totalMembers) * 100) : 0;

    const filteredMembers = members.filter((member) => {
        const matchesSearch = `${member.firstName} ${member.lastName} ${member.email} ${member.role} ${member.assessmentStatus || ""}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter.length === 0 || roleFilter.includes(member.role.toLowerCase());
        const matchesStatus = statusFilter.length === 0 || statusFilter.includes(member.assessmentStatus || "Not Started");

        return matchesSearch && matchesRole && matchesStatus;
    });

    if (loading) return <SpinnerLoader />;

    return (
        <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-178px)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="md:text-2xl text-xl font-bold text-gray-800">Assessment Overview</h2>
                        <p className="text-gray-500 text-sm">Track your team's assessment progress</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" />
                        <input
                            type="text"
                            placeholder="Search team members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:border-[#448CD2] focus:ring-1 focus:ring-[#448CD2]"
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border font-medium text-sm lg:w-auto w-full uppercase tracking-wider ${showFilters
                                ? "bg-[#448CD2] text-white border-[#448CD2]"
                                : "bg-white text-[#448CD2] border-blue-100 hover:border-blue-200"
                                }`}
                        >
                            <Icon icon="hugeicons:filter" width="16" height="16" />
                            <span>Filters</span>
                            {(roleFilter.length > 0 || statusFilter.length > 0) && (
                                <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold transition-colors ml-1 ${showFilters ? "bg-white text-[#448CD2]" : "bg-[#448CD2] text-white"}`}>
                                    {roleFilter.length + statusFilter.length}
                                </span>
                            )}
                        </button>

                        {showFilters && (
                            <div className="absolute right-0 top-12 w-72 bg-white shadow-2xl rounded-xl border border-gray-100 z-50 p-5 transform transition-all duration-300 dark:bg-[var(--app-surface)] dark:border-[var(--app-border-color)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-800 dark:text-[var(--app-heading-color)]">Filters</h3>
                                        {(roleFilter.length > 0 || statusFilter.length > 0) && (
                                            <button
                                                onClick={() => {
                                                    setRoleFilter([]);
                                                    setStatusFilter([]);
                                                }}
                                                className="text-[10px] font-bold text-blue-500 hover:text-blue-700 uppercase tracking-tighter bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 dark:bg-[rgba(121,186,240,0.16)] dark:border-[rgba(121,186,240,0.35)] dark:text-[#cbe4fb]"
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </div>
                                    <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600 dark:text-[#88a7c4] dark:hover:text-[#d6e8f8]">
                                        <Icon icon="material-symbols:close" width="20" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 dark:text-[#88a7c4]">Role</label>
                                        <div className="space-y-2">
                                            {["leader", "manager", "employee"].map((r) => (
                                                <label key={r} className="flex items-center gap-3 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={roleFilter.includes(r)}
                                                        onChange={() => setRoleFilter(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])}
                                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-[var(--app-border-color)] dark:bg-[var(--app-surface-muted)]"
                                                    />
                                                    <span className={`text-sm capitalize ${roleFilter.includes(r) ? "text-blue-600 font-bold dark:text-[#cbe4fb]" : "text-gray-600 dark:text-[var(--app-text-muted)]"}`}>{r}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 dark:text-[#88a7c4]">Assessment Status</label>
                                        <div className="space-y-2">
                                            {["Completed", "In Progress", "Not Started", "Due"].map((s) => (
                                                <label key={s} className="flex items-center gap-3 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={statusFilter.includes(s)}
                                                        onChange={() => setStatusFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-[var(--app-border-color)] dark:bg-[var(--app-surface-muted)]"
                                                    />
                                                    <span className={`text-sm ${statusFilter.includes(s) ? "text-blue-600 font-bold dark:text-[#cbe4fb]" : "text-gray-600 dark:text-[var(--app-text-muted)]"}`}>{s}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                    icon="solar:users-group-rounded-linear"
                    label="Total Team Members"
                    value={totalMembers}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <StatCard
                    icon="solar:checklist-minimalistic-linear"
                    label="Completed"
                    value={completedMembers}
                    color="text-green-600"
                    bgColor="bg-green-50"
                />
                <StatCard
                    icon="solar:hourglass-linear"
                    label="In Progress"
                    value={inProgressMembers}
                    color="text-orange-600"
                    bgColor="bg-orange-50"
                />
                <StatCard
                    icon="solar:pie-chart-2-linear"
                    label="Completion Rate"
                    value={`${overallProgress}%`}
                    color="text-purple-600"
                    bgColor="bg-purple-50"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 font-bold text-xs text-gray-400 uppercase tracking-widest">Name</th>
                            <th className="px-6 py-4 font-bold text-xs text-gray-400 uppercase tracking-widest">Email</th>
                            <th className="px-6 py-4 font-bold text-xs text-gray-400 uppercase tracking-widest text-center">Role</th>
                            <th className="px-6 py-4 font-bold text-xs text-gray-400 uppercase tracking-widest text-center">Assessment Status</th>
                            <th className="px-6 py-4 font-bold text-xs text-gray-400 uppercase tracking-widest w-1/4">Progress</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredMembers.map((member, idx) => {
                            const status = member.assessmentStatus || "Not Started";
                            const percentage = status === "Completed" ? 100 : status === "In Progress" ? 50 : status === "Due" ? 25 : 0;

                            return (
                                <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="font-bold text-gray-700 text-sm">
                                            {member.firstName === "-" ? (
                                                <span className="text-gray-300">—</span>
                                            ) : (
                                                `${member.firstName} ${member.lastName}`
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-gray-600">{member.email}</td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-md text-xs font-bold capitalize">
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span
                                            className={`py-1 px-3 rounded-md text-xs font-bold ${status === "Completed"
                                                ? "bg-green-100 text-green-600"
                                                : status === "In Progress"
                                                    ? "bg-blue-100 text-blue-600"
                                                    : status === "Due"
                                                        ? "bg-amber-100 text-amber-600"
                                                        : "bg-gray-100 text-gray-400"
                                                }`}
                                        >
                                            {status}
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
                                                            : percentage >= 25
                                                                ? "bg-gradient-to-r from-amber-400 to-amber-500"
                                                                : "bg-gradient-to-r from-gray-300 to-gray-400"
                                                        }`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className={`text-xs font-bold w-10 text-right ${percentage === 100
                                                ? "text-emerald-600"
                                                : percentage >= 50
                                                    ? "text-[#448CD2]"
                                                    : percentage >= 25
                                                        ? "text-amber-600"
                                                        : "text-gray-500"
                                                }`}>{percentage}%</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredMembers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <Icon icon="solar:file-remove-linear" width="40" className="mb-2 opacity-50" />
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

export default AdminAssessments;
