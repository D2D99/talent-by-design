import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../public/static/img/home/logo.svg";
import { Icon } from "@iconify/react";
import axios from "axios";

const NewPassword = () => {
  const navigate = useNavigate();

  // ===== FORM STATE =====
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== SUBMIT HANDLER =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`,
        { password },
        {
          withCredentials: true // 🔐 REQUIRED for cookie-based reset
        }
      );

      alert("Password reset successful");
      navigate("/login");
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Reset link expired or invalid"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-[var(--light-primary-color)]">
        <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
          <div className="text-center mb-8 mx-auto">
            <img
              src={Logo}
              className="max-w-[150px] w-full mx-auto"
              alt="Logo"
            />
          </div>

          <div className="w-full mx-auto max-w-96 rounded-xl shadow-md shadow-[4px 4px 4px 0px #448CD21A;] border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
            <form onSubmit={handleSubmit}>
              <h2 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)] sm:mb-6 mb-3">
                New Password
              </h2>

              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="font-bold text-[var(--secondary-color)] text-sm"
                >
                  Enter new password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-medium text-sm text-[#5D5D5D] focus:outline-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg"
                  placeholder="Enter new password"
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="confirmPassword"
                  className="font-bold text-[var(--secondary-color)] text-sm"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="font-medium text-sm text-[#5D5D5D] focus:outline-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg"
                  placeholder="Confirm password"
                />
              </div>

              <ul className="mt-3">
                <li className="flex items-center gap-1 text-sm">
                  <Icon icon="material-symbols-light:check" width="18" />
                  <span>Minimum 8 characters</span>
                </li>
                <li className="flex items-center gap-1 text-sm">
                  <Icon icon="material-symbols-light:check" width="18" />
                  <span>At least 1 uppercase letter</span>
                </li>
                <li className="flex items-center gap-1 text-sm">
                  <Icon icon="material-symbols-light:check" width="18" />
                  <span>At least 1 lowercase letter</span>
                </li>
                <li className="flex items-center gap-1 text-sm">
                  <Icon icon="material-symbols-light:check" width="18" />
                  <span>At least 1 number</span>
                </li>
                <li className="flex items-center gap-1 text-sm">
                  <Icon icon="material-symbols-light:check" width="18" />
                  <span>At least 1 special character</span>
                </li>
              </ul>

              <button
                type="submit"
                disabled={loading}
                className="sm:mt-6 mt-3 w-full mx-auto group text-white p-2.5 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a365277] to-[#448bd28f]"
              >
                {loading ? "Saving..." : "Save password"}
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="22"
                  height="22"
                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                />
              </button>
            </form>
          </div>

          <div className="mt-4 text-center">
            <p className="max-w-80 mx-auto text-sm font-medium text-[var(--secondary-color)]">
              Forgot your email address or no longer have access to it?{" "}
              <Link
                to=""
                className="font-bold text-[var(--primary-color)] underline"
              >
                Contact Us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPassword;
