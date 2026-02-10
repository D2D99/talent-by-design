import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import api from "../../services/axios";
import { formatDistanceToNow } from "date-fns";


interface NotificationItem {
    _id: string;
    recipient: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    link?: string;
    isRead: boolean;
    createdAt: string;
}

const NotificationHistory = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [activeTab, setActiveTab] = useState<"All" | "Unread" | "Read">("All");

    const fetchNotifications = async () => {
        try {
            const res = await api.get<NotificationItem[]>("/auth/notifications");
            setNotifications(res.data);
        } catch (error) {
            console.error("Failed to load notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkRead = async (id: string) => {
        try {
            await api.patch(`/auth/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.patch("/auth/notifications/read-all");
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error(error);
        }
    };

    const handleClearAll = async () => {
        try {
            await api.delete("/auth/notifications/clear-all");
            setNotifications([]);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (activeTab === "All") return true;
        if (activeTab === "Unread") return !n.isRead;
        if (activeTab === "Read") return n.isRead;
        return true;
    });

    return (
        <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-152px)]">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                <div>
                    <h2 className="md:text-2xl text-xl font-bold text-[var(--secondary-color)]">
                        Notifications
                    </h2>
                    <p className="text-sm text-gray-500 md:mt-1">
                        Stay updated with your latest activity and alerts.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleMarkAllRead}
                        className="group relative overflow-hidden z-0 bg-white border border-gray-200 hover:border-[#448CD2] text-gray-600 hover:text-[#448CD2] px-4 py-2 rounded-full flex justify-center items-center gap-1.5 font-semibold text-sm transition-all shadow-sm"
                    >
                        <Icon icon="solar:check-read-linear" width="18" />
                        <span className="hidden sm:inline">Mark All Read</span>
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="group relative overflow-hidden z-0 bg-white border border-red-100 hover:border-red-400 text-red-500 hover:text-red-600 px-4 py-2 rounded-full flex justify-center items-center gap-1.5 font-semibold text-sm transition-all shadow-sm"
                    >
                        <Icon icon="solar:trash-bin-trash-linear" width="18" />
                        <span className="hidden sm:inline">Clear History</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-100 mb-6 overflow-x-auto pb-1 no-scrollbar sticky top-[80px] z-10 bg-white pt-2">
                {(["All", "Unread", "Read"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === tab
                            ? "bg-[#1a3652] text-white shadow-md shadow-blue-900/20"
                            : "text-gray-500 hover:bg-gray-50"
                            }`}
                    >
                        {tab}
                        {tab === "All" && notifications.length > 0 && (
                            <span className="ml-2 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                                {notifications.length}
                            </span>
                        )}
                        {tab === "Unread" && notifications.filter(n => !n.isRead).length > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow-sm">
                                {notifications.filter(n => !n.isRead).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-3">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notif) => (
                        <div
                            key={notif._id}
                            className={`flex sm:flex-row flex-col gap-4 p-5 rounded-xl border transition-all duration-300 group hover:shadow-md ${!notif.isRead
                                ? "bg-blue-50/40 border-blue-100 shadow-[0_4px_12px_-4px_rgba(68,140,210,0.15)] relative overflow-hidden"
                                : "bg-white border-gray-100 hover:border-gray-200"
                                }`}
                            onClick={() => !notif.isRead && handleMarkRead(notif._id)}
                        >
                            {/* Unread Indicator Pill */}
                            {!notif.isRead && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#448CD2]"></div>
                            )}

                            <div className="flex-shrink-0">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${notif.type === 'success' ? 'bg-green-50 text-green-600' :
                                    notif.type === 'error' ? 'bg-red-50 text-red-600' :
                                        'bg-blue-50 text-[#448CD2]'
                                    }`}>
                                    <Icon
                                        icon={
                                            notif.type === 'success' ? 'solar:check-circle-bold' :
                                                notif.type === 'info' ? 'solar:bell-bold' :
                                                    'solar:info-circle-bold'
                                        }
                                        width="24"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex sm:items-center justify-between gap-4 mb-1">
                                    <h4 className={`text-base leading-snug truncate ${!notif.isRead ? "font-bold text-[#1a3652]" : "font-semibold text-gray-800"}`}>
                                        {notif.title}
                                    </h4>
                                    <span className="text-xs font-medium text-gray-400 whitespace-nowrap flex items-center gap-1 sm:static absolute top-5 right-5">
                                        <Icon icon="solar:clock-circle-linear" width="12" />
                                        {(() => {
                                            try {
                                                return formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true });
                                            } catch (e) {
                                                return 'Just now';
                                            }
                                        })()}
                                    </span>
                                </div>
                                <p className={`text-sm leading-relaxed ${!notif.isRead ? "text-gray-700 font-medium" : "text-gray-500"}`}>
                                    {notif.message}
                                </p>
                            </div>

                            {/* Desktop Actions */}
                            {!notif.isRead && (
                                <div className="flex items-center sm:gap-4 justify-end sm:mt-0 mt-2 sm:border-l sm:pl-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleMarkRead(notif._id); }}
                                        className="text-xs font-bold text-[#448CD2] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                                    >
                                        <Icon icon="solar:check-read-linear" width="16" />
                                        Mark Read
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                            <Icon icon="solar:bell-off-outline" className="text-gray-300 w-10 h-10" />
                        </div>
                        <h5 className="text-gray-900 font-bold mb-1 text-lg">No notifications found</h5>
                        <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                            You don't have any notifications in this category yet. We'll alert you when something important happens.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationHistory;
