import { useEffect } from "react";
import Logo from "../../../public/static/img/home/logo.svg";
import { Collapse, Dropdown, initTWE } from "tw-elements";
import { Icon } from "@iconify/react";

const Header = () => {
  useEffect(() => {
    initTWE({ Collapse, Dropdown });
  }, []);

  return (
    <>

      <nav className="flex-no-wrap relative  w-full items-center justify-between bg-[var(--white-color)] py-3 dark:bg-neutral-700 lg:flex-wrap lg:justify-start">
        <div className="max-w-screen-2xl mx-auto px-10  ">
          <div className="flex w-full flex-wrap items-center justify-between">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </button>

            <div
              className="!visible hidden flex-grow basis-[100%] items-center lg:!flex lg:basis-auto"
              id="navbarSupportedContent1"
              data-twe-collapse-item
            >
              <a
                className="mb-4 me-5 ms-2 mt-3 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mb-0 lg:mt-0 "
                href="#"
              >
                <img src={Logo} alt="logo" />
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
              </ul>
            </div>
            <div className="relative">
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
