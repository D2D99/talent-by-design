import { Icon } from "@iconify/react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../../services/axios";
import { formatDistanceToNow } from "date-fns";
import { Tooltip } from "react-tooltip";

const IconArrow = "/static/img/icons/iconamoon_arrow.png";

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

const TopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const isOverviewPage =
    location.pathname === "/dashboard" || location.pathname === "/";

  // Notification State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"All" | "Invites" | "Activity">(
    "All",
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch Notifications
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
    // Poll every 30 seconds for live-like updates
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle Outside Click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Actions
  const handleMarkAllRead = async () => {
    try {
      await api.patch("/auth/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
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

  const handleMarkRead = async (id: string) => {
    try {
      await api.patch(`/auth/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  // derived state
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "All") return true;
    if (activeTab === "Invites")
      return (
        n.title.toLowerCase().includes("invit") ||
        n.message.toLowerCase().includes("invit")
      );
    if (activeTab === "Activity")
      return (
        !n.title.toLowerCase().includes("invit") &&
        !n.message.toLowerCase().includes("invit")
      );
    return true;
  });

  return (
    <>
      <div className="sticky top-6 z-30 flex items-center gap-4 justify-between bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 rounded-[12px] py-3 px-3 mb-6">
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden visible restore-sidebar restore-sidebar-mobile absolute top-6 transform left-[-12px] cursor-pointer">
          <button
            type="button"
            data-twe-offcanvas-toggle
            data-twe-target="#offcanvasExample"
          >
            <img src={IconArrow} alt="arrow" className="w-5 h-5" />
          </button>
        </div>

        {isOverviewPage ? (
          <div className="flex-1">
            <h3 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)]">
              Welcome back!
            </h3>
            <p className="sm:text-sm text-xs font-normal text-[var(--secondary-color)] mt-1 max-w-2xl">
              Complete platform oversight with real-time performance insights.
            </p>
          </div>
        ) : (
          /* Navigation Section (Back Button + Breadcrumbs) */
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
              title="Go Back"
            >
              <Icon
                icon="lucide:arrow-left"
                className="w-5 h-5 text-gray-600"
              />
            </button>

            {/* Breadcrumbs */}
            <nav className="hidden sm:flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium text-gray-400 hover:text-black duration-300"
                  >
                    Dashboard
                  </Link>
                </li>
                {pathnames
                  .filter((value) => value.toLowerCase() !== "dashboard")
                  .map((value, index, filteredArray) => {
                    const last = index === filteredArray.length - 1;
                    const decodedValue = decodeURIComponent(value).replace(/-/g, " ");

                    // Logic to handle special route mapping for breadcrumbs
                    let to = `/dashboard/${filteredArray.slice(0, index + 1).join("/")}`;
                    let displayValue = decodedValue;

                    // Handle special cases
                    // Handle special cases
                    if (value.toLowerCase() === "organization") {
                      to = "/dashboard/invite";
                      displayValue = "Invite";
                    } else if (value.toLowerCase() === "org-assessments") {
                      to = "/dashboard/org-assessments";
                      displayValue = "Assessments";
                    } else if (value.toLowerCase() === "team-assessments") {
                      displayValue = "Assessments";
                    } else if (index > 0 && filteredArray[index - 1].toLowerCase() === "organization") {
                      displayValue = "Invitation Details";
                    } else if (index > 0 && filteredArray[index - 1].toLowerCase() === "org-assessments") {
                      displayValue = "Assessment Details";
                    } else if (value.toLowerCase() === "reports") {
                      displayValue = "Reports";
                    } else if (index > 0 && filteredArray[index - 1].toLowerCase() === "reports") {
                      // Handle report sub-routes
                      if (value === "org-head") {
                        displayValue = "Org Head / Coach";
                      } else if (value === "senior-leader") {
                        displayValue = "Senior Leader";
                      } else if (value === "manager") {
                        displayValue = "Manager";
                      } else if (value === "employee") {
                        displayValue = "Employee";
                      }
                    }

                    return (
                      <li key={to + index} className="flex items-center">
                        <Icon
                          icon="lucide:chevron-right"
                          className="text-gray-400 w-4 h-4"
                        />
                        {last ? (
                          <span className="ml-1 text-sm font-bold text-[var(--secondary-color)] capitalize md:ml-2">
                            {displayValue}
                          </span>
                        ) : (
                          <Link
                            to={to}
                            className="ml-1 text-sm font-medium text-gray-400 hover:text-[#448CD2] capitalize md:ml-2"
                          >
                            {displayValue}
                          </Link>
                        )}
                      </li>
                    );
                  })}
              </ol>
            </nav>
          </div>
        )}

        {/* ================= Notifications ================= */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2 rounded-full hover:bg-primary-500/10 transition-colors focus:outline-none"
          >
            {/* <Icon
              icon="solar:bell-bing-linear"
              className="w-7 h-7 text-[var(--secondary-color)]"
            /> */}
            <Icon icon="mage:notification-bell" width="24" height="24" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-[#FF4D4D] border-2 border-white rounded-full shadow-sm"></span>
            )}
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-[-10px] sm:right-0 top-16 w-[92vw] sm:w-[420px] bg-white rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] border border-gray-100 z-[9999] overflow-hidden transform transition-all duration-200 origin-top-right ring-1 ring-black/5">
              {/* Header */}
              <div className="px-6 py-5 bg-white flex items-center justify-between sticky top-0 z-20">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 tracking-tight">
                    Notification
                  </h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Stay Update With Your Latest Notifications
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleMarkAllRead}
                    className="p-2 hover:bg-primary-500/10 rounded-lg text-gray-500 hover:text-[#448CD2] transition-colors"
                    title="Mark all as read"
                    data-tooltip-id="mark-read"
                    data-tooltip-content="Mark all as read"
                  >
                    <Icon icon="solar:check-read-linear" width="20" />
                    <Tooltip id="mark-read" className="!text-xs" />
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                    data-tooltip-id="delete-notification"
                    data-tooltip-content="Clear List"
                  >
                    <Icon icon="solar:trash-bin-trash-linear" width="20" />

                    <Tooltip id="delete-notification" className="!text-xs" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="px-6 py-3 flex items-center gap-6 border-b border-gray-100 bg-white sticky top-[85px] z-10">
                {(["All", "Invites", "Activity"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-sm font-semibold transition-all duration-200 pb-1 relative ${activeTab === tab
                      ? "text-gray-900"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    {tab}
                    {tab === "All" && unreadCount > 0 && (
                      <span className="ml-1.5 bg-red-50 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        {unreadCount}
                      </span>
                    )}
                    {activeTab === tab && (
                      <span className="absolute bottom-[-13px] left-0 w-full h-[2px] bg-[var(--primary-color)] rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Notification List */}
              <div className="max-h-[450px] overflow-y-auto custom-scrollbar bg-white">
                {filteredNotifications.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {filteredNotifications.map((notif) => (
                      <div
                        key={notif._id}
                        className={`flex gap-4 p-5 hover:bg-gray-50/80 transition-all duration-300 group cursor-pointer relative overflow-hidden ${!notif.isRead ? "bg-blue-50/30" : ""}`}
                        onClick={() =>
                          !notif.isRead && handleMarkRead(notif._id)
                        }
                      >
                        {/* Status Indicator Line */}
                        {!notif.isRead && (
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#448CD2]"></div>
                        )}

                        {/* Icon Avatar */}
                        <div
                          className={`mt-1 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${notif.type === "success"
                            ? "bg-green-50 text-green-600"
                            : notif.type === "error"
                              ? "bg-red-50 text-red-600"
                              : "bg-blue-50 text-[#448CD2]"
                            }`}
                        >
                          <Icon
                            icon={
                              notif.type === "success"
                                ? "solar:check-circle-bold"
                                : notif.type === "info"
                                  ? "solar:bell-bold"
                                  : "solar:info-circle-bold"
                            }
                            width="20"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex justify-between items-start mb-1">
                            <p
                              className={`text-sm leading-snug truncate pr-2 ${!notif.isRead ? "font-extrabold text-[#1a3652]" : "font-semibold text-gray-800"}`}
                            >
                              {notif.title}
                            </p>
                            <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap bg-gray-100 px-1.5 py-0.5 rounded border border-gray-100">
                              {notif.type === "success"
                                ? "Confirmed"
                                : "Activity"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 leading-snug line-clamp-2 mb-5">
                            {notif.message}
                          </p>
                          <p className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                            <Icon
                              icon="solar:clock-circle-linear"
                              width="12"
                              className="text-gray-500"
                            />
                            {(() => {
                              try {
                                return formatDistanceToNow(
                                  new Date(notif.createdAt),
                                  { addSuffix: true },
                                );
                              } catch (e) {
                                return "Just now";
                              }
                            })()}
                          </p>
                        </div>

                        {/* Hover Action: Mark Read Check */}
                        {!notif.isRead && (
                          <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="w-2 h-2 bg-[#448CD2] rounded-full block shadow-[0_0_8px_rgba(68,140,210,0.6)]"></span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                      <Icon
                        icon="solar:bell-off-outline"
                        className="text-gray-300 w-8 h-8"
                      />
                    </div>
                    <h5 className="text-gray-900 font-bold mb-1">
                      All Caught Up!
                    </h5>
                    <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
                      You have zero new notifications. We'll alert you when
                      something happens.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="bg-primary-500/5 p-3 border-t border-gray-100 flex justify-center sticky bottom-0 z-20 backdrop-blur-sm">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/dashboard/notifications");
                    }}
                    className="text-xs font-bold text-[#448CD2] hover:text-[#1a3652] transition-colors uppercase tracking-wider flex items-center gap-1"
                  >
                    View All Notification
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close when clicking outside (in case ref fails or for mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-transparent"
          onClick={() => setIsOpen(false)}
          style={{ pointerEvents: "none" }}
        ></div>
      )}
    </>
  );
};

export default TopBar;
