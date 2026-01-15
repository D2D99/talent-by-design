import { useEffect, useState } from "react";
import Logo from "../../../public/static/img/home/logo.svg";
import { Icon } from "@iconify/react";
import { Modal, Ripple, initTWE } from "tw-elements";
import SpinnerLoader from "../spinnerLoader";

const AssessmentQuestion = () => {
  // ✅ PAGE LOADER
  const [pageLoading, setPageLoading] = useState(true);

  // ✅ STATE FOR SELECTION (Fixed TS Error)
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  useEffect(() => {
    initTWE({ Modal, Ripple });
  }, []);

  // ✅ PAGE LOADER EFFECT
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // ✅ LOADER RENDERS FIRST
  if (pageLoading) {
    return <SpinnerLoader />;
  }

  const handleSelection = (val: number) => {
    setSelectedValue(val);
  };

  return (
    <>
      <div className="min-h-screen bg-[var(--light-primary-color)]">
        <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
          <div className="text-center mb-8 mx-auto">
            <button type="button">
              <img src={Logo} className="w-[150px] mx-auto" alt="Logo" />
            </button>
          </div>

          <div className="w-full mx-auto sm:max-w-3xl max-w-full rounded-xl shadow-md shadow-[4px 4px 4px 0px #448CD21A;] border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
            <h2 className="text-base font-bold text-[var(--secondary-color)] capitalize">
              Question 1
            </h2>
            <div className="w-full bg-[var(--light-primary-color)] rounded-full h-2 mt-3">
              <div className="w-4 bg-[var(--dark-primary-color)] h-2 rounded-full"></div>
            </div>
            <div className="sm:my-6 my-4">
              <h2 className="sm:text-xl text-base font-bold text-[var(--secondary-color)]">
                I feel comfortable asking questions or sharing concerns in my
                work environment <span>*</span>
              </h2>
            </div>

            <div className="grid grid-cols-5 max-w-96 mx-auto">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="cursor-pointer">
                  <label
                    htmlFor={`option-${num}`}
                    className={`sm:text-lg text-sm font-medium mx-auto sm:h-12 h-11 sm:w-12 w-11 border border-[#448CD233] hover:shadow-[4px_4px_4px_0px_#448CD21A] rounded-full flex items-center justify-center selected-answer cursor-pointer transition-colors ${
                      selectedValue === num
                        ? "bg-[var(--dark-primary-color)] text-white"
                        : "text-[var(--secondary-color)]"
                    }`}
                  >
                    {num}
                    <input
                      type="radio"
                      name="answer"
                      id={`option-${num}`}
                      className="hidden"
                      onChange={() => handleSelection(num)}
                    />
                  </label>

                  {/* Labels for specific numbers as per your UI */}
                  {num === 1 && (
                    <div className="text-xs font-medium text[var(--black-color)] mt-3 sm:text-nowrap text-wrap text-center">
                      Strongly Disagree
                    </div>
                  )}
                  {num === 3 && (
                    <div className="text-xs font-medium text[var(--black-color)] mt-3 sm:text-nowrap text-wrap text-center">
                      Neutral
                    </div>
                  )}
                  {num === 5 && (
                    <div className="text-xs font-medium text[var(--black-color)] mt-3 sm:text-nowrap text-wrap text-center">
                      Strongly Agree
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ✅ SHOW IF 3 OR BELOW */}
            <div
              className={`sm:mt-12 mt-6 ${
                selectedValue !== null && selectedValue <= 3 ? "" : "hidden"
              }`}
            >
              <label className="text-sm font-bold" htmlFor="insightPrompt">
                What situations make it harder for you to speak up, ask
                questions, or express concerns at work? <span>*</span>
              </label>
              <textarea
                id="insightPrompt"
                className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 border border-[#E8E8E8] rounded-lg resize-none mt-2 focus:border-[#E8E8E8] focus-within:border-[#E8E8E8]"
                placeholder=""
                rows={4}
              ></textarea>
            </div>

            <div className="sm:mt-12 mt-6 flex justify-between">
              <button
                type="button"
                className="group text-[var(--primary-color)] pl-4 py-2 pr-2 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase hover:opacity-100 duration-200 invisible"
              >
                Previous
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="25"
                  height="25"
                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                />
              </button>

              {/* ✅ CONTINUE BUTTON ENABLES ON SELECTION */}
              <button
                type="button"
                disabled={selectedValue === null}
                className={`group text-[var(--white-color)] pl-4 py-2 pr-2 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 ${
                  selectedValue === null
                    ? "opacity-40 cursor-not-allowed"
                    : "opacity-100"
                }`}
              >
                Continue
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
    </>
  );
};

export default AssessmentQuestion;
