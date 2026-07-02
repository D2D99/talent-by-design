import { useEffect, useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Icon } from "@iconify/react";
import SpinnerLoader from "../../components/spinnerLoader";

const faqs = [
  {
    id: "q1",
    question:
      "What is POD-360™ and how is it different from a traditional employee survey?",
    answer: (
      <>
        <p>
          POD-360™ is a proprietary software-enabled solution designed to measure
          technology adoption, operational stabilization, and benefits
          realization after go-live. Unlike traditional surveys that provide a
          one-time snapshot, POD-360™ combines structured pulse assessments,
          trend analysis, and change management insights to help leaders
          understand whether a transformation is delivering its intended
          outcomes over time.
        </p>
        <p>
          A key differentiator is that POD-360™ gathers feedback not only from
          employees, but also from managers and leaders involved in the
          transformation. This multi-level perspective helps organizations
          identify perception gaps between leadership and employees, providing a
          more complete picture of adoption challenges and opportunities.
        </p>
      </>
    ),
  },
  {
    id: "q2",
    question: "Why should we measure adoption after go-live?",
    answer: (
      <>
        <p>
          Go-live is only the beginning of the change journey. Many
          organizations successfully deploy technology but struggle to achieve
          the expected business benefits because adoption remains inconsistent.
          Measuring adoption helps leaders identify risks early, understand
          employee and leadership experiences, and take corrective action before
          issues impact productivity, customer experience, or return on
          investment.
        </p>
      </>
    ),
  },
  {
    id: "q3",
    question:
      "How does POD-360™ help demonstrate ROI on technology investments?",
    answer: (
      <>
        <p>
          POD-360™ connects employee adoption, operational readiness, leadership
          alignment, and digital fluency to intended business outcomes. By
          tracking indicators related to benefits realization, leaders gain
          evidence of whether the organization is progressing toward the
          objectives outlined in the business case, project charter, or
          transformation strategy.
        </p>
      </>
    ),
  },
  {
    id: "q4",
    question: "What types of initiatives is POD-360™ designed to support?",
    answer: (
      <>
        <p>POD-360™ supports a wide range of initiatives, including:</p>
        <ul>
          <li>ERP implementations</li>
          <li>CRM deployments</li>
          <li>HRIS transformations</li>
          <li>Microsoft 365, Teams, and SharePoint rollouts</li>
          <li>Digital workplace initiatives</li>
          <li>Process redesign programs</li>
          <li>Operating model transformations</li>
          <li>
            Enterprise-wide technology and business transformation projects
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "q5",
    question: "How soon after go-live should we begin measuring adoption?",
    answer: (
      <>
        <p>
          Organizations typically begin measuring adoption within the first 30
          to 90 days after go-live. Early assessments provide valuable insight
          into employee confidence, leadership perceptions, process
          stabilization, and emerging risks while there is still time to
          intervene and improve outcomes.
        </p>
      </>
    ),
  },
  {
    id: "q6",
    question: "What does POD-360™ measure?",
    answer: (
      <>
        <p>POD-360™ evaluates three core dimensions:</p>
        <ul>
          <li>
            <strong>People Potential:</strong> Measures employee engagement,
            confidence, adaptability, leadership support, and overall experience
            with the change.
          </li>
          <li>
            <strong>Operational Steadiness:</strong> Assesses whether processes,
            roles, expectations, and workflows are becoming stable and
            consistent.
          </li>
          <li>
            <strong>Digital Fluency:</strong> Evaluates how effectively
            employees are using new technologies, systems, tools, and data to
            perform their work.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "q7",
    question: "How often should pulse assessments be conducted?",
    answer: (
      <>
        <p>
          The ideal frequency depends on the complexity of the initiative and
          organizational needs. Many organizations conduct assessments quarterly
          during the first year after go-live, while larger transformations may
          benefit from more frequent measurement during critical adoption
          periods.
        </p>
        <p>
          POD-360™ can pulse employees, managers, and leaders at appropriate
          intervals to monitor how perceptions evolve across stakeholder groups
          throughout the change journey.
        </p>
      </>
    ),
  },
  {
    id: "q8",
    question: "What insights do CIOs and executive leaders receive?",
    answer: (
      <>
        <p>Leadership teams receive actionable reporting that highlights:</p>
        <ul>
          <li>Adoption trends</li>
          <li>Areas of resistance or risk</li>
          <li>Employee confidence levels</li>
          <li>Leadership confidence and alignment</li>
          <li>Operational stabilization indicators</li>
          <li>Benefits realization progress</li>
          <li>Perception gaps between employees, managers, and leaders</li>
          <li>Recommended actions to improve outcomes</li>
        </ul>
        <p>
          These insights help leaders make informed decisions and prioritize
          interventions where they will have the greatest impact.
        </p>
      </>
    ),
  },
  {
    id: "q9",
    question: "Are survey responses anonymous and confidential?",
    answer: (
      <>
        <p>
          Yes. All survey responses are anonymous and confidential. Results are
          reported only in aggregate to protect individual identities and
          encourage honest, candid feedback.
        </p>
        <p>
          As an independent third-party consulting partner, we often receive
          more transparent input than organizations can obtain through internal
          channels alone. This enables us to provide leadership teams with
          objective insights and highlight emerging concerns before they become
          larger adoption or performance issues.
        </p>
      </>
    ),
  },
  {
    id: "q10",
    question: "Can POD-360™ identify areas where additional training is needed?",
    answer: (
      <>
        <p>
          Yes. POD-360™ helps identify gaps in confidence, capability, leadership
          support, and system utilization. This allows organizations to target
          training, coaching, communications, and leadership interventions where
          they are needed most.
        </p>
      </>
    ),
  },
  {
    id: "q11",
    question: "How does POD-360™ support benefits realization?",
    answer: (
      <>
        <p>
          POD-360™ helps organizations establish a baseline, monitor progress,
          and connect adoption metrics to intended business outcomes. By
          comparing perspectives across employees, managers, and leaders,
          organizations can better understand where alignment exists and where
          corrective action may be required to achieve expected value.
        </p>
        <p>
          This enables leaders to move beyond project completion metrics and
          focus on whether the expected value is actually being achieved.
        </p>
      </>
    ),
  },
  {
    id: "q12",
    question: "How long should organizations monitor adoption and sustainment?",
    answer: (
      <>
        <p>
          While every initiative is different, many organizations benefit from
          monitoring adoption for 6 to 24 months after go-live. Benefits often
          take time to mature, and sustained measurement helps ensure momentum
          is maintained and risks are addressed before they become long-term
          challenges.
        </p>
      </>
    ),
  },
  {
    id: "q13",
    question:
      "What are the most common post-go-live risks POD-360™ helps identify?",
    answer: (
      <>
        <p>Common risks include:</p>
        <ul>
          <li>Low user adoption</li>
          <li>Process workarounds</li>
          <li>Inconsistent system usage</li>
          <li>Employee resistance</li>
          <li>Leadership misalignment</li>
          <li>Perception gaps between leaders and employees</li>
          <li>Training gaps</li>
          <li>Declining engagement</li>
          <li>Unrealized business benefits</li>
        </ul>
        <p>
          Early visibility into these risks allows organizations to take
          proactive action.
        </p>
      </>
    ),
  },
  {
    id: "q14",
    question: "How does POD-360™ support executive decision-making?",
    answer: (
      <>
        <p>
          POD-360™ provides objective, evidence-based insights that help
          executives understand what is happening across the organization.
          Rather than relying on anecdotal feedback, leaders gain measurable
          data from employees, managers, and leaders to support governance,
          investment decisions, and transformation planning.
        </p>
        <p>
          Because POD-360™ is administered by an independent third party,
          executives gain access to candid feedback that may not otherwise
          surface through traditional reporting channels. This allows leadership
          teams to address issues earlier and make more informed decisions
          before adoption challenges become entrenched.
        </p>
      </>
    ),
  },
  {
    id: "q15",
    question: "Is POD-360™ suitable for organizations of all sizes?",
    answer: (
      <>
        <p>
          Yes. POD-360™ can be scaled to support organizations ranging from
          mid-sized businesses to large enterprises. The approach can be
          tailored based on the size, complexity, and strategic importance of
          the initiative.
        </p>
      </>
    ),
  },
  {
    id: "q16",
    question: "What is the ultimate value of POD-360™ for technology leaders?",
    answer: (
      <>
        <p>
          POD-360™ helps technology leaders answer one critical question:{" "}
          <strong>
            Is the organization realizing the value it expected from its
            investment?
          </strong>
        </p>
        <p>
          By providing visibility into adoption, operational readiness,
          leadership alignment, digital fluency, perception gaps, and benefits
          realization, POD-360™ helps CIOs and leadership teams protect
          investments, improve outcomes, and ensure change delivers lasting
          business value.
        </p>
      </>
    ),
  },
];

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState<string | null>("q1");
  const [pageLoading, setPageLoading] = useState(true);

  // Page Loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  if (pageLoading) {
    return <SpinnerLoader />;
  }

  return (
    <>
      <Header />

      <div className="bg-slate-50/80 min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-12 px-4 text-center relative">
          <div className="max-w-3xl mx-auto">
            {/* Optional Badge similar to Dropship */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-slate-600 mb-8 shadow-sm">
              <span className="text-slate-800">POD-360™ is live!</span>
              <span className="w-px h-4 bg-gray-300"></span>
              <a
                href="/pricing"
                className="text-[var(--primary-color)] hover:underline flex items-center gap-1"
              >
                Learn more{" "}
                <Icon icon="heroicons:chevron-right" className="w-3 h-3" />
              </a>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-base text-slate-500 font-medium">
              Last updated: June 2026
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-4xl mx-auto px-4 relative">
          <div className="space-y-0 mb-12">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id;

              return (
                <div
                  key={faq.id}
                  className="border-b border-[#a8c7fa] border-opacity-50 last:border-b-0 py-2"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-[17px] pr-8 font-semibold leading-tight transition-colors ${isOpen ? "text-[var(--primary-color)]" : "text-slate-900 group-hover:text-[var(--primary-color)]"}`}
                    >
                      {faq.question}
                    </span>
                    <Icon
                      icon={isOpen ? "heroicons:minus" : "heroicons:plus"}
                      className="w-6 h-6 flex-shrink-0 text-[var(--primary-color)] transition-transform duration-300"
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen
                        ? "max-h-[1500px] opacity-100 pb-6"
                        : "max-h-0 opacity-0 pb-0"
                    }`}
                  >
                    <div className="prose prose-slate max-w-none text-[16px] font-normal text-slate-600 leading-relaxed pr-8">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Cta Section Start */}
        <div className="md:my-24 my-10 px-5">
          <div
            className="text-center mx-auto max-w-screen-xl sm:py-32 py-20 rounded-3xl"
            id="cta-bg"
          >
            <p className="text-base font-bold text-[var(--white-color)] mb-5 uppercase">
              See the Data in Action
            </p>
            <h2 className="lg:text-5xl md:text-4xl text-3xl leading-10 max-w-lg mx-auto font-bold text-[var(--white-color)] uppercase">
              Build on a foundation of clarity, capability, with real data.
            </h2>
            <div className="sm:mt-9 mt-5">
              <a
                href="/contact-us"
                className="mx-auto w-fit group text-[var(--dark-primary-color)] rounded-full py-2.5 pl-7 pr-3.5 flex items-center gap-1.5 font-semibold sm:text-lg text-base uppercase bg-gradient-to-r bg-[var(--white-color)] border-solid border-[var(--primary-color)] border"
              >
                Book a Strategy Call
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="24"
                  height="24"
                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                />
              </a>
            </div>
          </div>
        </div>
        {/* Cta Section End */}
      </div>

      <Footer />
    </>
  );
};

export default FAQ;
