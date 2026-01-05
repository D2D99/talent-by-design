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
          initials
        },
        {
          withCredentials: true // ✅ REQUIRED (cookie)
        }
      );

      alert("Profile completed successfully");
      navigate("/login");
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Profile completion failed"
      );
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
            <img src={Logo} className="max-w-[150px] w-full mx-auto" alt="Logo" />
          </div>

          <div className="w-full mx-auto sm:max-w-96 max-w-full rounded-xl shadow-md shadow-[4px 4px 4px 0px #448CD21A;] border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
            <form>
              <h2 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)] sm:mb-6 mb-3">
                Fill In Profile Info
              </h2>

              <div className="sm:mb-4 mb-2">
                <label className="font-bold text-sm">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 mt-2 border rounded-lg"
                  placeholder="Enter your first name"
                />
              </div>

              <div className="sm:mb-4 mb-2">
                <label className="font-bold text-sm">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 mt-2 border rounded-lg"
                  placeholder="Enter your last name"
                />
              </div>

              <div className="sm:mb-4 mb-2">
                <label className="font-bold text-sm">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 mt-2 border rounded-lg"
                >
                  <option value="">Select your role</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>

              <div className="sm:mb-4 mb-2">
                <label className="font-bold text-sm">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-3 mt-2 border rounded-lg"
                >
                  <option value="">Select your department</option>
                  <option value="hr">HR</option>
                  <option value="engineering">Engineering</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>

              <div className="sm:mb-6 mb-5 max-w-20">
                <label className="font-bold text-sm">Initials</label>
                <select
                  value={initials}
                  onChange={(e) => setInitials(e.target.value)}
                  className="w-full p-3 mt-2 border rounded-lg"
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
                className="w-full mx-auto group text-white p-2.5 rounded-full flex justify-center items-center gap-1.5 font-semibold uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2]"
              >
                {loading ? "Saving..." : "Get Started"}
                <Icon icon="mynaui:arrow-right-circle-solid" width="25" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;
