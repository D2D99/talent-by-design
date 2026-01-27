import { Icon } from "@iconify/react";
import IconArrow from "../../../public/static/img/icons/iconamoon_arrow.png";
import { Dropdown, Ripple, initTWE, Offcanvas } from "tw-elements";
import { useEffect } from "react";
import Sidebar from "../../components/sidebar";
import OrgInvitation from "../../components/orgInvitation";

const AdminOverview = () => {
  useEffect(() => {
    initTWE({ Ripple, Offcanvas, Dropdown });
  }, []);

  return (
    <>
      {/* Super Admin Overview Start */}
      <div>
        <div
          className="invisible fixed bottom-0 left-0 top-0 z-[1045] flex w-96 max-w-full -translate-x-full flex-col border-none bg-white bg-clip-padding text-neutral-700 shadow-sm outline-none transition duration-300 ease-in-out data-[twe-offcanvas-show]:transform-none dark:bg-body-dark dark:text-white"
          tabIndex={-1}
          id="offcanvasExample"
          aria-labelledby="offcanvasExampleLabel"
          data-twe-offcanvas-init
        >
          <div className="flex items-center justify-end p-4">
            <button
              type="button"
              className="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300"
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

        <div className="sticky top-6 z-10 flex items-center gap-2 justify-between bg-white border border-[#448CD2] border-opacity-20 shadow-[0px_0px_5px_0px_#4B9BE980] sm:p-6 rounded-[12px] py-3 px-3">
          <div>
            <div className="md:hidden visible restore-sidebar restore-sidebar-mobile absolute top-1/2 transform -translate-y-1/2 left-[-12px] cursor-pointer">
              <button
                type="button"
                data-twe-offcanvas-toggle
                data-twe-target="#offcanvasExample"
                aria-controls="offcanvasExample"
                data-twe-ripple-init
                data-twe-ripple-color="light"
              >
                <img src={IconArrow} alt="arrow" className="w-5 h-5" />
              </button>
            </div>
            <h3 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)] ">
              Welcome back, Suzanna De S!
            </h3>
            <p className="sm:text-sm text-xs font-normal text-[var(--secondary-color)] mt-1 ">
              Complete platform oversight with real-time performance insights,
              user activity, and priority actions requiring your attention.
            </p>
          </div>

          <div className="relative">
            <button type="button">
              <Icon
                icon="tabler:bell"
                width="28"
                height="28"
                className="sm:w-7 sm:h-7 w-5 h-5"
              />
            </button>
            <p className="w-[6px] h-[6px] bg-[#FF0000] rounded-full absolute top-0 right-[8px] border border-white"></p>
          </div>
        </div>

        <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[0px_0px_5px_0px_#4B9BE980] sm:p-6 p-3 rounded-[12px] mt-6 h-[calc(100vh-180px)] flex justify-center items-center">
          {/* <p className="text-center w-full">No Data Found Yet!!!</p>
           */}
           <OrgInvitation />
        </div>
      </div>
      {/* Super Admin Overview End */}
    </>
  );
};

export default AdminOverview;
