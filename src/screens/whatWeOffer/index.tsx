import { useEffect, useState } from"react";
import Header from"../../components/header";
import Footer from"../../components/footer";
import { Icon } from"@iconify/react";
import SpinnerLoader from"../../components/spinnerLoader";
import { useNavigate } from"react-router-dom";

// Standard brand graphics
const IconStar ="/static/img/icons/ic-star.svg";
const Number1 ="/static/img/home/number-img-01.png";
const Number2 ="/static/img/home/number-img-02.png";
const Number3 ="/static/img/home/number-img-03.png";
const Number4 ="/static/img/home/number-img-04.png";
// const IdentifiesImg ="/static/img/home/identifies.png";
// const CapabilityPerformance ="/static/img/home/capability-performance.png";
const WwoImg ="/static/img/wwo-img.png";
// const WwoImg1 ="/static/img/wwo-img1.jpg";

const WhatWeOffer = () => {
 const navigate = useNavigate();
 const [pageLoading, setPageLoading] = useState(true);

 // Page Loader
 useEffect(() => {
 const timer = setTimeout(() => {
 setPageLoading(false);
 }, 1000);
 return () => clearTimeout(timer);
 }, []);

 if (pageLoading) {
 return <SpinnerLoader />;
 }

 return (
 <>
 <Header />

 {/* Hero Section */}
 <section className="relative sm:pt-32 pt-24 pb-20 px-4 z-0">
 {/* Animated Background Abstract (Mirrors Pricing Page) */}
 <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-50/30">
 {/* Modern Premium Grid */}
 <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.2] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)]"/>

 {/* Sleek Light Gradient Blobs */}
 <div
 className="absolute -top-[30%] -left-[10%] w-[700px] h-[700px] bg-gradient-to-br from-[var(--primary-color)] via-blue-50 to-transparent opacity-20 rounded-full blur-[120px] mix-blend-multiply animate-pulse"
 style={{ animationDuration:"8s"}}
 />
 <div
 className="absolute top-[10%] -right-[10%] w-[600px] h-[600px] bg-gradient-to-tl from-[var(--secondary-color)] via-sky-50 to-transparent opacity-[0.15] rounded-full blur-[100px] mix-blend-multiply animate-pulse"
 style={{ animationDuration:"10s", animationDelay:"2s"}}
 />

 {/* Animated Diagonal Light Beams */}
 <div
 className="absolute top-[-20%] left-[10%] w-[150%] h-[120px] bg-gradient-to-r from-transparent via-white to-transparent opacity-60 rotate-[-15deg] blur-[40px] mix-blend-overlay animate-pulse"
 style={{ animationDuration:"6s", animationDelay:"1s"}}
 />
 </div>

 <div className="max-w-3xl mx-auto text-center relative z-10">
 {/* Badge */}
 <div className="relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full backdrop-blur-sm border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-sm font-semibold text-[var(--primary-color)] mb-6 tracking-wide bg-white/50">
 <Icon
 icon="solar:star-fall-minimalistic-bold-duotone"
 className="size-4"
 />
 POST GO-LIVE SUPPORT
 </div>

 <h1 className="relative capitalize text-4xl md:text-6xl font-bold tracking-tight text-slate-900 sm:mb-6 mb-3 md:leading-[1.2] !leading-tight">
 Benefits realization &amp;{""}
 <span className="text-transparent bg-clip-text bg-gradient-to-bl from-[var(--primary-color)] to-[var(--dark-primary-color)]">&nbsp;change sustainment
 </span>
 </h1>

 <p className="relative text-base md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
 At Talent By Design Collective Inc., we help organizations move
 beyond implementation and measure whether change is actually being
 adopted, sustained, and delivering value.
 </p>

 <div className="flex justify-center gap-4">
 <button
 type="button"
 className="group text-white rounded-full py-3.5 pl-8 pr-4 flex items-center gap-2 font-semibold sm:text-lg text-base uppercase bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)] shadow-[0_8px_16px_rgba(68,140,210,0.2)] transition-all duration-300"
 onClick={() => navigate("/contact-us")}
 >
 Let’s Talk
 <Icon
 icon="mynaui:arrow-right-circle-solid"
 width="26"
 height="26"
 className="-rotate-45 transition-transform duration-300"
 />
 </button>
 </div>
 </div>
 </section>
 {/* Hero Section End */}

      {/* Intro Section - Sticky Layout with Standard Styling */}
      <div className="py-20 lg:py-28 bg-slate-50/50 relative border-b border-[rgba(68,140,210,0.1)]">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[var(--primary-color)]/5 to-transparent rounded-full blur-[100px] pointer-events-none -translate-y-1/2"></div>

        <div className="max-w-screen-2xl mx-auto xl:px-10 px-4 relative z-10">
          
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
            
            {/* Left Column: The Narrative (Sticky) */}
            <div className="lg:w-5/12 lg:sticky lg:top-32">
              <h4 className="badge mb-5">THE CRITICAL POST-GO-LIVE PERIOD</h4>
              <h2 className="sub-heading !text-left !mx-0">
                Sustaining <span className="sub-heading-highlight">Change</span>
              </h2>
              <p className="text-lg sm:text-xl font-medium mt-6 text-[var(--secondary-color)] leading-relaxed">
                Using our proprietary POD-360 software and change management
                methodology, we support organizations through the critical
                post-go-live period.
              </p>
              <div className="mt-8 border-l-2 border-[var(--primary-color)] pl-6">
                <p className="text-base font-normal text-[var(--secondary-color)] leading-relaxed">
                  This is the make-or-break moment when employees are adjusting to new ways of
                  working, leaders need visibility into adoption, and the business
                  expects to see measurable outcomes.
                </p>
              </div>
            </div>

            {/* Right Column: The Questions (Grid) */}
            <div className="lg:w-7/12">
              <h3 className="text-2xl font-bold text-[var(--dark-primary-color)] mb-10 tracking-tight">
                Organizations invest heavily in change, but want to know:
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { q: "Are employees adopting the change?", i: "solar:users-group-rounded-linear" },
                  { q: "Are teams confident and capable in the new way of working?", i: "solar:shield-check-linear" },
                  { q: "Are operational processes stabilizing?", i: "solar:settings-linear" },
                  { q: "Are intended benefits being realized?", i: "solar:chart-square-linear" },
                  { q: "Where are risks, resistance, or gaps emerging?", i: "solar:danger-triangle-linear" },
                  { q: "What actions are needed to protect the investment?", i: "solar:shield-keyhole-linear" }
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col gap-5">
                    <div className="w-12 h-12 rounded-full bg-[var(--light-primary-color)]/30 flex items-center justify-center">
                      <Icon icon={item.i} className="w-6 h-6 text-[var(--primary-color)]" />
                    </div>
                    <p className="text-lg font-semibold text-[var(--secondary-color)] leading-snug">
                      {item.q}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

 {/* Offerings Section Start - UNTOUCHED (Approved by User) */}
 <div className="md:py-24 py-16 bg-[linear-gradient(180deg,#ffffff_0%,var(--light-primary-color)_100%)] relative">
 <div className="max-w-screen-2xl mx-auto xl:px-10 px-4">
 <div className="mb-16 text-center max-w-3xl mx-auto">
 <h4 className="badge">TAILORED SUPPORT</h4>
 <h2 className="sub-heading !mx-auto">
 Our Service <span className="sub-heading-highlight">Offerings</span>
 </h2>
 <p className="text-base font-normal mt-3 text-[var(--secondary-color)]">
 Structured pulse assessments, benefits tracking, insight reporting, and targeted change management support for up to 24 months after go-live.
 </p>
 </div>

 <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
 {/* Offering 1 */}
 <div className="home-step-card group shadow-[4px_4px_15px_0_rgba(68,140,210,0.05)] transition-all duration-300 border border-[rgba(68,140,210,0.2)] sm:p-8 p-6 bg-white rounded-2xl flex flex-col h-full relative overflow-hidden">
 <img src={Number1} className="w-20 absolute top-6 right-6 opacity-80 transition-transform duration-500"alt="Number 1"/>
 
 <div className="w-3/4">
 <h3 className="home-step-title sm:text-2xl text-xl font-bold mb-3">
 POD-360 Pulse Assessment
 </h3>
 <p className="text-base font-normal mt-1 text-[var(--secondary-color)]">
 A focused assessment designed to give leaders a clear snapshot of
 how change is landing across the organization.
 </p>
 </div>

 <div className="mt-6 mb-6">
 <p className="text-[13px] font-bold text-[var(--dark-primary-color)] uppercase tracking-wider mb-3">
 Measures three core dimensions:
 </p>
 <ul className="space-y-3">
 <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
 <img src={IconStar} alt="icon"className="mt-1 w-4 h-4 flex-shrink-0"/>
 <span className="text-sm text-[var(--secondary-color)]">
 <strong className="text-[var(--dark-primary-color)]">People Potential:</strong> Feeling, adapting, and engaging.
 </span>
 </li>
 <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
 <img src={IconStar} alt="icon"className="mt-1 w-4 h-4 flex-shrink-0"/>
 <span className="text-sm text-[var(--secondary-color)]">
 <strong className="text-[var(--dark-primary-color)]">Operational Steadiness:</strong> Clarity of processes & expectations.
 </span>
 </li>
 <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
 <img src={IconStar} alt="icon"className="mt-1 w-4 h-4 flex-shrink-0"/>
 <span className="text-sm text-[var(--secondary-color)]">
 <strong className="text-[var(--dark-primary-color)]">Digital Fluency:</strong> Confidence in using new tools & data.
 </span>
 </li>
 </ul>
 </div>

 <div className="mt-auto pt-5 border-t border-[var(--app-border-color)]">
 <strong className="text-[var(--primary-color)] uppercase text-[11px] tracking-widest block mb-1">Best For:</strong>
 <span className="text-sm font-medium text-[var(--secondary-color)] leading-snug block">Post-go-live health checks, adoption reviews, leadership reporting, and early identification of change risks.</span>
 </div>
 </div>

 {/* Offering 2 */}
 <div className="home-step-card group shadow-[4px_4px_15px_0_rgba(68,140,210,0.05)] transition-all duration-300 border border-[rgba(68,140,210,0.2)] sm:p-8 p-6 bg-white rounded-2xl flex flex-col h-full relative overflow-hidden">
 <img src={Number2} className="w-20 absolute top-6 right-6 opacity-80 transition-transform duration-500"alt="Number 2"/>
 
 <div className="w-3/4">
 <h3 className="home-step-title sm:text-2xl text-xl font-bold mb-3">
 Benefits Realization Starter
 </h3>
 <p className="text-base font-normal mt-1 text-[var(--secondary-color)]">
 Establish a clear baseline for tracking whether expected outcomes
 are being realized after implementation.
 </p>
 </div>
 
 <div className="mt-6 mb-6">
 <p className="text-[13px] font-bold text-[var(--dark-primary-color)] uppercase tracking-wider mb-3">
 What's included:
 </p>
 <div className="bg-[var(--primary-color)]/5 p-5 rounded-xl border border-[var(--primary-color)]/10">
 <p className="text-sm font-medium text-[var(--secondary-color)] leading-relaxed">
 A POD-360 pulse assessment, benefits-focused analysis, and a practical insights report that connects employee adoption and operational readiness to the intended value of the initiative.
 </p>
 <p className="text-sm font-medium text-[var(--secondary-color)] mt-3 leading-relaxed">
 Understand whether you are on track to achieve outcomes from the business case or project charter.
 </p>
 </div>
 </div>

 <div className="mt-auto pt-5 border-t border-[var(--app-border-color)]">
 <strong className="text-[var(--primary-color)] uppercase text-[11px] tracking-widest block mb-1">Best For:</strong>
 <span className="text-sm font-medium text-[var(--secondary-color)] leading-snug block">Organizations moving from project delivery reporting to benefits realization reporting.</span>
 </div>
 </div>

 {/* Offering 3 */}
 <div className="home-step-card group shadow-[4px_4px_15px_0_rgba(68,140,210,0.05)] transition-all duration-300 border border-[rgba(68,140,210,0.2)] sm:p-8 p-6 bg-white rounded-2xl flex flex-col h-full relative overflow-hidden">
 <img src={Number3} className="w-20 absolute top-6 right-6 opacity-80 transition-transform duration-500"alt="Number 3"/>
 
 <div className="w-3/4">
 <h3 className="home-step-title sm:text-2xl text-xl font-bold mb-3">
 Change Sustainment Program
 </h3>
 <p className="text-base font-normal mt-1 text-[var(--secondary-color)]">
 Ongoing pulse assessments and change management support over a defined sustainment period.
 </p>
 </div>

 <div className="mt-6 mb-6">
 <div className="bg-slate-50 border-l-4 border-[var(--primary-color)] p-5 rounded-r-xl">
 <p className="text-sm font-medium text-[var(--secondary-color)] leading-relaxed italic">
