import Logo from "../../../public/static/img/home/logo.svg";
import ResendMail from "../../../public/static/img/icons/resend-email-icon.svg";
import BackIcon from "../../../public/static/img/icons/back-icon.svg";
import { Link } from "react-router-dom";

const AfterSendEmail = () => {
  return (
    <>
      <div className=" min-h-screen bg-[var(--light-primary-color)]">
        {/* Success Toaster Start */}
        <div className="hidden px-3 absolute left-1/2 top-6 w-full transform -translate-x-1/2">
          <div className="flex items-center justify-between bg-gray-800 text-white p-3 rounded-lg max-w-xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="24" height="24" rx="12" fill="#3F9933" />
                  <path
                    d="M9.98429 14.588L16.953 7.61924C17.1175 7.45479 17.3094 7.37256 17.5286 7.37256C17.7479 7.37256 17.9398 7.45479 18.1042 7.61924C18.2687 7.78369 18.3509 7.97912 18.3509 8.20552C18.3509 8.43192 18.2687 8.62707 18.1042 8.79098L10.5599 16.3559C10.3954 16.5203 10.2036 16.6026 9.98429 16.6026C9.76502 16.6026 9.57316 16.5203 9.4087 16.3559L5.87294 12.8201C5.70848 12.6557 5.62954 12.4605 5.63612 12.2347C5.6427 12.0088 5.72849 11.8134 5.89349 11.6484C6.0585 11.4834 6.25392 11.4011 6.47977 11.4017C6.70562 11.4022 6.90078 11.4845 7.06523 11.6484L9.98429 14.588Z"
                    fill="white"
                  />
                </svg>
              </div>
              <span className="sm:text-xl text-sm font-bold">
                Email was resent
              </span>
            </div>
            {/* Close button */}
            <button type="button" className="">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 7L17 17M7 17L17 7"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Success Toaster End */}

        <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
          <div className="text-center mb-8 mx-auto">
            <img src={Logo} className="max-w-[150px] w-full mx-auto" alt="" />
          </div>
          <div className="w-full mx-auto max-w-96 rounded-xl shadow-md shadow-[4px 4px 4px 0px #448CD21A] border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
            {/* Form */}
            <div className="">
              <Link to={"/forgot-password"} className="flex items-center gap-1">
                <img src={BackIcon} alt="Back Icon" />
                <p className="text-sm font-bold text-[var(--primary-color)]">
                  Back
                </p>
              </Link>
            </div>

            <img src={ResendMail} className="mx-auto" alt="email-icon" />
            <h2 className="sm:text-2xl text-xl text-center font-bold text-[var(--secondary-color)] mb-1">
              Check Your Inbox
            </h2>
            <p className="text-sm font-normal sm:mb-5 mb-3 text-center">
              If the email provided is associated with an account, you will
              receive an email with instructions for resetting your password.
            </p>

            <div className="mt-4 text-center">
              <p className="text-sm font-normal text-center">
                You can send email after: <strong>04:59</strong>
              </p>
              <Link to={""} className="text-sm font-bold text-[#448bd28a] ">
                Resend Email
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AfterSendEmail;
