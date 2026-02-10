import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/axios";
import { toast } from "react-toastify";

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


      toast.success("Verification email resent successfully");
    } catch (error: any) {
      if (error.response?.status === 401) return;
      const errorMessage = error.response?.data?.message || "Failed to resend email";
      toast.error(errorMessage);
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
      <div className="min-h-screen bg-[var(--light-primary-color)] relative">

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
