import DashboardLogo from "../../../public/static/img/home/logo.svg";
// import Manager from "../../../public/static/img/home/lisa-manager.png";
import SuperAdminImg from "../../../public/static/img/ic-sadmin.svg";

import { Icon } from "@iconify/react";
import { Collapse, Ripple, initTWE, Dropdown } from "tw-elements";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  useEffect(() => {
    initTWE({ Collapse, Ripple, Dropdown });
  }, []);

  return (
    <>
      <div className="flex justify-between flex-col h-full">
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
              <li className="mb-2">
                <NavLink
                  to={"/dashboard"}
                  // className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC] hover:text-[var(--primary-color)]"
                  className={({ isActive }) =>
                    isActive
                      ? "active flex items-center text-base font-semibold  gap-2 py-2 px-3 rounded-[4px] bg-[var(--light-primary-color)] text-[var(--primary-color)]"
                      : "flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px]"
                  }
                >
                  <Icon
                    icon="hugeicons:dashboard-square-02"
                    width="22"
                    height="22"
                  />
                  <span>Dashboard</span>
                </NavLink>
              </li>

              <li className="mb-2 relative">
                <a
                  data-twe-collapse-init
                  data-twe-ripple-init
                  data-twe-ripple-color="light"
                  href="#collapseExample"
                  role="button"
                  aria-expanded="false"
                  aria-controls="collapseExample"
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
                  id="collapseExample"
                  data-twe-collapse-item
                >
                  <ul className="pl-4 mt-2" id="dashboard-menu">
                    <li className="mb-1">
                      <NavLink
                        to={"#"}
                        className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC] hover:text-[var(--primary-color)]"
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
                        className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC] hover:text-[var(--primary-color)]"
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
                        className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC] hover:text-[var(--primary-color)]"
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
                        className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC] hover:text-[var(--primary-color)]"
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

              <li className="mb-2">
                <NavLink
                  to={"#"}
                  className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC] hover:text-[var(--primary-color)] "
                >
                  <Icon icon="mingcute:question-line" width="22" height="22" />
                  <span>Questions</span>
                </NavLink>
              </li>

              <li className="mb-2">
                <NavLink
                  to={"/dashboard/settings"}
                  className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC] hover:text-[var(--primary-color)] "
                >
                  <Icon icon="mingcute:invite-line" width="22" height="22" />
                  <span>Invite</span>
                </NavLink>
              </li>

              <li className="mb-2">
                <NavLink
                  to={"#"}
                  className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC] hover:text-[var(--primary-color)] "
                >
                  <Icon icon="uil:setting" width="22" height="22" />
                  <span>Settings</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Profile */}
        <div className=" md:mx-0 mx-3 manager-popup flex items-center justify-between bg-[#4B9BE91A] p-4 rounded-[12px]">
          <div className="flex items-center gap-2 ">
            <img
              src={SuperAdminImg}
              alt="Profile Picture"
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
              className="flex items-center transition duration-150 ease-in-out focus:outline-none focus:ring-0"
              type="button"
              id="dropdownMenuButton1"
              data-twe-dropdown-toggle-ref
              aria-expanded="false"
              data-twe-ripple-init
              data-twe-ripple-color="light"
            >
              <Icon icon="pepicons-pencil:dots-y" width="20" height="20" />
            </button>
            <ul
              className="absolute z-[1000] float-left m-0 hidden min-w-32 list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-base shadow data-[twe-dropdown-show]:block"
              aria-labelledby="dropdownMenuButton1"
              data-twe-dropdown-menu-ref
            >
              <li className="bg-white hover:bg-neutral-100">
                <NavLink
                  to={"#"}
                  className="w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-medium text-neutral-700 focus:outline-none active:no-underline flex items-center gap-1.5"
                  data-twe-dropdown-item-ref
                >
                  <Icon
                    icon="solar:user-linear"
                    width="14"
                    height="14"
                    className="text-neutral-700"
                  />
                  Profile
                </NavLink>
              </li>
              <li className="bg-white hover:bg-neutral-100">
                <NavLink
                  to={"#"}
                  className="w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-medium text-neutral-700 focus:outline-none active:no-underline flex items-center gap-1.5"
                  data-twe-dropdown-item-ref
                >
                  <Icon
                    icon="si:help-line"
                    width="14"
                    height="14"
                    className="text-neutral-700"
                  />
                  Help
                </NavLink>
              </li>
              <hr />
              <li className="bg-white hover:bg-red-50">
                <NavLink
                  to={"/"}
                  className="w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-medium text-red-700 focus:outline-none active:no-underline flex items-center gap-1.5"
                  data-twe-dropdown-item-ref
                >
                  <Icon
                    icon="hugeicons:logout-square-01"
                    width="14"
                    height="14"
                    className="text-red-700"
                  />
                  Log Out
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
