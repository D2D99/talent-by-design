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
        if (e.key === 'Enter' && addBulletedNewline) {
            e.preventDefault();
            const cursorPosition = e.currentTarget.selectionStart;
            const textBefore = value.substring(0, cursorPosition);
            const textAfter = value.substring(cursorPosition);

            // Check if current line is already empty or just a bullet
            const lines = textBefore.split('\n');
            const lastLine = lines[lines.length - 1].trim();

            let insertion = '\n• ';
            if (lastLine === '' || lastLine === '•') {
                // If they press enter on an empty bulleted line, maybe they want to end the list? 
                // For now, let's stick to the user's request: "automatically a dot come"
            }

            const newValue = textBefore + insertion + textAfter;
            setter(newValue);

            // Set cursor position after the bullet
            setTimeout(() => {
                const newPos = cursorPosition + insertion.length;
                e.currentTarget.setSelectionRange(newPos, newPos);
            }, 0);
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
