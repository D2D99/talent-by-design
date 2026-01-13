import { useNavigate } from "react-router-dom";
import Logo from "../../../public/static/img/home/logo.svg";
import AssessmentImage from "../../../public/static/img/start-assessment.svg";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import SpinnerLoader from "../spinnerLoader";

const StartAssessment = () => {
  const navigate = useNavigate();
  // ✅ PAGE LOADER (ADDED)
  const [pageLoading, setPageLoading] = useState(true);
  const handleClick = () => {
    navigate("/assessment-question");
  };
  // ✅ PAGE LOADER EFFECT (ADDED)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000); // adjust if needed

    return () => clearTimeout(timer);
  }, []);

  // ✅ LOADER RENDERS FIRST
  if (pageLoading) {
    return <SpinnerLoader />;
  }
  return (
    <>
      <div className="min-h-screen bg-[var(--light-primary-color)]">
        <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
          <div className="text-center mb-8 mx-auto">
            <button type="button" className="!max-w-[150px] cursor">
              <img src={Logo} className="w-[150px] mx-auto" alt="Logo" />
            </button>
          </div>

          <div className="w-full mx-auto sm:max-w-3xl max-w-full rounded-xl shadow-md shadow-[4px 4px 4px 0px #448CD21A;] border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
            {/* Start Screen UI */}
            <div className="text-center">
              <h2 className="sm:text-4xl text-2xl font-semibold mb-1">
                The POD 360™ Diagnostic
              </h2>
              <p className="sm:text-base text-sm">
                Reveal the friction points impacting your performance and
                discover the path to a more fluent, high-performing workflow.
              </p>
              <img
                src={AssessmentImage}
                alt="Start Assessment Image"
                className="w-fit mx-auto my-5"
              />

              <div className="grid place-items-center mt-10">
                <button
                  type="button"
                  className="group text-[var(--white-color)] pl-4 py-2 pr-2 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2]  hover:opacity-100 duration-200"
                  onClick={handleClick}
                >
                  Begin Diagnostic
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

          <div className="mt-4 text-center">
            <p className="max-w-md md:px-1 mx-auto text-sm font-medium text-[var(--secondary-color)]">
              By clicking BEGIN DIAGNOSTIC, you’re confirming that you’ve read
              and agree to our{" "}
              <a
                className="font-bold text-[var(--primary-color)] underline hover:opacity-75"
                href="/register"
                data-discover="true"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                className="font-bold text-[var(--primary-color)] underline hover:opacity-75"
                href="/register"
                data-discover="true"
              >
                {" "}
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartAssessment;
