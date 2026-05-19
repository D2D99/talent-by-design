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
  const [objectivesList, setObjectivesList] = useState<
    { title: string; keyResults: string }[]
  >([{ title: "", keyResults: "" }]);
  const [okrFocus, setOkrFocus] = useState("");
  const [progressScore, setProgressScore] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
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
      return () =>
        modalElement.removeEventListener("hidden.twe.modal", handleHidden);
    }
  }, [onClose]);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (isOpen) {
      if (!hasInitialized.current) {
        setSelectedDomain(initialDomain);
        setSelectedSubdomain(initialSubdomain);
        setInsight(formatWithBullets(rawFeedback?.insight || ""));
        setCoachingTips(formatWithBullets(rawFeedback?.coachingTips || ""));
        setRecommendedPrograms(
          formatWithBullets(rawFeedback?.recommendedPrograms || "")
        );
        setModelDescription(
          formatWithBullets(rawFeedback?.modelDescription || "")
        );

        const parseObjectivesList = (text: string) => {
          if (!text || !text.trim())
            return { focus: "", list: [{ title: "", keyResults: "" }] };

          let focus = "";
          let remainingText = text;

          const focusMatch = text.match(/\[FOCUS\]\s*([\s\S]*?)(?:\n\n|\n|$)/);
          if (focusMatch) {
            focus = focusMatch[1].trim();
            remainingText = text.replace(focusMatch[0], "").trim();
          }

          const lines = remainingText.split("\n");
          const list: { title: string; keyResults: string[] }[] = [];
          let currentTitle = "";
          let currentKRs: string[] = [];

          for (const line of lines) {
            if (!line.trim()) continue;
            if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
              currentKRs.push(line);
            } else {
              if (currentKRs.length > 0) {
                list.push({
                  title: currentTitle.trim(),
                  keyResults: currentKRs,
                });
                currentTitle = line;
                currentKRs = [];
              } else {
                currentTitle = currentTitle ? currentTitle + " " + line : line;
              }
            }
          }
          if (currentTitle || currentKRs.length > 0) {
            list.push({ title: currentTitle.trim(), keyResults: currentKRs });
          }

          const finalResults = list.map((item) => ({
            title: item.title,
            keyResults: formatWithBullets(item.keyResults.join("\n")),
          }));

          return {
            focus,
            list:
              finalResults.length > 0
                ? finalResults
                : [{ title: "", keyResults: "" }],
          };
        };

        const { focus, list } = parseObjectivesList(
          rawFeedback?.objectives || ""
        );
        setOkrFocus(focus);
        setObjectivesList(list);
        setProgressScore(rawFeedback?.progressScore || 0);
        hasInitialized.current = true;
      }
      if (modalInstance.current) modalInstance.current.show();
    } else {
      hasInitialized.current = false;
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
      setObjectivesList([{ title: "", keyResults: "" }]);
      setOkrFocus("");

      try {
        let url = `dashboard/detailed-insight?domain=${encodeURIComponent(selectedDomain)}&subdomain=${encodeURIComponent(selectedSubdomain)}`;
        if (userEmail)
          url += `&userId=${userId}&email=${encodeURIComponent(userEmail)}`;
        else if (userId) url += `&userId=${userId}`;
        const res = await api.get(url);

        if (!ignore) {
          const raw = res.data.pods?.rawFeedback || {};
          setInsight(formatWithBullets(raw.insight || ""));
          setCoachingTips(formatWithBullets(raw.coachingTips || ""));
          setRecommendedPrograms(
            formatWithBullets(raw.recommendedPrograms || "")
          );
          setModelDescription(formatWithBullets(raw.modelDescription || ""));

          const parseObjectivesList = (text: string) => {
            if (!text || !text.trim())
              return { focus: "", list: [{ title: "", keyResults: "" }] };

            let focus = "";
            let remainingText = text;

            const focusMatch = text.match(
              /\[FOCUS\]\s*([\s\S]*?)(?:\n\n|\n|$)/
            );
            if (focusMatch) {
              focus = focusMatch[1].trim();
              remainingText = text.replace(focusMatch[0], "").trim();
            }

            const lines = remainingText.split("\n");
            const list: { title: string; keyResults: string[] }[] = [];
            let currentTitle = "";
            let currentKRs: string[] = [];

            for (const line of lines) {
              if (!line.trim()) continue;
              if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
                currentKRs.push(line);
              } else {
                if (currentKRs.length > 0) {
                  list.push({
                    title: currentTitle.trim(),
                    keyResults: currentKRs,
                  });
                  currentTitle = line;
                  currentKRs = [];
                } else {
                  currentTitle = currentTitle
                    ? currentTitle + " " + line
                    : line;
                }
              }
            }
            if (currentTitle || currentKRs.length > 0) {
              list.push({ title: currentTitle.trim(), keyResults: currentKRs });
            }

            const finalResults = list.map((item) => ({
              title: item.title,
              keyResults: formatWithBullets(item.keyResults.join("\n")),
            }));

            return {
              focus,
              list:
                finalResults.length > 0
                  ? finalResults
                  : [{ title: "", keyResults: "" }],
            };
          };

          const { focus, list } = parseObjectivesList(raw.objectives || "");
          setOkrFocus(focus);
          setObjectivesList(list);
          setIsDirty(false);
        }
      } catch (err) {
        if (!ignore) console.error("Failed to fetch context data", err);
      } finally {
        if (!ignore) setFetching(false);
      }
    };
    fetchContextData();
    return () => {
      ignore = true;
    };
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

      if (start !== end) return;

      const textBefore = val.substring(0, start);
      const textAfter = val.substring(start);
      const lines = textBefore.split("\n");
      const currentLine = lines[lines.length - 1];

      // Always bullet any non-empty, non-bulleted line on Enter
      if (
        currentLine.trim().length > 0 &&
        !currentLine.trimStart().startsWith("•")
      ) {
        e.preventDefault();
        const lineStart = start - currentLine.length;
        const formattedCurrentLine = "• " + currentLine.trim();
        const insertion = "\n• ";
        const newValue =
          val.substring(0, lineStart) +
          formattedCurrentLine +
          insertion +
          textAfter;
        setter(newValue);
        const newPos = (
          val.substring(0, lineStart) +
          formattedCurrentLine +
          insertion
        ).length;
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = newPos;
        }, 0);
        setIsDirty(true);
        return;
      }

      // Smart Enter on already-bulleted lines
      if (currentLine.trimStart().startsWith("• ")) {
        e.preventDefault();
        const indentMatch = currentLine.match(/^\s*/);
        const indent = indentMatch ? indentMatch[0] : "";

        if (currentLine.trim() === "•") {
          const lineStart = start - currentLine.length;
          const newValue = val.substring(0, lineStart) + "\n" + textAfter;
          setter(newValue);
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = lineStart + 1;
          }, 0);
        } else {
          const insertion = "\n" + indent + "• ";
          const newValue = textBefore + insertion + textAfter;
          setter(newValue);
          setTimeout(() => {
            target.selectionStart = target.selectionEnd =
              start + insertion.length;
          }, 0);
        }
        setIsDirty(true);
      }
    }
  };

  const handleTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const newVal = e.target.value;
    const prevVal = (e.target as any)._prevVal ?? "";

    (e.target as any)._prevVal = newVal;

    if (
      prevVal.trim() === "" &&
      newVal.trim().length > 0 &&
      !newVal.trimStart().startsWith("•") &&
      !newVal.trimStart().startsWith("-") &&
      !newVal.trimStart().startsWith("*")
    ) {
      const bulleted = "• " + newVal.trimStart();
      setter(bulleted);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = bulleted.length;
      }, 0);
      setIsDirty(true);
      return;
    }

    setter(newVal);
    setIsDirty(true);
  };

  const handleSave = async (closeModal = true, isAutoSave = false) => {
    if (isAutoSave && (!isDirty || fetching)) return;
    if (!isAutoSave) setLoading(true);
    const payload = {
      domain: selectedDomain,
      subdomain: selectedSubdomain,
      userId,
      email: userEmail,
      insight,
      coachingTips,
      recommendedPrograms,
      modelDescription,
      objectives:
        (okrFocus ? `[FOCUS] ${okrFocus}\n\n` : "") +
        objectivesList
          .map((obj) => (obj.title ? `${obj.title}\n` : "") + obj.keyResults)
          .join("\n\n")
          .trim(),
      progressScore,
    };
    try {
      await api.put("dashboard/detailed-insight", payload);
      setIsDirty(false);
      if (!isAutoSave) {
        toast.success("Saved and Updated!");
        onSuccess();
      }
      if (closeModal) {
        if (modalInstance.current) modalInstance.current.hide();
        onClose();
      }
    } catch (error: any) {
      if (!isAutoSave) {
        toast.error(
          error.response?.data?.message || "Failed to update feedback."
        );
      }
    } finally {
      if (!isAutoSave) setLoading(false);
    }
  };

  // Dynamically derive options from allDomains prop
  const domainOptions = Object.keys(allDomains || {});
  const subdomainOptions =
    selectedDomain && allDomains?.[selectedDomain]?.subdomains
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

          <div className="relative pb-8 pt-2 py-4 px-4 max-h-[calc(100vh-100px)] overflow-y-scroll scroll-thin space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
                  htmlFor="selectedDomain"
                >
                  Selected Domain
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 right-0 top-3.5  items-center pr-3 pointer-events-none">
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
                    value={selectedDomain}
                    onChange={(e) => {
                      const newDomain = e.target.value;
                      handleSave(false, true);
                      setSelectedDomain(newDomain);
                      // Automatically pick the first subdomain of the new domain
                      const subs = Object.keys(
                        allDomains?.[newDomain]?.subdomains || {}
                      );
                      if (subs.length > 0) setSelectedSubdomain(subs[0]);
                      else setSelectedSubdomain("");
                    }}
                    className="font-medium text-sm capitalize appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    id="selectedDomain"
                  >
                    {domainOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label
                  className="font-bold cursor-pointer text-[var(--secondary-color)] text-sm"
                  htmlFor="selectedSubDomain"
                >
                  Subdomain Context
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 right-0 top-3.5  items-center pr-3 pointer-events-none">
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
                    value={selectedSubdomain}
                    onChange={(e) => {
                      handleSave(false, true);
                      setSelectedSubdomain(e.target.value);
                    }}
                    className="font-medium text-sm capitalize appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    id="selectedSubDomain"
                  >
                    {subdomainOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {fetching && (
              <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                <Icon
                  icon="line-md:loading-loop"
                  width="30"
                  className="text-[var(--primary-color)]"
                />
              </div>
            )}
            <div>
              <label className="font-bold text-[var(--secondary-color)] text-sm">
                Pod 360 Model
              </label>
              <textarea
                value={insight}
                onChange={(e) => handleTextareaChange(e, setInsight)}
                onKeyDown={(e) => handleKeyDown(e, setInsight)}
                rows={3}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] focus:border-[var(--primary-color)]"
                placeholder="Enter insights here..."
              />
            </div>
            <div>
              <label className="font-bold text-[var(--secondary-color)] text-sm">
                Insight for {selectedSubdomain || selectedDomain}
              </label>
              <textarea
                value={modelDescription}
                onChange={(e) => handleTextareaChange(e, setModelDescription)}
                onKeyDown={(e) => handleKeyDown(e, setModelDescription)}
                rows={4}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] focus:border-[var(--primary-color)]"
              />
            </div>
            {showFullFeedback && (
              <div>
                <label className="font-bold text-[var(--secondary-color)] text-sm">
                  Coaching Tips
                </label>
                <textarea
                  value={coachingTips}
                  onChange={(e) => handleTextareaChange(e, setCoachingTips)}
                  onKeyDown={(e) => handleKeyDown(e, setCoachingTips)}
                  rows={4}
                  className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] focus:border-[var(--primary-color)]"
                />
              </div>
            )}
            <div className="space-y-4 mt-4">
              <div>
                <label className="font-bold text-[var(--secondary-color)] text-sm">
                  OKRS Focus
                </label>
                <input
                  type="text"
                  value={okrFocus}
                  onChange={(e) => {
                    setOkrFocus(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Enter OKR focus area..."
                  className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] focus:border-[var(--primary-color)]"
                />
              </div>

              {objectivesList.map((obj, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-[var(--secondary-color)] text-sm">
                      Objectives {index + 1}
                    </label>
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newList = [...objectivesList];
                          newList.splice(index, 1);
                          setObjectivesList(newList);
                          setIsDirty(true);
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Icon icon="lucide:trash-2" width="16" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={obj.title}
                    onChange={(e) => {
                      const newList = [...objectivesList];
                      newList[index].title = e.target.value;
                      setObjectivesList(newList);
                      setIsDirty(true);
                    }}
                    placeholder="Enter objective title..."
                    className="font-medium text-sm text-[#5D5D5D] w-full p-3 border rounded-lg transition-all outline-none border-[#E8E8E8] focus:border-[var(--primary-color)]"
                  />
                  <div>
                    <label className="font-bold text-[var(--secondary-color)] text-sm">
                      Key Results
                    </label>
                    <textarea
                      value={obj.keyResults}
                      onChange={(e) => {
                        const setter: React.Dispatch<
                          React.SetStateAction<string>
                        > = (val) => {
                          const newList = [...objectivesList];
                          newList[index].keyResults =
                            typeof val === "function"
                              ? val(newList[index].keyResults)
                              : val;
                          setObjectivesList(newList);
                        };
                        handleTextareaChange(e, setter);
                      }}
                      onKeyDown={(e) => {
                        const setter = (val: React.SetStateAction<string>) => {
                          const newList = [...objectivesList];
                          newList[index].keyResults =
                            typeof val === "function"
                              ? val(newList[index].keyResults)
                              : val;
                          setObjectivesList(newList);
                          setIsDirty(true);
                        };
                        handleKeyDown(e, setter);
                      }}
                      rows={4}
                      className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setObjectivesList([
                    ...objectivesList,
                    { title: "", keyResults: "" },
                  ]);
                  setIsDirty(true);
                }}
                className="text-[var(--primary-color)] font-semibold text-sm hover:underline flex items-center gap-1"
              >
                <Icon icon="mdi:plus" width="16" />
                Add More Objective
              </button>
            </div>
            {showFullFeedback && (
              <div>
                <label className="font-bold text-[var(--secondary-color)] text-sm">
                  Recommended Development Programs
                </label>
                <textarea
                  value={recommendedPrograms}
                  onChange={(e) =>
                    handleTextareaChange(e, setRecommendedPrograms)
                  }
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
              onClick={() => handleSave(true, false)}
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
