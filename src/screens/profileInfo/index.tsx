import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../public/static/img/home/logo.svg";
import { Icon } from "@iconify/react";
import axios, { AxiosError } from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import SpinnerLoader from "../../components/spinnerLoader";

interface ApiError {
  message: string;
}

type ProfileFields = {
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  titles: string;
  root?: string;
};

const ProfileInfo = () => {
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
  } = useForm<ProfileFields>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      role: "",
      department: "",
      titles: "",
    },
  });

  // Watch all fields to determine if the button should be active
  const formValues = watch();

  const isFormValid =
    formValues.firstName.trim() !== "" &&
    formValues.lastName.trim() !== "" &&
    formValues.role !== "" &&
    formValues.department !== "" &&
    formValues.titles !== "";

  const isButtonActive = isFormValid && !loading;

  const onSubmit: SubmitHandler<ProfileFields> = async (data) => {
    try {
      setLoading(true);
      clearErrors("root");

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}auth/complete-profile`,
        data,
        {
          withCredentials: true, // REQUIRED for cookies/sessions
        }
      );

      navigate("/login");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || "Profile completion failed.";

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
              Fill In Profile Info
            </h2>

            {/* Root Error Handling (API Errors) */}
            {errors.root && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-sm font-semibold">
                <Icon icon="solar:danger-circle-bold" width="20" />
                <span>{errors.root.message}</span>
              </div>
            )}

            {/* First Name */}
            <div className="sm:mb-4 mb-2">
              <label
                htmlFor="firstName"
                className="font-bold text-[var(--secondary-color)] text-sm"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="Enter your first name"
                className={`font-medium text-sm text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg transition-all ${
                  errors.firstName
                    ? "border-red-500"
                    : "border-[#E8E8E8] focus:border-[var(--primary-color)]"
                }`}
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
            </div>

            {/* Last Name */}
            <div className="sm:mb-4 mb-2">
              <label
                htmlFor="lastName"
                className="font-bold text-[var(--secondary-color)] text-sm"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="Enter your last name"
                className={`font-medium text-sm text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg transition-all ${
                  errors.lastName
                    ? "border-red-500"
                    : "border-[#E8E8E8] focus:border-[var(--primary-color)]"
                }`}
                {...register("lastName", { required: "Last name is required" })}
              />
            </div>

            {/* Role */}
            <div className="sm:mb-4 mb-2">
              <label
                htmlFor="role"
                className="font-bold text-[var(--secondary-color)] text-sm"
              >
                Role
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
                  id="role"
                  className={`font-medium text-sm text-[#5D5D5D] appearance-none outline-0 w-full p-3 mt-2 border rounded-lg transition-all ${
                    errors.role
                      ? "border-red-500"
                      : "border-[#E8E8E8] focus:border-[var(--primary-color)]"
                  }`}
                  {...register("role", { required: "Role is required" })}
                >
                  <option value="">Select your role</option>
                  <option value="manager">Manager</option>
                  <option value="leader">Leader</option>
                </select>
              </div>
            </div>

            {/* Department */}
            <div className="sm:mb-4 mb-2">
              <label
                htmlFor="department"
                className="font-bold text-[var(--secondary-color)] text-sm"
              >
                Department
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
                  id="department"
                  className={`font-medium text-sm appearance-none text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg transition-all ${
                    errors.department
                      ? "border-red-500"
                      : "border-[#E8E8E8] focus:border-[var(--primary-color)]"
                  }`}
                  {...register("department", {
                    required: "Department is required",
                  })}
                >
                  <option value="">Select your department</option>
                  <option value="hr">HR</option>
                  <option value="engineering">Engineering</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
            </div>

            {/* Titles */}
            <div className="sm:mb-6 mb-5 max-w-28">
              <label
                htmlFor="titles"
                className="font-bold text-[var(--secondary-color)] text-sm"
              >
                Title
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
                  id="titles"
                  className={`font-medium text-sm text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg appearance-none transition-all ${
                    errors.titles
                      ? "border-red-500"
                      : "border-[#E8E8E8] focus:border-[var(--primary-color)]"
                  }`}
                  {...register("titles", { required: "Required" })}
                >
                  <option value="">Select</option>
                  <option value="Mr">Mr.</option>
                  <option value="Ms">Ms.</option>
                  <option value="Mrs">Mrs.</option>
                  <option value="Miss">Miss</option>
                  <option value="Mx">Mx.</option>
                  <option value="Dr">Dr.</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isButtonActive}
              className={`w-full mx-auto group text-white p-2.5 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase transition-all bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 ${
                isButtonActive
                  ? "opacity-100 cursor-pointer shadow-md"
                  : "opacity-40 cursor-not-allowed pointer-events-none"
              }`}
            >
              {loading ? "Saving..." : "Get Started"}
              <Icon
                icon="mynaui:arrow-right-circle-solid"
                width="25"
                className={`transition-transform duration-300 ${
                  isButtonActive ? "rotate-0" : "-rotate-45"
                }`}
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
