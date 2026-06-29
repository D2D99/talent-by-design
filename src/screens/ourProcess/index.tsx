import { useEffect, useState, useRef } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Icon } from "@iconify/react";
import SpinnerLoader from "../../components/spinnerLoader";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────
   DATA  (untouched)
───────────────────────────────────────────── */
const steps = [
  {
    number: "01",
    title: "Confirm Intended Outcomes",
    badge: "FOUNDATION",
    icon: "solar:target-linear",
    summary:
      "We begin by understanding what the initiative was intended to achieve. This includes reviewing the business case, expected benefits, success measures, adoption goals, and the outcomes leaders hoped to see after implementation. This step ensures POD-360 is not measuring activity for the sake of activity — it is measuring progress against what actually matters.",
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
      "Provides a practical view of where employees, managers, and leaders are today",
      "Highlights where support may be needed",
      "Becomes the foundation for tracking movement over time",
    ],
  },
  {
    number: "03",
    title: "Launch the POD-360 Pulse",
    badge: "ASSESSMENT",
    icon: "solar:pulse-linear",
    summary:
      "Using structured pulse assessments, POD-360 gathers role-based feedback from employees, managers, and leaders. The assessment looks beyond whether a system is live. It explores whether people understand the change, are using the new tools or processes effectively, and feel supported in making the change part of daily work.",
    clarify: [
      "Uncovers what is working",
      "Identifies where friction exists",
      "Highlights where benefits may be at risk",
    ],
  },
  {
    number: "04",
    title: "Analyze Adoption, Benefits, and Risk",
    badge: "ANALYSIS",
    icon: "solar:graph-linear",
    summary:
      "Once the pulse data is collected, POD-360 analyzes the signals that matter most. We look at adoption patterns, sustainment risks, digital confidence, workflow integration, leadership alignment, and variance between expected and actual benefits.",
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
      "POD-360 translates assessment data into clear, practical insights. Leaders receive a focused view of what is working, what is not yet sticking, and where action is required. These insights help move the conversation from opinion to evidence.",
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
      "Insights only create value when they lead to action. We work with leaders, sponsors, and change teams to review the findings, validate key themes, and identify the most important areas for intervention.",
    clarify: [
      "Sustainment actions aligned to business outcomes",
      "Not just communication or training activity",
      "Identifies the most important areas for intervention",
    ],
  },
  {
    number: "07",
    title: "Activate Sustainment Support",
    badge: "SUPPORT",
    icon: "solar:shield-up-linear",
    summary:
      "Based on the insights, we help organizations activate targeted sustainment support. The goal is to help employees move from initial awareness to confident, consistent use.",
    clarify: [
      "Focused communications & manager enablement",
      "Training refreshers and workflow support",
      "Leadership coaching and process improvements",
      "Adoption reinforcement",
    ],
  },
  {
    number: "08",
    title: "Track Benefits & Variance Over Time",
    badge: "TRACKING",
    icon: "solar:medal-ribbons-star-linear",
    summary:
      "POD-360 is designed to support the critical post-go-live period when benefits can either be realized or quietly lost. Through repeat pulse checkpoints and benefits tracking, we help organizations compare actual outcomes against intended benefits.",
    clarify: [
      "Identify benefits shortfalls and performance variance",
      "Spot adoption gaps and emerging risks",
      "Clearer view of whether the change is delivering value",
      "Data-driven decisions on what needs to be adjusted",
    ],
  },
  {
    number: "09",
    title: "Support Continuous Improvement",
    badge: "SUSTAINMENT",
    icon: "solar:refresh-circle-linear",
    summary:
      "Sustainment is not a one-time activity. POD-360 creates a continuous improvement cycle that helps organizations monitor progress, refine actions, and strengthen long-term adoption.",
    clarify: [
      "Combines structured measurement with practical insights",
      "Ongoing change management support",
      "Moves beyond implementation into realized value",
      "Strengthens long-term adoption",
    ],
  },
];

