import UserProfilePic from "../../../public/static/img/ic-profile-ph.svg";

const UserProfile = () => {
  return (
    <>
      <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-152px)]">
        <div className="flex items-center md:justify-between gap-4 flex-wrap mb-8">
          <h2 className="md:text-2xl text-xl font-bold">My Profile</h2>

          <button
            type="button"
            data-twe-toggle="modal"
            data-twe-target="#inviteModal"
            className="relative overflow-hidden z-0 text-[var(--white-color)] px-4 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
          >
            Save
          </button>
        </div>

        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-2">General Information</h4>
          <hr className="!border-[#E8E8E8]" />

          <div className="mt-6 flex gap-3 items-center">
            <div className="relative">
              <img
                src={UserProfilePic}
                alt="Profile Picture"
                className="rounded-full min-w-20 min-h-20"
              />

              <label
                htmlFor="upload"
                className="border p-0.5 w-fit rounded-full border-[#4B9BE9]/25 absolute bottom-2.5 bg-white -right-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                >
                  <g
                    stroke="#4B9BE9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  >
                    <path
                      fill="#4B9BE9"
                      fill-opacity="0"
                      stroke-dasharray="20"
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
                      stroke-dasharray="14"
                      stroke-dashoffset="14"
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
                <input type="file" id="upload" className="hidden" />
              </label>
            </div>
            <div>
              <h5 className="font-semibold text-lg">User Name</h5>
              <p className="text-sm text-neutral-400 font-medium -mt-0.5">
                User Role
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
                // autoComplete="email"
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
                // autoComplete="email"
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
                // autoComplete="email"
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
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)]"
                // placeholder="Enter your phone number"
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
                  className="font-medium text-sm text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg appearance-none transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
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
                autoComplete="email"
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)]"
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
                // autoComplete="email"
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
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)] read-only:bg-neutral-100 read-only:pointer-events-none"
                placeholder="Enter your role"
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
                Country
              </label>
              <input
                type="text"
                id="country"
                // autoComplete="email"
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)]"
                placeholder="Enter your country"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
              >
                City/State
              </label>
              <input
                type="text"
                id="city"
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)]"
                placeholder="Enter your city/state"
              />
            </div>

            <div>
              <label
                htmlFor="zipCode"
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
              >
                Zip Code
              </label>
              <input
                type="text"
                id="zipCode"
                // autoComplete="email"
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
