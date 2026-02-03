import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import IconamoonArrow from "../../../public/static/img/icons/iconamoon_arrow.png";
import Sidebar from "../sidebar";
import TopBar from "../topBar";
import { Offcanvas, Ripple, Dropdown, initTWE } from "tw-elements";

const Dashboard = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    initTWE({ Offcanvas, Ripple, Dropdown });
  }, []);

  return (
    <div
      className={`main-wrapper flex gap-6 min-h-screen relative bg-[#EDF5FD] md:p-6 p-3 ${
        isActive ? "active" : ""
      }`}
    >
      {/* Sidebar */}
      <div className="md:block hidden fixed h-[-webkit-fill-available] mb-6 xl:max-w-80 max-w-64 w-full bg-white border border-[#448CD2] border-opacity-20 shadow rounded-[12px] pt-8 pr-6 pb-6 pl-6 sidebar">
        <Sidebar />

        <div
          className="restore-sidebar absolute top-[80px] right-[-12px] cursor-pointer"
          onClick={() => setIsActive(!isActive)}
        >
          <img src={IconamoonArrow} alt="arrow" className="rotate-180" />
        </div>
      </div>

      {/* Right Content */}
      <div className="xl:ml-[343px] md:ml-[278px] w-full right-content">
        {/* Mobile Sidebar Offcanvas */}
        <div
          className="invisible fixed bottom-0 left-0 top-0 z-[1045] flex w-96 max-w-full -translate-x-full flex-col border-none bg-white bg-clip-padding text-neutral-700 shadow-sm outline-none transition duration-300 ease-in-out data-[twe-offcanvas-show]:transform-none"
          tabIndex={-1}
          id="offcanvasExample"
          aria-labelledby="offcanvasExampleLabel"
          data-twe-offcanvas-init
        >
          <div className="flex items-center justify-end p-4">
            <button
              type="button"
              className="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none"
              data-twe-offcanvas-dismiss
              aria-label="Close"
            >
              <span className="[&>svg]:h-6 [&>svg]:w-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            </button>
          </div>
          <Sidebar />
        </div>
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
