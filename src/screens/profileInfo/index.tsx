import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../public/static/img/home/logo.svg";
import { Icon } from "@iconify/react";
import axios from "axios";

const ProfileInfo = () => {
  const navigate = useNavigate();

  // ===== LOGIC STATE ONLY =====
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [initials, setInitials] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== SUBMIT PROFILE =====
  const handleClick = async () => {
    if (!firstName || !lastName || !role || !department || !initials) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/complete-profile`,
        {
          firstName,
          lastName,
          role,
          department,
          initials,
        },
        {
          withCredentials: true, // ✅ REQUIRED (cookie)
        }
      );

      alert("Profile completed successfully");
      navigate("/login");
    } catch (error: any) {
      alert(error.response?.data?.message || "Profile completion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-[var(--light-primary-color)]">
        <div
          className=" lg:block hidden w-1/2 !bg-cover !bg-top !bg-no-repeat"
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

          <div className="w-full mx-auto sm:max-w-96 max-w-full rounded-xl shadow-md shadow-[4px 4px 4px 0px #448CD21A;] border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
            <form>
              <h2 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)] sm:mb-6 mb-3">
                Fill In Profile Info
              </h2>

              <div className="sm:mb-4 mb-2">
                <label
                  htmlFor="firstName"
                  className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                >
                  First Name
                </label>

                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg hover:border-blue-300/55 pr-10"
                />
              </div>

              <div className="sm:mb-4 mb-2">
                <label
                  htmlFor="lastName"
                  className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                >
                  Last Name
                </label>

                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg hover:border-blue-300/55 pr-10"
                />
              </div>

              <div className="sm:mb-4 mb-2">
                <label
                  htmlFor="role"
                  className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                >
                  Role
                </label>

                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg hover:border-blue-300/55"
                >
                  <option value="">Select your role</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>

              <div className="sm:mb-4 mb-2">
                <label
                  htmlFor="department"
                  className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                >
                  Department
                </label>

                <select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg hover:border-blue-300/55"
                >
                  <option value="">Select your department</option>
                  <option value="hr">HR</option>
                  <option value="engineering">Engineering</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>

              <div className="sm:mb-6 mb-5 max-w-20">
                <label
                  htmlFor="initials"
                  className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                >
                  Initials
                </label>

                <select
                  id="initials"
                  value={initials}
                  onChange={(e) => setInitials(e.target.value)}
                  className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg hover:border-blue-300/55"
                >
                  <option value="">Select</option>
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                </select>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleClick}
                className="w-full mx-auto group text-[var(--white-color)] p-2.5 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] opacity-40 hover:opacity-100 duration-200"
              >
                {loading ? "Saving..." : "Get Started"}
                <Icon className="iconify iconify--mynaui -rotate-45 group-hover:rotate-0 transition-transform duration-300" icon="mynaui:arrow-right-circle-solid" width="25" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;
