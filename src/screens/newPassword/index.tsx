import Logo from "../../../public/static/img/home/logo.svg";
import { Icon } from "@iconify/react";

const NewPassword = () => {
  return (
    <>
      <div className="flex min-h-screen bg-[var(--light-primary-color)]">
        <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
          <div className="text-center mb-8 mx-auto">
            <img src={Logo} className="max-w-[150px] w-full mx-auto" alt="" />
          </div>
          <div className="w-full mx-auto max-w-96 rounded-xl shadow-md shadow-[4px 4px 4px 0px #448CD21A;] border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
            {/* Form */}
            <form>
              <h2 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)] sm:mb-6 mb-3">
                New Password
              </h2>

              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="font-bold text-[var(--secondary-color)] text-sm"
                >
                  Enter new password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    className="font-medium text-sm text-[#5D5D5D] focus:outline-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg pr-10"
                    placeholder="Enter new password"
                  />
                  <svg
                    width="18"
                    height="14"
                    viewBox="0 0 18 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-[25px] right-[10px]"
                  >
                    <path
                      d="M15.7896 13.25L3.28955 0.75M7.28955 5.70131C6.97837 6.04438 6.78955 6.49503 6.78955 6.98859C6.78955 8.0634 7.68498 8.9347 8.78955 8.9347C9.29885 8.9347 9.76365 8.7495 10.1168 8.4445M15.8219 8.9347C16.5105 7.904 16.7896 7.0634 16.7896 7.0634C16.7896 7.0634 14.9691 1.25 8.78955 1.25C8.44263 1.25 8.10944 1.26832 7.78955 1.30291M13.2896 11.4579C12.1417 12.1901 10.664 12.7079 8.78955 12.6773C2.68699 12.5775 0.789551 7.0634 0.789551 7.0634C0.789551 7.0634 1.6711 4.2484 4.28955 2.5361"
                      stroke="#272727"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="font-bold text-[var(--secondary-color)] text-sm"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    className="font-medium text-sm text-[#5D5D5D] focus:outline-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg pr-10"
                    placeholder="Enter your password"
                  />
                  <svg
                    width="18"
                    height="14"
                    viewBox="0 0 18 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-[25px] right-[10px]"
                  >
                    <path
                      d="M15.7896 13.25L3.28955 0.75M7.28955 5.70131C6.97837 6.04438 6.78955 6.49503 6.78955 6.98859C6.78955 8.0634 7.68498 8.9347 8.78955 8.9347C9.29885 8.9347 9.76365 8.7495 10.1168 8.4445M15.8219 8.9347C16.5105 7.904 16.7896 7.0634 16.7896 7.0634C16.7896 7.0634 14.9691 1.25 8.78955 1.25C8.44263 1.25 8.10944 1.26832 7.78955 1.30291M13.2896 11.4579C12.1417 12.1901 10.664 12.7079 8.78955 12.6773C2.68699 12.5775 0.789551 7.0634 0.789551 7.0634C0.789551 7.0634 1.6711 4.2484 4.28955 2.5361"
                      stroke="#272727"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
              </div>

              <ul className="mt-3">
                <li className="flex items-center gap-1 text-sm">
                  <Icon
                    icon="material-symbols-light:check"
                    width="18"
                    height="18"
                  />
                  <span>Minimum 8 characters</span>
                </li>
                <li className="flex items-center gap-1 text-sm">
                  <Icon
                    icon="material-symbols-light:check"
                    width="18"
                    height="18"
                  />
                  <span>At Least 1 uppercase letter</span>
                </li>
                <li className="flex items-center gap-1 text-sm">
                  <Icon
                    icon="material-symbols-light:check"
                    width="18"
                    height="18"
                  />
                  <span>At Least 1 lowercase letter</span>
                </li>
                <li className="flex items-center gap-1 text-sm">
                  <Icon
                    icon="material-symbols-light:check"
                    width="18"
                    height="18"
                  />
                  <span>At Least 1 number</span>
                </li>
                <li className="flex items-center gap-1 text-sm">
                  <Icon
                    icon="material-symbols-light:check"
                    width="18"
                    height="18"
                  />
                  <span>At Least 1 special character</span>
                </li>
              </ul>
              <button
                type="submit"
                className="sm:mt-6 mt-3 w-full mx-auto group text-[var(--white-color)] p-2.5 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase 
                           bg-gradient-to-r from-[#1a365277] to-[#448bd28f]"
              >
                Save password
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="22"
                  height="22"
                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                />
              </button>
            </form>
          </div>
          <div className="mt-4 text-center">
            <p className="max-w-80 mx-auto text-sm font-medium text-[var(--secondary-color)]">
              Forgot your email address or no longer have access to it?{" "}
              <a
                href="#"
                className="font-bold text-[var(--primary-color)] underline"
              >
                Contact Us
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPassword;
