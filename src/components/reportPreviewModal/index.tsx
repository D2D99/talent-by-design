import { Icon } from "@iconify/react";

interface ReportPreviewModalProps {
    show: boolean;
    onClose: () => void;
    pdfUrl: string | null;
    onRefresh: () => void;
    loading: boolean;
    type?: string;
}

const ReportPreviewModal = ({
    show,
    onClose,
    pdfUrl,
    onRefresh,
    loading,
    type = "Report Preview",
}: ReportPreviewModalProps) => {
    if (!show || !pdfUrl) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Modal Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#edf5fd] rounded-lg flex items-center justify-center text-[var(--primary-color)]">
                            <Icon icon="solar:document-bold-duotone" width="20" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#1a3652] text-sm tracking-tight">
                                {type}
                            </h3>
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                                Real-time layout validation
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onRefresh}
                            className="px-4 py-2 hover:bg-[#edf5fd] text-[var(--primary-color)] rounded-lg font-bold text-xs flex items-center gap-2 transition-all"
                            title="Refresh Preview"
                            disabled={loading}
                        >
                            <Icon
                                icon={loading ? "line-md:loading-loop" : "solar:refresh-bold"}
                                width="18"
                            />
                            {loading ? "Re-generating..." : "Sync Changes"}
                        </button>
                        <div className="w-px h-6 bg-gray-200 mx-2" />
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center hover:bg-red-50 text-red-500 rounded-xl transition-all"
                        >
                            <Icon icon="solar:close-square-bold" width="28" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 bg-neutral-800 relative group">
                    <iframe
                        src={`${pdfUrl}#toolbar=0&navpanes=0`}
                        className="w-full h-full border-none"
                        title="PDF Preview"
                    />

                    <div className="absolute top-4 right-4 bg-black/20 text-white/60 text-[9px] px-2 py-1 rounded-full backdrop-blur-sm pointer-events-none group-hover:opacity-0 transition-opacity">
                        Preview Model: pdfkit-table
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportPreviewModal;
