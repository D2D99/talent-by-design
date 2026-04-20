/// <reference types="vite/client" />
import { useEffect, useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { Collapse, Tab, Modal, Ripple, initTWE } from "tw-elements";
import type { DropResult } from "@hello-pangea/dnd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { questionService } from "../../services/questionService";
import { organizationService } from "../../services/organizationService";
import { useAuth } from "../../context/useAuth";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const ProgressIcon = "/static/img/home/progress-icon.png";
// import Logo from "../../../public/static/img/POD-logo.svg";

import type {
  Question,
  CreateQuestionData,
} from "../../services/questionService";

// ------ CONSTANTS ------
const ROLE_DOMAIN_SUBDOMAINS: Record<string, Record<string, string[]>> = {
  leader: {
    "People Potential": [
      "Psychological Health & Safety",
      "Mindset & Adaptability",
      "Relational & Emotional Intelligence",
    ],
    "Operational Steadiness": [
      "Prioritization",
      "Workflow Clarity",
      "Effective Resource Management",
    ],
    "Digital Fluency": [
      "Data, AI & Automation Readiness",
      "Digital Communication & Collaboration",
      "Mindset, Confidence and Change Readiness",
      "Tool & System Proficiency",
    ],
  },

  manager: {
    "People Potential": [
      "Mindset & Adaptability",
      "Psychological Health & Safety",
      "Relational & Emotional Intelligence",
    ],
    "Operational Steadiness": [
      "Prioritization",
      "Workflow Clarity",
      "Effective Resource Management",
    ],
    "Digital Fluency": [
      "Data, AI & Automation Readiness",
      "Digital Communication & Collaboration",
      "Mindset, Confidence and Change Readiness",
      "Tool & System Proficiency",
    ],
  },

  employee: {
    "People Potential": [
      "Mindset & Adaptability",
      "Psychological Health & Safety",
      "Relational & Emotional Intelligence",
    ],
    "Operational Steadiness": [
      "Prioritization",
      "Workflow Clarity",
      "Effective Resource Management",
    ],
    "Digital Fluency": [
      "Data, AI & Automation Readiness",
      "Digital Communication & Collaboration",
      "Mindset, Confidence and Change Readiness",
      "Tool & System Proficiency",
    ],
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

const TYPE_TO_SCALE: Record<string, string> = {
  "Self-Rating": "SCALE_1_5",
  Calibration: "SCALE_1_5",
  Behavioural: "NEVER_ALWAYS",
  "Forced-Choice": "FORCED_CHOICE",
};

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
  "Digital Fluency": "DF",
};

const stakeholderPrefix: Record<string, string> = {
  leader: "L",
  manager: "M",
  employee: "E",
};

const typeSuffix: Record<string, string> = {
  Calibration: "CAL",
  Behavioural: "B",
  "Forced-Choice": "FC",
  "Self-Rating": "",
};

const getAbbreviation = (text: string) => {
  if (!text) return "";
  return text
    .split(/[\s&/-]+/)
    .filter(
      (word) =>
        word.length > 0 &&
        !["and", "the", "with", "or"].includes(word.toLowerCase()),
    )
    .map((word) => word[0].toUpperCase())
    .join("");
};

const getGeneratedCodePreview = (
  data: QuestionFormData,
  allQuestions: Question[],
  currentBatch: QuestionFormData[] = [],
  currentIndex: number = -1,
) => {
  if (!data.role || !data.domain || !data.subDomain || !data.type)
    return "Auto-generated";
  const dAbbr = domainAbbr[data.domain] || getAbbreviation(data.domain);
  const sAbbr = getAbbreviation(data.subDomain);
  const rolePref =
    stakeholderPrefix[data.role.toLowerCase()] || data.role[0].toUpperCase();
  const tSuff = typeSuffix[data.type] || "";

  const prefix = `${dAbbr}-${sAbbr}-${rolePref}${tSuff}`;

  // 1. Find max number in already existing questions (DB)
  const regex = new RegExp(`^${prefix}(\\d+)$`);
  let maxNum = 0;

  allQuestions.forEach((q) => {
    const match = q.questionCode?.match(regex);
    if (match) {
      const num = parseInt(match[1]);
      if (num > maxNum) maxNum = num;
    }
  });

  // 2. Account for questions in the current "Add" list that come BEFORE this one
  let batchIncrement = 0;
  if (currentBatch.length > 0 && currentIndex !== -1) {
    for (let i = 0; i < currentIndex; i++) {
      const other = currentBatch[i];
      if (
        other.role === data.role &&
        other.domain === data.domain &&
        other.subDomain === data.subDomain &&
        other.type === data.type
      ) {
        batchIncrement++;
      }
    }
  }

  return `${prefix}${maxNum + batchIncrement + 1}`;
};

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
    <div className="border-b border-gray-100/50 last:border-0 pb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full group/head pt-2 focus:outline-none"
      >
        <span className="text-xs font-black text-[#1A3652] uppercase tracking-[0.2em]">
          {title}
        </span>
        <Icon
          icon="iconoir:nav-arrow-down"
          className={`transition-transform duration-500 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="16"
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const CrudQuestion = () => {
  const { user } = useAuth();
  // const isAdmin = user?.role === "admin";
  const isSuperAdmin = user?.role === "superAdmin";

  // 1. STATE MANAGEMENT
  const [allQuestions, setAllQuestions] = useState<Question[]>([]); // Store all fetched questions
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null); // null means Master Template
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("All"); // 'All' means no department filter

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const [isCloningAll, setIsCloningAll] = useState(false);
  const [isOverrideForUpload, setIsOverrideForUpload] = useState(false);
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
  const [openSubdomains, setOpenSubdomains] = useState<string[]>([]);

  // -- Filter State --
  // -- Filter State (PERSISTENT) --
  const [showFilters, setShowFilters] = useState(() =>
    JSON.parse(localStorage.getItem("crud_showFilters") || "false"),
  );
  const [filterRole, setFilterRole] = useState("");

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

  // -- Validation Logic --
  const isFormValid = (form: QuestionFormData) => {
    // Common required fields
    if (
      !form.role ||
      !form.domain ||
      !form.subDomain ||
      !form.type ||
      !form.question ||
      !form.scale
    )
      return false;

    // Scale specific validation
    if (form.scale === "FORCED_CHOICE") {
      return (
        !!form.optionALabel &&
        !!form.optionAPrompt &&
        !!form.optionBLabel &&
        !!form.optionBPrompt
      );
    } else {
      return !!form.prompt;
    }
  };

  const isAddBatchValid = useMemo(() => {
    return addForms.every(isFormValid);
  }, [addForms]);

  const isEditValid = useMemo(() => {
    return isFormValid(editFormData);
  }, [editFormData]);

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

  const handleTypeFilterChange = (type: string) => {
    const isCurrentlySelected = filterTypes.includes(type);
    const targetScale = TYPE_TO_SCALE[type];

    // Update Types
    setFilterTypes((prev) =>
      isCurrentlySelected ? prev.filter((t) => t !== type) : [...prev, type],
    );

    // Update Scales
    if (targetScale) {
      if (isCurrentlySelected) {
        // If deselecting, only remove scale filter if no OTHER selected types use it
        const otherTypesUsingScale = filterTypes.some(
          (t) => t !== type && TYPE_TO_SCALE[t] === targetScale,
        );
        if (!otherTypesUsingScale) {
          setFilterScales((prev) => prev.filter((s) => s !== targetScale));
        }
      } else {
        // If selecting, add scale filter if not already there
        setFilterScales((prev) =>
          prev.includes(targetScale) ? prev : [...prev, targetScale],
        );
      }
    }
  };

  const handleScaleFilterChange = (scale: string) => {
    const isCurrentlySelected = filterScales.includes(scale);

    // Update Scales
    setFilterScales((prev) =>
      isCurrentlySelected ? prev.filter((s) => s !== scale) : [...prev, scale],
    );

    // Update Types
    const associatedTypes = QUESTION_TYPES.filter(
      (t) => TYPE_TO_SCALE[t] === scale,
    );

    if (isCurrentlySelected) {
      // If deselecting scale, remove all its associated types
      setFilterTypes((prev) =>
        prev.filter((t) => !associatedTypes.includes(t)),
      );
    } else {
      // If selecting scale, add its associated types
      setFilterTypes((prev) => {
        const nextTypes = [...prev];
        associatedTypes.forEach((t) => {
          if (!nextTypes.includes(t)) nextTypes.push(t);
        });
        return nextTypes;
      });
    }
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
      const data = await questionService.getAllQuestions({
        orgName: selectedOrg,
        department: selectedDept === "All" ? null : selectedDept,
      });
      setAllQuestions(data);
    } catch (err) {
      // Optional: Don't show global error if not critical
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (
    e?: React.ChangeEvent<HTMLInputElement>,
    isForced = false,
  ) => {
    const file = e ? e.target.files?.[0] : pendingUploadFile;
    if (!file || !selectedOrg) return;

    setUploading(true);
    try {
      if (isForced) {
        // Delete first to ensure clean state if forcing
        await questionService.deleteOrganizationQuestions(
          selectedOrg,
          selectedDept === "All" ? null : selectedDept,
        );
      }
      await questionService.uploadQuestions(
        file,
        selectedOrg,
        selectedDept === "All" ? null : selectedDept,
        isForced,
      );
      toast.success("Questions uploaded successfully");
      Modal.getInstance(
        document.getElementById("overrideModal") as HTMLElement,
      )?.hide();
      setPendingUploadFile(null);
      fetchQuestions();
    } catch (err: any) {
      if (err?.response?.data?.isCollision) {
        setPendingUploadFile(file);
        setIsOverrideForUpload(true);
        setIsCloningAll(selectedDept === "All");
        Modal.getOrCreateInstance(
          document.getElementById("overrideModal") as HTMLElement,
        ).show();
      } else {
        toast.error(err?.response?.data?.message || "Upload failed");
      }
    } finally {
      setUploading(false);
      if (e?.target) e.target.value = "";
    }
  };

  const confirmOverrideAction = () => {
    Modal.getInstance(
      document.getElementById("overrideModal") as HTMLElement,
    )?.hide();
    if (isOverrideForUpload) {
      handleUpload(undefined, true);
    } else {
      handleCloneWithOverride();
    }
  };

  const handleDeleteAll = () => {
    const modal = Modal.getOrCreateInstance(
      document.getElementById("deleteAllModal") as HTMLElement,
    );
    modal.show();
  };

  const confirmDeleteAll = async () => {
    const modal = Modal.getInstance(
      document.getElementById("deleteAllModal") as HTMLElement,
    );
    modal?.hide();
    setLoading(true);
    try {
      await questionService.deleteOrganizationQuestions(
        selectedOrg,
        selectedDept === "All" ? null : selectedDept,
      );
      toast.success("All questions deleted successfully!");
      fetchQuestions();
    } catch (err) {
      toast.error("Failed to delete questions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloneTemplate = async () => {
    if (!selectedOrg) return;
    setIsCloningAll(false);
    setIsOverrideForUpload(false);
    try {
      const result = await questionService.cloneTemplate(
        selectedOrg,
        selectedDept === "All" ? null : selectedDept,
        false,
      );
      toast.success(result.message);
      fetchQuestions();
    } catch (err: any) {
      if (err?.response?.data?.isCollision) {
        Modal.getOrCreateInstance(
          document.getElementById("overrideModal") as HTMLElement,
        ).show();
      } else {
        toast.error(err?.response?.data?.message || "Failed to clone template");
      }
    }
  };

  const handleCloneToAllDepartments = async () => {
    if (!selectedOrg) return;
    setIsCloningAll(true);
    setIsOverrideForUpload(false);
    try {
      const result = await questionService.cloneTemplate(
        selectedOrg,
        null,
        true,
      );
      toast.success(result.message);
      fetchQuestions();
    } catch (err: any) {
      if (err?.response?.data?.isCollision) {
        Modal.getOrCreateInstance(
          document.getElementById("overrideModal") as HTMLElement,
        ).show();
      } else {
        toast.error(err?.response?.data?.message || "Failed to clone template");
      }
    }
  };

  const handleCloneWithOverride = async () => {
    if (!selectedOrg) return;
    Modal.getInstance(
      document.getElementById("overrideModal") as HTMLElement,
    )?.hide();
    setLoading(true);
    try {
      if (isCloningAll) {
        // Delete all for org then clone all
        await questionService.deleteOrganizationQuestions(selectedOrg, "All");
        const result = await questionService.cloneTemplate(
          selectedOrg,
          null,
          true,
        );
        toast.success(`Full override complete. ${result.message}`);
      } else {
        const target = selectedDept === "All" ? null : selectedDept;
        await questionService.deleteOrganizationQuestions(selectedOrg, target);
        const result = await questionService.cloneTemplate(
          selectedOrg,
          target,
          false,
        );
        toast.success(`Override complete. ${result.message}`);
      }
      fetchQuestions();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to override clone");
    } finally {
      setLoading(false);
      setIsCloningAll(false);
    }
  };

  const handleDownloadExcel = (roleOverride?: string) => {
    const role = roleOverride ?? downloadRole;
    try {
      const getRowData = (q: Question, i: number) => {
        const row: any = {
          "#": i + 1,
          stakeholder: q.stakeholder || "",
          domain: q.domain || "",
          subdomain: q.subdomain || "",
          questionCode: q.questionCode || "",
          questionType: q.questionType || "",
          scale: q.scale || "",
          questionStem: q.questionStem || "",
          insightPrompt: q.insightPrompt || "",
          subdomainWeight: q.subdomainWeight ?? "",
          order: q.order ?? "",
        };

        if (q.forcedChoice) {
          row["fc_optionA_label"] = q.forcedChoice.optionA?.label || "";
          row["fc_optionA_insightPrompt"] =
            q.forcedChoice.optionA?.insightPrompt || "";
          row["fc_optionB_label"] = q.forcedChoice.optionB?.label || "";
          row["fc_optionB_insightPrompt"] =
            q.forcedChoice.optionB?.insightPrompt || "";
          row["fc_higherValueOption"] = q.forcedChoice.higherValueOption || "";
        } else {
          row["fc_optionA_label"] = "";
          row["fc_optionA_insightPrompt"] = "";
          row["fc_optionB_label"] = "";
          row["fc_optionB_insightPrompt"] = "";
          row["fc_higherValueOption"] = "";
        }
        return row;
      };

      const wb = XLSX.utils.book_new();

      // Helper to style sheet
      const styleSheet = (ws: XLSX.WorkSheet) => {
        ws["!cols"] = [
          { wch: 4 }, // #
          { wch: 11 }, // stakeholder
          { wch: 22 }, // domain
          { wch: 35 }, // subdomain
          { wch: 16 }, // questionCode
          { wch: 14 }, // questionType
          { wch: 14 }, // scale
          { wch: 80 }, // questionStem
          { wch: 80 }, // insightPrompt
          { wch: 16 }, // subdomainWeight
          { wch: 6 }, // order
          { wch: 50 }, // fc_optionA_label
          { wch: 60 }, // fc_optionA_insightPrompt
          { wch: 50 }, // fc_optionB_label
          { wch: 60 }, // fc_optionB_insightPrompt
          { wch: 20 }, // fc_higherValueOption
        ];
      };

      if (role) {
        // Download for a specific role only
        const filtered = allQuestions.filter(
          (q) => q.stakeholder?.toLowerCase() === role.toLowerCase(),
        );
        if (filtered.length === 0) {
          toast.info(`No questions found for role: ${role}`);
          return;
        }
        const roleRows = filtered.map((q, i) => getRowData(q, i));
        const ws = XLSX.utils.json_to_sheet(roleRows);
        styleSheet(ws);
        const sheetName = role.charAt(0).toUpperCase() + role.slice(1);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        XLSX.writeFile(wb, `Master_Template_Questions_${sheetName}.xlsx`);
        toast.success(`Excel file for ${sheetName} generated!`);
      } else {
        // All questions in separate sheets
        const allRows = allQuestions.map((q, i) => getRowData(q, i));
        const wsAll = XLSX.utils.json_to_sheet(allRows);
        styleSheet(wsAll);
        XLSX.utils.book_append_sheet(wb, wsAll, "All Questions");

        const stakeholders = ["employee", "manager", "leader"];
        stakeholders.forEach((r) => {
          const filtered = allQuestions.filter(
            (q) => q.stakeholder?.toLowerCase() === r,
          );
          if (filtered.length > 0) {
            const roleRows = filtered.map((q, i) => getRowData(q, i));
            const ws = XLSX.utils.json_to_sheet(roleRows);
            styleSheet(ws);
            const sheetName = r.charAt(0).toUpperCase() + r.slice(1);
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
          }
        });
        XLSX.writeFile(wb, "Master_Template_Questions.xlsx");
        toast.success("Excel file with multiple tabs generated!");
      }
      setDownloadRoleModal(false);
      setDownloadRole("");
    } catch (err) {
      console.error("Failed to generate Excel:", err);
      toast.error("Failed to generate Excel file.");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedOrg, selectedDept]);

  // Fetch organizations for SuperAdmin
  useEffect(() => {
    if (isSuperAdmin) {
      organizationService
        .getAllOrganizations()
        .then(setOrganizations)
        .catch(console.error);
    } else if (user?.orgName) {
      // For regular admins, lock the selection to their own org
      setSelectedOrg(user.orgName);
    }
  }, [isSuperAdmin, user?.orgName]);

  // Fetch departments when org changes
  useEffect(() => {
    if (selectedOrg) {
      organizationService
        .getDepartments(selectedOrg)
        .then((depts) => {
          setDepartments(depts);
          // Only reset to 'All' if the current selectedDept is not in the new depts
          // OR if we are just switching orgs.
          setSelectedDept("All");
        })
        .catch(console.error);
    } else {
      setDepartments([]);
      setSelectedDept("All");
    }
  }, [selectedOrg]);

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
    initialData.code = getGeneratedCodePreview(
      initialData,
      allQuestions,
      [initialData],
      0,
    );
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

  const openPreviewModal = () => {
    // Always open the modal — it will show role picker first
    const modalElement = document.getElementById("previewModal");
    if (modalElement) {
      Modal.getOrCreateInstance(modalElement).show();
    }
  };

  const [downloadRoleModal, setDownloadRoleModal] = useState(false);
  const [downloadRole, setDownloadRole] = useState<string>("");

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
        // Update previews for EVERYTHING because changing one index can shift numbers for all subsequent ones
        for (let i = 0; i < newList.length; i++) {
          newList[i].code = getGeneratedCodePreview(
            newList[i],
            allQuestions,
            newList,
            i,
          );
        }
      }

      // Cascading Logic: Use Requirement "if role is select then it will be fix in the next queeiotsn also"
      // AND Backend Requirement: "All questions must belong to the same stakeholder"
      // Implementation: If we change the Role of the FIRST question (index 0), we update ALL questions.
      if (index === 0 && field === "role") {
        for (let i = 1; i < newList.length; i++) {
          newList[i] = {
            ...newList[i],
            role: value,
            code: getGeneratedCodePreview(
              { ...newList[i], role: value },
              allQuestions,
              newList,
              i,
            ),
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

      const newList = [...prev, newItem];
      // Re-calculate ALL codes in the batch to be safe
      for (let i = 0; i < newList.length; i++) {
        newList[i].code = getGeneratedCodePreview(
          newList[i],
          allQuestions,
          newList,
          i,
        );
      }
      return newList;
    });
  };

  const removeAddForm = (index: number) => {
    if (addForms.length <= 1) return;
    setAddForms((prev: QuestionFormData[]) => {
      const filtered = prev.filter((_, i) => i !== index);
      // Re-calculate codes for the remaining items
      for (let i = 0; i < filtered.length; i++) {
        filtered[i].code = getGeneratedCodePreview(
          filtered[i],
          allQuestions,
          filtered,
          i,
        );
      }
      return filtered;
    });
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

      await questionService.createQuestions(payload, selectedOrg);
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
        ...editFormData, // Use spread for convenience if structure matches
        questionType: editFormData.type,
        questionStem: editFormData.question,
        scale: editFormData.scale,
        orgName: selectedOrg,
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
      await questionService.deleteQuestion(selectedQuestion._id, selectedOrg);
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

  const handleOnDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (
      source.droppableId !== destination.droppableId ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return;

    // 1. Update State Locally First (Optimistic UI)
    let updatedBatch: Question[] = [];

    setAllQuestions((prev: Question[]) => {
      const newQuestions = [...prev];

      // Find the question being dragged
      const draggedIdx = newQuestions.findIndex((q) => q._id === draggableId);
      if (draggedIdx === -1) return prev;

      const [draggedItem] = newQuestions.splice(draggedIdx, 1);

      // Update its subdomain if it moved to a different droppable
      if (source.droppableId !== destination.droppableId) {
        draggedItem.subdomain = destination.droppableId;
      }

      const targetGroup = newQuestions.filter((q) => {
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
        return q.subdomain === destination.droppableId;
      });

      let insertionIdx;
      if (targetGroup.length === 0) {
        insertionIdx = newQuestions.length;
      } else if (destination.index >= targetGroup.length) {
        const lastQuestionIdx = newQuestions.lastIndexOf(
          targetGroup[targetGroup.length - 1],
        );
        insertionIdx = lastQuestionIdx + 1;
      } else {
        const targetRefQuestion = targetGroup[destination.index];
        insertionIdx = newQuestions.indexOf(targetRefQuestion);
      }

      newQuestions.splice(insertionIdx, 0, draggedItem);
      updatedBatch = newQuestions;
      return newQuestions;
    });

    // 2. Persist to Backend
    try {
      // We only reorder questions for the CURRENT stakeholder to keep it clean
      // The local 'updatedBatch' now has the correct sequence
      const stakeholderQuestions = updatedBatch.filter(
        (q) => q.stakeholder === filterRole,
      );

      const updates = stakeholderQuestions.map((q, idx) => ({
        id: q._id,
        order: idx + 1,
        subdomain: q.subdomain, // Also sync subdomain in case it changed
      }));

      await questionService.reorderQuestions(updates, selectedOrg);
      // toast.success("Order saved");
    } catch (err) {
      console.error("Failed to persist reorder:", err);
      toast.error("Failed to save new order. Please refresh.");
      fetchQuestions(); // Sync back from server on failure
    }
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
        <div className="w-full md:w-96 bg-white shadow-[0_0_5px_rgba(68,140,210,0.5)] md:rounded-xl py-5 flex-shrink-0 z-[55] md:absolute fixed md:top-40 md:right-36 top-1/2 right-0 md:translate-y-0 -translate-y-1/2 md:h-auto h-full">
          <div className="flex justify-between items-center mb-6 px-5">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-lg text-gray-800">Filters</h3>
              <button
                onClick={resetFilters}
                className="text-[10px] font-bold text-blue-500 hover:text-blue-700 uppercase tracking-tighter bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 transition-colors"
              >
                Reset
              </button>
            </div>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon icon="material-symbols:close" width="22" />
            </button>
          </div>

          <div className="md:max-h-[500px] max-h-[calc(100vh-80px)] overflow-y-auto px-5">
            {/* Role Filter */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">
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
                  className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-2 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
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
                    className="accent-blue-500 text-blue-600 focus:ring-blue-500 rounded-full"
                  />
                  <span className="text-sm text-gray-700">{d}</span>
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
                      className="rounded text-blue-600 accent-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 truncate" title={sd}>
                      {sd}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-xs text-gray-400">
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
                    onChange={() => handleTypeFilterChange(t)}
                    className="rounded text-blue-600 accent-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{t}</span>
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
                    onChange={() => handleScaleFilterChange(s)}
                    className="rounded text-blue-600 accent-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 lowercase">
                    {s.replace("_", " ")}
                  </span>
                </label>
              ))}
            </FilterSection>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 w-full bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] min-h-[calc(100vh-162px)]">
        {/* --- ORGANIZATION BANNER --- */}
        <div className="mb-8">
          <div className="bg-blue-500/5 border border-gray-100 rounded-2xl p-6 lg:p-8">
            <div className="flex flex-col xxl:flex-row items-stretch gap-8">
              <div className="flex flex-col gap-4 sm:min-w-[300px]">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="solar:buildings-2-broken"
                    width="24"
                    height="24"
                  />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Organization
                    </p>
                    <h3 className="text-base capitalize font-bold text-gray-800">
                      {selectedOrg || "Global Master Template"}
                    </h3>
                  </div>
                </div>

                {/* Organization Selector (SuperAdmin Only) */}
                {isSuperAdmin && (
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
                      value={selectedOrg || ""}
                      onChange={(e) => setSelectedOrg(e.target.value || null)}
                      className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] bg-white"
                    >
                      <option value="">Global Master Template</option>
                      {organizations.map((org) => (
                        <option key={org} value={org}>
                          {org}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Department Dropdown (Everyone if Org selected) */}
                {selectedOrg && (
                  <div className="relative w-full">
                    {/* <div className="flex items-center gap-1.5 mb-1 px-1">
                      <Icon icon="solar:folder-2-broken" width="14" className="text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Department</span>
                    </div> */}

                    <label
                      htmlFor="deptSelect"
                      className="font-bold text-[var(--secondary-color)] text-sm cursor-pointer"
                    >
                      Department
                    </label>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-1 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] bg-white"
                        id="deptSelect"
                      >
                        <option value="All">All Departments</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              {isSuperAdmin && (
                <div className="hidden xxl:block w-px bg-gray-100" />
              )}

              {/* Action Area */}
              <div className="flex-1 flex flex-col justify-center">
                {!loading && selectedOrg && allQuestions.length === 0 ? (
                  <div className="flex flex-col md:flex-row gap-5">
                    <div className="flex flex-col gap-3 flex-1">
                      {selectedDept === "All" ? (
                        /* Unified Organizational Clone */
                        <button
                          onClick={handleCloneToAllDepartments}
                          disabled={loading}
                          className="group flex-1 flex items-start gap-4 p-6 rounded-2xl bg-blue-50/50 border border-blue-100/60 transition-all duration-300 hover:bg-blue-100 hover:border-blue-200 hover:shadow-md text-left bg-white sm:flex-row flex-col cursor-pointer"
                        >
                          <div className="w-11 h-11 rounded-xl bg-[var(--primary-color)] flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                            {/* <Icon icon="lucide:copy-plus" width="20" /> */}

                            <Icon icon="prime:clone" width="24" height="24" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-800 mb-1">
                              Clone to Everyone
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              Copy master template to{" "}
                              <strong>all departments</strong> and global pool
                              in {selectedOrg}.
                            </p>
                          </div>
                        </button>
                      ) : (
                        /* Targeted Department Clone */
                        <button
                          onClick={handleCloneTemplate}
                          disabled={loading}
                          className="group flex-1 flex items-start gap-4 p-6 rounded-2xl bg-blue-50/50 border border-blue-100/60 transition-all duration-300 hover:bg-blue-100 hover:border-blue-200 hover:shadow-md text-left bg-white sm:flex-row flex-col cursor-pointer"
                        >
                          <div className="w-11 h-11 rounded-xl bg-[var(--primary-color)] flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                            {/* <Icon icon="lucide:copy" width="20" /> */}
                            <Icon icon="prime:clone" width="24" height="24" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-800 mb-1">
                              Clone to {selectedDept}
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              Copy master questions specifically for the{" "}
                              <strong>{selectedDept}</strong> department of{" "}
                              {selectedOrg}.
                            </p>
                          </div>
                        </button>
                      )}
                    </div>

                    {/* Upload Card */}
                    <label className="group flex-1 flex items-start gap-4 p-6 rounded-2xl bg-neutral-50 border border-gray-100 transition-all duration-300 hover:bg-white hover:border-gray-200 sm:flex-row flex-col hover:shadow-md cursor-pointer">
                      <div className="w-11 h-11 rounded-xl bg-gray-800 flex items-center justify-center text-white flex-shrink-0 cursor-pointer group-hover:scale-105 transition-transform">
                        <Icon icon="lucide:upload" width="20" />
                        <input
                          type="file"
                          accept=".xlsx, .xls"
                          onChange={handleUpload}
                          className="hidden absolute inset-0"
                          disabled={uploading}
                        />
                      </div>
                      <div className="flex-1 min-w-full sm:min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-gray-800">
                            Upload Excel
                          </h4>
                          <a
                            href="https://res.cloudinary.com/dfpkn8g8h/raw/upload/v1773636647/Question_Upload_Template_zmqwjp.xlsx"
                            className="text-[10px] text-blue-500 hover:text-blue-700 font-medium transition-colors underline"
                          >
                            Get Template
                          </a>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Import questions from a spreadsheet file.
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border bg-white ${selectedOrg ? "bg-green-100 border-green-600/25 text-green-600" : "text-blue-600 border-blue-600/25"}`}
                      >
                        <Icon
                          icon={
                            selectedOrg
                              ? "lucide:check-circle-2"
                              : "lucide:globe"
                          }
                          width="20"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {selectedOrg || "Master Template"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {allQuestions.length} question
                          {allQuestions.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!selectedOrg && (
                        <>
                          <button
                            onClick={openPreviewModal}
                            className="group relative overflow-hidden z-0 border-[var(--primary-color)] border px-2.5 py-2 rounded-full flex justify-center items-center gap-1.5 font-semibold uppercase text-white duration-200 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#fff]/10 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10 text-xs bg-[var(--primary-color)]"
                          >
                            <Icon icon="gg:eye" width="14" height="14" />
                            Preview
                          </button>

                          <button
                            onClick={() => setDownloadRoleModal(true)}
                            className="group relative overflow-hidden z-0 border-[var(--primary-color)] border px-2.5 py-2 rounded-full flex justify-center items-center gap-1.5 font-semibold uppercase text-[var(--primary-color)] duration-200 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/10 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10 text-xs bg-white"
                          >
                            <Icon icon="lucide:download" width="14" />
                            Download Excel
                          </button>
                        </>
                      )}

                      {/* Download Role Picker Modal (inline, not twe) */}
                      {downloadRoleModal && (
                        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 relative">
                            <button
                              onClick={() => {
                                setDownloadRoleModal(false);
                                setDownloadRole("");
                              }}
                              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                            >
                              <Icon icon="material-symbols:close" width="22" />
                            </button>
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[var(--primary-color)]">
                                <Icon icon="lucide:download" width="20" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-800 text-lg">
                                  Download Excel
                                </h4>
                                <p className="text-xs text-gray-400">
                                  Select a role to export
                                </p>
                              </div>
                            </div>
                            <div className="space-y-3 mb-6">
                              {["", "employee", "manager", "leader"].map(
                                (r) => (
                                  <label
                                    key={r || "all"}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                      downloadRole === r
                                        ? "border-[var(--primary-color)] bg-blue-50"
                                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name="downloadRole"
                                      value={r}
                                      checked={downloadRole === r}
                                      onChange={() => setDownloadRole(r)}
                                      className="accent-blue-500"
                                    />
                                    <span className="font-semibold text-sm text-gray-700 capitalize">
                                      {r === "" ? "All Roles (Multi-Tab)" : r}
                                    </span>
                                  </label>
                                ),
                              )}
                            </div>
                            <button
                              onClick={() => handleDownloadExcel(downloadRole)}
                              className="w-full bg-gradient-to-r from-[#1a3652] to-[#448bd2] text-white py-2.5 rounded-full font-bold text-sm uppercase tracking-wide shadow hover:shadow-md transition-all"
                            >
                              <Icon
                                icon="lucide:download"
                                width="16"
                                className="inline mr-2"
                              />
                              Download
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedOrg && allQuestions.length > 0 && (
                        <button
                          onClick={handleDeleteAll}
                          disabled={loading}
                          className="group relative overflow-hidden z-0 border-red-500 border px-2.5 py-2 rounded-full flex justify-center items-center gap-1.5 font-semibold uppercase text-red-500 duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-white/15 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10 text-xs bg-white"
                        >
                          <Icon icon="lucide:trash-2" width="14" />
                          Delete all
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* HEADER: Title left, Add Button right */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 flex-wrap">
          <h2 className="md:text-2xl text-xl font-bold text-gray-800">
            Assessment Questions
          </h2>
          <button
            type="button"
            onClick={openAddModal}
            className={`relative overflow-hidden z-0 text-[var(--white-color)] ps-2.5 pe-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10`}
          >
            <Icon icon="material-symbols:add" width="20" height="20" />
            Add new question
          </button>
        </div>

        {/* TABS ROW: Centered Tabs, Filter Button on Right */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-end mb-8 gap-4 lg:flex-nowrap flex-wrap"
          id="crud-custom-wrap"
        >
          {/* Centered Tabs */}
          <div
            className="flex md:justify-end justify-start items-start w-full overflow-x-auto pb-2 md:pb-0 no-scrollbar"
            id="custom-max-w"
          >
            <ul className="flex list-none flex-row bg-[var(--light-primary-color)] rounded-full p-1 border border-gray-100 gap-1 md:min-w-max">
              {DOMAINS.map((domain, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      setFilterDomains([domain]);
                      setFilterSubdomains([]); // Reset subdomains when changing domain
                    }}
                    className={`px-6 py-2.5 text-sm uppercase rounded-full transition-all whitespace-nowrap
                            ${
                              filterDomains.includes(domain)
                                ? "bg-white text-gray-900 shadow-sm font-semibold"
                                : "text-neutral-500 font-semibold"
                            }`}
                  >
                    {domain}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Filter Button - Right Aligned */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-3 px-4 py-2 rounded-md font-medium text-sm uppercase tracking-wider border transition-all w-auto
                    ${
                      showFilters
                        ? "bg-[var(--primary-color)] text-white"
                        : "bg-white text-blue-400 border-blue-200 hover:border-blue-300"
                    }`}
          >
            <div className="flex items-center gap-2">
              <Icon icon="hugeicons:filter" width="16" height="16" />
              <span>Filter</span>
            </div>
            {activeFilterCount > 0 && (
              <span
                className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold transition-colors
                ${showFilters ? "bg-white text-[var(--primary-color)]" : "bg-[var(--primary-color)] text-white"}`}
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
              <h3 className="text-xl font-bold text-gray-800">
                No Role Selected
              </h3>
              <p className="text-gray-500 max-w-sm mb-6 text-sm leading-relaxed px-4">
                To view the assessment structure and questions, Please select a{" "}
                <strong>Role</strong>.
              </p>

              <div className="w-full max-w-xs relative">
                <div className="absolute inset-y-0 right-0 top-1 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-[#5D5D5D] "
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
                  className="font-semibold text-sm appearance-none text-[#1A3652] outline-none shadow-sm w-full p-3 border rounded-md transition-all border-[#448CD233] focus:border-[var(--primary-color)] bg-white cursor-pointer hover:bg-gray-50"
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
                      className="rounded-xl border border-gray-100 bg-white overflow-hidden"
                    >
                      <h2 className="mb-0" id={`heading-${safeId}`}>
                        <button
                          className="group relative flex w-full items-center justify-between px-6 py-5 text-left text-lg font-bold text-gray-800 transition hover:bg-gray-50 focus:outline-none"
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
                            className={`ms-auto h-6 w-6 shrink-0 transition-transform duration-200 ease-in-out flex items-center justify-center rounded-full  bg-gradient-to-t  ${
                              openSubdomains.includes(subdomainTitle)
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
                        className={`!visible ${
                          openSubdomains.includes(subdomainTitle)
                            ? ""
                            : "hidden"
                        }`}
                        aria-labelledby={`heading-${safeId}`}
                      >
                        <Droppable
                          droppableId={subdomainTitle}
                          type={subdomainTitle}
                        >
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
                                          className="flex justify-between items-start group bg-white p-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100
                                           sm:flex-row flex-col gap-y-2.5"
                                        >
                                          <div className="flex gap-3 pr-2 min-w-0">
                                            <span className="font-bold text-gray-800 text-sm whitespace-nowrap min-w-[24px]">
                                              Q{qIdx + 1}.
                                            </span>
                                            <p className="text-gray-700 text-sm font-medium leading-relaxed break-words">
                                              {q.questionStem}
                                            </p>
                                          </div>
                                          <div
                                            className={`flex sm:gap-3 gap-1.5 lg:gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity whitespace-nowrap pt-1 lg:pt-0 self-start shrink-0 justify-end sm:w-fit w-full`}
                                          >
                                            <button
                                              onClick={() => openEditModal(q)}
                                              className={`text-blue-400 hover:text-blue-600 transition-colors p-1`}
                                              title="Edit"
                                            >
                                              <Icon
                                                icon="lucide:pencil"
                                                width="16"
                                              />
                                            </button>
                                            <button
                                              onClick={() => openDeleteModal(q)}
                                              className={`text-red-400 hover:text-red-600 transition-colors p-1`}
                                              title="Delete"
                                            >
                                              <Icon
                                                icon="lucide:trash-2"
                                                width="16"
                                              />
                                            </button>
                                            <div
                                              {...provided.dragHandleProps}
                                              className={`text-gray-400 hover:text-gray-600 p-1 cursor-grab`}
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
                                <div className="text-gray-400 text-sm italic py-2">
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
        isAddBatchValid={isAddBatchValid}
        isEditValid={isEditValid}
        // DELETE ALL & OVERRIDE PROPS
        confirmDeleteAll={confirmDeleteAll}
        handleCloneWithOverride={handleCloneWithOverride}
        confirmOverrideAction={confirmOverrideAction}
        isCloningAll={isCloningAll}
        selectedOrg={selectedOrg}
        selectedDept={selectedDept}
        allQuestions={allQuestions}
      />
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
  isAddBatchValid: boolean;
  isEditValid: boolean;
  confirmDeleteAll: () => Promise<void>;
  handleCloneWithOverride: () => Promise<void>;
  confirmOverrideAction: () => void;
  isCloningAll: boolean;
  selectedOrg: string | null;
  selectedDept: string;
  allQuestions: Question[];
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
    isAddBatchValid,
    isEditValid,
    confirmDeleteAll,
    // handleCloneWithOverride,
    confirmOverrideAction,
    isCloningAll,
    selectedOrg,
    selectedDept,
    allQuestions,
  } = props;

  // Independent role selector for preview
  const [previewSelectedRole, setPreviewSelectedRole] = useState<string>("");
  const [previewStage, setPreviewStage] = useState<"role-select" | "questions">(
    "role-select",
  );

  // Compute preview questions from chosen role
  const previewQuestions = previewSelectedRole
    ? allQuestions.filter(
        (q) =>
          q.stakeholder?.toLowerCase() === previewSelectedRole.toLowerCase(),
      )
    : [];
  const previewRole = previewSelectedRole;

  const [previewIdx, setPreviewIdx] = useState(0);
  const [previewValue, setPreviewValue] = useState<number | string | null>(
    null,
  );

  // Reset everything when going back to role-select stage
  useEffect(() => {
    if (previewStage === "role-select") {
      setPreviewIdx(0);
      setPreviewValue(null);
    }
  }, [previewStage]);

  // Reset state when questions change
  useEffect(() => {
    setPreviewIdx(0);
    setPreviewValue(null);
  }, [previewSelectedRole]);

  // Reset selection when moving between questions
  useEffect(() => {
    setPreviewValue(null);
  }, [previewIdx]);

  const questions = previewQuestions || [];
  const currentQ = questions[previewIdx];
  const isForcedChoice = currentQ?.scale === "FORCED_CHOICE";

  // Show insight prompt logic
  const shouldShowPrompt =
    (isForcedChoice && previewValue !== null) ||
    (!isForcedChoice && typeof previewValue === "number" && previewValue <= 2);

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
      if (field === "type") {
        const mappedScale = TYPE_TO_SCALE[val];
        if (mappedScale) {
          if (isAddMode) {
            updateAddForm(index, "type", val);
            updateAddForm(index, "scale", mappedScale);
          } else if (onChange) {
            onChange({ target: { id: "type", value: val } });
            onChange({ target: { id: "scale", value: mappedScale } });
          }
          return;
        }
      }

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
              className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] disabled:bg-gray-100 disabled:pointer-events-none
              "
              disabled={isAddMode && index > 0} // Disable role for subsequent questions to enforce same stakeholder
            >
              <option value="">Select Role</option>
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
            className="font-medium text-sm text-[#5D5D5D] outline-0 w-full p-3 mt-2 border rounded-lg bg-gray-100 cursor-not-allowed border-[#E8E8E8] outline-none read-only:text-gray-500 read-only:font-normal"
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
              className={`font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] ${TYPE_TO_SCALE[data.type] ? "bg-gray-100 cursor-not-allowed" : ""}`}
              disabled={!!TYPE_TO_SCALE[data.type]}
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
          className="pointer-events-none relative flex min-h-full w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-3xl mx-auto px-4"
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
                disabled={loading || !isAddBatchValid}
                className="group relative overflow-hidden z-0 text-[var(--white-color)] px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10 disabled:pointer-events-none"
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
          className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-xl mx-auto px-4"
        >
          <div className="pointer-events-auto relative flex max-w-xl w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none">
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
          className="pointer-events-none relative flex min-h-full w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-3xl mx-auto px-4"
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
                disabled={loading || !isEditValid}
                className="group relative overflow-hidden z-0 text-[var(--white-color)] px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete All Confirmation Modal */}
      <div
        data-twe-modal-init
        className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="deleteAllModal"
        tabIndex={-1}
        aria-hidden="true"
        data-twe-backdrop="static"
      >
        <div
          data-twe-modal-dialog-ref
          className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-xl mx-auto px-4"
        >
          <div className="pointer-events-auto relative flex max-w-xl w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none">
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 sm:pb-0 pb-2">
              <h5
                className="sm:text-xl text-lg text-[var(--secondary-color)] invisible font-bold"
                id="deleteAllModalTitle"
              >
                Delete All
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
                  Delete all questions?
                </h5>
                <p className="text-sm text-neutral-600">
                  This will permanently remove all questions for{" "}
                  <strong>{selectedOrg}</strong>
                  {selectedDept !== "All" ? (
                    <>
                      {" "}
                      in <strong>{selectedDept}</strong>
                    </>
                  ) : (
                    ""
                  )}{" "}
                  dept . This action cannot be undone.
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
                onClick={confirmDeleteAll}
                className="group relative overflow-hidden z-0 bg-red-500 px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase text-white duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-white/15 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                {loading ? "Deleting..." : "Delete All"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clone Override Conflict Modal */}
      <div
        data-twe-modal-init
        className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="overrideModal"
        tabIndex={-1}
        aria-hidden="true"
        data-twe-backdrop="static"
      >
        <div
          data-twe-modal-dialog-ref
          className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-xl mx-auto px-4"
        >
          <div className="pointer-events-auto relative flex max-w-xl w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none">
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 sm:pb-0 pb-2">
              <h5
                className="sm:text-xl text-lg text-[var(--secondary-color)] invisible font-bold"
                id="overrideModalTitle"
              >
                Override Data
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
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
                <Icon
                  icon="lucide:alert-circle"
                  className="text-orange-500"
                  width="32"
                />
              </div>
              <div className="text-center">
                <h5 className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold mb-2">
                  Are you sure?
                </h5>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Existing data was detected for <strong>{selectedOrg}</strong>
                  {isCloningAll ? (
                    " across various departments"
                  ) : selectedDept !== "All" ? (
                    <>
                      {" "}
                      / <strong>{selectedDept}</strong>
                    </>
                  ) : (
                    " in the org-wide pool"
                  )}
                  .<br />
                  Continuing will <strong>override</strong> all current
                  questions in this scope.
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
                onClick={confirmOverrideAction}
                className="group relative overflow-hidden z-0 bg-blue-600 px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase text-white duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-white/15 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10 hover:shadow-lg hover:shadow-blue-200"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- PREVIEW MODAL --- */}
      <div
        data-twe-modal-init
        className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="previewModal"
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        <div
          data-twe-modal-dialog-ref
          className="pointer-events-none relative flex min-h-full w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-3xl mx-auto px-4"
        >
          <div className="pointer-events-auto relative flex w-full flex-col rounded-xl border-none bg-[var(--light-primary-color)] bg-clip-padding text-current shadow-lg outline-none max-h-[90vh] overflow-hidden">
            {/* Header */}
            {/* <div className="flex items-center justify-between p-6 bg-white border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-xl text-[var(--primary-color)]">
                  <Icon icon="solar:eye-bold" width="24" />
                </div>
                <div>
                  <h5 className="text-xl font-bold text-gray-800">
                    Assessment Preview
                  </h5>
                  {previewStage === "questions" && previewRole && (
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                      Role: {previewRole} &bull; {previewQuestions.length}{" "}
                      questions
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                data-twe-modal-dismiss
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => {
                  setPreviewIdx(0);
                  setPreviewStage("role-select");
                  setPreviewSelectedRole("");
                }}
              >
                <Icon
                  icon="material-symbols:close"
                  width="24"
                  className="text-gray-400"
                />
              </button>
            </div> */}

            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 bg-white">
              <div>
                <h5 className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold">
                  Assessment Preview
                </h5>

                {previewStage === "questions" && previewRole && (
                  <p className="text-sm text-gray-400">
                    Role: {previewRole} &bull; {previewQuestions.length}{" "}
                    questions
                  </p>
                )}
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

            {/* Content Area styled like live assessment */}
            <div className="px-4 sm:px-8 py-12 max-h-[calc(100vh-100px)] overflow-y-auto scroll-thin">
              {/* STAGE 1: Role Select Screen */}
              {previewStage === "role-select" ? (
                <div className="w-full max-w-md mx-auto">
                  <div className="text-center mb-10">
                    <h3 className="md:text-2xl mb-1 text-xl font-bold text-gray-800">
                      Select a Role to Preview
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Choose a stakeholder role to begin the assessment
                      walk-through.
                    </p>
                  </div>
                  <div className="space-y-3">
                    {["employee", "manager", "leader"].map((r) => {
                      const count = allQuestions.filter(
                        (q) => q.stakeholder?.toLowerCase() === r,
                      ).length;
                      return (
                        <button
                          key={r}
                          onClick={() => {
                            setPreviewSelectedRole(r);
                            setPreviewStage("questions");
                          }}
                          className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-[var(--primary-color)] hover:shadow duration-300 transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[var(--primary-color)] font-bold text-lg border border-blue-100 uppercase">
                              {r[0]}
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-gray-800 capitalize text-lg leading-tight">
                                {r}
                              </p>
                              <p className="text-xs text-gray-400 font-medium">
                                {count} Assessment Questions
                              </p>
                            </div>
                          </div>
                          <div className="h-6 w-6 shrink-0 transition-transform duration-200 ease-in-out flex items-center justify-center rounded-full  bg-gradient-to-t rotate-0 !text-[var(--primary-color)] from-[var(--light-primary-color)] to-[var(--light-primary-color)]">
                            {/* <Icon
                              icon="solar:alt-arrow-right-linear"
                              width="18"
                              className="text-gray-300 group-hover:text-[var(--primary-color)]"
                            /> */}

                            <Icon
                              icon="iconamoon:arrow-right-2-duotone"
                              width="16"
                              height="16"
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : previewQuestions.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <Icon
                    icon="solar:ghost-line-duotone"
                    width="64"
                    className="mx-auto text-gray-200 mb-4"
                  />
                  <p className="text-gray-500 font-medium">
                    No questions available for role:{" "}
                    <strong className="capitalize">{previewRole}</strong>
                  </p>
                  <button
                    onClick={() => setPreviewStage("role-select")}
                    className="mt-0 text-sm text-[var(--primary-color)] font-semibold underline hover:no-underline duration-300"
                  >
                    Choose a different role
                  </button>
                </div>
              ) : (
               <div className="w-full mx-auto">
                  <div
                    className="flex items-center gap-1.5 text-xs font-bold mb-5 cursor-pointer text-[#448CD2] transition-colors w-fit"
                    onClick={() => {
                      setPreviewStage("role-select");
                      setPreviewSelectedRole("");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      aria-hidden="true"
                      role="img"
                      className="iconify iconify--material-symbols"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="m7.825 13l4.9 4.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-6.6-6.6q-.15-.15-.213-.325T4.426 12t.063-.375t.212-.325l6.6-6.6q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712L7.825 11H19q.425 0 .713.288T20 12t-.288.713T19 13z"
                      ></path>
                    </svg>
                    <span className="uppercase tracking-wider">Back to choose stakeholder</span>
                  </div>
                  {/* Matching AssessmentQuestion Styling without Logo as requested */}
                  <div className="w-full mx-auto max-w-3xl rounded-xl shadow-md border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-base font-bold text-[var(--secondary-color)] capitalize tracking-wide">
                        Question {previewIdx + 1} of {previewQuestions.length}
                      </h2>
                    </div>

                    <div className="w-full bg-[var(--light-primary-color)] rounded-full h-2 mt-3 mb-6">
                      <div
                        className="bg-[var(--dark-primary-color)] h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${((previewIdx + 1) / previewQuestions.length) * 100}%`,
                        }}
                      />
                    </div>

                    <div className="sm:my-6 my-4">
                      <h2 className="sm:text-xl text-base font-bold text-[var(--secondary-color)]">
                        {currentQ?.questionStem}{" "}
                        <span className="text-black">*</span>
                      </h2>
                    </div>

                    {/* Options - Matching AssessmentQuestion styling */}
                    {!isForcedChoice ? (
                      <div className="grid grid-cols-5 max-w-96 mx-auto my-8">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <div key={num} className="flex flex-col items-center">
                            <label
                              className={`sm:text-lg text-sm font-medium sm:h-12 h-11 sm:w-12 w-11 border border-[#448CD233] rounded-full flex items-center justify-center cursor-pointer transition-all ${
                                previewValue === num
                                  ? "bg-gradient-to-b from-[#448CD2] to-[#1A3652] text-white border-0"
                                  : "text-[var(--secondary-color)] hover:bg-blue-50"
                              }`}
                              onClick={() => setPreviewValue(num)}
                            >
                              {num}
                            </label>
                            <span className="text-[10px] sm:text-nowrap mt-2 text-center leading-tight max-w-[60px]">
                              {currentQ?.scale === "NEVER_ALWAYS"
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
                              previewValue === opt
                                ? "border-[var(--primary-color)] bg-blue-50"
                                : ""
                            }`}
                            onClick={() => setPreviewValue(opt)}
                          >
                            <div
                              className={`!min-w-4 !min-h-4 rounded-full border-2 ${
                                previewValue === opt
                                  ? "border-blue-500 bg-[var(--primary-color)]"
                                  : "border-gray-300"
                              }`}
                            />
                            <h3 className="text-sm font-medium text-[#5D5D5D]">
                              {opt === "A"
                                ? currentQ?.forcedChoice?.optionA?.label
                                : currentQ?.forcedChoice?.optionB?.label}
                            </h3>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Insight Prompt - Matching AssessmentQuestion styling */}
                    <div
                      className={`transition-all duration-300 ${
                        shouldShowPrompt
                          ? "opacity-100 h-auto"
                          : "opacity-0 h-0 overflow-hidden"
                      }`}
                    >
                      <label className="text-sm font-bold block mb-2">
                        {isForcedChoice
                          ? previewValue === "A"
                            ? currentQ?.forcedChoice?.optionA?.insightPrompt
                            : currentQ?.forcedChoice?.optionB?.insightPrompt
                          : currentQ?.insightPrompt ||
                            "Why did you choose this score?"}
                        <span className="text-black"> *</span>
                      </label>
                      <textarea
                        className="font-medium text-sm text-[#5D5D5D] w-full p-3 border border-[#E8E8E8] rounded-lg resize-none"
                        rows={4}
                        placeholder="Simulated insight text for now it's readOnly..."
                        readOnly
                      ></textarea>
                    </div>

                    {/* Footer Buttons - Inside the card for better alignment */}
                    <div className="sm:mt-12 mt-8 flex flex-wrap gap-5 sm:justify-between sm:items-center">
                      <button
                        type="button"
                        onClick={() => {
                          // Only decrement if we aren't at the start
                          if (previewIdx > 0) {
                            setPreviewIdx((p) => Math.max(0, p - 1));
                          }
                        }}
                        className={`group text-[var(--primary-color)] rounded-full ps-2.5 pe-3.5 h-10 flex items-center gap-1.5 font-semibold text-base uppercase 
  bg-gradient-to-r bg-[var(--white-color)] border-solid border-[var(--primary-color)] sm:w-fit w-full sm:justify-start justify-center border 
  ${previewIdx === 0 ? "invisible" : "visible"}`}
                      >
                        <Icon
                          icon="mynaui:arrow-left-circle-solid"
                          width="22"
                        />
                        Previous
                      </button>

                      <button
                        type="button"
                        disabled={previewIdx === previewQuestions.length - 1}
                        onClick={() =>
                          setPreviewIdx((p) =>
                            Math.min(previewQuestions.length - 1, p + 1),
                          )
                        }
                        className="bg-gradient-to-r from-[#1a3652] to-[#448bd2] text-white pe-2.5 ps-3.5 h-10 rounded-full flex items-center gap-1.5 font-semibold uppercase disabled:opacity-40 sm:w-fit w-full sm:justify-start justify-center"
                      >
                        {previewIdx === previewQuestions.length - 1
                          ? "Finish Prep"
                          : "Continue"}
                        <Icon
                          icon="mynaui:arrow-right-circle-solid"
                          width="22"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Close - External to the simulated card, hidden in question stage if desired, but kept for UX safety */}
            {/* {previewStage === "role-select" && ( */}

            {/* <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 gap-2 bg-white">
              <button
                type="button"
                data-twe-modal-dismiss
                className="group text-[var(--primary-color)] px-5 py-2 h-10 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase relative overflow-hidden z-0 duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/10 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                Cancel
              </button>
              
            </div> */}
            {/* )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CrudQuestion;
