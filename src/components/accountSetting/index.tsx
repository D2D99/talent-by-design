import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { Tab, initTWE } from "tw-elements";

import ImageOpen from "../../../public/static/img/icons/eye-open.png";
import ImageClose from "../../../public/static/img/icons/eye-closed.png";
import api from "../../services/axios";
import { toast } from "react-toastify";


const AccountSetting = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validation = {
    minLength: passwordData.newPassword.length >= 8,
    hasUpper: /[A-Z]/.test(passwordData.newPassword),
    hasLower: /[a-z]/.test(passwordData.newPassword),
    hasNumber: /[0-9]/.test(passwordData.newPassword),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword),
  };

  const strengthCount = Object.values(validation).filter(Boolean).length;
  const strengthColor =
    strengthCount <= 2
      ? "bg-red-500"
      : strengthCount <= 4
        ? "bg-yellow-500"
        : "bg-green-500";

  useEffect(() => {

    initTWE({ Tab });
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("auth/my-profile");
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };



  const handleSave = async () => {
    // Check which tab is active (this is a bit tricky with TWE without controlled state, 
    // but we can check the URL or just always try to save password if there's data)

    if (passwordData.oldPassword || passwordData.newPassword || passwordData.confirmPassword) {
      if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        toast.error("Please fill all password fields");
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }

      if (passwordData.newPassword === passwordData.oldPassword) {
        toast.error("New password cannot be the same as current password");
        return;
      }

      const allValid = Object.values(validation).every(Boolean);
      if (!allValid) {
        toast.error("Please meet all password requirements");
        return;
      }



      try {
        setLoading(true);
        await api.post("auth/change-password", passwordData);
        toast.success("Password updated successfully!");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error: any) {
        const message = error.response?.data?.message || "Failed to update password";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    } else {
      toast.info("Nothing to save");
    }
  };



  return (
    <>
      {/* Account Setting Section Start */}
      <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-152px)]">
        <div className="flex items-center md:justify-between gap-4 flex-wrap mb-8">
          <h2 className="md:text-2xl text-xl font-bold">Account Setting</h2>

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="relative overflow-hidden z-0 text-[var(--white-color)] px-6 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
          >
            {loading ? "Saving..." : "Save"}
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
                  <p className="text-base text-neutral-500 capitalize">
                    {profileData ? `${profileData.firstName} ${profileData.middleInitial ? profileData.middleInitial + " " : ""}${profileData.lastName}` : "Loading..."}
                  </p>
                </div>


                <div>
                  <h6 className="text-sm font-semibold mb-0.5 flex items-center gap-1">
                    Email:
                    {profileData?.role !== "superAdmin" && (
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
                    )}
                  </h6>

                  <p className="text-base text-neutral-500 truncate">
                    {profileData?.email || "Loading..."}
                  </p>
                </div>


                <div>
                  <h6 className="text-sm font-semibold mb-0.5">DOB:</h6>
                  <p className="text-base text-neutral-500">
                    {profileData?.dob ? new Date(profileData.dob).toLocaleDateString() : "—"}
                  </p>
                </div>

                <div>
                  <h6 className="text-sm font-semibold mb-0.5">Gender:</h6>
                  <p className="text-base text-neutral-500 capitalize">
                    {profileData?.gender || "—"}
                  </p>
                </div>


                <div>
                  <h6 className="text-sm font-semibold mb-0.5">Phone No:</h6>
                  <p className="text-base text-neutral-500">
                    {profileData?.phoneNumber || "—"}
                  </p>
                </div>


                <div>
                  <h6 className="text-sm font-semibold mb-0.5">User Role:</h6>
                  <p className="text-base text-neutral-500 capitalize">
                    {profileData?.role || "—"}
                  </p>
                </div>


                <div>
                  <h6 className="text-sm font-semibold mb-0.5">Address:</h6>
                  <p className="text-base text-neutral-500 capitalize">
                    {[profileData?.state, profileData?.country, profileData?.zipCode].filter(Boolean).join(", ") || "—"}
                  </p>
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
                    htmlFor="oldPassword"
                    className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                  >
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      id="oldPassword"
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      autoComplete="current-password"
                      className="font-medium text-sm text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg transition-all pr-12  outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)]  border-[#E8E8E8] focus:border-[var(--primary-color)]"
                      required
                      placeholder="Enter your current password"
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
                    htmlFor="newPassword"
                    className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                  >
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                      className="font-medium text-sm text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg transition-all pr-12  outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)]  border-[#E8E8E8] focus:border-[var(--primary-color)]"
                      placeholder="Enter your new password"
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

                  {passwordData.newPassword.length > 0 && (
                    <div className="mt-4">
                      <div className="flex gap-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-full flex-1 transition-all duration-500 ${i < strengthCount ? strengthColor : "bg-transparent"
                              }`}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-[10px] mt-1 font-bold uppercase ${strengthCount === 5 ? "text-green-600" : "text-gray-400"
                          }`}
                      >
                        Strength:{" "}
                        {strengthCount === 5
                          ? "Strong"
                          : strengthCount >= 3
                            ? "Medium"
                            : "Weak"}
                      </p>
                    </div>
                  )}

                  {passwordData.newPassword.length > 0 && (
                    <ul className="mt-4 space-y-1">
                      {[
                        { label: "Minimum 8 characters", met: validation.minLength },
                        { label: "At least 1 uppercase letter", met: validation.hasUpper },
                        { label: "At least 1 lowercase letter", met: validation.hasLower },
                        { label: "At least 1 number", met: validation.hasNumber },
                        { label: "At least 1 special character", met: validation.hasSpecial },
                      ].map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm transition-colors text-neutral-800"
                        >
                          <Icon
                            icon="material-symbols-light:check"
                            width="16"
                            className={`rounded-full p-px transition-all ${item.met ? "bg-[#D1E9FF] text-black" : "bg-transparent"}`}
                          />
                          <span className={item.met ? "text-black" : "text-gray-400"}>
                            {item.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>



                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                  >
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                      className="font-medium text-sm text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg transition-all pr-12  outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)]  border-[#E8E8E8] focus:border-[var(--primary-color)]"
                      required
                      placeholder="Confirm your new password"
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

          </div>
        </div>
      </div >
      {/* Account Setting Section End */}
    </>
  );
};


export default AccountSetting;
