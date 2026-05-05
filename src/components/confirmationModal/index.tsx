import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <div className="flex flex-col items-center text-center">
                            {/* Warning Icon */}
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                                <Icon icon="solar:shield-warning-bold-duotone" width="40" />
                            </div>

                            <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
                            <p className="mb-8 text-sm leading-relaxed text-gray-500">
                                {message}
                            </p>

                            <div className="flex w-full gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 rounded-full border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                                    disabled={loading}
                                >
                                    {cancelText}
                                </button>
                                <button
                                    type="button"
                                    onClick={onConfirm}
                                    disabled={loading}
                                    className="flex-1 relative overflow-hidden rounded-full bg-gradient-to-r from-red-500 to-red-600 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Icon icon="line-md:loading-loop" width="18" />
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        confirmText
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
