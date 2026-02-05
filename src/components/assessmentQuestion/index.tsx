import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Logo from "../../../public/static/img/home/logo.svg";
import ResendMail from "../../../public/static/img/icons/resend-email-icon.svg";
import { Icon } from "@iconify/react";
import { Modal, Ripple, initTWE } from "tw-elements";
import SpinnerLoader from "../spinnerLoader";

interface ForcedChoiceOption {
  label: string;
  insightPrompt: string;
}

interface Question {
  _id: string;
  questionStem: string;
  questionCode?: string;
  questionType?: "Forced-Choice" | string;
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

  const token = searchParams.get("token") || routeToken;
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
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const currentQuestion = questions[currentIndex];
  const isForcedChoice = currentQuestion?.questionType === "Forced-Choice";
  const higherValueOption = currentQuestion?.forcedChoice?.higherValueOption;

  const loadQuestions = useCallback(
    async (role: string) => {
      try {
        const res = await axios.get(`${API_URL}questions?stakeholder=${role}`, {
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
  }, [assessmentIdFromUrl]);

  useEffect(() => {
    initTWE({ Modal, Ripple });
    if (!token) {
      setPageLoading(false);
      return;
    }
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const role = decoded.role?.toLowerCase() || "employee";
      setUserRole(role);

      setFinalForm((prev) => ({
        ...prev,
        firstName: decoded.firstName || decoded.name?.split(" ")[0] || "",
        lastName: decoded.lastName || decoded.name?.split(" ")[1] || "",
        email: decoded.email || "",
        department: decoded.department || "",
      }));

      loadQuestions(role);
    } catch (err) {
      console.error("Error decoding token:", err);
      loadQuestions("employee");
    }
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
        await axios.post(
          `${API_URL}responses`,
          { responses: Object.values(updatedAnswers) },
          { headers: { "x-invite-token": token } },
        );
        setShowFinalForm(true);
      } catch (error) {
        let message = "Check fields";
        if (axios.isAxiosError(error) && error.response) {
          message = error.response.data.message;
        }
        alert(`Server error: ${message}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleFinalSubmit = async () => {
    if (!token || !assessmentId) return;
    if (
      !finalForm.firstName ||
      !finalForm.lastName ||
      !finalForm.email ||
      !finalForm.department
    ) {
      alert("Please fill all details");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${API_URL}${userRole}-assessment/${assessmentId}/submit/${token}`,
        finalForm,
        {
          headers: {
            "x-invite-token": token,
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        localStorage.removeItem(`ans_${token}`);
        localStorage.removeItem(`idx_${token}`);
        setIsSubmitted(true);
      }
    } catch (error) {
      let message = "Submission failed.";
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data.message;
      }
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pageLoading) return <SpinnerLoader />;

  const progressPercentage =
    questions.length > 0
      ? ((currentIndex + (showFinalForm ? 1 : 0)) / questions.length) * 100
      : 0;

  const isContinueDisabled =
    !showFinalForm &&
    (selectedValue === null ||
      (!isForcedChoice &&
        typeof selectedValue === "number" &&
        selectedValue <= 3 &&
        !comment.trim()) ||
      (isForcedChoice &&
        selectedValue === higherValueOption &&
        !comment.trim()));

  return (
    <div className="min-h-screen bg-[var(--light-primary-color)]">
      <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 px-3">
        <div className="text-center mb-8 mx-auto">
          <button type="button">
            <img src={Logo} className="w-[150px] mx-auto" alt="Logo" />
          </button>
        </div>

        <div className="w-full mx-auto sm:max-w-3xl max-w-full rounded-xl shadow-md border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
          {isSubmitted ? (
            <div className="py-10">
              <img
                src={ResendMail}
                className="mx-auto w-auto mb-6"
                alt="email-icon"
              />
              <h2 className="sm:text-2xl text-xl text-center font-bold text-[var(--secondary-color)] mb-4">
                Thank You{" "}
                <span className="text-[var(--dark-primary-color)]">
                  {finalForm.firstName} {finalForm.lastName}.
                </span>
              </h2>
              <p className="text-sm font-normal sm:mb-6 mb-3 text-center text-gray-600">
                Your inputs have been securely recorded...
              </p>
              <div className="flex justify-center mt-8">
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
                <h2 className="text-base font-bold text-[var(--secondary-color)] capitalize tracking-wide">
                  {showFinalForm
                    ? "Final Step"
                    : `Question ${currentIndex + 1} of ${questions.length}`}
                </h2>
              </div>

              <div className="w-full bg-[var(--light-primary-color)] rounded-full h-2 mt-3">
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
                    <div className="grid grid-cols-5 max-w-96 mx-auto mb-8">
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
                          <span className="text-[10px] mt-2 text-center leading-tight">
                            {num === 1
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
                          className={`flex items-center justify-between cursor-pointer border border-[#E8E8E8] p-3 rounded-lg flex-row-reverse transition-all ${
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

                  <div
                    className={`transition-all duration-300 ${
                      (!isForcedChoice &&
                        typeof selectedValue === "number" &&
                        selectedValue <= 3) ||
                      (isForcedChoice && selectedValue === higherValueOption)
                        ? "opacity-100 h-auto"
                        : "opacity-0 h-0 overflow-hidden"
                    }`}
                  >
                    <label className="text-sm font-bold block mb-2">
                      {isForcedChoice
                        ? selectedValue === "A"
                          ? currentQuestion?.forcedChoice?.optionA.insightPrompt
                          : currentQuestion?.forcedChoice?.optionB.insightPrompt
                        : currentQuestion?.insightPrompt ||
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
                </>
              ) : (
                <div className="sm:my-6 my-4">
                  <h2 className="sm:text-2xl text-xl font-bold text-[var(--secondary-color)]">
                    Finalizing Your Confidential Submission
                  </h2>
                  <div className="sm:mb-4 mb-2">
                    <label className="font-bold text-sm">First Name</label>
                    <input
                      value={finalForm.firstName}
                      onChange={(e) =>
                        setFinalForm({
                          ...finalForm,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full p-3 mt-2 border rounded-lg"
                    />
                  </div>
                  <div className="sm:mb-4 mb-2">
                    <label className="font-bold text-sm">Last Name</label>
                    <input
                      value={finalForm.lastName}
                      onChange={(e) =>
                        setFinalForm({ ...finalForm, lastName: e.target.value })
                      }
                      className="w-full p-3 mt-2 border rounded-lg"
                    />
                  </div>
                  <div className="sm:mb-4 mb-2">
                    <label className="font-bold text-sm">Email</label>
                    <input
                      type="email"
                      value={finalForm.email}
                      readOnly={!!finalForm.email}
                      className={`w-full p-3 mt-2 border rounded-lg ${finalForm.email ? "bg-gray-50 text-gray-500" : ""}`}
                    />
                  </div>
                  <div className="sm:mb-6 mb-5">
                    <label className="font-bold text-sm">Department</label>
                    <select
                      value={finalForm.department}
                      onChange={(e) =>
                        setFinalForm({
                          ...finalForm,
                          department: e.target.value,
                        })
                      }
                      className="w-full p-3 mt-2 border rounded-lg appearance-none"
                    >
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
                  disabled={
                    (currentIndex === 0 && !showFinalForm) || isSubmitting
                  }
                  onClick={() =>
                    showFinalForm
                      ? setShowFinalForm(false)
                      : setCurrentIndex((p) => p - 1)
                  }
                  className={`flex items-center gap-1.5 font-semibold uppercase ${currentIndex === 0 && !showFinalForm ? "invisible" : "visible"}`}
                >
                  <Icon icon="mynaui:arrow-left-circle-solid" width="22" />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={isContinueDisabled || isSubmitting}
                  onClick={showFinalForm ? handleFinalSubmit : handleNext}
                  className="bg-gradient-to-r from-[#1a3652] to-[#448bd2] text-white px-6 h-10 rounded-full flex items-center gap-1.5 font-semibold uppercase disabled:opacity-40"
                >
                  {isSubmitting
                    ? "Processing..."
                    : showFinalForm
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
      </div>
    </div>
  );
};

export default AssessmentQuestion;
