import IconArrow from "../../../public/static/img/icons/iconamoon_arrow.png";
import { Icon } from "@iconify/react";
import { useLocation, Link, useNavigate } from "react-router-dom";

const TopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const isOverviewPage =
    location.pathname === "/dashboard" || location.pathname === "/";

  return (
    <>
      <div className="sticky top-6 z-10 flex items-center gap-4 justify-between bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 rounded-[12px] py-3 px-3">
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden visible restore-sidebar restore-sidebar-mobile absolute top-1/2 transform -translate-y-1/2 left-[-12px] cursor-pointer">
          <button
            type="button"
            data-twe-offcanvas-toggle
            data-twe-target="#offcanvasExample"
          >
            <img src={IconArrow} alt="arrow" className="w-5 h-5" />
          </button>
        </div>

        {isOverviewPage && (
          <div className="flex-1">
            <h3 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)]">
              Welcome back!
            </h3>
            <p className="sm:text-sm text-xs font-normal text-[var(--secondary-color)] mt-1 max-w-2xl">
              Complete platform oversight with real-time performance insights.
            </p>
          </div>
        )}

        {/* Navigation Section (Back Button + Breadcrumbs) */}
        {!isOverviewPage && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
              title="Go Back"
            >
              <Icon
                icon="lucide:arrow-left"
                className="w-5 h-5 text-gray-600"
              />
            </button>

            {/* Breadcrumbs */}
            <nav className="hidden sm:flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium text-gray-400 hover:text-black duration-300"
                  >
                    Dashboard
                  </Link>
                </li>
                {pathnames
                  .filter((value) => value.toLowerCase() !== "dashboard")
                  .map((value, index, filteredArray) => {
                    const last = index === filteredArray.length - 1;
                    const to = `/dashboard/${filteredArray.slice(0, index + 1).join("/")}`;

                    return (
                      <li key={to} className="flex items-center">
                        <Icon
                          icon="lucide:chevron-right"
                          className="text-gray-400 w-4 h-4"
                        />
                        {last ? (
                          <span className="ml-1 text-sm font-bold text-[var(--secondary-color)] capitalize md:ml-2">
                            {value.replace(/-/g, " ")}
                          </span>
                        ) : (
                          <Link
                            to={to}
                            className="ml-1 text-sm font-medium text-gray-400 hover:text-[#448CD2] capitalize md:ml-2"
                          >
                            {value.replace(/-/g, " ")}
                          </Link>
                        )}
                      </li>
                    );
                  })}
              </ol>
            </nav>
          </div>
        )}

        {/* Notifications */}
        <div className="relative">
          <button type="button">
            <Icon
              icon="tabler:bell"
              className="w-6 h-6 text-[var(--secondary-color)]"
            />
          </button>
          <span className="w-[8px] h-[8px] bg-[#FF0000] rounded-full absolute top-px right-[3px] border-2 border-white"></span>
        </div>
      </div>
    </>
  );
};

export default TopBar;
