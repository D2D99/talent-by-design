// import { useEffect, useState } from "react";
// import Logo from "../../../public/static/img/home/logo.svg";
// import { Icon } from "@iconify/react";
// import { Modal, Ripple, initTWE } from "tw-elements";
// import SpinnerLoader from "../spinnerLoader";

// const AssessmentQuestion = () => {
//   // ✅ PAGE LOADER
//   const [pageLoading, setPageLoading] = useState(true);

//   // ✅ STATE FOR SELECTION (Fixed TS Error)
//   const [selectedValue, setSelectedValue] = useState<number | null>(null);

//   useEffect(() => {
//     initTWE({ Modal, Ripple });
//   }, []);

//   // ✅ PAGE LOADER EFFECT
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setPageLoading(false);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   // ✅ LOADER RENDERS FIRST
//   if (pageLoading) {
//     return <SpinnerLoader />;
//   }

//   const handleSelection = (val: number) => {
//     setSelectedValue(val);
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-[var(--light-primary-color)]">
//         <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
//           <div className="text-center mb-8 mx-auto">
//             <button type="button">
//               <img src={Logo} className="w-[150px] mx-auto" alt="Logo" />
//             </button>
//           </div>

//           <div className="w-full mx-auto sm:max-w-3xl max-w-full rounded-xl shadow-md shadow-[4px 4px 4px 0px #448CD21A;] border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
//             <h2 className="text-base font-bold text-[var(--secondary-color)] capitalize">
//               Question 1
//             </h2>
//             <div className="w-full bg-[var(--light-primary-color)] rounded-full h-2 mt-3">
//               <div className="w-4 bg-[var(--dark-primary-color)] h-2 rounded-full"></div>
//             </div>
//             <div className="sm:my-6 my-4">
//               <h2 className="sm:text-xl text-base font-bold text-[var(--secondary-color)]">
//                 I feel comfortable asking questions or sharing concerns in my
//                 work environment <span>*</span>
//               </h2>
//             </div>

//             <div className="grid grid-cols-5 max-w-96 mx-auto">
//               {[1, 2, 3, 4, 5].map((num) => (
//                 <div key={num} className="cursor-pointer">
//                   <label
//                     htmlFor={`option-${num}`}
//                     className={`sm:text-lg text-sm font-medium mx-auto sm:h-12 h-11 sm:w-12 w-11 border border-[#448CD233] hover:shadow-[4px_4px_4px_0px_#448CD21A] rounded-full flex items-center justify-center selected-answer cursor-pointer transition-colors ${
//                       selectedValue === num
//                         ? "bg-[var(--dark-primary-color)] text-white"
//                         : "text-[var(--secondary-color)]"
//                     }`}
//                   >
//                     {num}
//                     <input
//                       type="radio"
//                       name="answer"
//                       id={`option-${num}`}
//                       className="hidden"
//                       onChange={() => handleSelection(num)}
//                     />
//                   </label>

//                   {/* Labels for specific numbers as per your UI */}
//                   {num === 1 && (
//                     <div className="text-xs font-medium text[var(--black-color)] mt-3 sm:text-nowrap text-wrap text-center">
//                       Strongly Disagree
//                     </div>
//                   )}
//                   {num === 3 && (
//                     <div className="text-xs font-medium text[var(--black-color)] mt-3 sm:text-nowrap text-wrap text-center">
//                       Neutral
//                     </div>
//                   )}
//                   {num === 5 && (
//                     <div className="text-xs font-medium text[var(--black-color)] mt-3 sm:text-nowrap text-wrap text-center">
//                       Strongly Agree
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* ✅ SHOW IF 3 OR BELOW */}
//             <div
//               className={`sm:mt-12 mt-6 ${
//                 selectedValue !== null && selectedValue <= 3 ? "" : "hidden"
//               }`}
//             >
//               <label className="text-sm font-bold" htmlFor="insightPrompt">
//                 What situations make it harder for you to speak up, ask
//                 questions, or express concerns at work? <span>*</span>
//               </label>
//               <textarea
//                 id="insightPrompt"
//                 className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 border border-[#E8E8E8] rounded-lg resize-none mt-2 focus:border-[#E8E8E8] focus-within:border-[#E8E8E8]"
//                 placeholder=""
//                 rows={4}
//               ></textarea>
//             </div>

