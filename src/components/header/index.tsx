import { useEffect, useState } from "react";
const Logo = "/static/img/POD-logo.svg";
import { Collapse, Dropdown, initTWE } from "tw-elements";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
// import { useNavigate } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { token, user } = useAuth();
  const isSessionActive = !!(token && user);

  useEffect(() => {
    initTWE({ Collapse, Dropdown });

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = useNavigate();
  const handleClick = () => {
    if (isSessionActive) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const navLinkClasses =
    "uppercase text-[var(--secondary-color)] transition duration-200 hover:text-black/80 hover:ease-in-out focus:text-black/80 active:text-black/80 motion-reduce:transition-none lg:px-4 font-semibold";

  const ctaButtonClasses =
    "group rounded-full py-2 pl-4 pr-1.5 flex items-center gap-1 font-semibold text-sm uppercase transition-all text-white bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)] hover:opacity-90";

  return (
    <>
      <nav
        className={`flex-no-wrap sticky top-0 z-50 w-full items-center justify-between py-3 lg:flex-wrap lg:justify-start transition-all duration-300 bg-white/80 backdrop-blur-md ${scrolled ? "shadow-md" : "shadow-none"
          }`}
      >
        <div className="max-w-screen-2xl mx-auto  xl:px-10 px-4  ">
          <div className="flex w-full flex-wrap items-center justify-between">
            <a href="/" className="lg:hidden block">
              <img src={Logo} alt="logo" className="h-20 w-auto" />
            </a>

            <button
              className="block border-0 bg-transparent px-2 text-black/50 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 lg:hidden"
              type="button"
              data-twe-collapse-init
              data-twe-target="#navbarSupportedContent1"
              aria-controls="navbarSupportedContent1"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="w-6 h-5 relative flex flex-col justify-center items-start">
                <span
                  className={`absolute h-[2px] w-full bg-black/50 rounded-full transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "rotate-45" : "-translate-y-2"}`}
                />
                <span
                  className={`absolute h-[2px] w-1/2 bg-black/50 rounded-full transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}
                />
                <span
                  className={`absolute h-[2px] w-full bg-black/50 rounded-full transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "-rotate-45" : "translate-y-2"}`}
                />
              </div>
            </button>

            <div
              className="!visible hidden flex-grow basis-[100%] items-center lg:!flex lg:basis-auto mt-3 lg:mt-0 p-0 rounded-lg lg:rounded-none lg:bg-transparent lg:border-none "
              id="navbarSupportedContent1"
              data-twe-collapse-item
            >
              <a
                className="mb-4 me-5 ms-2 mt-3 items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 lg:mb-0 lg:mt-0 lg:flex hidden"
                href="/"
              >
                <img src={Logo} alt="logo" className="h-20 w-auto" />
              </a>

              <ul
                className="list-style-none mx-auto flex flex-col ps-0 lg:flex-row mt-4 lg:mt-0"
                data-twe-navbar-nav-ref
              >
                <li className="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
                  <a
                    className={navLinkClasses}
                    href="/what-we-offer"
                    data-twe-nav-link-ref
                  >
                    What We Offer
                  </a>
                </li>

                <li className="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
                  <a
                    className={navLinkClasses}
                    href="/our-process"
                    data-twe-nav-link-ref
                  >
                    our process
                  </a>
                </li>

                <li className="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
                  <a
                    className={navLinkClasses}
                    href="/faq"
                    data-twe-nav-link-ref
                  >
                    Faq
                  </a>
                </li>

                <li className="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
                  <a
                    className={navLinkClasses}
                    href="/pricing"
                    data-twe-nav-link-ref
                  >
                    Pricing
                  </a>
                </li>

                <li className="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
                  <a
                    className={navLinkClasses}
                    href="/about-us"
                    data-twe-nav-link-ref
                  >
                    About us
                  </a>
                </li>

                <li>
                  <div className="relative lg:hidden block">
                    <button
                      type="button"
                      className={ctaButtonClasses}
                      onClick={handleClick}
                    // data-twe-toggle="modal"
                    // data-twe-target="#exampleModalCenter"
                    // data-twe-ripple-init
                    // data-twe-ripple-color="light"
                    >
                      {isSessionActive ? "Access POD-360™" : "Login"}
                      <Icon
                        icon="mynaui:arrow-right-circle-solid"
                        width="20"
                        height="20"
                        className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                      />
                    </button>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative lg:block hidden">
              <button
                type="button"
                className={ctaButtonClasses}
                onClick={handleClick}
              // data-twe-toggle="modal"
              // data-twe-target="#exampleModalCenter"
              // data-twe-ripple-init
              // data-twe-ripple-color="light"
              >
                {isSessionActive ? "Access POD-360™" : "Login"}
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="20"
                  height="20"
                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
