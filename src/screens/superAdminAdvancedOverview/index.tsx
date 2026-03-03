import { Icon } from "@iconify/react";
import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import PageNotFound from "../pageNotFound";

const SuperAdminAdvancedOverview = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("all");

    const role = user?.role?.toLowerCase();

    if (role !== "superadmin") {
        return <PageNotFound />;
    }

    const stats = [
        { label: "Total Organizations", value: "42", icon: "solar:buildings-2-bold-duotone", color: "#448CD2", growth: "+12%" },
        { label: "Active Participants", value: "1,284", icon: "solar:users-group-rounded-bold-duotone", color: "#8E54E9", growth: "+8%" },
        { label: "Assessments Completed", value: "856", icon: "solar:checklist-minimalistic-bold-duotone", color: "#4776E6", growth: "+15%" },
        { label: "Average Score", value: "78%", icon: "solar:chart-square-bold-duotone", color: "#FF512F", growth: "+2%" },
    ];

    const recentActivities = [
        { id: 1, org: "Global Tech Solutions", action: "Completed Assessment", time: "2 hours ago", status: "Success" },
        { id: 2, org: "Future Systems Inc", action: "New Invitations Sent", time: "5 hours ago", status: "In Progress" },
        { id: 3, org: "Nexus Innovations", action: "Report Generated", time: "1 day ago", status: "Success" },
    ];

    return (
        <div className="min-h-screen p-4 sm:p-6 space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-xl">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1a3652] to-[#448bd2] bg-clip-text text-transparent">
                        Super Admin Intelligence Overview
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">
                        "Design is intelligence made visible." - Alvis One
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-[#448bd2]/10 hover:bg-[#448bd2]/20 text-[#448bd2] rounded-xl transition-all duration-300 font-semibold border border-[#448bd2]/20">
                        <Icon icon="solar:calendar-linear" width="20" />
                        <span>Select Period</span>
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#1a3652] to-[#448bd2] text-white rounded-xl shadow-lg shadow-[#448bd2]/30 hover:shadow-[#448bd2]/50 hover:scale-[1.02] transition-all duration-300 font-semibold">
                        <Icon icon="solar:file-download-linear" width="20" />
                        <span>Export Master Report</span>
                    </button>
                </div>
            </div>

            {/* Hero Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="group relative overflow-hidden bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-[#448bd2]/50 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div
                                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 group-hover:scale-110 transition-transform duration-500"
                                style={{ color: stat.color }}
                            >
                                <Icon icon={stat.icon} width="28" />
                            </div>
                            <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                                <Icon icon="solar:trending-up-linear" />
                                {stat.growth}
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">
                                {stat.label}
                            </p>
                            <h3 className="text-3xl font-black text-slate-800 dark:text-white">
                                {stat.value}
                            </h3>
                        </div>

                        {/* Background Decorative Element */}
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500" style={{ color: stat.color }}>
                            <Icon icon={stat.icon} width="120" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Organization Health Map */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Icon icon="solar:global-linear" className="text-[#448bd2]" />
                                Organization Performance Spectrum
                            </h3>
                            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                {["all", "growth", "stable"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all duration-300 capitalize ${activeTab === tab
                                            ? "bg-[#448bd2] text-white shadow-md"
                                            : "text-slate-500 hover:text-[#448bd2]"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="p-8 h-[400px] flex flex-col items-center justify-center text-center relative">
                            {/* This would be where a chart goes. Using a premium visual placeholder */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <div className="w-full h-full bg-[radial-gradient(circle_at_center,_#448bd2_1px,_transparent_1px)] bg-[length:24px_24px]"></div>
                            </div>
                            <div className="relative group cursor-pointer">
                                <div className="absolute -inset-4 bg-gradient-to-r from-[#448bd2] to-[#8E54E9] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
                                <Icon icon="solar:graph-up-bold-duotone" width="120" className="text-slate-200 dark:text-slate-700 relative" />
                            </div>
                            <p className="mt-6 text-slate-500 dark:text-slate-400 max-w-md italic">
                                Advanced cross-organization correlation analysis will be visualized here once more assessment data is compiled.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Real-time Pulse */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl p-6">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                            <Icon icon="solar:transmission-bold-duotone" className="text-[#FF512F] animate-pulse" />
                            Intelligence Pulse
                        </h3>
                        <div className="space-y-6">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex gap-4 group cursor-pointer">
                                    <div className="relative">
                                        <div className={`w-3 h-3 rounded-full mt-1.5 ${activity.status === "Success" ? "bg-emerald-500" : "bg-amber-500"}`}></div>
                                        {activity.id !== recentActivities.length && (
                                            <div className="absolute top-4.5 left-1.5 w-[1px] h-12 bg-slate-100 dark:bg-slate-700"></div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-[#448bd2] transition-colors">
                                            {activity.org}
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{activity.action}</p>
                                        <span className="text-xs text-slate-400 mt-1 block">{activity.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                            View All Insights
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-[#1a3652] to-[#448bd2] rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-2">Platform Update</h3>
                            <p className="text-blue-100 text-sm mb-4">New Predictive Analysis module is now available for Super Admins.</p>
                            <button className="px-4 py-2 bg-white text-[#1a3652] rounded-lg text-sm font-black shadow-lg hover:scale-105 transition-transform">
                                Explore Now
                            </button>
                        </div>
                        <Icon icon="solar:stars-line-duotone" width="80" className="absolute -right-4 -bottom-4 text-white/10 rotate-12" />
                    </div>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="text-center py-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-slate-400 text-sm flex items-center justify-center gap-2 font-medium">
                    Powered by <span className="font-bold text-slate-600 dark:text-slate-300 tracking-tighter">ALVIS ONE</span> Advanced Analytics Engine
                </p>
            </div>
        </div>
    );
};

export default SuperAdminAdvancedOverview;
