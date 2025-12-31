import { Icon } from "@iconify/react";
import Header from "../../components/header";
import IconStar from "../../../public/static/img/icons/ic-star.svg";
// import Marquee from "react-fast-marquee";
// import IcMarquee1 from "../../../public/static/img/home/Ic-Marquee-1.svg";
// import IcMarquee2 from "../../../public/static/img/home/Ic-Marquee-2.svg";
// import IcMarquee3 from "../../../public/static/img/home/Ic-Marquee-3.svg";
// import IcMarquee4 from "../../../public/static/img/home/Ic-Marquee-4.svg";
// import IcMarquee5 from "../../../public/static/img/home/Ic-Marquee-5.svg";
// import IcMarquee6 from "../../../public/static/img/home/Ic-Marquee-6.svg";
import Number1 from "../../../public/static/img/home/number-img-01.png";
import Number2 from "../../../public/static/img/home/number-img-02.png";
import Number3 from "../../../public/static/img/home/number-img-03.png";
import Number4 from "../../../public/static/img/home/number-img-04.png";
import Post1 from "../../../public/static/img/home/post-1.png";
import Post2 from "../../../public/static/img/home/post-2.png";
import Post3 from "../../../public/static/img/home/post-3.png";
import Identifies from "../../../public/static/img/home/identifies.png";
import Identifies1 from "../../../public/static/img/home/identifies-1.png";
import DigitalLeader from "../../../public/static/img/home/digital-leader.png";
import Access1 from "../../../public/static/img/icons/access1.svg";
import Access2 from "../../../public/static/img/icons/access2.svg";
import Access3 from "../../../public/static/img/icons/access3.svg";
import Access4 from "../../../public/static/img/icons/access4.svg";
import Workplace from "../../../public/static/img/icons/workplace.svg";
import CapabilityPerformance from "../../../public/static/img/home/capability-performance.png";
import Footer from "../../components/footer";

