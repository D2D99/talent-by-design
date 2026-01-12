import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../public/static/img/home/logo.svg";
import ImageClose from "../../../public/static/img/icons/eye-closed.png";
import ImageOpen from "../../../public/static/img/icons/eye-open.png";
import { Icon } from "@iconify/react";
import axios, { AxiosError } from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";

interface ApiError {
  message: string;
}

type NewPasswordFields = {
  password: string;
  confirmPassword: string;
  root?: string;
};

const NewPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<NewPasswordFields>({
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password") || "";
  const confirmPasswordValue = watch("confirmPassword") || "";

  const validation = {
    minLength: passwordValue.length >= 8,
    hasUpper: /[A-Z]/.test(passwordValue),
    hasLower: /[a-z]/.test(passwordValue),
    hasNumber: /[0-9]/.test(passwordValue),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue),
  };

  const strengthCount = Object.values(validation).filter(Boolean).length;
  const strengthColor =
    strengthCount <= 2
      ? "bg-red-500"
      : strengthCount <= 4
      ? "bg-yellow-500"
      : "bg-green-500";

  const allCriteriaMet = Object.values(validation).every(Boolean);
  const passwordsMatch =
    passwordValue === confirmPasswordValue && passwordValue !== "";
  const isButtonActive = allCriteriaMet && passwordsMatch && !loading;

  const onSubmit: SubmitHandler<NewPasswordFields> = async (data) => {
    try {
      setLoading(true);
      clearErrors("root");

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}auth/reset-password`,
        { password: data.password },
        { withCredentials: true }
      );

      navigate("/login");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiError>;
      setError("root", {
        type: "manual",
        message: axiosError.response?.data?.message || "Reset link expired",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--light-primary-color)]">
      <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
        <div className="text-center mb-8 mx-auto">
          <img src={Logo} className="max-w-[150px] w-full mx-auto" alt="Logo" />
        </div>

        <div className="w-full mx-auto max-w-96 rounded-xl shadow-md border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)] sm:mb-6 mb-3">
              New Password
            </h2>

            {errors.root && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-sm font-semibold">
                <Icon icon="solar:danger-circle-bold" width="20" />
                <span>{errors.root.message}</span>
              </div>
            )}

            <div className="mb-2">
              <label
                htmlFor="password"
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
              >
                New Password
              </label>

              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter new password"
                  className={`font-medium text-sm text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg transition-all pr-10 ${
                    errors.password
                      ? "border-red-500"
                      : "border-[#E8E8E8] focus:border-[var(--primary-color)]"
                  }`}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 mt-1 cursor-pointer"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  <img
                    src={showNewPassword ? ImageOpen : ImageClose}
                    alt="toggle"
                    className="w-5 h-5"
                  />
                </div>
              </div>
            </div>

            {passwordValue.length > 0 && (
              <div className="mb-4">
                <div className="flex gap-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-full flex-1 transition-all duration-500 ${
                        i < strengthCount ? strengthColor : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className={`text-[10px] mt-1 font-bold uppercase ${
                    strengthCount === 5 ? "text-green-600" : "text-gray-400"
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

            {passwordValue.length > 0 && (
              <ul className="mb-4 space-y-1">
                {[
                  { label: "Minimum 8 characters", met: validation.minLength },
                  {
                    label: "At least 1 uppercase letter",
                    met: validation.hasUpper,
                  },
                  {
                    label: "At least 1 lowercase letter",
                    met: validation.hasLower,
                  },
                  { label: "At least 1 number", met: validation.hasNumber },
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
                      className={`rounded-full p-px transition-all ${
                        item.met
                          ? "bg-[#D1E9FF] text-black"
                          : "bg-gray-100 text-transparent"
                      }`}
                    />
                    <span className={item.met ? "text-black" : "text-gray-400"}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mb-2">
              <label
                htmlFor="confirmPassword"
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm password"
                  className={`font-medium text-sm text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg transition-all pr-10 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-[#E8E8E8] focus:border-[var(--primary-color)]"
                  }`}
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (val) =>
                      val === passwordValue || "Passwords do not match",
                  })}
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 mt-1 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img
                    src={showConfirmPassword ? ImageOpen : ImageClose}
                    alt="toggle"
                    className="w-5 h-5"
                  />
                </div>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={!isButtonActive}
              className={`sm:mt-6 mt-3 w-full mx-auto group text-white p-2.5 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] transition-all duration-200 ${
                isButtonActive
                  ? "opacity-100 cursor-pointer"
                  : "opacity-40 cursor-not-allowed pointer-events-none shadow-none"
              }`}
            >
              {loading ? "Saving..." : "Save password"}
              <Icon
                icon="mynaui:arrow-right-circle-solid"
                width="22"
                className={`transition-transform duration-300 ${
                  isButtonActive ? "rotate-0" : "-rotate-45"
                }`}
              />
            </button>
          </form>
        </div>

        <div className="mt-4 text-center">
          <p className="max-w-80 mx-auto text-sm font-medium text-[var(--secondary-color)]">
            Forgot your email address or no longer have access to it? {""}
            <Link
              to="/contact"
              className="font-bold text-[var(--primary-color)] underline hover:opacity-75"
            >
              Contact Us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