//             <div className="sm:mt-12 mt-6 flex justify-between">
//               <button
//                 type="button"
//                 className="group text-[var(--primary-color)] pl-4 py-2 pr-2 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase hover:opacity-100 duration-200 invisible"
//               >
//                 Previous
//                 <Icon
//                   icon="mynaui:arrow-right-circle-solid"
//                   width="25"
//                   height="25"
//                   className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
//                 />
//               </button>

//               {/* ✅ CONTINUE BUTTON ENABLES ON SELECTION */}
//               <button
//                 type="button"
//                 disabled={selectedValue === null}
//                 className={`group text-[var(--white-color)] pl-4 py-2 pr-2 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 ${
//                   selectedValue === null
//                     ? "opacity-40 cursor-not-allowed"
//                     : "opacity-100"
//                 }`}
//               >
//                 Continue
//                 <Icon
//                   icon="mynaui:arrow-right-circle-solid"
//                   width="25"
//                   height="25"
//                   className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
//                 />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>      
//     </>
//   );
// };

// export default AssessmentQuestion;


import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode
import Logo from "../../../public/static/img/home/logo.svg";
import { Icon } from "@iconify/react";
import { Modal, Ripple, initTWE } from "tw-elements";
import SpinnerLoader from "../spinnerLoader";

