import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLogo from "../../../public/static/img/home/logo.svg";
import ProfilePlaceholderImg from "../../../public/static/img/ic-profile-ph.svg";
import { Tooltip, initTWE } from "tw-elements";

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

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.clear();
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    initTWE({ Tooltip });
  }, []);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}auth/logout`,
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

  return (
    <div className="flex flex-col justify-between h-full md:p-0 p-4">
      <div>
        <img
          src={DashboardLogo}
          className="mx-auto mb-12 max-w-[135px] logo"
          alt="Logo"
        />

        <ul>
          {/* Overview */}
          <li className="mb-2">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `${base} ${isActive ? active : inactive}`
              }
              data-twe-toggle="tooltip"
              title="Overview"
              data-twe-placement="right"
            >
              <Icon
                icon="hugeicons:dashboard-square-02"
                width="22"
                className="shrink-0"
              />
              <span className="hidden md:block">Overview</span>
            </NavLink>
          </li>

          {/* Reports */}
          <li className="mb-2">
            <button
              onClick={() => {
                setOpenReports(!openReports);
                if (!isReportsRoute) {
                  navigate(FIRST_REPORT_ROUTE);
                }
              }}
              className={`${base} w-full justify-between ${isReportsRoute ? active : inactive}`}
              data-twe-toggle="tooltip"
              title="Reports"
              data-twe-placement="right"
            >
              <span className="flex items-center gap-2">
                <Icon
                  icon="majesticons:analytics-line"
                  width="22"
                  className="shrink-0"
                />
                <span className="hidden md:block">Reports</span>
              </span>
              <Icon
                icon="weui:arrow-filled"
                width="10"
                className={`transition-transform hidden md:block ${openReports ? "rotate-90" : ""}`}
              />
            </button>

            {openReports && (
              <ul className="md:pl-6 pl-0 mt-2 space-y-1" id="sub-menu">
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
              data-twe-toggle="tooltip"
              title="Questions"
              data-twe-placement="right"
            >
              <Icon
                icon="mingcute:question-line"
                width="22"
                className="shrink-0"
              />
              <span className="hidden md:block">Questions</span>
            </NavLink>
          </li>

          {/* Invite */}
          <li className="mb-2">
            <NavLink
              to="/dashboard/invite"
              className={({ isActive }) =>
                `${base} ${isActive ? active : inactive}`
              }
              data-twe-toggle="tooltip"
              title="Invite"
              data-twe-placement="right"
            >
              <Icon
                icon="mingcute:invite-line"
                width="22"
                className="shrink-0"
              />
              <span className="hidden md:block">Invite</span>
            </NavLink>
          </li>

          {/* Settings */}
          <li className="mb-2">
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) =>
                `${base} ${isActive ? active : inactive}`
              }
              data-twe-toggle="tooltip"
              title="Settings"
              data-twe-placement="right"
            >
              <Icon icon="uil:setting" width="22" className="shrink-0" />
              <span className="hidden md:block">Settings</span>
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
          <div className="md:mx-0 mx-3 flex items-center justify-center md:justify-between bg-[#4B9BE91A] p-3 md:p-4 rounded-[12px] text-left">
            <div className="flex items-center gap-2">
              <img
                src={ProfilePlaceholderImg}
                alt="Profile"
                className="size-10 md:size-12 shrink-0"
              />
              <div className="hidden md:block">
                <h4 className="text-sm text-[var(--secondary-color)] font-normal truncate max-w-24 capitalize">
                  {user.firstName
                    ? `${user.firstName} ${user.lastName}`
                    : "Loading..."}
                </h4>
                <h5 className="text-xs text-[var(--secondary-color)] font-semibold capitalize leading-tight">
                  {user.role || "User"}
                </h5>
              </div>
            </div>
            <Icon
              icon="pepicons-pencil:dots-y"
              width="20"
              height="20"
              className="hidden md:block"
            />
          </div>
        </button>
        {/* Dropdown Menu */}
        <ul
          className="absolute z-[1000] float-left m-0 hidden min-w-32 list-none overflow-hidden rounded-lg border-none bg-white shadow data-[twe-dropdown-show]:block custom-inset"
          aria-labelledby="dropdownMenuButton1"
          data-twe-dropdown-menu-ref
        >
          <li className="bg-white hover:bg-neutral-100">
            <NavLink
              to={"#"}
              className="w-full px-4 py-2 text-sm font-medium text-neutral-700 flex items-center gap-1.5"
              data-twe-dropdown-item-ref
            >
              <Icon icon="solar:user-linear" width="14" height="14" /> Profile
            </NavLink>
          </li>
          <li className="bg-white hover:bg-neutral-100">
            <NavLink
              to={"#"}
              className="w-full px-4 py-2 text-sm font-medium text-neutral-700 flex items-center gap-1.5"
              data-twe-dropdown-item-ref
            >
              <Icon icon="si:help-line" width="14" height="14" /> Help
            </NavLink>
          </li>
          <hr className="my-1 border-neutral-100" />
          <li className="bg-white hover:bg-red-50">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm font-medium text-red-700 flex items-center gap-1.5"
              data-twe-dropdown-item-ref
            >
              <Icon icon="hugeicons:logout-square-01" width="14" height="14" />{" "}
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

// Sub-Menu Link Component
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
          `flex items-center gap-2 py-2 px-3 rounded text-sm font-semibold ${
            isActive
              ? "bg-[#E4F0FC] text-[var(--primary-color)]"
              : "text-[var(--secondary-color)] hover:bg-[#E4F0FC]"
          }`
        }
        data-twe-toggle="tooltip"
        title={label}
        data-twe-placement="right"
      >
        <Icon icon={icon} width="18" className="shrink-0" />
        <span className="hidden md:block whitespace-nowrap">{label}</span>
      </NavLink>
    </li>
  );
};

export default Sidebar;
