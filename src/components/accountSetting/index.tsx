import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { Tab, initTWE } from "tw-elements";

import ImageOpen from "../../../public/static/img/icons/eye-open.png";
import ImageClose from "../../../public/static/img/icons/eye-closed.png";
import api from "../../services/axios";
import { toast } from "react-toastify";
import { useTheme } from "../../context/useTheme";

const AccountSetting = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "info" | "password" | "notification" | "appearance"
  >("info");
  const { theme, setTheme } = useTheme();

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

    if (
      passwordData.oldPassword ||
      passwordData.newPassword ||
      passwordData.confirmPassword
    ) {
      if (
        !passwordData.oldPassword ||
        !passwordData.newPassword ||
        !passwordData.confirmPassword
      ) {
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
        const message =
          error.response?.data?.message || "Failed to update password";
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
        <div className="flex sm:items-center items-start justify-between gap-4 flex-wrap mb-8 sm:min-h-10 sm:flex-row flex-col">
          <h2 className="md:text-2xl text-xl font-bold">Account Setting</h2>

          {activeTab === "password" && (
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="relative overflow-hidden z-0 text-[var(--white-color)] px-6 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          )}
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
                onClick={() => setActiveTab("info")}
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
                onClick={() => setActiveTab("password")}
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
                onClick={() => setActiveTab("notification")}
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
                href="#tabs-appearance"
                onClick={() => setActiveTab("appearance")}
                className="block border-x-0 border-b-2 border-t-0 border-transparent p-3 text-sm font-semibold capitalize  leading-tight text-neutral-400 hover:isolate hover:border-transparent focus:isolate focus:border-transparent data-[twe-nav-active]:border-[var(--primary-color)] data-[twe-nav-active]:text-[var(--primary-color)]"
                data-twe-toggle="pill"
                data-twe-target="#tabs-appearance"
                role="tab"
                aria-controls="tabs-appearance"
                aria-selected="false"
              >
                Appearance
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
                    {profileData
                      ? `${profileData.firstName} ${profileData.middleInitial ? profileData.middleInitial + " " : ""}${profileData.lastName}`
                      : "Loading..."}
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
                    {profileData?.dob
                      ? new Date(profileData.dob).toLocaleDateString()
                      : "—"}
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
                    {[
                      profileData?.state,
                      profileData?.country,
                      profileData?.zipCode,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
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
                            className={`h-full flex-1 transition-all duration-500 ${
                              i < strengthCount
                                ? strengthColor
                                : "bg-transparent"
                            }`}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-[10px] mt-1 font-bold uppercase ${
                          strengthCount === 5
                            ? "text-green-600"
                            : "text-gray-400"
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
                        {
                          label: "Minimum 8 characters",
                          met: validation.minLength,
                        },
                        {
                          label: "At least 1 uppercase letter",
                          met: validation.hasUpper,
                        },
                        {
                          label: "At least 1 lowercase letter",
                          met: validation.hasLower,
                        },
                        {
                          label: "At least 1 number",
                          met: validation.hasNumber,
                        },
                        {
                          label: "At least 1 special character",
                          met: validation.hasSpecial,
                        },
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
                          <span
                            className={
                              item.met ? "text-black" : "text-gray-400"
                            }
                          >
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
              <div className="space-y-6 max-w-2xl">
                <div className="bg-blue-50/50 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
                  <Icon
                    icon="solar:info-circle-bold"
                    className="text-[#448CD2] w-6 h-6 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <h5 className="font-bold text-[#1a3652] text-sm">
                      Control your alerts
                    </h5>
                    <p className="text-xs text-gray-500 mt-1">
                      Choose how you want to be notified about important
                      updates. Changes are saved automatically.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                  <div>
                    <h6 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                      {/* <Icon
                        icon="solar:bell-bold-duotone"
                        className="text-[#448CD2]"
                        width="20"
                      /> */}
                      System Notifications
                    </h6>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm">
                      Get in-app alerts for assessments, team updates, and
                      system announcements.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={
                        profileData?.notificationPreferences?.system ?? true
                      }
                      onChange={async (e) => {
                        const newValue = e.target.checked;
                        // Optimistic update
                        setProfileData((prev: any) => ({
                          ...prev,
                          notificationPreferences: {
                            ...prev?.notificationPreferences,
                            system: newValue,
                          },
                        }));
                        try {
                          await api.patch("/auth/update-notifications", {
                            system: newValue,
                          });
                          toast.success("Preference updated");
                        } catch (error) {
                          toast.error("Failed to update preference");
                          // Revert
                          setProfileData((prev: any) => ({
                            ...prev,
                            notificationPreferences: {
                              ...prev?.notificationPreferences,
                              system: !newValue,
                            },
                          }));
                        }
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#448CD2]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                  <div>
                    <h6 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                      {/* <Icon icon="solar:letter-bold-duotone" className="text-[#448CD2]" width="20" /> */}
                      Email Notifications
                    </h6>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm">
                      Receive important updates and digests via email. We won't
                      spam you.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={
                        profileData?.notificationPreferences?.email ?? false
                      }
                      onChange={async (e) => {
                        const newValue = e.target.checked;
                        setProfileData((prev: any) => ({
                          ...prev,
                          notificationPreferences: {
                            ...prev?.notificationPreferences,
                            email: newValue,
                          },
                        }));
                        try {
                          await api.patch("/auth/update-notifications", {
                            email: newValue,
                          });
                          toast.success("Preference updated");
                        } catch (error) {
                          toast.error("Failed to update preference");
                          setProfileData((prev: any) => ({
                            ...prev,
                            notificationPreferences: {
                              ...prev?.notificationPreferences,
                              email: !newValue,
                            },
                          }));
                        }
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#448CD2]"></div>
                  </label>
                </div>
              </div>
            </div>
            <div
              className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[twe-tab-active]:block"
              id="tabs-appearance"
              role="tabpanel"
              aria-labelledby="tabs-appearance-tab"
            >
              <div className="space-y-6 max-w-3xl">
                <div className="bg-blue-50/50 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
                  <Icon
                    icon="solar:pallete-2-bold"
                    className="text-[#448CD2] w-6 h-6 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <h5 className="font-bold text-[#1a3652] text-sm">
                      Choose your theme
                    </h5>
                    <p className="text-xs text-gray-500 mt-1">
                      Pick a mode for your full experience. Dark mode uses a
                      navy palette matched to your current brand colors.
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`w-full text-left p-5 rounded-xl border transition-all ${
                      theme === "light"
                        ? "border-[#448CD2] bg-[#E4F0FC] shadow-sm"
                        : "border-gray-200 bg-white hover:border-[#448CD2]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="solar:sun-bold-duotone"
                          width="22"
                          className="text-[#448CD2]"
                        />
                        <h6 className="font-bold text-sm text-gray-800">
                          Light Theme
                        </h6>
                      </div>
                      {theme === "light" && (
                        <Icon
                          icon="material-symbols:check-circle-rounded"
                          className="text-[#448CD2]"
                          width="20"
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Bright interface with high contrast for daytime use.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`w-full text-left p-5 rounded-xl border transition-all ${
                      theme === "dark"
                        ? "border-[#448CD2] bg-[#1A3652] shadow-sm"
                        : "border-gray-200 bg-white hover:border-[#448CD2]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="solar:moon-stars-bold-duotone"
                          width="22"
                          className={`${
                            theme === "dark" ? "text-[#9DC9F5]" : "text-[#448CD2]"
                          }`}
                        />
                        <h6
                          className={`font-bold text-sm ${
                            theme === "dark" ? "text-white" : "text-gray-800"
                          }`}
                        >
                          Dark Theme
                        </h6>
                      </div>
                      {theme === "dark" && (
                        <Icon
                          icon="material-symbols:check-circle-rounded"
                          className="text-[#9DC9F5]"
                          width="20"
                        />
                      )}
                    </div>
                    <p
                      className={`text-xs mt-2 ${
                        theme === "dark" ? "text-[#C8DBEE]" : "text-gray-500"
                      }`}
                    >
                      Deep navy surfaces inspired by your existing site palette.
                    </p>
                  </button>
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
