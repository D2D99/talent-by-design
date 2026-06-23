import { useEffect, useState, useRef } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Icon } from "@iconify/react";
import SpinnerLoader from "../../components/spinnerLoader";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const desktopPath = `
  M 500 0
  C 500 50, 150 50, 150 100
  C 150 150, 850 150, 850 200
  C 850 250, 150 250, 150 300
  C 150 350, 850 350, 850 400
  C 850 450, 150 450, 150 500
  C 150 550, 850 550, 850 600
  C 850 650, 150 650, 150 700
  C 150 750, 850 750, 850 800
  C 850 850, 150 850, 150 900
  C 150 950, 500 950, 500 1000
`;

const mobilePath = `
  M 150 0
  L 150 1000
`;

const steps = [
  {
    number: "01",
    title: "Confirm Intended Outcomes",
    badge: "FOUNDATION",
    icon: "solar:target-linear",
    summary:
      "We begin by understanding what the initiative was intended to achieve — reviewing the business case, expected benefits, success measures, and adoption goals.",
    clarify: [
      "What benefits were expected?",
      "What behaviours should have changed?",
      "What outcomes should leaders be able to see?",
      "What risks could prevent value from being realized?",
    ],
  },
  {
    number: "02",
    title: "Establish the Baseline",
    badge: "MEASUREMENT",
    icon: "solar:chart-2-linear",
    summary:
      "Before organizations can measure progress, they need a clear baseline. POD-360 helps establish the starting point for adoption, confidence, readiness, and sustainment.",
    clarify: [
      "Practical view of where employees, managers, and leaders are today",
      "Identifies where support may be needed",
      "Becomes the foundation for tracking movement over time",
    ],
  },
  {
    number: "03",
    title: "Launch the POD-360 Pulse",
    badge: "ASSESSMENT",
    icon: "solar:pulse-linear",
    summary:
      "Using structured pulse assessments, POD-360 gathers role-based feedback from employees, managers, and leaders — exploring whether people understand the change and are using new tools effectively.",
    clarify: [
      "What is working across the organization",
      "Where friction exists in daily workflows",
      "Where benefits may be at risk of not being realized",
    ],
  },
  {
    number: "04",
    title: "Analyze Adoption, Benefits & Risk",
    badge: "ANALYSIS",
    icon: "solar:graph-linear",
    summary:
      "POD-360 analyzes adoption patterns, sustainment risks, digital confidence, workflow integration, leadership alignment, and variance between expected and actual benefits.",
    clarify: [
      "Are people actually using the change as intended?",
      "Are the expected benefits being realized?",
      "Where are employees struggling?",
      "What needs to happen next to protect the investment?",
    ],
  },
  {
    number: "05",
    title: "Generate POD-Insights",
    badge: "INSIGHTS",
    icon: "solar:lightbulb-linear",
    summary:
      "POD-360 translates assessment data into clear, practical insights — helping leaders move the conversation from opinion to evidence.",
    clarify: [
      "Adoption themes and patterns",
      "Benefits realization indicators",
      "Risk flags and priority actions",
      "Recommended next steps",
    ],
  },
  {
    number: "06",
    title: "Align Leaders on Action",
    badge: "ALIGNMENT",
    icon: "solar:users-group-rounded-linear",
    summary:
      "We work with leaders, sponsors, and change teams to review findings, validate key themes, and identify the most important areas for intervention.",
    clarify: [
      "Sustainment actions aligned to business outcomes",
      "Not just communication or training activity",
      "Leadership consensus on priority next steps",
    ],
  },
  {
    number: "07",
    title: "Activate Sustainment Support",
    badge: "SUPPORT",
    icon: "solar:shield-up-linear",
    summary:
      "Based on insights, we help organizations activate targeted sustainment support to help employees move from initial awareness to confident, consistent use.",
    clarify: [
      "Focused communications & manager enablement",
      "Training refreshers and workflow support",
      "Leadership coaching and process improvements",
      "Adoption reinforcement activities",
    ],
  },
  {
    number: "08",
    title: "Track Benefits & Variance Over Time",
    badge: "TRACKING",
    icon: "solar:medal-ribbons-star-linear",
    summary:
      "Through repeat pulse checkpoints and benefits tracking, POD-360 helps organizations compare actual outcomes against intended benefits.",
    clarify: [
      "Identify benefits shortfalls and performance variance",
      "Spot adoption gaps and emerging risks",
      "Clear view of whether the change delivers value",
      "Data-driven decisions on what to adjust",
    ],
  },
  {
    number: "09",
    title: "Support Continuous Improvement",
    badge: "SUSTAINMENT",
    icon: "solar:refresh-circle-linear",
    summary:
      "POD-360 creates a continuous improvement cycle that helps organizations monitor progress, refine actions, and strengthen long-term adoption — moving beyond implementation into realized value.",
    clarify: [
      "Structured measurement over 24 months",
      "Practical insights that drive real action",
      "Change management support throughout",
      "Long-term adoption and sustainment",
    ],
  },
];

