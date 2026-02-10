import { useEffect, useState } from "react";
const Logo = "/static/img/home/logo.svg";
const ResendMail = "/static/img/icons/resend-email-icon.svg";
import api from "../../services/axios";
import { AxiosError } from "axios";
import SpinnerLoader from "../../components/spinnerLoader";
import { toast } from "react-toastify";


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

  useEffect(() => {
    const savedEmail = localStorage.getItem("registeredEmail");
    setEmail(savedEmail);
  }, []);


  const handleResend = async () => {
    if (!email || loading) return;

    try {
      setLoading(true);

      await api.post("auth/resend-verification-email", { email });

      // Handle Success
      toast.success("Verification email resent successfully");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.status === 401) return;

      let errorMsg = axiosError.response?.data?.message || "Failed to resend email";
      toast.error(errorMsg);
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
                className={`text-sm font-bold transition-all ${loading
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
