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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEditing]);

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

  const extractTextFromNode = (node: any): string => {
    if (typeof node === "string" || typeof node === "number")
      return String(node);
    if (Array.isArray(node)) return node.map(extractTextFromNode).join("");
    if (React.isValidElement(node) && node.props) {
      const children = (node.props as any).children;
      const childText = extractTextFromNode(children);
      if (
        typeof node.type === "string" &&
        (node.type === "p" || node.type === "div" || node.type === "br")
      ) {
        return childText + "\n\n";
      }
      return childText;
    }
    return "";
  };

  // Helper to get text representation of content for the editor
  const getTextForEditor = (resetToDefault = false) => {
    if (!resetToDefault && tooltips[id]?.content) return tooltips[id].content;
    if (typeof defaultContent === "string") return defaultContent;
    return extractTextFromNode(defaultContent).trim();
  };

  const handleOpenEdit = () => {
    setContent(getTextForEditor());
    setIsEditing(true);
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all tooltip content? This will make the tooltip show nothing unless you add new content.",
      )
    ) {
      setContent("");
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        id={id}
        className="text-gray-800 hover:text-[#448CD2] transition-colors"
        // title={isSuperAdmin ? "Hover to view, Click Edit to modify" : "Info"}
      >
        <Icon icon="ci:info" width="20" height="20" />
      </button>
      {!isEditing && (
        <Tooltip
          className="sm:max-w-xl max-w-80 sm:!text-base !text-sm z-[99] !p-4 !rounded-xl !bg-[#222] !opacity-100 shadow-2xl border border-gray-100"
          anchorSelect={`#${id}`}
          clickable
          delayHide={200}
        >
          <div className="flex flex-col gap-3">
            {typeof displayContent === "string"
              ? displayContent.split("\n\n").map((p, i) => (
                  <p key={i} className="leading-relaxed">
                    {p}
                  </p>
                ))
              : displayContent}

            {isSuperAdmin && (
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={handleOpenEdit}
                  className="text-[#448CD2] hover:text-[#3a76b1] text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 bg-blue-50 p-2 rounded-full transition-all"
                >
                  <Icon icon="lucide:pencil" width="14" />
                </button>
              </div>
            )}
          </div>
        </Tooltip>
      )}

      {isEditing && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4">
          <div className="pointer-events-auto relative flex w-full flex-col rounded-xl border-none bg-white bg-clip-padding text-current shadow-lg outline-none max-w-3xl mx-auto max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 sm:pb-0 pb-2">
              <div>
                <h5 className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold">
                  Edit Tooltip Content
                </h5>
                {/* <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  ID: <span className="text-[#448CD2]">{id}</span>
                </p> */}
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                aria-label="Close"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
              >
                <Icon icon="material-symbols:close" width="24" />
              </button>
            </div>

            <div className="relative sm:py-8 py-4 px-4 max-h-[calc(100vh-100px)] overflow-y-auto">
              <div className="mb-4">
                <div className="flex justify-between items-end mb-2 px-1">
                  <label className="block font-bold text-sm text-gray-700">
                    Content Editor
                  </label>
                  <div className="flex gap-2.5">
                    <button
                      onClick={handleClearAll}
                      className="text-red-500 hover:text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
                    >
                      <Icon
                        icon="solar:trash-bin-trash-outline"
                        width="12"
                        height="12"
                      />
                      <span className="sm:block hidden">Clear All</span>
                    </button>
                    <button
                      onClick={() => setContent(getTextForEditor(true))}
                      className="text-[#448CD2] hover:text-[#3a76b1] text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
                    >
                      <Icon icon="solar:refresh-bold-duotone" width="12" />
                      <span className="sm:block hidden">Reset Default</span>
                    </button>
                  </div>
                </div>
                <textarea
                  className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] disabled:bg-gray-100 disabled:pointer-events-none
              "
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter tooltip content here..."
                  autoFocus
                />
                {/* <p className="text-[10px] text-gray-400 mt-3 px-1 italic flex items-center gap-1.5">
                  <Icon
                    icon="solar:info-circle-bold-duotone"
                    width="14"
                    className="text-[#448CD2]"
                  />
                  Use double newlines (Enter twice) to separate paragraphs.
                </p> */}
              </div>
            </div>

            <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 gap-2 bg-white">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="group text-[var(--primary-color)] px-5 py-2 h-10 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase relative overflow-hidden z-0 duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/10 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="group relative overflow-hidden z-0 text-[var(--white-color)] px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10 disabled:pointer-events-none"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableTooltip;
