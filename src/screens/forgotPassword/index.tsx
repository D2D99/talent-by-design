import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../public/static/img/home/logo.svg";
import { Icon } from "@iconify/react";
import axios, { AxiosError } from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import SpinnerLoader from "../../components/spinnerLoader";

interface ApiError {
  message: string;
}

type ForgotPasswordFields = {
  email: string;
  root?: string;
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  // ✅ PAGE LOADER (ADDED)
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // ✅ PAGE LOADER EFFECT (ADDED)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000); // adjust if needed

    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ForgotPasswordFields>({
    defaultValues: {
      email: "",
    },
  });

  // Watch the email value to activate button and rotate icon immediately
  const emailValue = watch("email");
  const isFormValid = emailValue && emailValue.trim() !== "";

  // const onSubmit: SubmitHandler<ForgotPasswordFields> = async (data) => {
  //   try {
  //     setLoading(true);
  //     clearErrors("root");

  //     await axios.post(
  //       `${import.meta.env.VITE_API_BASE_URL}auth/forgot-password`,
  //       { email: data.email }
  //     );

  //     navigate("/after-send-email");
  //   } catch (error: unknown) {
  //     const axiosError = error as AxiosError<ApiError>;
  //     const message =
  //       axiosError.response?.data?.message || "Failed to send reset email";

  //     setError("root", {
  //       type: "manual",
  //       message: message,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const onSubmit: SubmitHandler<ForgotPasswordFields> = async (data) => {
    try {
      setLoading(true);
      clearErrors("root");

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}auth/forgot-password`,
        { email: data.email }
      );

      localStorage.setItem("emailForResend", data.email);

      navigate("/after-send-email");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || "Failed to send reset email";

      setError("root", {
        type: "manual",
        message: message,
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOADER RENDERS FIRST
  if (pageLoading) {
    return <SpinnerLoader />;
  }

  return (
    <div className="flex min-h-screen bg-[var(--light-primary-color)]">
      <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
        <div className="text-center mb-8 mx-auto">
          <img src={Logo} className="max-w-[150px] w-full mx-auto" alt="Logo" />
        </div>

        <div className="w-full mx-auto sm:max-w-96 max-w-full rounded-xl shadow-md border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)] mb-1">
              Reset Password
            </h2>

            <p className="text-sm font-normal sm:mb-6 mb-3">
              If the email provided is associated with an account, you will
              receive an email with instructions for resetting your password.
            </p>

            {/* Root Error Message (API Errors) */}
            {errors.root && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-sm font-semibold">
                <Icon icon="solar:danger-circle-bold" width="20" />
                <span>{errors.root.message}</span>
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="email"
                className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
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

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full mx-auto group text-white p-2.5 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] transition-all duration-200 ${
                !isFormValid || loading
                  ? "disabled:pointer-events-none opacity-40"
                  : "opacity-100"
              }`}
            >
              {loading ? "Sending..." : "Send email"}
              <Icon
                icon="mynaui:arrow-right-circle-solid"
                width="25"
                height="25"
                className={`transition-transform duration-300 ${
                  isFormValid ? "rotate-0" : "-rotate-45"
                }`}
              />
            </button>

            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="text-sm font-bold text-[var(--primary-color)] hover:opacity-75 underline"
              >
                Return to log in
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-4 text-center">
          <p className="max-w-80 mx-auto text-sm font-medium text-[var(--secondary-color)]">
            Forgot your email address or no longer have access to it?{" "}
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

export default ForgotPassword;
