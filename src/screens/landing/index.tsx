import { Icon } from "@iconify/react";
import Header from "../../components/header";
import IconStar from "../../../public/static/img/icons/ic-star.svg";
import Number1 from "../../../public/static/img/home/number-img-01.png";
import Number2 from "../../../public/static/img/home/number-img-02.png";
import Number3 from "../../../public/static/img/home/number-img-03.png";
import Number4 from "../../../public/static/img/home/number-img-04.png";
import Post1 from "../../../public/static/img/home/post-1.png";
import Post2 from "../../../public/static/img/home/post-2.png";
import Post3 from "../../../public/static/img/home/post-3.png";
import Identifies from "../../../public/static/img/home/identifies.png";
import Identifies1 from "../../../public/static/img/home/identifies-1.png";
import Identifies2 from "../../../public/static/img/home/identifies-2.png";
import Identifies3 from "../../../public/static/img/home/identifies-3.png";
import Dashboard from "../../../public/static/img/icons/dashbord-login.png";
import SolarUuser from "../../../public/static/img/icons/solar_user-line-duotone.png";

import DigitalLeader from "../../../public/static/img/home/digital-leader.png";
import Access1 from "../../../public/static/img/icons/access1.svg";
import Access2 from "../../../public/static/img/icons/access2.svg";
import Access3 from "../../../public/static/img/icons/access3.svg";
import Access4 from "../../../public/static/img/icons/access4.svg";
import CapabilityPerformance from "../../../public/static/img/home/capability-performance.png";
import POD360 from "../../../public/static/img/home/pod-360.svg";
import Footer from "../../components/footer";
import SafeMarquee from "../../components/brandsMarquee";
import CtaMarquee from "../../components/ctaMarquee";
import { useEffect, useState } from "react";
import { Modal, Ripple, initTWE } from "tw-elements";
const Home = () => {
  useEffect(() => {
    initTWE({ Modal, Ripple });
  }, []);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 60000);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 80000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);
  return (
    <>
      {/* Announcement Bar Start */}
      <div className="bg-[var(--primary-color)] py-3 ">
        <div className="max-w-screen-2xl mx-auto xl:px-10 px-4  ">
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
      {/* Announcement Bar End */}

      <Header />

      {/* Hero Section Start */}
      <div
        className="md:pt-20 pt-14 !bg-cover !bg-center !bg-no-repeat"
        id="hero-bg"
      >
        <div className="max-w-5xl mx-auto text-center px-4">
          <h4 className="badge">
            TRUSTED STRATEGIC PARTNER FOR THE MODERN WORKPLACE
          </h4>
          <h1 className="heading">
            Clarity for Leaders. Stability for Teams. Readiness for the Future.
          </h1>
          <p className="lg:text-xl sm:text-lg text-base text-[var(--dark-primary-color)] font-medium mt-2.5 sm:mb-10 mb-5">
            Talent By Design Collective helps organizations build the
            capabilities and resilience needed to thrive in continuous change,
            make smart data-informed decisions and mitigate risk where it
            matters most.
          </p>
          <div className="flex justify-center sm:flex-nowrap flex-wrap gap-5">
            <button
              type="button"
              className="group text-white rounded-full py-2.5 pl-7 pr-3.5 flex items-center gap-1.5 font-semibold sm:text-lg text-base uppercase bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)]"
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
              className="group text-[var(--primary-color)] rounded-full py-2.5 pl-7 pr-3.5 flex items-center gap-1.5 font-semibold sm:text-lg text-base uppercase 
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

          <div className="lg:flex hidden justify-center items-center sm:mt-16 mt-10">
            <div className="flex justify-center items-center outline-1 outline p-3.5 outline-[#448cd24a] rounded-md ">
              <div className="!w-full mx-auto h-full">
                <iframe
                  className="!max-w-3xl rounded-md"
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
      <div className="lg:pt-28 md:pt-20 pt-12 pb-12 md:pb-20">
        <div className="max-w-screen-2xl mx-auto xl:px-10 px-4">
          <h4 className="badge">The Evidence is Clear</h4>
          <h2 className="sub-heading">
            Data Highlights{" "}
            <span className="sub-heading-highlight">Critical Workplace</span>{" "}
            Challenges
          </h2>
          <p className="text-base font-normal sm:mt-2 mt-3 max-w-screen-lg text-[var(--secondary-color)]">
            Since COVID, the accelerated pace of change has forced organizations
            to make rapid decisions and adopt makeshift workflows many of which
            are now revealing gaps, strain, and unintended consequences within
            the digital employee experience and systems.
          </p>
          <ul className="mt-7 space-y-2">
            <li className="feature-list">
              <img src={IconStar} alt="icon" className="mt-1" />
              <span>
                According to Gallup, as of mid-2025 only{" "}
                <strong>32% of employees</strong> report being engaged in their
                work - a sign of widespread disengagement.{" "}
              </span>
            </li>
            <li className="feature-list">
              <img src={IconStar} alt="icon" className="mt-1" />{" "}
              <span>
                That same data points to underlying problems in leadership
                effectiveness and organizational culture.{" "}
                <strong>Low employee engagement</strong> often reflects lack of
                alignment, poor communication, and inadequate support - all
                issues tied to leadership and management.
              </span>
            </li>
            <li className="feature-list">
              <img src={IconStar} alt="icon" className="mt-1" />{" "}
              <span>
                Meanwhile, only <strong>31% of leaders</strong>themselves report
                being engaged in their roles and are feeling strain, pressure
                and burn-out.
              </span>
            </li>
            <li className="feature-list">
              <img src={IconStar} alt="icon" className="mt-1" />{" "}
              <span>
                In addition, a survey cited in 2025 found that only{" "}
                <strong>30% of managers feel they have enough time</strong> to
                complete their responsibilities properly including coaching and
                supporting their team members through change.
              </span>
            </li>
            <li className="feature-list">
              <img src={IconStar} alt="icon" className="mt-1" />{" "}
              <span>
                According to the Center for Creative Leadership (CCL), data
                gathered from over 48,000 leaders globally, reveals that leaders
                and employees are struggling more than ever with issues ranging
                from remote team coordination to hybrid-work complexity,
                cultural shifts, and evolving expectations.
              </span>
            </li>
          </ul>
          <h5 className="text-base leading-5 text-[var(--secondary-color)] sm:mt-10 mt-5 font-semibold">
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
        <div className="max-w-screen-2xl mx-auto xl:px-10 lg:px-4">
          <div className="lg:flex items-center justify-between  ">
            <div className="lg:text-left text-center">
              <h4 className="text-white uppercase text-lg font-bold">
                recent digital transformation initiatives.
                <br />
                cloud-based solutions.
              </h4>
            </div>

            <SafeMarquee />

            {/* <div className="lg:mt-0 mt-5 flex sm:gap-14 gap-3">
              <div className="">
                <img
                  src="../static/img/home/ic-marquee-1.svg"
                  alt="Ic-Marquee"
                />
              </div>
              <div className="">
                <img
                  src="../static/img/home/ic-marquee-2.svg"
                  alt="Ic-Marquee"
                />
              </div>
              <div className="">
                <img
                  src="../static/img/home/ic-marquee-3.svg"
                  alt="Ic-Marquee"
                />
              </div>
              <div className="">
                <img
                  src="../static/img/home/ic-marquee-4.svg"
                  alt="Ic-Marquee"
                />
              </div>
              <div className="">
                <img
                  src="../static/img/home/ic-marquee-5.svg"
                  alt="Ic-Marquee"
                />
              </div>
              <div className="">
                <img
                  src="../static/img/home/ic-marquee-6.svg"
                  alt="Ic-Marquee"
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {/* Recent Digital Section End */}

      {/* Leadership And Digital Section Start */}
      <div className="md:py-20 py-12">
        <div className="max-w-screen-2xl mx-auto  xl:px-10 px-4">
          <div className="lg:grid lg:grid-cols-2 grid-cols-2 lg:justify-between lg:gap-3">
            <div className="">
              <h4 className="badge">HOW WE SUPPORT OUR CLIENTS</h4>
              <h2 className="sub-heading">
                Leadership and Digital Capability Building for the{" "}
                <span className="sub-heading-highlight">Modern Workplace</span>{" "}
              </h2>
              <p className="text-base font-normal sm:mt-2 mt-3 max-w-screen-lg text-[var(--secondary-color)]  ">
                The landscape has changed dramatically over the past seven
                years. Hybrid and remote working, new digital tools, redesigned
                processes and systems, and shifting employee expectations mean
                that traditional approaches to leadership development, coaching,
                and learning no longer work. Organizations need solutions that
                are data-informed, people-centered, and built for modern
                complexity.
              </p>
              <p className="sm:mt-6 mt-4 text-base font-normal max-w-xl text-[var(--secondary-color)] ">
                Our approach can be summarized in four simple steps:
              </p>
              <img
                src={CapabilityPerformance}
                className="sm:mt-12 mt-5 mx-auto lg:mx-0"
                alt="CapabilityPerformance"
              />
            </div>
            <div>
              <div className="grid md:grid-cols-2 grid-cols-1 md:gap-x-6 md:gap-y-0 gap-y-5 lg:mt-0 mt-7 ">
                <div className="grid-rows-1 relative shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] sm:p-6 p-4 bg-white rounded-xl md:mb-8">
                  <img
                    src={Number1}
                    className="mb-4 text-right ml-auto"
                    alt="Number"
                  />
                  <h3 className="sm:text-2xl text-xl font-medium text-[var(--secondary-color) ">
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

                <div className="grid-rows-2 relative shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] sm:p-6 p-4 bg-white rounded-xl md:mt-8">
                  <img
                    src={Number2}
                    className="mb-4 text-right ml-auto"
                    alt="Number"
                  />
                  <h3 className="sm:text-2xl text-xl font-medium text-[var(--secondary-color) ">
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

                <div className="grid-rows-2  relative shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] sm:p-6 p-4 bg-white rounded-xl md:mb-8">
                  {/* <h2 className="mb-4 text-7xl font-bold text-transparent [-webkit-text-stroke:3px_#3b73b9] text-right">
                    03
                  </h2> */}
                  <img
                    src={Number3}
                    className="mb-4 text-right ml-auto"
                    alt="Number"
                  />
                  <h3 className="sm:text-2xl text-xl font-medium text-[var(--secondary-color) ">
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

                <div className="grid-rows-4 md:sticky relative shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] sm:p-6 p-4 bg-white rounded-xl md:mt-8">
                  {/* <h2 className="mb-4 text-7xl font-bold text-transparent [-webkit-text-stroke:3px_#3b73b9] text-right">
                    04
                  </h2> */}
                  <img
                    src={Number4}
                    className="mb-4 text-right ml-auto"
                    alt="Number"
                  />
                  <h3 className="sm:text-2xl text-xl font-medium text-[var(--secondary-color) ">
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
                <h2 className="md:text-2xl text-xl font-medium text-[var(--white-color)]">
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

      {/* POD-360™ Assessment Section Start */}
      <div className="md:py-20 py-12 bg-[linear-gradient(53deg,rgba(237,245,253,0)_75%,#e4f0fc_100%)] ">
        <div className="max-w-screen-2xl mx-auto  xl:px-10 px-4">
          <h4 className="badge">OUR PROPRIETARY ASSESSMENT</h4>
          <h2 className="sub-heading">
            Behavioural
            <span className="sub-heading-highlight"> Science </span> and{" "}
            <span className="sub-heading-highlight"> Smart </span>
            Questioning That Cuts Straight to{" "}
            <span className="sub-heading-highlight"> The Truth </span>
          </h2>
          <div className="max-w-6xl">
            <p className="text-base font-normal mt-2 text-[var(--secondary-color)] ">
              The POD-360™ Assessment is intentionally designed to produce
              accurate, not skewed, results so recommendations can be shared
              with clarity and reasoning.
            </p>
            <p className="text-base font-normal mt-4 text-[var(--secondary-color)] ">
              Instead of relying solely on self-ratings, which are often
              inflated, under-reported, or “gamed,” POD-360™ uses multi-role
              triangulation (Employee, Manager, Leader) to reveal blind spots
              and blockers. It replaces subjective questions with behavioural
              and scenario-based items that ask what actually happened in the
              last 30 days, reducing guesswork and social desirability bias.
              Calibration items detect inflated or defensive responses, while
              insight prompts generate qualitative explanations that help
              validate patterns and uncover root causes.
            </p>
            <p className="mt-4 text-base font-normal text-[var(--secondary-color)] ">
              Layered on top are domain weighting, risk flags, and variance
              mapping, enabling the system to not only score performance but
              pinpoint exactly where barriers exist and what may be getting in
              the way of achieving intended outcomes, objectives and key
              results.
            </p>
            <p className="text-base font-normal text-[var(--secondary-color)] ">
              The result is a high-validity, low-bias assessment that provides
              actionable insights across 3 domains and 12 subdomains.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 sm:grid-cols-2 xl:gap-8 gap-4 sm:mt-12 mt-8">
            <div className="shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] md:p-5 p-3 bg-white  rounded-xl ">
              <div className="relative">
                <img src={Post1} className="w-full rounded-xl" alt="post" />
                <div className="flex gap-1.5 center absolute top-2 right-2">
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
                <h4 className="md:text-2xl text-xl font-medium text-[var(--secondary-color)]">
                  <span className="font-black">P</span>eople Potential
                </h4>
                <p className="text-base font-normal text-[var(--secondary-color)] ">
                  Strengthening engagement, capability, and emotional
                  intelligence so people can lead, adapt, and thrive.
                </p>
              </div>
            </div>
            <div className="shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] md:p-5 p-3 bg-white  rounded-xl ">
              <div className="relative">
                <img src={Post2} className="w-full rounded-xl" alt="post" />
                <div className="flex gap-1.5 center absolute top-2 right-2">
                  <button
                    type="button"
                    className="bg-[var(--white-color)] py-1 px-2 uppercase text-xs text-[var(--dark-primary-color)] font-medium rounded-full"
                  >
                    Workflow
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
                <h4 className="md:text-2xl text-xl font-medium text-[var(--secondary-color)]">
                  <span className="font-black">O</span>perational Steadiness
                </h4>
                <p className=" text-base font-normal  text-[var(--secondary-color)] ">
                  Creating resilient, predictable workflows that reduce
                  friction, eliminate drag, and keep work moving.
                </p>
              </div>
            </div>
            <div className="shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] md:p-5 p-3 bg-white  rounded-xl ">
              <div className="relative">
                <img src={Post3} className="w-full rounded-xl" alt="post" />
                <div className="flex gap-1.5 center absolute top-2 right-2">
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
                <h4 className="md:text-2xl text-xl font-medium text-[var(--secondary-color)]">
                  <span className="font-black">D</span>igital Fluency
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
      {/* POD-360™ Assessment Section End */}

      {/* How it works Section Start */}
      <div className="bg-[linear-gradient(to_top,rgba(237,245,253,0)_50%,rgba(228,240,252,0.19))] md:py-20 py-12">
        <div className="max-w-screen-2xl mx-auto xl:px-10 px-4">
          <h4 className="badge">How it works</h4>
          <h2 className="sub-heading">
            Assessment set-up and
            <span className="sub-heading-highlight">
              {" "}
              administration made easy{" "}
            </span>
          </h2>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 mt-8">
            <div>
              <img src={Access1} alt="access icon" />
              <div className="mt-4">
                <h4 className="sm:text-2xl text-xl font-medium text-[var(--secondary-color)]">
                  Get Access
                </h4>
                <p className="text-base font-normal text-[var(--secondary-color)] ">
                  Contact us to discuss partnership and request access to the
                  platform for your organization. We will set up custom
                  reporting dimensions and configure your tenant to support your
                  specific needs.
                </p>
              </div>
            </div>
            <div>
              <img src={Access2} alt="access icon" />
              <div className="mt-4">
                <h4 className="sm:text-2xl text-xl font-medium text-[var(--secondary-color)]">
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
            <div>
              <img src={Access3} alt="access icon" />
              <div className="mt-4">
                <h4 className="sm:text-2xl text-xl font-medium text-[var(--secondary-color)]">
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
            <div>
              <img src={Access4} alt="access icon" />
              <div className="mt-4">
                <h4 className="sm:text-2xl text-xl font-medium text-[var(--secondary-color)]">
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

      {/* Modern Workplace Section Start */}
      <div className="bg-[var(--primary-color)] md:py-10 py-5">
        <CtaMarquee />
      </div>
      {/* Modern Workplace Section End  */}

      {/* Measurable Performance Section Start */}
      <div className="md:py-20 py-12">
        <div className="max-w-screen-2xl mx-auto xl:px-10 px-4">
          <h4 className="badge">POD-360™ + OKRs</h4>
          <h2 className="sub-heading">
            Turn Insights Into{" "}
            <span className="sub-heading-highlight">
              Measurable Performance
            </span>{" "}
          </h2>
          <p className="text-base font-normal mt-2 lg:max-w-3xl text-[var(--secondary-color)] ">
            Most organizations don’t fail because they set the wrong goals they
            fail because people, processes/operations, and digital tools aren’t
            working together to execute them. The POD-360™ Assessment reveals
            the friction patterns that slow teams down. OKRs will provide the
            structure to turn those insights into focused, measurable action.
            Together, they create a powerful blueprint for organizational
            optimization.
          </p>
          <div className="md:sticky relative md:top-28 mt-8 justify-between items-center flex lg:py-16 lg:px-20 sm:p-8 p-4 sm:rounded-[32px] rounded-[15px] shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] bg-[#e4f0fc]">
            <div>
              <h2 className="md:text-2xl text-xl font-medium text-[var(--dark-primary-color)] ">
                1. POD-360™ identifies what’s blocking execution
              </h2>
              <p className="text-base font-normal mt-2 max-w-xl text-[var(--secondary-color)] ">
                Across People, Operations, and Digital capability, POD-360™
                surfaces the hidden friction that prevents OKRs from succeeding:
              </p>
              <ul className="sm:mt-7 mt-4 space-y-1">
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>Unclear roles</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>Inconsistent processes</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>Overloaded teams</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>Digital under-adoption</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>Ineffective communication</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>Leadership blind spots</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>Technology readiness gaps</span>
                </li>
              </ul>
            </div>
            <div className="md:block hidden">
              <img src={Identifies} className="rounded-3xl" alt="Image" />
            </div>
          </div>
          <div className="md:sticky relative md:top-36 z-[2] mt-8 justify-between items-center flex lg:py-16 lg:px-20 sm:p-8 p-4 sm:rounded-[32px] rounded-[15px] shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] bg-[#e4f0fc]">
            <div>
              <h2 className="md:text-2xl text-xl font-medium text-[var(--dark-primary-color)]">
                2. Translate POD-360™ insights into measurable goals
              </h2>
              <p className="text-base font-normal mt-2 max-w-xl text-[var(--secondary-color)] ">
                For every low or medium subdomain score, we can help you create
                OKRs to move forward with:
              </p>
              <ul className="sm:mt-7 mt-4 space-y-1">
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>Clear direction</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>Aligned priorities</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>Measurable success criteria</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>Accountable owners</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>Quarterly momentum</span>
                </li>
              </ul>
              <p className="text-base font-normal mt-2 max-w-xl text-[var(--secondary-color)] ">
                This bridges the gap between <strong>diagnosis</strong> and{" "}
                <strong>execution</strong>.
              </p>
            </div>
            <div className="md:block hidden">
              <img src={Identifies1} className="rounded-3xl" alt="Image" />
            </div>
          </div>
          <div className="md:sticky relative md:top-44 z-[3] mt-8 justify-between items-center flex lg:py-16 lg:px-20 sm:p-8 p-4 sm:rounded-[32px] rounded-[15px] shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] bg-[#e4f0fc]">
            <div>
              <h2 className="md:text-2xl text-xl font-medium text-[var(--dark-primary-color)] ">
                3. POD-360™ makes OKRs realistic, targeted, and achievable
              </h2>

              <ul className="sm:mt-7 mt-4 space-y-1">
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>No more vague goals or misaligned priorities.</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>Each OKR is grounded in real data not guesses.</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>POD-360™ tells you where to focus.</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>OKRs define how to move forward.</span>
                </li>
              </ul>
            </div>
            <div className="md:block hidden ">
              <img src={Identifies2} className="rounded-3xl" alt="Image" />
            </div>
          </div>
          <div className="mt-8 md:sticky relative md:top-52 z-[4] justify-between items-center flex lg:py-16 lg:px-20 sm:p-8 p-4 sm:rounded-[32px] rounded-[15px] shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] bg-[#e4f0fc]">
            <div>
              <h2 className="md:text-2xl text-xl font-medium text-[var(--dark-primary-color)] ">
                4. Improve performance every quarter
              </h2>
              <p className="text-base font-normal mt-2 max-w-xl text-[var(--secondary-color)] ">
                With POD-360™ as your baseline:
              </p>
              <ul className="sm:mt-7 mt-4 space-y-1">
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>OKRs are easier to define</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>Progress is easier to measure</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>Improvements are easier to sustain</span>
                </li>
              </ul>

              <div>
                <p className="text-base font-normal my-4 max-w-xl text-[var(--secondary-color)] ">
                  Every quarter teams can:
                </p>
                <ul>
                  <li className="feature-list">
                    <img src={IconStar} alt="icon" className="mt-1" />
                    <span>Run a mini POD-360™ pulse</span>
                  </li>
                  <li className="feature-list">
                    <img src={IconStar} alt="icon" className="mt-1" />
                    <span>Refresh OKRs based on friction levels</span>
                  </li>
                  <li className="feature-list">
                    <img src={IconStar} alt="icon" className="mt-1" />
                    <span>Track improvements in flow and performance</span>
                  </li>
                </ul>
              </div>

              <p className="text-base font-normal mt-3 max-w-xl text-[var(--secondary-color)] ">
                This creates a <strong>continuous improvement system.</strong>
              </p>
            </div>
            <div className="md:block hidden">
              <img src={Identifies3} className="rounded-3xl" alt="Image" />
            </div>
          </div>
        </div>

        <div className="relative z-10 bg-white max-w-screen-2xl mx-auto xl:px-10 px-4">
          <img
            src={POD360}
            alt="Pod-360™"
            className="sm:mt-16 mt-8 w-fit mx-auto"
          />
          <h2 className="sm:mt-16 mt-8 md:text-2xl text-xl font-medium text-[var(--dark-primary-color)] ">
            The Result: A high-performance, and change ready organization.
          </h2>
          <ul className="mt-2 space-y-1">
            <li className="feature-list">
              <img src={IconStar} alt="icon" className="mt-1" />
              <span>Your people know what to focus on.</span>
            </li>
            <li className="feature-list">
              <img src={IconStar} alt="icon" className="mt-1" />
              <span>Your managers have the tools to unblock teams.</span>
            </li>
            <li className="feature-list">
              <img src={IconStar} alt="icon" className="mt-1" />
              <span>Your leaders have clarity on how to scale.</span>
            </li>
            <li className="feature-list">
              <img src={IconStar} alt="icon" className="mt-1" />
              <span>Your digital ecosystem finally delivers ROI.</span>
            </li>
            <li className="feature-list">
              <img src={IconStar} alt="icon" className="mt-1" />
              <span>
                Your technology investment becomes a force multiplier not
                another layer of complexity.
              </span>
            </li>
          </ul>
        </div>
      </div>
      {/* Measurable Performance Section End */}

      {/* POD Insights™ AI-Powered Organizational Intelligence Start */}
      <div className="bg-[linear-gradient(to_top,rgba(237,245,253,0)_50%,rgba(228,240,252,0.19))]">
        <div className="md:py-20 py-12">
          <div className="max-w-screen-2xl mx-auto xl:px-10 px-4">
            <h4 className="badge">
              POD Insights™ AI-Powered Organizational Intelligence
            </h4>
            <h2 className="sub-heading !max-w-xl">
              The Secure
              <span className="sub-heading-highlight">
                {" "}
                AI Intelligence
              </span>{" "}
              Layer of the
              <span className="sub-heading-highlight"> POD-360™</span> Platform
            </h2>
            <div className="max-w-6xl">
              <p className="text-base font-normal mt-2 text-[var(--secondary-color)] ">
                It enables leaders to upload strategic documents and use AI to
                surface meaningful, context-aware insights grounded in their own
                organizational data.
              </p>

              <p className="text-base font-normal mt-4 text-[var(--secondary-color)]">
                Senior Executives can analyze transformation plans, operating
                models, digital roadmaps, engagement results, and leadership
                strategies, and receive clear summaries, priority signals, and
                risk considerations that support better decision-making.
              </p>

              <p className="text-base font-normal mt-4 text-[var(--secondary-color)]">
                Built on enterprise-grade infrastructure using platforms such as
                Snowflake, with AI services leveraging Microsoft Azure and
                OpenAI, POD Insights™ is designed for security, scale, and
                trust.
              </p>
            </div>

            <div className="rounded-xl mt-8">
              <h2 className="md:text-2xl text-xl mb-2 font-medium">
                How POD Insights™ Works
              </h2>
              <div className="mt-4 grid md:grid-cols-3 sm:grid-cols-2 lg:gap-x-20 gap-x-7 gap-y-7">
                <div>
                  <img
                    src="../../../public/static/img/home/ic-pod1.svg"
                    alt="POD icon"
                    className="h-20 w-20 object-contain mb-3"
                  />
                  <p>
                    Upload your content and enter prompt. Bring in strategic
                    plans, transformation documents, operating models, reports,
                    and key organizational artifacts. Access quality prompts
                    from our vast library.
                  </p>
                </div>

                <div>
                  <img
                    src="../../../public/static/img/home/ic-pod2.svg"
                    alt="POD icon"
                    className="h-20 w-20 object-contain mb-3"
                  />
                  <p>
                    AI-assisted interpretation. POD Insights™ securely analyzes
                    your documents alongside POD-360™ results to identify
                    patterns, friction points, and emerging signals across
                    People, Operations, and Digital.
                  </p>
                </div>

                <div>
                  <img
                    src="../../../public/static/img/home/ic-pod3.svg"
                    alt="POD icon"
                    className="h-20 w-20 object-contain mb-3"
                  />
                  <p>
                    Leadership ready intelligence. Receive prioritized insights,
                    narrative summaries, and trend indicators that help leaders
                    focus attention, sequence change, and invest with
                    confidence.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl mt-8">
              <h2 className="md:text-2xl text-xl mb-2 font-medium">
                What POD Insights™ Delivers
              </h2>
              <ul className="mt-4 space-y-1">
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>
                    Context aware analysis based on your organizational data
                  </span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>
                    Priority signals tied to areas of highest friction or risk
                  </span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>Trend and momentum indicators over time</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>Narrative summaries designed for executive review</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>
                    Decision support that complements not replaces leadership
                    judgment
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl mt-8">
              <h2 className="md:text-2xl text-xl mb-2 font-medium">
                Built for Trust and Governance
              </h2>
              <ul className="mt-4 space-y-1">
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>Enterprise-grade security and data governance</span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>
                    Your data remains private and is not used to train public
                    models
                  </span>
                </li>
                <li className="feature-list">
                  <img src={IconStar} alt="icon" className="mt-1" />
                  <span>
                    AI is applied responsibly to support interpretation and
                    insight
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-[var(--primary-color)] p-5 rounded-xl mt-8 ">
              <h2 className="md:text-2xl text-xl font-medium text-[var(--white-color)] mb-2">
                Why It Matters
              </h2>
              <p className="text-base font-normal text-[var(--white-color)]">
                POD Insights™ helps leaders work smarter turning complex
                organizational data into clear intelligence that supports better
                decisions during moments of change, transformation, and
                investment.
              </p>
            </div>

            <div className="rounded-xl mt-8">
              <h5 className="text-xl font-semibold text-center">
                From organizational data to decision clarity POD Insights™ helps
                leaders understand what matters most, and why.
              </h5>
            </div>
          </div>
        </div>
      </div>

      {/* POD Insights™ AI-Powered Organizational Intelligence End */}

      {/* Leadership Section Start */}
      <div className="lg:bg-[linear-gradient(117deg,rgba(237,245,253,0)_50%,#e4f0fc_100%)] bg-[linear-gradient(0deg,rgba(237,245,253,0)_50%,#e4f0fc4f_100%)]">
        <div
          className="md:py-20 pt-12 !bg-no-repeat !bg-contain"
          id="leader-bg-effect"
        >
          <div className="max-w-screen-2xl mx-auto xl:px-10 px-4">
            <div className="flex lg:justify-between justify-center items-center lg:flex-nowrap flex-wrap">
              <div>
                <h4 className="badge">
                  About talent by design collective inc.
                </h4>
                <h2 className="sub-heading">
                  Your Partner in{" "}
                  <span className="sub-heading-highlight">Leadership </span> and{" "}
                  <span className="sub-heading-highlight">Digital Growth </span>
                </h2>
                <p className="text-base font-normal mt-2 lg:max-w-3xl text-[var(--secondary-color)] ">
                  We’re an innovative leadership and development partner for
                  modern organizations. On our bench you will find ICF Certified
                  Coaches, Prosci Practitioners, Business Analysts, Data
                  Analysts, and skilled Learning and Development professionals &
                  facilitators.
                </p>
                <p className="text-base font-normal mt-5 lg:max-w-3xl text-[var(--secondary-color)] ">
                  <strong>
                    We offer three ways to deliver on the recommendations from
                    your POD-360™ report so you can choose the approach that
                    best fits your organization’s capabilities, goals and
                    budget.
                  </strong>
                  <div className="mt-5">
                    <p className="text-base font-normal mt-5 lg:max-w-3xl text-[var(--secondary-color)]">
                      <strong>1. Our Team</strong>
                    </p>
                    <p className="text-base font-normal mt-1 lg:max-w-3xl text-[var(--secondary-color)] ">
                      We design and deliver tailored programs aligned to your
                      priorities, and assemble the right mix of experts with the
                      skills and experience needed to support your organization
                      effectively.
                    </p>
                  </div>
                  <div className="mt-5">
                    <p className="text-base font-normal mt-5 lg:max-w-3xl text-[var(--secondary-color)]">
                      <strong>
                        2. Your Internal Specialists & Consultants
                      </strong>
                    </p>
                    <p className="text-base font-normal mt-1 lg:max-w-3xl text-[var(--secondary-color)] ">
                      Already have internal change management, learning, or
                      transformation specialists? Excellent. Our coaches partner
                      closely with your team, using the POD-360™ insights to
                      guide and support implementation.
                    </p>
                  </div>
                  <div className="mt-5">
                    <p className="text-base font-normal mt-5 lg:max-w-3xl text-[var(--secondary-color)]">
                      <strong>3. Hybrid Partnership</strong>
                    </p>
                    <p className="text-base font-normal mt-1 lg:max-w-3xl text-[var(--secondary-color)] ">
                      Prefer a blended approach? We co-design the delivery model
                      together combining internal expertise with our specialists
                      to build the right team and move the needle against the
                      report’s recommendations and action plan.
                    </p>
                  </div>
                  <p className="mt-5">
                    <strong>
                      In every engagement, we establish clear OKRs and use the
                      POD-360™ Assessment to measure progress and demonstrate
                      ROI. Before concluding our work together, we help
                      establish a Community of Practice to ensure long-term
                      capability, sustainability, and continued success.
                    </strong>
                  </p>
                </p>
              </div>
              <div className="lg:mt-0 mt-8">
                <img src={DigitalLeader} className="rounded-3xl" alt="Image" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Leadership Section End */}

      {/* Cta Section Start */}
      <div className="md:my-24 my-10 px-5">
        <div
          className="text-center mx-auto max-w-screen-xl sm:py-32 py-20  !bg-cover !bg-center !bg-no-repeat rounded-3xl"
          id="cta-bg"
        >
          <p className="text-base font-bold text-[var(--white-color)] mb-5 uppercase">
            See the Data in Action
          </p>
          <h2 className="lg:text-5xl md:text-4xl text-3xl leading-10 max-w-lg mx-auto font-bold text-[var(--white-color)] uppercase">
            Build on a foundation of clarity, capability, with real data.
          </h2>
          <div className="sm:mt-9 mt-5">
            <button
              type="button"
              className="mx-auto group text-[var(--dark-primary-color)] rounded-full py-2.5 pl-7 pr-3.5 flex items-center gap-1.5 font-semibold sm:text-lg text-base uppercase 
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

      {/* Build Resilient Start*/}
      {/* <div
        className="sm:flex-nowrap flex-wrap z-[100] fixed top-7 left-1/2 -translate-x-1/2 sm:w-[600px] w-11/12 sm:min-w-max mx-auto sm:justify-between justify-center flex items-center md:gap-x-10 gap-x-5 gap-y-2 px-2 py-2 pl-4 sm:rounded-full rounded-xl shadow-[4px_4px_4px_rgba(68,140,210,0.1)] sm:text-left text-center border border-[rgba(68,140,210,0.2)] bg-white"
        id="assessmentLink"
      >
        <h2 className="text-base leading-4 font-bold text-[var(--dark-primary-color)]">
          Are You Ready to Build a Resilient Organization?{" "}
        </h2>
        <button
          type="button"
          className="group text-[var(--white-color)] rounded-full py-2 pl-5 pr-2 flex items-center gap-1.5 font-semibold  text-sm uppercase bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)] whitespace-nowrap sm:scale-100 scale-90"
        >
          get started
          <Icon
            icon="mynaui:arrow-right-circle-solid"
            width="24"
            height="24"
            className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
          />
        </button>
      </div> */}

      <div
        id="assessmentLink"
        className={`
        sm:flex-nowrap flex-wrap z-[100] fixed left-1/2 sm:w-[600px] w-11/12 sm:min-w-max mx-auto sm:justify-between justify-center flex items-center md:gap-x-10 gap-x-5 gap-y-2 px-2 py-2 pl-4 sm:rounded-full rounded-xl bg-white
        shadow-[4px_4px_4px_rgba(68,140,210,0.1)] sm:text-left text-center border border-[rgba(68,140,210,0.2)]
        transition-all duration-700 ease-in-out -translate-x-1/2
        ${
          isVisible
            ? "top-7 opacity-100"
            : "-top-40 opacity-0 pointer-events-none"
        }
      `}
      >
        <h2 className="text-base leading-4 font-bold text-[var(--dark-primary-color)]">
          Are You Ready to Build a Resilient Organization?{" "}
        </h2>
        <button
          type="button"
          className="group text-[var(--white-color)] rounded-full py-2 pl-5 pr-2 flex items-center gap-1.5 font-semibold text-sm uppercase bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)] whitespace-nowrap sm:scale-100 scale-90"
        >
          get started
          <Icon
            icon="mynaui:arrow-right-circle-solid"
            width="24"
            height="24"
            className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
          />
        </button>
      </div>

      {/* Build  Resilient End*/}
      <Footer />

      {/* After clicking on the get started btn */}

      <button
        type="button"
        className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
        data-twe-toggle="modal"
        data-twe-target="#exampleModalCenter"
        data-twe-ripple-init
        data-twe-ripple-color="light"
      >
        Vertically centered modal
      </button>

      <div
        data-twe-modal-init
        className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="exampleModalCenter"
        tabIndex={-1}
        aria-labelledby="exampleModalCenterTitle"
        aria-modal="true"
        role="dialog"
      >
        <div
          data-twe-modal-dialog-ref
          className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-xl mx-auto"
        >
          <div className="mx-3 pointer-events-auto relative flex max-w-xl w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none dark:bg-surface-dark">
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 p-4 dark:border-white/10">
              <h5
                className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold"
                id="exampleModalCenterTitle"
              >
                Where do you want to go?
              </h5>

              <button
                type="button"
                className="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                data-twe-modal-dismiss
                aria-label="Close"
              >
                <span className="[&>svg]:h-6 [&>svg]:w-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              </button>
            </div>

            <div className="relative sm:py-8 py-4 px-4">
              <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-6 gap-4">
                <label
                  htmlFor="dashboard1"
                  className="cursor-pointer shadow-[4px_4px_4px_0px_#448CD21A] border border-[#448CD233] pt-3 pr-3 pb-6 pl-3 rounded-lg label-active"
                >
                  <div className="text-right">
                    <input
                      className="w-4 h-4 cursor-pointer"
                      type="radio"
                      id="dashboard1"
                      name="dashborder"
                    />
                  </div>
                  <div className="text-center">
                    <img src={Dashboard} className="mx-auto" alt="Dashboard" />
                    <h2 className="text-base font-semibold text-center mt-4">
                      Leader/Manager Dashboard Login
                    </h2>
                  </div>
                </label>

                <label
                  htmlFor="dashboard2"
                  className="label-active cursor-pointer shadow-[4px_4px_4px_0px_#448CD21A] border border-[#448CD233] pt-3 pr-3 pb-6 pl-3 rounded-lg"
                >
                  <div className="text-right">
                    <input
                      className="w-4 h-4 cursor-pointer"
                      type="radio"
                      id="dashboard2"
                      name="dashborder"
                    />
                  </div>
                  <div className="text-center">
                    <img
                      src={SolarUuser}
                      className="mx-auto"
                      alt="Solar User"
                    />
                    <h2 className="text-base font-semibold text-center mt-4">
                      Take the <br /> Assessment
                    </h2>
                  </div>
                </label>
              </div>
              <p className="text-center font-semibold text-sm text-[var(--secondary-color)] mt-4">
                No login required for the employees.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#E8E8E8] py-4  px-4">
              <button
                type="button"
                className="group text-[var(--primary-color)] pl-4 py-2 pr-2 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase   hover:opacity-100 duration-200"
                data-twe-modal-dismiss
                data-twe-ripple-init
                data-twe-ripple-color="light"
              >
                Exit
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="25"
                  height="25"
                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                />
              </button>
              <button
                type="button"
                className="group text-[var(--white-color)] pl-4 py-2 pr-2 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2]  hover:opacity-100 duration-200"
              >
                continue
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="25"
                  height="25"
                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                  data-twe-ripple-init
                  data-twe-ripple-color="light"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
     
      {/* After clicking on the get started btn */}
    </>
  );
};

export default Home;
