import DashboardLogo from "../../../public/static/img/home/logo.svg";
import Manager from "../../../public/static/img/home/lisa-manager.png";

import { Icon } from "@iconify/react";
import { Collapse, Ripple, initTWE, Dropdown } from "tw-elements";
import { useEffect } from "react";

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
              <li className=" mb-2">
                <a
                  href=""
                  className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC] hover:text-[var(--primary-color)] "
                >
                  <Icon
                    icon="hugeicons:dashboard-square-02"
                    width="22"
                    height="22"
                  />
                  <span>Dashboard</span>
                </a>
              </li>
              <li className=" mb-2 relative">
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
                  <ul className="pl-4 mt-2 " id="dashboard-menu">
                    <li className=" mb-2">
                      <a
                        href=""
                        className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC] hover:text-[var(--primary-color)] "
                      >
                        <Icon
                          icon="mingcute:user-3-line"
                          width="20"
                          height="20"
                        />

                        <span>Employee</span>
                      </a>
                    </li>
                    <li className=" mb-2">
                      <a
                        href=""
                        className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC] hover:text-[var(--primary-color)] "
                      >
                        <Icon
                          icon="fa6-solid:user-secret"
                          width="20"
                          height="20"
                        />

                        <span>Manager</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li className=" mb-2">
                <a
                  href=""
                  className="flex items-center text-base font-semibold text-[var(--secondary-color)] gap-2 py-2 px-3 rounded-[4px] hover:bg-[#E4F0FC] hover:text-[var(--primary-color)] "
                >
                  <Icon icon="uil:setting" width="22" height="22" />
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className=" md:mx-0 mx-3 manager-popup flex items-center justify-between bg-[#4B9BE91A] p-4 rounded-[12px]">
          <div className="flex items-center gap-2 ">
            <img src={Manager} alt="Manager" />
            <div>
              <h4 className="text-xl text-[var(--secondary-color)] font-normal">
                Lisa A.
              </h4>
              <h4 className="text-base text-[var(--secondary-color)] font-semibold">
                Manager
              </h4>
            </div>
          </div>

          <div className="relative " data-twe-dropdown-ref>
            <button
              type="button"
              id="dropdownMenuButton1"
              data-twe-dropdown-toggle-ref
              aria-expanded="false"
              data-twe-ripple-init
              data-twe-ripple-color="light"
            >
              <Icon icon="pepicons-pencil:dots-y" width="20" height="20" />
              <ul
                className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-base shadow-lg data-[twe-dropdown-show]:block dark:bg-surface-dark"
                aria-labelledby="dropdownMenuButton1"
                data-twe-dropdown-menu-ref
              >
                <li>
                  <a href="" data-twe-dropdown-item-ref>
                    ds
                  </a>
                </li>
                <li>
                  <a href="" data-twe-dropdown-item-ref>
                    ds
                  </a>
                </li>
              </ul>
            </button>
          </div>
        </div>
      </div>
    
    </>
  );
};

export default Sidebar;