"Rather than relying on a single post-go-live survey, this offering
 tracks change over time."
 </p>
 </div>
 <p className="text-sm font-medium text-[var(--secondary-color)] leading-relaxed mt-4">
 Helps leaders see whether adoption is
 improving, whether confidence is increasing, and whether
 operational issues are being resolved or repeated. Each pulse provides insight into what is working and what actions are needed next.
 </p>
 </div>

 <div className="mt-auto pt-5 border-t border-[var(--app-border-color)]">
 <strong className="text-[var(--primary-color)] uppercase text-[11px] tracking-widest block mb-1">Best For:</strong>
 <span className="text-sm font-medium text-[var(--secondary-color)] leading-snug block">Organizations that want structured support for 6 to 12 months after go-live.</span>
 </div>
 </div>

 {/* Offering 4 */}
 <div className="home-step-card group shadow-[4px_4px_15px_0_rgba(68,140,210,0.05)] transition-all duration-300 border border-[var(--primary-color)] sm:p-8 p-6 bg-white rounded-2xl flex flex-col h-full relative overflow-hidden">
 <div className="absolute top-0 right-0 bg-[var(--primary-color)] text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest">Comprehensive</div>
 <img src={Number4} className="w-20 absolute top-8 right-6 opacity-80 transition-transform duration-500"alt="Number 4"/>
 
 <div className="w-3/4 mt-2">
 <h3 className="home-step-title sm:text-2xl text-xl font-bold mb-3 text-[var(--dark-primary-color)]">
 Benefits Realization Partnership
 </h3>
 <p className="text-base font-normal mt-1 text-[var(--secondary-color)]">
 Our most comprehensive offering supports organizations for up to 24
 months post go-live.
 </p>
 </div>

 <div className="mt-6 mb-6">
 <ul className="space-y-3">
 <li className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full bg-[var(--light-primary-color)] flex items-center justify-center flex-shrink-0">
 <Icon icon="solar:history-bold-duotone"className="text-[var(--primary-color)] w-4 h-4"/>
 </div>
 <span className="text-sm font-medium text-[var(--secondary-color)]">Recurring POD-360 pulse assessments</span>
 </li>
 <li className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full bg-[var(--light-primary-color)] flex items-center justify-center flex-shrink-0">
 <Icon icon="solar:chart-bold-duotone"className="text-[var(--primary-color)] w-4 h-4"/>
 </div>
 <span className="text-sm font-medium text-[var(--secondary-color)]">Continuous benefits tracking</span>
 </li>
 <li className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full bg-[var(--light-primary-color)] flex items-center justify-center flex-shrink-0">
 <Icon icon="solar:shield-check-bold-duotone"className="text-[var(--primary-color)] w-4 h-4"/>
 </div>
 <span className="text-sm font-medium text-[var(--secondary-color)]">Change management advisory support</span>
 </li>
 </ul>
 </div>

 <div className="mt-auto pt-5 border-t border-[var(--primary-color)]/20 bg-[var(--light-primary-color)] -mx-6 -mb-6 px-6 pb-6 pt-5 rounded-b-2xl">
 <strong className="text-[var(--primary-color)] uppercase text-[11px] tracking-widest block mb-1">Best For:</strong>
 <span className="text-sm font-medium text-[var(--dark-primary-color)] leading-snug block">Enterprise tech implementations, multi-phase transformation programs, operating model changes, and initiatives with significant strategic importance.</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 {/* Offerings Section End */}

 {/* Difference & Importance Section - Side-by-Side Image Layout */}
 <div className="md:py-24 py-16 bg-white overflow-hidden">
 <div className="max-w-screen-2xl mx-auto xl:px-10 px-4 space-y-24">
 
 {/* Section 1: Different */}
 <div className="grid lg:grid-cols-2 grid-cols-1 gap-12 items-center">
 <div className="order-2 lg:order-1 relative group w-full">
 <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)]/5 to-transparent rounded-[2.5rem] blur-xl transition-all duration-500 opacity-50"></div>
 <img src={WwoImg} alt="WHAT MAKES POD-360 DIFFERENT"className="relative w-full aspect-[4/3] object-cover rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 transition-all duration-700 ease-out"/>
 </div>
 <div className="order-1 lg:order-2">
 <h4 className="badge mb-3">WHAT MAKES POD-360 DIFFERENT</h4>
 <h2 className="sub-heading">
 Not a <span className="sub-heading-highlight">one-time</span> survey
 </h2>
 <p className="text-lg font-normal mt-6 text-[var(--secondary-color)] leading-relaxed">
 POD-360 is not a one-time survey and it is not a generic change management toolkit.
 </p>
 <p className="text-lg font-normal mt-4 text-[var(--secondary-color)] leading-relaxed">
 It is a proprietary software-enabled solution designed specifically to help organizations measure and sustain change after go-live.
 </p>
 <div className="mt-8 border-l-4 border-[var(--primary-color)] pl-6">
 <p className="text-base font-medium text-[var(--dark-primary-color)] italic">
