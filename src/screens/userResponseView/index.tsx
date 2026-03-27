import { Icon } from "@iconify/react";
import { useEffect, useState, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../../services/axios";

interface ResponseData {
    _id: string;
    domain: string;
    subdomain: string;
    questionStem: string;
    questionType: string;
    value: number;
    selectedOption?: string;
    comment: string | null;
    insightPrompt?: string;
}

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
        <div className="border-b border-gray-100 last:border-0 pb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full uppercase text-xs font-bold text-gray-400 group pt-2 focus:outline-none"
            >
                <span>{title}</span>
                <Icon
                    icon="mdi:chevron-down"
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    width="18"
                />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
                {children}
            </div>
        </div>
    );
};

const UserResponseView = () => {
    const { assessmentId } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userName = queryParams.get("userName") || "Participant";

    const [responses, setResponses] = useState<ResponseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [openSubdomains, setOpenSubdomains] = useState<string[]>([]);

    // -- Filter State (Synced with Crud UI) --
    const [showFilters, setShowFilters] = useState(false);
    const [filterDomains, setFilterDomains] = useState<string[]>(["People Potential"]);
    const [filterSubdomains, setFilterSubdomains] = useState<string[]>([]);
    const [filterTypes, setFilterTypes] = useState<string[]>([]);

    useEffect(() => {
        if (assessmentId) {
            fetchResponses();
        }
    }, [assessmentId]);

    const fetchResponses = async () => {
        setLoading(true);
        try {
            const res = await api.get<any>(`responses/${assessmentId}`);
            const data = res.data;
            if (data && data.responses) {
                setResponses(data.responses);
                if (data.responses.length > 0) {
                    setOpenSubdomains([data.responses[0].subdomain]);
                }
            } else if (Array.isArray(data)) {
                setResponses(data);
                if (data.length > 0) {
                    setOpenSubdomains([data[0].subdomain]);
                }
            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const DOMAINS = ["People Potential", "Operational Steadiness", "Digital Fluency"];
    const allSubdomains = useMemo(() => Array.from(new Set(responses.map(r => r.subdomain))), [responses]);
    const allTypes = useMemo(() => Array.from(new Set(responses.map(r => r.questionType))), [responses]);

    const filteredResponses = useMemo(() => {
        return responses.filter(r => {
            if (filterDomains.length > 0 && !filterDomains.includes(r.domain)) return false;
            if (filterSubdomains.length > 0 && !filterSubdomains.includes(r.subdomain)) return false;
            if (filterTypes.length > 0 && !filterTypes.includes(r.questionType)) return false;
            return true;
        });
    }, [responses, filterDomains, filterSubdomains, filterTypes]);

    const displayGroups = useMemo(() => {
        const groups: string[] = [];
        filteredResponses.forEach(r => {
            if (!groups.includes(r.subdomain)) groups.push(r.subdomain);
        });
        return groups;
    }, [filteredResponses]);

    const activeFilterCount = filterSubdomains.length + filterTypes.length;

    const toggleFilter = (setter: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
        setter(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
    };

    const resetFilters = () => {
        setFilterSubdomains([]);
        setFilterTypes([]);
    };

    return (
        <div className="crud-question-screen relative flex flex-col lg:flex-row gap-4 items-start pt-6">

            {/* --- FILTER SIDEBAR (Same to Same as CrudQuestion) --- */}
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

                    <div className="md:max-h-[500px] max-h-[calc(100vh-80px)] overflow-y-auto px-5 space-y-6">
                        <FilterSection title="Domain Focus" open>
                            {DOMAINS.map((d) => (
                                <label key={d} className="flex items-center gap-3 mb-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filterDomains.includes(d)}
                                        onChange={() => {
                                            setFilterDomains([d]);
                                            setFilterSubdomains([]);
                                        }}
                                        className="w-4 h-4 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className={`text-sm font-medium ${filterDomains.includes(d) ? "text-gray-900" : "text-gray-600"}`}>{d}</span>
                                </label>
                            ))}
                        </FilterSection>

                        <FilterSection title="Sub-domains" open>
                            {allSubdomains.filter(s => responses.find(r => r.subdomain === s && filterDomains.includes(r.domain))).map(s => (
                                <label key={s} className="flex items-center gap-3 mb-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filterSubdomains.includes(s)}
                                        onChange={() => toggleFilter(setFilterSubdomains, s)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className="text-sm font-medium text-gray-700 truncate">{s}</span>
                                </label>
                            ))}
                        </FilterSection>

                        <FilterSection title="Question Logic">
                            {allTypes.map(t => (
                                <label key={t} className="flex items-center gap-3 mb-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filterTypes.includes(t)}
                                        onChange={() => toggleFilter(setFilterTypes, t)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className="text-sm font-medium text-gray-700">{t.replace('-', ' ')}</span>
                                </label>
                            ))}
                        </FilterSection>
                    </div>
                </div>
            )}

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 w-full bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] min-h-[calc(100vh-162px)]">

                {/* HEADER: Matching Crud Layout */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 flex-wrap">
                    <div>
                        <h2 className="md:text-2xl text-xl font-bold text-gray-800">
                            Assessment Responses
                        </h2>
                        <p className="text-sm font-medium text-gray-400 mt-1">
                            Individual snapshot for <span className="text-[#448CD2] font-semibold">{userName}</span>
                        </p>
                    </div>
                </div>

                {/* TABS ROW: Same to Same */}
                <div
                    className="flex flex-col md:flex-row md:items-center md:justify-end mb-8 gap-4 lg:flex-nowrap flex-wrap"
                    id="crud-custom-wrap"
                >
                    <div className="flex md:justify-end justify-start items-start w-full overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        <ul className="flex list-none flex-row bg-[var(--light-primary-color)] rounded-full p-1 border border-gray-100 gap-1 md:min-w-max">
                            {DOMAINS.map((domain, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => {
                                            setFilterDomains([domain]);
                                            setFilterSubdomains([]);
                                        }}
                                        className={`px-6 py-2.5 text-sm uppercase rounded-full transition-all whitespace-nowrap
                                            ${filterDomains.includes(domain) ? "bg-white text-gray-900 shadow-sm font-semibold" : "text-neutral-500 font-semibold"}`}
                                    >
                                        {domain}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center justify-center gap-3 px-4 py-2 rounded-md font-medium text-sm uppercase tracking-wider border transition-all w-auto
                            ${showFilters ? "bg-[var(--primary-color)] text-white" : "bg-white text-blue-400 border-blue-200 hover:border-blue-300"}`}
                    >
                        <div className="flex items-center gap-2">
                            <Icon icon="hugeicons:filter" width="16" height="16" />
                            <span>Filter</span>
                        </div>
                        {activeFilterCount > 0 && (
                            <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold transition-colors
                                ${showFilters ? "bg-white text-[var(--primary-color)]" : "bg-[var(--primary-color)] text-white"}`}>
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* CONTENT AREA: Accordions */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="py-20 text-center flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#448CD2]"></div>
                            <p className="text-gray-400 text-sm mt-4 font-semibold uppercase tracking-widest">Loading Records...</p>
                        </div>
                    ) : displayGroups.length > 0 ? (
                        <div className="space-y-4">
                            {displayGroups.map((subdomainTitle) => {
                                const questionsInGroup = filteredResponses.filter(r => r.subdomain === subdomainTitle);
                                const isOpen = openSubdomains.includes(subdomainTitle);
                                const safeId = subdomainTitle.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();

                                return (
                                    <div key={subdomainTitle} className="rounded-xl border border-gray-100 bg-white overflow-hidden">
                                        <h2 className="mb-0" id={`heading-${safeId}`}>
                                            <button
                                                className="group relative flex w-full items-center justify-between px-6 py-5 text-left text-lg font-bold text-gray-800 transition hover:bg-gray-50 focus:outline-none"
                                                type="button"
                                                onClick={() => setOpenSubdomains(prev => prev.includes(subdomainTitle) ? prev.filter(s => s !== subdomainTitle) : [...prev, subdomainTitle])}
                                            >
                                                <span className="pr-4">{subdomainTitle}</span>
                                                <span className={`ms-auto h-6 w-6 shrink-0 transition-transform duration-200 ease-in-out flex items-center justify-center rounded-full bg-gradient-to-t ${isOpen ? "rotate-[-180deg] from-[#1a3652] to-[#448bd2] text-white" : "rotate-0 !text-[var(--primary-color)] from-[var(--light-primary-color)] to-[var(--light-primary-color)]"}`}>
                                                    <Icon icon="mdi:chevron-up" width="18" />
                                                </span>
                                            </button>
                                        </h2>

                                        <div id={`collapse-${safeId}`} className={`!visible ${isOpen ? "" : "hidden"}`} aria-labelledby={`heading-${safeId}`}>
                                            <div className="px-4 text-sm sm:px-6 pb-6 pt-2">
                                                <div className="space-y-1">
                                                    {questionsInGroup.map((resp, qIdx) => (
                                                        <div key={resp._id} className="flex justify-between items-start group bg-white p-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 sm:flex-row flex-col gap-y-2.5">
                                                            <div className="flex gap-3 pr-2 min-w-0 flex-1">
                                                                <span className="font-bold text-gray-800 text-sm whitespace-nowrap min-w-[24px]">Q{qIdx + 1}.</span>
                                                                <div className="flex flex-col gap-1.5 flex-1">
                                                                    <p className="text-gray-700 text-sm font-medium leading-relaxed break-words">{resp.questionStem}</p>

                                                                    {/* DETAIL BLOCK (Ans, Insight, Comment) */}
                                                                    <div className="mt-2.5 pl-0 space-y-3">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-[10px] font-bold uppercase text-gray-300 tracking-wider">Ans:</span>
                                                                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${resp.value <= 2 ? "text-red-700 bg-red-50" : resp.value === 3 ? "text-amber-700 bg-amber-50" : "text-green-700 bg-green-50"}`}>
                                                                                {resp.selectedOption || resp.value || "0"} {resp.selectedOption ? `(Option ${resp.selectedOption})` : ""}
                                                                            </span>
                                                                        </div>

                                                                        {/* Always show InsightPrompt ABOVE Comment if it exists or if comment exists (fallback) */}
                                                                        {(resp.insightPrompt || resp.comment) && (
                                                                            <div className="flex items-start gap-2 bg-blue-50/20 p-2 rounded-lg border border-blue-50">
                                                                                <Icon icon="solar:lightbulb-bolt-bold-duotone" width="14" className="text-blue-300 mt-0.5 shrink-0" />
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-[8px] font-bold uppercase text-blue-400 tracking-[0.2em]">Strategic Insight</span>
                                                                                    <p className="text-[11px] font-semibold text-gray-700 leading-relaxed uppercase">
                                                                                        {resp.insightPrompt || "Why did you choose this score?"}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {resp.comment && (
                                                                            <div className="flex items-start gap-2">
                                                                                <span className="text-[10px] font-bold uppercase text-gray-300 tracking-wider mt-0.5">Comment:</span>
                                                                                <p className="text-xs text-gray-600 italic font-medium leading-relaxed">
                                                                                    "{resp.comment}"
                                                                                </p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* ACTION PORTION: Question Type (Keep Permanent Visibility) */}
                                                            <div className="flex sm:gap-3 gap-1.5 lg:gap-2 transition-opacity whitespace-nowrap pt-1 lg:pt-0 self-start shrink-0 justify-end sm:w-fit w-full">
                                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2.5 py-1 rounded border border-gray-100">
                                                                    {resp.questionType.replace('-', ' ')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-gray-400 text-sm italic py-20 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                            No responses match the selected filters.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserResponseView;
