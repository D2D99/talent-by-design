import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import IconArrow from "../../../public/static/img/icons/iconamoon_arrow.png";
import DeleteImg from "../../../public/static/img/icons/delete-img.svg";
import Pagination from "../../components/Pagination";
import { Modal, Ripple, initTWE } from "tw-elements";
import axios from "axios";
// import jwt_decode from '@auth0/jwt-decode';

const OrgInvitation = () => {
  useEffect(() => {
    initTWE({ Ripple, Modal });
  }, []);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const totalItems = 100;

  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Changed to page:", page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset page to 1 when items per page changes
    console.log("Items per page changed to:", items);
  };

  // Function to decode the JWT token
  const decodeJWT = (token: string) => {
    try {
      const parts = token.split(".");

      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }

      const base64Url = parts[1]; // This is the payload
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Base64Url to Base64 conversion

      let decodedPayload = "";
      decodedPayload = atob(base64);

      const parsedPayload = JSON.parse(decodedPayload);
      return parsedPayload;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  const handleSendInvite = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setErrorMessage("No token found. User might not be authenticated.");
      return;
    }

    const decodedToken = decodeJWT(token);

    if (!decodedToken) {
      setErrorMessage("Invalid token. Please log in again.");
      return;
    }

    // Check if the token is expired
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTimestamp) {
      setErrorMessage("Session expired. Please log in again.");
      return;
    }

    if (!email || !role) {
      setErrorMessage("Both email and role are required.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null); // Reset any previous error message

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}auth/send-invitation`,
        { email, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      alert("Invitation sent successfully");
      setEmail(""); // Clear email field after success
      setRole(""); // Clear role field after success
    } catch (error) {
      const axiosError = error as any;
      if (axiosError.response?.status === 401) {
        setErrorMessage("Unauthorized. Please log in again.");
      } else {
        setErrorMessage(
          axiosError.response?.data?.message || "Failed to send invitation.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <div className="sticky top-6 z-10 flex items-center gap-2 justify-between bg-white border border-[#448CD2] border-opacity-20 shadow-[0px_0px_5px_0px_#4B9BE980] sm:p-6 rounded-[12px] py-3 px-3">
          <div>
            <div className="md:hidden visible restore-sidebar restore-sidebar-mobile absolute top-1/2 transform -translate-y-1/2 left-[-12px] cursor-pointer">
              <button
                type="button"
                data-twe-offcanvas-toggle
                data-twe-target="#offcanvasExample"
                aria-controls="offcanvasExample"
                data-twe-ripple-init
                data-twe-ripple-color="light"
              >
                <img src={IconArrow} alt="arrow" className="w-5 h-5" />
              </button>
            </div>
            <h3 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)] ">
              Welcome back, Suzanna De S!
            </h3>
            <p className="sm:text-sm text-xs font-normal text-[var(--secondary-color)] mt-1">
              Complete platform oversight with real-time performance insights,
              user activity, and priority actions requiring your attention.
            </p>
          </div>

          <div className="relative">
            <button type="button">
              <Icon
                icon="tabler:bell"
                width="28"
                height="28"
                className="sm:w-7 sm:h-7 w-5 h-5"
              />
            </button>
            <p className="w-[6px] h-[6px] bg-[#FF0000] rounded-full absolute top-0 right-[8px] border border-white"></p>
          </div>
        </div>

        <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[0px_0px_5px_0px_#4B9BE980] sm:p-6 p-3 rounded-[12px] mt-6">
          <div className="flex items-center md:justify-between justify-center gap-3 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-[var(--secondary-color)]">
                Assessment Questions
              </h2>
            </div>
            <div>
              <button
                type="button"
                data-twe-toggle="modal"
                data-twe-target="#exampleModalCenter"
                data-twe-ripple-init
                data-twe-ripple-color="light"
                className="group text-white rounded-full py-2 sm:scale-100 scale-75 pr-4 pl-5 flex items-center gap-1.5 font-semibold text-lg  uppercase bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)]"
              >
                <Icon
                  icon="material-symbols:add-rounded"
                  width="24"
                  height="24"
                />
                Add New organization
              </button>
            </div>
          </div>

          <div className="mt-8">
            <form
              action=""
              className="bg-[#EDF5FD] rounded-full px-3 py-1.5 pl-6 gap-2 justify-end  ms-auto max-w-80 w-full border border-[#448CD2]"
            >
              <div className="flex items-center gap-2 justify-between">
                <input
                  type="search"
                  className="font-medium text-sm text-[#5D5D5D] outline-0 w-full max-w-60  bg-transparent rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
                  id="gsearch"
                  name="gsearch"
                />
                <div className="bg-[var(--primary-color)] h-8 w-8 rounded-full flex items-center justify-center cursor-pointer">
                  <Icon
                    icon="fluent:search-20-filled"
                    className="text-white"
                    width="20"
                    height="20"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="mt-7 mb-4">
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[#edf5fd]">
                    <th className="px-6 py-2 text-left text-base font-semibold text-[#000000]">
                      #
                    </th>
                    <th className="px-6 py-2 text-left text-base font-semibold text-[#000000]">
                      Org Name
                    </th>
                    <th className="px-6 py-2 text-left text-base font-semibold text-[#000000]">
                      Email
                    </th>
                    <th className="px-6 py-2 text-left text-base font-semibold text-[#000000]">
                      Start Date
                    </th>
                    <th className="px-6 py-2 text-left text-base font-semibold text-[#000000]">
                      Total Users
                    </th>
                    <th className="px-6 py-2 text-left text-base font-semibold text-[#000000]">
                      Status
                    </th>
                    <th className="px-6 py-2 text-left text-base font-semibold text-[#000000]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#edf5fd] hover:bg-[#edf5fd]">
                    <td className="px-6 py-2 text-left text-base font-semibold text-[#000000]">
                      1
                    </td>
                    <td className="px-6 py-2 text-left text-base font-normal text-[#000000]">
                      Codemantra Solutions
                    </td>
                    <td className="px-6 py-2 text-left text-base font-normal text-[#000000]">
                      cmstester6@gmail.com
                    </td>
                    <td className="px-6 py-2 text-left text-base font-normal text-[#000000]">
                      25 Jan, 2026
                    </td>
                    <td className="px-6 py-2 text-left text-base font-normal text-[#000000]">
                      15
                    </td>
                    <td className="px-6 py-2">
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border w-fit bg-[#EEF7ED] text-green-700 border-[#3F9933]">
                          • Accept
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        data-twe-toggle="modal"
                        data-twe-target="#exampleModalCenters"
                        data-twe-ripple-init
                        data-twe-ripple-color="light"
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Icon
                          icon="la:trash-alt-solid"
                          width="20"
                          height="20"
                        />
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-[#edf5fd] hover:bg-[#edf5fd]">
                    <td className="px-6 py-2 text-left text-base font-semibold text-[#000000]">
                      2
                    </td>
                    <td className="px-6 py-2 text-left text-base font-normal text-[#000000]">
                      Codemantra Solutions
                    </td>
                    <td className="px-6 py-2 text-left text-base font-normal text-[#000000]">
                      cmstester6@gmail.com
                    </td>
                    <td className="px-6 py-2 text-left text-base font-normal text-[#000000]">
                      25 Jan, 2026
                    </td>
                    <td className="px-6 py-2 text-left text-base font-normal text-[#000000]">
                      15
                    </td>
                    <td className="px-6 py-2">
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border w-fit bg-[#FFEBEB] text-[#D71818] border-[#D71818]">
                          • Expire
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        data-twe-toggle="modal"
                        data-twe-target="#exampleModalCenters"
                        data-twe-ripple-init
                        data-twe-ripple-color="light"
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Icon
                          icon="la:trash-alt-solid"
                          width="20"
                          height="20"
                        />
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-[#edf5fd] hover:bg-[#edf5fd]">
                    <td className="px-6 py-2 text-left text-base font-semibold text-[#000000]">
                      3
                    </td>
                    <td className="px-6 py-2 text-left text-base font-normal text-[#000000]">
                      Codemantra Solutions
                    </td>
                    <td className="px-6 py-2 text-left text-base font-normal text-[#000000]">
                      cmstester6@gmail.com
                    </td>
                    <td className="px-6 py-2 text-left text-base font-normal text-[#000000]">
                      25 Jan, 2026
                    </td>
                    <td className="px-6 py-2 text-left text-base font-normal text-[#000000]">
                      15
                    </td>
                    <td className="px-6 py-2">
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border w-fit bg-[#FFF8EB] text-[#DB8C28] border-[#DB8C28]">
                          • Pending
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        data-twe-toggle="modal"
                        data-twe-target="#exampleModalCenters"
                        data-twe-ripple-init
                        data-twe-ripple-color="light"
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Icon
                          icon="la:trash-alt-solid"
                          width="20"
                          height="20"
                        />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>
      </div>
      {/* Add New Organization */}
      <div
        data-twe-modal-init
        className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="exampleModalCenter"
        tabIndex={-1}
        aria-labelledby="exampleModalCenterTitle"
        aria-modal="true"
        role="dialog"
      >
        <div
          data-twe-modal-dialog-ref
          className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-xl mx-auto"
        >
          <div className="mx-3 pointer-events-auto relative flex max-w-xl w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none dark:bg-surface-dark">
            <div className="flex flex-shrink-0 items-center justify-between  rounded-t-md p-4 dark:border-white/10">
              <h5
                className="text-xl font-bold leading-normal"
                id="exampleModalCenterTitle"
              >
                Add New Organization
              </h5>
              <button
                type="button"
                className="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                data-twe-modal-dismiss
                aria-label="Close"
              >
                <span className="[&>svg]:h-6 [&>svg]:w-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              </button>
            </div>

            <div className="relative px-4 pb-4">
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
                  className="font-medium text-sm border-[#E8E8E8] focus:border-[var(--primary-color)] text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg transition-all"
                />
              </div>

              <div className="sm:mb-4 mb-2">
                <label
                  htmlFor="role"
                  className="font-bold text-[var(--secondary-color)] text-sm"
                >
                  Role
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
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={
                      "font-medium text-sm text-[#5D5D5D] appearance-none outline-0 w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    }
                  >
                    <option value="">Select your role</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#E8E8E8] py-4 mt-4 px-4">
              <button
                type="button"
                className="group text-[var(--primary-color)] pl-4 py-2 pr-2 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase   hover:opacity-100 duration-200"
                data-twe-modal-dismiss
                data-twe-ripple-init
                data-twe-ripple-color="light"
              >
                Cancel
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="25"
                  height="25"
                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                />
              </button>
              <button
                type="button"
                onClick={handleSendInvite} // Added functionality to "Send invite"
                className="group text-[var(--white-color)] pl-4 py-2 pr-2 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2]  hover:opacity-100 duration-200"
              >
                {isLoading ? "Send invite..." : "Send invite"}

                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="25"
                  height="25"
                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                  data-twe-ripple-init
                  data-twe-ripple-color="light"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Add New Organization */}

      {/* Delete Admin when the status is expired */}
      <div
        data-twe-modal-init
        className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="exampleModalCenters"
        tabIndex={-1}
        aria-labelledby="exampleModalCentersTitle"
        aria-modal="true"
        role="dialog"
      >
        <div
          data-twe-modal-dialog-ref
          className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-xl mx-auto"
        >
          <div className="mx-3 pointer-events-auto relative flex max-w-xl w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none dark:bg-surface-dark">
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 dark:border-white/10">
              <h5
                className="text-xl font-medium leading-normal text-surface dark:text-white"
                id="exampleModalCentersTitle"
              ></h5>
              <button
                type="button"
                className="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                data-twe-modal-dismiss
                aria-label="Close"
              >
                <span className="[&>svg]:h-6 [&>svg]:w-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              </button>
            </div>

            <div className="relative px-4 pb-4">
              <div className="mx-auto sm:w-full w-16 sm:h-full h-16">
                <img src={DeleteImg} className="mx-auto" alt="porgressImg" />
              </div>
              <div className="">
                <h2 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)] mt-4 text-center">
                  Are you sure to delete this organization
                </h2>
                <p className="text-sm text-[var(--secondary-color)] font-normal mt-1 text-center">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#E8E8E8] py-4 mt-4 px-4">
              <button
                type="button"
                className="group text-[var(--primary-color)] pl-4 py-2 pr-2 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase   hover:opacity-100 duration-200"
                data-twe-modal-dismiss
                data-twe-ripple-init
                data-twe-ripple-color="light"
              >
                Exit
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="25"
                  height="25"
                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                />
              </button>
              <button
                type="button"
                className="group text-[var(--white-color)] pl-4 py-2 pr-2 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-[#D71818]  hover:opacity-100 duration-200"
              >
                Delete
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="25"
                  height="25"
                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                  data-twe-ripple-init
                  data-twe-ripple-color="light"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Delete Admin when the status is expired */}
      <div>{errorMessage}</div>
    </>
  );
};

export default OrgInvitation;
