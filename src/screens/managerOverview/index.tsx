import { Icon } from "@iconify/react";
import GraphImg from "../../../public/static/img/home/scroe-domain-graph11.svg";
import Streamline from "../../../public/static/img/home/streamline-plump_graph-bar-increase.svg";
import IconStar from "../../../public/static/img/icons/ic-star.svg";
import Hugeicons from "../../../public/static/img/home/hugeicons_target-02.svg";

const ManagerOverview = () => {
  return (
    <div>
      <div className="flex items-center justify-between bg-white border border-[#448CD2] border-opacity-20 shadow-[0px_0px_5px_0px_#4B9BE980] p-6 rounded-[12px]">
        <div>
          <h3 className="text-2xl font-bold text-[var(--secondary-color)] ">
            Welcome back, Suzanna De S!
          </h3>
          <p className="text-sm font-normal text-[var(--secondary-color)] mt-1 ">
            Complete platform oversight with real-time performance insights,
            user activity, and priority actions requiring your attention.
          </p>
        </div>
        <div className="relative">
          <button type="button">
            <Icon icon="tabler:bell" width="28" height="28" />
          </button>
          <p className="w-[6px] h-[6px] bg-[#FF0000] rounded-full absolute top-0 right-[8px] border border-white"></p>
        </div>
      </div>

      <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[0px_0px_5px_0px_#4B9BE980] p-6 rounded-[12px] mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-[var(--secondary-color)] ">
              Overview
            </h3>
          </div>
          <div>
            <button
              type="button"
              className="group text-white rounded-full py-2.5 pl-7 pr-3.5 flex items-center gap-1.5 font-semibold sm:text-lg text-base uppercase bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)]"
            >
              Export report
              <Icon
                icon="mynaui:arrow-right-circle-solid"
                width="24"
                height="24"
                className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
              />
            </button>
          </div>
        </div>
        <div className="mt-6">
          <img src={GraphImg} className="w-full" alt="graph" />
        </div>
        <div className="grid grid-cols-2 gap-6 mt-8">
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] bg-[#448bd21c]">
            <div className="flex items-center justify-between ">
              <div>
                <h3 className="text-xl font-bold text-[var(--secondary-color)] capitalize ">
                  Insight for psychological safety
                </h3>
                <p className="text-sm font-normal text-[var(--secondary-color)] mt-1">
                  Lorem ipsum dolor sit
                </p>
              </div>
              <div>
                <img src={Streamline} alt="images" />
              </div>
            </div>
            <div>
              <ul className="mt-4 space-y-2">
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span className="text-sm text-[var(--secondary-color)] font-normal">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />{" "}
                  <span className="text-sm text-[var(--secondary-color)] font-normal">Lorem Ipsum is simply dummy text</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />{" "}
                  <span className="text-sm text-[var(--secondary-color)] font-normal">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />{" "}
                  <span className="text-sm text-[var(--secondary-color)] font-normal">Lorem Ipsum is simply dummy text</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />{" "}
                  <span className="text-sm text-[var(--secondary-color)] font-normal">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />{" "}
                  <span className="text-sm text-[var(--secondary-color)] font-normal">Lorem Ipsum is simply dummy text</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-[1px] border-[#448CD2] border-opacity-20 p-4 rounded-[12px] ">
            <div className="flex items-center justify-between ">
              <div>
                <h3 className="text-xl font-bold text-[var(--secondary-color)] capitalize ">
                  Objectives and Key Results
                </h3>
                <p className="text-sm font-normal text-[var(--secondary-color)] mt-1">
                 Improve analytical problem solving skills
                </p>
              </div>
              <div>
                <img src={Hugeicons} alt="images" />
              </div>
            </div>
            <div>
            
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ManagerOverview;
