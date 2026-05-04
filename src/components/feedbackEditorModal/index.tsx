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
  allDomains: Record<string, any>;
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
  domain: initialDomain,
  subdomain: initialSubdomain,
  allDomains,
  userId,
  userEmail,
  rawFeedback,
  onSuccess,
  showFullFeedback = true,
}) => {
  const [selectedDomain, setSelectedDomain] = useState(initialDomain);
  const [selectedSubdomain, setSelectedSubdomain] = useState(initialSubdomain);

  const [insight, setInsight] = useState("");
  const [coachingTips, setCoachingTips] = useState("");
  const [recommendedPrograms, setRecommendedPrograms] = useState("");
  const [modelDescription, setModelDescription] = useState("");
  const [objectives, setObjectives] = useState("");
  const [progressScore, setProgressScore] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalInstance = useRef<any>(null);

  const formatWithBullets = (text: string) => {
    if (!text || text.trim() === "") return "";
    return text
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("•")) {
          return "• " + trimmed;
        }
        return line;
      })
      .join("\n");
  };

  useEffect(() => {
    initTWE({ Modal });
  }, []);

  useEffect(() => {
    if (modalRef.current && !modalInstance.current) {
      modalInstance.current = Modal.getOrCreateInstance(modalRef.current);
    }
    const modalElement = modalRef.current;
    if (modalElement) {
      const handleHidden = () => onClose();
      modalElement.addEventListener("hidden.twe.modal", handleHidden);
      return () => modalElement.removeEventListener("hidden.twe.modal", handleHidden);
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setSelectedDomain(initialDomain);
      setSelectedSubdomain(initialSubdomain);
      setInsight(formatWithBullets(rawFeedback?.insight || ""));
      setCoachingTips(formatWithBullets(rawFeedback?.coachingTips || ""));
      setRecommendedPrograms(formatWithBullets(rawFeedback?.recommendedPrograms || ""));
      setModelDescription(formatWithBullets(rawFeedback?.modelDescription || ""));
      setObjectives(formatWithBullets(rawFeedback?.objectives || ""));
      setProgressScore(rawFeedback?.progressScore || 0);
      if (modalInstance.current) modalInstance.current.show();
    } else {
      if (modalInstance.current) modalInstance.current.hide();
    }
  }, [isOpen, rawFeedback, initialDomain, initialSubdomain]);

  useEffect(() => {
    let ignore = false;
    const fetchContextData = async () => {
      if (!isOpen) return;

      setFetching(true);
      // Clear current data while fetching to avoid showing old data
      setInsight("");
      setCoachingTips("");
      setRecommendedPrograms("");
      setModelDescription("");
      setObjectives("");

      try {
        let url = `dashboard/detailed-insight?domain=${encodeURIComponent(selectedDomain)}&subdomain=${encodeURIComponent(selectedSubdomain)}`;
        if (userEmail) url += `&userId=${userId}&email=${encodeURIComponent(userEmail)}`;
        else if (userId) url += `&userId=${userId}`;
        const res = await api.get(url);

        if (!ignore) {
          const pods = res.data.pods;
          setInsight(formatWithBullets(pods?.insights?.mainText || ""));
          setCoachingTips(formatWithBullets(pods?.coachingTips?.items?.join("\n") || ""));
          setRecommendedPrograms(formatWithBullets(pods?.recommendations?.items?.join("\n") || ""));
          setModelDescription(formatWithBullets(pods?.modelDescription || ""));
          setObjectives(formatWithBullets(pods?.objectives?.items?.join("\n") || ""));
        }
      } catch (err) {
        if (!ignore) console.error("Failed to fetch context data", err);
      } finally {
        if (!ignore) setFetching(false);
      }
    };
    fetchContextData();
    return () => { ignore = true; };
  }, [selectedDomain, selectedSubdomain, isOpen]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (e.key === "Enter") {
      const target = e.currentTarget;
      const val = target.value;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      if (start !== end) return; // Don't interfere with selection deletion

      const textBefore = val.substring(0, start);
      const textAfter = val.substring(start);
      const lines = textBefore.split("\n");
      const currentLine = lines[lines.length - 1];

      // Option 1: Space + Enter shortcut OR just Enter on non-bulleted line
      if (currentLine.endsWith(" ") || (!currentLine.trimStart().startsWith("•") && currentLine.trim().length > 0)) {
        e.preventDefault();
        const lineStart = start - currentLine.length;

        // Prepend bullet to current line if it's missing
        const formattedCurrentLine = currentLine.trimStart().startsWith("•")
          ? currentLine.trimEnd()
          : "• " + currentLine.trim();

        const insertion = "\n• ";
        const newValue = val.substring(0, lineStart) + formattedCurrentLine + insertion + textAfter;
        setter(newValue);

        const newPos = (val.substring(0, lineStart) + formattedCurrentLine + insertion).length;
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = newPos;
        }, 0);
        return;
      }

      // Option 2: Smart Enter (continue list or end list)
      if (currentLine.trimStart().startsWith("• ")) {
        e.preventDefault();
        const indentMatch = currentLine.match(/^\s*/);
        const indent = indentMatch ? indentMatch[0] : "";

        if (currentLine.trim() === "•") {
          // Empty bullet line -> clear it (stop list)
          const lineStart = start - currentLine.length;
          const newValue = val.substring(0, lineStart) + "\n" + textAfter;
          setter(newValue);
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = lineStart + 1;
          }, 0);
        } else {
          // Continue the list
          const insertion = "\n" + indent + "• ";
          const newValue = textBefore + insertion + textAfter;
          setter(newValue);
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = start + insertion.length;
          }, 0);
        }
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      domain: selectedDomain,
      subdomain: selectedSubdomain,
      userId,
      email: userEmail,
      insight,
      coachingTips,
      recommendedPrograms,
      modelDescription,
      objectives,
      progressScore,
    };
    try {
      await api.put("dashboard/detailed-insight", payload);
      toast.success("Feedback updated successfully!");
      onSuccess();
      if (modalInstance.current) modalInstance.current.hide();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update feedback.");
    } finally {
      setLoading(false);
    }
  };

  // Dynamically derive options from allDomains prop
  const domainOptions = Object.keys(allDomains || {});
  const subdomainOptions = selectedDomain && allDomains?.[selectedDomain]?.subdomains
    ? Object.keys(allDomains[selectedDomain].subdomains)
    : [];

  return (
    <div
      ref={modalRef}
      data-twe-modal-init
      className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none font-sans"
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
          <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 pb-1">
            <div>
              <h5 className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold">
                Edit Feedback: {selectedSubdomain || selectedDomain}
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

          <div className="px-5 py-2 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#676767] uppercase">Selected Domain</label>
              <select
                value={selectedDomain}
                onChange={(e) => {
                  const newDomain = e.target.value;
                  setSelectedDomain(newDomain);
                  // Automatically pick the first subdomain of the new domain
                  const subs = Object.keys(allDomains?.[newDomain]?.subdomains || {});
                  if (subs.length > 0) setSelectedSubdomain(subs[0]);
                }}
                className="w-full bg-[#EDF5FD] border-none rounded-[4px] text-[12px] min-h-[32px] px-2 font-medium text-[#676767] outline-none"
              >
                {domainOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#676767] uppercase">Subdomain Context</label>
              <select
                value={selectedSubdomain}
                onChange={(e) => setSelectedSubdomain(e.target.value)}
                className="w-full bg-[#EDF5FD] border-none rounded-[4px] text-[12px] min-h-[32px] px-2 font-medium text-[#676767] outline-none"
              >
                {subdomainOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="relative pb-8 pt-2 py-4 px-4 max-h-[calc(100vh-100px)] overflow-y-scroll scroll-thin space-y-4">
            {fetching && (
              <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                <Icon icon="line-md:loading-loop" width="30" className="text-[var(--primary-color)]" />
              </div>
            )}
            <div>
              <label className="font-bold text-[var(--secondary-color)] text-sm">Pod 360 Model</label>
              <textarea
                value={insight}
                onChange={(e) => setInsight(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, setInsight)}
                rows={3}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] focus:border-[var(--primary-color)]"
                placeholder="Enter insights here..."
              />
            </div>
            <div>
              <label className="font-bold text-[var(--secondary-color)] text-sm">Insight for {selectedSubdomain || selectedDomain}</label>
              <textarea
                value={modelDescription}
                onChange={(e) => setModelDescription(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, setModelDescription)}
                rows={4}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] focus:border-[var(--primary-color)]"
              />
            </div>
            {showFullFeedback && (
              <div>
                <label className="font-bold text-[var(--secondary-color)] text-sm">Coaching Tips</label>
                <textarea
                  value={coachingTips}
                  onChange={(e) => setCoachingTips(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, setCoachingTips)}
                  rows={4}
                  className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] focus:border-[var(--primary-color)]"
                />
              </div>
            )}
            <div>
              <label className="font-bold text-[var(--secondary-color)] text-sm">Objectives and Key Results (OKRS)</label>
              <textarea
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, setObjectives)}
                rows={4}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] focus:border-[var(--primary-color)]"
              />
            </div>
            {showFullFeedback && (
              <div>
                <label className="font-bold text-[var(--secondary-color)] text-sm">Recommended Development Programs</label>
                <textarea
                  value={recommendedPrograms}
                  onChange={(e) => setRecommendedPrograms(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, setRecommendedPrograms)}
                  rows={4}
                  className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] focus:border-[var(--primary-color)]"
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
              disabled={loading || fetching}
              className="group relative overflow-hidden z-0 text-[var(--white-color)] px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10 disabled:pointer-events-none"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackEditorModal;
