import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Tooltip } from "react-tooltip";
import { useTooltipContext } from "../../context/TooltipContext";
import { useAuth } from "../../context/useAuth";
import { toast } from "react-toastify";

interface EditableTooltipProps {
    id: string;
    defaultContent: string | React.ReactNode;
    className?: string;
}

const EditableTooltip: React.FC<EditableTooltipProps> = ({
    id,
    defaultContent,
    className = "",
}) => {
    const { tooltips, updateTooltip } = useTooltipContext();
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (tooltips[id]) {
            setContent(tooltips[id].content);
        } else if (typeof defaultContent === "string") {
            setContent(defaultContent);
        }
    }, [tooltips, id, defaultContent]);

    const userRole = user?.role?.toLowerCase();
    const isSuperAdmin = userRole === "superadmin" || userRole === "super_admin";

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateTooltip(id, content);
            toast.success("Tooltip updated successfully");
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to update tooltip");
        } finally {
            setLoading(false);
        }
    };

    const displayContent = tooltips[id]?.content || defaultContent;

    // Helper to get text representation of content for the editor
    const getTextForEditor = () => {
        if (tooltips[id]?.content) return tooltips[id].content;
        if (typeof defaultContent === "string") return defaultContent;
        // If it's a ReactNode, we can't easily convert to string, so we'll leave it empty unless we convert the source.
        return "";
    };

    const handleOpenEdit = () => {
        setContent(getTextForEditor());
        setIsEditing(true);
    };

    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to clear all tooltip content? This will make the tooltip show nothing unless you add new content.")) {
            setContent("");
        }
    };

    return (
        <div className={`flex items-center ${className}`}>
            <button
                type="button"
                id={id}
                className="text-gray-400 hover:text-[#448CD2] transition-colors"
                title={isSuperAdmin ? "Hover to view, Click Edit to modify" : "Info"}
            >
                <Icon icon="ci:info" width="20" height="20" />
            </button>
            <Tooltip
                className="text-center sm:max-w-xl max-w-80 sm:!text-sm !text-xs z-[9999] !p-4 !rounded-xl !bg-white !text-gray-800 shadow-2xl border border-gray-100"
                anchorSelect={`#${id}`}
                clickable
            >
                <div className="flex flex-col gap-3">
                    {typeof displayContent === "string" ? (
                        displayContent.split("\n\n").map((p, i) => (
                            <p key={i} className="leading-relaxed">
                                {p}
                            </p>
                        ))
                    ) : (
                        displayContent
                    )}

                    {isSuperAdmin && (
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={handleOpenEdit}
                                className="text-[#448CD2] hover:text-[#3a76b1] text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full transition-all"
                            >
                                <Icon icon="lucide:pencil" width="12" />
                                Edit Tooltip
                            </button>
                        </div>
                    )}
                </div>
            </Tooltip>

            {isEditing && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-black text-[#1A3652] uppercase tracking-tight">
                                    Edit Tooltip Content
                                </h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                    ID: <span className="text-[#448CD2]">{id}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors bg-white p-2 rounded-full hover:bg-gray-100"
                            >
                                <Icon icon="material-symbols:close" width="24" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-4">
                                <div className="flex justify-between items-end mb-2 px-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        Content Editor
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleClearAll}
                                            className="text-red-500 hover:text-red-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-1"
                                        >
                                            <Icon icon="solar:trash-bin-trash-bold-duotone" width="12" />
                                            Clear All
                                        </button>
                                        <button
                                            onClick={() => setContent(typeof defaultContent === "string" ? defaultContent : "")}
                                            className="text-[#448CD2] hover:text-[#3a76b1] text-[9px] font-black uppercase tracking-widest flex items-center gap-1"
                                        >
                                            <Icon icon="solar:refresh-bold-duotone" width="12" />
                                            Reset Default
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    className="w-full border-2 border-gray-100 rounded-xl p-4 min-h-[250px] text-sm font-medium text-gray-700 outline-none focus:border-[#448CD2] focus:ring-4 focus:ring-blue-50 transition-all resize-none shadow-inner"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Enter tooltip content here..."
                                    autoFocus
                                />
                                <p className="text-[10px] text-gray-400 mt-3 px-1 italic flex items-center gap-1.5">
                                    <Icon icon="solar:info-circle-bold-duotone" width="14" className="text-[#448CD2]" />
                                    Use double newlines (Enter twice) to separate paragraphs.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="bg-gradient-to-r from-[#1A3652] to-[#448CD2] text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? (
                                        <Icon icon="line-md:loading-loop" width="14" />
                                    ) : (
                                        <Icon icon="solar:diskette-bold-duotone" width="16" />
                                    )}
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditableTooltip;