const AssessmentQuestion = () => {
  const navigate = useNavigate();
  const { token: routeToken } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || routeToken;

  const [pageLoading, setPageLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("employee"); 

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const savedIndex = localStorage.getItem(`idx_${token}`);
    return savedIndex ? parseInt(savedIndex) : 0;
  });

  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    const savedAnswers = localStorage.getItem(`ans_${token}`);
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    initTWE({ Modal, Ripple });
    if (token) {
      try {
        // Get the role (admin, leader, manager, etc.) from the token
        const decoded: any = jwtDecode(token);
        const role = decoded.role?.toLowerCase() || "employee";
        setUserRole(role);
        loadAssessmentFlow(role);
      } catch (err) {
        console.error("Token error", err);
        loadAssessmentFlow("employee");
      }
    } else {
      setPageLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (questions.length > 0) {
      const currentQId = questions[currentIndex]?._id;
      const existing = answers[currentQId];
      setSelectedValue(existing ? existing.answer : null);
      setComment(existing ? existing.comment : "");
      localStorage.setItem(`idx_${token}`, currentIndex.toString());
    }
  }, [currentIndex, questions]);

  const loadAssessmentFlow = async (role: string) => {
    try {
      // Dynamic start endpoint: e.g., leader-assessment/start/TOKEN
      const startRes = await axios.post(`${API_URL}employee-assessment/start/${token}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssessmentId(startRes.data?.assessmentId);

      // Dynamic stakeholder query: e.g., questions?stakeholder=leader
      const questionsRes = await axios.get(`${API_URL}questions?stakeholder=${role}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(questionsRes.data?.data || []);
    } catch (error) {
      console.error("Init Error:", error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleNext = async (passedValue?: number) => {
    const finalValue = passedValue ?? selectedValue;
    if (finalValue === null || !assessmentId) return;
    
    if (finalValue <= 3 && !comment.trim()) return;

    const currentQ = questions[currentIndex];
    const updatedAnswers = {
      ...answers,
      [currentQ._id]: {
        assessmentId,
        questionId: currentQ._id,
        questionCode: currentQ.questionCode || "Q-CODE",
        answer: finalValue,
        comment: finalValue <= 3 ? comment : ""
      }
    };
    
    setAnswers(updatedAnswers);
    localStorage.setItem(`ans_${token}`, JSON.stringify(updatedAnswers));

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (Object.keys(updatedAnswers).length < questions.length) {
        alert("Please answer all questions before finishing.");
        return;
      }
      submitFinal(updatedAnswers);
    }
  };

  const submitFinal = async (finalAnswers: any) => {
    setIsSubmitting(true);
    try {
      const responsePayload = {
        responses: Object.values(finalAnswers)
      };

      await axios.post(`${API_URL}responses`, responsePayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Dynamic submit endpoint: e.g., leader-assessment/ID/submit/TOKEN
      await axios.post(`${API_URL}${userRole}-assessment/${assessmentId}/submit/${token}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.removeItem(`ans_${token}`);
      localStorage.removeItem(`idx_${token}`);
      navigate("/success");
    } catch (error: any) {
      console.error("Submission Error Details:", error.response?.data);
      alert(error.response?.data?.message || "Submission failed. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pageLoading) return <SpinnerLoader />;

  const currentQuestion = questions[currentIndex];
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;
  const isButtonDisabled = selectedValue === null || isSubmitting || (selectedValue <= 3 && !comment.trim());

  return (
    <div className="min-h-screen bg-[var(--light-primary-color)]">
      <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
        <div className="text-center mb-8 mx-auto">
          <button type="button" onClick={() => navigate("/")}>
            <img src={Logo} className="w-[150px] mx-auto" alt="Logo" />
          </button>
        </div>

        <div className="w-full mx-auto sm:max-w-3xl max-w-full rounded-xl shadow-md border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
          <div className="flex justify-between items-center">
             <h2 className="text-base font-bold text-[var(--secondary-color)] uppercase tracking-wide">
               Question {currentIndex + 1} of {questions.length}
            </h2>
          </div>

          <div className="w-full bg-[var(--light-primary-color)] rounded-full h-2 mt-3">
            <div className="bg-[var(--dark-primary-color)] h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
          </div>

          <div className="sm:my-6 my-4">
            <h2 className="sm:text-xl text-base font-bold text-[var(--secondary-color)]">
              {currentQuestion?.questionStem} <span className="text-red-500">*</span>
            </h2>
          </div>

          <div className="grid grid-cols-5 max-w-96 mx-auto mb-8">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex flex-col items-center">
                <label className={`sm:text-lg text-sm font-medium sm:h-12 h-11 sm:w-12 w-11 border border-[#448CD233] rounded-full flex items-center justify-center cursor-pointer transition-all ${selectedValue === num ? "bg-[var(--dark-primary-color)] text-white scale-110 shadow-lg" : "text-[var(--secondary-color)] hover:bg-blue-50"}`}>
                  {num}
                  <input 
                    type="radio" 
                    name="answer" 
                    className="hidden" 
                    checked={selectedValue === num}
                    onChange={() => {
                      setSelectedValue(num);
                    }} 
                  />
                </label>
                {num === 1 && <span className="text-[10px] mt-2 text-center leading-tight">Strongly Disagree</span>}
                {num === 3 && <span className="text-[10px] mt-2 text-center leading-tight">Neutral</span>}
                {num === 5 && <span className="text-[10px] mt-2 text-center leading-tight">Strongly Agree</span>}
              </div>
            ))}
          </div>

          <div className={`transition-all duration-300 ${selectedValue !== null && selectedValue <= 3 ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden"}`}>
            <label className="text-sm font-bold block mb-2">{currentQuestion?.insightPrompt || "Why did you choose this score?"} <span className="text-red-500">*</span></label>
            <textarea 
               className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 border border-[#E8E8E8] rounded-lg resize-none" 
               rows={4} 
               value={comment} 
               onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <div className="sm:mt-12 mt-8 flex justify-between items-center">
            <button 
              type="button" 
              disabled={currentIndex === 0} 
              onClick={() => setCurrentIndex(prev => prev - 1)} 
              className={`group text-[var(--primary-color)] px-5 py-2 rounded-full border border-[var(--primary-color)] flex items-center gap-2 font-semibold text-sm uppercase transition-all ${currentIndex === 0 ? "invisible" : "visible"}`}
            >
              Previous
            </button>

            <button 
              type="button" 
              disabled={isButtonDisabled} 
              onClick={() => handleNext()} 
              className={`group text-white px-6 py-2.5 rounded-full flex items-center gap-2 font-semibold text-sm uppercase transition-all bg-gradient-to-r from-[#1a3652] to-[#448bd2] ${isButtonDisabled ? "opacity-40 cursor-not-allowed grayscale" : "hover:shadow-lg active:scale-95"}`}
            >
              {isSubmitting ? "Processing..." : currentIndex === questions.length - 1 ? "Finish Assessment" : "Continue"}
              {!isSubmitting && <Icon icon="mynaui:arrow-right-circle-solid" width="22" className="-rotate-45 group-hover:rotate-0 transition-transform" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentQuestion;