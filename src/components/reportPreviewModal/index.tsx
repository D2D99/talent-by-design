import { Icon } from "@iconify/react";
import { useEffect, useRef } from "react";
import { Modal, initTWE } from "tw-elements";

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
  const modalRef = useRef<HTMLDivElement>(null);
  const modalInstance = useRef<any>(null);

  useEffect(() => {
    initTWE({ Modal });
  }, []);

  useEffect(() => {
    if (modalRef.current && !modalInstance.current) {
      modalInstance.current = Modal.getOrCreateInstance(modalRef.current);
    }
    const modalElement = modalRef.current;
    if (modalElement) {
      const handleHidden = () => onClose();
      modalElement.addEventListener("hidden.twe.modal", handleHidden);
      return () =>
        modalElement.removeEventListener("hidden.twe.modal", handleHidden);
    }
  }, [onClose]);

  useEffect(() => {
    if (show) {
      if (modalInstance.current) modalInstance.current.show();
    } else {
      if (modalInstance.current) modalInstance.current.hide();
    }
  }, [show]);

  return (
    <div
      ref={modalRef}
      data-twe-modal-init
      className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none font-sans"
      tabIndex={-1}
      aria-hidden="true"
      data-twe-backdrop="static"
    >
      <div
        data-twe-modal-dialog-ref
        className="pointer-events-none relative flex min-h-full w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-6xl mx-auto px-4 py-8"
      >
        <div className="pointer-events-auto relative flex w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-[var(--secondary-color)] text-lg tracking-tight leading-none">
                {type}
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-2 sm:px-4 py-1.5 rounded-full text-[var(--primary-color)] hover:bg-[#edf5fd] transition-all text-sm font-bold border border-[var(--primary-color)]/20 hover:border-[var(--primary-color)]"
                title="Sync Changes"
              >
                <Icon
                  icon={loading ? "line-md:loading-loop" : "solar:refresh-bold"}
                  width="18"
                />
                <span className="hidden sm:inline">
                  {loading ? "Re-generating..." : "Sync Changes"}
                </span>
              </button>

              <div className="w-px h-6 bg-gray-200" />

              <button
                type="button"
                onClick={() => modalInstance.current?.hide()}
                className="hover:text-neutral-500 text-neutral-800 transition-colors"
                aria-label="Close"
              >
                <Icon icon="material-symbols:close" width="24" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 bg-neutral-800 relative group overflow-hidden">
            {pdfUrl ? (
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full border-none"
                title="PDF Preview"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/50 gap-4">
                <Icon icon="line-md:loading-loop" width="48" />
                <p className="text-sm font-medium tracking-wide">
                  Generating preview...
                </p>
              </div>
            )}

            <div className="absolute top-4 right-4 bg-black/40 text-white/80 text-[10px] px-3 py-1.5 rounded-full backdrop-blur-md pointer-events-none group-hover:opacity-0 transition-opacity font-medium tracking-wide">
              Preview Model: pdfkit-table
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreviewModal;
