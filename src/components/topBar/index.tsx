import IconArrow from "../../../public/static/img/icons/iconamoon_arrow.png";
import { Icon } from "@iconify/react";

const TopBar = () => {
  return (
    <>
      {/* Dashboard Top Bar */}
      <div className="sticky top-6 z-10 flex items-center gap-2 justify-between bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 rounded-[12px] py-3 px-3">
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
          <h3 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)]">
            Welcome back,
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
    </>
  );
};

export default TopBar;
