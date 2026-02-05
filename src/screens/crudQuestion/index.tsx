import { useEffect, useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { Collapse, Tab, Modal, initTWE, Ripple } from "tw-elements";
import {
  questionService,
} from "../../services/questionService";
import type {
  Question,
  CreateQuestionData,
} from "../../services/questionService";

// ------ CONSTANTS ------
const ROLE_DOMAIN_SUBDOMAINS: Record<string, Record<string, string[]>> = {
  admin: {
    "People Potential": [
      "Psychological Safety Leadership",
      "Talent, Learning & Workforce Strategy",
      "Engagement & Culture Stewardship",
      "Leadership Communication & Visibility"
    ],
    "Operational Steadiness": [
      "Operating Model Clarity",
      "Cross-Functional Governance",
      "Decision Rights & Accountability",
      "Risk, Resilience & Change Readiness"
    ],
    "Digital Fluency": [
      "Digital Modernization Leadership",
      "Strategic Collaboration Architecture",
      "Operational Governance & Risk",
      "AI Strategy & Data Fluency"
    ]
  },
  leader: {
    "People Potential": [
      "Psychological Safety Leadership",
      "Talent, Learning & Workforce Strategy",
      "Engagement & Culture Stewardship",
      "Leadership Communication & Visibility"
    ],
    "Operational Steadiness": [
      "Operating Model Clarity",
      "Cross-Functional Governance",
      "Decision Rights & Accountability",
      "Risk, Resilience & Change Readiness"
    ],
    "Digital Fluency": [
      "Digital Modernization Leadership",
      "Strategic Collaboration Architecture",
      "Operational Governance & Risk",
      "AI Strategy & Data Fluency"
    ]
  },
  manager: {
    "People Potential": [
      "Psychological Safety Enablement",
      "Coaching & Development Support",
      "Fairness, Inclusion & Trust",
      "Managerial Communication Quality"
    ],
    "Operational Steadiness": [
      "Workflow Oversight & Issue Resolution",
      "Consistency & Reinforcement",
      "Prioritization & Capacity Management",
      "Escalation & Risk Awareness"
    ],
    "Digital Fluency": [
      "Team Digital Enablement",
      "Communication & Coordination Oversight",
      "Workflow Governance & Efficiency",
      "Digital Tool Adoption"
    ]
  },
  employee: {
    "People Potential": [
      "Psychological Safety",
      "Trust & Communication",
      "Learning Agility",
      "Leadership Support"
    ],
    "Operational Steadiness": [
      "Clarity of Roles & Expectations",
      "Consistency of Processes",
      "Decision-Making Flow",
      "Workload & Capacity"
    ],
    "Digital Fluency": [
      "Tool & System Proficiency",
      "Collaboration & Coordination",
      "Workflow Efficiency",
      "AI Readiness"
    ]
  }
};

const DOMAINS = ["People Potential", "Operational Steadiness", "Digital Fluency"];
const QUESTION_TYPES = ["Self-Rating", "Calibration", "Behavioural", "Forced-Choice"];
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
  code: "",
  question: "",
  scale: "",
  prompt: "",
  optionALabel: "",
  optionAPrompt: "",
  optionBLabel: "",
  optionBPrompt: "",
  higherValueOption: "A"
};

