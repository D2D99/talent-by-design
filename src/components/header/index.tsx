import { useEffect, useState } from "react";
import Logo from "../../../public/static/img/home/logo.svg";
import { Collapse, Dropdown, initTWE } from "tw-elements";
import { Icon } from "@iconify/react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    initTWE({ Collapse, Dropdown });

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`flex-no-wrap sticky top-0 bg-white z-50  w-full items-center justify-between bg-[var(--white-color)] py-3 dark:bg-neutral-700 lg:flex-wrap lg:justify-start
        transition-all duration-300
        ${scrolled ? "shadow-md" : ""}`}
      >
        <div className="max-w-screen-2xl mx-auto  xl:px-10 px-4  ">
          <div className="flex w-full flex-wrap items-center justify-between">
            <img src={Logo} alt="logo" className="lg:hidden block" />

            <button
              className="block border-0 bg-transparent px-2 text-black/50 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200 lg:hidden"
              type="button"
              data-twe-collapse-init
              data-twe-target="#navbarSupportedContent1"
              aria-controls="navbarSupportedContent1"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="[&>svg]:w-7 [&>svg]:stroke-black/50 dark:[&>svg]:stroke-neutral-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 5.995C2 5.445 2.446 5 2.995 5H11.005C11.2689 5 11.522 5.10483 11.7086 5.29143C11.8952 5.47803 12 5.73111 12 5.995C12 6.25889 11.8952 6.51197 11.7086 6.69857C11.522 6.88517 11.2689 6.99 11.005 6.99H2.995C2.73111 6.99 2.47803 6.88517 2.29143 6.69857C2.10483 6.51197 2 6.25889 2 5.995ZM2 12C2 11.45 2.446 11.005 2.995 11.005H21.005C21.2689 11.005 21.522 11.1098 21.7086 11.2964C21.8952 11.483 22 11.7361 22 12C22 12.2639 21.8952 12.517 21.7086 12.7036C21.522 12.8902 21.2689 12.995 21.005 12.995H2.995C2.73111 12.995 2.47803 12.8902 2.29143 12.7036C2.10483 12.517 2 12.2639 2 12ZM2.995 17.01C2.73111 17.01 2.47803 17.1148 2.29143 17.3014C2.10483 17.488 2 17.7411 2 18.005C2 18.2689 2.10483 18.522 2.29143 18.7086C2.47803 18.8952 2.73111 19 2.995 19H15.005C15.2689 19 15.522 18.8952 15.7086 18.7086C15.8952 18.522 16 18.2689 16 18.005C16 17.7411 15.8952 17.488 15.7086 17.3014C15.522 17.1148 15.2689 17.01 15.005 17.01H2.995Z" fill="#1A3652"/>
</svg>
              </span>
            </button>

            <div
              className="!visible hidden flex-grow basis-[100%] items-center lg:!flex lg:basis-auto"
              id="navbarSupportedContent1"
              data-twe-collapse-item
            >
              <a
                className="mb-4 me-5 ms-2 mt-3 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mb-0 lg:mt-0"
                href="#"
              >
                <img src={Logo} alt="logo" className="lg:block hidden" />
              </a>

              <ul
                className="list-style-none mx-auto flex flex-col ps-0 lg:flex-row"
                data-twe-navbar-nav-ref
              >
                <li className="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
                  <a
                    className=" uppercase text-[var(--secondary-color)] transition duration-200 hover:text-black/80 hover:ease-in-out focus:text-black/80 active:text-black/80 motion-reduce:transition-none dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80 dark:active:text-white/80 lg:px-4 font-semibold"
                    href="#"
                    data-twe-nav-link-ref
                  >
                    About us
                  </a>
                </li>

                <li className="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
                  <a
                    className="uppercase text-[var(--secondary-color)] transition duration-200 hover:text-black/80 hover:ease-in-out focus:text-black/80 active:text-black/80 motion-reduce:transition-none dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80 dark:active:text-white/80 lg:px-4 font-semibold"
                    href="#"
                    data-twe-nav-link-ref
                  >
                    What We Offer
                  </a>
                </li>

                <li className="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
                  <a
                    className="uppercase text-[var(--secondary-color)] transition duration-200 hover:text-black/80 hover:ease-in-out focus:text-black/80 active:text-black/80 motion-reduce:transition-none dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80 dark:active:text-white/80 lg:px-4 font-semibold"
                    href="#"
                    data-twe-nav-link-ref
                  >
                    our process
                  </a>
                </li>

                <li className="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
                  <a
                    className="uppercase text-[var(--secondary-color)] transition duration-200 hover:text-black/80 hover:ease-in-out focus:text-black/80 active:text-black/80 motion-reduce:transition-none dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80 dark:active:text-white/80 lg:px-4 font-semibold"
                    href="#"
                    data-twe-nav-link-ref
                  >
                    Faq
                  </a>
                </li>

                <li className="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
                  <a
                    className="uppercase text-[var(--secondary-color)] transition duration-200 hover:text-black/80 hover:ease-in-out focus:text-black/80 active:text-black/80 motion-reduce:transition-none dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80 dark:active:text-white/80 lg:px-4 font-semibold"
                    href="#"
                    data-twe-nav-link-ref
                  >
                    Testimonial
                  </a>
                </li>

                <li>
                  <div className="relative lg:hidden block">
                    <button
                      type="button"
                      className="group text-white rounded-full py-2 pl-4 pr-1.5 flex items-center gap-1 font-semibold text-sm uppercase 
               bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)]"
                    >
                      contact
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
                className="group text-white rounded-full py-2 pl-4 pr-1.5 flex items-center gap-1 font-semibold text-sm uppercase 
               bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)]"
              >
                contact
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