const StepCard = ({ step, index, scrollYProgress }: { step: any, index: number, scrollYProgress: MotionValue<number> }) => {
  const isEven = index % 2 === 0;
  const threshold = 0.1 + index * 0.1;
  const opacity = useTransform(scrollYProgress, [threshold - 0.1, threshold], [0.3, 1]);
  const y = useTransform(scrollYProgress, [threshold - 0.1, threshold], [30, 0]);
  const dotScale = useTransform(scrollYProgress, [threshold - 0.05, threshold], [0, 1]);

  return (
    <div className="h-[550px] md:h-[450px] w-full flex items-center relative">
      {/* Node Dot */}
      <div 
        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none ${isEven ? 'left-[15%]' : 'left-[15%] md:left-[85%]'}`}
      >
        <div className="w-8 h-8 bg-white border-[6px] border-[var(--primary-color)] rounded-full flex items-center justify-center shadow-md">
          <motion.div className="w-3 h-3 bg-[var(--primary-color)] rounded-full" style={{ scale: dotScale }} />
        </div>
      </div>

      <motion.div 
        style={{ opacity, y }}
        className={`w-[70%] md:w-[45%] ${isEven ? 'ml-[25%] md:ml-[22%]' : 'ml-[25%] md:ml-auto md:mr-[22%]'}`}
      >
        <div className="group relative bg-white rounded-3xl border border-[rgba(68,140,210,0.12)] hover:border-[rgba(68,140,210,0.35)] shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(68,140,210,0.12)] transition-all duration-500 overflow-hidden flex flex-col">
          {/* Top brand accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--dark-primary-color)]" />

          {/* Giant watermark step number */}
          <span className="absolute -top-4 -right-2 text-[120px] font-black leading-none select-none pointer-events-none text-[var(--light-primary-color)] transition-all duration-500 opacity-60 group-hover:opacity-100 group-hover:scale-105">
            {step.number}
          </span>

          <div className="relative z-10 p-6 sm:p-8 flex flex-col flex-grow">
            {/* Icon + badge row */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--light-primary-color)] flex items-center justify-center shadow-sm flex-shrink-0 group-hover:bg-[var(--primary-color)] transition-colors duration-500">
                <Icon
                  icon={step.icon}
                  className="size-6 text-[var(--primary-color)] group-hover:text-white transition-colors duration-500"
                />
              </div>
              <span className="text-[10px] font-black tracking-[0.15em] px-3 py-1.5 rounded-full border border-[rgba(68,140,210,0.2)] bg-[var(--light-primary-color)] text-[var(--dark-primary-color)] bg-opacity-90 backdrop-blur-sm">
                {step.badge}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-[var(--dark-primary-color)] text-xl font-black leading-snug tracking-tight mb-3 pr-8">
              {step.title}
            </h3>

            {/* Summary */}
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              {step.summary}
            </p>

            {/* Divider */}
            <div className="mt-auto pt-5 border-t border-[rgba(68,140,210,0.1)]">
              {/* Key points */}
              <ul className="space-y-2.5">
                {step.clarify.map((point: string, pi: number) => (
                  <li key={pi} className="flex items-start gap-2.5">
                    <div className="mt-0.5 w-4 h-4 rounded bg-[var(--light-primary-color)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--primary-color)] transition-colors duration-500">
                      <Icon
                        icon="solar:check-read-linear"
                        className="size-2.5 text-[var(--primary-color)] group-hover:text-white transition-colors duration-500"
                      />
                    </div>
                    <span className="text-[13px] font-medium text-slate-600 leading-snug">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const OurProcess = () => {
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Intersection observers logic is no longer needed since we use framer-motion

  if (pageLoading) return <SpinnerLoader />;

  return (
    <>
      <Header />

      {/* ── Hero ── */}
      <section className="relative sm:pt-32 pt-24 pb-20 px-4 z-0">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-50/30">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.2] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)]" />
          <div
            className="absolute -top-[30%] -left-[10%] w-[700px] h-[700px] bg-gradient-to-br from-[var(--primary-color)] via-blue-50 to-transparent opacity-20 rounded-full blur-[120px] mix-blend-multiply animate-pulse"
            style={{ animationDuration: "8s" }}
          />
          <div
            className="absolute top-[10%] -right-[10%] w-[600px] h-[600px] bg-gradient-to-tl from-[var(--secondary-color)] via-sky-50 to-transparent opacity-[0.10] rounded-full blur-[100px] mix-blend-multiply animate-pulse"
            style={{ animationDuration: "11s", animationDelay: "2s" }}
          />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full backdrop-blur-sm border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-sm font-semibold text-[var(--primary-color)] mb-6 tracking-wide bg-white/50">
            <Icon icon="solar:routing-bold-duotone" className="size-4" />
            POD-360 METHODOLOGY
          </div>

          <h1 className="relative text-4xl md:text-6xl font-bold tracking-tight text-slate-900 sm:mb-6 mb-3 md:leading-[1.2] !leading-tight capitalize">
            Moving beyond{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-bl from-[var(--primary-color)] to-[var(--dark-primary-color)]">
              go-live
            </span>{" "}
            to measurable value
          </h1>

          <p className="relative text-base md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Most organizations declare success at go-live — before anyone knows
            whether the change has truly been adopted or delivered intended
            benefits. At Talent By Design, this is all we do.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <button
              type="button"
              className="group text-white rounded-full py-3.5 pl-8 pr-4 flex items-center gap-2 font-semibold sm:text-lg text-base uppercase bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)] hover:shadow-[0_8px_16px_rgba(68,140,210,0.25)] transition-all duration-300"
              onClick={() => navigate("/contact-us")}
            >
              Start the Conversation
              <Icon
                icon="mynaui:arrow-right-circle-solid"
                width="26"
                height="26"
                className="-rotate-45 transition-transform duration-300 group-hover:rotate-0"
              />
            </button>
            <button
              type="button"
              className="rounded-full py-3.5 px-8 flex items-center gap-2 font-semibold sm:text-lg text-base border border-[rgba(68,140,210,0.3)] text-[var(--dark-primary-color)] bg-white/70 hover:bg-white hover:shadow-md transition-all duration-300"
              onClick={() => navigate("/what-we-offer")}
            >
              What We Offer
            </button>
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto">
            {[
              { value: "24", unit: "Months", label: "Post go-live support" },
              { value: "9", unit: "Steps", label: "Proven methodology" },
              { value: "360°", unit: "View", label: "Of adoption & value" },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
              >
                <div className="text-2xl font-bold text-[var(--dark-primary-color)]">
                  {s.value}
                  <span className="text-sm font-semibold text-[var(--primary-color)] ml-1">
                    {s.unit}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline Section ── */}
      <div className="relative bg-white overflow-hidden pb-24" ref={containerRef}>
        {/* Soft brand-colored ambient blobs */}
        <div className="absolute top-[10%] -right-[15%] w-[700px] h-[700px] rounded-full bg-[var(--primary-color)]/[0.05] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] -left-[15%] w-[600px] h-[600px] rounded-full bg-[var(--dark-primary-color)]/[0.04] blur-[120px] pointer-events-none" />

        {/* Section header */}
        <div className="relative z-10 pt-20 pb-16 px-4 text-center">
          <h4 className="badge mb-4">THE POD-360 PROCESS</h4>
          <h2 className="sub-heading !mx-auto">
            9 steps to{" "}
            <span className="sub-heading-highlight">sustained value</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto mt-4 leading-relaxed">
            From confirming intended outcomes to continuous improvement — every
            step is designed to protect your investment and prove the value of
            change.
          </p>
        </div>

        {/* Animated Timeline */}
        <div className="relative z-10 w-full max-w-screen-xl mx-auto xl:px-10 px-4">
          {/* Background SVG - Desktop */}
          <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
            <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-full h-full drop-shadow-xl">
              <path d={desktopPath} fill="transparent" stroke="rgba(68,140,210,0.15)" strokeWidth="4" vectorEffect="non-scaling-stroke" />
              <motion.path 
                d={desktopPath} 
                fill="transparent" 
                stroke="var(--primary-color)" 
                strokeWidth="6" 
                vectorEffect="non-scaling-stroke"
                style={{ pathLength: scrollYProgress }} 
              />
            </svg>
          </div>

          {/* Background SVG - Mobile */}
          <div className="absolute inset-0 z-0 pointer-events-none block md:hidden">
            <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-full h-full drop-shadow-md">
              <path d={mobilePath} fill="transparent" stroke="rgba(68,140,210,0.15)" strokeWidth="4" vectorEffect="non-scaling-stroke" />
              <motion.path 
                d={mobilePath} 
                fill="transparent" 
                stroke="var(--primary-color)" 
                strokeWidth="6" 
                vectorEffect="non-scaling-stroke"
                style={{ pathLength: scrollYProgress }} 
              />
            </svg>
          </div>

          {/* Steps Content Flow */}
          <div className="relative z-10 flex flex-col py-[275px] md:py-[225px]">
            {steps.map((step, index) => (
              <StepCard key={index} step={step} index={index} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>

      {/* ── The Result CTA ── */}
      <div className="md:py-24 py-16 bg-[linear-gradient(180deg,#ffffff_0%,var(--light-primary-color)_100%)] px-4">
        <div className="max-w-screen-2xl mx-auto xl:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <h4 className="badge mb-4">THE RESULT</h4>
              <h2 className="sub-heading !text-left !mx-0 !max-w-lg">
                Evidence-based{" "}
                <span className="sub-heading-highlight">confidence</span> in
                your investment
              </h2>
              <p className="text-base font-normal mt-6 text-[var(--secondary-color)] leading-relaxed">
                With POD-360, organizations gain a clear, evidence-based view of
                what is happening after go-live. They can see whether change is
                being adopted, whether benefits are being realized, and where
                targeted support is needed.
              </p>

              <div className="mt-8 grid sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: "solar:shield-check-linear",
                    label: "Protect Your Investment",
                  },
                  {
                    icon: "solar:graph-up-linear",
                    label: "Strengthen Adoption",
                  },
                  {
                    icon: "solar:medal-star-linear",
                    label: "Prove the Value of Change",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-5 border border-[rgba(68,140,210,0.15)] shadow-sm text-center"
                  >
                    <Icon
                      icon={item.icon}
                      className="size-8 text-[var(--primary-color)] mx-auto mb-2"
                    />
                    <p className="text-sm font-semibold text-[var(--dark-primary-color)] leading-snug">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="group mt-10 text-white rounded-full py-3.5 pl-8 pr-4 flex items-center gap-2 font-semibold text-base uppercase bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)] hover:shadow-[0_8px_16px_rgba(68,140,210,0.25)] transition-all duration-300 w-fit"
                onClick={() => navigate("/contact-us")}
              >
                Book a Discovery Call
                <Icon
                  icon="mynaui:arrow-right-circle"
                  width="26"
                  height="26"
                  className="-rotate-45 transition-transform duration-300 group-hover:rotate-0"
                />
              </button>
            </div>

            {/* Right: dark card */}
            <div className="bg-[var(--dark-primary-color)] rounded-3xl p-10 text-white relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[var(--primary-color)]/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <Icon
                  icon="solar:verified-check-linear"
                  className="size-12 text-[var(--primary-color)] mb-6"
                />
                <h3 className="text-2xl font-bold mb-4 leading-snug">
                  POD-360 is designed to support the critical post-go-live
                  period
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-8">
                  When adoption, sustainment, and realized value matter most —
                  POD-360 provides leaders with clear insight into where things
                  stand and what action is required.
                </p>
                <div className="space-y-3">
                  {[
                    "First 24 months post-implementation support",
                    "Structured measurement and evidence-based insights",
                    "Targeted sustainment actions that protect your ROI",
                  ].map((point, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Icon
                        icon="solar:check-circle-linear"
                        className="size-5 text-[var(--primary-color)] flex-shrink-0"
                      />
                      <span className="text-sm font-medium text-white/85">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OurProcess;
