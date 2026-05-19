import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
const ProgressIcon = "/static/img/home/progress-icon.png";

const SessionPopup = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const cleanupBackdrops = () => {
      // Remove stuck TW Elements backdrops (Modals, Offcanvas, etc.)
      const backdrops = document.querySelectorAll(
        "[data-twe-backdrop-show], [data-twe-modal-backdrop], .modal-backdrop, .offcanvas-backdrop"
      );
      backdrops.forEach((el) => (el as HTMLElement).remove());

      // Force reset body styles and classes that lock scrolling
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.body.classList.remove(
        "modal-open",
        "offcanvas-open",
        "overflow-hidden"
      );
    };

    const handleSessionExpired = () => {
      const path = window.location.pathname;
      if (path === "/" || path === "/login") return;

      cleanupBackdrops();
      setShow(true);
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () =>
      window.removeEventListener("session-expired", handleSessionExpired);
  }, []);

  useEffect(() => {
    if (show) {
      document.body.style.setProperty("overflow", "hidden", "important");
      document.documentElement.style.setProperty(
        "overflow",
        "hidden",
        "important"
      );
      document.body.style.setProperty("height", "100%", "important");
      document.documentElement.style.setProperty("height", "100%", "important");
    } else {
      document.body.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("overflow");
      document.body.style.removeProperty("height");
      document.documentElement.style.removeProperty("height");
    }
    return () => {
      document.body.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("overflow");
      document.body.style.removeProperty("height");
      document.documentElement.style.removeProperty("height");
    };
  }, [show]);

  const handleGoToLogin = () => {
    setShow(false);
    logout();
    navigate("/login");
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 overflow-hidden outline-none font-sans p-4"
      onTouchMove={(e) => e.preventDefault()}
      onWheel={(e) => e.preventDefault()}
    >
      <div className="relative w-full max-w-md mx-auto transition-all duration-300 ease-in-out transform scale-100 opacity-100">
        <div className="relative flex w-full flex-col rounded-2xl border-none bg-white text-current shadow-xl outline-none">
          {/* Modal Body */}
          <div className="relative p-8 text-center flex flex-col items-center">
            <div className="mb-6 flex items-center justify-center">
              <img src={ProgressIcon} alt="Warning Icon" width={80} />
            </div>

            <h5 className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold mb-3">
              Session Expired
            </h5>

            <p className="text-gray-600 leading-relaxed text-sm max-w-sm">
              Your session has ended. To keep your information secure, please
              log in again to continue working.
            </p>
          </div>

          {/* Modal Footer */}
          <div className="flex flex-shrink-0 flex-wrap items-center justify-center p-4 pt-0">
            <button
              onClick={handleGoToLogin}
              className="group relative overflow-hidden z-0 w-full text-[var(--white-color)] h-12 rounded-full flex justify-center items-center gap-2 font-bold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
            >
              <span>Login Again</span>
              <Icon icon="mynaui:arrow-right-circle-solid" width="22" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPopup;
