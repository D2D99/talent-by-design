import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const SessionPopup = () => {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const cleanupBackdrops = () => {
            // Remove stuck TW Elements backdrops (Modals, Offcanvas, etc.)
            const backdrops = document.querySelectorAll(
                '[data-twe-backdrop-show], [data-twe-modal-backdrop], .modal-backdrop, .offcanvas-backdrop'
            );
            backdrops.forEach(el => el.remove());

            // Force reset body styles and classes that lock scrolling
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
            document.body.classList.remove('modal-open', 'offcanvas-open', 'overflow-hidden');
        };

        const handleSessionExpired = () => {
            const path = window.location.pathname;
            if (path === "/" || path === "/login") return;

            cleanupBackdrops();
            setShow(true);
        };

        window.addEventListener("session-expired", handleSessionExpired);
        return () => window.removeEventListener("session-expired", handleSessionExpired);
    }, []);

    const handleGoToLogin = () => {
        setShow(false);
        logout();
        navigate("/login");
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-[#448CD222]">
                <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon icon="solar:danger-circle-bold" className="text-red-500 w-12 h-12" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Expired</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Your session has ended. To keep your information secure, please log in again to continue working.
                </p>

                <button
                    onClick={handleGoToLogin}
                    className="w-full py-3 px-6 bg-gradient-to-r from-[#1a3652] to-[#448bd2] text-white rounded-full font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                    <span>Login Again</span>
                    <Icon icon="mynaui:arrow-right-circle-solid" width="22" />
                </button>
            </div>
        </div>
    );
};

export default SessionPopup;
