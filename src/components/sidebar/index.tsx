import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import api from "../../services/axios";
import DashboardLogo from "../../../public/static/img/home/logo.svg";
import ProfilePlaceholderImg from "../../../public/static/img/ic-profile-ph.svg";
import { Tooltip } from "react-tooltip";

// import { Tooltip, initTWE } from "tw-elements";
const FIRST_REPORT_ROUTE = "/dashboard/reports/org-head";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState({ firstName: "", lastName: "", role: "" });
  const [openReports, setOpenReports] = useState(false);

  const isReportsRoute = location.pathname.startsWith("/dashboard/reports");

  useEffect(() => {
    setOpenReports(isReportsRoute);
  }, [isReportsRoute]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    api
      .get(`auth/me`)
      .then((res: any) => setUser(res.data))
      .catch((err) => {
        if (err.response?.status === 401) return;
        localStorage.clear();
        navigate("/login");
      });
  }, []);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await api.post(
        `auth/logout`,
        {},
        { withCredentials: true },
      );
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
      window.location.reload();
    }
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
                  navigate(FIRST_REPORT_ROUTE);
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
                <ReportLink
                  to="org-head"
                  label="Org Head / Coach"
                  icon="fluent:organization-20-regular"
                />
                <ReportLink
                  to="senior-leader"
                  label="Senior Leader"
                  icon="solar:user-rounded-outline"
                />
                <ReportLink
                  to="manager"
                  label="Manager"
                  icon="solar:users-group-rounded-outline"
                />
                <ReportLink
                  to="employee"
                  label="Employee"
                  icon="solar:users-group-two-rounded-linear"
                />
              </ul>
            )}
          </li>

          {/* Questions */}
          <li className="mb-2">
            <NavLink
              to="/dashboard/questions"
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

          {/* Invite */}
          <li className="mb-2">
            <NavLink
              to="/dashboard/invite"
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

          {/* Settings */}
          <li className="mb-2">
            <NavLink
              to="/dashboard/settings"
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
                src={ProfilePlaceholderImg}
                alt="Profile"
                className="xl:size-auto size-12"
              />
              <div>
                <h4 className="xl:text-xl text-lg text-[var(--secondary-color)] font-normal truncate xl:max-w-36 md:max-w-20 max-w-32 capitalize">
                  {user.firstName
                    ? `${user.firstName} ${user.lastName}`
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
}: {
  to: string;
  label: string;
  icon: string;
}) => {
  return (
    <li>
      <NavLink
        to={`/dashboard/reports/${to}`}
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
