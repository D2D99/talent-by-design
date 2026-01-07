import Logo from "../../../public/static/img/home/logo.svg";
import ProgressImg from "../../../public/static/img/home/progress-icon.png";
// import ResendMail from "../../../public/static/img/icons/resend-email-icon.svg";
import { Icon } from "@iconify/react";

const AssessmentQuestion = () => {
  return (
    <>
      <div className="min-h-screen bg-[var(--light-primary-color)]">
        <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
          <div className="text-center mb-8 mx-auto">
            <button
              type="button"
              className="!max-w-[150px]"
              data-twe-toggle="modal"
              data-twe-target="#exampleModalCenter"
              data-twe-ripple-init
              data-twe-ripple-color="light"
            >
              <img src={Logo} className="w-[150px] mx-auto" alt="Logo" />
            </button>
          </div>

          <div className="w-full mx-auto sm:max-w-3xl max-w-full rounded-xl shadow-md shadow-[4px 4px 4px 0px #448CD21A;] border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
            <div>
              <h2 className="text-base font-bold text-[var(--secondary-color)] capitalize">
                Question 1
              </h2>
            </div>
            <div className="w-full bg-[var(--light-primary-color)] rounded-full h-2 mt-3">
              <div className="w-4 bg-[var(--dark-primary-color)] h-2 rounded-full"></div>
            </div>
            <div className="sm:my-6 my-4">
              <h2 className="sm:text-xl text-base font-bold text-[var(--secondary-color)]">
                I feel comfortable asking questions or sharing concerns in my
                work environment *
              </h2>
            </div>

            <div className="grid grid-cols-5 max-w-96 mx-auto">
              <div className="cursor-pointer">
                <div className="sm:text-lg text-sm font-medium text-[var(--secondary-color)] mx-auto sm:h-12 h-11 sm:w-12 w-11 border border-[#448CD233] shadow-[4px_4px_4px_0px_#448CD21A] rounded-full flex items-center justify-center hover:bg-gradient-to-b from-[#448CD2] to-[#1A3652] hover:shadow-[4px_4px_4px_0px_#448CD21A] hover:text-white hover:border-none">
                  1
                </div>
                <div className="text-xs font-medium text[var(--black-color)] mt-3 sm:text-nowrap text-wrap  text-center">
                  Strongly Disagree
                </div>
              </div>
              <div className="cursor-pointer">
                <div className="sm:text-lg text-sm font-medium text-[var(--secondary-color)] mx-auto sm:h-12 h-11 sm:w-12 w-11 border border-[#448CD233] shadow-[4px_4px_4px_0px_#448CD21A] rounded-full flex items-center justify-center hover:bg-gradient-to-b from-[#448CD2] to-[#1A3652] hover:shadow-[4px_4px_4px_0px_#448CD21A] hover:text-white hover:border-none">
                  2
                </div>
              </div>
              <div className="cursor-pointer">
                <div className="sm:text-lg text-sm font-medium text-[var(--secondary-color)] mx-auto sm:h-12 h-11 sm:w-12 w-11 border border-[#448CD233] shadow-[4px_4px_4px_0px_#448CD21A] rounded-full flex items-center justify-center hover:bg-gradient-to-b from-[#448CD2] to-[#1A3652] hover:shadow-[4px_4px_4px_0px_#448CD21A] hover:text-white hover:border-none">
                  3
                </div>
                <div className="text-xs font-medium text[var(--black-color)] mt-3 sm:text-nowrap text-wrap text-center">
                  Neutral
                </div>
              </div>
              <div className="cursor-pointer">
                <div className="sm:text-lg text-sm font-medium text-[var(--secondary-color)] mx-auto sm:h-12 h-11 sm:w-12 w-11 border border-[#448CD233] shadow-[4px_4px_4px_0px_#448CD21A] rounded-full flex items-center justify-center hover:bg-gradient-to-b from-[#448CD2] to-[#1A3652] hover:shadow-[4px_4px_4px_0px_#448CD21A] hover:text-white hover:border-none">
                  4
                </div>
              </div>
              <div className="cursor-pointer">
                <div className="sm:text-lg text-sm font-medium text-[var(--secondary-color)] mx-auto sm:h-12 h-11 sm:w-12 w-11 border border-[#448CD233] shadow-[4px_4px_4px_0px_#448CD21A] rounded-full flex items-center justify-center hover:bg-gradient-to-b from-[#448CD2] to-[#1A3652] hover:shadow-[4px_4px_4px_0px_#448CD21A] hover:text-white hover:border-none">
                  5
                </div>
                <div className="text-xs font-medium text[var(--black-color)] mt-3 sm:text-nowrap text-wrap text-center">
                  Strongly Agree
                </div>
              </div>
            </div>

            {/* For forced choice */}

            {/* <div className="flex flex-col gap-4 ">
              <label className="flex items-center  justify-between cursor-pointer border border-[#E8E8E8] p-3 rounded-lg gap-1 flex-row-reverse label-active">
                <input
                  className="w-4 h-4"
                  type="radio"
                  name="fav_language"
                  value="CSS"
                />
                <h3 className="text-sm font-medium  text-[#5D5D5D]">
                  I usually feel safe speaking openly at work.
                </h3>
              </label>
              <label className="flex items-center justify-between cursor-pointer border border-[#E8E8E8] p-3 rounded-lg gap-1 flex-row-reverse label-active">
                <input
                  className="w-4 h-4"
                  type="radio"
                  name="fav_language"
                  value="CSS"
                />
                <h3 className="text-sm font-medium  text-[#5D5D5D]">
                  I usually feel safe speaking openly at work.
                </h3>
              </label>
            </div> */}

            {/* For forced choice */}

            {/* If they choose 3 and below */}
            {/* <div className="sm:mt-12 mt-6  ">
              <h2 className="text-sm font-bold mb-2">
                What situations make it harder for you to speak up, ask
                questions, or express concerns at work? *
              </h2>
              <textarea
                id="textarea"
                className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3  border border-[#E8E8E8] rounded-lg hover:border-blue-300/55 resize-none"
                placeholder="Enter your email"
                rows={4}
              ></textarea>
            </div> */}
            {/* If they choose 3 and below */}

            {/* form */}
            {/* <form>
              <h2 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)] ">
                Finalizing Your Confidential Submission
              </h2>
              <p className="sm:mb-6 mb-3 mt-1 text-sm font-medium text-[var(--secondary-color)]">
                Please provide these details to securely validate your input and
                ensure direct email delivery of your summary report once it is
                finalized.
              </p>
              <div className="sm:mb-4 mb-2">
                <label
                  htmlFor="firstName"
                  className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg hover:border-blue-300/55"
                  placeholder="Enter your first name"
                />
              </div>

              <div className="sm:mb-4 mb-2">
                <label
                  htmlFor="lastName"
                  className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg hover:border-blue-300/55"
                  placeholder="Enter your last name"
                />
              </div>

              <div className="sm:mb-4 mb-2">
                <label
                  htmlFor="email"
                  className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg hover:border-blue-300/55"
                  placeholder="Enter your email"
                />
              </div>

              <div className="sm:mb-6 mb-5">
                <label
                  htmlFor="department"
                  className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                >
                  Department
                </label>
                <select
                  id="department"
                  className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg hover:border-blue-300/55"
                >
                  <option value="">Select your department</option>
                  <option value="hr">HR</option>
                  <option value="engineering">Engineering</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
            </form> */}
            {/* form end*/}
            {/* form verify */}
            {/* <div>
              <img src={ResendMail} className="mx-auto" alt="email-icon" />
              <h2 className="sm:text-2xl text-xl text-center font-bold text-[var(--secondary-color)] mb-1">
                Thank You{" "}
                <span className="text-[var(--dark-primary-color)]">
                  Lisa A.
                </span>
              </h2>
              <p className="text-sm font-normal sm:mb-6 mb-3 text-center">
                Your inputs have been securely recorded and are now being
                consolidated and analyzed. Once the results are finalized, you
                will receive an email invitation to schedule a 45-minute debrief
                with one of our coaches, along with access to your dashboard,
                sent to the email address you provided.
              </p>
            </div> */}
            {/* form verify end */}
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
              <button
                type="button"
                className="group text-[var(--white-color)] pl-4 py-2 pr-2 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] opacity-40 hover:opacity-100 duration-200"
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

        <div className="mt-4 text-center">
          <p className="max-w-md md:px-1 mx-auto text-sm font-medium text-[var(--secondary-color)]">
            By clicking CONTINUE, you’re confirming that you’ve read and agree
            to our{" "}
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

      <div
        data-twe-modal-init
        className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="exampleModalCenter"
        tabIndex={-1}
        aria-labelledby="exampleModalCenterTitle"
        aria-modal="true"
        role="dialog"
      >
        <div
          data-twe-modal-dialog-ref
          className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-xl mx-auto"
        >
          <div className="mx-3 pointer-events-auto relative flex max-w-xl w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none dark:bg-surface-dark">
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 dark:border-white/10">
              <h5
                className="text-xl font-medium leading-normal text-surface dark:text-white"
                id="exampleModalCenterTitle"
              ></h5>
              <button
                type="button"
                className="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                data-twe-modal-dismiss
                aria-label="Close"
              >
                <span className="[&>svg]:h-6 [&>svg]:w-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              </button>
            </div>

            <div className="relative px-4 pb-4">
              <div className="mx-auto sm:w-full w-16 sm:h-full h-16">
                <img src={ProgressImg} className="mx-auto" alt="porgressImg" />
              </div>
              <div className="">
                <h2 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)] mt-4 text-center">
                  Your Progress Will Be Lost
                </h2>
                <p className="text-sm text-[var(--secondary-color)] font-normal mt-1 text-center">
                  If you exit now, your current progress will be lost and cannot
                  be recovered.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#E8E8E8] py-4 mt-4 px-4">
              <button
                type="button"
                className="group text-[var(--primary-color)] pl-4 py-2 pr-2 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase   hover:opacity-100 duration-200"
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
                className="group text-[var(--white-color)] pl-4 py-2 pr-2 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2]  hover:opacity-100 duration-200"
              >
                continue
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="25"
                  height="25"
                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                  data-twe-ripple-init
                  data-twe-ripple-color="light"
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
