import React, { useState, useEffect, useRef } from "react";
import api from "../../services/axios";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { Modal, initTWE } from "tw-elements";

interface FeedbackEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  subdomain: string;
  userId: string | null;
  userEmail: string | null;
  rawFeedback: {
    insight: string;
    coachingTips: string;
    recommendedPrograms: string;
    modelDescription?: string;
    pod360Title?: string;
    pod360Description?: string;
    objectives?: string;
    progressScore?: number;
  };
  onSuccess: () => void;
  showFullFeedback?: boolean;
}

const FeedbackEditorModal: React.FC<FeedbackEditorModalProps> = ({
  isOpen,
  onClose,
  domain,
  subdomain,
  userId,
  userEmail,
  rawFeedback,
  onSuccess,
  showFullFeedback = true,
}) => {
  const [insight, setInsight] = useState("");
  const [coachingTips, setCoachingTips] = useState("");
  const [recommendedPrograms, setRecommendedPrograms] = useState("");
  const [modelDescription, setModelDescription] = useState("");
  const [pod360Title, setPod360Title] = useState("");
  const [pod360Description, setPod360Description] = useState("");
  const [objectives, setObjectives] = useState("");
  const [progressScore, setProgressScore] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalInstance = useRef<any>(null);

  useEffect(() => {
    initTWE({ Modal });
  }, []);

  useEffect(() => {
    if (modalRef.current && !modalInstance.current) {
      modalInstance.current = Modal.getOrCreateInstance(modalRef.current);
    }

    const modalElement = modalRef.current;
    if (modalElement) {
      const handleHidden = () => {
        onClose();
      };
      modalElement.addEventListener("hidden.twe.modal", handleHidden);
      return () => {
        modalElement.removeEventListener("hidden.twe.modal", handleHidden);
      };
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setInsight(rawFeedback?.insight || "");
      setCoachingTips(rawFeedback?.coachingTips || "");
      setRecommendedPrograms(rawFeedback?.recommendedPrograms || "");
      setModelDescription(rawFeedback?.modelDescription || "");
      setPod360Title(rawFeedback?.pod360Title || "");
      setPod360Description(rawFeedback?.pod360Description || "");
      setObjectives(rawFeedback?.objectives || "");
      setProgressScore(rawFeedback?.progressScore || 0);

      if (modalInstance.current) {
        modalInstance.current.show();
      }
    } else {
      if (modalInstance.current) {
        modalInstance.current.hide();
      }
    }
  }, [isOpen, rawFeedback]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
    addBulletedNewline: boolean,
  ) => {
    if (!addBulletedNewline) return;

    if (e.key === "Enter") {
      e.preventDefault();
      const cursorPosition = e.currentTarget.selectionStart;
      const textBefore = value.substring(0, cursorPosition);

      const linesBefore = textBefore.split("\n");
      const currentLine = linesBefore[linesBefore.length - 1];

      let newValue = value;
      let cursorOffset = 0;

      // If the current line where Enter was pressed DOESN'T have a bullet, add one to it!
      // This prevents the line from disappearing on the frontend (since we filter for bullets).
      if (
        currentLine.trim().length > 0 &&
        !currentLine.trim().startsWith("•")
      ) {
        const lineStartPos = textBefore.lastIndexOf("\n") + 1;
        newValue =
          value.substring(0, lineStartPos) +
          "• " +
          value.substring(lineStartPos);
        cursorOffset = 2;
      }

      const updatedCursorPos = cursorPosition + cursorOffset;
      const finalBefore = newValue.substring(0, updatedCursorPos);
      const finalAfter = newValue.substring(updatedCursorPos);
      const insertion = "\n• ";

      setter(finalBefore + insertion + finalAfter);

      const target = e.currentTarget;
      setTimeout(() => {
        const newPos = updatedCursorPos + insertion.length;
        if (target) {
          target.setSelectionRange(newPos, newPos);
        }
      }, 0);
    } else if (
      value === "" &&
      e.key.length === 1 &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      // Automatically add a bullet if typing the first character in an empty field
      e.preventDefault();
      setter("• " + e.key);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      domain,
      subdomain,
      userId,
      email: userEmail,
      insight,
      coachingTips,
      recommendedPrograms,
      modelDescription,
      pod360Title,
      pod360Description,
      objectives,
      progressScore,
    };
    console.log("[FeedbackEditor] Saving payload:", payload);
    try {
      await api.put("dashboard/detailed-insight", payload);
      toast.success("Feedback updated successfully!");
      onSuccess();
      if (modalInstance.current) {
        modalInstance.current.hide();
      }
      onClose();
    } catch (error: any) {
      console.error(
        "[FeedbackEditor] Error updating feedback:",
        error.response?.data || error.message,
      );
      toast.error(
        error.response?.data?.message || "Failed to update feedback.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={modalRef}
      data-twe-modal-init
      className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
      id="feedbackModal"
      tabIndex={-1}
      aria-hidden="true"
      data-twe-backdrop="static"
    >
      <div
        data-twe-modal-dialog-ref
        className="pointer-events-none relative flex min-h-full w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-3xl mx-auto px-4"
      >
        <div className="pointer-events-auto relative flex w-full flex-col rounded-xl border-none bg-white bg-clip-padding text-current shadow-lg outline-none max-h-[90vh] overflow-hidden">
          <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4">
            <div>
              <h5 className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold">
                Edit Feedback: {subdomain || domain}
              </h5>
              <p className="text-sm text-gray-500 mt-1">
                Press{" "}
                <span className="bg-neutral-200/55 text-xs px-1 py-0.5 rounded font-medium capitalize text-red-500">
                  space
                </span>{" "}
                and then{" "}
                <span className="bg-neutral-200/55 text-xs px-1 py-0.5 rounded font-medium capitalize text-red-500">
                  Enter
                </span>{" "}
                to automatically add a bullet (•)
              </p>
            </div>
            <button
              type="button"
              data-twe-modal-dismiss
              aria-label="Close"
              className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
            >
              <Icon icon="material-symbols:close" width="24" />
            </button>
          </div>

          <div className="relative pb-8 pt-2 py-4 px-4 max-h-[calc(100vh-100px)] overflow-y-scroll scroll-thin space-y-4">
            <div>
              <label
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                htmlFor="pod360-model"
              >
                Pod 360 Model
              </label>
              <textarea
                value={modelDescription}
                id="pod360-model"
                onChange={(e) => setModelDescription(e.target.value)}
                onKeyDown={(e) =>
                  handleKeyDown(e, setModelDescription, modelDescription, true)
                }
                rows={3}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)]border-[#E8E8E8] focus:border-[var(--primary-color)] scroll-thin"
                placeholder="Capability, Engagement, Confidence..."
              />
            </div>

            <div>
              <label
                className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                htmlFor="insightDomains"
              >
                Insight for {subdomain || domain}
              </label>
              <textarea
                value={insight}
                onChange={(e) => setInsight(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, setInsight, insight, true)}
                rows={4}
                id="insightDomains"
                className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] scroll-thin"
                placeholder="Enter insights here..."
              />
            </div>

            {showFullFeedback && (
              <div>
                <label
                  className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                  htmlFor="coachingTips"
                >
                  Coaching Tips
                </label>
                <textarea
                  value={coachingTips}
                  onChange={(e) => setCoachingTips(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, setCoachingTips, coachingTips, true)
                  }
                  id="coachingTips"
                  rows={4}
                  className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] scroll-thin"
                  placeholder="Enter objectives/tips here..."
                />
              </div>
            )}

            {/* <div>
              <label className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer">
                Pod 360 Title
              </label>
              <textarea
                value={pod360Title}
                onChange={(e) => setPod360Title(e.target.value)}
                rows={1}
                className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
                placeholder="Enter title here..."
              />
            </div>

            <div>
              <label className="block font-bold text-sm text-gray-700">
                Pod 360 Description
              </label>
              <textarea
                value={pod360Description}
                onChange={(e) => setPod360Description(e.target.value)}
                rows={3}
                className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
                placeholder="Enter description here..."
              />
            </div> */}

            <div>
              <div className="flex justify-between items-center px-1">
                <label
                  className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                  htmlFor="okrObjectives"
                >
                  Objectives and Key Results (OKRS)
                </label>
                <div className="flex items-center gap-2">
                  <label className="font-bold text-[var(--secondary-color)] text-xs text-gray-500">
                    Set Progress %
                  </label>
                  <input
                    type="number"
                    value={progressScore}
                    onChange={(e) => setProgressScore(Number(e.target.value))}
                    className="w-20 p-1.5 text-xs border rounded-lg focus:border-[var(--primary-color)] outline-none bg-blue-50/30"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <textarea
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                onKeyDown={(e) =>
                  handleKeyDown(e, setObjectives, objectives, true)
                }
                rows={4}
                id="okrObjectives"
                className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] scroll-thin"
                placeholder="Enter OKR items here (each line will be a Key Result)..."
              />
            </div>

            {showFullFeedback && (
              <div>
                <label
                  className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                  htmlFor="developmentPrograms"
                >
                  Recommended Development Programs
                </label>
                <textarea
                  value={recommendedPrograms}
                  onChange={(e) => setRecommendedPrograms(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(
                      e,
                      setRecommendedPrograms,
                      recommendedPrograms,
                      true,
                    )
                  }
                  rows={4}
                  id="developmentPrograms"
                  className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] scroll-thin"
                  placeholder="Enter recommendations here..."
                />
              </div>
            )}
          </div>

          <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 gap-2 bg-white">
            <button
              type="button"
              data-twe-modal-dismiss
              className="group text-[var(--primary-color)] px-5 py-2 h-10 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase relative overflow-hidden z-0 duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/10 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="group relative overflow-hidden z-0 text-[var(--white-color)] px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10 disabled:pointer-events-none"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackEditorModal;
