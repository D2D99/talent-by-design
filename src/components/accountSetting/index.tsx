import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { Tab, initTWE } from "tw-elements";

import ImageOpen from "../../../public/static/img/icons/eye-open.png";
import ImageClose from "../../../public/static/img/icons/eye-closed.png";

const AccountSetting = () => {
  useEffect(() => {
    initTWE({ Tab });
  }, []);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      {/* Account Setting Section Start */}
      <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-152px)]">
        <div className="flex items-center md:justify-between gap-4 flex-wrap mb-8">
          <h2 className="md:text-2xl text-xl font-bold">Account Setting</h2>

          <button
            type="button"
            className="relative hidden overflow-hidden z-0 text-[var(--white-color)] px-4 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
          >
            Save
          </button>
        </div>

        <div>
          <ul
            className="mb-5 flex list-none flex-row flex-wrap border-b-0 ps-0"
            role="tablist"
            data-twe-nav-ref
          >
            <li role="presentation">
              <a
                href="#tabs-info"
                className="block border-x-0 border-b-2 border-t-0 border-transparent p-3 text-sm font-semibold capitalize  leading-tight text-neutral-400 hover:isolate hover:border-transparent focus:isolate focus:border-transparent data-[twe-nav-active]:border-[var(--primary-color)] data-[twe-nav-active]:text-[var(--primary-color)]"
                data-twe-toggle="pill"
                data-twe-target="#tabs-info"
                data-twe-nav-active
                role="tab"
                aria-controls="tabs-info"
                aria-selected="true"
              >
                General Info
              </a>
            </li>
            <li role="presentation">
              <a
                href="#tabs-password"
                className="block border-x-0 border-b-2 border-t-0 border-transparent p-3 text-sm font-semibold capitalize  leading-tight text-neutral-400 hover:isolate hover:border-transparent focus:isolate focus:border-transparent data-[twe-nav-active]:border-[var(--primary-color)] data-[twe-nav-active]:text-[var(--primary-color)]"
                data-twe-toggle="pill"
                data-twe-target="#tabs-password"
                role="tab"
                aria-controls="tabs-password"
                aria-selected="false"
              >
                Password
              </a>
            </li>
            <li role="presentation">
              <a
                href="#tabs-notification"
                className="block border-x-0 border-b-2 border-t-0 border-transparent p-3 text-sm font-semibold capitalize  leading-tight text-neutral-400 hover:isolate hover:border-transparent focus:isolate focus:border-transparent data-[twe-nav-active]:border-[var(--primary-color)] data-[twe-nav-active]:text-[var(--primary-color)]"
                data-twe-toggle="pill"
                data-twe-target="#tabs-notification"
                role="tab"
                aria-controls="tabs-notification"
                aria-selected="false"
              >
                Notification
              </a>
            </li>
            <li role="presentation">
              <a
                href="#tabs-preference"
                className="block border-x-0 border-b-2 border-t-0 border-transparent p-3 text-sm font-semibold capitalize  leading-tight text-neutral-400 hover:isolate hover:border-transparent focus:isolate focus:border-transparent data-[twe-nav-active]:border-[var(--primary-color)] data-[twe-nav-active]:text-[var(--primary-color)]"
                data-twe-toggle="pill"
                data-twe-target="#tabs-preference"
                role="tab"
                aria-controls="tabs-preference"
                aria-selected="false"
              >
                Preference
              </a>
            </li>
          </ul>

          <div className="mt-7">
            <div
              className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[twe-tab-active]:block"
              id="tabs-info"
              role="tabpanel"
              aria-labelledby="tabs-info-tab"
              data-twe-tab-active
            >
              <div className="grid lg:grid-cols-4 sm:grid-cols-2 sm:gap-10 gap-5">
                <div>
                  <h6 className="text-sm font-semibold mb-0.5">Name:</h6>
                  <p className="text-base text-neutral-500">Full Name</p>
                </div>

                <div>
                  <h6 className="text-sm font-semibold mb-0.5 flex items-center gap-1">
                    Email:
                    <span
                      data-tooltip-id="email-info"
                      data-tooltip-content="If you need to change your e-mail address, please contact Sdesouza@tbdcollective.ca"
                      className="cursor-pointer"
                    >
                      <Icon
                        icon="fluent:info-16-regular"
                        width="14"
                        height="14"
                      />
                      <Tooltip
                        id="email-info"
                        place="top"
                        className="!w-64 !text-xs !leading-normal !text-center"
                      />
                    </span>
                  </h6>
                  <p className="text-base text-neutral-500 truncate">
                    loremexample@gmail.com
                  </p>
                </div>

                <div>
                  <h6 className="text-sm font-semibold mb-0.5">DOB:</h6>
                  <p className="text-base text-neutral-500">11 Jan, 1999</p>
                </div>

                <div>
                  <h6 className="text-sm font-semibold mb-0.5">Gender:</h6>
                  <p className="text-base text-neutral-500">11 Jan, 1999</p>
                </div>

                <div>
                  <h6 className="text-sm font-semibold mb-0.5">Phone No:</h6>
                  <p className="text-base text-neutral-500">+91 99XXXXXXXX</p>
                </div>

                <div>
                  <h6 className="text-sm font-semibold mb-0.5">User Role:</h6>
                  <p className="text-base text-neutral-500">Super Admin</p>
                </div>

                <div>
                  <h6 className="text-sm font-semibold mb-0.5">Address:</h6>
                  <p className="text-base text-neutral-500">JK, India 18XXXX</p>
                </div>
              </div>
            </div>
            <div
              className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[twe-tab-active]:block"
              id="tabs-password"
              role="tabpanel"
              aria-labelledby="tabs-password-tab"
            >
              <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="password"
                    className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                  >
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      className="font-medium text-sm text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg transition-all pr-12  outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)]  border-[#E8E8E8] focus:border-[var(--primary-color)]"
                      required
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-4 flex items-center justify-center w-8 h-8 hover:opacity-75 transition-opacity"
                    >
                      <img
                        src={showOldPassword ? ImageOpen : ImageClose}
                        alt={
                          showOldPassword ? "Hide password" : "Show password"
                        }
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                  >
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      className="font-medium text-sm text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg transition-all pr-12  outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)]  border-[#E8E8E8] focus:border-[var(--primary-color)]"
                      required
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-4 flex items-center justify-center w-8 h-8 hover:opacity-75 transition-opacity"
                    >
                      <img
                        src={showPassword ? ImageOpen : ImageClose}
                        alt={showPassword ? "Hide password" : "Show password"}
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cpassword"
                    className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                  >
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="cpassword"
                      autoComplete="current-password"
                      className="font-medium text-sm text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg transition-all pr-12  outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)]  border-[#E8E8E8] focus:border-[var(--primary-color)]"
                      required
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-4 flex items-center justify-center w-8 h-8 hover:opacity-75 transition-opacity"
                    >
                      <img
                        src={showConfirmPassword ? ImageOpen : ImageClose}
                        alt={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <ul className="text-sm text-neutral-500 list-disc ps-5">
                  <li>Minimum 8 characters</li>
                  <li>At least 1 uppercase letter</li>
                  <li>At least 1 lowercase letter</li>
                  <li>At least 1 number</li>
                  <li>At least 1 special character</li>
                </ul>
              </div>
            </div>
            <div
              className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[twe-tab-active]:block"
              id="tabs-notification"
              role="tabpanel"
              aria-labelledby="tabs-notification-tab"
            >
              <div className="space-y-5">
                <div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="relative w-9 h-5 bg-[var(--light-primary-color)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[var(--primary-color)] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    <span className="select-none ms-3 text-sm font-semibold text-heading">
                      System Notification
                    </span>
                  </label>
                </div>
                <div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="relative w-9 h-5 bg-[var(--light-primary-color)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[var(--primary-color)] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    <span className="select-none ms-3 text-sm font-semibold text-heading">
                      Email Notification
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div
              className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[twe-tab-active]:block"
              id="tabs-preference"
              role="tabpanel"
              aria-labelledby="tabs-preference-tab"
            >
              <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="timeZone"
                    className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
                  >
                    Time Zone
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 top-2 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-[#5D5D5D]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <select
                      id="timeZone"
                      className="font-medium text-sm text-[#5D5D5D]  outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] appearance-none"
                    >
                      <option value="">English</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lang"
                    className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
                  >
                    Language
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 top-2 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-[#5D5D5D]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <select
                      id="lang"
                      className="font-medium text-sm text-[#5D5D5D]  outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] read-only:bg-neutral-100 read-only:border-[#E8E8E8] pointer-events-none appearance-none"
                    >
                      <option value="">English</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="dateFormat"
                    className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
                  >
                    Date Format
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 top-2 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-[#5D5D5D]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <select
                      id="dateFormat"
                      className="font-medium text-sm text-[#5D5D5D]  outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] appearance-none"
                    >
                      <option value="">English</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Account Setting Section End */}
    </>
  );
};

export default AccountSetting;
