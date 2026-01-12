import FooterLogo from "../../../public/static/img/home/footer-logo.svg";
import Facebook from "../../../public/static/img/icons/facebook-icon.svg";
import Instagram from "../../../public/static/img/icons/instagram-icon.svg";
import Twitter from "../../../public/static/img/icons/twitter.svg";
import Linkedin from "../../../public/static/img/icons/linkedin.png";
import CallIcon from "../../../public/static/img/icons/phone-icon.svg";
import GmailIcon from "../../../public/static/img/icons/gmail-icon.svg";
import LocationIcon from "../../../public/static/img/icons/location-icon.svg";
import HomeIcon from "../../../public/static/img/icons/home-icon.svg";
import { Icon } from "@iconify/react";
const Footer = () => {
  return (
    


    
    <div className="bg-[var(--black-color)] pt-16 pb-6 rounded-tl-[40px] rounded-tr-[40px] rounded-bl-none rounded-br-none">
      <div className="max-w-screen-2xl mx-auto xl:px-10 px-4">
        <div className="flex lg:flex-nowrap flex-wrap gap-10 justify-between">
          <div className="">
            <img src={FooterLogo} alt="logo" />
            <p className="text-xs font-normal text-[var(--white-color)] mt-3 lg:max-w-xs">
              ©2025 <strong>TALENT BY DESIGN COLLECTIVE Inc.</strong> All rights
              reserved.
            </p>
            <h3 className="uppercase font-bold text-lg text-[var(--white-color)] mt-4">
              Follow us
            </h3>
            <ul className="flex gap-3 mt-4">
              <li>
                <a href="">
                  <img src={Facebook} alt="facebook icon" />
                </a>
              </li>
              <li>
                <a href="">
                  <img src={Instagram} alt="instagram icon" />
                </a>
              </li>
              <li>
                <a href="">
                  <img src={Twitter} alt="twitter icon" />
                </a>
              </li>
              <li>
                <a href="">
                  <img src={Linkedin} alt="linkedin icon" />
                </a>
              </li>
            </ul>
          </div>
          <div className="flex justify-between md:flex-nowrap flex-wrap lg:w-7/12 w-full xl:pe-32 lg:pe-16">
            <div>
              <h3 className="uppercase font-bold md:text-lg text-base text-[var(--white-color)] mt-4 mb-3">
                Quick links
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <a
                    href="#"
                    className="text-sm font-normal mt-1 max-w-3xl text-[var(--white-color)] "
                  >
                    Lorem
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm font-normal mt-1 max-w-3xl text-[var(--white-color)] "
                  >
                    Lorem
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm font-normal mt-1 max-w-3xl text-[var(--white-color)] "
                  >
                    Lorem
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm font-normal mt-1 max-w-3xl text-[var(--white-color)] "
                  >
                    Lorem
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm font-normal mt-1 max-w-3xl text-[var(--white-color)] "
                  >
                    Lorem
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm font-normal mt-1 max-w-3xl text-[var(--white-color)] "
                  >
                    Lorem
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="uppercase font-bold md:text-lg text-base text-[var(--white-color)] mt-4 mb-3">
                Legal
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <a
                    href="#"
                    className="text-sm font-normal mt-1 max-w-3xl text-[var(--white-color)] "
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm font-normal mt-1 max-w-3xl text-[var(--white-color)]"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm font-normal mt-1 max-w-3xl text-[var(--white-color)] "
                  >
                    AGB
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm font-normal mt-1 max-w-3xl text-[var(--white-color)] "
                  >
                    EGB
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="uppercase font-bold md:text-lg text-base text-[var(--white-color)] mt-4 mb-3">
                Contact
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <a
                    href="tel:6047858966"
                    className="flex gap-2 items-center text-sm font-normal mt-1 max-w-3xl text-[var(--white-color)]"
                  >
                    <img src={CallIcon} alt="call icon" />
                    <span>6047858966</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@tbdcollective.ca"
                    className="flex gap-2 items-center text-sm font-normal mt-1 max-w-3xl text-[var(--white-color)] "
                  >
                    <img src={GmailIcon} alt="gmail icon" />
                    <span>info@tbdcollective.ca</span>
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    className="flex gap-2 items-center text-sm font-normal mt-1 max-w-3xl text-[var(--white-color)] "
                  >
                    <img src={LocationIcon} alt="location icon" />
                    <span>Virtually Everywhere</span>
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    className="flex gap-2 items-start text-sm font-normal mt-1 max-w-3xl text-[var(--white-color)] "
                  >
                    <img src={HomeIcon} alt="call icon" />
                    <span>
                      Vancouver, BC <br />
                      Kelowna, BC <br /> Edmonton, AB
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex justify-between md:flex-nowrap md:gap-0 gap-3 flex-wrap border-t border-[#ffffff38] mt-8 pt-8">
          <div>
            <h2 className="md:text-2xl text-xl max-w-48 font-bold text-[var(--white-color)]">
              Subscribe to Our Newsletter!
            </h2>
          </div>
          <div className="flex items-center max-w-md w-full md:gap-3 md:flex-nowrap flex-wrap gap-3">
            <div className="flex-grow">
              <form action="">
                <input
                  type="email"
                  className="py-2 pl-4 pr-7 w-full
                    border border-white
                    bg-gradient-to-r
  from-[rgba(68,140,210,0.12)]
  to-[rgba(68,140,210,0.02)] text-white rounded-full bg-transparent max-w-80 outline-0"
                  placeholder="email@yourmail.com"
                />
              </form>
            </div>
            <div>
              <button
                type="button"
                className="mx-auto group text-[var(--black-color)] rounded-full py-2.5 pl-4 pr-3.5 flex items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r bg-[var(--white-color)]"
              >
                Subscribe
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="24"
                  height="24"
                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>


  );
};

export default Footer;