/* ─────────────────────────────────────────────
   Premium Alternating Timeline
───────────────────────────────────────────── */

const CardContent = ({
  step,
  gradientRatio,
  isLeft = false,
}: {
  step: (typeof steps)[0];
  gradientRatio: number;
  isLeft?: boolean;
}) => {
  const accentColor = `linear-gradient(160deg, var(--primary-color) ${100 - gradientRatio * 70}%, var(--dark-primary-color))`;

  return (
    <div className="relative overflow-hidden">
      {/* Ghost step number watermark */}
      <span
        className="absolute -bottom-3 right-2 text-[80px] font-black leading-none select-none pointer-events-none transition-all duration-500"
        style={{ color: "rgba(68,140,210,0.045)", lineHeight: 1 }}
      >
        {step.number}
      </span>

      {/* Top row: icon + badge */}
      <div
        className={`flex items-start gap-3 mb-4 ${isLeft ? "flex-row" : "flex-row"}`}
      >
        {/* Icon with glow ring */}
        <div className="relative flex-shrink-0">
          <div
            className="absolute inset-0 rounded-2xl opacity-0 blur-md transition-opacity duration-500"
            style={{ background: accentColor }}
          />
          <div
            className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 z-10"
            style={{ background: accentColor }}
          >
            <Icon icon={step.icon} className="size-5" />
          </div>
        </div>

        {/* Badge + Title stacked */}
        <div className="flex-1 min-w-0 pt-0.5">
          <span className="inline-block text-[8.5px] font-black tracking-[0.22em] px-2.5 py-0.5 rounded-full bg-[var(--light-primary-color)] text-[var(--primary-color)] uppercase mb-1.5">
            {step.badge}
          </span>
          <h3 className="text-xl font-semibold text-[var(--secondary-color)] transition-colors duration-300 truncate">
            {step.title}
          </h3>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-[var(--app-text-muted)] leading-relaxed mb-0 relative z-10">
        {step.summary}
      </p>

      {/* Bullet points */}
      {step.clarify && step.clarify.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[rgba(68,140,210,0.1)] relative z-10">
          <ul className="space-y-2">
            {step.clarify.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div
                  className="mt-1.5 size-1.5 rounded-full flex-shrink-0 ring-2 ring-[var(--light-primary-color)]"
                  style={{ background: accentColor }}
                />
                <span className="text-sm text-[var(--app-text-muted)] leading-snug">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const TimelineCard = ({
  step,
  index,
  total,
}: {
  step: (typeof steps)[0];
  index: number;
  total: number;
}) => {
  const isLeft = index % 2 === 0;
  const gradientRatio = index / (total - 1);
  const accentColor = `linear-gradient(160deg, var(--primary-color) ${100 - gradientRatio * 70}%, var(--dark-primary-color))`;

  const card = (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.04,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="relative bg-white border border-[rgba(68,140,210,0.12)] rounded-2xl shadow-[0_2px_16px_rgba(68,140,210,0.07)] hover:shadow-[0_12px_32px_-6px_rgba(68,140,210,0.2)] hover:border-[rgba(68,140,210,0.28)] transition-all duration-400 overflow-hidden group"
    >
      {/* Colored accent bar on top */}
      <div className="h-[3px] w-full" style={{ background: accentColor }} />

      {/* Card body */}
      <div className="p-5">
        {/* Hover wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--light-primary-color)]/25 via-transparent to-transparent opacity-0  transition-opacity duration-500 pointer-events-none" />
        <CardContent
          step={step}
          gradientRatio={gradientRatio}
          isLeft={isLeft}
        />
      </div>
    </motion.div>
  );

  return (
    <>
      {/* ── DESKTOP: 3-column grid ── */}
      <div className="hidden md:grid group grid-cols-[1fr_72px_1fr] items-center">
        {/* LEFT SLOT */}
        <div className="pr-5">{isLeft ? card : <div />}</div>

        {/* CENTER — node */}
        <div className="flex justify-center relative z-20">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 22,
              delay: index * 0.04,
            }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-[var(--primary-color)] blur-sm opacity-0 transition-opacity duration-400" />
            <div
              className="w-10 h-10 rounded-full border-2 border-white shadow-[0_2px_12px_rgba(68,140,210,0.3)] flex items-center justify-center text-white text-[11px] font-black relative z-10 transition-transform duration-300"
              style={{
                background: `linear-gradient(135deg, var(--primary-color) ${100 - gradientRatio * 70}%, var(--dark-primary-color))`,
              }}
            >
              {step.number}
            </div>
          </motion.div>
        </div>

        {/* RIGHT SLOT */}
        <div className="pl-5">{!isLeft ? card : <div />}</div>
      </div>

      {/* ── MOBILE: left-rail layout ── */}
      <div className="md:hidden flex items-start md:gap-4 gap-2">
        {/* Node */}
        <div className="flex-shrink-0 mt-4 relative">
          <div className="absolute inset-0 rounded-full bg-[var(--primary-color)] blur-sm opacity-0 transition-opacity duration-400" />
          <div
            className="w-9 h-9 rounded-full border-2 border-white shadow-[0_2px_10px_rgba(68,140,210,0.25)] flex items-center justify-center text-white text-[11px] font-black relative z-10 md:translate-x-0 -translate-x-3.5 md:translate-y-0 -translate-y-4"
            style={{
              background: `linear-gradient(135deg, var(--primary-color) ${100 - gradientRatio * 70}%, var(--dark-primary-color))`,
            }}
          >
            {step.number}
          </div>
        </div>

        {/* Card — full width on mobile */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: index * 0.04 }}
          className="flex-1 relative bg-white border border-[rgba(68,140,210,0.12)] rounded-2xl shadow-[0_2px_16px_rgba(68,140,210,0.07)] overflow-hidden group"
        >
          {/* Colored accent bar on top */}
          <div className="h-[3px] w-full" style={{ background: accentColor }} />
          <div className="p-5 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--light-primary-color)]/20 to-transparent pointer-events-none" />
            <CardContent step={step} gradientRatio={gradientRatio} />
          </div>
        </motion.div>
      </div>
    </>
  );
};

const SleekTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={containerRef}
      className="relative max-w-5xl mx-auto px-4 xl:px-0 pb-24"
    >
      {/* Desktop center track */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-[rgba(68,140,210,0.15)]" />
      <motion.div
        className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 w-[2px] origin-top rounded-full z-10"
        style={{
          scaleY: lineScaleY,
          height: "100%",
          background:
            "linear-gradient(to bottom, var(--primary-color), var(--dark-primary-color))",
        }}
      />

      {/* Mobile left-rail track */}
      <div className="md:hidden absolute left-[18px] top-0 bottom-0 w-px bg-[rgba(68,140,210,0.15)]" />
      <motion.div
        className="md:hidden absolute left-[18px] top-0 w-[2px] origin-top rounded-full z-10"
        style={{
          scaleY: lineScaleY,
          height: "100%",
          background:
            "linear-gradient(to bottom, var(--primary-color), var(--dark-primary-color))",
        }}
      />

      <div className="flex flex-col gap-5 md:gap-6 relative z-20">
        {steps.map((step, index) => (
          <TimelineCard
            key={index}
            step={step}
            index={index}
            total={steps.length}
          />
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const OurProcess = () => {
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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

          <div className="flex justify-center sm:flex-nowrap flex-wrap gap-5">
            <button
              type="button"
              className="group text-white rounded-full py-2.5 pl-7 pr-3.5 flex items-center gap-1.5 font-semibold sm:text-lg text-base uppercase bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)]"
              onClick={() => navigate("/contact-us")}
            >
              start the conversation
              <Icon
                icon="mynaui:arrow-right-circle-solid"
                width="24"
                height="24"
                className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
              />
            </button>
            <button
              type="button"
              className="group text-[var(--primary-color)] rounded-full py-2.5 pl-7 pr-3.5 flex items-center gap-1.5 font-semibold sm:text-lg text-base uppercase bg-gradient-to-r bg-[var(--white-color)] border-solid border-[var(--primary-color)] border"
              onClick={() => navigate("/what-we-offer")}
            >
              what we offer
              <Icon
                icon="mynaui:arrow-right-circle-solid"
                width="24"
                height="24"
                className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
              />
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 max-w-xl mx-auto justify-center">
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

      {/* ── Sleek Timeline Section ── */}
      <div className="relative overflow-hidden bg-slate-50/50">
        {/* Subtle top border gradient */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent absolute top-0" />

        {/* Ambient blobs */}
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#448cd2]/[0.03] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full bg-[#1a3652]/[0.02] blur-[90px] pointer-events-none" />

        {/* Section header */}
        <div className="relative z-10 pt-24 pb-16 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="badge mb-4">THE POD-360 PROCESS</h4>
            <h2 className="sub-heading !mx-auto">
              9 steps to{" "}
              <span className="sub-heading-highlight">sustained value</span>
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto mt-4 leading-relaxed">
              From confirming intended outcomes to continuous improvement —
              every step is designed to protect your investment and prove the
              value of change.
            </p>
          </motion.div>
        </div>

        {/* Timeline */}
        <SleekTimeline />
      </div>

      {/* ── CTA / The Result ── */}
      <div className="md:py-24 py-16 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="bg-[var(--dark-primary-color)] rounded-[32px] p-8 md:p-14 lg:p-16 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-[var(--primary-color)] opacity-[0.2] rounded-full blur-[100px]" />
              <div className="absolute top-[60%] -right-[10%] w-[400px] h-[400px] bg-white opacity-[0.05] rounded-full blur-[80px]" />
            </div>

            {/* Left Column */}
            <div className="relative z-10">
              <h4 className="badge !text-white mb-4">THE RESULT</h4>
              <h2 className="sub-heading mb-5 !text-white">
                Evidence-based{" "}
                <span className="text-[var(--primary-color)] brightness-125">
                  confidence
                </span>{" "}
                in your change investment
              </h2>
              <p className="text-white/80 text-[15px] md:text-base leading-relaxed mb-10 max-w-lg font-medium">
                Organizations gain a clear view of what is happening after
                go-live who is adopting, where benefits are being realized, and
                where targeted support is needed.
              </p>

              <button
                type="button"
                className="group text-[var(--dark-primary-color)] bg-white rounded-full py-3 pl-7 pr-4 flex items-center gap-2 font-semibold sm:text-lg text-base uppercase transition-all duration-300"
                onClick={() => navigate("/contact-us")}
              >
                Book a Discovery Call
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="24"
                  height="24"
                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300 text-[var(--primary-color)]"
                />
              </button>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4 relative z-10">
              {[
                {
                  icon: "solar:shield-check-linear",
                  title: "Protect your investment",
                  desc: "Catch adoption gaps before benefits are quietly lost",
                },
                {
                  icon: "solar:graph-up-linear",
                  title: "Strengthen adoption",
                  desc: "Role-based pulse data shows exactly where friction lives",
                },
                {
                  icon: "solar:branching-paths-up-linear",
                  title: "Prove the value of change",
                  desc: "Compare actual outcomes against intended benefits, over time",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[var(--primary-color)]/50 rounded-xl p-6 transition-all duration-300 flex items-start gap-4 shadow-sm hover:shadow-md"
                >
                  <Icon
                    icon={item.icon}
                    className="size-[22px] text-[var(--primary-color)] brightness-125 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <h4 className="text-white font-bold text-[15px] leading-snug mb-1">
                      {item.title}
                    </h4>
                    <p className="text-white/70 text-[13px] leading-relaxed mb-0 pr-4 font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OurProcess;
