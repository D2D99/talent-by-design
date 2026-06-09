import { useState, useEffect } from "react";
import BackToTopImg from "../../../public/static/img/b2t.png";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          type="button"
          className="fixed bottom-6 right-6 z-50 transition-opacity duration-300"
          onClick={scrollToTop}
        >
          <img src={BackToTopImg} alt="Back to Top" className="size-14" />
        </button>
      )}
    </>
  );
}
