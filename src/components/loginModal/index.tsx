import { Icon } from "@iconify/react";
import Dashboard from "../../../public/static/img/icons/dashboard-login.png";
import SolarUser from "../../../public/static/img/icons/solar_user-line-duotone.png";
import { Modal, Ripple, initTWE } from "tw-elements";
import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

const LoginModal = () => {
  //   Initialize navigate
  const navigate = useNavigate();
  const [selectedDashboard, setSelectedDashboard] = useState("");

  useEffect(() => {
    initTWE({ Modal, Ripple });
  }, []);

  const handleSelection = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedDashboard(e.target.id);
  };
  //   Redirect based on selection
  const handleContinue = () => {
    if (selectedDashboard === "dashboard1") {
      navigate("/login");
    } else if (selectedDashboard === "dashboard2") {
      navigate("/assessment-question");
    }
  };

  return (
    <>
      {/* Login Modal Start */}
      <div
        data-twe-modal-init
        className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="exampleModalCenter"
        tabIndex={-1}
        aria-labelledby="exampleModalCenterTitle"
        aria-modal="true"
        role="dialog"
        data-twe-backdrop="static"
        data-twe-keyboard="false"
        aria-hidden="true"
      >
        <div
          data-twe-modal-dialog-ref
          className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-xl mx-auto"
        >
          <div className="mx-3 pointer-events-auto relative flex max-w-xl w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none">
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b border-neutral-200 p-4">
              <h5
                className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold"
                id="exampleModalCenterTitle"
              >
                Where do you want to go?
              </h5>

              <button
                type="button"
                className="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none"
                data-twe-modal-dismiss
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

            <div className="relative sm:py-8 py-4 px-4">
              <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-6 gap-4">
                <label
                  htmlFor="dashboard1"
                  className={`cursor-pointer shadow-[4px_4px_4px_0px_#448CD21A] border pt-3 pr-3 pb-6 pl-3 rounded-lg transition-all border-[#448CD233] ${
                    selectedDashboard === "dashboard1"
                      ? "bg-primary-100"
                      : "bg-white"
                  }`}
                >
                  <div className="text-right">
                    <input
                      className="w-4 h-4 cursor-pointer !accent-blue-500"
                      type="radio"
                      id="dashboard1"
                      name="dashboard"
                      onChange={handleSelection}
                      checked={selectedDashboard === "dashboard1"}
                    />
                  </div>
                  <div className="text-center">
                    <img src={Dashboard} className="mx-auto" alt="Dashboard" />
                    <h2 className="text-base font-semibold text-center mt-4">
                      Leader/Manager Dashboard Login
                    </h2>
                  </div>
                </label>

                <label
                  htmlFor="dashboard2"
                  className={`cursor-pointer shadow-[4px_4px_4px_0px_#448CD21A] border pt-3 pr-3 pb-6 pl-3 rounded-lg transition-all border-[#448CD233] ${
                    selectedDashboard === "dashboard2"
                      ? "bg-primary-100"
                      : "bg-white"
                  }`}
                >
                  <div className="text-right">
                    <input
                      className="w-4 h-4 cursor-pointer !accent-blue-500"
                      type="radio"
                      id="dashboard2"
                      name="dashboard"
                      onChange={handleSelection}
                      checked={selectedDashboard === "dashboard2"}
                    />
                  </div>
                  <div className="text-center">
                    <img src={SolarUser} className="mx-auto" alt="Solar User" />
                    <h2 className="text-base font-semibold text-center mt-4">
                      Take the <br /> Assessment
                    </h2>
                  </div>
                </label>
              </div>

              <p className="text-center font-semibold text-sm text-[var(--secondary-color)] opacity-75 mt-4">
                No login required for the Individual Contributor/Employees.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 py-4 px-4">
              <button
                type="button"
                className="group text-[var(--primary-color)] pl-4 py-2 h-10 pr-2 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase   hover:opacity-100 duration-200"
                data-twe-modal-dismiss
                data-twe-ripple-init
                data-twe-ripple-color="light"
              >
                Exit
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="25"
                  height="25"
                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                />
              </button>

              <button
                type="button"
                onClick={handleContinue}
                data-twe-modal-dismiss
                className="group text-[var(--white-color)] pl-4 h-10 pr-2 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:pointer-events-none disabled:opacity-40"
                disabled={!selectedDashboard}
              >
                continue
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="25"
                  height="25"
                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Login Modal End    */}
    </>
  );
};

export default LoginModal;
