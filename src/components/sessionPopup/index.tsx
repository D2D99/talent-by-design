import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { Modal, initTWE } from "tw-elements";

const SessionPopup = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const modalInstance = useRef<any>(null);

  useEffect(() => {
    initTWE({ Modal });
  }, []);

  useEffect(() => {
    if (modalRef.current && !modalInstance.current) {
      modalInstance.current = Modal.getOrCreateInstance(modalRef.current);
    }
  }, []);

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
      modalInstance.current?.show();
    } else {
      modalInstance.current?.hide();
    }
  }, [show]);

  const handleGoToLogin = () => {
    setShow(false);
    logout();
    navigate("/login");
  };

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
        className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-md mx-auto px-4"
      >
        <div className="pointer-events-auto relative flex w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none">
          {/* Modal Header */}
          <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 border-b border-gray-100">
            <h5 className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold">
              Session Expired
            </h5>
          </div>

          {/* Modal Body */}
          <div className="relative p-8 text-center flex flex-col items-center">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <Icon
                icon="solar:danger-circle-bold"
                className="text-red-500 w-12 h-12"
              />
            </div>

            <p className="text-gray-600 leading-relaxed text-sm max-w-sm">
              Your session has ended. To keep your information secure, please log in
              again to continue working.
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
