// import { useNavigate } from "react-router-dom";
// import Logo from "../../../public/static/img/home/logo.svg";
// import { Icon } from "@iconify/react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import SpinnerLoader from "../spinnerLoader";
// import IconStar from "../../../public/static/img/icons/ic-star.svg";

// interface AssessmentStartData {
//   title: string;
//   description_one: string;
//   description_two: string;
//   duration_minutes: number;
// }

// const StartAssessment = () => {
//   const navigate = useNavigate();
//   const [pageLoading, setPageLoading] = useState(true);
//   const [loading, setLoading] = useState(false); // For button state
//   const [data, setData] = useState<AssessmentStartData | null>(null);


//   // check this 
//   useEffect(() => {
//     const fetchStartData = async () => {
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_BASE_URL}assessment/start`,
//           {
//             withCredentials: true,
//           }
//         );
//         setData(res.data);
//       } catch (error) {
//         console.error("Error fetching assessment start data:", error);
//       } finally {
//         setTimeout(() => setPageLoading(false), 800);
//       }
//     };

//     fetchStartData();
//   }, []);

//   const handleClick = async () => {
//   setLoading(true);

//   // Get the access token (assuming it's stored in localStorage, adjust as needed)
//   const accessToken = localStorage.getItem("accessToken");

//   if (!accessToken) {
//     console.error("Access token is missing");
//     setLoading(false);
//     return;
//   }

//   const stakeholder = "leader";

//   try {
//     await axios.post(
//       `${import.meta.env.VITE_API_BASE_URL}assessment/start`,
//       { stakeholder },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`, 
//         },
//         withCredentials: true, 
//       }
//     );

//     navigate("/assessment-question");
//   } catch (error) {
//     console.error("Error starting assessment:", error);
//   } finally {
//     setLoading(false);
//   }
// };


//   if (pageLoading) {
//     return <SpinnerLoader />;
//   }

//   return (
//     <>
//       <div className="min-h-screen bg-[var(--light-primary-color)]">
//         <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 pb-5 px-3">
//           <div className="text-center mb-8 mx-auto">
//             <button type="button" className="!max-w-[150px] cursor">
//               <img src={Logo} className="w-[150px] mx-auto" alt="Logo" />
//             </button>
//           </div>

//           <div className="w-full mx-auto sm:max-w-3xl max-w-full rounded-xl shadow-md border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
//             <div>
//               {/* ✅ Dynamic Title from Backend */}
//               <h2 className="sm:text-2xl text-xl font-medium mb-1">
//                 {data?.title || "POD-360™ | From Friction to Flow"}
//               </h2>

//               {/* ✅ Dynamic Description from Backend */}
//               <p className="text-sm">
//                 {data?.description_one ||
//                   "Every organization experiences friction especially during times of rapid and constant change."}
//               </p>
//               <p className="text-sm mt-1">
//                 <strong>POD-360™</strong>{" "}
//                 {data?.description_two ||
//                   "is a confidential, organization-level assessment designed to identify how friction impacts performance."}
//               </p>

//               <div className="mt-5">
//                 <h6 className="capitalize mb-2 text-xl font-medium">
//                   Test Guidelines
//                 </h6>
//                 <ul className="space-y-2">
//                   <li className="feature-list sm:!text-base text-sm flex items-start gap-2">
//                     <img
//                       src={IconStar}
//                       alt="icon"
//                       className="mt-1 sm:w-4 w-3"
//                     />
//                     <span>
//                       Please respond honestly and instinctively—your first
//                       response often reflects your lived experience most
//                       accurately.
//                     </span>
//                   </li>

//                   <li className="feature-list sm:!text-base text-sm flex items-start gap-2">
//                     <img
//                       src={IconStar}
//                       alt="icon"
//                       className="mt-1 sm:w-4 w-3"
//                     />
//                     <span>
//                       The assessment takes approximately{" "}
//                       {data?.duration_minutes || 40} minutes.
//                     </span>
//                   </li>

//                   <li className="feature-list sm:!text-base text-sm flex items-start gap-2">
//                     <img
//                       src={IconStar}
//                       alt="icon"
//                       className="mt-1 sm:w-4 w-3"
//                     />
//                     <span>Progress is saved automatically.</span>
//                   </li>
//                 </ul>
//               </div>

//               <div className="grid place-items-center mt-10">
//                 <button
//                   type="button"
//                   disabled={loading}
//                   className={`group w-full text-[var(--white-color)] pl-4 py-2.5 pr-2 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] transition-all ${
//                     loading
//                       ? "opacity-40 cursor-not-allowed"
//                       : "hover:opacity-100 active:scale-95"
//                   }`}
//                   onClick={handleClick}
//                 >
//                   {loading ? "Initializing..." : "Begin Diagnostic"}
//                   {!loading && (
//                     <Icon
//                       icon="mynaui:arrow-right-circle-solid"
//                       width="25"
//                       height="25"
//                       className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
//                     />
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 text-center">
//             <p className="max-w-md md:px-1 mx-auto text-sm font-medium text-[var(--secondary-color)]">
//               By clicking BEGIN DIAGNOSTIC, you’re confirming that you’ve read
//               and agree to our{" "}
//               <a
//                 className="font-bold text-[var(--primary-color)] underline hover:opacity-75"
//                 href="/privacy"
//               >
//                 Privacy Policy
//               </a>{" "}
//               and{" "}
//               <a
//                 className="font-bold text-[var(--primary-color)] underline hover:opacity-75"
//                 href="/terms"
//               >
//                 Terms of Service
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default StartAssessment;


import { useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../../../public/static/img/home/logo.svg";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import axios from "axios";
import SpinnerLoader from "../spinnerLoader";
import IconStar from "../../../public/static/img/icons/ic-star.svg";

interface AssessmentStartData {
  title: string;
  description_one: string;
  description_two: string;
  duration_minutes: number;
}

type Stakeholder = "employee" | "admin" | "leader" | "manager";

const StartAssessment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 🔹 Invite token → employee
  const inviteToken = searchParams.get("token") || searchParams.get("token1");

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AssessmentStartData | null>(null);
  const [stakeholder, setStakeholder] = useState<Stakeholder | null>(null);

  // =====================================================
  // 🔐 DETERMINE STAKEHOLDER (EMPLOYEE OR /ME ROLE)
  // =====================================================
  useEffect(() => {
    const determineStakeholder = async () => {
      // 🔹 Employee via invite link
      if (inviteToken) {
        setStakeholder("employee");
        return;
      }

      // 🔹 Admin / Leader / Manager via /me
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setPageLoading(false);
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}auth/me`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );

        setStakeholder(res.data.role); // admin | leader | manager
      } catch (error) {
        console.error("Failed to determine user role", error);
      }
    };

    determineStakeholder();
  }, [inviteToken]);

  // =====================================================
  // 📥 FETCH START PAGE DATA (AFTER ROLE IS KNOWN)
  // =====================================================
  useEffect(() => {
    if (!stakeholder) return;

    console.log("Determined stakeholder:", stakeholder);
    const fetchStartData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}assessment/start`,
          {
            params: { stakeholder },
            withCredentials: true,
          }
        );
        setData(res.data);
      } catch (error) {
        console.error("Error fetching assessment start data:", error);
      } finally {
        setTimeout(() => setPageLoading(false), 500);
      }
    };

    fetchStartData();
  }, [stakeholder]);

  // =====================================================
  // ▶️ HANDLE START BUTTON
  // =====================================================
  const handleClick = async () => {
    if (!stakeholder) return;

    setLoading(true);

    try {
      // 🔹 EMPLOYEE FLOW
      if (stakeholder === "employee" && inviteToken) {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}employee-assessment/start/${inviteToken}`
        );

        navigate(
          `/assessment-question?assessmentId=${res.data.assessmentId}&token=${inviteToken}`
        );
        return;
      }

      // 🔹 ADMIN / LEADER / MANAGER FLOW
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("You are not authorized to start this assessment.");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}assessment/start`,
        { stakeholder },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      navigate(`/assessment-question?assessmentId=${res.data.assessmentId}`);
    } catch (error: any) {
      console.error("Error starting assessment:", error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ⏳ LOADERS
  // =====================================================
  if (pageLoading || !stakeholder) {
    return <SpinnerLoader />;
  }

  // =====================================================
  // 🖼 UI (UNCHANGED)
  // =====================================================
  return (
    <div className="min-h-screen bg-[var(--light-primary-color)]">
      <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 pb-5 px-3">
        <div className="text-center mb-8 mx-auto">
          <img src={Logo} className="w-[150px] mx-auto" alt="Logo" />
        </div>

        <div className="w-full mx-auto sm:max-w-3xl rounded-xl shadow-md border bg-white sm:py-10 py-6 sm:px-10 px-4">
          <h2 className="sm:text-2xl text-xl font-medium mb-1">
            {data?.title}
          </h2>

          <p className="text-sm">{data?.description_one}</p>
          <p className="text-sm mt-1">
            <strong>POD-360™</strong> {data?.description_two}
          </p>

          <div className="mt-5">
            <h6 className="mb-2 text-xl font-medium">Test Guidelines</h6>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <img src={IconStar} className="w-3 mt-1" />
                Respond honestly and instinctively.
              </li>
              <li className="flex gap-2">
                <img src={IconStar} className="w-3 mt-1" />
                Duration: {data?.duration_minutes} minutes.
              </li>
              <li className="flex gap-2">
                <img src={IconStar} className="w-3 mt-1" />
                Progress is saved automatically.
              </li>
            </ul>
          </div>

          <div className="grid place-items-center mt-10">
            <button
              disabled={loading}
              onClick={handleClick}
              className="group w-full text-white py-3 rounded-full font-semibold bg-gradient-to-r from-[#1a3652] to-[#448bd2]"
            >
              {loading ? "Initializing..." : "Begin Diagnostic"}
              {!loading && (
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="24"
                  className="inline ml-2 -rotate-45 group-hover:rotate-0 transition"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartAssessment;
