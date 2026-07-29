import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import api from "../../services/axios";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import Logo from "../../../public/static/img/POD-logo.svg";
import ResendMail from "../../../public/static/img/icons/resend-email-icon.svg";
import { Icon } from "@iconify/react";
import { Modal, Ripple, initTWE } from "tw-elements";
import SpinnerLoader from "../spinnerLoader";
import { toast } from "react-toastify";

interface ForcedChoiceOption {
  label: string;
  insightPrompt: string;
}

interface Question {
  _id: string;
  questionStem: string;
  questionCode?: string;
  questionType?: "Forced-Choice" | string;
  scale?: "SCALE_1_5" | "NEVER_ALWAYS" | "FORCED_CHOICE";
  insightPrompt?: string;
  forcedChoice?: {
    higherValueOption: "A" | "B";
    optionA: ForcedChoiceOption;
    optionB: ForcedChoiceOption;
  };
}

interface DecodedToken {
  role?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  department?: string;
}

interface AnswerResponse {
  assessmentId: string;
  questionId: string;
  questionCode: string;
  answer: number | "A" | "B" | null;
  comment: string;
}

const AssessmentQuestion = () => {
  const navigate = useNavigate();
  const { token: routeToken } = useParams();
  const [searchParams] = useSearchParams();

  const token =
    searchParams.get("token") ||
    routeToken ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token");
  const assessmentIdFromUrl = searchParams.get("assessmentId");

  const [pageLoading, setPageLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("employee");

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const savedIndex = localStorage.getItem(`idx_${token}`);
    return savedIndex ? parseInt(savedIndex) : 0;
  });

  const [answers, setAnswers] = useState<Record<string, AnswerResponse>>(() => {
    const savedAnswers = localStorage.getItem(`ans_${token}`);
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  const [selectedValue, setSelectedValue] = useState<number | "A" | "B" | null>(
    null,
  );
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFinalForm, setShowFinalForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [finalForm, setFinalForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    orgName: "",
  });

  const [confidentialityConsent, setConfidentialityConsent] = useState(false);
  const [prizeDrawConsent, setPrizeDrawConsent] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const currentQuestion = questions[currentIndex];
  const isForcedChoice = currentQuestion?.questionType === "Forced-Choice";
  // const higherValueOption = currentQuestion?.forcedChoice?.higherValueOption;

  const loadQuestions = useCallback(
    async (role: string) => {
      try {
        const res = await api.get(`questions?stakeholder=${role}`, {
          headers: { "x-invite-token": token },
        });
        setQuestions(res.data?.data || []);
      } catch (error) {
        console.error("Question load error:", error);
      } finally {
        setPageLoading(false);
      }
    },
    [API_URL, token],
  );

  useEffect(() => {
    if (assessmentIdFromUrl) setAssessmentId(assessmentIdFromUrl);

    // 🧹 Reset Detection: If the assessmentId from URL is different from what we stored locally for this token,
    // it means the assessment was reset by an admin. We must clear the local cache.
    if (assessmentIdFromUrl && token) {
      const lastId = localStorage.getItem(`cur_aid_${token}`);
      if (lastId && lastId !== assessmentIdFromUrl) {
        console.warn(
          ">>> [Assessment Reset Detected] Clearing local storage...",
        );
        localStorage.removeItem(`ans_${token}`);
        localStorage.removeItem(`idx_${token}`);
        setAnswers({});
        setCurrentIndex(0);
        setSelectedValue(null);
        setComment("");
      }
      localStorage.setItem(`cur_aid_${token}`, assessmentIdFromUrl);
    }
  }, [assessmentIdFromUrl, token]);

  const [allowedDepartments, setAllowedDepartments] = useState<string[]>([]);

  useEffect(() => {
    initTWE({ Modal, Ripple });
    if (!token) {
      setPageLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        // 1. Decode basic info from token
        const decoded: DecodedToken = jwtDecode(token);
        let role = decoded.role?.toLowerCase() || "employee";
        if (role === "superadmin") role = "admin";
        setUserRole(role);

        // 2. Fetch full invitation details (includes allowedDepartments from Organization)
        // This makes the department pre-filling and the dropdown dynamic
        const res = await api.get(`auth/invitation-details/${token}`);
        const details = res.data;

        setFinalForm((prev) => ({
          ...prev,
          firstName:
            details.firstName ||
            decoded.firstName ||
            decoded.name?.split(" ")[0] ||
            "",
          lastName:
            details.lastName ||
            decoded.lastName ||
            decoded.name?.split(" ")[1] ||
            "",
          email: details.email || decoded.email || "",
          department: details.department || decoded.department || "",
          orgName: details.orgName || (decoded as any).orgName || "",
        }));

        setAllowedDepartments(details.allowedDepartments || []);
        loadQuestions(role);
      } catch (err) {
        console.error("Error fetching invitation details:", err);
        // Fallback to basic token decoding if API fails
        try {
          const decoded: DecodedToken = jwtDecode(token);
          loadQuestions(decoded.role?.toLowerCase() || "employee");
        } catch (e) {
          loadQuestions("employee");
        }
      } finally {
      }
    };

    fetchDetails();
  }, [token, loadQuestions]);

  useEffect(() => {
    if (questions.length > 0 && !showFinalForm && !isSubmitted) {
      const currentQId = questions[currentIndex]?._id;
      const existing = answers[currentQId];
      setSelectedValue(
        existing ? (existing.answer as number | "A" | "B") : null,
      );
      setComment(existing ? existing.comment : "");
      localStorage.setItem(`idx_${token}`, currentIndex.toString());
    }
  }, [currentIndex, questions, showFinalForm, isSubmitted, token, answers]);

  const handleNext = async () => {
    if (selectedValue === null || !assessmentId) return;
    const currentQ = questions[currentIndex];

    const newResponse: AnswerResponse = {
      assessmentId: assessmentId,
      questionId: currentQ._id,
      questionCode: currentQ.questionCode || "CODE_MISSING",
      answer: selectedValue,
      comment: comment || "",
    };

    const updatedAnswers = { ...answers, [currentQ._id]: newResponse };
    setAnswers(updatedAnswers);
    localStorage.setItem(`ans_${token}`, JSON.stringify(updatedAnswers));

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedValue(null);
      setComment("");
    } else {
      setIsSubmitting(true);
      try {
        await api.post(
          "responses",
          { responses: Object.values(updatedAnswers) },
          { headers: { "x-invite-token": token } },
        );
        if (userRole === "employee") {
          setShowFinalForm(true);
        } else {
          await handleFinalSubmit(true);
        }
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response?.status === 401) return;

        const message = axiosError.response?.data?.message || "Check fields";
        toast.error(`Server error: ${message}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleFinalSubmit = async (isAutoSubmit = false) => {
    if (!token || !assessmentId) return;
    if (
      !isAutoSubmit &&
      (!finalForm.firstName ||
        !finalForm.lastName ||
        !finalForm.email ||
        !finalForm.department ||
        !confidentialityConsent)
    ) {
      toast.warn(
        "Please complete all details and acknowledge confidentiality.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionUrl =
        userRole === "employee"
          ? `employee-assessment/${assessmentId}/submit/${token}`
          : `assessment/${assessmentId}/submit`;

      const payload = {
        ...finalForm,
        confidentialityConsent,
        prizeDrawConsent,
      };

      const response = await api.post(submissionUrl, payload, {
        headers: {
          "x-invite-token": token,
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        localStorage.removeItem(`ans_${token}`);
        localStorage.removeItem(`idx_${token}`);

        setIsSubmitted(true);
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.status === 401) return;

      const message =
        axiosError.response?.data?.message || "Submission failed.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pageLoading) return <SpinnerLoader />;

  const progressPercentage =
    questions.length > 0
      ? ((currentIndex + (showFinalForm || userRole !== "employee" ? 1 : 0)) /
          questions.length) *
        100
      : 0;

  const isContinueDisabled =
    !showFinalForm &&
    (selectedValue === null ||
      (!isForcedChoice &&
        typeof selectedValue === "number" &&
        selectedValue <= 2 &&
        !comment.trim()) ||
      (isForcedChoice && selectedValue !== null && !comment.trim()));

  return (
    <div className="min-h-screen bg-[var(--light-primary-color)]">
      <div className="w-full mx-auto sm:pt-20 pt-10 pb-10 px-3">
        <div className="text-center mb-8 mx-auto">
          <button type="button">
            <img src={Logo} className="w-[150px] mx-auto" alt="Logo" />
          </button>
        </div>

        {questions.length === 0 && !pageLoading ? (
          <div className="text-center p-10 bg-white rounded-xl shadow-md">
            <h2 className="sm:text-2xl text-xl text-center font-bold text-[var(--secondary-color)]">
              No Questions Found
            </h2>
            <p className="text-gray-500 mt-2">
              There are no assessment questions available for your role (
              {userRole}).
            </p>
            <div className="mt-10 flex justify-center items-center">
              <button
                onClick={() => navigate("/")}
                className="group relative overflow-hidden z-0 text-[var(--white-color)] px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200"
              >
                Back To Home
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full mx-auto sm:max-w-3xl max-w-full rounded-xl shadow-md border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
            {isSubmitted ? (
              <div>
                <img
                  src={ResendMail}
                  className="mx-auto w-auto mb-6"
                  alt="email-icon"
                />
                <h2 className="sm:text-2xl text-xl text-center font-bold text-[var(--secondary-color)] mb-4">
                  Thank You{" "}
                  <span className="text-[var(--dark-primary-color)] capitalize">
                    {finalForm.firstName} {finalForm.lastName}.
                  </span>
                </h2>
                <p className="text-sm font-normal sm:mb-6 mb-3 text-center text-gray-600">
                  Your inputs have been securely recorded.
                </p>

                <div className="flex justify-center mt-8 gap-4">
                  {/* {userRole === "employee" && (
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard/reports/employee")}
                      className="group relative overflow-hidden z-0 text-[var(--white-color)] px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-green-600 to-emerald-500 duration-200"
                    >
                      <Icon icon="solar:document-bold" width="18" />
                      View Results
                    </button>
                  )} */}
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="group relative overflow-hidden z-0 text-[var(--white-color)] px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200"
                  >
                    Back To Home
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2
                    className={`text-base font-bold text-[var(--secondary-color)] capitalize tracking-wide ${showFinalForm ? "hidden" : "block"}`}
                  >
                    {showFinalForm
                      ? "Final Step"
                      : `Question ${currentIndex + 1} of ${questions.length}`}
                  </h2>
                </div>

                <div
                  className={`w-full bg-[var(--light-primary-color)] rounded-full h-2 mt-3 mb-6 ${showFinalForm ? "hidden" : "block"}`}
                >
                  <div
                    className="bg-[var(--dark-primary-color)] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                {!showFinalForm ? (
                  <>
                    <div className="sm:my-6 my-4">
                      <h2 className="sm:text-xl text-base font-bold text-[var(--secondary-color)]">
                        {currentQuestion?.questionStem}{" "}
                        <span className="text-black">*</span>
                      </h2>
                    </div>

                    {!isForcedChoice ? (
                      <div className="grid grid-cols-5 max-w-96 mx-auto my-8">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <div key={num} className="flex flex-col items-center">
                            <label
                              className={`sm:text-lg text-sm font-medium sm:h-12 h-11 sm:w-12 w-11 border border-[#448CD233] rounded-full flex items-center justify-center cursor-pointer transition-all ${
                                selectedValue === num
                                  ? "bg-gradient-to-b from-[#448CD2] to-[#1A3652] text-white border-0"
                                  : "text-[var(--secondary-color)] hover:bg-blue-50"
                              }`}
                            >
                              {num}
                              <input
                                type="radio"
                                className="hidden"
                                checked={selectedValue === num}
                                onChange={() => setSelectedValue(num)}
                              />
                            </label>
                            <span className="text-xs sm:text-nowrap mt-2 text-center leading-tight">
                              {currentQuestion?.scale === "NEVER_ALWAYS"
                                ? num === 1
                                  ? "Never"
                                  : num === 2
                                    ? "Rarely"
                                    : num === 3
                                      ? "Sometimes"
                                      : num === 4
                                        ? "Often"
                                        : num === 5
                                          ? "Always"
                                          : ""
                                : num === 1
                                  ? "Strongly Disagree"
                                  : num === 3
                                    ? "Neutral"
                                    : num === 5
                                      ? "Strongly Agree"
                                      : ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 mb-8">
                        {(["A", "B"] as const).map((opt) => (
                          <label
                            key={opt}
                            className={`flex items-center justify-between cursor-pointer border border-[#E8E8E8] p-3 rounded-lg flex-row-reverse transition-all gap-5 ${
                              selectedValue === opt
                                ? "border-[var(--primary-color)] bg-blue-50"
                                : ""
                            }`}
                          >
                            <input
                              className="w-4 h-4 accent-blue-500"
                              type="radio"
                              checked={selectedValue === opt}
                              onChange={() => setSelectedValue(opt)}
                            />
                            <h3 className="text-sm font-medium text-[#5D5D5D]">
                              {opt === "A"
                                ? currentQuestion?.forcedChoice?.optionA.label
                                : currentQuestion?.forcedChoice?.optionB.label}
                            </h3>
                          </label>
                        ))}
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      {((!isForcedChoice &&
                        typeof selectedValue === "number" &&
                        selectedValue <= 2) ||
                        (isForcedChoice && selectedValue !== null)) &&
                        (isForcedChoice ? (
                          <motion.div
                            key={`${currentIndex}-${selectedValue}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="w-full"
                          >
                            <label className="text-sm font-bold block mb-2">
                              {selectedValue === "A"
                                ? currentQuestion?.forcedChoice?.optionA
                                    .insightPrompt
                                : currentQuestion?.forcedChoice?.optionB
                                    .insightPrompt}
                              <span className="text-black"> *</span>
                            </label>
                            <textarea
                              className="font-medium text-sm text-[#5D5D5D] w-full p-3 border border-[#E8E8E8] rounded-lg resize-none"
                              rows={4}
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                          </motion.div>
                        ) : (
                          <div className="w-full transition-all duration-300 opacity-100 h-auto">
                            <label className="text-sm font-bold block mb-2">
                              {currentQuestion?.insightPrompt ||
                                "Why did you choose this score?"}
                              <span className="text-black"> *</span>
                            </label>
                            <textarea
                              className="font-medium text-sm text-[#5D5D5D] w-full p-3 border border-[#E8E8E8] rounded-lg resize-none"
                              rows={4}
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                          </div>
                        ))}
                    </AnimatePresence>
                  </>
                ) : (
                  <>
                    <div className="sm:mb-6 mb-4">
                      <h2 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)]">
                        Finalizing Your Confidential Submission
                      </h2>
                      <p className="text-neutral-500 mt-1 text-sm">
                        Please provide these details to securely validate your
                        input and ensure direct email delivery of your summary
                        report once it is finalized.
                      </p>
                      <div className="mt-4 sm:mb-4 mb-2">
                        <label className="font-bold text-sm">
                          First Name *
                        </label>
                        <input
                          value={finalForm.firstName}
                          onChange={(e) =>
                            setFinalForm({
                              ...finalForm,
                              firstName: e.target.value,
                            })
                          }
                          className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)]"
                          placeholder="Your first name"
                        />
                      </div>
                      <div className="sm:mb-4 mb-2">
                        <label className="font-bold text-sm">Last Name *</label>
                        <input
                          value={finalForm.lastName}
                          onChange={(e) =>
                            setFinalForm({
                              ...finalForm,
                              lastName: e.target.value,
                            })
                          }
                          className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)]"
                          placeholder="Your last name"
                        />
                      </div>
                      <div className="sm:mb-4 mb-2">
                        <label className="font-bold text-sm">Email</label>
                        <input
                          type="email"
                          value={finalForm.email}
                          readOnly={!!finalForm.email}
                          className={`font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] pointer-events-none ${finalForm.email ? "bg-gray-50 text-gray-500" : ""}`}
                          placeholder="Your email"
                        />
                      </div>
                      <div className="sm:mb-6 mb-5">
                        <label className="font-bold text-sm">
                          Department *
                        </label>

                        <div className="relative w-full">
                          <div className="absolute inset-y-0 right-0 top-2 hidden items-center pr-3 pointer-events-none">
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

                          {(() => {
                            const isLocked =
                              !!finalForm.department &&
                              !!token &&
                              !!(jwtDecode(token as string) as any).department;

                            // Use organization's defined departments if available, else fallback to defaults
                            const options =
                              allowedDepartments.length > 0
                                ? allowedDepartments
                                : [
                                    "HR/People & Culture",
                                    "Finance & Accounting",
                                    "Operations",
                                    "IT",
                                    "Sales and Marketing",
                                    "Legal, Risk & Compliance",
                                    "Admin & Corporate Services",
                                  ];

                            return (
                              <select
                                value={finalForm.department}
                                disabled={isLocked}
                                onChange={(e) =>
                                  setFinalForm({
                                    ...finalForm,
                                    department: e.target.value,
                                  })
                                }
                                className={`font-medium text-sm text-[#5D5D5D] opacity-100 w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)] appearance-none capitalize ${isLocked ? "bg-gray-50 cursor-not-allowed" : ""}`}
                              >
                                <option value="">Select your department</option>
                                {options.map((dept) => (
                                  <option key={dept} value={dept}>
                                    {dept}
                                  </option>
                                ))}
                              </select>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Participant Consent Box  */}
                    <div
                      className={`border rounded-xl sm:mb-6 mb-4 mt-8 overflow-hidden transition-all duration-300 ${consentOpen ? "border-[rgba(68,140,210,0.4)] bg-[#F8FAFC]" : "border-[rgba(68,140,210,0.25)] bg-[#F8FAFC]"}`}
                    >
                      {/* Clickable Header */}
                      <button
                        type="button"
                        onClick={() => setConsentOpen(!consentOpen)}
                        className="w-full flex items-center justify-between gap-3 p-5 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100/50 p-3 rounded-full text-[var(--secondary-color)] flex-shrink-0">
                            <Icon icon="hugeicons:security-lock" width="24" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[var(--secondary-color)] leading-tight">
                              Participant Consent
                            </h3>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              Please review and confirm your consent below
                              before submitting.
                            </p>
                          </div>
                        </div>
                        <Icon
                          icon="lucide:chevron-down"
                          width="18"
                          className={`text-neutral-400 flex-shrink-0 transition-transform duration-300 ${consentOpen ? "rotate-180" : "rotate-0"}`}
                        />
                      </button>

                      {/* Collapsible Body */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${consentOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                      >
                        <div className="px-5 pb-5 flex flex-col gap-3 border-t border-[#E8E8E8] pt-4">
                          {/* Item 1: Confidentiality */}
                          <div className="flex items-start gap-4 pb-3 border-b border-[#F0F0F0]">
                            <div className="pt-0.5 flex-shrink-0">
                              <div
                                role="switch"
                                aria-checked={confidentialityConsent}
                                onClick={() =>
                                  setConfidentialityConsent(
                                    !confidentialityConsent,
                                  )
                                }
                                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${confidentialityConsent ? "bg-[var(--primary-color)]" : "bg-gray-300"}`}
                              >
                                <span
                                  aria-hidden="true"
                                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${confidentialityConsent ? "translate-x-4" : "translate-x-0"}`}
                                />
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-[var(--secondary-color)]">
                                Confidentiality Acknowledgement
                              </h4>
                              <p className="text-xs text-neutral-500 leading-relaxed mt-1">
                                I understand that my individual survey responses
                                will be kept confidential and reported only in
                                aggregate, unless otherwise required by law or
                                unless I have explicitly consented otherwise.
                              </p>
                            </div>
                          </div>

                          {/* Item 2: Prize Draw */}
                          <div className="flex items-start gap-4">
                            <div className="pt-0.5 flex-shrink-0">
                              <div
                                role="switch"
                                aria-checked={prizeDrawConsent}
                                onClick={() =>
                                  setPrizeDrawConsent(!prizeDrawConsent)
                                }
                                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${prizeDrawConsent ? "bg-[var(--primary-color)]" : "bg-gray-300"}`}
                              >
                                <span
                                  aria-hidden="true"
                                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${prizeDrawConsent ? "translate-x-4" : "translate-x-0"}`}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-bold text-[var(--secondary-color)]">
                                  Prize Draw & Giveaway Consent
                                </h4>
                                <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                  OPTIONAL
                                </span>
                              </div>
                              <p className="text-xs text-neutral-500 leading-relaxed">
                                I would like to be entered into any eligible POD
                                prize draws or giveaways. I understand that my
                                name may be used only for the purpose of
                                administering the draw and contacting me if I am
                                selected as a winner. My survey responses will
                                remain confidential and will not be linked to my
                                identity for reporting purposes.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Info Row */}
                    <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-7 gap-5 sm:mb-8 mb-6 mt-8">
                      <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                        <div className="w-12 h-12 rounded-full bg-[#F0F6FC] flex items-center justify-center flex-shrink-0">
                          <Icon
                            icon="lucide:lock"
                            width="20"
                            className="text-[var(--secondary-color)]"
                          />
                        </div>
                        <span className="leading-snug font-medium text-xs text-[#4B5A69]">
                          Your responses
                          <br />
                          remain confidential
                        </span>
                      </div>

                      <div className="hidden sm:block h-8 w-[1px] bg-[#E2E8F0]"></div>

                      <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                        <div className="w-12 h-12 rounded-full bg-[#F0F6FC] flex items-center justify-center flex-shrink-0">
                          <Icon
                            icon="lucide:bar-chart"
                            width="22"
                            className="text-[var(--secondary-color)]"
                          />
                        </div>
                        <span className="leading-snug font-medium text-xs text-[#4B5A69]">
                          Reports are generated
                          <br />
                          only in aggregate
                        </span>
                      </div>

                      <div className="hidden sm:block h-8 w-[1px] bg-[#E2E8F0]"></div>

                      <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                        <div className="w-12 h-12 rounded-full bg-[#F0F6FC] flex items-center justify-center flex-shrink-0">
                          <Icon
                            icon="lucide:mail"
                            width="20"
                            className="text-[var(--secondary-color)]"
                          />
                        </div>
                        <span className="leading-snug font-medium text-xs text-[#4B5A69]">
                          Your email is used
                          <br />
                          only to deliver your report
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <div className="sm:mt-12 mt-8 flex flex-wrap gap-5 sm:justify-between sm:items-center">
                  <button
                    type="button"
                    disabled={
                      (currentIndex === 0 && !showFinalForm) || isSubmitting
                    }
                    onClick={() =>
                      showFinalForm
                        ? setShowFinalForm(false)
                        : setCurrentIndex((p) => p - 1)
                    }
                    className={`group text-[var(--primary-color)] rounded-full ps-2.5 pe-3.5 h-10 flex items-center gap-1.5 font-semibold  text-base uppercase 
               bg-gradient-to-r bg-[var(--white-color)] border-solid border-[var(--primary-color)] sm:w-fit w-full sm:justify-start justify-center border ${currentIndex === 0 && !showFinalForm ? "invisible" : "visible"}`}
                  >
                    <Icon icon="mynaui:arrow-left-circle-solid" width="22" />
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={
                      isSubmitting ||
                      (showFinalForm
                        ? !confidentialityConsent ||
                          !finalForm.firstName ||
                          !finalForm.lastName ||
                          !finalForm.department
                        : isContinueDisabled)
                    }
                    onClick={
                      showFinalForm
                        ? () => handleFinalSubmit()
                        : () => handleNext()
                    }
                    className="bg-gradient-to-r from-[#1a3652] to-[#448bd2] text-white pe-2.5 ps-3.5 h-10 rounded-full flex items-center gap-1.5 font-semibold uppercase disabled:opacity-40  sm:w-fit w-full sm:justify-start justify-center"
                  >
                    {isSubmitting
                      ? "Processing..."
                      : showFinalForm
                        ? "Finish Assessment"
                        : currentIndex === questions.length - 1 &&
                            userRole !== "employee"
                          ? "Finish Assessment"
                          : "Continue"}
                    {!isSubmitting && (
                      <Icon icon="mynaui:arrow-right-circle-solid" width="22" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentQuestion;
