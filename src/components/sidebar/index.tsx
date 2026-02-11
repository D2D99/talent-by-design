import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import api from "../../services/axios";
const DashboardLogo = "/static/img/home/logo.svg";
const ProfilePlaceholderImg = "/static/img/ic-profile-ph.svg";
import { Tooltip } from "react-tooltip";

// import { Tooltip, initTWE } from "tw-elements";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    middleInitial: "",
    lastName: "",
    role: "",
    profileImage: "",
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
          localStorage.clear();
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
      await api.post(`auth/logout`, {}, { withCredentials: true });
    } finally {
      localStorage.clear();
      sessionStorage.clear();
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
    "flex items-center gap-2 py-2 px-3 rounded text-base font-semibold";
  const active = "bg-[#E4F0FC] text-[var(--primary-color)]";
  const inactive = "text-[var(--secondary-color)] hover:bg-[#E4F0FC]";
  // useEffect(() => {
  //   initTWE({ Tooltip });
  // }, []);

  return (
    <div className="flex flex-col justify-between h-full md:p-0 p-4">
      <div>
        <img src={DashboardLogo} className="mx-auto mb-12 max-w-[135px] logo" />

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

          {/* Reports */}
          <li className="mb-2">
            <button
              onClick={() => {
                setOpenReports(true);

                if (!isReportsRoute) {
                  navigate(getFirstReportRoute());
                }
              }}
              className={`${base} w-full justify-between ${isReportsRoute ? active : inactive
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
                className={`transition-transform ${openReports ? "rotate-90" : ""
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
                {(user.role === "superAdmin" || user.role === "admin" || user.role === "leader") && (
                  <ReportLink
                    to="senior-leader"
                    label="Senior Leader"
                    icon="solar:user-rounded-outline"
                    onClose={onClose}
                  />
                )}
                {(user.role === "superAdmin" || user.role === "admin" || user.role === "leader" || user.role === "manager") && (
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
                  `${base} ${isActive ? active : inactive}`
                }
                data-tooltip-id="menu-item1"
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

          {/* Users - Only for Admin */}
          {user.role === "admin" && (
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
          <div className="md:mx-0 manager-popup flex items-center justify-between bg-[#4B9BE91A] md:p-4 !p-3 rounded-[12px] text-left">
            <div className="flex items-center gap-2 w-full">
              <img
                key={user.profileImage || "placeholder"}
                src={user.profileImage || ProfilePlaceholderImg}
                alt={`${user.firstName || "User"}'s profile`}
                className="md:w-14 md:h-14 w-12 h-12 rounded-full object-cover shrink-0 border border-[#448CD2]/10 bg-white"
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
          className="absolute z-[1000] float-left m-0 hidden min-w-32 list-none overflow-hidden rounded-lg border-none bg-white shadow data-[twe-dropdown-show]:block custom-inset"
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
          `flex items-center gap-2 py-2 px-3 rounded text-sm font-semibold ${isActive
            ? "bg-[#E4F0FC] text-[var(--primary-color)]"
            : "text-[var(--secondary-color)] hover:bg-[#E4F0FC]"
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
