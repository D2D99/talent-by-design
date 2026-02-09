import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/axios";
const Logo = "/static/img/home/logo.svg";
const ResendMail = "/static/img/icons/resend-email-icon.svg";
const BackIcon = "/static/img/icons/back-icon.svg";
import SpinnerLoader from "../../components/spinnerLoader";

const COOLDOWN_MS = 15 * 60 * 1000; // 15 Minutes

const AfterSendEmail = () => {
  const navigate = useNavigate();
  // ✅ PAGE LOADER (ADDED)
  const [pageLoading, setPageLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // ✅ PAGE LOADER EFFECT (ADDED)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000); // adjust if needed

    return () => clearTimeout(timer);
  }, []);

  // Track remaining seconds for the UI countdown
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Initialize resendCount from localStorage
  const [resendCount, setResendCount] = useState<number>(() => {
    const savedCount = localStorage.getItem("resendAttempts");
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  useEffect(() => {
    // 1. Check for email
    const savedEmail = localStorage.getItem("emailForResend");
    if (!savedEmail) {
      navigate("/forgot-password");
      return;
    }
    setEmail(savedEmail);

    // 2. Cooldown Logic
    const checkCooldown = () => {
      const lastAttempt = localStorage.getItem("lastResendTimestamp");
      const currentCount = parseInt(
        localStorage.getItem("resendAttempts") || "0",
        10,
      );

      if (currentCount >= 2 && lastAttempt) {
        const startTime = parseInt(lastAttempt, 10);
        const elapsed = Date.now() - startTime;
        const remaining = COOLDOWN_MS - elapsed;

        if (remaining > 0) {
          setTimeLeft(Math.ceil(remaining / 1000));
        } else {
          // Time is up: Clear restrictions
          setTimeLeft(0);
          setResendCount(0);
          localStorage.removeItem("resendAttempts");
          localStorage.removeItem("lastResendTimestamp");
        }
      }
    };

    // Run immediately and then every second
    checkCooldown();
    const timer = setInterval(checkCooldown, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleResend = async () => {
    if (!email || timeLeft > 0 || resendCount >= 2) return;

    try {
      setLoading(true);

      await api.post("auth/forgot-password", { email });

      const nextCount = resendCount + 1;
      setResendCount(nextCount);
      localStorage.setItem("resendAttempts", nextCount.toString());

      // If this was the final attempt, start the 15-minute timer
      if (nextCount >= 2) {
        localStorage.setItem("lastResendTimestamp", Date.now().toString());
      }

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error: any) {
      if (error.response?.status === 401) return;
      let errorMessage = error.response?.data?.message || "Failed to resend email";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ✅ LOADER RENDERS FIRST
  if (pageLoading) {
    return <SpinnerLoader />;
  }

  return (
    <div className="min-h-screen bg-[var(--light-primary-color)] relative">
      {/* Success Toaster */}
      <div
        className={`${showToast ? "block" : "hidden"
          } px-3 absolute left-1/2 top-6 w-full transform -translate-x-1/2 z-50`}
      >
        <div className="flex items-center justify-between bg-gray-800 text-white p-3 rounded-lg max-w-xl mx-auto shadow-lg">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="12" fill="#3F9933" />
              <path
                d="M9.98429 14.588L16.953 7.61924C17.1175 7.45479 17.3094 7.37256 17.5286 7.37256C17.7479 7.37256 17.9398 7.45479 18.1042 7.61924C18.2687 7.78369 18.3509 7.97912 18.3509 8.20552C18.3509 8.43192 18.2687 8.62707 18.1042 8.79098L10.5599 16.3559C10.3954 16.5203 10.2036 16.6026 9.98429 16.6026C9.76502 16.6026 9.57316 16.5203 9.4087 16.3559L5.87294 12.8201C5.70848 12.6557 5.62954 12.4605 5.63612 12.2347C5.6427 12.0088 5.72849 11.8134 5.89349 11.6484C6.0585 11.4834 6.25392 11.4011 6.47977 11.4017C6.70562 11.4022 6.90078 11.4845 7.06523 11.6484L9.98429 14.588Z"
                fill="white"
              />
            </svg>
            <span className="sm:text-lg text-sm font-semibold">
              Email was resent
            </span>
          </div>
        </div>
      </div>

      <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
        <div className="text-center mb-8 mx-auto">
          <img src={Logo} className="max-w-[150px] w-full mx-auto" alt="Logo" />
        </div>

        <div className="w-full mx-auto max-w-96 rounded-xl shadow-md border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4 text-center">
          <div className="text-left mb-4">
            <Link to={"/forgot-password"} className="flex items-center gap-1">
              <img src={BackIcon} alt="Back" />
              <p className="text-sm font-bold text-[var(--primary-color)]">
                Back
              </p>
            </Link>
          </div>

          <img src={ResendMail} className="mx-auto mb-4" alt="email-icon" />
          <h2 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)] mb-1">
            Check Your Inbox
          </h2>
          <p className="text-sm font-normal text-gray-600 mb-6">
            If the email provided is associated with an account, you will
            receive an email with instructions for resetting your password.
          </p>

          <div className="mt-4">
            <button
              onClick={handleResend}
              disabled={loading || timeLeft > 0}
              className={`text-sm font-bold transition-all ${loading || timeLeft > 0
                ? "text-gray-400 cursor-not-allowed no-underline"
                : "text-[#448CD2] hover:underline cursor-pointer"
                }`}
            >
              {loading ? "Sending..." : "Resend Email"}
            </button>

            {timeLeft > 0 ? (
              <div className="mt-2">
                <p className="text-[10px] text-red-500 font-semibold uppercase tracking-wider">
                  Max attempts reached. Please wait.
                </p>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">
                  Try again in{" "}
                  <span className="text-red-500 font-bold">
                    {formatTime(timeLeft)}
                  </span>
                </p>
              </div>
            ) : (
              resendCount > 0 &&
              resendCount < 2 && (
                <p className="text-[10px] text-gray-400 mt-1">
                  {2 - resendCount} attempt{2 - resendCount > 1 ? "s" : ""}{" "}
                  remaining
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfterSendEmail;
