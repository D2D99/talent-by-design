import { useEffect, useState } from "react";
const Logo = "/static/img/home/logo.svg";
const ImageOpen = "/static/img/icons/eye-open.png";
const ImageClose = "/static/img/icons/eye-closed.png";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/axios";
import { AxiosError } from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import SpinnerLoader from "../../components/spinnerLoader";
import { toast } from "react-toastify";

import { useAuth } from "../../context/useAuth"; // Ensure this path is correct

interface ApiError {
  message: string;
}

type FormFields = {
  email: string;
  password: string;
  root?: string;
};

const Login = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  const { login, token, user } = useAuth();

  // Commented out to allow users to see the login form even if a token exists
  useEffect(() => {
    if (token && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, user, navigate]);

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Keep your branding loader but optimize the timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");

  // Improved button disabled logic: only disable if loading or fields are truly empty/whitespace
  const isButtonDisabled =
    loading || !emailValue?.trim() || !passwordValue?.trim();

  // const onSubmit: SubmitHandler<FormFields> = async (data) => {
  //   try {
  //     setLoading(true);
  //     clearErrors("root");

  //     const res = await axios.post(
  //       `${import.meta.env.VITE_API_BASE_URL}auth/login`,
  //       data,
  //       { withCredentials: true }
  //     );

  //     if (res.data?.accessToken) {
  //       // Use the context login function instead of manual localStorage
  //       login(res.data.accessToken);

  //       // Redirect to the page they tried to visit, or default to assessment
  //       const origin = location.state?.from?.pathname || "/start-assessment";
  //       navigate(origin, { replace: true });
  //     }
  //   } catch (error: unknown) {
  //     const axiosError = error as AxiosError<ApiError>;
  //     setError("root", {
  //       type: "manual",
  //       message:
  //         axiosError.response?.data?.message ||
  //         "Login failed. Please try again.",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      setLoading(true);
      clearErrors("root");

      const res = await api.post("auth/login", data);

      if (res.data?.accessToken) {
        // Use the context login function which handles both token and user object
        login(res.data.accessToken, res.data.user);

        // 3. Go to dashboard
        navigate("/dashboard", { replace: true });
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiError>;
      const message = axiosError.response?.data?.message || "Login failed.";
      if (message.includes(",")) {
        message.split(",").forEach((msg: string, index: number) => {
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
        <div className="flex justify-center items-center h-full bg-black bg-opacity-50"></div>
      </div>

      <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
        <div className="text-center mb-8 mx-auto">
          <img src={Logo} className="max-w-[150px] w-full mx-auto" alt="Logo" />
        </div>

        <div className="w-full mx-auto sm:max-w-96 max-w-full rounded-xl shadow-md border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)] sm:mb-6 mb-3">
              Account Login
            </h2>



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
                autoComplete="email"
                className={`font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] ${errors.email
                  ? "border-red-500"
                  : "border-[#E8E8E8] focus:border-[var(--primary-color)]"
                  }`}
                placeholder="Enter your email"
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

            <div className="mb-2">
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
                  autoComplete="current-password"
                  className={`font-medium text-sm text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg transition-all pr-12  outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] ${errors.password
                    ? "border-red-500"
                    : "border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    }`}
                  placeholder="Enter your password"
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
                  className="absolute right-3 top-4 flex items-center justify-center w-8 h-8 hover:opacity-75 transition-opacity"
                >
                  <img
                    src={showPassword ? ImageOpen : ImageClose}
                    alt={showPassword ? "Hide password" : "Show password"}
                    className="w-5 h-5"
                  />
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="sm:mb-6 mb-4 flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-bold text-[var(--primary-color)] hover:opacity-75 transition-opacity"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`w-full mx-auto group text-white p-2.5 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase transition-all bg-gradient-to-r from-[#1a3652] to-[#448bd2] ${isButtonDisabled
                ? "disabled:pointer-events-none disabled:opacity-40"
                : "opacity-100 active:scale-95"
                }`}
            >
              {loading ? "Logging in..." : "Log In"}
              {!loading && (
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="25"
                  className={`transition-transform duration-300 ${isButtonDisabled ? "-rotate-45" : "rotate-0"
                    }`}
                />
              )}
            </button>

            {/* <div className="text-center my-3">
              <img src={LoginOr} className="mx-auto" alt="or divider" />
            </div>

            <button
              type="button"
              className="flex-row-reverse w-full mx-auto group text-[var(--secondary-color)] p-2.5 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-[#E4F0FC] hover:bg-[#D4E5F5] transition-colors"
            >
              Continue with m365
              <img src={M365Icon} alt="m365" />
            </button> */}

            <div className="mt-4 text-center ">
              <p className="text-sm font-medium text-[var(--secondary-color)]">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-[var(--primary-color)] underline hover:opacity-75 hover:no-underline"
                >
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