const Home = () => {
  return (
    <>
      {/* Annoucement Bar Start */}
      <div className="bg-[var(--primary-color)] py-3 ">
        <div className="max-w-screen-2xl mx-auto px-10  ">
          <div className="flex items-center justify-self-end gap-5">
            <div className="flex items-center gap-1">
              <Icon
                icon="material-symbols:mail"
                className="text-[var(--white-color)]"
                width="15"
                height="15"
              />
              <a
                href="mailto:info@tbdcollective.ca"
                className="text-xs font-normal text-[var(--white-color)]"
              >
                info@tbdcollective.ca
              </a>
            </div>
            <div className="flex items-center gap-1">
              <Icon
                icon="material-symbols:call"
                className="text-[var(--white-color)]"
                width="15"
                height="15"
              />
              <a
                href="tel:+16047858966"
                className="text-xs font-normal text-[var(--white-color)]"
              >
                604 785 8966
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Annoucement Bar End */}
      <Header />
      {/* Hero Section Start */}
      <div className="pt-20  bg-contain bg-top bg-no-repeat" id="hero-bg">
        <div className="max-w-5xl mx-auto text-center">
          <h4 className="text-base font-bold text-[var(--dark-primary-color)] uppercase">
            TRUSTED STRATEGIC PARTNER FOR THE MODERN WORKPLACE
          </h4>
          <h1 className="mt-5 max-w-4xl mx-auto text-6xl font-bold text-[var(--dark-primary-color)] uppercase">
            Clarity for Leaders. Stability for Teams. Readiness for the Future.
          </h1>
          <p className="text-xl text-[var(--dark-primary-color)] font-medium mt-2.5 mb-10   ">
            Talent By Design Collective helps organizations build the
            capabilities and resilience needed to thrive in continuous change,
            make smart data-informed decisions and mitigate risk where it
            matters most.
          </p>
          <div className="flex justify-center gap-5">
            <button
              type="button"
              className="group text-white rounded-full py-2.5 pl-7 pr-3.5 flex items-center gap-1.5 font-semibold text-lg uppercase 
               bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)]"
            >
              Let’s Talk
              <Icon
                icon="mynaui:arrow-right-circle-solid"
                width="24"
                height="24"
                className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
              />
            </button>
            <button
              type="button"
              className="group text-[var(--primary-color)] rounded-full py-2.5 pl-7 pr-3.5 flex items-center gap-1.5 font-semibold text-lg uppercase 
               bg-gradient-to-r bg-[var(--white-color)] border-solid border-[var(--primary-color)] border"
            >
              Learn More
              <Icon
                icon="mynaui:arrow-right-circle-solid"
                width="24"
                height="24"
                className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
              />
            </button>
          </div>

          <div className="flex justify-center items-center mt-16">
            <div className="flex justify-center items-center outline-1 outline p-3.5 outline-[#448cd24a] rounded-md ">
              <div className="">
                {/* YouTube Embed with iframe */}
                <iframe
                  className="rounded-md"
                  width="840"
                  height="472"
                  src="https://www.youtube.com/embed/u31qwQUeGuM?si=Mz7d_njVcf_gIphX"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Hero Section End */}

      {/* Data Highlights Section Start */}
      <div className="pt-28 pb-20">
        <div className="max-w-screen-2xl mx-auto px-10">
          <h4 className="text-lg font-bold text-[var(--dark-primary-color)] uppercase">
            The Evidence is Clear
          </h4>
          <h2 className="text-4xl text-[var(--secondary-color)] font-light max-w-md mt-4">
            Data Highlights{" "}
            <span className="font-medium text-[var(--dark-primary-color)]">
              Critical Workplace
            </span>{" "}
            Challenges
          </h2>
          <p className="text-xl font-normal mt-2 max-w-screen-lg text-[var(--secondary-color)] ">
            Since COVID, the accelerated pace of change has forced organizations
            to make rapid decisions and adopt makeshift workflows many of which
            are now revealing gaps, strain, and unintended consequences within
            the digital employee experience and systems.
          </p>
          <ul className="mt-7">
            <li className="flex items-center gap-2.5  text-lg text-[var(--secondary-color)]">
              <img src={IconStar} alt="icon" />
              <span>
                According to Gallup, as of mid-2025 only{" "}
                <strong>32% of employees</strong> report being engaged in their
                work - a sign of widespread disengagement.{" "}
              </span>
            </li>
            <li className="flex items-start gap-2.5  text-lg text-[var(--secondary-color)] mt-2">
              <img src={IconStar} alt="icon" />{" "}
              <span>
                That same data points to underlying problems in leadership
                effectiveness and organizational culture.{" "}
                <strong>Low employee engagement</strong> often reflects lack of
                alignment, poor communication, and inadequate support - all
                issues tied to leadership and management.
              </span>
            </li>
            <li className="flex items-start gap-2.5  text-lg text-[var(--secondary-color)] mt-2">
              <img src={IconStar} alt="icon" />{" "}
              <span>
                Meanwhile, only <strong>31% of leaders</strong>themselves report
                being engaged in their roles and are feeling strain, pressure
                and burn-out.
              </span>
            </li>
            <li className="flex items-start gap-2.5  text-lg text-[var(--secondary-color)] mt-2">
              <img src={IconStar} alt="icon" />{" "}
              <span>
                In addition, a survey cited in 2025 found that only{" "}
                <strong>30% of managers feel they have enough time</strong> to
                complete their responsibilities properly including coaching and
                supporting their team members through change.
              </span>
            </li>
            <li className="flex items-start gap-2.5  text-lg text-[var(--secondary-color)] mt-2">
              <img src={IconStar} alt="icon" />{" "}
              <span>
                According to the Center for Creative Leadership (CCL), data
                gathered from over 48,000 leaders globally, reveals that leaders
                and employees are struggling more than ever with issues ranging
                from remote team coordination to hybrid-work complexity,
                cultural shifts, and evolving expectations.
              </span>
            </li>
          </ul>
          <h5 className="text-xl text-[var(--secondary-color)] mt-10 font-semibold">
            Before your next planning cycle, and prior to any major digital
            roll-out, it’s critical to understand your organization’s actual
            readiness and the hidden barriers that could derail progress. We
            identify these strain points and design leadership, coaching, and
            learning programs that align people and technology enabling teams to
            operate with efficiency and confidence.
          </h5>
        </div>
      </div>
      {/* Data Highlights Section End */}

      {/* Recent Digital Section Start */}
      <div className="bg-[var(--primary-color)] py-10">
        <div className="max-w-screen-2xl mx-auto px-10">
          <div className="flex items-center justify-between ">
            <div className="max-w-md">
              <h4 className="text-white uppercase text-lg font-bold">
                recent digital transformation initiatives.cloud-based solutions.
              </h4>
            </div>
            <div className="flex gap-14">
              <div className="">
                <img
                  src="../../../public/static/img/home/ic-marquee-1.svg"
                  alt="Ic-Marquee"
                />
              </div>
              <div className="">
                <img
                  src="../../../public/static/img/home/ic-marquee-2.svg"
                  alt="Ic-Marquee"
                />
              </div>
              <div className="">
                <img
                  src="../../../public/static/img/home/ic-marquee-3.svg"
                  alt="Ic-Marquee"
                />
              </div>
              <div className="">
                <img
                  src="../../../public/static/img/home/ic-marquee-4.svg"
                  alt="Ic-Marquee"
                />
              </div>
              <div className="">
                <img
                  src="../../../public/static/img/home/ic-marquee-5.svg"
                  alt="Ic-Marquee"
                />
              </div>
              <div className="">
                <img
                  src="../../../public/static/img/home/ic-marquee-6.svg"
                  alt="Ic-Marquee"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Digital Section End */}

      {/* Leadership And Digital Section Start */}
      <div className="py-20">
        <div className="max-w-screen-2xl mx-auto px-10">
          <div className="grid grid-cols-2 justify-between">
            <div className="">
              <h4 className="text-lg font-bold text-[var(--dark-primary-color)] uppercase">
                HOW WE SUPPORT OUR CLIENTS
              </h4>
              <h2 className="text-4xl text-[var(--secondary-color)] font-light max-w-xl mt-4">
                Leadership and Digital Capability Building for the{" "}
                <span className="font-medium text-[var(--dark-primary-color)]">
                  Modern Workplace
                </span>{" "}
              </h2>
              <p className="text-base font-normal mt-2 max-w-xl text-[var(--secondary-color)] ">
                The landscape has changed dramatically over the past seven
                years. Hybrid and remote working, new digital tools, redesigned
                processes and systems, and shifting employee expectations mean
                that traditional approaches to leadership development, coaching,
                and learning no longer work. Organizations need solutions that
                are data-informed, people-centered, and built for modern
                complexity.
              </p>
              <p className="mt-10 text-base font-normal mt-2 max-w-xl text-[var(--secondary-color)] ">
                Our approach can be summarized in four simple steps:
              </p>
              <img
                src={CapabilityPerformance}
                className="mt-12"
                alt="CapabilityPerformance"
              />
            </div>
            <div>
              <div className="grid grid-cols-2 gap-x-6  ">
                <div className=" shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] p-6 bg-white p-5 rounded-xl mb-8">
                  {/* <h2 className="mb-4 text-7xl font-bold text-transparent [-webkit-text-stroke:3px_#3b73b9] text-right">
                    01
                  </h2> */}
                  <img
                    src={Number1}
                    className="mb-4 text-right ml-auto"
                    alt="Number"
                  />
                  <h3 className="text-2xl font-medium text-[var(--secondary-color) ">
                    We Measure What Matters
                  </h3>
                  <p className="text-base font-normal mt-1">
                    We begin with a comprehensive organizational assessment that
                    reveals the barriers, patterns, and capability gaps that
                    slow teams down.
                  </p>
                  <p className="text-base font-normal mt-2">
                    We begin with a comprehensive organizational assessment that
                    reveals the barriers, patterns, and capability gaps that
                    slow teams down.
                  </p>
                </div>

                <div className="shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] p-6 bg-white p-5 rounded-xl mt-8">
                  {/* <h2 className="mb-4 text-7xl font-bold text-transparent [-webkit-text-stroke:3px_#3b73b9] text-right">
                    02
                  </h2> */}
                  <img
                    src={Number2}
                    className="mb-4 text-right ml-auto"
                    alt="Number"
                  />
                  <h3 className="text-2xl font-medium text-[var(--secondary-color) ">
                    We Turn Insight Into Action
                  </h3>
                  <p className="text-base font-normal mt-1">
                    Using your data, we identify the programs and resources that
                    will have the greatest impact on improving performance.
                  </p>
                  <p className="text-base font-normal mt-2">
                    We map these recommendations directly to your strategic
                    goals and OKRs, enabling your organization to move forward
                    with focus, alignment, and speed.
                  </p>
                </div>

                <div className="shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] p-6 bg-white p-5 rounded-xl mb-8">
                  {/* <h2 className="mb-4 text-7xl font-bold text-transparent [-webkit-text-stroke:3px_#3b73b9] text-right">
                    03
                  </h2> */}
                  <img
                    src={Number3}
                    className="mb-4 text-right ml-auto"
                    alt="Number"
                  />
                  <h3 className="text-2xl font-medium text-[var(--secondary-color) ">
                    We Partner for Long-Term Capability Building
                  </h3>
                  <p className="text-base font-normal mt-1">
                    This is not a one-and-done engagement. We work alongside
                    your leaders and teams to strengthen capability over time,
                    reassessing at predefined intervals to ensure progress is
                    measurable, goals are met, and momentum continues in all the
                    right areas.
                  </p>
                </div>
                <div className=" shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] p-6 bg-white p-5 rounded-xl mt-8">
                  {/* <h2 className="mb-4 text-7xl font-bold text-transparent [-webkit-text-stroke:3px_#3b73b9] text-right">
                    04
                  </h2> */}
                  <img
                    src={Number4}
                    className="mb-4 text-right ml-auto"
                    alt="Number"
                  />
                  <h3 className="text-2xl font-medium text-[var(--secondary-color) ">
                    We Facilitate Smarter Decisions
                  </h3>
                  <p className="text-base font-normal mt-1">
                    Our secure AI-enabled module supports scenario planning,
                    prioritization, and strategic decision-making by analyzing
                    assessment results alongside the documents you upload to the
                    encrypted LLM hosted in Canada.
                  </p>
                  <p className="text-base font-normal mt-1">
                    It gives leaders a clear view of what to address first,
                    where to invest, and how to sequence improvement initiatives
                    for maximum impact.
                  </p>
                </div>
              </div>
              <div className="bg-[var(--primary-color)] p-5 rounded-xl mt-8 ">
                <h2 className="text-2xl font-medium text-[var(--white-color)]">
                  The Result
                </h2>
                <p className="text-base font-normal text-[var(--white-color)]">
                  A modern, integrated system that equips leaders and teams to
                  adapt faster, work better, and accelerate organizational
                  progress with measurable improvements in performance,
                  alignment, and capability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Leadership And Digital Section End */}

      {/*Properietary Assesment Section Start */}
      <div className="py-20 bg-[linear-gradient(53deg,rgba(237,245,253,0)_75%,#e4f0fc_100%)] ">
        <div className="max-w-screen-2xl mx-auto px-10">
          <h4 className="text-lg font-bold text-[var(--dark-primary-color)] uppercase">
            OUR PROPRIETARY ASSESSMENT
          </h4>
          <h2 className="text-4xl text-[var(--secondary-color)] font-light max-w-lg mt-4">
            Behavioural
            <span className="font-medium text-[var(--dark-primary-color)]">
              {" "}
              Science{" "}
            </span>{" "}
            and{" "}
            <span className="font-medium text-[var(--dark-primary-color)]">
              {" "}
              Smart{" "}
            </span>
            Questioning That Cuts Straight to{" "}
            <span className="font-medium text-[var(--dark-primary-color)]">
              {" "}
              The Truth{" "}
            </span>
          </h2>
          <p className="text-base font-normal mt-2 text-[var(--secondary-color)] ">
            The POD-360™ Assessment is intentionally designed to produce
            accurate, not skewed, results so recommendations can be shared with
            clarity and reasoning.
          </p>
          <p className="mt-10 text-base font-normal mt-2 text-[var(--secondary-color)] ">
            Instead of relying solely on self-ratings, which are often inflated,
            under-reported, or “gamed,” POD-360™ uses multi-role triangulation
            (Employee, Manager, Leader) to reveal blind spots and blockers. It
            replaces subjective questions with behavioural and scenario-based
            items that ask what actually happened in the last 30 days, reducing
            guesswork and social desirability bias. Calibration items detect
            inflated or defensive responses, while insight prompts generate
            qualitative explanations that help validate patterns and uncover
            root causes.
          </p>
          <p className="mt-10 text-base font-normal mt-2 text-[var(--secondary-color)] ">
            Layered on top are domain weighting, risk flags, and variance
            mapping, enabling the system to not only score performance but
            pinpoint exactly where barriers exist and what may be getting in the
            way of achieving intended outcomes and OKRs.
          </p>
          <p className="mt-10 text-base font-normal mt-2 text-[var(--secondary-color)] ">
            The result is a high-validity, low-bias assessment that provides
            actionable insights across three domains and 12 subdomains.
          </p>
          <div className="grid grid-cols-3 gap-8 mt-12">
            <div className="shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] p-5 bg-white p-4 rounded-xl ">
              <div className="relative">
                <img src={Post1} className="w-full rounded-xl" alt="post" />
                <div className="flex gap-3 center  absolute top-4 right-4 ">
                  <button
                    type="button"
                    className="bg-[var(--white-color)] py-1 px-2 uppercase text-xs text-[var(--dark-primary-color)] font-medium rounded-full"
                  >
                    Leadership
                  </button>
                  <button
                    type="button"
                    className="bg-[var(--white-color)] py-1 px-2 uppercase text-xs text-[var(--dark-primary-color)] font-medium rounded-full"
                  >
                    Engagement
                  </button>
                </div>
              </div>
              <div className="mt-5">
                <h4 className="text-2xl font-medium text-[var(--secondary-color)]">
                  People Potential
                </h4>
                <p className=" text-base font-normal  text-[var(--secondary-color)] ">
                  Strengthening engagement, capability, and emotional
                  intelligence so people can lead, adapt, and thrive.
                </p>
              </div>
            </div>
            <div className=" shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] p-5 bg-white p-4 rounded-xl ">
              <div className="relative">
                <img src={Post2} className="w-full rounded-xl" alt="post" />
                <div className="flex gap-3 center  absolute top-4 right-4 ">
                  <button
                    type="button"
                    className="bg-[var(--white-color)] py-1 px-2 uppercase text-xs text-[var(--dark-primary-color)] font-medium rounded-full"
                  >
                    Workflows
                  </button>
                  <button
                    type="button"
                    className="bg-[var(--white-color)] py-1 px-2 uppercase text-xs text-[var(--dark-primary-color)] font-medium rounded-full"
                  >
                    Process
                  </button>
                  <button
                    type="button"
                    className="bg-[var(--white-color)] py-1 px-2 uppercase text-xs text-[var(--dark-primary-color)] font-medium rounded-full"
                  >
                    Automation
                  </button>
                </div>
              </div>
              <div className="mt-5">
                <h4 className="text-2xl font-medium text-[var(--secondary-color)]">
                  Operational Steadiness
                </h4>
                <p className=" text-base font-normal  text-[var(--secondary-color)] ">
                  Creating resilient, predictable workflows that reduce
                  friction, eliminate drag, and keep work moving.
                </p>
              </div>
            </div>
            <div className="shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] p-5 bg-white p-4 rounded-xl ">
              <div className="relative">
                <img src={Post3} className="w-full rounded-xl" alt="post" />
                <div className="flex gap-3 center  absolute top-4 right-4 ">
                  <button
                    type="button"
                    className="bg-[var(--white-color)] py-1 px-2 uppercase text-xs text-[var(--dark-primary-color)] font-medium rounded-full"
                  >
                    Technology
                  </button>
                  <button
                    type="button"
                    className="bg-[var(--white-color)] py-1 px-2 uppercase text-xs text-[var(--dark-primary-color)] font-medium rounded-full"
                  >
                    Data
                  </button>
                  <button
                    type="button"
                    className="bg-[var(--white-color)] py-1 px-2 uppercase text-xs text-[var(--dark-primary-color)] font-medium rounded-full"
                  >
                    AI
                  </button>
                </div>
              </div>
              <div className="mt-5">
                <h4 className="text-2xl font-medium text-[var(--secondary-color)]">
                  Digital Fluency
                </h4>
                <p className=" text-base font-normal  text-[var(--secondary-color)] ">
                  Building confidence with tools, data, and AI so teams work
                  smarter, collaborate better, and adapt faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*Properietary Assesment Section End */}

      {/* How it works Section Strat */}
      <div className="bg-[linear-gradient(to_top,rgba(237,245,253,0)_50%,rgba(228,240,252,0.19))] py-20">
        <div className="max-w-screen-2xl mx-auto px-10">
          <h4 className="text-lg font-bold text-[var(--dark-primary-color)] uppercase">
            How it works
          </h4>
          <h2 className="text-4xl text-[var(--secondary-color)] font-light max-w-lg mt-4">
            Assessment set-up and
            <span className="font-medium text-[var(--dark-primary-color)]">
              {" "}
              administration made easy{" "}
            </span>
          </h2>
          <div className="grid grid-cols-4 gap-6 mt-8">
            <div className="">
              <img src={Access1} alt="accessicon" />
              <div className="mt-4">
                <h4 className="text-2xl font-medium text-[var(--secondary-color)]">
                  Get Access
                </h4>
                <p className=" text-base font-normal  text-[var(--secondary-color)] ">
                  Contact us to discuss partnership and request access to the
                  platform for your organization. We will set up custom
                  reporting dimensions and configure your tenant to support your
                  specific needs.
                </p>
              </div>
            </div>
            <div className="">
              <img src={Access2} alt="accessicon" />
              <div className="mt-4">
                <h4 className="text-2xl font-medium text-[var(--secondary-color)]">
                  Distribute the Link
                </h4>
                <p className=" text-base font-normal  text-[var(--secondary-color)] ">
                  Share a single link with your team members. We will provide
                  comprehensive instructions and support. For larger programs,
                  we can also provide custom comms and videos to build awareness
                  and reinforce importance.
                </p>
              </div>
            </div>
            <div className="">
              <img src={Access3} alt="accessicon" />
              <div className="mt-4">
                <h4 className="text-2xl font-medium text-[var(--secondary-color)]">
                  Individual Action Plans
                </h4>
                <p className=" text-base font-normal  text-[var(--secondary-color)] ">
                  Comprehensive Reports are generated by the system and further
                  developed by one of our trained and certified coaches.
                  Assessment Reports will only be released upon client approval.
                  This forms the basis of coaching and learning programs.
                </p>
              </div>
            </div>
            <div className="">
              <img src={Access4} alt="accessicon" />
              <div className="mt-4">
                <h4 className="text-2xl font-medium text-[var(--secondary-color)]">
                  Review Group Results
                </h4>
                <p className=" text-base font-normal  text-[var(--secondary-color)] ">
                  Senior Leaders and Mangers receive access to interactive
                  Dashboards with heat maps and aggregated insights.
                </p>
                <p className=" text-base font-normal mt-2 text-[var(--secondary-color)] ">
                  They also have the ability to filter data by custom categories
                  and further drill down into sub-domains.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* How it works Section End */}

      {/* Modern Workplace Section Strat */}
      <div className="bg-[var(--primary-color)] py-10">
        <div className="">
          <div className="flex items-center justify-center ">
            <div className="flex gap-14">
              <div className="flex gap-5 items-center">
                <img src={Workplace} alt="Ic-Marquee" />
                <span className="text-[var(--white-color)] text-4xl font-medium">
                  Let's Talk Modern Workplace Performance
                </span>
              </div>
              <div className="flex gap-5 items-center">
                <img src={Workplace} alt="Ic-Marquee" />
                <span className="text-[var(--white-color)] text-4xl font-medium">
                  Let's Talk Modern Workplace Performance
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modern Workplace Section End  */}

      {/* Measurable Performance Section Start */}
      <div className="py-20">
        <div className="max-w-screen-2xl mx-auto px-10">
          <h4 className="text-lg font-bold text-[var(--dark-primary-color)] uppercase">
            POD-360™ + OKRs
          </h4>
          <h2 className="text-4xl text-[var(--secondary-color)] font-light max-w-xl mt-4">
            Turn Insights Into{" "}
            <span className="font-medium text-[var(--dark-primary-color)]">
              Measurable Performance
            </span>{" "}
          </h2>
          <p className="text-base font-normal mt-2 max-w-3xl text-[var(--secondary-color)] ">
            Most organizations don’t fail because they set the wrong goals they
            fail because people, processes/operations, and digital tools aren’t
            working together to execute them. The POD-360™ Assessment reveals
            the friction patterns that slow teams down. OKRs will provide the
            structure to turn those insights into focused, measurable action.
            Together, they create a powerful blueprint for organizational
            optimization.
          </p>
          <div className="mt-8 justify-between items-center flex py-16 px-20 rounded-[32px] shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] bg-[#e4f0fc]">
            <div>
              <h2 className="text-2xl font-medium text-[var(--dark-primary-color)] ">
                1. POD-360™ identifies what’s blocking execution
              </h2>
              <p className="text-base font-normal mt-2 max-w-xl text-[var(--secondary-color)] ">
                Across People, Operations, and Digital capability, POD-360™
                surfaces the hidden friction that prevents OKRs from succeeding:
              </p>
              <ul className="mt-7">
                <li className="flex items-center gap-2.5  text-lg text-[var(--secondary-color)]">
                  <img src={IconStar} alt="icon" />
                  <span>Unclear roles</span>
                </li>
                <li className="flex items-center gap-2.5  text-lg text-[var(--secondary-color)]">
                  <img src={IconStar} alt="icon" />
                  <span>Inconsistent processes</span>
                </li>
                <li className="flex items-center gap-2.5  text-lg text-[var(--secondary-color)]">
                  <img src={IconStar} alt="icon" />
                  <span>Overloaded teams</span>
                </li>
                <li className="flex items-center gap-2.5  text-lg text-[var(--secondary-color)]">
                  <img src={IconStar} alt="icon" />
                  <span>Digital under-adoption</span>
                </li>
                <li className="flex items-center gap-2.5  text-lg text-[var(--secondary-color)]">
                  <img src={IconStar} alt="icon" />
                  <span>Ineffective communication</span>
                </li>
                <li className="flex items-center gap-2.5  text-lg text-[var(--secondary-color)]">
                  <img src={IconStar} alt="icon" />
                  <span>Leadership blind spots</span>
                </li>
                <li className="flex items-center gap-2.5  text-lg text-[var(--secondary-color)]">
                  <img src={IconStar} alt="icon" />
                  <span>Technology readiness gaps</span>
                </li>
              </ul>
            </div>
            <div>
              <img src={Identifies} className="rounded-3xl" alt="Image" />
            </div>
          </div>
          <div className="mt-8 justify-between items-center flex py-16 px-20 rounded-[32px] shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] bg-[#e4f0fc]">
            <div>
              <h2 className="text-2xl font-medium text-[var(--dark-primary-color)] ">
                2. Translate POD-360™ insights into measurable goals
              </h2>
              <p className="text-base font-normal mt-2 max-w-xl text-[var(--secondary-color)] ">
                For every low or medium subdomain score, we can help you create
                OKRs to move forward with:
              </p>
              <ul className="mt-7">
                <li className="flex items-center gap-2.5  text-lg text-[var(--secondary-color)]">
                  <img src={IconStar} alt="icon" />
                  <span>Clear direction</span>
                </li>
                <li className="flex items-center gap-2.5  text-lg text-[var(--secondary-color)]">
                  <img src={IconStar} alt="icon" />
                  <span>Aligned priorities</span>
                </li>
                <li className="flex items-center gap-2.5  text-lg text-[var(--secondary-color)]">
                  <img src={IconStar} alt="icon" />
                  <span>Measurable success criteria</span>
                </li>
                <li className="flex items-center gap-2.5  text-lg text-[var(--secondary-color)]">
                  <img src={IconStar} alt="icon" />
                  <span>Accountable owners</span>
                </li>
                <li className="flex items-center gap-2.5  text-lg text-[var(--secondary-color)]">
                  <img src={IconStar} alt="icon" />
                  <span>Quarterly momentum</span>
                </li>
              </ul>
              <p className="text-base font-normal mt-2 max-w-xl text-[var(--secondary-color)] ">
                This bridges the gap between <strong>diagnosis</strong> and{" "}
                <strong>execution</strong>.
              </p>
            </div>
            <div>
              <img src={Identifies1} className="rounded-3xl" alt="Image" />
            </div>
          </div>
        </div>
      </div>
      {/* Measurable Performance Section End */}

      {/* Leadership Section strat */}
      <div className="bg-[linear-gradient(117deg,rgba(237,245,253,0)_50%,#e4f0fc_100%)] py-20">
        <div className="max-w-screen-2xl mx-auto px-10">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-lg font-bold text-[var(--dark-primary-color)] uppercase">
                ABout talent by design collective inc.
              </h4>
              <h2 className="text-4xl text-[var(--secondary-color)] font-light max-w-xl mt-4">
                Your Partner in{" "}
                <span className="font-medium text-[var(--dark-primary-color)]">
                  Leadership{" "}
                </span>{" "}
                and{" "}
                <span className="font-medium text-[var(--dark-primary-color)]">
                  Digital Growth{" "}
                </span>
              </h2>
              <p className="text-base font-normal mt-2 max-w-3xl text-[var(--secondary-color)] ">
                We’re an innovative leadership and development partner for
                modern organizations. On our bench you will find ICF Certified
                Coaches, Prosci Practitioners, Business Analysts, Data Analysts,
                and skilled Learning and Development professionals &
                facilitators.
              </p>
              <p className="text-base font-normal mt-5 max-w-3xl text-[var(--secondary-color)] ">
                <strong>
                  We’re an innovative leadership and development partner for
                  modern organizations. On our bench you will find ICF Certified
                  Coaches, Prosci Practitioners, Business Analysts, Data
                  Analysts, and skilled Learning and Development professionals &
                  facilitators.
                </strong>
                <div className="mt-5">
                  <p className="text-base font-normal mt-5 max-w-3xl text-[var(--secondary-color)]">
                    <strong>1. Our Team</strong>
                  </p>
                  <p className="text-base font-normal mt-1 max-w-3xl text-[var(--secondary-color)] ">
                    We design and deliver tailored programs aligned to your
                    priorities, and assemble the right mix of experts with the
                    skills and experience needed to support your organization
                    effectively.
                  </p>
                </div>
                <div className="mt-5">
                  <p className="text-base font-normal mt-5 max-w-3xl text-[var(--secondary-color)]">
                    <strong>2. Your Internal Specialists & Consultants</strong>
                  </p>
                  <p className="text-base font-normal mt-1 max-w-3xl text-[var(--secondary-color)] ">
                    Already have internal change management, learning, or
                    transformation specialists? Excellent. Our coaches partner
                    closely with your team, using the POD-360™ insights to guide
                    and support implementation.
                  </p>
                </div>
                <div className="mt-5">
                  <p className="text-base font-normal mt-5 max-w-3xl text-[var(--secondary-color)]">
                    <strong>3. Hybrid Partnership</strong>
                  </p>
                  <p className="text-base font-normal mt-1 max-w-3xl text-[var(--secondary-color)] ">
                    Prefer a blended approach? We co-design the delivery model
                    together combining internal expertise with our specialists
                    to build the right team and move the needle against the
                    report’s recommendations and action plan.
                  </p>
                </div>
                <p className="mt-5">
                  <strong>
                    We’re an innovative leadership and development partner for
                    modern organizations. On our bench you will find ICF
                    Certified Coaches, Prosci Practitioners, Business Analysts,
                    Data Analysts, and skilled Learning and Development
                    professionals &amp; facilitators.
                  </strong>
                </p>
              </p>
            </div>
            <div>
              <img src={DigitalLeader} className="rounded-3xl" alt="Image" />
            </div>
          </div>
        </div>
      </div>
      {/* Leadership Section End */}

      {/* Cta Section Start */}
      <div className="my-24">
        <div
          className="text-center mx-auto max-w-screen-xl py-32  bg-cover bg-center bg-no-repeat rounded-3xl"
          id="cta-bg"
        >
          <p className="text-base font-bold text-[var(--white-color)] mb-5 ">
            See the Data in Action
          </p>
          <h2 className="text-5xl max-w-lg mx-auto font-bold text-[var(--white-color)] uppercase">
            Build on a foundation of clarity, capability, with real data.
          </h2>
          <div className="mt-9">
            <button
              type="button"
              className="mx-auto group text-[var(--primary-color)] rounded-full py-2.5 pl-7 pr-3.5 flex items-center gap-1.5 font-semibold text-lg uppercase 
               bg-gradient-to-r bg-[var(--white-color)] border-solid border-[var(--primary-color)] border"
            >
              Book a Strategy Call
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
      {/* Cta Section End */}
      <Footer />
    </>
  );
};

export default Home;
