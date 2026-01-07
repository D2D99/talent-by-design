import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../public/static/img/home/logo.svg";
import ImageClose from "../../../public/static/img/icons/eye-closed.png";
import ImageOpen from "../../../public/static/img/icons/eye-open.png";
import { Icon } from "@iconify/react";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  // ===== LOGIC STATE ONLY =====
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== REGISTER HANDLER =====
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        email,
        password,
        confirmPassword,
      });

      // ✅ Store email for resend page
      localStorage.setItem("registeredEmail", email);

      navigate("/after-register");
    } catch (error: any) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if all fields are filled and passwords match
  const isFormValid =
    email.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    password === confirmPassword;

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
            <img src={Logo} className="max-w-[150px] w-full mx-auto" alt="" />
          </div>

          <div className="w-full mx-auto sm:max-w-96 max-w-full rounded-xl shadow-md border bg-white sm:py-10 py-6 sm:px-10 px-4">
            <form onSubmit={(e) => e.preventDefault()}>
              <h2 className="sm:text-2xl text-xl font-bold sm:mb-6 mb-3">
                Welcome!
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg hover:border-blue-300/55 pr-10"
                />
              </div>

              <div className="sm:mb-4 mb-2">
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg hover:border-blue-300/55 pr-10"
                  />

                  <div
                    className="flex items-center absolute top-[57%] right-[10px] -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <img src={ImageOpen} alt="Hide password" />
                    ) : (
                      <img src={ImageClose} alt="Show password" />
                    )}
                  </div>
                </div>
              </div>

              <div className="sm:mb-5 mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg hover:border-blue-300/55 pr-10"
                  />

                  <div
                    className="flex items-center absolute top-[57%] right-[10px] -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <img src={ImageOpen} alt="Hide password" />
                    ) : (
                      <img src={ImageClose} alt="Show password" />
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={loading || !isFormValid}
                onClick={handleRegister}
                className={`w-full mx-auto group text-white p-2.5 rounded-full flex justify-center items-center gap-1.5 font-semibold uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] mt-6 ${isFormValid ? 'opacity-100' : 'opacity-40'} hover:opacity-100 duration-200`}
              >
                {loading ? "Registering..." : "Register"}
                <Icon icon="mynaui:arrow-right-circle-solid" width="25" />
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm font-medium">
                  Already have an account?{" "}
                  <Link to="/login" className="font-bold text-[var(--primary-color)] underline hover:opacity-75">
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <div className="mt-4 text-center">
            <p className="max-w-sm mx-auto text-sm font-medium">
              By clicking REGISTER, you agree to our{" "}
              <Link to="" className="font-bold text-[var(--primary-color)] underline hover:opacity-75">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
