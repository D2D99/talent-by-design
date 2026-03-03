import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import api from "../../services/axios";
const DashboardLogo = "/static/img/POD-logo.svg";
const PlaceholderOrgLogo = "/static/img/org-ph.svg";
const ProfilePlaceholderImg = "/static/img/ic-profile-ph.svg";
import { Tooltip } from "react-tooltip";

// import { Tooltip, initTWE } from "tw-elements";

interface SidebarProps {
  onClose?: () => void;
}

const THEME_STORAGE_KEY = "tbd-theme";

const clearAuthStorage = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const isLoggingOut = localStorage.getItem("isLoggingOut");
  localStorage.clear();
  sessionStorage.clear();

  if (savedTheme === "light" || savedTheme === "dark") {
    localStorage.setItem(THEME_STORAGE_KEY, savedTheme);
  }

  if (isLoggingOut === "true") {
    localStorage.setItem("isLoggingOut", "true");
    // Remove it after a short delay so it doesn't stay forever
    setTimeout(() => {
      localStorage.removeItem("isLoggingOut");
    }, 1000);
  }

  window.dispatchEvent(new Event("auth-changed"));
};

const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    middleInitial: "",
    lastName: "",
    role: "",
    profileImage: "",
    orgLogo: "",
  });

  const isReportsRoute = location.pathname.startsWith("/dashboard/reports");
  const [openReports, setOpenReports] = useState(isReportsRoute);

  useEffect(() => {
    setOpenReports(isReportsRoute);
  }, [isReportsRoute]);

  useEffect(() => {
    const fetchUser = () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      api
        .get(`auth/me?t=${new Date().getTime()}`)
        .then((res: any) => {
          // console.log("Sidebar User Data:", res.data);
          setUser(res.data);
        })
        .catch((err) => {
          if (err.response?.status === 401) return;
          clearAuthStorage();
          navigate("/login");
        });
    };

    fetchUser();

    // Listen for profile updates
    window.addEventListener("profile-updated", fetchUser);
    return () => window.removeEventListener("profile-updated", fetchUser);
  }, []);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      localStorage.setItem("isLoggingOut", "true");
      await api.post(`auth/logout`, {}, { withCredentials: true });
    } finally {
      clearAuthStorage();
      navigate("/login");
      window.location.reload();
    }
  };

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  // Get the first report route based on user role
  const getFirstReportRoute = () => {
    if (user.role === "superAdmin" || user.role === "admin") {
      return "/dashboard/reports/org-head";
    } else if (user.role === "leader") {
      return "/dashboard/reports/senior-leader";
    } else if (user.role === "manager") {
      return "/dashboard/reports/manager";
    }
    return "/dashboard/reports/employee"; // Default for employees
  };

  const base =
    "flex items-center gap-2 py-2 px-3 rounded text-base font-semibold transition-all duration-300";
  const active =
    "bg-[var(--app-surface-soft)] text-[var(--primary-color)] shadow-sm";
  const inactive =
    "text-[var(--app-text-color)] hover:bg-[var(--app-surface-soft)]";
  // useEffect(() => {
  //   initTWE({ Tooltip });
  // }, []);

  return (
    <div className="flex flex-col justify-between h-full md:p-0 p-4">
      <div>
        {user.role === "superAdmin" && (
          <img
            src={(user as any).orgLogo || DashboardLogo}
            className="xl:max-w-28 max-w-24 mx-auto mb-12 logo"
            alt="Logo"
          />
        )}

        {user.role !== "superAdmin" && (
          <div className="flex items-center justify-center gap-2.5 xl:flex-row md:flex-col mb-12 flex-wrap">
            <img
              src={DashboardLogo}
              className="xl:max-w-28 max-w-24 logo"
              alt="Dashboard Logo"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
            >
              <path
                fill="#448cd2"
                d="M30.674 15.2c.033-.118.072-.233.1-.353l.014-.072a7.27 7.27 0 0 0-1.651-6.612a7.8 7.8 0 0 0-6.323-3.148h-.052c-.1 0-.212.007-.318.01h-.121a40 40 0 0 0-6.282.854l-4.477-.715h-.035a9.74 9.74 0 0 0-6.237 1a8.8 8.8 0 0 0-2.71 2.558l-.041.055l-.025.035a8.6 8.6 0 0 0-.108 9.45c-.019.034-.03.072-.048.107a4 4 0 0 0-.221.537c-.032.1-.056.206-.079.31q-.028.127-.048.254a3 3 0 0 0-.022.319c0 .086-.01.17-.006.255q.01.168.038.334c.012.079.018.158.036.236q.046.185.116.362c.023.063.038.128.066.19q.123.275.3.518A3.34 3.34 0 0 0 4.424 23a2.76 2.76 0 0 0 .95 2.272a4.06 4.06 0 0 0 2.028.954c.155.503.427.962.793 1.34a3.12 3.12 0 0 0 1.905.98c.174.593.504 1.129.956 1.55c.557.548 1.303.86 2.084.87a3.4 3.4 0 0 0 1.639-.434c.744.426 1.616.57 2.458.406a3.06 3.06 0 0 0 2.117-1.509c.021-.033.033-.062.052-.095c.85.174 1.735.021 2.478-.428a3.1 3.1 0 0 0 1.4-1.67c.894.012 1.76-.31 2.427-.905a3.05 3.05 0 0 0 1.026-2.595c0-.028-.007-.05-.009-.077a3 3 0 0 0 1.358-.855a3.29 3.29 0 0 0 .52-3.804a10.2 10.2 0 0 0 2-3.556c.024-.077.044-.161.068-.244m-1.712-1.7a6.3 6.3 0 0 1-.329 1.474l-.032.1a8.5 8.5 0 0 1-1.418 2.448c-3.137-2.738-7.7-6.734-8.075-7.092a2.35 2.35 0 0 0-1.608-.652a1.8 1.8 0 0 0-.549.079c-.634.2-2.192.7-3.552 1.205c-.52.193-1.114-.3-1.295-.72c-.12-.252-.14-.54-.058-.806c.163-.295.437-.514.761-.608a34.5 34.5 0 0 1 9.546-1.9h.121c.111 0 .221-.008.323-.01a5.5 5.5 0 0 1 2.179.413a7.1 7.1 0 0 1 2.624 2.05a5.6 5.6 0 0 1 1.272 2.483l.009.046a5 5 0 0 1 .091.746c.003.081.008.183.008.273c0 .145 0 .289-.017.432zM4.007 20.159q-.009-.066-.007-.135a1.3 1.3 0 0 1 0-.29a2 2 0 0 1 .043-.168q.031-.134.086-.259q.05-.09.113-.172q.09-.148.215-.265l.006-.005l1.881-1.595a1.2 1.2 0 0 1 1.684.22a.8.8 0 0 1 .1.708l-2.95 2.874a1.18 1.18 0 0 1-1.021-.555a.9.9 0 0 1-.15-.358m2.516 2.395L9.76 19.4l-.015-.015a1 1 0 0 1 .589-.092c.257.07.489.214.666.414c.176.15.294.356.334.584a1.23 1.23 0 0 1-.146.665l-.026.085l-3.271 3.187a1.6 1.6 0 0 1-1.234-.5a1.12 1.12 0 0 1-.134-1.174m2.785 3.085l3.38-3.289c.215.043.412.153.562.314a1.3 1.3 0 0 1 .412.693a1 1 0 0 1-.015.347l-2.923 2.845a1.17 1.17 0 0 1-1.075-.36a1.36 1.36 0 0 1-.341-.55m3.137 3.012a1.6 1.6 0 0 1-.418-.58l2.761-2.687c.197.065.377.172.528.313a.96.96 0 0 1 .307.433a.74.74 0 0 1 0 .385a3 3 0 0 1-.611 1.094l-.756.88h.006c-.025.016-.053.023-.076.041a1.64 1.64 0 0 1-1.026.427a1.03 1.03 0 0 1-.715-.306m4.474.307q-.222.035-.446.02l.074-.086l.024-.029l.001.001a6 6 0 0 0 .764-1.221l.442.468q-.055.142-.13.273a1.08 1.08 0 0 1-.729.574m6.4-3.725l-1.779-1.971a.999.999 0 0 0-1.694 1.002a1 1 0 0 0 .208.336l1.436 1.6q-.015.154-.063.3a1.14 1.14 0 0 1-.53.669a1.46 1.46 0 0 1-1.06.216l-1.2-1.274a.99.99 0 0 0-1.03-.259a3 3 0 0 0-.063-.288a2.96 2.96 0 0 0-.887-1.347a3.5 3.5 0 0 0-.985-.635a3 3 0 0 0-.035-.556a3.27 3.27 0 0 0-.977-1.777a3.15 3.15 0 0 0-1.323-.8q.008-.2-.015-.4a2.97 2.97 0 0 0-.912-1.759a3.35 3.35 0 0 0-1.671-.951a2.7 2.7 0 0 0-.659-.045a2.6 2.6 0 0 0-.465-1.025a3.2 3.2 0 0 0-4.493-.579l-.035.028l-1.235 1.04a6.54 6.54 0 0 1 .314-6.812l.021-.03A6.8 6.8 0 0 1 6.292 7.9a7.76 7.76 0 0 1 4.982-.751l.464.074A3.06 3.06 0 0 0 10.2 8.77a3.02 3.02 0 0 0 .066 2.356a3.154 3.154 0 0 0 3.834 1.812c1.32-.489 2.834-.98 3.4-1.159a.3.3 0 0 1 .238.105c.489.46 6.392 5.627 8.858 7.776l.2.171a1.32 1.32 0 0 1-.183 1.62a1 1 0 0 1-.535.3l-1.733-1.757a1.004 1.004 0 0 0-1.432 1.406l1.656 1.678q.01.045.024.089l.012.031a2.5 2.5 0 0 1 .135.662a1.06 1.06 0 0 1-.321.943c-.299.28-.694.434-1.103.43z"
              />
            </svg>
            <img
              src={(user as any).orgLogo || PlaceholderOrgLogo}
              className="xl:max-w-28 max-w-24 logo"
              alt="Logo"
            />
          </div>
        )}

        <ul>
          {/* Overview */}
          <li className="mb-2">
            <NavLink
              to="/dashboard"
              end
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `${base} ${isActive ? active : inactive}`
              }
              data-tooltip-id="menu-item1"
              data-tooltip-content="Overview"
            >
              <Icon icon="hugeicons:dashboard-square-02" width="22" />
              <span>Overview</span>
              <Tooltip
                id="menu-item1"
                className="md:hidden block"
                place="right"
              />
            </NavLink>
          </li>

          {user.role === "superAdmin" && (
            <li className="mb-2">
              <NavLink
                to="/dashboard/org-assessments"
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `${base} ${isActive ? active : inactive}`
                }
                data-tooltip-id="menu-item-org-assessments"
                data-tooltip-content="Assessments"
              >
                {/* <Icon icon="solar:chart-square-linear" width="22" /> */}
                <Icon
                  icon="fluent:organization-28-regular"
                  width="22"
                  height="22"
                />
                <span>Organizations</span>
                <Tooltip
                  id="menu-item-org-assessments"
                  className="md:hidden block"
                  place="right"
                />
              </NavLink>
            </li>
          )}

          {user.role === "admin" && (
            <li className="mb-2">
              <NavLink
                to="/dashboard/team-assessments"
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `${base} ${isActive ? active : inactive}`
                }
                data-tooltip-id="menu-item-assessment"
                data-tooltip-content="Assessments"
              >
                <Icon icon="hugeicons:task-done-02" width="22" height="22" />
                <span>Assessments</span>
                <Tooltip
                  id="menu-item-assessment"
                  className="md:hidden block"
                  place="right"
                />
              </NavLink>
            </li>
          )}

          {/* Reports */}
          <li className="mb-2">
            <button
              onClick={() => {
                setOpenReports(true);

                if (!isReportsRoute) {
                  navigate(getFirstReportRoute());
                }
              }}
              className={`${base} w-full justify-between ${
                isReportsRoute ? active : inactive
              }`}
              data-tooltip-id="menu-item2"
              data-tooltip-content="Reports"
            >
              <span className="flex items-center gap-2">
                <Icon icon="majesticons:analytics-line" width="22" />
                <span>Reports</span>
                <Tooltip
                  id="menu-item2"
                  className="md:hidden block"
                  place="right"
                />
              </span>
              <Icon
                icon="weui:arrow-filled"
                width="10"
                className={`transition-transform ${
                  openReports ? "rotate-90" : ""
                }`}
              />
            </button>

            {openReports && (
              <ul className="pl-6 mt-2 space-y-1" id="sub-menu">
                {(user.role === "superAdmin" || user.role === "admin") && (
                  <ReportLink
                    to="org-head"
                    label="Org Head / Coach"
                    icon="fluent:organization-20-regular"
                    onClose={onClose}
                  />
                )}
                {(user.role === "superAdmin" ||
                  user.role === "admin" ||
                  user.role === "leader") && (
                  <ReportLink
                    to="senior-leader"
                    label="Senior Leader"
                    icon="solar:user-rounded-outline"
                    onClose={onClose}
                  />
                )}
                {(user.role === "superAdmin" ||
                  user.role === "admin" ||
                  user.role === "leader" ||
                  user.role === "manager") && (
                  <ReportLink
                    to="manager"
                    label="Manager"
                    icon="solar:users-group-rounded-outline"
                    onClose={onClose}
                  />
                )}
                <ReportLink
                  to="employee"
                  label="Employee"
                  icon="solar:users-group-two-rounded-linear"
                  onClose={onClose}
                />
              </ul>
            )}
          </li>

          {/* Questions - Only for Super Admin */}
          {user.role === "superAdmin" && (
            <li className="mb-2">
              <NavLink
                to="/dashboard/questions"
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `${base} ${isActive ? active : inactive}`
                }
                data-tooltip-id="menu-item3"
                data-tooltip-content="Questions"
              >
                <Icon icon="mingcute:question-line" width="22" />
                <span>Questions</span>
                <Tooltip
                  id="menu-item3"
                  className="md:hidden block"
                  place="right"
                />
              </NavLink>
            </li>
          )}

          {/* Invite - Only for Super Admin and Admin */}
          {(user.role === "superAdmin" || user.role === "admin") && (
            <li className="mb-2">
              <NavLink
                to="/dashboard/invite"
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `${base} ${isActive || location.pathname.startsWith("/dashboard/organization") ? active : inactive}`
                }
                data-tooltip-id="menu-item4"
                data-tooltip-content="Invite"
              >
                <Icon icon="mingcute:invite-line" width="22" />
                <span>Invite</span>
                <Tooltip
                  id="menu-item4"
                  className="md:hidden block"
                  place="right"
                />
              </NavLink>
            </li>
          )}

          {/* Users - For Admin, Leader, and Manager */}
          {(user.role === "admin" ||
            user.role === "leader" ||
            user.role === "manager") && (
            <li className="mb-2">
              <NavLink
                to="/dashboard/users"
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `${base} ${isActive ? active : inactive}`
                }
                data-tooltip-id="menu-item-users"
                data-tooltip-content="Users"
              >
                <Icon icon="solar:users-group-rounded-linear" width="22" />
                <span>Users</span>
                <Tooltip
                  id="menu-item-users"
                  className="md:hidden block"
                  place="right"
                />
              </NavLink>
            </li>
          )}

          {/* Settings */}
          <li className="mb-2">
            <NavLink
              to="/dashboard/settings"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `${base} ${isActive ? active : inactive}`
              }
              data-tooltip-id="menu-item1"
              data-tooltip-content="Settings"
            >
              <Icon icon="uil:setting" width="22" />
              <span>Settings</span>
              <Tooltip
                id="menu-item5"
                className="md:hidden block"
                place="right"
              />
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Profile Section */}
      <div className="relative" data-twe-dropdown-ref>
        <button
          className="transition duration-150 ease-in-out focus:outline-none w-full"
          type="button"
          id="dropdownMenuButton1"
          data-twe-dropdown-toggle-ref
        >
          <div className="md:mx-0 manager-popup flex items-center justify-between bg-[var(--app-surface-soft)] md:p-4 !p-3 rounded-[12px] text-left transition-all duration-300">
            <div className="flex items-center gap-2 w-full">
              <img
                key={user.profileImage || "placeholder"}
                src={user.profileImage || ProfilePlaceholderImg}
                alt={`${user.firstName || "User"}'s profile`}
                className="md:w-14 md:h-14 w-12 h-12 rounded-full object-cover shrink-0 border border-[var(--app-border-color)]/20 bg-[var(--app-surface)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = ProfilePlaceholderImg;
                }}
              />
              <div>
                <h4 className="xl:text-xl text-lg text-[var(--secondary-color)] font-normal truncate xl:max-w-36 md:max-w-20 max-w-32 capitalize">
                  {user.firstName
                    ? `${user.firstName}${user.middleInitial ? ` ${user.middleInitial}` : ""} ${user.lastName}`
                    : "Loading..."}
                </h4>
                <h5 className="xl:text-base text-sm text-[var(--secondary-color)] font-semibold capitalize !leading-4">
                  {user.role || "User"}
                </h5>
              </div>
            </div>
            <Icon
              icon="pepicons-pencil:dots-y"
              width="20"
              height="20"
              className="ic-hidden"
            />
          </div>
        </button>
        <ul
          className="absolute z-[1000] float-left m-0 hidden min-w-32 list-none overflow-hidden rounded-lg border-none bg-[var(--app-surface)] shadow-xl data-[twe-dropdown-show]:block custom-inset ring-1 ring-black/5"
          aria-labelledby="dropdownMenuButton1"
          data-twe-dropdown-menu-ref
        >
          <li className="bg-white hover:bg-neutral-100">
            <NavLink
              to={`/dashboard/user-profile`}
              onClick={handleLinkClick}
              // className={({ isActive }) =>
              //   `flex items-center gap-2 py-2 px-3 rounded text-sm font-semibold ${
              //     isActive
              //       ? "bg-[#E4F0FC] text-[var(--primary-color)]"
              //       : "text-[var(--secondary-color)] hover:bg-[#E4F0FC]"
              //   }`
              // }
              className="w-full px-4 py-2 text-sm font-medium text-neutral-700 flex items-center gap-1.5"
              data-twe-dropdown-item-ref
            >
              <Icon icon="solar:user-linear" width="14" height="14" />
              Profile
            </NavLink>
          </li>
          <li className="bg-white hover:bg-neutral-100">
            <NavLink
              to={"#"}
              className="w-full px-4 py-2 text-sm font-medium text-neutral-700 flex items-center gap-1.5"
              data-twe-dropdown-item-ref
            >
              <Icon icon="si:help-line" width="14" height="14" />
              Help
            </NavLink>
          </li>
          <hr />
          <li className="bg-white hover:bg-red-50">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm font-medium text-red-700 flex items-center gap-1.5"
              data-twe-dropdown-item-ref
            >
              <Icon icon="hugeicons:logout-square-01" width="14" height="14" />
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

// Report Sub Menu
const ReportLink = ({
  to,
  label,
  icon,
  onClose,
}: {
  to: string;
  label: string;
  icon: string;
  onClose?: () => void;
}) => {
  return (
    <li>
      <NavLink
        to={`/dashboard/reports/${to}`}
        onClick={() => onClose && onClose()}
        className={({ isActive }) =>
          `flex items-center gap-2 py-2 px-3 rounded text-sm font-semibold transition-all duration-300 ${
            isActive
              ? "bg-[var(--app-surface-soft)] text-[var(--primary-color)]"
              : "text-[var(--app-text-muted)] hover:bg-[var(--app-surface-soft)]"
          }`
        }
        data-tooltip-id="menu-item6"
        data-tooltip-content={label}
      >
        <Icon icon={icon} width="18" />
        <span>{label}</span>
        <Tooltip id="menu-item6" className="md:hidden block" place="right" />
      </NavLink>
    </li>
  );
};
