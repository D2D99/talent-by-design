import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import api from "../../services/axios";

interface ResponseData {
    _id: string;
    domain: string;
    subdomain: string;
    questionStem: string;
    questionType: string;
    value: number;
    comment: string | null;
}

interface UserResponseModalProps {
    isOpen: boolean;
    onClose: () => void;
    assessmentId: string | null;
    userName: string;
}

const UserResponseModal = ({
    isOpen,
    onClose,
    assessmentId,
    userName,
}: UserResponseModalProps) => {
    const [responses, setResponses] = useState<ResponseData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && assessmentId) {
            fetchResponses();
        }
    }, [isOpen, assessmentId]);

    const fetchResponses = async () => {
        setLoading(true);
        try {
            const res = await api.get<ResponseData[]>(`responses/${assessmentId}`);
            setResponses(res.data);
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Assessment Responses: <span className="text-[#448CD2]">{userName}</span>
                        </h2>
                        <p className="text-sm text-gray-500">
                            Detailed question-level feedback and logic-based comments
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Icon icon="material-symbols:close-rounded" width="24" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#448CD2]"></div>
                            <p className="text-gray-500 font-medium tracking-tight">Loading detailed responses...</p>
                        </div>
                    ) : responses.length > 0 ? (
                        <div className="space-y-4">
                            <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Domain / Subdomain</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Question</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Score</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Comments</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {responses.map((resp) => (
                                            <tr key={resp._id} className="hover:bg-blue-50/20 transition-colors">
                                                <td className="px-4 py-4 align-top">
                                                    <div className="text-xs font-bold text-[#448CD2] uppercase">{resp.domain}</div>
                                                    <div className="text-sm font-medium text-gray-800 mt-0.5">{resp.subdomain}</div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600 max-w-xs align-top">
                                                    {resp.questionStem}
                                                </td>
                                                <td className="px-4 py-4 text-[10px] font-bold uppercase tracking-tighter align-top">
                                                    <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded">
                                                        {resp.questionType.replace("-", " ")}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center align-top">
                                                    <span className={`inline-flex items-center justify-center size-8 rounded-lg font-bold ${resp.value <= 2 ? "bg-red-50 text-red-600 border border-red-100" :
                                                            resp.value === 3 ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                                                "bg-green-50 text-green-600 border border-green-100"
                                                        }`}>
                                                        {resp.value || "-"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm align-top">
                                                    {resp.value <= 2 ? (
                                                        <div className="flex gap-2">
                                                            {resp.comment ? (
                                                                <div className="bg-red-50/50 p-2 rounded-lg border border-red-100 flex gap-2">
                                                                    <Icon icon="solar:chat-round-line-bold" className="text-red-400 shrink-0 mt-0.5" width="16" />
                                                                    <span className="text-red-700 italic text-xs leading-relaxed">{resp.comment}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-300 italic text-xs">— No comment provided —</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-300 italic text-xs">N/A</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <Icon icon="solar:document-text-broken" width="48" />
                            <p className="mt-4 font-medium">No response data found for this assessment.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                    >
                        Close view
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserResponseModal;
