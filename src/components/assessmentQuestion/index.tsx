import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Logo from "../../../public/static/img/home/logo.svg";
import ResendMail from "../../../public/static/img/icons/resend-email-icon.svg"; // Ensure this path is correct
import { Icon } from "@iconify/react";
import { Modal, Ripple, initTWE } from "tw-elements";
import SpinnerLoader from "../spinnerLoader";

const AssessmentQuestion = () => {
  const navigate = useNavigate();
  const { token: routeToken } = useParams();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || routeToken;
  const assessmentIdFromUrl = searchParams.get("assessmentId");

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

  const [selectedValue, setSelectedValue] = useState<number | "A" | "B" | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFinalForm, setShowFinalForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state for success UI

  const [finalForm, setFinalForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: ""
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const currentQuestion = questions[currentIndex];
  const isForcedChoice = currentQuestion?.questionType === "Forced-Choice";
  const higherValueOption = currentQuestion?.forcedChoice?.higherValueOption;

  useEffect(() => {
    if (assessmentIdFromUrl) setAssessmentId(assessmentIdFromUrl);
  }, [assessmentIdFromUrl]);

  useEffect(() => {
    initTWE({ Modal, Ripple });
    if (!token) {
      setPageLoading(false);
      return;
    }
    try {
      const decoded: any = jwtDecode(token);
      const role = decoded.role?.toLowerCase() || "employee";
      setUserRole(role);

      setFinalForm((prev) => ({
        ...prev,
        firstName: decoded.firstName || decoded.name?.split(" ")[0] || "",
        lastName: decoded.lastName || decoded.name?.split(" ")[1] || "",
        email: decoded.email || "",
        department: decoded.department || ""
      }));

      loadQuestions(role);
    } catch (err) {
      console.error("Error decoding token:", err);
      loadQuestions("employee");
    }
  }, [token]);

  const loadQuestions = async (role: string) => {
    try {
      const res = await axios.get(`${API_URL}questions?stakeholder=${role}`, {
        headers: { "x-invite-token": token }
      });
      setQuestions(res.data?.data || []);
    } catch (error) {
      console.error("Question load error:", error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (questions.length > 0 && !showFinalForm && !isSubmitted) {
      const currentQId = questions[currentIndex]?._id;
      const existing = answers[currentQId];
      setSelectedValue(existing ? existing.answer : null);
      setComment(existing ? existing.comment : "");
      localStorage.setItem(`idx_${token}`, currentIndex.toString());
    }
  }, [currentIndex, questions, showFinalForm, isSubmitted]);

  const handleNext = async () => {
    if (selectedValue === null || !assessmentId) return;
    const currentQ = questions[currentIndex];

    const newResponse = {
      assessmentId: assessmentId,
      questionId: currentQ._id,
      questionCode: currentQ.questionCode || "CODE_MISSING",
      answer: selectedValue,
      comment: comment || ""
    };

    const updatedAnswers = { ...answers, [currentQ._id]: newResponse };
    setAnswers(updatedAnswers);
    localStorage.setItem(`ans_${token}`, JSON.stringify(updatedAnswers));

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedValue(null);
      setComment("");
    } else {
      setIsSubmitting(true);
      try {
        await axios.post(
          `${API_URL}responses`,
          { responses: Object.values(updatedAnswers) },
          { headers: { "x-invite-token": token } }
        );
        setShowFinalForm(true);
      } catch (error: any) {
        alert(`Server error: ${error.response?.data?.message || "Check fields"}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleFinalSubmit = async () => {
    if (!token || !assessmentId) return;
    if (!finalForm.firstName || !finalForm.lastName || !finalForm.email || !finalForm.department) {
      alert("Please fill all details");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${API_URL}${userRole}-assessment/${assessmentId}/submit/${token}`,
        finalForm,
        { headers: { "x-invite-token": token, "Authorization": `Bearer ${token}` } }
      );

      if (response.status === 200) {
        localStorage.removeItem(`ans_${token}`);
        localStorage.removeItem(`idx_${token}`);
        setIsSubmitted(true); // Switch to Thank You UI
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pageLoading) return <SpinnerLoader />;

  const progressPercentage = questions.length > 0
    ? ((currentIndex + (showFinalForm ? 1 : 0)) / questions.length) * 100
    : 0;

  const isContinueDisabled = !showFinalForm && (
    selectedValue === null ||
    (!isForcedChoice && typeof selectedValue === "number" && selectedValue <= 3 && !comment.trim()) ||
    (isForcedChoice && selectedValue === higherValueOption && !comment.trim())
  );

  return (
    <div className="min-h-screen bg-[var(--light-primary-color)]">
      <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
        <div className="text-center mb-8 mx-auto">
          <button type="button" onClick={() => navigate("/")}>
            <img src={Logo} className="w-[150px] mx-auto" alt="Logo" />
          </button>
        </div>

        <div className="w-full mx-auto sm:max-w-3xl max-w-full rounded-xl shadow-md border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
          {isSubmitted ? (
            // SUCCESS UI SECTION
            <div className="py-10">
              <img src={ResendMail} className="mx-auto w-32 mb-6" alt="email-icon" />
              <h2 className="sm:text-2xl text-xl text-center font-bold text-[var(--secondary-color)] mb-4">
                Thank You{" "}
                <span className="text-[var(--dark-primary-color)]">
                  {finalForm.firstName} {finalForm.lastName}.
                </span>
              </h2>
              <p className="text-sm font-normal sm:mb-6 mb-3 text-center leading-relaxed text-gray-600">
                Your inputs have been securely recorded and are now being
                consolidated and analyzed. Once the results are finalized, you
                will receive an email invitation to schedule a 45-minute debrief
                with one of our coaches, along with access to your dashboard,
                sent to the email address you provided.
              </p>
              <div className="flex justify-center mt-8">
                <button 
                  onClick={() => navigate("/")}
                  className="text-white px-8 py-2.5 rounded-full font-semibold text-sm uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2]"
                >
                  Return Home
                </button>
              </div>
            </div>
          ) : (
            // MAIN ASSESSMENT UI
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-base font-bold text-[var(--secondary-color)] uppercase tracking-wide">
                  {showFinalForm ? "Final Step" : `Question ${currentIndex + 1} of ${questions.length}`}
                </h2>
              </div>

              <div className="w-full bg-[var(--light-primary-color)] rounded-full h-2 mt-3">
                <div className="bg-[var(--dark-primary-color)] h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
              </div>

              {!showFinalForm ? (
                <>
                  <div className="sm:my-6 my-4">
                    <h2 className="sm:text-xl text-base font-bold text-[var(--secondary-color)]">
                      {currentQuestion?.questionStem} <span className="text-red-500">*</span>
                    </h2>
                  </div>

                  {!isForcedChoice ? (
                    <div className="grid grid-cols-5 max-w-96 mx-auto mb-8">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="flex flex-col items-center">
                          <label className={`sm:text-lg text-sm font-medium sm:h-12 h-11 sm:w-12 w-11 border border-[#448CD233] rounded-full flex items-center justify-center cursor-pointer transition-all ${selectedValue === num ? "bg-[var(--dark-primary-color)] text-white scale-110 shadow-lg" : "text-[var(--secondary-color)] hover:bg-blue-50"}`}>
                            {num}
                            <input type="radio" className="hidden" checked={selectedValue === num} onChange={() => setSelectedValue(num)} />
                          </label>
                          <span className="text-[10px] mt-2 text-center leading-tight">
                            {num === 1 ? "Strongly Disagree" : num === 3 ? "Neutral" : num === 5 ? "Strongly Agree" : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 mb-8">
                      {(["A", "B"] as const).map((opt) => (
                        <label key={opt} className={`flex items-center justify-between cursor-pointer border border-[#E8E8E8] p-3 rounded-lg gap-1 flex-row-reverse transition-all ${selectedValue === opt ? "border-[var(--dark-primary-color)] bg-blue-50" : ""}`}>
                          <input className="w-4 h-4" type="radio" checked={selectedValue === opt} onChange={() => setSelectedValue(opt)} />
                          <h3 className="text-sm font-medium text-[#5D5D5D]">{currentQuestion?.forcedChoice?.[`option${opt}`]?.label}</h3>
                        </label>
                      ))}
                    </div>
                  )}

                  <div className={`transition-all duration-300 ${((!isForcedChoice && typeof selectedValue === "number" && selectedValue <= 3) || (isForcedChoice && selectedValue === higherValueOption)) ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden"}`}>
                    <label className="text-sm font-bold block mb-2">
                      {isForcedChoice ? currentQuestion?.forcedChoice?.[`option${selectedValue}`]?.insightPrompt : currentQuestion?.insightPrompt || "Why did you choose this score?"}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea className="font-medium text-sm text-[#5D5D5D] outline-0 focus:border-[var(--primary-color)] w-full p-3 border border-[#E8E8E8] rounded-lg resize-none" rows={4} value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                  </div>
                </>
              ) : (
                <div className="sm:my-6 my-4">
                  <h2 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)]">Finalizing Your Confidential Submission</h2>
                  <p className="sm:mb-6 mb-3 mt-1 text-sm font-medium text-[var(--secondary-color)]">Please provide these details to securely validate your input...</p>
                  
                  <div className="sm:mb-4 mb-2">
                    <label className="font-bold text-[var(--secondary-color)] text-sm">First Name</label>
                    <input name="firstName" value={finalForm.firstName} onChange={(e) => setFinalForm({ ...finalForm, firstName: e.target.value })} className="w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg" placeholder="Enter your first name" />
                  </div>
                  <div className="sm:mb-4 mb-2">
                    <label className="font-bold text-[var(--secondary-color)] text-sm">Last Name</label>
                    <input name="lastName" value={finalForm.lastName} onChange={(e) => setFinalForm({ ...finalForm, lastName: e.target.value })} className="w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg" placeholder="Enter your last name" />
                  </div>
                  <div className="sm:mb-4 mb-2">
                    <label className="font-bold text-[var(--secondary-color)] text-sm">Email</label>
                    <input name="email" type="email" value={finalForm.email} readOnly={!!finalForm.email} className={`w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg ${finalForm.email ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`} placeholder="Enter your email" />
                  </div>
                  <div className="sm:mb-6 mb-5">
                    <label className="font-bold text-[var(--secondary-color)] text-sm">Department</label>
                    <select name="department" value={finalForm.department} onChange={(e) => setFinalForm({ ...finalForm, department: e.target.value })} className="w-full p-3 mt-2 border border-[#E8E8E8] rounded-lg">
                      <option value="">Select your department</option>
                      <option value="hr">HR</option>
                      <option value="engineering">Engineering</option>
                      <option value="marketing">Marketing</option>
                      <option value="operations">Operations</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="sm:mt-12 mt-8 flex justify-between items-center">
                <button
                  type="button"
                  disabled={(currentIndex === 0 && !showFinalForm) || isSubmitting}
                  onClick={() => showFinalForm ? setShowFinalForm(false) : setCurrentIndex(prev => prev - 1)}
                  className={`group text-[var(--primary-color)] px-5 py-2 rounded-full border border-[var(--primary-color)] flex items-center gap-2 font-semibold text-sm uppercase transition-all ${currentIndex === 0 && !showFinalForm ? "invisible" : "visible"}`}
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={isContinueDisabled || isSubmitting}
                  onClick={showFinalForm ? handleFinalSubmit : handleNext}
                  className={`group text-white px-6 py-2.5 rounded-full flex items-center gap-2 font-semibold text-sm uppercase transition-all bg-gradient-to-r from-[#1a3652] to-[#448bd2] ${(isContinueDisabled || isSubmitting) ? "opacity-40 cursor-not-allowed grayscale" : "hover:shadow-lg active:scale-95"}`}
                >
                  {isSubmitting ? "Processing..." : showFinalForm ? "Finish Assessment" : "Continue"}
                  {!isSubmitting && <Icon icon="mynaui:arrow-right-circle-solid" width="22" className="-rotate-45 group-hover:rotate-0 transition-transform" />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentQuestion;