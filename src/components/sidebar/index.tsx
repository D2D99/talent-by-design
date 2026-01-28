import DashboardLogo from "../../../public/static/img/home/logo.svg";
import SuperAdminImg from "../../../public/static/img/ic-sadmin.svg";
import { Icon } from "@iconify/react";
import { Collapse, Ripple, initTWE, Dropdown } from "tw-elements";
import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    initTWE({ Collapse, Ripple, Dropdown });
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
      // This ensures storage is wiped and user is redirected regardless of server response
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
      window.location.reload();
    }
  };

  return (
    <>
      <div className="flex justify-between flex-col h-full md:p-0 p-4">
        <div>
          <div className="logo mb-12 ">
            <a href="">
              <img
                src={DashboardLogo}
                className="mx-auto w-full max-w-[135px]"
                alt="logo"
              />
            </a>
          </div>
          <div className="dashboard-menu">
            <ul>
              {/* Overview */}
              <li className="mb-2">
                <NavLink
                  to={"/dashboard"}
                  className={({ isActive }) =>
                    isActive
                      ? "active flex items-center text-base font-semibold gap-2 py-2 px-3 rounded-[4px] bg-[var(--light-primary-color)] text-[var(--primary-color)]"
                      : "flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px]"
                  }
                >
                  <Icon
                    icon="hugeicons:dashboard-square-02"
                    width="22"
                    height="22"
                  />
                  <span>Overview</span>
                </NavLink>
              </li>

              {/* Reports Dropdown */}
              <li className="mb-2 relative">
                <a
                  data-twe-collapse-init
                  data-twe-ripple-init
                  data-twe-ripple-color="light"
                  href="#collapseReports"
                  role="button"
                  aria-expanded="false"
                  aria-controls="collapseReports"
                  className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC] hover:text-[var(--primary-color)] "
                >
                  <Icon
                    icon="majesticons:analytics-line"
                    width="22"
                    height="22"
                  />
                  <span>Reports</span>
                  <Icon
                    className="dashboard-icon absolute right-[12px] rotate-90"
                    icon="weui:arrow-filled"
                    width="12"
                    height="20"
                  />
                </a>
                <div
                  className="!visible hidden text-center"
                  id="collapseReports"
                  data-twe-collapse-item
                >
                  <ul className="pl-4 mt-2">
                    <li className="mb-1">
                      <NavLink
                        to={"#"}
                        className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC]"
                      >
                        <Icon
                          icon="fluent:organization-20-regular"
                          width="20"
                          height="20"
                        />
                        <span>Org Head/Coach</span>
                      </NavLink>
                    </li>
                    <li className="mb-1">
                      <NavLink
                        to={"#"}
                        className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC]"
                      >
                        <Icon
                          icon="solar:user-rounded-outline"
                          width="20"
                          height="20"
                        />
                        <span>Senior Leader</span>
                      </NavLink>
                    </li>
                    <li className="mb-1">
                      <NavLink
                        to={"#"}
                        className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC]"
                      >
                        <Icon
                          icon="solar:users-group-rounded-outline"
                          width="20"
                          height="20"
                        />
                        <span>Manager</span>
                      </NavLink>
                    </li>
                    <li className="mb-1">
                      <NavLink
                        to={"#"}
                        className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC]"
                      >
                        <Icon
                          icon="solar:users-group-two-rounded-linear"
                          width="20"
                          height="20"
                        />
                        <span>Employee</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>

              {/* Questions */}
              <li className="mb-2">
                <NavLink
                  to={"/dashboard/questions"}
                  className={({ isActive }) =>
                    isActive
                      ? "active flex items-center text-base font-semibold gap-2 py-2 px-3 rounded-[4px] bg-[var(--light-primary-color)] text-[var(--primary-color)]"
                      : "flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px]"
                  }
                >
                  <Icon icon="mingcute:question-line" width="22" height="22" />
                  <span>Questions</span>
                </NavLink>
              </li>

              {/* Invite */}
              <li className="mb-2">
                <NavLink
                  to={"/dashboard/invite"}
                  className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC] hover:text-[var(--primary-color)] "
                >
                  <Icon icon="mingcute:invite-line" width="22" height="22" />
                  <span>Invite</span>
                </NavLink>
              </li>

              {/* Settings */}
              <li className="mb-2">
                <NavLink
                  to={"/dashboard/settings"}
                  className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC] hover:text-[var(--primary-color)] "
                >
                  <Icon icon="uil:setting" width="22" height="22" />
                  <span>Settings</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Profile Section */}
        {/* <div className="md:mx-0 mx-3 manager-popup flex items-center justify-between bg-[#4B9BE91A] p-4 rounded-[12px]">
          <div className="flex items-center gap-2 ">
            <img
              src={SuperAdminImg}
              alt="Profile"
              className="xl:size-auto size-12"
            />
            <div>
              <h4 className="xl:text-xl text-lg text-[var(--secondary-color)] font-normal truncate xl:max-w-36 max-w-20 capitalize">
                Suzanna de Souza
              </h4>
              <h4 className="xl:text-base text-sm text-[var(--secondary-color)] font-semibold">
                Super Admin
              </h4>
            </div>
          </div>

          <div className="relative" data-twe-dropdown-ref>
            <button
              className="flex items-center transition duration-150 ease-in-out focus:outline-none"
              type="button"
              id="dropdownMenuButton1"
              data-twe-dropdown-toggle-ref
            >
              <Icon icon="pepicons-pencil:dots-y" width="20" height="20" />
            </button>
            <ul
              className="absolute z-[1000] float-left m-0 hidden min-w-32 list-none overflow-hidden rounded-lg border-none bg-white shadow data-[twe-dropdown-show]:block"
              aria-labelledby="dropdownMenuButton1"
              data-twe-dropdown-menu-ref
            >
              <li className="bg-white hover:bg-neutral-100">
                <NavLink
                  to={"#"}
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
                  <Icon
                    icon="hugeicons:logout-square-01"
                    width="14"
                    height="14"
                  />
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        </div> */}

        {/* <div className="md:mx-0 mx-3 manager-popup flex items-center justify-between bg-[#4B9BE91A] p-4 rounded-[12px]"> */}
        <div className="relative" data-twe-dropdown-ref>
          <button
            className="transition duration-150 ease-in-out focus:outline-none w-full"
            type="button"
            id="dropdownMenuButton1"
            data-twe-dropdown-toggle-ref
          >
            <div className="md:mx-0 mx-3 manager-popup flex items-center justify-between bg-[#4B9BE91A] p-4 rounded-[12px] text-left">
              <div className="flex items-center gap-2 w-full">
                <img
                  src={SuperAdminImg}
                  alt="Profile"
                  className="xl:size-auto size-12"
                />
                <div>
                  <h4 className="xl:text-xl text-lg text-[var(--secondary-color)] font-normal truncate xl:max-w-36 md:max-w-20 max-w-32 capitalize">
                    Suzanna de Souza
                  </h4>
                  <h4 className="xl:text-base text-sm text-[var(--secondary-color)] font-semibold">
                    Super Admin
                  </h4>
                </div>
              </div>
              <Icon icon="pepicons-pencil:dots-y" width="20" height="20" />
            </div>
          </button>
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
                <Icon
                  icon="hugeicons:logout-square-01"
                  width="14"
                  height="14"
                />
                Log Out
              </button>
            </li>
          </ul>
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
