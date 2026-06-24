import { useEffect, useState, useRef } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Icon } from "@iconify/react";
import SpinnerLoader from "../../components/spinnerLoader";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────
   DATA  (untouched)
───────────────────────────────────────────── */
const steps = [
  {
    number: "01",
    title: "Confirm Intended Outcomes",
    badge: "FOUNDATION",
    icon: "solar:target-bold-duotone",
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
    icon: "solar:chart-2-bold-duotone",
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
    icon: "solar:pulse-bold-duotone",
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
    icon: "solar:graph-bold-duotone",
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
    icon: "solar:lightbulb-bold-duotone",
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
    icon: "solar:users-group-rounded-bold-duotone",
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
    icon: "solar:shield-up-bold-duotone",
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
    icon: "solar:medal-ribbons-star-bold-duotone",
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
    icon: "solar:refresh-circle-bold-duotone",
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

/* ─────────────────────────────────────────────
   Bento grid placement config
   Layout (3-col, 4-row explicit grid):
   [01][02][03 tall]
   [04 wide  ][03  ]
   [05][06][07]
   [08 wide  ][09]
───────────────────────────────────────────── */
const bentoConfig = [
  { gridColumn: "1", gridRow: "1", type: "normal" },       // 01
  { gridColumn: "2", gridRow: "1", type: "normal" },       // 02
  { gridColumn: "3", gridRow: "1 / 3", type: "tall" },     // 03 ← tall
  { gridColumn: "1 / 3", gridRow: "2", type: "wide" },     // 04 ← wide
  { gridColumn: "1", gridRow: "3", type: "normal" },       // 05
  { gridColumn: "2", gridRow: "3", type: "normal" },       // 06
  { gridColumn: "3", gridRow: "3", type: "normal" },       // 07
  { gridColumn: "1 / 3", gridRow: "4", type: "wide" },     // 08 ← wide
  { gridColumn: "3", gridRow: "4", type: "normal" },       // 09
];

/* ─────────────────────────────────────────────
   Hooks
───────────────────────────────────────────── */
const useInView = (threshold = 0.08) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

/* ─────────────────────────────────────────────
   Mouse spotlight wrapper
───────────────────────────────────────────── */
const SpotlightGrid = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      setActive(true);
    };
    const leave = () => setActive(false);
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, []);

  return (
    <div ref={ref} className="relative">
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-3xl transition-opacity duration-500"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(700px circle at ${pos.x}px ${pos.y}px, rgba(68,140,210,0.07) 0%, transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Check point list
───────────────────────────────────────────── */
const Points = ({ points, hovered }: { points: string[]; hovered: boolean }) => (
  <ul className="space-y-2 mt-auto">
    {points.map((p, i) => (
      <motion.li
        key={i}
        initial={false}
        animate={hovered ? { x: 3 } : { x: 0 }}
        transition={{ duration: 0.2, delay: i * 0.04 }}
        className="flex items-start gap-2"
      >
        <div className="mt-0.5 w-4 h-4 rounded bg-[var(--light-primary-color)] flex items-center justify-center flex-shrink-0 transition-colors duration-300"
          style={{ background: hovered ? "var(--primary-color)" : "var(--light-primary-color)" }}>
          <Icon icon="solar:check-read-bold" className="size-2.5 transition-colors duration-300"
            style={{ color: hovered ? "white" : "var(--primary-color)" }} />
        </div>
        <span className="text-[12px] font-medium text-slate-500 leading-snug">{p}</span>
      </motion.li>
    ))}
  </ul>
);

/* ─────────────────────────────────────────────
   Normal Card
───────────────────────────────────────────── */
const NormalCard = ({ step, delay }: { step: typeof steps[0]; delay: number }) => {
  const { ref, inView } = useInView();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="h-full rounded-2xl overflow-hidden flex flex-col transition-all duration-400 relative"
      style={{
        background: "white",
        border: hovered ? "1.5px solid rgba(68,140,210,0.3)" : "1.5px solid rgba(68,140,210,0.1)",
        boxShadow: hovered
          ? "0 24px 56px -12px rgba(68,140,210,0.18), 0 4px 16px rgba(0,0,0,0.04)"
          : "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      {/* Top bar */}
      <div className="h-[3px] w-full transition-all duration-400"
        style={{ background: hovered ? "linear-gradient(90deg,var(--primary-color),var(--dark-primary-color))" : "linear-gradient(90deg,rgba(68,140,210,0.35),rgba(45,93,140,0.2))" }} />

      {/* Watermark */}
      <span className="absolute -bottom-2 -right-1 text-[90px] font-black leading-none select-none pointer-events-none transition-all duration-500"
        style={{ color: hovered ? "rgba(68,140,210,0.1)" : "rgba(68,140,210,0.06)", transform: hovered ? "scale(1.05)" : "scale(1)" }}>
        {step.number}
      </span>

      <div className="relative z-10 p-6 flex flex-col flex-1 gap-4">
        {/* Number + badge */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{ background: hovered ? "var(--dark-primary-color)" : "rgba(68,140,210,0.12)" }}>
            <span className="text-[10px] font-black transition-colors duration-300"
              style={{ color: hovered ? "white" : "var(--dark-primary-color)" }}>{step.number}</span>
          </div>
          <span className="text-[9px] font-black tracking-[0.18em] px-2.5 py-1 rounded-full bg-[var(--light-primary-color)] text-[var(--primary-color)]">
            {step.badge}
          </span>
        </div>

        {/* Icon */}
        <motion.div
          animate={hovered ? { scale: 1.1, rotate: -6 } : { scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{ background: hovered ? "var(--primary-color)" : "var(--light-primary-color)", boxShadow: hovered ? "0 8px 24px rgba(68,140,210,0.35)" : "none" }}>
          <Icon icon={step.icon} className="size-5 transition-colors duration-300" style={{ color: hovered ? "white" : "var(--primary-color)" }} />
        </motion.div>

        {/* Title */}
        <h3 className="text-[var(--dark-primary-color)] text-[15px] font-bold leading-snug transition-colors duration-300"
          style={{ color: hovered ? "var(--dark-primary-color)" : "#1a3652" }}>
          {step.title}
        </h3>

        {/* Summary */}
        <p className="text-[12.5px] text-slate-500 leading-relaxed">{step.summary}</p>

        {/* Divider */}
        <div className="border-t transition-colors duration-300" style={{ borderColor: hovered ? "rgba(68,140,210,0.2)" : "rgba(68,140,210,0.08)" }} />

        {/* Points */}
        <Points points={step.clarify} hovered={hovered} />
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Tall Card (step 03 — spans 2 rows)
───────────────────────────────────────────── */
const TallCard = ({ step, delay }: { step: typeof steps[0]; delay: number }) => {
  const { ref, inView } = useInView();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="h-full rounded-2xl overflow-hidden flex flex-col transition-all duration-400 relative"
      style={{
        background: hovered
          ? "linear-gradient(145deg,rgba(228,240,252,0.7) 0%,white 100%)"
          : "white",
        border: hovered ? "1.5px solid rgba(68,140,210,0.35)" : "1.5px solid rgba(68,140,210,0.12)",
        boxShadow: hovered
          ? "0 32px 80px -16px rgba(68,140,210,0.22), 0 4px 16px rgba(0,0,0,0.04)"
          : "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      {/* Vertical accent bar on left */}
      <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full transition-all duration-400"
        style={{ background: hovered ? "linear-gradient(to bottom,var(--primary-color),var(--dark-primary-color))" : "linear-gradient(to bottom,rgba(68,140,210,0.3),rgba(45,93,140,0.15))" }} />

      {/* Watermark number — absolute, no extra space */}
      <span className="absolute -bottom-2 -right-1 text-[90px] font-black leading-none select-none pointer-events-none transition-all duration-500"
        style={{ color: hovered ? "rgba(68,140,210,0.12)" : "rgba(68,140,210,0.07)", transform: hovered ? "scale(1.05)" : "scale(1)" }}>
        {step.number}
      </span>

      <div className="relative z-10 p-6 flex flex-col flex-1 gap-4">
        {/* Number pill + Badge */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{ background: hovered ? "var(--dark-primary-color)" : "rgba(68,140,210,0.12)" }}>
            <span className="text-[10px] font-black transition-colors duration-300"
              style={{ color: hovered ? "white" : "var(--dark-primary-color)" }}>{step.number}</span>
          </div>
          <span className="text-[9px] font-black tracking-[0.2em] px-2.5 py-1 rounded-full bg-[var(--light-primary-color)] text-[var(--primary-color)] w-fit">
            {step.badge}
          </span>
        </div>

        {/* Icon */}
        <motion.div
          animate={hovered ? { scale: 1.12, rotate: -8 } : { scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{ background: hovered ? "linear-gradient(135deg,var(--primary-color),var(--dark-primary-color))" : "var(--light-primary-color)", boxShadow: hovered ? "0 10px 28px rgba(68,140,210,0.4)" : "none" }}>
          <Icon icon={step.icon} className="size-6 transition-colors duration-300" style={{ color: hovered ? "white" : "var(--primary-color)" }} />
        </motion.div>

        {/* Title */}
        <h3 className="text-[var(--dark-primary-color)] text-[15px] font-bold leading-snug">{step.title}</h3>

        {/* Summary */}
        <p className="text-[13px] text-slate-500 leading-relaxed">{step.summary}</p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-slate-100 via-slate-200/60 to-slate-100 my-1" />

        {/* Points list for TallCard */}
        <div className="flex-1 flex flex-col justify-center gap-3">
          <p className="text-[9px] font-black tracking-[0.18em] text-[var(--primary-color)] uppercase">Key Focus Areas</p>
          <div className="flex flex-col gap-2.5">
            {step.clarify.map((p, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={hovered ? { x: 4 } : { x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="flex items-start gap-2.5 p-3 rounded-xl transition-all duration-300"
                style={{
                  background: hovered ? "rgba(68,140,210,0.06)" : "rgba(68,140,210,0.03)",
                  border: hovered ? "1px solid rgba(68,140,210,0.15)" : "1px solid rgba(68,140,210,0.06)"
                }}
              >
                <div className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                  style={{ background: hovered ? "var(--primary-color)" : "rgba(68,140,210,0.15)" }}>
                  <Icon icon="solar:check-read-bold" className="size-2.5 transition-colors duration-300"
                    style={{ color: hovered ? "white" : "var(--primary-color)" }} />
                </div>
                <span className="text-[12.5px] font-medium text-slate-600 leading-snug">{p}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Wide Card (steps 04, 08 — spans 2 cols)
───────────────────────────────────────────── */
const WideCard = ({ step, delay }: { step: typeof steps[0]; delay: number }) => {
  const { ref, inView } = useInView();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="h-full rounded-2xl overflow-hidden transition-all duration-400 relative"
      style={{
        background: hovered
          ? "linear-gradient(135deg,rgba(228,240,252,0.5) 0%,white 60%)"
          : "white",
        border: hovered ? "1.5px solid rgba(68,140,210,0.3)" : "1.5px solid rgba(68,140,210,0.1)",
        boxShadow: hovered
          ? "0 24px 60px -12px rgba(68,140,210,0.18), 0 4px 16px rgba(0,0,0,0.04)"
          : "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      {/* Top bar */}
      <div className="h-[3px] w-full transition-all duration-400"
        style={{ background: hovered ? "linear-gradient(90deg,var(--primary-color),var(--dark-primary-color))" : "linear-gradient(90deg,rgba(68,140,210,0.35),rgba(45,93,140,0.15))" }} />

      {/* Watermark */}
      <span className="absolute -bottom-2 right-4 text-[110px] font-black leading-none select-none pointer-events-none transition-all duration-500"
        style={{ color: hovered ? "rgba(68,140,210,0.1)" : "rgba(68,140,210,0.06)" }}>
        {step.number}
      </span>

      <div className="relative z-10 p-5 sm:p-6 h-full flex flex-col sm:flex-row gap-5">
        {/* LEFT: number + icon + title */}
        <div className="sm:w-[38%] flex flex-col gap-3 flex-shrink-0 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
              style={{ background: hovered ? "var(--dark-primary-color)" : "rgba(68,140,210,0.12)" }}>
              <span className="text-[11px] font-black transition-colors duration-300"
                style={{ color: hovered ? "white" : "var(--dark-primary-color)" }}>{step.number}</span>
            </div>
            <span className="text-[9px] font-black tracking-[0.18em] px-2.5 py-1 rounded-full bg-[var(--light-primary-color)] text-[var(--primary-color)]">
              {step.badge}
            </span>
          </div>

          <motion.div
            animate={hovered ? { scale: 1.1, rotate: -5 } : { scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{ background: hovered ? "linear-gradient(135deg,var(--primary-color),var(--dark-primary-color))" : "var(--light-primary-color)", boxShadow: hovered ? "0 8px 28px rgba(68,140,210,0.38)" : "none" }}>
            <Icon icon={step.icon} className="size-6 transition-colors duration-300" style={{ color: hovered ? "white" : "var(--primary-color)" }} />
          </motion.div>

          <h3 className="text-[var(--dark-primary-color)] text-lg font-bold leading-snug">{step.title}</h3>
          <p className="text-[12.5px] text-slate-500 leading-relaxed hidden sm:block">{step.summary}</p>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px bg-gradient-to-b from-transparent via-[rgba(68,140,210,0.15)] to-transparent flex-shrink-0" />

        {/* RIGHT: summary (mobile) + points in vertical stack */}
        <div className="flex-1 flex flex-col gap-3 justify-center">
          <p className="text-[12.5px] text-slate-500 leading-relaxed sm:hidden">{step.summary}</p>
          <p className="text-[9px] font-black tracking-[0.18em] text-[var(--primary-color)] uppercase">Key Focus Areas</p>
          <div className="flex flex-col gap-2">
            {step.clarify.map((p, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={hovered ? { x: 4 } : { x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="flex items-start gap-2.5 p-2.5 rounded-xl transition-all duration-300"
                style={{
                  background: hovered ? "rgba(68,140,210,0.06)" : "rgba(68,140,210,0.03)",
                  border: hovered ? "1px solid rgba(68,140,210,0.15)" : "1px solid rgba(68,140,210,0.06)"
                }}
              >
                <div className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                  style={{ background: hovered ? "var(--primary-color)" : "rgba(68,140,210,0.15)" }}>
                  <Icon icon="solar:check-read-bold" className="size-2.5 transition-colors duration-300"
                    style={{ color: hovered ? "white" : "var(--primary-color)" }} />
                </div>
                <span className="text-[12.5px] font-medium text-slate-600 leading-snug">{p}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
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

  const renderCard = (step: typeof steps[0], index: number) => {
    const cfg = bentoConfig[index];
    const delay = 0.05 * index;
    const inner =
      cfg.type === "tall" ? <TallCard step={step} delay={delay} /> :
      cfg.type === "wide" ? <WideCard step={step} delay={delay} /> :
      <NormalCard step={step} delay={delay} />;

    return (
      <div
        key={index}
        style={{ gridColumn: cfg.gridColumn, gridRow: cfg.gridRow }}
        className="min-h-[240px]"
      >
        {inner}
      </div>
    );
  };

  return (
    <>
      <Header />

      {/* ── Hero ── */}
      <section className="relative sm:pt-32 pt-24 pb-20 px-4 z-0">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-50/30">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.2] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)]" />
          <div className="absolute -top-[30%] -left-[10%] w-[700px] h-[700px] bg-gradient-to-br from-[var(--primary-color)] via-blue-50 to-transparent opacity-20 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDuration: "8s" }} />
          <div className="absolute top-[10%] -right-[10%] w-[600px] h-[600px] bg-gradient-to-tl from-[var(--secondary-color)] via-sky-50 to-transparent opacity-[0.10] rounded-full blur-[100px] mix-blend-multiply animate-pulse" style={{ animationDuration: "11s", animationDelay: "2s" }} />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full backdrop-blur-sm border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-sm font-semibold text-[var(--primary-color)] mb-6 tracking-wide bg-white/50">
            <Icon icon="solar:routing-bold-duotone" className="size-4" />
            POD-360 METHODOLOGY
          </div>

          <h1 className="relative text-4xl md:text-6xl font-bold tracking-tight text-slate-900 sm:mb-6 mb-3 md:leading-[1.2] !leading-tight capitalize">
            Moving beyond{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-bl from-[var(--primary-color)] to-[var(--dark-primary-color)]">go-live</span>{" "}
            to measurable value
          </h1>

          <p className="relative text-base md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Most organizations declare success at go-live — before anyone knows whether the change has truly been adopted or delivered intended benefits. At Talent By Design, this is all we do.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <button type="button"
              className="group text-white rounded-full py-3.5 pl-8 pr-4 flex items-center gap-2 font-semibold sm:text-lg text-base uppercase bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)] hover:shadow-[0_8px_16px_rgba(68,140,210,0.25)] transition-all duration-300"
              onClick={() => navigate("/contact-us")}>
              Start the Conversation
              <Icon icon="mynaui:arrow-right-circle-solid" width="26" height="26" className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
            </button>
            <button type="button"
              className="rounded-full py-3.5 px-8 flex items-center gap-2 font-semibold sm:text-lg text-base border border-[rgba(68,140,210,0.3)] text-[var(--dark-primary-color)] bg-white/70 hover:bg-white hover:shadow-md transition-all duration-300"
              onClick={() => navigate("/what-we-offer")}>
              What We Offer
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto">
            {[
              { value: "24", unit: "Months", label: "Post go-live support" },
              { value: "9", unit: "Steps", label: "Proven methodology" },
              { value: "360°", unit: "View", label: "Of adoption & value" },
            ].map((s, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <div className="text-2xl font-bold text-[var(--dark-primary-color)]">
                  {s.value}<span className="text-sm font-semibold text-[var(--primary-color)] ml-1">{s.unit}</span>
                </div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bento Grid Section ── */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(180deg,#f8fbff 0%,#ffffff 50%,#f4f8fd 100%)" }}>
        {/* Ambient blobs */}
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#448cd2]/[0.05] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full bg-[#1a3652]/[0.03] blur-[90px] pointer-events-none" />
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{ backgroundImage: "radial-gradient(circle,#448cd218 1px,transparent 1px)", backgroundSize: "28px 28px", maskImage: "radial-gradient(ellipse 90% 80% at 50% 50%,black 30%,transparent 100%)" }} />

        {/* Section header */}
        <div className="relative z-10 pt-20 pb-12 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}>
            <h4 className="badge mb-4">THE POD-360 PROCESS</h4>
            <h2 className="sub-heading !mx-auto">
              9 steps to{" "}
              <span className="sub-heading-highlight">sustained value</span>
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto mt-4 leading-relaxed">
              From confirming intended outcomes to continuous improvement — every step is designed to protect your investment and prove the value of change.
            </p>
          </motion.div>
        </div>

        {/* Bento grid with spotlight */}
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 xl:px-10 pb-24">
          <SpotlightGrid>
            {/* Desktop bento grid */}
            <div className="hidden lg:grid gap-5" style={{ gridTemplateColumns: "repeat(3,1fr)", gridTemplateRows: "repeat(4,auto)" }}>
              {steps.map((step, i) => renderCard(step, i))}
            </div>

            {/* Mobile / tablet: simple 2-col grid */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5">
              {steps.map((step, i) => (
                <NormalCard key={i} step={step} delay={i * 0.06} />
              ))}
            </div>
          </SpotlightGrid>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="md:py-24 py-16 bg-[linear-gradient(180deg,#f4f8fd_0%,var(--light-primary-color)_100%)] px-4">
        <div className="max-w-screen-2xl mx-auto xl:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h4 className="badge mb-4">THE RESULT</h4>
              <h2 className="sub-heading !text-left !mx-0 !max-w-lg">
                Evidence-based <span className="sub-heading-highlight">confidence</span> in your investment
              </h2>
              <p className="text-base font-normal mt-6 text-[var(--secondary-color)] leading-relaxed">
                With POD-360, organizations gain a clear, evidence-based view of what is happening after go-live. They can see whether change is being adopted, whether benefits are being realized, and where targeted support is needed.
              </p>

              <div className="mt-8 grid sm:grid-cols-3 gap-4">
                {[
                  { icon: "solar:shield-check-linear", label: "Protect Your Investment" },
                  { icon: "solar:graph-up-linear", label: "Strengthen Adoption" },
                  { icon: "solar:medal-star-linear", label: "Prove the Value of Change" },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-[rgba(68,140,210,0.15)] shadow-sm text-center">
                    <Icon icon={item.icon} className="size-8 text-[var(--primary-color)] mx-auto mb-2" />
                    <p className="text-sm font-semibold text-[var(--dark-primary-color)] leading-snug">{item.label}</p>
                  </div>
                ))}
              </div>

              <button type="button"
                className="group mt-10 text-white rounded-full py-3.5 pl-8 pr-4 flex items-center gap-2 font-semibold text-base uppercase bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)] hover:shadow-[0_8px_16px_rgba(68,140,210,0.25)] transition-all duration-300 w-fit"
                onClick={() => navigate("/contact-us")}>
                Book a Discovery Call
                <Icon icon="mynaui:arrow-right-circle" width="26" height="26" className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
              </button>
            </div>

            <div className="bg-[var(--dark-primary-color)] rounded-3xl p-10 text-white relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[var(--primary-color)]/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <Icon icon="solar:verified-check-bold-duotone" className="size-12 text-[var(--primary-color)] mb-6" />
                <h3 className="text-2xl font-bold mb-4 leading-snug">
                  POD-360 is designed to support the critical post-go-live period
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-8">
                  When adoption, sustainment, and realized value matter most — POD-360 provides leaders with clear insight into where things stand and what action is required.
                </p>
                <div className="space-y-3">
                  {[
                    "First 24 months post-implementation support",
                    "Structured measurement and evidence-based insights",
                    "Targeted sustainment actions that protect your ROI",
                  ].map((point, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Icon icon="solar:check-circle-bold-duotone" className="size-5 text-[var(--primary-color)] flex-shrink-0" />
                      <span className="text-sm font-medium text-white/85">{point}</span>
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
