/// <reference types="vite/client" />
import { useEffect, useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { Collapse, Tab, Modal, initTWE, Ripple } from "tw-elements";
import type { DropResult } from "@hello-pangea/dnd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { questionService } from "../../services/questionService";
import { toast } from "react-toastify";

const ProgressIcon = "/static/img/home/progress-icon.png";

import type {
  Question,
  CreateQuestionData,
} from "../../services/questionService";

// ------ CONSTANTS ------
const ROLE_DOMAIN_SUBDOMAINS: Record<string, Record<string, string[]>> = {
  admin: {
    "People Potential": [
      "Mindset & Adaptability",
      "Psychological Health & Safety",
      "Relational & Emotional Intelligence Adaptability"
    ],
    "Operational Steadiness": [
      "Prioritization",
      "Workflow Clarity",
      "Effective Resource Management"
    ],
    "Digital Fluency": [
      "Data",
      "AI & Automation Readiness",
      "Digital Communication & Collaboration",
      "Mindset",
      "Confidence and Change Readiness",
      "Tool & System Proficiency"
    ]
  },
  leader: {
    "People Potential": [
      "Mindset & Adaptability",
      "Psychological Health & Safety",
      "Relational & Emotional Intelligence Adaptability"
    ],
    "Operational Steadiness": [
      "Prioritization",
      "Workflow Clarity",
      "Effective Resource Management"
    ],
    "Digital Fluency": [
      "Data",
      "AI & Automation Readiness",
      "Digital Communication & Collaboration",
      "Mindset",
      "Confidence and Change Readiness",
      "Tool & System Proficiency"
    ]
  },

  manager: {
    "People Potential": [
      "Mindset & Adaptability",
      "Psychological Health & Safety",
      "Relational & Emotional Intelligence Adaptability"
    ],
    "Operational Steadiness": [
      "Prioritization",
      "Workflow Clarity",
      "Effective Resource Management"
    ],
    "Digital Fluency": [
      "Data",
      "AI & Automation Readiness",
      "Digital Communication & Collaboration",
      "Mindset",
      "Confidence and Change Readiness",
      "Tool & System Proficiency"
    ]
  },

  employee: {
    "People Potential": [
      "Mindset & Adaptability",
      "Psychological Health & Safety",
      "Relational & Emotional Intelligence Adaptability"
    ],
    "Operational Steadiness": [
      "Prioritization",
      "Workflow Clarity",
      "Effective Resource Management"
    ],
    "Digital Fluency": [
      "Data",
      "AI & Automation Readiness",
      "Digital Communication & Collaboration",
      "Mindset",
      "Confidence and Change Readiness",
      "Tool & System Proficiency"
    ]
  },
};

const DOMAINS = [
  "People Potential",
  "Operational Steadiness",
  "Digital Fluency",
];
const QUESTION_TYPES = [
  "Self-Rating",
  "Calibration",
  "Behavioural",
  "Forced-Choice",
];
const SCALES = ["SCALE_1_5", "NEVER_ALWAYS", "FORCED_CHOICE"];

interface QuestionFormData {
  role: string;
  domain: string;
  subDomain: string;
  type: string;
  code: string;
  question: string;
  scale: string;
  prompt: string;
  // Forced Choice Fields
  optionALabel: string;
  optionAPrompt: string;
  optionBLabel: string;
  optionBPrompt: string;
  higherValueOption: string;
}

const INITIAL_FORM_DATA: QuestionFormData = {
  role: "",
  domain: "",
  subDomain: "",
  type: "",
  code: "Auto-generated",
  question: "",
  scale: "",
  prompt: "",
  optionALabel: "",
  optionAPrompt: "",
  optionBLabel: "",
  optionBPrompt: "",
  higherValueOption: "A",
};

const domainAbbr: Record<string, string> = {
  "People Potential": "PP",
  "Operational Steadiness": "OS",
  "Digital Fluency": "DF"
};

const stakeholderPrefix: Record<string, string> = {
  "admin": "A",
  "leader": "L",
  "manager": "M",
  "employee": "E"
};

const typeSuffix: Record<string, string> = {
  "Calibration": "CAL",
  "Behavioural": "B",
  "Forced-Choice": "FC",
  "Self-Rating": ""
};

const getAbbreviation = (text: string) => {
  if (!text) return "";
  return text
    .split(/[\s&/-]+/)
    .filter(word => word.length > 0 && !["and", "the", "with", "or"].includes(word.toLowerCase()))
    .map(word => word[0].toUpperCase())
    .join("");
};

const getGeneratedCodePreview = (data: QuestionFormData, allQuestions: Question[]) => {
  if (!data.role || !data.domain || !data.subDomain || !data.type) return "Auto-generated";
  const dAbbr = domainAbbr[data.domain] || getAbbreviation(data.domain);
  const sAbbr = getAbbreviation(data.subDomain);
  const rolePref = stakeholderPrefix[data.role.toLowerCase()] || data.role[0].toUpperCase();
  const tSuff = typeSuffix[data.type] || "";

  const prefix = `${dAbbr}-${sAbbr}-${rolePref}${tSuff}`;

  // Find questions with this prefix in the local state to determine the next number
  // This matches the regex logic in the backend
  const regex = new RegExp(`^${prefix}(\\d+)$`);
  let maxNum = 0;

  allQuestions.forEach(q => {
    const match = q.questionCode?.match(regex);
    if (match) {
      const num = parseInt(match[1]);
      if (num > maxNum) maxNum = num;
    }
  });

  return `${prefix}${maxNum + 1}`;
};

const CrudQuestion = () => {
  // 1. STATE MANAGEMENT
  const [allQuestions, setAllQuestions] = useState<Question[]>([]); // Store all fetched questions
  const [loading, setLoading] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const [openSubdomains, setOpenSubdomains] = useState<string[]>([]);

  // -- Filter State --
  // -- Filter State (PERSISTENT) --
  const [showFilters, setShowFilters] = useState(() =>
    JSON.parse(localStorage.getItem("crud_showFilters") || "false"),
  );
  const [filterRole, setFilterRole] = useState(
    () => localStorage.getItem("crud_filterRole") || "",
  );
  const [filterDomains, setFilterDomains] = useState<string[]>(() => {
    const saved = localStorage.getItem("crud_filterDomains");
    return saved ? JSON.parse(saved) : ["People Potential"];
  });
  const [filterSubdomains, setFilterSubdomains] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("crud_filterSubdomains") || "[]"),
  );
  const [filterTypes, setFilterTypes] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("crud_filterTypes") || "[]"),
  );
  const [filterScales, setFilterScales] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("crud_filterScales") || "[]"),
  );

  // Persist State Changes
  useEffect(
    () => localStorage.setItem("crud_showFilters", JSON.stringify(showFilters)),
    [showFilters],
  );
  useEffect(
    () => localStorage.setItem("crud_filterRole", filterRole),
    [filterRole],
  );
  useEffect(
    () =>
      localStorage.setItem("crud_filterDomains", JSON.stringify(filterDomains)),
    [filterDomains],
  );
  useEffect(
    () =>
      localStorage.setItem(
        "crud_filterSubdomains",
        JSON.stringify(filterSubdomains),
      ),
    [filterSubdomains],
  );
  useEffect(
    () => localStorage.setItem("crud_filterTypes", JSON.stringify(filterTypes)),
    [filterTypes],
  );
  useEffect(
    () =>
      localStorage.setItem("crud_filterScales", JSON.stringify(filterScales)),
    [filterScales],
  );

  // -- Form State --
  // For Edit (single question)
  const [editFormData, setEditFormData] =
    useState<QuestionFormData>(INITIAL_FORM_DATA);

  // For Add (list of questions)
  const [addForms, setAddForms] = useState<QuestionFormData[]>([
    INITIAL_FORM_DATA,
  ]);

  // Determine Active Domain for Tabs (Visual) - Syncs with Filter if single domain selected
  const activeTabDomain =
    filterDomains.length === 1
      ? filterDomains[0]
      : filterDomains[0] || "People Potential";

  // 2. FILTER LOGIC
  const toggleFilter = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
  ) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const availableSubdomains = useMemo(() => {
    const subdomainsSet = new Set<string>();
    const rolesToCheck = filterRole
      ? [filterRole]
      : Object.keys(ROLE_DOMAIN_SUBDOMAINS);
    const domainsToCheck = filterDomains.length > 0 ? filterDomains : DOMAINS;

    const orderedSubdomains: string[] = [];
    rolesToCheck.forEach((role) => {
      domainsToCheck.forEach((domain: string) => {
        const subs = ROLE_DOMAIN_SUBDOMAINS[role]?.[domain];
        if (subs) {
          subs.forEach((s: string) => {
            if (!subdomainsSet.has(s)) {
              subdomainsSet.add(s);
              orderedSubdomains.push(s);
            }
          });
        }
      });
    });
    return orderedSubdomains;
  }, [filterRole, filterDomains]);

  const resetFilters = () => {
    setFilterRole("");
    setFilterDomains(["People Potential"]);
    setFilterSubdomains([]);
    setFilterTypes([]);
    setFilterScales([]);
  };

  const filteredQuestions = useMemo(() => {
    if (!filterRole) return []; // Ensure no questions show if no role is selected
    return allQuestions.filter((q: Question) => {
      if (q.stakeholder !== filterRole) return false;
      if (filterDomains.length > 0 && !filterDomains.includes(q.domain))
        return false;
      if (
        filterSubdomains.length > 0 &&
        !filterSubdomains.includes(q.subdomain)
      )
        return false;
      if (filterTypes.length > 0 && !filterTypes.includes(q.questionType))
        return false;
      if (filterScales.length > 0 && !filterScales.includes(q.scale))
        return false;
      return true;
    });
  }, [
    allQuestions,
    filterRole,
    filterDomains,
    filterSubdomains,
    filterTypes,
    filterScales,
  ]);

  const displayGroups = useMemo(() => {
    if (filterSubdomains.length > 0) {
      return availableSubdomains.filter((sd: string) =>
        filterSubdomains.includes(sd),
      );
    }
    return availableSubdomains.filter((sd: string) => {
      const relevantRoles = filterRole
        ? [filterRole]
        : Object.keys(ROLE_DOMAIN_SUBDOMAINS);
      return relevantRoles.some((role) =>
        ROLE_DOMAIN_SUBDOMAINS[role]?.[activeTabDomain]?.includes(sd),
      );
    });
  }, [availableSubdomains, filterSubdomains, filterRole, activeTabDomain]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterRole) count++;
    // filterDomains is always size 1 (default or selected),
    // but usually we count things explicitly filtered.
    // Let's count subdomains, types, and scales.
    count += filterSubdomains.length;
    count += filterTypes.length;
    count += filterScales.length;
    return count;
  }, [filterRole, filterSubdomains, filterTypes, filterScales]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await questionService.getAllQuestions();
      setAllQuestions(data);
    } catch (err) {
      // Optional: Don't show global error if not critical
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (displayGroups.length > 0) {
      setOpenSubdomains([displayGroups[0]]);
    } else {
      setOpenSubdomains([]);
    }
  }, [displayGroups]);

  useEffect(() => {
    // Re-initialize TW Elements when dependency changes to ensure new DOM elements are caught correctly
    const timer = setTimeout(() => {
      initTWE({ Tab, Collapse, Modal, Ripple });
    }, 0);
    return () => clearTimeout(timer);
  }, [
    filterRole,
    activeTabDomain,
    filterSubdomains,
    allQuestions,
    displayGroups,
  ]);

  // 3. MODAL HANDLERS
  const openAddModal = () => {
    // Reset Add Form List
    // If filterRole is selected, pre-fill it.
    const initialData = {
      ...INITIAL_FORM_DATA,
      role: filterRole || "",
      domain: activeTabDomain,
    };
    initialData.code = getGeneratedCodePreview(initialData, allQuestions);
    setAddForms([initialData]);

    const modal = Modal.getOrCreateInstance(
      document.getElementById("addModal") as HTMLElement,
    );
    modal.show();
  };

  const openEditModal = (q: Question) => {
    setSelectedQuestion(q);
    setEditFormData({
      role: q.stakeholder || "",
      domain: q.domain || "",
      subDomain: q.subdomain || "",
      type: q.questionType || "",
      code: q.questionCode || "",
      question: q.questionStem || "",
      scale: q.scale || "",
      prompt: q.insightPrompt || "",
      optionALabel: q.forcedChoice?.optionA?.label || "",
      optionAPrompt: q.forcedChoice?.optionA?.insightPrompt || "",
      optionBLabel: q.forcedChoice?.optionB?.label || "",
      optionBPrompt: q.forcedChoice?.optionB?.insightPrompt || "",
      higherValueOption: q.forcedChoice?.higherValueOption || "A",
    });
    const modal = Modal.getOrCreateInstance(
      document.getElementById("editModal") as HTMLElement,
    );
    modal.show();
  };

  const openDeleteModal = (q: Question) => {
    setSelectedQuestion(q);
    const modal = Modal.getOrCreateInstance(
      document.getElementById("deleteModal") as HTMLElement,
    );
    modal.show();
  };

  // Handler for ADD Modal Inputs (Array)

  const updateAddForm = (
    index: number,
    field: keyof QuestionFormData,
    value: string,
  ) => {
    setAddForms((prev: QuestionFormData[]) => {
      const newList = [...prev];
      newList[index] = { ...newList[index], [field]: value };

      // Re-calculate code preview if relevant fields change
      if (["role", "domain", "subDomain", "type"].includes(field)) {
        newList[index].code = getGeneratedCodePreview(newList[index], allQuestions);
      }

      // Cascading Logic: Use Requirement "if role is select then it will be fix in the next queeiotsn also"
      // AND Backend Requirement: "All questions must belong to the same stakeholder"
      // Implementation: If we change the Role of the FIRST question (index 0), we update ALL questions.
      if (index === 0 && field === "role") {
        for (let i = 1; i < newList.length; i++) {
          newList[i] = {
            ...newList[i],
            role: value,
            code: getGeneratedCodePreview({ ...newList[i], role: value }, allQuestions)
          };
        }
      }

      return newList;
    });
  };

  const addMoreQuestion = () => {
    setAddForms((prev) => {
      const lastItem = prev[prev.length - 1];
      // Determine what to copy
      const newItem = {
        ...INITIAL_FORM_DATA,
        role: lastItem.role, // Inherit Role (Strict)
        domain: lastItem.domain, // Inherit Domain (Likely desired)
        subDomain: lastItem.subDomain, // Inherit SubDomain (Likely desired)
        type: lastItem.type,
        scale: lastItem.scale,
        // Resetting code, question, prompt etc.
      };
      newItem.code = getGeneratedCodePreview(newItem, allQuestions);
      return [...prev, newItem];
    });
  };

  const removeAddForm = (index: number) => {
    if (addForms.length <= 1) return; // Don't delete the last one
    setAddForms((prev: QuestionFormData[]) =>
      prev.filter((_, i) => i !== index),
    );
  };

  // Handler for EDIT Modal Inputs (Single)
  const handleEditInputChange = (e: {
    target: { id: string; value: string };
  }) => {
    const { id, value } = e.target;
    let key = id;
    if (id.startsWith("add")) {
      // Legacy ID cleaning if inputs still have "add" prefix
      key = id.replace("add", "");
      key = key.charAt(0).toLowerCase() + key.slice(1);
    }

    setEditFormData((prev) => {
      const newData = { ...prev, [key]: value };
      // If type, domain, or subdomain changed (internal logic check, though backend restricts edit)
      if (["type", "domain", "subDomain", "role"].includes(key)) {
        // Only preview if it's already an auto-generated style or if we want to force re-gen
        // For now, let's just update the preview if they change the type
        newData.code = getGeneratedCodePreview(newData, allQuestions);
      }
      return newData;
    });
  };

  // 4. API ACTIONS
  const handleCreate = async () => {
    setLoading(true);
    try {
      // Construct Payload
      const payload: Record<string, CreateQuestionData> = {};

      addForms.forEach((form, idx) => {
        // Validate required fields? (Backend does it, but frontend validation is good)
        if (!form.role || !form.domain || !form.question) {
          // Simple validation skip or alert?
        }

        payload[`question${idx + 1}`] = {
          stakeholder: form.role,
          domain: form.domain,
          subdomain: form.subDomain,
          questionType: form.type,
          questionCode: form.code,
          questionStem: form.question,
          scale: form.scale,
          insightPrompt:
            form.scale !== "FORCED_CHOICE" ? form.prompt : undefined,
          forcedChoice:
            form.scale === "FORCED_CHOICE"
              ? {
                optionA: {
                  label: form.optionALabel,
                  insightPrompt: form.optionAPrompt,
                },
                optionB: {
                  label: form.optionBLabel,
                  insightPrompt: form.optionBPrompt,
                },
                higherValueOption: form.higherValueOption as "A" | "B",
              }
              : undefined,
        };
      });

      await questionService.createQuestions(payload);
      toast.success("Questions created successfully!");
      await fetchQuestions();
      Modal.getInstance(
        document.getElementById("addModal") as HTMLElement,
      )?.hide();
    } catch (err) {
      const error = err as Error;
      const message = error.message || "Failed to create questions";
      if (message.includes(",")) {
        message.split(",").forEach((msg: string) => toast.error(msg.trim()));
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedQuestion) return;
    setLoading(true);
    try {
      await questionService.updateQuestion(selectedQuestion._id, {
        questionType: editFormData.type,
        questionStem: editFormData.question,
        scale: editFormData.scale,
        insightPrompt:
          editFormData.scale !== "FORCED_CHOICE"
            ? editFormData.prompt
            : undefined,
        forcedChoice:
          editFormData.scale === "FORCED_CHOICE"
            ? {
              optionA: {
                label: editFormData.optionALabel,
                insightPrompt: editFormData.optionAPrompt,
              },
              optionB: {
                label: editFormData.optionBLabel,
                insightPrompt: editFormData.optionBPrompt,
              },
              higherValueOption: editFormData.higherValueOption as "A" | "B",
            }
            : undefined,
      });
      await fetchQuestions();
      toast.success("Question updated successfully!");
      Modal.getInstance(
        document.getElementById("editModal") as HTMLElement,
      )?.hide();
    } catch (err) {
      const error = err as Error;
      const message = error.message || "Failed to update question";
      if (message.includes(",")) {
        message.split(",").forEach((msg: string) => toast.error(msg.trim()));
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedQuestion) return;
    setLoading(true);
    try {
      setAllQuestions((prev: Question[]) =>
        prev.filter((q: Question) => q._id !== selectedQuestion._id),
      );
      toast.success("Question deleted successfully!");
      Modal.getInstance(
        document.getElementById("deleteModal") as HTMLElement,
      )?.hide();
    } catch (err) {
      const error = err as Error;
      const message = error.message || "Failed to delete question";
      if (message.includes(",")) {
        message.split(",").forEach((msg: string) => toast.error(msg.trim()));
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    setAllQuestions((prev: Question[]) => {
      const newQuestions = [...prev];

      // 1. Find the question being dragged
      const draggedIdx = newQuestions.findIndex(
        (q: Question) => q._id === draggableId,
      );
      if (draggedIdx === -1) return prev;

      const [draggedItem] = newQuestions.splice(draggedIdx, 1);

      // 2. Update its subdomain if it moved to a different droppable
      if (source.droppableId !== destination.droppableId) {
        draggedItem.subdomain = destination.droppableId;
      }

      // 3. Find the correct insertion point in the flat array
      // We want to insert it at destination.index relative to other questions in the target subdomain
      const questionsInTargetSub = newQuestions.filter(
        (q: Question) => q.subdomain === destination.droppableId,
      );

      let insertionIdx;
      if (questionsInTargetSub.length === 0) {
        // If target subdomain is empty, we just append to the end
        insertionIdx = newQuestions.length;
      } else if (destination.index >= questionsInTargetSub.length) {
        // Insert after the last question of target subdomain
        const lastQuestionIdx = newQuestions.lastIndexOf(
          questionsInTargetSub[questionsInTargetSub.length - 1],
        );
        insertionIdx = lastQuestionIdx + 1;
      } else {
        // Insert at the specific index among target subdomain questions
        const targetRefQuestion = questionsInTargetSub[destination.index];
        insertionIdx = newQuestions.indexOf(targetRefQuestion);
      }

      newQuestions.splice(insertionIdx, 0, draggedItem);
      return newQuestions;
    });
  };

  // Helper for form
  const getSubdomainsForForm = (role: string, domain: string) => {
    if (!role || !domain) return [];
    return ROLE_DOMAIN_SUBDOMAINS[role]?.[domain] || [];
  };

  return (
    <div className="crud-question-screen relative flex flex-col lg:flex-row gap-4 items-start">
      {/* --- FILTER SIDEBAR --- */}
      {showFilters && (
        <div className="w-full md:w-96 bg-white shadow-[0_0_5px_rgba(68,140,210,0.5)] md:rounded-xl py-5 flex-shrink-0 z-[55] md:absolute fixed md:top-44 md:right-7 top-1/2 right-0 md:translate-y-0 -translate-y-1/2 md:h-auto h-full dark:bg-[var(--app-surface)] dark:border dark:border-[var(--app-border-color)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
          <div className="flex justify-between items-center mb-6 px-5">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-lg text-gray-800 dark:text-[var(--app-heading-color)]">
                Filters
              </h3>
              <button
                onClick={resetFilters}
                className="text-[10px] font-bold text-blue-500 hover:text-blue-700 uppercase tracking-tighter bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 transition-colors dark:bg-[rgba(121,186,240,0.16)] dark:border-[rgba(121,186,240,0.35)] dark:text-[#cbe4fb]"
              >
                Reset
              </button>
            </div>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors dark:text-[#88a7c4] dark:hover:text-[#d6e8f8]"
            >
              <Icon icon="material-symbols:close" width="22" />
            </button>
          </div>

          <div className="md:max-h-[500px] max-h-[calc(100vh-80px)] overflow-y-auto px-5">
            {/* Role Filter */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-[var(--app-text-muted)]">
                Role
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 right-0 top-2 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-[#5D5D5D] dark:text-[#88a7c4]"
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
                  className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-2 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] dark:bg-[var(--app-surface-muted)] dark:border-[var(--app-border-color)] dark:text-[var(--app-text-color)]"
                  value={filterRole}
                  onChange={(e) => {
                    setFilterRole(e.target.value);
                    setFilterSubdomains([]); // Reset subdomains when role changes
                  }}
                >
                  <option value="">Select role</option>
                  {Object.keys(ROLE_DOMAIN_SUBDOMAINS).map((r) => (
                    <option key={r} value={r} className="capitalize">
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Domain Filter */}
            <FilterSection title="Domain" open>
              {DOMAINS.map((d) => (
                <label
                  key={d}
                  className="flex items-center gap-2 mb-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filterDomains.includes(d)}
                    onChange={() => {
                      setFilterDomains([d]);
                      setFilterSubdomains([]); // Clear subdomains when changing domain to avoid empty results
                    }}
                    className="accent-blue-500 text-blue-600 focus:ring-blue-500 rounded-full dark:border-[var(--app-border-color)] dark:bg-[var(--app-surface-muted)]"
                  />
                  <span className="text-sm text-gray-700 dark:text-[var(--app-text-muted)]">
                    {d}
                  </span>
                </label>
              ))}
            </FilterSection>

            {/* Subdomain Filter */}
            <FilterSection title="Sub-domain" open>
              {availableSubdomains.length > 0 ? (
                availableSubdomains.map((sd) => (
                  <label
                    key={sd}
                    className="flex items-center gap-2 mb-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filterSubdomains.includes(sd)}
                      onChange={() => toggleFilter(setFilterSubdomains, sd)}
                      className="rounded text-blue-600 accent-blue-500 focus:ring-blue-500 dark:border-[var(--app-border-color)] dark:bg-[var(--app-surface-muted)]"
                    />
                    <span
                      className="text-sm text-gray-700 dark:text-[var(--app-text-muted)] truncate"
                      title={sd}
                    >
                      {sd}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-xs text-gray-400 dark:text-[#88a7c4]">
                  Select Role/Domain to view
                </p>
              )}
            </FilterSection>

            {/* Type/Scale Filters can go here... */}
            <FilterSection title="Question Type">
              {QUESTION_TYPES.map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-2 mb-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filterTypes.includes(t)}
                    onChange={() => toggleFilter(setFilterTypes, t)}
                    className="rounded text-blue-600 accent-blue-500 focus:ring-blue-500 dark:border-[var(--app-border-color)] dark:bg-[var(--app-surface-muted)]"
                  />
                  <span className="text-sm text-gray-700 dark:text-[var(--app-text-muted)]">
                    {t}
                  </span>
                </label>
              ))}
            </FilterSection>

            <FilterSection title="Scale">
              {SCALES.map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-2 mb-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filterScales.includes(s)}
                    onChange={() => toggleFilter(setFilterScales, s)}
                    className="rounded text-blue-600 accent-blue-500 focus:ring-blue-500 dark:border-[var(--app-border-color)] dark:bg-[var(--app-surface-muted)]"
                  />
                  <span className="text-sm text-gray-700 dark:text-[var(--app-text-muted)] lowercase">
                    {s.replace("_", " ")}
                  </span>
                </label>
              ))}
            </FilterSection>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 w-full bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] min-h-[calc(100vh-162px)] dark:bg-[var(--app-surface)] dark:border-[var(--app-border-color)] dark:shadow-[0_14px_34px_rgba(0,0,0,0.26)] dark:text-[var(--app-text-color)]">
        {/* HEADER: Title left, Add Button right */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h2 className="md:text-2xl text-xl font-bold text-gray-800 dark:text-[var(--app-heading-color)]">
            Assessment Questions
          </h2>
          <button
            type="button"
            onClick={openAddModal}
            className="relative overflow-hidden z-0 text-[var(--white-color)] ps-2.5 pe-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
          >
            <Icon icon="material-symbols:add" width="20" height="20" />
            Add new question
          </button>
        </div>

        {/* TABS ROW: Centered Tabs, Filter Button on Right */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-end mb-8 gap-4">
          {/* Spacer - Flexible Width (Hidden on Mobile) */}
          {/* <div className="flex-1 hidden md:block"></div> */}

          {/* Centered Tabs */}
          <div className="flex md:justify-end justify-start items-start w-full overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <ul className="flex list-none flex-row bg-[var(--light-primary-color)] rounded-full p-1 border border-gray-100 gap-1 md:min-w-max dark:bg-[var(--app-surface-muted)] dark:border-[var(--app-border-color)]">
              {DOMAINS.map((domain, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      setFilterDomains([domain]);
                      setFilterSubdomains([]); // Reset subdomains when changing domain to ensure immediate updates
                    }}
                    className={`px-6 py-2.5 text-sm  uppercase rounded-full transition-all whitespace-nowrap
                            ${filterDomains.includes(domain)
                        ? "bg-white text-gray-900 shadow-sm font-semibold dark:bg-[var(--app-surface-soft)] dark:text-[#d8ebff]"
                        : "text-neutral-500 font-semibold dark:text-[#9bb8d3]"
                      }`}
                  >
                    {domain}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Filter Button - Right Aligned with flexible space */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-3 px-4 py-2 rounded-md font-medium text-sm uppercase tracking-wider border transition-all w-auto
                    ${showFilters
                ? "bg-[var(--primary-color)] text-white"
                : "bg-white text-blue-400 border-blue-200 hover:border-blue-300 dark:bg-[var(--app-surface)] dark:text-[#a5cdf3] dark:border-[var(--app-border-color)] dark:hover:border-[#79baf0]"
              }`}
          >
            <div className="flex items-center gap-2">
              <Icon icon="hugeicons:filter" width="16" height="16" />
              <span>Filter</span>
            </div>
            {activeFilterCount > 0 && (
              <span
                className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold transition-colors
                ${showFilters ? "bg-white text-[var(--primary-color)] dark:bg-[var(--app-surface-soft)] dark:text-[#d8ebff]" : "bg-[var(--primary-color)] text-white"}`}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* --- CONTENT AREA (Accordions + Role Prompt) --- */}
        <div className="space-y-6">
          {!filterRole && (
            <div className="p-8 text-center flex flex-col items-center">
              <div className="bg-[#448CD208] p-4 rounded-full shadow-sm mb-4">
                <Icon
                  icon="hugeicons:audit-02"
                  className="text-[var(--primary-color)] w-10 h-10"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-[var(--app-heading-color)]">
                No Role Selected
              </h3>
              <p className="text-gray-500 max-w-sm mb-6 text-sm leading-relaxed px-4 dark:text-[var(--app-text-muted)]">
                To view the assessment structure and questions, Please select a{" "}
                <strong>Role</strong>.
              </p>

              <div className="w-full max-w-xs relative">
                <div className="absolute inset-y-0 right-0 top-1 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-[#5D5D5D] dark:text-[#88a7c4]"
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
                  className="font-semibold text-sm appearance-none text-[#1A3652] outline-none shadow-sm sm:w-full w-fit p-3 border rounded-md transition-all border-[#448CD233] focus:border-[var(--primary-color)] bg-white cursor-pointer hover:bg-gray-50 dark:bg-[var(--app-surface-muted)] dark:border-[var(--app-border-color)] dark:text-[var(--app-text-color)] dark:hover:bg-[var(--app-surface-soft)]"
                  value={filterRole}
                  onChange={(e) => {
                    setFilterRole(e.target.value);
                    setFilterSubdomains([]); // Reset subdomains when role changes
                  }}
                >
                  <option value="">Select Role</option>
                  {Object.keys(ROLE_DOMAIN_SUBDOMAINS).map((r) => (
                    <option key={r} value={r} className="capitalize">
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {filterRole ? (
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <div className="space-y-4">
                {displayGroups.map((subdomainTitle) => {
                  const questionsInGroup = filteredQuestions.filter(
                    (q) => q.subdomain === subdomainTitle,
                  );
                  const safeId = subdomainTitle
                    .replace(/[^a-zA-Z0-9]/g, "-")
                    .toLowerCase();

                  return (
                    <div
                      key={subdomainTitle}
                      className="rounded-xl border border-gray-100 bg-white overflow-hidden dark:bg-[var(--app-surface)] dark:border-[var(--app-border-color)]"
                    >
                      <h2 className="mb-0" id={`heading-${safeId}`}>
                        <button
                          className="group relative flex w-full items-center justify-between px-6 py-5 text-left text-lg font-bold text-gray-800 transition hover:bg-gray-50 focus:outline-none dark:text-[var(--app-heading-color)] dark:hover:bg-[var(--app-surface-muted)]"
                          type="button"
                          onClick={() => {
                            setOpenSubdomains((prev) =>
                              prev.includes(subdomainTitle)
                                ? prev.filter((t) => t !== subdomainTitle)
                                : [...prev, subdomainTitle],
                            );
                          }}
                          aria-expanded={openSubdomains.includes(
                            subdomainTitle,
                          )}
                          aria-controls={`collapse-${safeId}`}
                        >
                          <span className="pr-4">{subdomainTitle}</span>
                          <span
                            className={`ms-auto h-6 w-6 shrink-0 transition-transform duration-200 ease-in-out flex items-center justify-center rounded-full  bg-gradient-to-t  ${openSubdomains.includes(subdomainTitle)
                              ? "rotate-[-180deg] from-[#1a3652] to-[#448bd2] text-white"
                              : "rotate-0 !text-[var(--primary-color)] from-[var(--light-primary-color)] to-[var(--light-primary-color)]"
                              }`}
                          >
                            <Icon icon="mdi:chevron-up" width="18" />
                          </span>
                        </button>
                      </h2>
                      <div
                        id={`collapse-${safeId}`}
                        className={`!visible ${openSubdomains.includes(subdomainTitle)
                          ? ""
                          : "hidden"
                          }`}
                        aria-labelledby={`heading-${safeId}`}
                      >
                        <Droppable droppableId={subdomainTitle}>
                          {(provided) => (
                            <div
                              className="px-4 text-sm sm:px-6 pb-6 pt-2"
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {questionsInGroup.length > 0 ? (
                                <div className="space-y-1">
                                  {questionsInGroup.map((q, qIdx) => (
                                    <Draggable
                                      key={q._id}
                                      draggableId={q._id}
                                      index={qIdx}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          className="flex justify-between items-start group bg-white p-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 dark:bg-[var(--app-surface)] dark:hover:bg-[var(--app-surface-muted)] dark:hover:border-[var(--app-border-color)]"
                                        >
                                          <div className="flex gap-3 pr-2 min-w-0">
                                            <span className="font-bold text-gray-800 text-sm whitespace-nowrap min-w-[24px] dark:text-[var(--app-heading-color)]">
                                              Q{qIdx + 1}.
                                            </span>
                                            <p className="text-gray-700 text-sm font-medium leading-relaxed break-words dark:text-[var(--app-text-muted)]">
                                              {q.questionStem}
                                            </p>
                                          </div>
                                          <div className="flex gap-3 lg:gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity whitespace-nowrap pt-1 lg:pt-0 self-start shrink-0">
                                            <button
                                              onClick={() => openEditModal(q)}
                                              className="text-blue-400 hover:text-blue-600 transition-colors p-1"
                                              title="Edit"
                                            >
                                              <Icon
                                                icon="lucide:pencil"
                                                width="16"
                                              />
                                            </button>
                                            <button
                                              onClick={() => openDeleteModal(q)}
                                              className="text-red-400 hover:text-red-600 transition-colors p-1"
                                              title="Delete"
                                            >
                                              <Icon
                                                icon="lucide:trash-2"
                                                width="16"
                                              />
                                            </button>
                                            <div
                                              {...provided.dragHandleProps}
                                              className="text-gray-400 hover:text-gray-600 cursor-grab p-1 dark:text-[#88a7c4] dark:hover:text-[#d6e8f8]"
                                              title="Drag to reorder"
                                            >
                                              <Icon
                                                icon="lucide:menu"
                                                width="16"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              ) : (
                                <div className="text-gray-400 text-sm italic py-2 pl-9 dark:text-[#88a7c4]">
                                  {filterRole
                                    ? "No questions added yet."
                                    : "Select a filter to view questions."}
                                </div>
                              )}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>
          ) : null}
        </div>
      </div>

      {/* --- MODALS (Add/Edit/Delete) --- */}
      <CrudModals
        // ADD FORM PROPS
        addForms={addForms}
        updateAddForm={updateAddForm}
        addMoreQuestion={addMoreQuestion}
        removeAddForm={removeAddForm}
        // EDIT FORM PROPS
        editFormData={editFormData}
        handleEditInputChange={handleEditInputChange}
        // ACTIONS
        handleCreate={handleCreate}
        handleUpdate={handleUpdate}
        confirmDelete={handleConfirmDelete}
        loading={loading}
        subdomainsGetter={getSubdomainsForForm}
      />
    </div>
  );
};

// -- SUBCOMPONENTS --
const FilterSection = ({
  title,
  children,
  open = false,
}: {
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(open);
  return (
    <div className="mb-4 border-b pb-2 last:border-0 border-gray-100 dark:border-[var(--app-border-color)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full font-semibold text-gray-700 text-sm mb-2 dark:text-[var(--app-text-muted)]"
      >
        {title}
        <Icon
          icon="mdi:chevron-down"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="pl-1 space-y-1">{children}</div>}
    </div>
  );
};

interface CrudModalsProps {
  addForms: QuestionFormData[];
  updateAddForm: (
    index: number,
    field: keyof QuestionFormData,
    value: string,
  ) => void;
  addMoreQuestion: () => void;
  removeAddForm: (index: number) => void;
  editFormData: QuestionFormData;
  handleEditInputChange: (e: { target: { id: string; value: string } }) => void;
  handleCreate: () => Promise<void>;
  handleUpdate: () => Promise<void>;
  confirmDelete: () => Promise<void>;
  loading: boolean;
  subdomainsGetter: (role: string, domain: string) => string[];
}

const CrudModals = (props: CrudModalsProps) => {
  const {
    addForms,
    updateAddForm,
    addMoreQuestion,
    removeAddForm,
    editFormData,
    handleEditInputChange,
    handleCreate,
    handleUpdate,
    confirmDelete,
    loading,
    subdomainsGetter,
  } = props;

  // Helper to render a SINGLE form (reusable for Add list)
  const renderFormFields = (
    data: QuestionFormData,
    onChange: ((e: { target: { id: string; value: string } }) => void) | null,
    isAddMode: boolean,
    index: number = 0,
  ) => {
    const isForcedChoice = data.scale === "FORCED_CHOICE";
    const subdomains = subdomainsGetter(data.role, data.domain);

    const onFieldChange = (field: keyof QuestionFormData, val: string) => {
      if (isAddMode) {
        updateAddForm(index, field, val);
      } else if (onChange) {
        // Mock event object for handleEditInputChange
        onChange({ target: { id: field, value: val } });
      }
    };

    return (
      <div className="grid gap-4">
        {/* Role */}
        <div>
          <label className="block font-bold text-sm text-gray-700">Role</label>
          <div className="w-full relative">
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
              value={data.role}
              onChange={(e) => onFieldChange("role", e.target.value)}
              className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
              disabled={isAddMode && index > 0} // Disable role for subsequent questions to enforce same stakeholder
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="leader">Leader</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>
        </div>
        {/* Domain */}
        <div>
          <label className="block font-bold text-sm text-gray-700">
            Domain
          </label>
          <div className="w-full relative">
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
              value={data.domain}
              onChange={(e) => onFieldChange("domain", e.target.value)}
              className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
            >
              <option value="">Select Domain</option>
              {DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Subdomain */}
        <div>
          <label className="block font-bold text-sm text-gray-700">
            Sub-Domain
          </label>
          <div className="w-full relative">
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
              value={data.subDomain}
              onChange={(e) => onFieldChange("subDomain", e.target.value)}
              className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
              disabled={!data.role || !data.domain}
            >
              <option value="">Select Sub-Domain</option>
              {subdomains.map((sd: string) => (
                <option key={sd} value={sd}>
                  {sd}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Type */}
        <div>
          <label className="block font-bold text-sm text-gray-700">Type</label>
          <div className="w-full relative">
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
              value={data.type}
              onChange={(e) => onFieldChange("type", e.target.value)}
              className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
            >
              <option value="">Select Type</option>
              {QUESTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Code */}
        <div>
          <label className="block font-bold text-sm text-gray-700">Code</label>
          <input
            type="text"
            value={isAddMode ? data.code : data.code}
            readOnly
            placeholder="Auto-generated"
            className="font-bold text-sm appearance-none text-[#1A3652] bg-gray-50 outline-none w-full p-3 mt-2 border rounded-lg border-[#E8E8E8] cursor-not-allowed dark:bg-[var(--app-surface-muted)] dark:border-[var(--app-border-color)] dark:text-[var(--app-text-color)]"
          />
        </div>
        {/* Scale */}
        <div>
          <label className="block font-bold text-sm text-gray-700">Scale</label>
          <div className="w-full relative">
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
              value={data.scale}
              onChange={(e) => onFieldChange("scale", e.target.value)}
              className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
            >
              <option value="">Select Scale</option>
              {SCALES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Question */}
        <div className="col-span-1">
          <label className="block font-bold text-sm text-gray-700">
            Question
          </label>
          <input
            type="text"
            value={data.question}
            onChange={(e) => onFieldChange("question", e.target.value)}
            placeholder="Enter question stem"
            className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
          />
        </div>

        {/* Conditional Fields based on Scale */}
        {!isForcedChoice ? (
          <div className="col-span-1">
            <label className="block font-bold text-sm text-gray-700">
              Insight Prompt
            </label>
            <input
              type="text"
              value={data.prompt}
              onChange={(e) => onFieldChange("prompt", e.target.value)}
              placeholder="Enter insight hint"
              className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
            />
          </div>
        ) : (
          <div className="space-y-3 bg-gray-50 p-3 rounded-lg border">
            <p className="font-bold text-xs uppercase text-gray-500">
              Forced Choice Options
            </p>
            {/* Option A */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold">Option A Label</label>
                <input
                  type="text"
                  value={data.optionALabel}
                  onChange={(e) =>
                    onFieldChange("optionALabel", e.target.value)
                  }
                  className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-2 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
                />
              </div>
              <div>
                <label className="text-xs font-bold">Option A Prompt</label>
                <input
                  type="text"
                  value={data.optionAPrompt}
                  onChange={(e) =>
                    onFieldChange("optionAPrompt", e.target.value)
                  }
                  className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-2 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
                />
              </div>
            </div>
            {/* Option B */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold">Option B Label</label>
                <input
                  type="text"
                  value={data.optionBLabel}
                  onChange={(e) =>
                    onFieldChange("optionBLabel", e.target.value)
                  }
                  className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-2 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
                />
              </div>
              <div>
                <label className="text-xs font-bold">Option B Prompt</label>
                <input
                  type="text"
                  value={data.optionBPrompt}
                  onChange={(e) =>
                    onFieldChange("optionBPrompt", e.target.value)
                  }
                  className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-2 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
                />
              </div>
            </div>
            {/* Higher Value */}
            <div>
              <label className="text-xs font-bold">Higher Value Option</label>
              <select
                value={data.higherValueOption}
                onChange={(e) =>
                  onFieldChange("higherValueOption", e.target.value)
                }
                className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-1.5 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
              >
                <option value="A">Option A</option>
                <option value="B">Option B</option>
              </select>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Add Modal */}
      <div
        data-twe-modal-init
        className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="addModal"
        tabIndex={-1}
        aria-hidden="true"
        data-twe-backdrop="static"
      >
        <div
          data-twe-modal-dialog-ref
          className="pointer-events-none relative flex min-h-full w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-3xl mx-auto"
        >
          <div className="pointer-events-auto relative flex w-full flex-col rounded-xl border-none bg-white bg-clip-padding text-current shadow-lg outline-none max-h-[90vh] overflow-hidden">
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 sm:pb-0 pb-2">
              <h5 className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold">
                Create New Question
              </h5>
              <button
                type="button"
                data-twe-modal-dismiss
                aria-label="Close"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
              >
                <Icon icon="material-symbols:close" width="24" />
              </button>
            </div>
            <div className="relative sm:py-8 py-4 px-4 max-h-[calc(100vh-100px)] overflow-y-scroll">
              {addForms.map((form: QuestionFormData, index: number) => (
                <div key={index} className="mb-4 last:mb-0 relative group">
                  {index > 0 && (
                    <div className="flex justify-between items-center mb-5 border-b pb-2 mt-10">
                      <span className="text-sm font-bold text-gray-500 uppercase">
                        Question {index + 1}
                      </span>
                      <button
                        onClick={() => removeAddForm(index)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Icon icon="lucide:trash-2" width="16" />
                      </button>
                    </div>
                  )}
                  {renderFormFields(form, null, true, index)}
                </div>
              ))}

              <button
                onClick={addMoreQuestion}
                className="mt-4 py-2 rounded-lg text-blue-400 hover:text-blue-500 font-bold text-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Icon icon="material-symbols:add" width="18" />
                Add More Question
              </button>
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
                type="button"
                onClick={handleCreate}
                disabled={loading}
                className="group relative overflow-hidden z-0 text-[var(--white-color)] px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal - Unchanged */}
      <div
        data-twe-modal-init
        className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="deleteModal"
        tabIndex={-1}
        aria-hidden="true"
        data-twe-backdrop="static"
      >
        <div
          data-twe-modal-dialog-ref
          className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-xl mx-auto"
        >
          <div className="mx-3 pointer-events-auto relative flex max-w-xl w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none">
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 sm:pb-0 pb-2">
              <h5
                className="sm:text-xl text-lg text-[var(--secondary-color)] invisible font-bold"
                id="deleteModalTitle"
              >
                Delete
              </h5>
              <button
                type="button"
                data-twe-modal-dismiss
                className="text-neutral-500 hover:text-neutral-800"
              >
                <Icon icon="material-symbols:close" width="24" />
              </button>
            </div>

            <div className="relative sm:py-8 py-4 px-4 grid place-items-center gap-4">
              <img src={ProgressIcon} alt="Progress Icon" width={80} />
              <div className="text-center">
                <h5 className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold">
                  Are you sure to delete the question?
                </h5>
                <p className="text-sm text-neutral-600">
                  This action is permanent and the data cannot be retrieved.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 py-4 px-4">
              <button
                type="button"
                data-twe-modal-dismiss
                className="group text-[var(--primary-color)] px-5 py-2 h-10 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase relative overflow-hidden z-0 duration-200 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/10 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="group relative overflow-hidden z-0 bg-red-500 px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase text-white duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-white/15 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal (Single) */}
      <div
        data-twe-modal-init
        className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="editModal"
        tabIndex={-1}
        aria-hidden="true"
        data-twe-backdrop="static"
      >
        <div
          data-twe-modal-dialog-ref
          className="pointer-events-none relative flex min-h-full w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-3xl mx-auto"
        >
          <div className="pointer-events-auto relative flex w-full flex-col rounded-xl border-none bg-white bg-clip-padding text-current shadow-lg outline-none max-h-[90vh] overflow-hidden">
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 sm:pb-0 pb-2">
              <h5 className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold">
                Edit Question
              </h5>
              <button
                type="button"
                data-twe-modal-dismiss
                aria-label="Close"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
              >
                <Icon icon="material-symbols:close" width="24" />
              </button>
            </div>
            <div className="relative sm:py-8 py-4 px-4 max-h-[calc(100vh-100px)] overflow-y-scroll">
              <form className="grid gap-4">
                {renderFormFields(editFormData, handleEditInputChange, false)}
              </form>
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
                type="button"
                onClick={handleUpdate}
                disabled={loading}
                className="group relative overflow-hidden z-0 text-[var(--white-color)] px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CrudQuestion;