const CrudQuestion = () => {
  // 1. STATE MANAGEMENT
  const [allQuestions, setAllQuestions] = useState<Question[]>([]); // Store all fetched questions
  const [loading, setLoading] = useState(false);


  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  // -- Filter State --
  // -- Filter State (PERSISTENT) --
  const [showFilters, setShowFilters] = useState(() => JSON.parse(localStorage.getItem('crud_showFilters') || 'false'));
  const [filterRole, setFilterRole] = useState(() => localStorage.getItem('crud_filterRole') || "");
  const [filterDomains, setFilterDomains] = useState<string[]>(() => {
    const saved = localStorage.getItem('crud_filterDomains');
    return saved ? JSON.parse(saved) : ["People Potential"];
  });
  const [filterSubdomains, setFilterSubdomains] = useState<string[]>(() => JSON.parse(localStorage.getItem('crud_filterSubdomains') || '[]'));
  const [filterTypes, setFilterTypes] = useState<string[]>(() => JSON.parse(localStorage.getItem('crud_filterTypes') || '[]'));
  const [filterScales, setFilterScales] = useState<string[]>(() => JSON.parse(localStorage.getItem('crud_filterScales') || '[]'));

  // Persist State Changes
  useEffect(() => localStorage.setItem('crud_showFilters', JSON.stringify(showFilters)), [showFilters]);
  useEffect(() => localStorage.setItem('crud_filterRole', filterRole), [filterRole]);
  useEffect(() => localStorage.setItem('crud_filterDomains', JSON.stringify(filterDomains)), [filterDomains]);
  useEffect(() => localStorage.setItem('crud_filterSubdomains', JSON.stringify(filterSubdomains)), [filterSubdomains]);
  useEffect(() => localStorage.setItem('crud_filterTypes', JSON.stringify(filterTypes)), [filterTypes]);
  useEffect(() => localStorage.setItem('crud_filterScales', JSON.stringify(filterScales)), [filterScales]);

  // -- Form State --
  // For Edit (single question)
  const [editFormData, setEditFormData] = useState<QuestionFormData>(INITIAL_FORM_DATA);

  // For Add (list of questions)
  const [addForms, setAddForms] = useState<QuestionFormData[]>([INITIAL_FORM_DATA]);

  // Determine Active Domain for Tabs (Visual) - Syncs with Filter if single domain selected
  const activeTabDomain = filterDomains.length === 1 ? filterDomains[0] : filterDomains[0] || "People Potential";

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    initTWE({ Tab, Collapse, Modal, Ripple });
  }, [filterRole, activeTabDomain, filterSubdomains]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await questionService.getAllQuestions();
      setAllQuestions(data);

    } catch (err: any) {
      console.error("Error fetching questions:", err);
      // setError(err.message || "Failed to load questions"); // Optional: Don't show global error if not critical
    } finally {
      setLoading(false);
    }
  };

  // 2. FILTER LOGIC
  const toggleFilter = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const availableSubdomains = useMemo(() => {
    const subdomainsSet = new Set<string>();
    const rolesToCheck = filterRole ? [filterRole] : Object.keys(ROLE_DOMAIN_SUBDOMAINS);
    const domainsToCheck = filterDomains.length > 0 ? filterDomains : DOMAINS;

    const orderedSubdomains: string[] = [];
    rolesToCheck.forEach(role => {
      domainsToCheck.forEach(domain => {
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

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      if (filterRole && q.stakeholder !== filterRole) return false;
      if (filterDomains.length > 0 && !filterDomains.includes(q.domain)) return false;
      if (filterSubdomains.length > 0 && !filterSubdomains.includes(q.subdomain)) return false;
      if (filterTypes.length > 0 && !filterTypes.includes(q.questionType)) return false;
      if (filterScales.length > 0 && !filterScales.includes(q.scale)) return false;
      return true;
    });
  }, [allQuestions, filterRole, filterDomains, filterSubdomains, filterTypes, filterScales]);

  const displayGroups = useMemo(() => {
    if (filterSubdomains.length > 0) {
      return availableSubdomains.filter(sd => filterSubdomains.includes(sd));
    }
    return availableSubdomains.filter(sd => {
      const relevantRoles = filterRole ? [filterRole] : Object.keys(ROLE_DOMAIN_SUBDOMAINS);
      return relevantRoles.some(role => ROLE_DOMAIN_SUBDOMAINS[role]?.[activeTabDomain]?.includes(sd));
    });
  }, [availableSubdomains, filterSubdomains, filterRole, activeTabDomain]);


  // 3. MODAL HANDLERS
  const openAddModal = () => {
    // Reset Add Form List
    // If filterRole is selected, pre-fill it.
    const initialData = {
      ...INITIAL_FORM_DATA,
      role: filterRole || "",
      domain: activeTabDomain
    };
    setAddForms([initialData]);

    const modal = Modal.getOrCreateInstance(document.getElementById("addModal") as HTMLElement);
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
    const modal = Modal.getOrCreateInstance(document.getElementById("editModal") as HTMLElement);
    modal.show();
  };

  const openDeleteModal = (q: Question) => {
    setSelectedQuestion(q);
    const modal = Modal.getOrCreateInstance(document.getElementById("deleteModal") as HTMLElement);
    modal.show();
  };

  // Handler for ADD Modal Inputs (Array)


  const updateAddForm = (index: number, field: keyof QuestionFormData, value: string) => {
    setAddForms(prev => {
      const newList = [...prev];
      newList[index] = { ...newList[index], [field]: value };

      // Cascading Logic: Use Requirement "if role is select then it will be fix in the next queeiotsn also"
      // AND Backend Requirement: "All questions must belong to the same stakeholder"
      // Implementation: If we change the Role of the FIRST question (index 0), we update ALL questions.
      if (index === 0 && field === 'role') {
        for (let i = 1; i < newList.length; i++) {
          newList[i] = { ...newList[i], role: value };
        }
      }

      return newList;
    });
  };

  const addMoreQuestion = () => {
    setAddForms(prev => {
      const lastItem = prev[prev.length - 1];
      // Determine what to copy
      const newItem = {
        ...INITIAL_FORM_DATA,
        role: lastItem.role, // Inherit Role (Strict)
        domain: lastItem.domain, // Inherit Domain (Likely desired)
        subDomain: lastItem.subDomain, // Inherit SubDomain (Likely desired)
        type: lastItem.type,
        scale: lastItem.scale
        // Resetting code, question, prompt etc.
      };
      return [...prev, newItem];
    });
  };

  const removeAddForm = (index: number) => {
    if (addForms.length <= 1) return; // Don't delete the last one
    setAddForms(prev => prev.filter((_, i) => i !== index));
  };


  // Handler for EDIT Modal Inputs (Single)
  const handleEditInputChange = (e: { target: { id: string; value: string } }) => {
    const { id, value } = e.target;
    let key = id;
    if (id.startsWith("add")) { // Legacy ID cleaning if inputs still have "add" prefix
      key = id.replace("add", "");
      key = key.charAt(0).toLowerCase() + key.slice(1);
    }
    // If using cleaner IDs in Edit Modal:
    setEditFormData((prev: any) => ({ ...prev, [key]: value }));
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
          insightPrompt: form.scale !== "FORCED_CHOICE" ? form.prompt : undefined,
          forcedChoice: form.scale === "FORCED_CHOICE" ? {
            optionA: { label: form.optionALabel, insightPrompt: form.optionAPrompt },
            optionB: { label: form.optionBLabel, insightPrompt: form.optionBPrompt },
            higherValueOption: form.higherValueOption as "A" | "B"
          } : undefined
        };
      });

      await questionService.createQuestions(payload);
      await fetchQuestions();
      Modal.getInstance(document.getElementById("addModal") as HTMLElement)?.hide();
    } catch (err: any) {
      alert(err.message || "Failed");
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
        insightPrompt: editFormData.scale !== "FORCED_CHOICE" ? editFormData.prompt : undefined,
        forcedChoice: editFormData.scale === "FORCED_CHOICE" ? {
          optionA: { label: editFormData.optionALabel, insightPrompt: editFormData.optionAPrompt },
          optionB: { label: editFormData.optionBLabel, insightPrompt: editFormData.optionBPrompt },
          higherValueOption: editFormData.higherValueOption as "A" | "B"
        } : undefined
      });
      await fetchQuestions();
      Modal.getInstance(document.getElementById("editModal") as HTMLElement)?.hide();
    } catch (err: any) {
      alert(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedQuestion) return;
    setLoading(true);
    try {
      await questionService.deleteQuestion(selectedQuestion._id);
      setAllQuestions(prev => prev.filter(q => q._id !== selectedQuestion._id));
      Modal.getInstance(document.getElementById("deleteModal") as HTMLElement)?.hide();
    } catch (err: any) {
      alert(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const moveQuestion = (id: string, direction: 'up' | 'down') => {
    setAllQuestions(prev => {
      const index = prev.findIndex(q => q._id === id);
      if (index === -1) return prev;

      const question = prev[index];
      const subdomain = question.subdomain;

      // Filter indices of questions in the SAME subdomain
      const sameSubIndices = prev
        .map((q, i) => q.subdomain === subdomain ? i : -1)
        .filter(i => i !== -1);

      const posInSub = sameSubIndices.indexOf(index);

      if (direction === 'up' && posInSub > 0) {
        const targetIndex = sameSubIndices[posInSub - 1];
        const newQuestions = [...prev];
        [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
        return newQuestions;
      }

      if (direction === 'down' && posInSub < sameSubIndices.length - 1) {
        const targetIndex = sameSubIndices[posInSub + 1];
        const newQuestions = [...prev];
        [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
        return newQuestions;
      }

      return prev;
    });
  };

  // Helper for form
  const getSubdomainsForForm = (role: string, domain: string) => {
    if (!role || !domain) return [];
    return ROLE_DOMAIN_SUBDOMAINS[role]?.[domain] || [];
  };

  return (
    <div className="relative flex flex-col lg:flex-row gap-4 items-start">
      {/* --- FILTER SIDEBAR --- */}
      {showFilters && (
        <div className="w-full lg:w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-5 flex-shrink-0 z-10 lg:sticky lg:top-4 fixed top-0 left-0 h-full lg:h-auto overflow-y-auto lg:overflow-visible">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Filters</h3>
            <button onClick={() => setShowFilters(false)} className="text-blue-500 text-sm font-semibold lg:hidden">
              Close
            </button>
            <button onClick={() => setShowFilters(false)} className="text-blue-500 text-sm font-semibold hidden lg:block">
              Save View
            </button>
          </div>

          {/* Role Filter */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">Select role</option>
              {Object.keys(ROLE_DOMAIN_SUBDOMAINS).map(r => (
                <option key={r} value={r} className="capitalize">{r}</option>
              ))}
            </select>
          </div>

          {/* Domain Filter */}
          <FilterSection title="Domain" open>
            {DOMAINS.map(d => (
              <label key={d} className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterDomains.includes(d)}
                  onChange={() => setFilterDomains([d])} // Enforce Single Select
                  className="rounded text-blue-600 focus:ring-blue-500 rounded-full"
                />
                <span className="text-sm text-gray-700">{d}</span>
              </label>
            ))}
          </FilterSection>

          {/* Subdomain Filter */}
          <FilterSection title="Sub-domain" open>
            {availableSubdomains.length > 0 ? availableSubdomains.map(sd => (
              <label key={sd} className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterSubdomains.includes(sd)}
                  onChange={() => toggleFilter(setFilterSubdomains, sd)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 truncate" title={sd}>{sd}</span>
              </label>
            )) : <p className="text-xs text-gray-400">Select Role/Domain to view</p>}
          </FilterSection>

          {/* Type/Scale Filters can go here... */}
          <FilterSection title="Question Type">
            {QUESTION_TYPES.map(t => (
              <label key={t} className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterTypes.includes(t)}
                  onChange={() => toggleFilter(setFilterTypes, t)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{t}</span>
              </label>
            ))}
          </FilterSection>

          <FilterSection title="Scale">
            {SCALES.map(s => (
              <label key={s} className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterScales.includes(s)}
                  onChange={() => toggleFilter(setFilterScales, s)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 lowercase">{s.replace('_', ' ')}</span>
              </label>
            ))}
          </FilterSection>
        </div>
      )}


      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 w-full bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-152px)]">

        {/* HEADER: Title left, Add Button right */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h2 className="md:text-2xl text-xl font-bold text-gray-800">
            Assessment Questions
          </h2>
          <button
            type="button"
            onClick={openAddModal}
            className="relative overflow-hidden z-0 text-white ps-4 pe-5 h-10 rounded-full flex justify-center items-center gap-2 font-bold text-sm uppercase bg-[#1A365D] hover:bg-[#2a4a75] transition-colors w-full sm:w-auto"
          >
            <Icon icon="material-symbols:add" width="20" height="20" />
            Add new question
          </button>
        </div>

        {/* TABS ROW: Centered Tabs, Filter Button on Right */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between mb-8 gap-4">
          {/* Spacer - Flexible Width (Hidden on Mobile) */}
          <div className="flex-1 hidden md:block"></div>

          {/* Centered Tabs */}
          <div className="flex justify-center w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <ul className="flex list-none flex-row bg-[#F8FAFC] rounded-full p-1 border border-gray-100 gap-1 min-w-max">
              {DOMAINS.map((domain, index) => (
                <li key={index}>
                  <button
                    onClick={() => setFilterDomains([domain])}
                    className={`px-6 py-2.5 text-sm font-bold uppercase rounded-full transition-all whitespace-nowrap
                            ${filterDomains.includes(domain)
                        ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                        : "text-gray-400 hover:text-gray-600 hover:bg-white/50"}`}
                  >
                    {domain}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Filter Button - Right Aligned with flexible space */}
          <div className="flex-1 flex justify-end w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-bold text-sm uppercase tracking-wider border transition-all w-full md:w-auto
                    ${showFilters
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-white text-blue-400 border-blue-200 hover:border-blue-300'}`}
            >
              <Icon icon="hugeicons:filter" width="16" height="16" />
              Filter
            </button>
          </div>
        </div>

        {/* --- CONTENT AREA (Accordions or Empty State) --- */}
        {!filterRole ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 mx-auto max-w-lg">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <Icon icon="hugeicons:audit-02" className="text-gray-400 w-12 h-12" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No Role Selected</h3>
            <p className="text-gray-500 max-w-sm mb-6 text-sm leading-relaxed px-4">
              To view the assessment structure and questions, please select a <strong>Role</strong> from the specific filters.
            </p>
            <button
              onClick={() => setShowFilters(true)}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm text-sm"
            >
              Open Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayGroups.map((subdomainTitle, idx) => {
              const questionsInGroup = filteredQuestions.filter(q => q.subdomain === subdomainTitle);
              const safeId = subdomainTitle.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

              return (
                <div key={subdomainTitle} className="rounded-xl border border-gray-100 bg-white overflow-hidden">
                  <h2 className="mb-0" id={`heading-${safeId}`}>
                    <button
                      className="group relative flex w-full items-center justify-between px-6 py-5 text-left text-lg font-bold text-gray-800 transition hover:bg-gray-50 focus:outline-none"
                      type="button"
                      data-twe-collapse-init
                      data-twe-target={`#collapse-${safeId}`}
                      aria-expanded={idx === 0}
                      aria-controls={`collapse-${safeId}`}
                    >
                      <span className="pr-4">{subdomainTitle}</span>
                      <span className="ms-auto h-6 w-6 shrink-0 rotate-[-180deg] transition-transform duration-200 ease-in-out group-data-[twe-collapse-collapsed]:rotate-0 flex items-center justify-center rounded-full bg-[#1A365D] text-white">
                        <Icon icon="mdi:chevron-up" width="18" />
                      </span>
                    </button>
                  </h2>
                  <div
                    id={`collapse-${safeId}`}
                    className={`!visible ${idx === 0 ? "" : "hidden"}`} // Default expand first item
                    data-twe-collapse-item
                    data-twe-collapse-show={idx === 0}
                    aria-labelledby={`heading-${safeId}`}
                  >
                    <div className="px-4 text-sm sm:px-6 pb-6 pt-2">
                      {questionsInGroup.length > 0 ? (
                        <div className="space-y-4">
                          {questionsInGroup.map((q, qIdx) => (
                            <div key={q._id} className="flex justify-between items-start group">
                              <div className="flex gap-3 pr-2 min-w-0">
                                <span className="font-bold text-gray-800 text-sm whitespace-nowrap min-w-[24px]">Q{qIdx + 1}.</span>
                                <p className="text-gray-700 text-sm font-medium leading-relaxed break-words">{q.questionStem}</p>
                              </div>
                              <div className="flex gap-3 lg:gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity whitespace-nowrap pt-1 lg:pt-0 self-start">
                                <div className="flex bg-gray-50 rounded-md p-0.5 border border-gray-100">
                                  <button
                                    onClick={() => moveQuestion(q._id, 'up')}
                                    disabled={qIdx === 0}
                                    className={`p-1 rounded transition-colors ${qIdx === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:text-blue-500 hover:bg-white'}`}
                                    title="Move Up"
                                  >
                                    <Icon icon="lucide:chevron-up" width="14" />
                                  </button>
                                  <button
                                    onClick={() => moveQuestion(q._id, 'down')}
                                    disabled={qIdx === questionsInGroup.length - 1}
                                    className={`p-1 rounded transition-colors ${qIdx === questionsInGroup.length - 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:text-blue-500 hover:bg-white'}`}
                                    title="Move Down"
                                  >
                                    <Icon icon="lucide:chevron-down" width="14" />
                                  </button>
                                </div>
                                <button onClick={() => openEditModal(q)} className="text-blue-400 hover:text-blue-600 transition-colors p-1" title="Edit">
                                  <Icon icon="lucide:pencil" width="16" />
                                </button>
                                <button onClick={() => openDeleteModal(q)} className="text-red-400 hover:text-red-600 transition-colors p-1" title="Delete">
                                  <Icon icon="lucide:trash-2" width="16" />
                                </button>
                                <button className="text-gray-400 hover:text-gray-600 cursor-grab p-1">
                                  <Icon icon="lucide:menu" width="16" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm italic py-2 pl-9">
                          {filterRole ? "No questions added yet." : "Select a filter to view questions."}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
const FilterSection = ({ title, children, open = false }: { title: string, children: React.ReactNode, open?: boolean }) => {
  const [isOpen, setIsOpen] = useState(open);
  return (
    <div className="mb-4 border-b pb-2 last:border-0 border-gray-100">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full font-semibold text-gray-700 text-sm mb-2">
        {title}
        <Icon icon="mdi:chevron-down" className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="pl-1 space-y-1">{children}</div>}
    </div>
  )
}

const CrudModals = (props: any) => {
  const {
    addForms, updateAddForm, addMoreQuestion, removeAddForm,
    editFormData, handleEditInputChange,
    handleCreate, handleUpdate, confirmDelete,
    loading, subdomainsGetter
  } = props;

  // Helper to render a SINGLE form (reusable for Add list)
  const renderFormFields = (data: QuestionFormData, onChange: ((e: { target: { id: string; value: string } }) => void) | null, isAddMode: boolean, index: number = 0) => {
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
          <select
            value={data.role}
            onChange={(e) => onFieldChange('role', e.target.value)}
            className="w-full border rounded p-2 text-sm mt-1"
            disabled={isAddMode && index > 0} // Disable role for subsequent questions to enforce same stakeholder
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="leader">Leader</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
        </div>
        {/* Domain */}
        <div>
          <label className="block font-bold text-sm text-gray-700">Domain</label>
          <select value={data.domain} onChange={(e) => onFieldChange('domain', e.target.value)} className="w-full border rounded p-2 text-sm mt-1">
            <option value="">Select Domain</option>
            {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        {/* Subdomain */}
        <div>
          <label className="block font-bold text-sm text-gray-700">Sub-Domain</label>
          <select value={data.subDomain} onChange={(e) => onFieldChange('subDomain', e.target.value)} className="w-full border rounded p-2 text-sm mt-1" disabled={!data.role || !data.domain}>
            <option value="">Select Sub-Domain</option>
            {subdomains.map((sd: any) => <option key={sd} value={sd}>{sd}</option>)}
          </select>
        </div>
        {/* Type */}
        <div>
          <label className="block font-bold text-sm text-gray-700">Type</label>
          <select value={data.type} onChange={(e) => onFieldChange('type', e.target.value)} className="w-full border rounded p-2 text-sm mt-1">
            <option value="">Select Type</option>
            {QUESTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {/* Code */}
        <div>
          <label className="block font-bold text-sm text-gray-700">Code</label>
          <input type="text" value={data.code} onChange={(e) => onFieldChange('code', e.target.value)} placeholder="Ex: PS-01" className="w-full border rounded p-2 text-sm mt-1" />
        </div>
        {/* Scale */}
        <div>
          <label className="block font-bold text-sm text-gray-700">Scale</label>
          <select value={data.scale} onChange={(e) => onFieldChange('scale', e.target.value)} className="w-full border rounded p-2 text-sm mt-1">
            <option value="">Select Scale</option>
            {SCALES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {/* Question */}
        <div className="col-span-1">
          <label className="block font-bold text-sm text-gray-700">Question</label>
          <input type="text" value={data.question} onChange={(e) => onFieldChange('question', e.target.value)} placeholder="Enter question stem" className="w-full border rounded p-2 text-sm mt-1" />
        </div>

        {/* Conditional Fields based on Scale */}
        {!isForcedChoice ? (
          <div className="col-span-1">
            <label className="block font-bold text-sm text-gray-700">Insight Prompt</label>
            <input type="text" value={data.prompt} onChange={(e) => onFieldChange('prompt', e.target.value)} placeholder="Enter insight hint" className="w-full border rounded p-2 text-sm mt-1" />
          </div>
        ) : (
          <div className="space-y-3 bg-gray-50 p-3 rounded border">
            <p className="font-bold text-xs uppercase text-gray-500">Forced Choice Options</p>
            {/* Option A */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold">Option A Label</label>
                <input type="text" value={data.optionALabel} onChange={(e) => onFieldChange('optionALabel', e.target.value)} className="w-full border rounded p-1 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold">Option A Prompt</label>
                <input type="text" value={data.optionAPrompt} onChange={(e) => onFieldChange('optionAPrompt', e.target.value)} className="w-full border rounded p-1 text-sm" />
              </div>
            </div>
            {/* Option B */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold">Option B Label</label>
                <input type="text" value={data.optionBLabel} onChange={(e) => onFieldChange('optionBLabel', e.target.value)} className="w-full border rounded p-1 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold">Option B Prompt</label>
                <input type="text" value={data.optionBPrompt} onChange={(e) => onFieldChange('optionBPrompt', e.target.value)} className="w-full border rounded p-1 text-sm" />
              </div>
            </div>
            {/* Higher Value */}
            <div>
              <label className="text-xs font-bold">Higher Value Option</label>
              <select value={data.higherValueOption} onChange={(e) => onFieldChange('higherValueOption', e.target.value)} className="w-full border rounded p-1 text-sm">
                <option value="A">Option A</option>
                <option value="B">Option B</option>
              </select>
            </div>
          </div>
        )}
      </div>
    )
  };

  return (
    <>
      {/* Add Modal */}
      <div data-twe-modal-init className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none" id="addModal" tabIndex={-1} aria-hidden="true" data-twe-backdrop="static">
        <div data-twe-modal-dialog-ref className="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[700px]">
          <div className="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between rounded-t-md p-4 bg-gray-50 border-b">
              <h5 className="text-xl font-medium leading-normal text-neutral-800">Create New Question</h5>
              <button type="button" data-twe-modal-dismiss aria-label="Close" className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none">
                <Icon icon="material-symbols:close" width="24" />
              </button>
            </div>
            <div className="relative p-4 overflow-y-auto bg-gray-50">
              {addForms.map((form: QuestionFormData, index: number) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-4 last:mb-0 relative group">
                  {index > 0 && (
                    <div className="flex justify-between items-center mb-2 border-b pb-2">
                      <span className="text-xs font-bold text-gray-500 uppercase">Question {index + 1}</span>
                      <button onClick={() => removeAddForm(index)} className="text-red-400 hover:text-red-600">
                        <Icon icon="lucide:trash-2" width="16" />
                      </button>
                    </div>
                  )}
                  {renderFormFields(form, null, true, index)}
                </div>
              ))}

              <button
                onClick={addMoreQuestion}
                className="mt-4 w-full py-2 border-2 border-dashed border-blue-200 rounded-lg text-blue-500 font-bold text-sm hover:bg-blue-50 hover:border-blue-400 transition-colors flex items-center justify-center gap-2"
              >
                <Icon icon="material-symbols:add" width="18" />
                Add More Question
              </button>
            </div>
            <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 gap-2 bg-white">
              <button type="button" data-twe-modal-dismiss className="inline-block rounded-full border border-blue-200 px-6 pb-2 pt-2.5 text-xs font-bold uppercase leading-normal text-blue-500 transition duration-150 ease-in-out hover:bg-blue-50 focus:outline-none">
                Cancel
              </button>
              <button type="button" onClick={handleCreate} disabled={loading} className="inline-block rounded-full bg-[#1A365D] px-6 pb-2 pt-2.5 text-xs font-bold uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-[#2a4a75] focus:outline-none">
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal - Unchanged */}
      <div data-twe-modal-init className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none" id="deleteModal" tabIndex={-1} aria-hidden="true" data-twe-backdrop="static">
        <div data-twe-modal-dialog-ref className="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]">
          <div className="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none">
            <div className="relative p-6 text-center">
              <Icon icon="mingcute:warning-fill" className="text-red-500 w-16 h-16 mx-auto mb-4" />
              <h5 className="text-xl font-bold mb-2">Delete Question?</h5>
              <p className="text-gray-500">This action cannot be undone.</p>
            </div>
            <div className="flex justify-center gap-3 pb-6">
              <button data-twe-modal-dismiss className="px-5 py-2 border rounded-full text-blue-600 font-bold hover:bg-blue-50">Cancel</button>
              <button onClick={confirmDelete} className="px-5 py-2 bg-red-500 text-white rounded-full font-bold hover:bg-red-600">{loading ? "..." : "Delete"}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal (Single) */}
      <div data-twe-modal-init className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none" id="editModal" tabIndex={-1} aria-hidden="true" data-twe-backdrop="static">
        <div data-twe-modal-dialog-ref className="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]">
          <div className="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between rounded-t-md p-4 bg-gray-50 border-b">
              <h5 className="text-xl font-medium leading-normal text-neutral-800">Edit Question</h5>
              <button type="button" data-twe-modal-dismiss aria-label="Close" className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none">
                <Icon icon="material-symbols:close" width="24" />
              </button>
            </div>
            <div className="relative p-4 overflow-y-auto">
              <form className="grid gap-4">
                {renderFormFields(editFormData, handleEditInputChange, false)}
                <button type="button" onClick={handleUpdate} disabled={loading} className="w-full rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-accent-200 active:shadow-primary-2 bg-gradient-to-r from-[#1a3652] to-[#448bd2]">
                  {loading ? "Updating..." : "Update"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CrudQuestion;
