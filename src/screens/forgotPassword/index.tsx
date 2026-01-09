import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../public/static/img/home/logo.svg";
import { Icon } from "@iconify/react";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // ===== FORM STATE =====
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== SEND RESET EMAIL =====
  const handleClick = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}auth/forgot-password`,
        { email }
      );

      // ✅ Navigate only after successful API call
      navigate("/after-send-email");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  // Check if the email field is filled
  const isFormValid = email.trim() !== "";

  return (
    <div className="flex min-h-screen bg-[var(--light-primary-color)]">
      <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
        <div className="text-center mb-8 mx-auto">
          <img src={Logo} className="max-w-[150px] w-full mx-auto" alt="Logo" />
        </div>

        <div className="w-full mx-auto sm:max-w-96 max-w-full rounded-xl shadow-md shadow-[4px 4px 4px 0px #448CD21A;] border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()}>
            <h2 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)] mb-1">
              Reset Password
            </h2>

            <p className="text-sm font-normal sm:mb-6 mb-3">
              If the email provided is associated with an account, you will
              receive an email with instructions for resetting your password.
            </p>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg hover:border-blue-300/55"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="button"
              onClick={handleClick}
              disabled={loading || !isFormValid} // Disable button if form is invalid or loading
              className={`w-full mx-auto group text-[var(--white-color)] p-2.5 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] ${
                isFormValid ? "opacity-100" : "opacity-40"
              } hover:opacity-100 duration-200`}
            >
              {loading ? "Sending..." : "Send email"}
              <Icon
                icon="mynaui:arrow-right-circle-solid"
                width="25"
                height="25"
                className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
              />
            </button>

            <div className="mt-4 text-center">
              <Link
                to={"/login"}
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
              to={""}
              className="font-bold text-[var(--primary-color)] underline hover:opacity-75"
            >
              Contact Us Yayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
