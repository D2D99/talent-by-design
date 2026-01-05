import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../public/static/img/home/logo.svg";
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

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        {
          email,
          password,
          confirmPassword
        }
      );

      // ✅ Store email for resend page
      localStorage.setItem("registeredEmail", email);

      navigate("/after-register");
    } catch (error: any) {
      alert(error.response?.data?.message || "Registration failed");
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
            <img src={Logo} className="max-w-[150px] w-full mx-auto" alt="" />
          </div>

          <div className="w-full mx-auto sm:max-w-96 max-w-full rounded-xl shadow-md border bg-white sm:py-10 py-6 sm:px-10 px-4">
            <form onSubmit={(e) => e.preventDefault()}>
              <h2 className="sm:text-2xl text-xl font-bold sm:mb-6 mb-3">
                Welcome!
              </h2>

              <div className="sm:mb-4 mb-2">
                <label htmlFor="email" className="font-bold text-sm">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-medium text-sm w-full p-3 mt-2 border rounded-lg"
                  placeholder="Enter your email"
                />
              </div>

              <div className="sm:mb-4 mb-2">
                <label htmlFor="password" className="font-bold text-sm">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-medium text-sm w-full p-3 mt-2 border rounded-lg"
                  placeholder="Enter your password"
                />
              </div>

              <div className="sm:mb-5 mb-4">
                <label htmlFor="confirmPassword" className="font-bold text-sm">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="font-medium text-sm w-full p-3 mt-2 border rounded-lg"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleRegister}
                className="w-full mx-auto group text-white p-2.5 rounded-full flex justify-center items-center gap-1.5 font-semibold uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] mt-6"
              >
                {loading ? "Registering..." : "Register"}
                <Icon icon="mynaui:arrow-right-circle-solid" width="25" />
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm font-medium">
                  Already have an account?{" "}
                  <Link to="/login" className="font-bold underline">
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <div className="mt-4 text-center">
            <p className="max-w-sm mx-auto text-sm font-medium">
              By clicking REGISTER, you agree to our{" "}
              <Link to="" className="font-bold underline">
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
