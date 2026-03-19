import React, { useState, useEffect } from "react";
import api from "../../services/axios";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";

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
    };
    onSuccess: () => void;
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
}) => {
    const [insight, setInsight] = useState("");
    const [coachingTips, setCoachingTips] = useState("");
    const [recommendedPrograms, setRecommendedPrograms] = useState("");
    const [modelDescription, setModelDescription] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setInsight(rawFeedback?.insight || "");
            setCoachingTips(rawFeedback?.coachingTips || "");
            setRecommendedPrograms(rawFeedback?.recommendedPrograms || "");
            setModelDescription(rawFeedback?.modelDescription || "");
        }
    }, [isOpen, rawFeedback]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, setter: React.Dispatch<React.SetStateAction<string>>, value: string, addBulletedNewline: boolean) => {
        if (!addBulletedNewline) return;

        if (e.key === 'Enter') {
            e.preventDefault();
            const cursorPosition = e.currentTarget.selectionStart;
            const textBefore = value.substring(0, cursorPosition);

            const linesBefore = textBefore.split('\n');
            const currentLine = linesBefore[linesBefore.length - 1];

            let newValue = value;
            let cursorOffset = 0;

            // If the current line where Enter was pressed DOESN'T have a bullet, add one to it!
            // This prevents the line from disappearing on the frontend (since we filter for bullets).
            if (currentLine.trim().length > 0 && !currentLine.trim().startsWith('•')) {
                const lineStartPos = textBefore.lastIndexOf('\n') + 1;
                newValue = value.substring(0, lineStartPos) + '• ' + value.substring(lineStartPos);
                cursorOffset = 2;
            }

            const updatedCursorPos = cursorPosition + cursorOffset;
            const finalBefore = newValue.substring(0, updatedCursorPos);
            const finalAfter = newValue.substring(updatedCursorPos);
            const insertion = '\n• ';

            setter(finalBefore + insertion + finalAfter);

            setTimeout(() => {
                const newPos = updatedCursorPos + insertion.length;
                e.currentTarget.setSelectionRange(newPos, newPos);
            }, 0);
        } else if (value === '' && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            // Automatically add a bullet if typing the first character in an empty field
            e.preventDefault();
            setter('• ' + e.key);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.put("dashboard/detailed-insight", {
                domain,
                subdomain,
                userId,
                email: userEmail,
                insight,
                coachingTips,
                recommendedPrograms,
                modelDescription
            });
            toast.success("Feedback updated successfully!");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error updating feedback:", error);
            toast.error("Failed to update feedback.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col hide-scrollbar">
                <div className="p-5 border-b flex justify-between items-center bg-[#f8fafc] rounded-t-xl">
                    <h2 className="text-xl font-bold text-[#1A3652]">
                        Edit Feedback: {subdomain || domain}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-black transition-colors"
                    >
                        <Icon icon="ion:close-round" width="24" height="24" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex flex-col gap-6 hide-scrollbar flex-1">


                    <div>
                        <label className="block text-sm font-bold text-[#1a3652] mb-2">
                            Pod 360 Model Items (Bullets below Triangle)
                        </label>
                        <p className="text-[10px] text-gray-400 mb-1">Press Enter to automatically add a bullet (•).</p>
                        <textarea
                            value={modelDescription}
                            onChange={(e) => setModelDescription(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, setModelDescription, modelDescription, true)}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-[#448cd2] focus:ring-1 focus:ring-[#448cd2]"
                            placeholder="Capability, Engagement, Confidence..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#1a3652] mb-2">
                            Insight for Domain (Main Text)
                        </label>
                        <p className="text-[10px] text-gray-400 mb-1">Press Enter to automatically add a bullet (•).</p>
                        <textarea
                            value={insight}
                            onChange={(e) => setInsight(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, setInsight, insight, true)}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-[#448cd2] focus:ring-1 focus:ring-[#448cd2]"
                            placeholder="Enter insights here..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#1a3652] mb-2">
                            Objectives & Key Results (Coaching Tips)
                        </label>
                        <p className="text-[10px] text-gray-400 mb-1">Press Enter to automatically add a bullet (•).</p>
                        <textarea
                            value={coachingTips}
                            onChange={(e) => setCoachingTips(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, setCoachingTips, coachingTips, true)}
                            rows={5}
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-[#448cd2] focus:ring-1 focus:ring-[#448cd2]"
                            placeholder="Enter objectives/tips here..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#1a3652] mb-2">
                            Talent By Design Recommended Offering
                        </label>
                        <p className="text-[10px] text-gray-400 mb-1">Press Enter to automatically add a bullet (•).</p>
                        <textarea
                            value={recommendedPrograms}
                            onChange={(e) => setRecommendedPrograms(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, setRecommendedPrograms, recommendedPrograms, true)}
                            rows={5}
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-[#448cd2] focus:ring-1 focus:ring-[#448cd2]"
                            placeholder="Enter recommendations here..."
                        />
                    </div>
                </div>

                <div className="p-5 border-t flex justify-end gap-3 bg-[#f8fafc] rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg font-semibold text-gray-600 bg-white border hover:bg-gray-50 transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg font-semibold text-white bg-[#1a3652] hover:bg-[#112335] transition-colors flex items-center gap-2"
                    >
                        {loading ? (
                            <Icon icon="eos-icons:loading" width="20" height="20" />
                        ) : (
                            <Icon icon="material-symbols:save" width="20" height="20" />
                        )}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackEditorModal;
