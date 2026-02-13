import { Icon } from "@iconify/react";
import { useEffect, useState, useCallback } from "react";
import Pagination from "../Pagination";
import api from "../../services/axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface UserMember {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    department?: string;
    createdAt: string;
    status: string;
}

interface OrgDetails {
    orgName: string;
    createdAt: string;
    status: string;
    totalTeamMember: number;
}

const OrgInvitationDetails = () => {
    const { orgName: routeOrgName } = useParams();
    const navigate = useNavigate();

    const [members, setMembers] = useState<UserMember[]>([]);
    const [details, setDetails] = useState<OrgDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [roleFilter, setRoleFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const [sortConfig, setSortConfig] = useState<{
        key: keyof UserMember;
        direction: "asc" | "desc";
    } | null>(null);

    const fetchMembers = useCallback(async () => {
        setIsLoading(true);
        try {
            if (!routeOrgName) {
                toast.error("Organization not found");
                return;
            }

            const res = await api.get<{ details: OrgDetails; members: UserMember[] }>(
                `auth/organization/${routeOrgName}`,
            );
            setMembers(res.data.members);
            setDetails(res.data.details);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load members");
        } finally {
            setIsLoading(false);
        }
    }, [routeOrgName]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const handleSort = (key: keyof UserMember) => {
        let direction: "asc" | "desc" = "asc";
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === "asc"
        ) {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedMembers = [...members].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        if (a[key]! < b[key]!) return direction === "asc" ? -1 : 1;
        if (a[key]! > b[key]!) return direction === "asc" ? 1 : -1;
        return 0;
    });

    const filteredMembers = sortedMembers.filter((m) => {
        const matchesSearch =
            `${m.firstName} ${m.lastName} ${m.email} ${m.role} ${m.department || ""} ${m.status || ""}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        const matchesRole =
            roleFilter.length === 0 || roleFilter.includes(m.role.toLowerCase());
        const matchesStatus =
            statusFilter.length === 0 || statusFilter.includes(m.status);

        return matchesSearch && matchesRole && matchesStatus;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);

    const renderStatusBadge = (status: string) => {
        const base =
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border justify-center";
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

    // Calculate stats
    const totalMembers = members.length;
    const acceptedMembers = members.filter((m) => m.status === "Accept").length;
    const pendingMembers = members.filter((m) => m.status === "Pending").length;
    const expiredMembers = members.filter((m) => m.status === "Expire").length;

    return (
        <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-152px)]">
            {/* Header Section */}
            <div className="mb-8 bg-white relative overflow-hidden">
                <div
                    className="flex items-center gap-1.5 text-xs font-bold mb-6 cursor-pointer text-[#448CD2] transition-colors w-fit"
                    onClick={() => navigate("/dashboard/invite")}
                >
                    <Icon icon="material-symbols:arrow-back-rounded" width="16" />
                    <span className="uppercase tracking-wider">Back to Invitations</span>
                </div>
                <h2 className="md:text-3xl text-2xl font-bold text-gray-800 mb-2">
                    {details?.orgName || "Organization Details"}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Manage invitation status and team members
                </p>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                                    Total Members
                                </p>
                                <p className="text-2xl font-bold text-blue-700 mt-1">
                                    {totalMembers}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-200 rounded-lg">
                                <Icon
                                    icon="solar:users-group-rounded-bold"
                                    className="text-blue-600"
                                    width="24"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-green-600 uppercase tracking-wider">
                                    Accepted
                                </p>
                                <p className="text-2xl font-bold text-green-700 mt-1">
                                    {acceptedMembers}
                                </p>
                            </div>
                            <div className="p-3 bg-green-200 rounded-lg">
                                <Icon
                                    icon="solar:check-circle-bold"
                                    className="text-green-600"
                                    width="24"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider">
                                    Pending
                                </p>
                                <p className="text-2xl font-bold text-yellow-700 mt-1">
                                    {pendingMembers}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-200 rounded-lg">
                                <Icon
                                    icon="solar:clock-circle-bold"
                                    className="text-yellow-600"
                                    width="24"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-red-600 uppercase tracking-wider">
                                    Expired
                                </p>
                                <p className="text-2xl font-bold text-red-700 mt-1">
                                    {expiredMembers}
                                </p>
                            </div>
                            <div className="p-3 bg-red-200 rounded-lg">
                                <Icon
                                    icon="solar:close-circle-bold"
                                    className="text-red-600"
                                    width="24"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Icon
                        icon="tabler:search"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        width="20"
                    />
                    <input
                        type="text"
                        placeholder="Search by name, email, role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#448CD2] focus:ring-1 focus:ring-[#448CD2] transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${showFilters || roleFilter.length > 0 || statusFilter.length > 0
                                ? "bg-blue-50 border-blue-200 text-blue-600 font-bold"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <Icon icon="mi:filter" width="18" />
                        <span>Filters</span>
                        {(roleFilter.length > 0 || statusFilter.length > 0) && (
                            <span className="bg-blue-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full ml-1">
                                {roleFilter.length + statusFilter.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Filter Sidebar */}
            {showFilters && (
                <div className="absolute right-6 top-[500px] w-72 bg-white shadow-2xl rounded-xl border border-gray-100 z-50 p-5 transform transition-all duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-800">Filters</h3>
                            {(roleFilter.length > 0 || statusFilter.length > 0) && (
                                <button
                                    onClick={() => {
                                        setRoleFilter([]);
                                        setStatusFilter([]);
                                    }}
                                    className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold uppercase"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => setShowFilters(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <Icon icon="material-symbols:close" width="20" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Role Filter */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                Role
                            </label>
                            <div className="space-y-2">
                                {["leader", "manager", "employee", "admin"].map((r) => (
                                    <label
                                        key={r}
                                        className="flex items-center gap-3 cursor-pointer group"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={roleFilter.includes(r)}
                                            onChange={() => {
                                                setRoleFilter((prev) =>
                                                    prev.includes(r)
                                                        ? prev.filter((x) => x !== r)
                                                        : [...prev, r],
                                                );
                                            }}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span
                                            className={`text-sm capitalize ${roleFilter.includes(r) ? "text-blue-600 font-bold" : "text-gray-600"}`}
                                        >
                                            {r}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                Invitation Status
                            </label>
                            <div className="space-y-2">
                                {["Accept", "Pending", "Expire"].map((s) => (
                                    <label
                                        key={s}
                                        className="flex items-center gap-3 cursor-pointer group"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={statusFilter.includes(s)}
                                            onChange={() => {
                                                setStatusFilter((prev) =>
                                                    prev.includes(s)
                                                        ? prev.filter((x) => x !== s)
                                                        : [...prev, s],
                                                );
                                            }}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span
                                            className={`text-sm ${statusFilter.includes(s) ? "text-blue-600 font-bold" : "text-gray-600"}`}
                                        >
                                            {s === "Accept"
                                                ? "Accepted"
                                                : s === "Expire"
                                                    ? "Expired"
                                                    : "Pending"}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 font-black text-[10px] text-gray-400 uppercase tracking-widest w-16">
                                #
                            </th>
                            <th
                                className="px-6 py-4 font-black text-[10px] text-gray-400 uppercase tracking-widest cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("firstName")}
                            >
                                <div className="flex items-center justify-between">
                                    <span>Name</span>
                                    <div className="flex flex-col opacity-40">
                                        <Icon
                                            icon="mdi:chevron-up"
                                            className={`-mb-1.5 ${sortConfig?.key === "firstName" && sortConfig.direction === "asc" ? "text-blue-600 opacity-100" : ""}`}
                                        />
                                        <Icon
                                            icon="mdi:chevron-down"
                                            className={`${sortConfig?.key === "firstName" && sortConfig.direction === "desc" ? "text-blue-600 opacity-100" : ""}`}
                                        />
                                    </div>
                                </div>
                            </th>
                            <th
                                className="px-6 py-4 font-black text-[10px] text-gray-400 uppercase tracking-widest cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("email")}
                            >
                                <div className="flex items-center justify-between">
                                    <span>Email</span>
                                    <div className="flex flex-col opacity-40">
                                        <Icon
                                            icon="mdi:chevron-up"
                                            className={`-mb-1.5 ${sortConfig?.key === "email" && sortConfig.direction === "asc" ? "text-blue-600 opacity-100" : ""}`}
                                        />
                                        <Icon
                                            icon="mdi:chevron-down"
                                            className={`${sortConfig?.key === "email" && sortConfig.direction === "desc" ? "text-blue-600 opacity-100" : ""}`}
                                        />
                                    </div>
                                </div>
                            </th>
                            <th
                                className="px-6 py-4 font-black text-[10px] text-gray-400 uppercase tracking-widest cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("createdAt")}
                            >
                                <div className="flex items-center justify-between">
                                    <span>Created Date</span>
                                    <div className="flex flex-col opacity-40">
                                        <Icon
                                            icon="mdi:chevron-up"
                                            className={`-mb-1.5 ${sortConfig?.key === "createdAt" && sortConfig.direction === "asc" ? "text-blue-600 opacity-100" : ""}`}
                                        />
                                        <Icon
                                            icon="mdi:chevron-down"
                                            className={`${sortConfig?.key === "createdAt" && sortConfig.direction === "desc" ? "text-blue-600 opacity-100" : ""}`}
                                        />
                                    </div>
                                </div>
                            </th>
                            <th
                                className="px-6 py-4 font-black text-[10px] text-gray-400 uppercase tracking-widest cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("role")}
                            >
                                <div className="flex items-center justify-between">
                                    <span>Role</span>
                                    <div className="flex flex-col opacity-40">
                                        <Icon
                                            icon="mdi:chevron-up"
                                            className={`-mb-1.5 ${sortConfig?.key === "role" && sortConfig.direction === "asc" ? "text-blue-600 opacity-100" : ""}`}
                                        />
                                        <Icon
                                            icon="mdi:chevron-down"
                                            className={`${sortConfig?.key === "role" && sortConfig.direction === "desc" ? "text-blue-600 opacity-100" : ""}`}
                                        />
                                    </div>
                                </div>
                            </th>
                            <th className="px-6 py-4 font-black text-[10px] text-gray-400 uppercase tracking-widest">
                                Invitation Status
                            </th>
                            <th className="px-6 py-4 font-black text-[10px] text-gray-400 uppercase tracking-widest text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map((member, index) => (
                                <tr
                                    key={member._id}
                                    className="border-b border-gray-100 hover:bg-blue-50/20 transition-colors"
                                >
                                    <td className="px-6 py-4 text-sm font-bold text-gray-400">
                                        {indexOfFirstItem + index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-gray-800 tracking-tight">
                                            {member.firstName === "-" ? (
                                                <span className="text-gray-300 font-black">—</span>
                                            ) : (
                                                `${member.firstName} ${member.lastName}`
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-500">
                                        {member.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-500">
                                        {new Date(member.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-gray-400 capitalize">
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{renderStatusBadge(member.status)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="text-gray-200 hover:text-red-500 transition-colors">
                                            <Icon icon="tabler:trash" width="18" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="py-20 text-center text-gray-400">
                                    {isLoading ? "Loading members..." : "No members found."}
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
        </div>
    );
};

export default OrgInvitationDetails;