"We combine structured employee pulse data, benefits realization thinking, and practical change management expertise to help leaders answer the question that matters most: Is this change actually working?"
 </p>
 </div>
 </div>
 </div>

 {/* Section 2: Why It Matters */}
 <div className="grid lg:grid-cols-2 grid-cols-1 gap-12 items-center">
 <div>
 <h4 className="badge mb-3">WHY IT MATTERS</h4>
 <h2 className="sub-heading">
 Value <span className="sub-heading-highlight">Realized</span> After Go-Live
 </h2>
 <p className="text-lg font-bold mt-6 text-[var(--dark-primary-color)]">
 A successful launch does not guarantee successful adoption.
 </p>
 <p className="text-base font-normal mt-4 text-[var(--secondary-color)] leading-relaxed">
 Many organizations invest heavily in new systems, processes, and transformation initiatives, only to shift attention to the next priority once go-live is complete. But the true value of change is realized after implementation — when people begin using the new tools, following new processes, and embedding new behaviours into daily work.
 </p>
 <p className="text-base font-bold mt-6 text-[var(--dark-primary-color)]">
 POD-360 helps organizations stay focused during this critical period.
 </p>
 <p className="text-base font-normal mt-2 text-[var(--secondary-color)] leading-relaxed">
 We help leaders see what is happening beneath the surface, respond to emerging risks, and take action before adoption issues become long-term sustainment problems.
 </p>
 </div>
 <div className="relative group w-full">
 <div className="absolute inset-0 bg-gradient-to-bl from-[var(--primary-color)]/5 to-transparent rounded-[2.5rem] blur-xl transition-all duration-500 opacity-50"></div>
 <img src={WwoImg} alt="POD-360 Capability and Performance Tracking"className="relative w-full aspect-[4/3] object-cover rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 transition-all duration-700 ease-out"/>
 </div>
 </div>

 </div>
 </div>
 {/* Difference & Importance Section End */}

  {/* Support & Outcome Section - Premium Light Bento Style */}
  <div className="relative py-24 overflow-hidden z-0 bg-slate-50/50">

  <div className="max-w-screen-2xl mx-auto xl:px-10 px-4 relative z-10">
  <div className="mb-16 text-center">
  <h4 className="badge mb-5">
  WHO WE SUPPORT
  </h4>
  <h2 className="sub-heading !mx-auto">
  Initiatives We <span className="sub-heading-highlight">Sustain</span>
  </h2>
  <p className="text-lg sm:text-xl font-medium max-w-3xl mx-auto mt-6 text-[var(--secondary-color)] leading-relaxed">
  POD-360 is perfectly positioned for organizations actively implementing or sustaining:
  </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
  {[
  { t: "Large-Scale Transformation", d: "Enterprise-wide strategy execution and culture shifts.", i: "solar:global-linear", span: "md:col-span-2 md:row-span-2" },
  { t: "Digital Initiatives", d: "Guiding people through sweeping digital changes.", i: "solar:rocket-linear", span: "md:col-span-2" },
  { t: "ERP, CRM & HRIS", d: "Maximizing ROI on complex enterprise systems.", i: "solar:database-linear", span: "md:col-span-2" },
  { t: "M365 & Workspace Rollouts", d: "Driving collaboration and workplace productivity.", i: "solar:users-group-two-rounded-linear", span: "md:col-span-2" },
  { t: "Operating Model Changes", d: "Aligning teams to new operational standards.", i: "solar:branching-paths-up-linear", span: "md:col-span-2 md:row-span-2" },
  { t: "New Tech Platforms", d: "Ensuring seamless adoption of critical software.", i: "solar:laptop-minimalistic-linear", span: "md:col-span-2" }
  ].map((item, i) => (
  <div key={i} className={`relative bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_8px_40px_rgb(0,0,0,0.06)] flex flex-col overflow-hidden ${item.span}`}>
  {/* Massive subtle watermark icon */}
  <Icon icon={item.i} className="absolute -right-6 -bottom-6 w-56 h-56 text-slate-50 rotate-[-15deg] pointer-events-none" />
  
  <div className="w-14 h-14 rounded-2xl bg-[var(--light-primary-color)]/30 flex items-center justify-center mb-8 relative z-10">
  <Icon icon={item.i} className="size-10 text-[var(--dark-primary-color)]" />
  </div>
  
  <div className="mt-auto relative z-10">
  <h3 className="text-xl font-bold text-[var(--dark-primary-color)] mb-2">{item.t}</h3>
  <p className="text-sm font-medium text-[var(--secondary-color)] leading-relaxed">{item.d}</p>
  </div>
  </div>
  ))}
  </div>

  {/* The Outcome Statement */}
  <div className="relative max-w-5xl mx-auto mt-20">
  <div className="bg-white rounded-[2.5rem] p-12 sm:p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200">
  <h4 className="badge mb-6">THE OUTCOME</h4>
  <h3 className="text-3xl sm:text-4xl font-bold text-[var(--dark-primary-color)] mb-6 leading-tight">
  Protect your investment, support your people, and <span className="text-[var(--primary-color)]">prove the value</span> of change after go-live.
  </h3>
  <p className="text-lg sm:text-xl font-medium text-[var(--secondary-color)] leading-relaxed max-w-3xl mx-auto">
  With POD-360, leaders gain clearer evidence of adoption, stronger visibility into sustainment risks, and a more practical way to track whether intended benefits are being realized.
  </p>
  </div>
  </div>
  </div>
 </div>
 {/* Support & Outcome Section End */}

 {/* Cta Section Start */}
 <div className="md:my-24 my-12 px-4 sm:px-5">
 <div
 className="text-center mx-auto max-w-screen-xl sm:py-32 py-20 rounded-3xl"
 id="cta-bg"
 >
 <p className="text-sm font-bold text-[var(--white-color)] mb-4 uppercase tracking-widest">
 Ready to Measure Success?
 </p>
 <h2 className="lg:text-5xl md:text-4xl text-3xl leading-tight max-w-xl mx-auto font-black text-[var(--white-color)] capitalize">
 Discover how POD-360 can protect your investment.
 </h2>
 <div className="sm:mt-10 mt-8">
 <button
 onClick={() => navigate("/contact-us")}
 className="mx-auto w-fit group text-[var(--dark-primary-color)] rounded-full py-3.5 pl-8 pr-4 flex items-center gap-2 font-bold sm:text-lg text-base uppercase bg-white border border-[var(--primary-color)] shadow-xl transition-all duration-300"
 >
 Book a Strategy Call
 <Icon
 icon="mynaui:arrow-right-circle-solid"
 width="26"
 height="26"
 className="-rotate-45 transition-transform duration-300"
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

export default WhatWeOffer;
