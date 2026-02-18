import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Logo = "/static/img/home/logo.svg";
import { Icon } from "@iconify/react";
import api from "../../services/axios";
import { AxiosError } from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import SpinnerLoader from "../../components/spinnerLoader";
import { toast } from "react-toastify";


interface ApiError {
  message: string;
}

type ProfileFields = {
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  titles: string;
  orgName?: string;
  root?: string;
};

const ProfileInfo = () => {
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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
      orgName: "",
    },
  });

  useEffect(() => {
    // Capture verifyToken from URL if it exists
    const params = new URLSearchParams(window.location.search);
    const verifyToken = params.get("verifyToken");

    if (verifyToken) {
      const isProduction = window.location.hostname !== "localhost";
      const expires = new Date(Date.now() + 15 * 60 * 1000).toUTCString();
      document.cookie = `verifyToken=${verifyToken}; path=/; expires=${expires}; ${isProduction ? "SameSite=None; Secure" : "SameSite=Lax"}`;
    }

    const fetchAssignedRole = async () => {
      try {
        const verifyTokenFromUrl = new URLSearchParams(window.location.search).get("verifyToken");

        const response = await api.get("auth/current-user-session", {
          headers: {
            "x-verify-token": verifyTokenFromUrl || ""
          }
        });

        if (response.data.role) {
          setValue("role", response.data.role);
        }
      } catch (err) {
        console.error("Could not fetch role", err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchAssignedRole();
  }, [setValue]);

  const formValues = watch();

  const isFormValid =
    formValues.firstName?.trim() !== "" &&
    formValues.lastName?.trim() !== "" &&
    formValues.role !== "" &&
    formValues.department !== "" &&
    formValues.titles !== "" &&
    (formValues.role === "admin" ? formValues.orgName?.trim() !== "" : true);

  const isButtonActive = isFormValid && !loading;

  const onSubmit: SubmitHandler<ProfileFields> = async (data) => {
    try {
      setLoading(true);
      clearErrors("root");

      const verifyTokenFromUrl = new URLSearchParams(window.location.search).get("verifyToken");

      await api.post("auth/complete-profile", data, {
        headers: {
          "x-verify-token": verifyTokenFromUrl || ""
        }
      });

      toast.success("Profile completed! Please log in to continue.");
      navigate("/login");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiError>;

      if (axiosError.response?.status === 401) return;

      const message =
        axiosError.response?.data?.message || "Profile completion failed.";

      if (message.includes(",")) {
        message.split(",").forEach((msg, index) => {
          toast.error(msg.trim(), { autoClose: 3000 + index * 1000 });
        });
      } else {
        toast.error(message);
      }

      setError("root", {
        type: "manual",
        message: message,
      });

    } finally {
      setLoading(false);
    }
  };

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

            {/* Organization Name Input - Only for Admins */}
            {formValues.role === "admin" && (
              <div className="sm:mb-4 mb-2">
                <label
                  htmlFor="orgName"
                  className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                >
                  Organization Name
                </label>
                <input
                  type="text"
                  id="orgName"
                  placeholder="Enter organization name"
                  className={`font-medium text-sm text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all ${errors.orgName
                    ? "border-red-500"
                    : "border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    }`}
                  {...register("orgName", {
                    required: "Organization name is required",
                  })}
                />
              </div>
            )}

            {/* First Name */}
            <div className="sm:mb-4 mb-2">
              <label
                htmlFor="firstName"
                className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="Enter your first name"
                className={`font-medium text-sm text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all ${errors.firstName
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
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="Enter your last name"
                className={`font-medium text-sm text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all ${errors.lastName
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
                className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
              >
                Role
              </label>
              <div className="relative w-full">
                <input
                  type="text"
                  id="role"
                  readOnly
                  className="font-medium text-sm text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg bg-gray-100 cursor-not-allowed border-[#E8E8E8] outline-none"
                  {...register("role", { required: "Role is required" })}
                />
              </div>
            </div>

            {/* Department */}
            <div className="sm:mb-4 mb-2">
              <label
                htmlFor="department"
                className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
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
                  className={`font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all ${errors.department
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
            <div className="sm:mb-6 mb-4 max-w-28">
              <label
                htmlFor="titles"
                className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
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
                  className={`font-medium text-sm text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg appearance-none transition-all ${errors.titles
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
              className={`w-full mx-auto group text-white p-2.5 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase transition-all bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 ${isButtonActive
                ? "opacity-100 cursor-pointer shadow-md"
                : "opacity-40 cursor-not-allowed pointer-events-none"
                }`}
            >
              {loading ? "Saving..." : "Get Started"}
              <Icon
                icon="mynaui:arrow-right-circle-solid"
                width="25"
                className={`transition-transform duration-300 ${isButtonActive ? "rotate-0" : "-rotate-45"}`}
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
