import { Icon } from "@iconify/react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import SpinnerLoader from "../../components/spinnerLoader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Pricing = () => {

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
      <section className="relative sm:pt-24 pt-16 pb-20 px-4 z-0">
        {/* Animated Background Abstract */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-50/30">
          {/* Modern Premium Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.2] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)]" />

          {/* Sleek Light Gradient Blobs */}
          <div
            className="absolute -top-[30%] -left-[10%] w-[700px] h-[700px] bg-gradient-to-br from-[var(--primary-color)] via-blue-50 to-transparent opacity-20 rounded-full blur-[120px] mix-blend-multiply animate-pulse"
            style={{ animationDuration: "8s" }}
          />
          <div
            className="absolute top-[10%] -right-[10%] w-[600px] h-[600px] bg-gradient-to-tl from-[var(--secondary-color)] via-sky-50 to-transparent opacity-[0.15] rounded-full blur-[100px] mix-blend-multiply animate-pulse"
            style={{ animationDuration: "10s", animationDelay: "2s" }}
          />

          {/* Animated Diagonal Light Beams */}
          <div
            className="absolute top-[-20%] left-[10%] w-[150%] h-[120px] bg-gradient-to-r from-transparent via-white to-transparent opacity-60 rotate-[-15deg] blur-[40px] mix-blend-overlay animate-pulse"
            style={{ animationDuration: "6s", animationDelay: "1s" }}
          />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <div className="relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full backdrop-blur-sm border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-sm font-semibold text-[var(--primary-color)] mb-6 tracking-wide">
            <Icon
              icon="solar:star-fall-minimalistic-bold-duotone"
              className="size-4"
            />
            Pricing Plans
          </div>

          <h1 className="relative text-4xl md:text-6xl font-bold tracking-tight text-slate-900 sm:mb-6 mb-3 md:leading-loose !leading-tight">
            Choose Your Path to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-bl from-[var(--primary-color)] to-[var(--dark-primary-color)]">
              Transformation Success
            </span>
          </h1>

          <p className="relative text-base md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Select a POD-360 engagement model tailored to help you rigorously
            track, reliably measure, and permanently sustain your strategic
            benefits.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto lg:px-4 sm:px-10 lg:my-24 my-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Option 1 */}
            <div className="bg-white rounded-[2rem] sm:p-8 p-6 border border-gray-100/80 shadow-sm lg:hover:shadow-xl lg:hover:-translate-y-1 transition-all duration-300 flex flex-col !h-full z-0 md:h-[95%]">
              <h2 className="text-2xl font-bold mb-2 text-slate-900">
                Baseline
              </h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Best for organizations that want to define expected benefits,
                establish baseline readiness, and create an executive view of
                benefit risk.
              </p>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-extrabold text-slate-900">
                  $24k-$36k
                </span>
                <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
                  CAD
                </span>
              </div>
              <p className="text-slate-400 text-sm font-medium">
                6-month engagement
              </p>

              <button className="group uppercase text-slate-700 rounded-full py-3 pl-7 pr-4 flex items-center gap-2 font-semibold text-base justify-center bg-white border border-gray-200 my-8 overflow-hidden isolate relative hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-colors duration-300 shadow-sm min-h-12"
                onClick={() => {
                  navigate('/contact-us')
                }}
              >
                <span className="relative z-10 tracking-wide">contact us</span>

                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="24"
                  height="24"
                  className="relative z-10 -rotate-45 group-hover:rotate-0 transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-slate-50 origin-bottom-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
              </button>

              <div className="flex-grow">
                <h3 className="text-sm font-medium text-slate-900 mb-2">
                  Whats inside:
                </h3>
                <ul className="space-y-0">
                  {[
                    "Strategic onboarding workshop",
                    "Project objectives & priority mapping",
                    "Initial benefits identification",
                    "KPI, baseline, target, owner capture",
                    "POD-360 assessment",
                    "Benefits Realization Tracker setup",
                    "Executive benefits dashboard",
                    "Initial recommendations and tactics",
                    "Up to 2 checkpoint reviews",
                    "6-month summary & recommendations",
                  ].map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 py-3.5 border-b border-gray-100 last:border-0 text-[13px] sm:text-sm text-slate-700 font-medium"
                    >
                      <Icon
                        icon="heroicons:check"
                        className="w-4 h-4 text-slate-800 flex-shrink-0 mt-0.5"
                        strokeWidth={2.5}
                      />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Option 2 (Middle / Most Popular) */}
            <div className="rounded-[2rem] p-1.5 flex flex-col h-full transform lg:scale-105 z-10 relative bg-gradient-to-b from-[var(--primary-color)] to-[var(--dark-primary-color)] shadow-2xl shadow-[var(--primary-color)]/20 lg:hover:-translate-y-2 transition-transform duration-300">
              <div className="text-white text-center pt-2 pb-3 text-sm font-bold tracking-wide uppercase flex items-center justify-center gap-1.5 animate-pulse">
                <Icon icon="solar:fire-bold-duotone" className="size-5" /> Most
                Popular
              </div>
              <div className="bg-white rounded-[1.8rem] sm:p-8 p-6 flex flex-col flex-grow shadow-inner">
                <h2 className="text-2xl text-[var(--secondary-color)] font-bold mb-2">
                  Tracking + OCM
                </h2>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                  Best for organizations with an active transformation
                  initiative that need structured tracking, executive reporting,
                  and OCM support.
                </p>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-extrabold text-slate-900">
                    $48k–$72k
                  </span>
                  <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
                    CAD
                  </span>
                </div>
                <p className="text-[var(--primary-color)] text-sm font-semibold">
                  Up to 12 months
                </p>

                <button className="group relative text-white rounded-full py-3 pl-7 pr-4 flex items-center justify-center gap-2 font-semibold text-base bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)] my-8 overflow-hidden isolate shadow-md shadow-[var(--primary-color)]/30 hover:shadow-lg hover:shadow-[var(--primary-color)]/40 transition-all duration-300 min-h-12 uppercase"
                  onClick={() => {
                    navigate('/contact-us')
                  }}
                >
                  {/* Button Text */}
                  <span className="relative z-10 tracking-wide">
                    contact us
                  </span>

                  {/* Icon */}
                  <Icon
                    icon="mynaui:arrow-right-circle-solid"
                    width="24"
                    height="24"
                    className="relative z-10 -rotate-45 group-hover:rotate-0 transition-transform duration-300"
                  />

                  {/* The Hover Effect */}
                  <div className="absolute inset-0 bg-white/20 origin-bottom-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
                </button>

                <div className="flex-grow">
                  <h3 className="text-sm font-medium text-slate-900 mb-2">
                    Whats inside:
                  </h3>
                  <ul className="space-y-0">
                    <li className="flex items-start gap-3 py-3.5 border-b border-gray-100 last:border-0 text-[13px] sm:text-sm text-slate-700 font-medium">
                      <Icon
                        icon="heroicons:check"
                        className="w-4 h-4 text-[var(--primary-color)] flex-shrink-0 mt-0.5"
                        strokeWidth={2.5}
                      />
                      <span className="font-bold text-slate-900 leading-snug">
                        Everything in Baseline
                      </span>
                    </li>
                    {[
                      "Expanded Realization Plan support",
                      "Tracker updates at key checkpoints",
                      "Executive dashboard updates",
                      "RAG / variance reporting",
                      "Readiness linked to benefit risk",
                      "Corrective action recommendations",
                      "OCM tactics (adoption, training, etc)",
                      "Up to 4–6 checkpoint reviews",
                      "Monthly/bi-monthly advisory check-ins",
                      "12-month benefits progress summary",
                    ].map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 py-3.5 border-b border-gray-100 last:border-0 text-[13px] sm:text-sm text-slate-700 font-medium"
                      >
                        <Icon
                          icon="heroicons:check"
                          className="w-4 h-4 text-[var(--primary-color)] flex-shrink-0 mt-0.5"
                          strokeWidth={2.5}
                        />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Option 3 */}
            <div className="bg-white rounded-[2rem] sm:p-8 p-6 border border-gray-100/80 shadow-sm lg:hover:shadow-xl lg:hover:-translate-y-1 transition-all duration-300 flex flex-col !h-full z-0 md:h-[95%]">
              <h2 className="text-2xl font-bold mb-2 text-slate-900">
                Full Realization
              </h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Best for larger or higher-risk transformation programs where
                benefits need to be tracked beyond go-live and embedded into
                operations.
              </p>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-extrabold text-slate-900">
                  $90k+
                </span>
                <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
                  CAD
                </span>
              </div>
              <p className="text-slate-400 text-sm font-medium">18–24 months</p>

              <button className="group text-slate-700 rounded-full py-3 pl-7 pr-4 flex items-center gap-2 font-semibold text-base justify-center bg-white border border-gray-200 my-8 overflow-hidden isolate relative hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-colors duration-300 shadow-sm min-h-12 uppercase"
                onClick={() => navigate('/contact-us')}
              >
                <span className="relative z-10 tracking-wide">Contact Us</span>

                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="24"
                  height="24"
                  className="relative z-10 -rotate-45 group-hover:rotate-0 transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-slate-50 origin-bottom-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
              </button>

              <div className="flex-grow">
                <h3 className="text-sm font-medium text-slate-900 mb-2">
                  Whats inside:
                </h3>
                <ul className="space-y-0">
                  <li className="flex items-start gap-3 py-3.5 border-b border-gray-100 last:border-0 text-[13px] sm:text-sm text-slate-700 font-medium">
                    <Icon
                      icon="heroicons:check"
                      className="w-4 h-4 text-slate-800 flex-shrink-0 mt-0.5"
                      strokeWidth={2.5}
                    />
                    <span className="font-bold text-slate-900 leading-snug">
                      Everything in Tracking + OCM
                    </span>
                  </li>
                  {[
                    "Full realization lifecycle support",
                    "Multiple POD-360 reassessments",
                    "Dashboard reporting over time",
                    "Quarterly realization reviews",
                    "Sustainment tracking post-closure",
                    "Benefit owner transition support",
                    "Corrective action planning",
                    "Evidence and validation tracking",
                    "18–24 month final report",
                    "Support for governance updates",
                  ].map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 py-3.5 border-b border-gray-100 last:border-0 text-[13px] sm:text-sm text-slate-700 font-medium"
                    >
                      <Icon
                        icon="heroicons:check"
                        className="w-4 h-4 text-slate-800 flex-shrink-0 mt-0.5"
                        strokeWidth={2.5}
                      />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Compare Plans Table */}
        <div className="max-w-6xl mx-auto sm:px-4 mt-20 relative z-10">
          <div className="text-center md:mb-14 mb-7">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Compare Plans
            </h2>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
              Every plan includes core benefits tracking. Pick the one that
              matches your transformation scope.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="">
                <tr>
                  <th className="py-6 pr-6 w-1/5 align-bottom sticky left-0 z-20 bg-white md:static md:bg-transparent md:z-auto md:shadow-none shadow-[4px_0_12px_rgba(0,0,0,0.03)]" />
                  {/* Baseline */}
                  <th className="py-6 px-4 text-center align-bottom w-1/5">
                    <div className="text-base font-bold text-slate-900 mb-1">
                      Baseline
                    </div>
                    <div className="text-sm text-slate-400 font-normal mb-1">
                      $24k–$36k CAD
                    </div>
                    <div className="text-xs text-slate-400 font-normal mb-4">
                      6-month engagement
                    </div>
                    <button className="group w-full rounded-full py-2.5 px-4 flex items-center justify-center gap-1.5 font-semibold text-sm uppercase border border-gray-200 text-slate-700 bg-white hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-colors duration-200 text-nowrap"
                      onClick={() => navigate('/contact-us')}
                    >
                      Contact Us
                    </button>
                  </th>
                  {/* Tracking + OCM — highlighted column */}
                  <th className="py-6 px-4 text-center align-bottom w-1/5 bg-[var(--light-primary-color)] border-x border-gray-100 relative">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--dark-primary-color)]" />
                    <div className="pt-3">
                      <div className="text-base font-bold text-[var(--primary-color)] mb-1">
                        Tracking + OCM
                      </div>
                      <div className="text-sm text-slate-400 font-normal mb-1">
                        $48k–$72k CAD
                      </div>
                      <div className="text-xs text-slate-400 font-normal mb-4">
                        Up to 12 months
                      </div>
                      <button className="group w-full rounded-full py-2.5 px-4 flex items-center justify-center gap-1.5 font-bold text-sm uppercase bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)] text-white hover:opacity-90 transition-opacity duration-200 shadow-md shadow-[var(--primary-color)]/20 text-nowrap"
                        onClick={() => navigate('/contact-us')}
                      >
                        Contact Us
                      </button>
                    </div>
                  </th>
                  {/* Full Realization */}
                  <th className="py-6 px-4 text-center align-bottom w-1/5">
                    <div className="text-base font-bold text-slate-900 mb-1">
                      Full Realization
                    </div>
                    <div className="text-sm text-slate-400 font-normal mb-1">
                      $90k+ CAD
                    </div>
                    <div className="text-xs text-slate-400 font-normal mb-4">
                      18–24 months
                    </div>
                    <button className="group w-full rounded-full py-2.5 px-4 flex items-center justify-center gap-1.5 font-semibold text-sm uppercase border border-gray-200 text-slate-700 bg-white hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-colors duration-200 text-nowrap"
                      onClick={() => navigate('/contact-us')}
                    >
                      Contact Us
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* ── Section: Engagement Setup ── */}
                <tr className="border-t border-gray-200">
                  <td className="py-4 pr-6 sticky left-0 z-10 bg-white md:static md:bg-transparent md:z-auto md:shadow-none shadow-[4px_0_12px_rgba(0,0,0,0.03)]">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                        Engagement Setup
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4" />
                  <td className="py-4 px-4 bg-[var(--light-primary-color)] border-x border-gray-100" />
                  <td className="py-4 px-4" />
                </tr>
                {[
                  {
                    feature: "Strategic onboarding workshop",
                    baseline: true,
                    ocm: true,
                    full: true,
                  },
                  {
                    feature: "Project objectives & priority mapping",
                    baseline: true,
                    ocm: true,
                    full: true,
                  },
                  {
                    feature: "Initial benefits identification",
                    baseline: true,
                    ocm: true,
                    full: true,
                  },
                  {
                    feature: "KPI, baseline, target & owner capture",
                    baseline: true,
                    ocm: true,
                    full: true,
                  },
                  {
                    feature: "POD-360 assessment",
                    baseline: true,
                    ocm: true,
                    full: true,
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-100 hover:bg-[var(--light-primary-color)]/50 transition-colors"
                  >
                    <td className="py-4 pr-6 text-sm text-slate-600 font-medium sticky left-0 z-10 bg-white md:static md:bg-transparent md:z-auto md:shadow-none shadow-[4px_0_12px_rgba(0,0,0,0.03)]">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.baseline ? (
                        <Icon
                          icon="heroicons:check"
                          className="w-5 h-5 text-slate-700 mx-auto"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <span className="text-slate-300 text-lg mx-auto block text-center">
                          —
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center bg-[var(--light-primary-color)] border-x border-gray-100">
                      {row.ocm ? (
                        <Icon
                          icon="heroicons:check"
                          className="w-5 h-5 text-[var(--primary-color)] mx-auto"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <span className="text-slate-300 text-lg mx-auto block text-center">
                          —
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.full ? (
                        <Icon
                          icon="heroicons:check"
                          className="w-5 h-5 text-slate-700 mx-auto"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <span className="text-slate-300 text-lg mx-auto block text-center">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {/* ── Section: Tracking & Reporting ── */}
                <tr className="border-t border-gray-200">
                  <td className="py-4 pr-6 sticky left-0 z-10 bg-white md:static md:bg-transparent md:z-auto md:shadow-none shadow-[4px_0_12px_rgba(0,0,0,0.03)]">
                    <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                      Tracking &amp; Reporting
                    </span>
                  </td>
                  <td className="py-4 px-4" />
                  <td className="py-4 px-4 bg-[var(--light-primary-color)] border-x border-gray-100" />
                  <td className="py-4 px-4" />
                </tr>
                {[
                  {
                    feature: "Benefits Realization Tracker setup",
                    baseline: true,
                    ocm: true,
                    full: true,
                  },
                  {
                    feature: "Executive benefits dashboard",
                    baseline: true,
                    ocm: true,
                    full: true,
                  },
                  {
                    feature: "Tracker updates at key checkpoints",
                    baseline: false,
                    ocm: true,
                    full: true,
                  },
                  {
                    feature: "RAG / variance reporting",
                    baseline: false,
                    ocm: true,
                    full: true,
                  },
                  {
                    feature: "Dashboard reporting over time",
                    baseline: false,
                    ocm: false,
                    full: true,
                  },
                  {
                    feature: "Quarterly realization reviews",
                    baseline: false,
                    ocm: false,
                    full: true,
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-100 hover:bg-[var(--light-primary-color)]/50 transition-colors"
                  >
                    <td className="py-4 pr-6 text-sm text-slate-600 font-medium sticky left-0 z-10 bg-white md:static md:bg-transparent md:z-auto md:shadow-none shadow-[4px_0_12px_rgba(0,0,0,0.03)]">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.baseline ? (
                        <Icon
                          icon="heroicons:check"
                          className="w-5 h-5 text-slate-700 mx-auto"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <span className="text-slate-300 text-lg mx-auto block text-center">
                          —
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center bg-[var(--light-primary-color)] border-x border-gray-100">
                      {row.ocm ? (
                        <Icon
                          icon="heroicons:check"
                          className="w-5 h-5 text-[var(--primary-color)] mx-auto"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <span className="text-[var(--primary-color)]/30 text-lg mx-auto block text-center">
                          —
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.full ? (
                        <Icon
                          icon="heroicons:check"
                          className="w-5 h-5 text-slate-700 mx-auto"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <span className="text-slate-300 text-lg mx-auto block text-center">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {/* ── Section: OCM & Advisory ── */}
                <tr className="border-t border-gray-200">
                  <td className="py-4 pr-6 sticky left-0 z-10 bg-white md:static md:bg-transparent md:z-auto md:shadow-none shadow-[4px_0_12px_rgba(0,0,0,0.03)]">
                    <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                      OCM &amp; Advisory
                    </span>
                  </td>
                  <td className="py-4 px-4" />
                  <td className="py-4 px-4 bg-[var(--light-primary-color)] border-x border-gray-100" />
                  <td className="py-4 px-4" />
                </tr>
                {[
                  {
                    feature: "Initial recommendations and tactics",
                    baseline: true,
                    ocm: true,
                    full: true,
                  },
                  {
                    feature: "Readiness linked to benefit risk",
                    baseline: false,
                    ocm: true,
                    full: true,
                  },
                  {
                    feature: "Corrective action recommendations",
                    baseline: false,
                    ocm: true,
                    full: true,
                  },
                  {
                    feature: "OCM tactics (adoption, training, etc)",
                    baseline: false,
                    ocm: true,
                    full: true,
                  },
                  {
                    feature: "Monthly/bi-monthly advisory check-ins",
                    baseline: false,
                    ocm: true,
                    full: true,
                  },
                  {
                    feature: "Benefit owner transition support",
                    baseline: false,
                    ocm: false,
                    full: true,
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-100 hover:bg-[var(--light-primary-color)]/50 transition-colors"
                  >
                    <td className="py-4 pr-6 text-sm text-slate-600 font-medium sticky left-0 z-10 bg-white md:static md:bg-transparent md:z-auto md:shadow-none shadow-[4px_0_12px_rgba(0,0,0,0.03)]">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.baseline ? (
                        <Icon
                          icon="heroicons:check"
                          className="w-5 h-5 text-slate-700 mx-auto"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <span className="text-slate-300 text-lg mx-auto block text-center">
                          —
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center bg-[var(--light-primary-color)] border-x border-gray-100">
                      {row.ocm ? (
                        <Icon
                          icon="heroicons:check"
                          className="w-5 h-5 text-[var(--primary-color)] mx-auto"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <span className="text-[var(--primary-color)]/30 text-lg mx-auto block text-center">
                          —
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.full ? (
                        <Icon
                          icon="heroicons:check"
                          className="w-5 h-5 text-slate-700 mx-auto"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <span className="text-slate-300 text-lg mx-auto block text-center">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {/* ── Section: Sustainment & Closure ── */}
                <tr className="border-t border-gray-200">
                  <td className="py-4 pr-6 sticky left-0 z-10 bg-white md:static md:bg-transparent md:z-auto md:shadow-none shadow-[4px_0_12px_rgba(0,0,0,0.03)]">
                    <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                      Sustainment &amp; Closure
                    </span>
                  </td>
                  <td className="py-4 px-4" />
                  <td className="py-4 px-4 bg-[var(--light-primary-color)] border-x border-gray-100" />
                  <td className="py-4 px-4" />
                </tr>
                {[
                  {
                    feature: "Up to 2 checkpoint reviews",
                    baseline: true,
                    ocm: false,
                    full: false,
                  },
                  {
                    feature: "Up to 4–6 checkpoint reviews",
                    baseline: false,
                    ocm: true,
                    full: false,
                  },
                  {
                    feature: "Summary & recommendations report",
                    baseline: true,
                    ocm: true,
                    full: true,
                  },
                  {
                    feature: "Multiple POD-360 reassessments",
                    baseline: false,
                    ocm: false,
                    full: true,
                  },
                  {
                    feature: "Sustainment tracking post-closure",
                    baseline: false,
                    ocm: false,
                    full: true,
                  },
                  {
                    feature: "Evidence and validation tracking",
                    baseline: false,
                    ocm: false,
                    full: true,
                  },
                  {
                    feature: "Support for governance updates",
                    baseline: false,
                    ocm: false,
                    full: true,
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-100 hover:bg-[var(--light-primary-color)]/50 transition-colors"
                  >
                    <td className="py-4 pr-6 text-sm text-slate-600 font-medium sticky left-0 z-10 bg-white md:static md:bg-transparent md:z-auto md:shadow-none shadow-[4px_0_12px_rgba(0,0,0,0.03)]">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.baseline ? (
                        <Icon
                          icon="heroicons:check"
                          className="w-5 h-5 text-slate-700 mx-auto"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <span className="text-slate-300 text-lg mx-auto block text-center">
                          —
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center bg-[var(--light-primary-color)] border-x border-gray-100">
                      {row.ocm ? (
                        <Icon
                          icon="heroicons:check"
                          className="w-5 h-5 text-[var(--primary-color)] mx-auto"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <span className="text-[var(--primary-color)]/30 text-lg mx-auto block text-center">
                          —
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.full ? (
                        <Icon
                          icon="heroicons:check"
                          className="w-5 h-5 text-slate-700 mx-auto"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <span className="text-slate-300 text-lg mx-auto block text-center">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Pricing;
