import Logo from "../../../public/static/img/home/logo.svg";
import LoginOr from "../../../public/static/img/home/login-or.svg";
import M365Icon from "../../../public/static/img/icons/m365.svg";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <div className="flex min-h-screen bg-[var(--light-primary-color)]">
        <div
          className=" lg:block hidden w-1/2 !bg-cover !bg-top !bg-no-repeat"
          id="login-bg"
        >
          <div className="flex justify-center items-center h-full bg-black bg-opacity-50"></div>
        </div>

        <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
          <div className="text-center mb-8 mx-auto">
            <img src={Logo} className="max-w-[150px] w-full mx-auto" alt="" />
          </div>
          <div className="w-full mx-auto sm:max-w-96 max-w-full rounded-xl shadow-md shadow-[4px 4px 4px 0px #448CD21A;] border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
            {/* Form */}
            <form>
              <h2 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)] sm:mb-6 mb-3">
                Account Login
              </h2>
              <div className="sm:mb-4 mb-2">
                <label
                  htmlFor="email"
                  className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg hover:border-blue-300/55"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                >
                  Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg hover:border-blue-300/55 pr-10"
                    placeholder="Enter your password"
                  />
                  <svg
                    width="18"
                    height="14"
                    viewBox="0 0 18 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-[25px] right-[10px] cursor-pointer"
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
              <div className="sm:mb-6 mb-3 flex items-center justify-end">
                <Link
                  to={"/forgot-password"}
                  className="text-sm font-bold text-[var(--primary-color)] hover:opacity-75"
                >
                  Forgot Password?
                </Link>
              </div>
              <button
                type="button"
                className="w-full mx-auto group text-[var(--white-color)] p-2.5 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] opacity-40 hover:opacity-100 duration-200"
              >
                Log in
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="25"
                  height="25"
                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                />
              </button>
              <div className="text-center my-3">
                <img src={LoginOr} className="mx-auto" alt="login" />
              </div>

              <div className="flex items-center justify-between mt-3">
                <button
                  type="button"
                  className="flex-row-reverse w-full mx-auto group text-[var(--secondary-color)] p-2.5 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-[#E4F0FC]"
                >
                  Continue with m365
                  <img src={M365Icon} alt="icon" />
                </button>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm font-medium text-[var(--secondary-color)]">
                  Don't have an account?{" "}
                  <Link
                    to={"/register"}
                    className="font-bold text-[var(--primary-color)] underline hover:opacity-75"
                  >
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
