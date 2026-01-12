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

type RegisterFields = {
  email: string;
  password: string;
  confirmPassword: string;
  root?: string;
};

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFields>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");

  const isButtonDisabled =
    loading || (!emailValue && !passwordValue && !confirmPasswordValue);

  const onSubmit: SubmitHandler<RegisterFields> = async (data) => {
    try {
      setLoading(true);
      clearErrors("root");

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}auth/register`, {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      localStorage.setItem("registeredEmail", data.email);
      navigate("/after-register");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message ||
        "Registration failed. Please try again.";

      setError("root", {
        type: "manual",
        message: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--light-primary-color)]">
      <div
        className="lg:block hidden w-1/2 !bg-cover !bg-top !bg-no-repeat"
        id="login-bg"
      >
        <div className="flex justify-center items-center h-full bg-black bg-opacity-50" />
      </div>

      <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
        <div className="text-center mb-8 mx-auto">
          <img src={Logo} className="max-w-[150px] w-full mx-auto" alt="Logo" />
        </div>

        <div className="w-full mx-auto sm:max-w-96 max-w-full rounded-xl shadow-md border bg-white sm:py-10 py-6 sm:px-10 px-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)] sm:mb-6 mb-3">
              Welcome!
            </h2>

            {errors.root && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-sm font-semibold">
                <Icon icon="solar:danger-circle-bold" width="20" />
                <span>{errors.root.message}</span>
              </div>
            )}

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
                placeholder="Enter your email"
                className={`font-medium text-sm text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg transition-all ${
                  errors.email
                    ? "border-red-500"
                    : "border-[#E8E8E8] focus:border-[var(--primary-color)]"
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="sm:mb-4 mb-2">
              <label
                htmlFor="password"
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  className={`font-medium text-sm text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg transition-all pr-12 ${
                    errors.password
                      ? "border-red-500"
                      : "border-[#E8E8E8] focus:border-[var(--primary-color)]"
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Minimum 8 characters required",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4 flex items-center justify-center w-8 h-8 hover:opacity-75"
                >
                  <img
                    src={showPassword ? ImageOpen : ImageClose}
                    className="w-5 h-5"
                    alt="toggle"
                  />
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="sm:mb-5 mb-4">
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
                  placeholder="Confirm your password"
                  className={`font-medium text-sm text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg transition-all pr-12 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-[#E8E8E8] focus:border-[var(--primary-color)]"
                  }`}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (val: string) => {
                      if (watch("password") !== val) {
                        return "Your passwords do not match";
                      }
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-3.5 flex items-center justify-center w-8 h-8 hover:opacity-75 bg-white"
                >
                  <img
                    src={showConfirmPassword ? ImageOpen : ImageClose}
                    className="w-5 h-5"
                    alt="toggle"
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`w-full mx-auto group text-white p-2.5 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase transition-all bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 ${
                isButtonDisabled
                  ? "disabled:pointer-events-none disabled:opacity-40"
                  : "opacity-100"
              }`}
            >
              {loading ? "Registering..." : "Register"}
              <Icon
                icon="mynaui:arrow-right-circle-solid"
                width="25"
                className={`transition-transform duration-300 ${
                  isButtonDisabled ? "-rotate-45" : "rotate-0"
                }`}
              />
            </button>

            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-[var(--secondary-color)]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-[var(--primary-color)] underline hover:opacity-75"
                >
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="mt-4 text-center">
          <p className="max-w-sm mx-auto text-sm font-medium text-[var(--secondary-color)]">
            By clicking REGISTER, you’re confirming that you’ve read and agree
            to our {""}
            <Link
              to="/privacy"
              className="font-bold text-[var(--primary-color)] underline hover:opacity-75"
            >
              Privacy Policy
            </Link>{" "}
            and consent to receive all required notifications at your account
            email address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
