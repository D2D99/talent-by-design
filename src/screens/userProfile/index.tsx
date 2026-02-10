import { useState, useEffect, type ChangeEvent } from "react";
import api from "../../services/axios";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import SpinnerLoader from "../../components/spinnerLoader";

const UserProfilePic = "/static/img/ic-profile-ph.svg";

interface ProfileFormData {
  firstName: string;
  middleInitial: string;
  lastName: string;
  dob: string;
  gender: string;
  email: string;
  phoneNumber: string;
  role: string;
  country: string;
  state: string;
  zipCode: string;
  profileImage: string;
  orgName: string;
}

const UserProfile = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    middleInitial: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    phoneNumber: "",
    role: "",
    country: "",
    state: "",
    zipCode: "",
    profileImage: "",
    orgName: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/my-profile");
      const data = response.data;

      // Format date for input field safely
      let formattedDob = "";
      if (data.dob) {
        const dateObj = new Date(data.dob);
        if (!isNaN(dateObj.getTime())) {
          formattedDob = dateObj.toISOString().split("T")[0];
        }
      }

      setFormData({
        firstName: data.firstName || "",
        middleInitial: data.middleInitial || "",
        lastName: data.lastName || "",
        dob: formattedDob,
        gender: data.gender || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        role: data.role || "",
        country: data.country || "",
        state: data.state || "",
        zipCode: data.zipCode || "",
        profileImage: data.profileImage || "",
        orgName: data.orgName || "",
      });
      setPreviewUrl(data.profileImage || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    // Map IDs to state keys
    const fieldMapping: { [key: string]: string } = {
      fname: "firstName",
      mname: "middleInitial",
      lname: "lastName",
      dob: "dob",
      gender: "gender",
      email: "email",
      phno: "phoneNumber",
      userRole: "role",
      country: "country",
      city: "state", // Mapping 'city' ID to 'state' field as requested
      zipCode: "zipCode",
    };

    const fieldName = fieldMapping[id] || id;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("middleInitial", formData.middleInitial);
      data.append("lastName", formData.lastName);
      data.append("dob", formData.dob);
      data.append("gender", formData.gender);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("country", formData.country);
      data.append("state", formData.state);
      data.append("zipCode", formData.zipCode);

      if (selectedFile) {
        data.append("profileImage", selectedFile);
      }

      const response = await api.patch("/auth/update-profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update localStorage user object if it exists
      const savedUser = localStorage.getItem("user");
      if (savedUser && response.data.user) {
        const userObj = JSON.parse(savedUser);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...userObj, ...response.data.user }),
        );
      }

      toast.success("Profile updated successfully!");
      window.dispatchEvent(new CustomEvent("profile-updated"));
      fetchProfile(); // Refresh data
    } catch (error: any) {
      console.error("Error updating profile:", error);
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.status === 401) return;

      const fullMessage =
        axiosError.response?.data?.message || "Failed to update profile.";

      // If the message contains multiple errors (separated by comma), split and show multiple toasts
      if (fullMessage.includes(",")) {
        fullMessage.split(",").forEach((msg, index) => {
          toast.error(msg.trim(), { autoClose: 3000 + index * 1000 });
        });
      } else {
        toast.error(fullMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      // <div className="flex justify-center items-center h-screen">
      //   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#448CD2]"></div>
      // </div>
      <SpinnerLoader />
    );
  }

  return (
    <>
      <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-152px)]">
        <div className="flex items-center md:justify-between gap-4 flex-wrap mb-8">
          <h2 className="md:text-2xl text-xl font-bold">My Profile</h2>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="relative overflow-hidden z-0 text-white px-4 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-2">General Information</h4>
          <hr className="!border-[#E8E8E8]" />

          <div className="mt-6 flex gap-3 items-center">
            <div className="relative">
              <img
                src={previewUrl || UserProfilePic}
                alt="Profile Picture"
                className="rounded-full w-20 h-20 object-cover border-2 border-[#448CD2]/20"
              />

              <label
                htmlFor="upload"
                className="border p-0.5 w-fit rounded-full border-[#4B9BE9]/25 absolute bottom-1.5 bg-white -right-0.5 cursor-pointer shadow-sm hover:bg-neutral-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                >
                  <g
                    stroke="#4B9BE9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <path
                      fill="#4B9BE9"
                      fillOpacity="0"
                      strokeDasharray="20"
                      d="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5"
                    >
                      <animate
                        attributeName="d"
                        dur="1.5s"
                        keyTimes="0;0.5;1"
                        repeatCount="indefinite"
                        values="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5;M12 15h2v-3h2.5l-4.5 -4.5M12 15h-2v-3h-2.5l4.5 -4.5;M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5"
                      />
                      <animate
                        fill="freeze"
                        attributeName="stroke-dashoffset"
                        dur="0.5s"
                        values="20;0"
                      />
                      <animate
                        fill="freeze"
                        attributeName="fill-opacity"
                        begin="0.7s"
                        dur="0.4s"
                        to="1"
                      />
                    </path>
                    <path
                      fill="none"
                      strokeDasharray="14"
                      strokeDashoffset="14"
                      d="M6 19h12"
                    >
                      <animate
                        fill="freeze"
                        attributeName="stroke-dashoffset"
                        begin="0.5s"
                        dur="0.2s"
                        to="0"
                      />
                    </path>
                  </g>
                </svg>
                <input
                  type="file"
                  id="upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <div>
              <h5 className="font-semibold text-lg">
                {formData.firstName || formData.lastName
                  ? `${formData.firstName}${formData.middleInitial ? ` ${formData.middleInitial}` : ""} ${formData.lastName}`
                  : "User Name"}
              </h5>
              <p className="text-sm text-neutral-400 font-medium -mt-0.5 uppercase">
                {formData.role || "User Role"}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-6 mt-6">
            <div>
              <label
                htmlFor="fname"
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
              >
                First Name *
              </label>
              <input
                type="text"
                id="fname"
                value={formData.firstName}
                onChange={handleChange}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)]"
                placeholder="Enter your first name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="mname"
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
              >
                Middle Initial
              </label>
              <input
                type="text"
                id="mname"
                value={formData.middleInitial}
                onChange={handleChange}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)]"
                placeholder="Enter your middle initial"
              />
            </div>

            <div>
              <label
                htmlFor="lname"
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
              >
                Last Name *
              </label>
              <input
                type="text"
                id="lname"
                value={formData.lastName}
                onChange={handleChange}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)]"
                placeholder="Enter your last name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="dob"
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
              >
                Date of Birth *
              </label>
              <input
                type="date"
                id="dob"
                value={formData.dob}
                onChange={handleChange}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)]"
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
              >
                Gender
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 right-0 top-2 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-[#5D5D5D]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="font-medium text-sm text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg appearance-none transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                readOnly
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] bg-neutral-100 cursor-not-allowed"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="phno"
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
              >
                Phone Number *
              </label>
              <input
                type="text"
                id="phno"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)]"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label
                htmlFor="userRole"
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
              >
                User Role
              </label>
              <input
                type="text"
                id="userRole"
                value={formData.role}
                readOnly
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] bg-neutral-100 cursor-not-allowed"
                placeholder="User role"
              />
            </div>

            <div>
              <label
                htmlFor="orgName"
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
              >
                Organization
              </label>
              <input
                type="text"
                id="orgName"
                value={formData.orgName}
                readOnly
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] bg-neutral-100 cursor-not-allowed"
                placeholder="Organization name"
              />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h4 className="text-xl font-semibold mb-2">Address</h4>
          <hr className="!border-[#E8E8E8]" />

          <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-6 mt-6">
            <div>
              <label
                htmlFor="country"
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
              >
                Country *
              </label>
              <input
                type="text"
                id="country"
                value={formData.country}
                onChange={handleChange}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)]"
                placeholder="Enter your country"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
              >
                State *
              </label>
              <input
                type="text"
                id="city"
                value={formData.state}
                onChange={handleChange}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)]"
                placeholder="Enter your state"
              />
            </div>

            <div>
              <label
                htmlFor="zipCode"
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
              >
                Zip Code *
              </label>
              <input
                type="text"
                id="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)]"
                placeholder="Enter your zip code"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
