import { useEffect, useState } from "react";
import Logo from "../../../public/static/img/home/logo.svg";
import ResendMail from "../../../public/static/img/icons/resend-email-icon.svg";
import axios from "axios";

const AfterRegister = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("registeredEmail");
    setEmail(savedEmail);
  }, []);

  const handleResend = async () => {
    if (!email) return;

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/resend-verification-email`,
        { email }
      );

      alert("Verification email resent");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to resend email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-[var(--light-primary-color)]">
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

          <div className="w-full mx-auto max-w-96 rounded-xl shadow-md border bg-white sm:py-10 py-6 sm:px-10 px-4">
            <img src={ResendMail} className="mx-auto" alt="email-icon" />

            <h2 className="sm:text-2xl text-xl text-center font-bold mb-1">
              Verify Your Email
            </h2>

            <p className="text-sm text-center mb-6">
              We've sent an email to <strong>{email}</strong>. Please click the
              link inside to verify your email.
            </p>

            <div className="mt-4 text-center">
              <button
                disabled={loading}
                onClick={handleResend}
                className="text-sm font-bold text-[#448bd2]"
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
