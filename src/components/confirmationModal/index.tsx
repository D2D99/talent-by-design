import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Modal } from "tw-elements";

const ProgressIcon = "/static/img/home/progress-icon.png";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  bodyTitle?: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  icon?: string | React.ReactNode;
  variant?: "danger" | "primary";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  bodyTitle,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  //   icon,
  //   variant = "danger",
}) => {
  const handleHidden = () => {
    onClose();
  };
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalInstance, setModalInstance] = useState<any>(null);

  useEffect(() => {
    let instance: any = null;
    const el = modalRef.current;

    if (el) {
      instance = Modal.getOrCreateInstance(el);
      setModalInstance(instance);
      el.addEventListener("hidden.twe.modal", handleHidden);
    }

    return () => {
      if (el) {
        el.removeEventListener("hidden.twe.modal", handleHidden);
      }
    };
  }, [onClose, handleHidden]); // added handleHidden to dependencies

  useEffect(() => {
    if (!modalInstance) return;

    if (isOpen) {
      modalInstance.show();
    } else {
      modalInstance.hide();
    }
  }, [isOpen, modalInstance]);

  return (
    <div
      ref={modalRef}
      data-twe-modal-init
      className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
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
            <h5 className="sm:text-xl text-lg text-[var(--secondary-color)] invisible font-bold">
              {title}
            </h5>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-800"
            >
              <Icon icon="material-symbols:close" width="24" />
            </button>
          </div>

          <div className="relative sm:py-8 py-4 px-4 grid place-items-center gap-4">
            <img src={ProgressIcon} alt="Progress Icon" width={80} />

            <div className="text-center">
              <h5 className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold">
                {bodyTitle || title}
              </h5>
              <div className="text-sm text-neutral-600 mt-2 max-w-md mx-auto">
                {message}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-neutral-200 py-4 px-4">
            <button
              type="button"
              onClick={onClose}
              className="group text-[var(--primary-color)] px-5 py-2 h-10 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase relative overflow-hidden z-0 duration-200 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/10 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="group relative overflow-hidden z-0 text-[var(--white-color)] px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
