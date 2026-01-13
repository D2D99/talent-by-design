import { useEffect, useState } from "react";
import Logo from "../../../public/static/img/home/logo.svg";
import ResendMail from "../../../public/static/img/icons/resend-email-icon.svg";
import axios from "axios";
import SpinnerLoader from "../../components/spinnerLoader";

const AfterRegister = () => {
  const [email, setEmail] = useState<string | null>(null);
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

  // Toast States
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true); // Fixed: added 'isSuccess' variable

  useEffect(() => {
    const savedEmail = localStorage.getItem("registeredEmail");
    setEmail(savedEmail);
  }, []);

  const triggerToast = (msg: string, success: boolean) => {
    setToastMessage(msg);
    setIsSuccess(success);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleResend = async () => {
    if (!email || loading) return;

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}auth/resend-verification-email`,
        { email }
      );

      // Handle Success
      triggerToast("Verification email resent", true);
    } catch (error: unknown) {
      // Fixed: Specified 'unknown' and used type guarding to avoid 'any'
      let errorMsg = "Failed to resend email";

      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }

      triggerToast(errorMsg, false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOADER RENDERS FIRST
  if (pageLoading) {
    return <SpinnerLoader />;
  }

  return (
    <>
      {/* Dynamic Toaster */}
      <div
        className={`${
          showToast ? "block" : "hidden"
        } px-3 absolute left-1/2 top-6 w-full transform -translate-x-1/2 z-50 transition-all`}
      >
        <div className="flex items-center justify-between bg-gray-800 text-white p-3 rounded-lg max-w-xl mx-auto shadow-lg">
          <div className="flex items-center gap-2">
            {/* Dynamic Icon Color based on success/error */}
            <div
              className={`${
                isSuccess ? "bg-green-500" : "bg-red-500"
              } rounded-full p-1 grid place-items-center`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 16 16"
              >
                {isSuccess ? (
                  <path
                    fill="#ffffff"
                    d="M13.485 3.485a.75.75 0 0 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06L6.5 10.44l6.985-6.955Z"
                  />
                ) : (
                  <path
                    fill="#ffffff"
                    d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8s8-3.6 8-8s-3.6-8-8-8m0 2c1.3 0 2.5.4 3.5 1.1l-8.4 8.4C2.4 10.5 2 9.3 2 8c0-3.3 2.7-6 6-6m0 12c-1.3 0-2.5-.4-3.5-1.1l8.4-8.4c.7 1 1.1 2.2 1.1 3.5c0 3.3-2.7 6-6 6"
                  />
                )}
              </svg>
            </div>
            <span className="sm:text-lg text-sm font-semibold">
              {toastMessage}
            </span>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen bg-[var(--light-primary-color)] relative">
        <div
          className="lg:block hidden w-1/2 !bg-cover !bg-top !bg-no-repeat"
          id="login-bg"
        >
          <div className="flex justify-center items-center h-full bg-black bg-opacity-50"></div>
        </div>

        <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
          <div className="text-center mb-8 mx-auto">
            <img
              src={Logo}
              className="max-w-[150px] w-full mx-auto"
              alt="Logo"
            />
          </div>

          <div className="w-full mx-auto max-w-96 rounded-xl shadow-md border bg-white sm:py-10 py-6 sm:px-10 px-4 text-center">
            <img src={ResendMail} className="mx-auto mb-4" alt="email-icon" />

            <h2 className="sm:text-2xl text-xl font-bold mb-1">
              Verify Your Email
            </h2>

            <p className="text-sm mb-6 text-gray-600">
              We've sent an email to <strong>{email || "your email"}</strong>.
              Please check your inbox.
            </p>

            <div className="mt-4">
              <button
                disabled={loading}
                onClick={handleResend}
                className={`text-sm font-bold transition-all ${
                  loading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-[#448bd2] hover:underline cursor-pointer"
                }`}
              >
                {loading ? "Resending..." : "Resend Email"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AfterRegister;
