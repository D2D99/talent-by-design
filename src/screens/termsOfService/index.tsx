import { useEffect, useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Icon } from "@iconify/react";
import SpinnerLoader from "../../components/spinnerLoader";

const sections = [
  {
    id: "purpose",
    title: "1. Purpose of POD-360",
    content: (
      <>
        <p>
          POD-360 is an organizational assessment and insight platform designed
          to help organizations better understand people readiness, operational
          steadiness, digital fluency, change impacts, benefits realization, and
          related organizational effectiveness themes.
        </p>
        <p className="mt-4">
          The Services may include assessments, dashboards, reports, action
          cards, executive summaries, benchmarking, artificial
          intelligence-enabled analysis, and recommendations.
        </p>
        <p className="mt-4">
          POD-360 is intended to support organizational learning, planning,
          change management, leadership discussions, and decision-making. It is
          not a substitute for legal, financial, medical, psychological, human
          resources, labour relations, or professional advice.
        </p>
      </>
    ),
  },
  {
    id: "users",
    title: "2. Users of the Services",
    content: (
      <>
        <p>The Services may be used by:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Client organizations that purchase, pilot, or access POD-360;</li>
          <li>
            Authorized administrators, leaders, managers, consultants, or
            project teams;
          </li>
          <li>
            Employees, contractors, stakeholders, or participants invited to
            complete an assessment;
          </li>
          <li>
            Talent By Design Collective Inc. team members or authorized service
            providers who support the Services.
          </li>
        </ul>
        <p className="mt-4">
          You agree to use the Services only for lawful, ethical, and authorized
          business purposes.
        </p>
      </>
    ),
  },
  {
    id: "client-responsibilities",
    title: "3. Client Responsibilities",
    content: (
      <>
        <p>Client organizations are responsible for:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>
            Ensuring they have the right to invite participants to complete
            assessments;
          </li>
          <li>Communicating the purpose of the assessment to participants;</li>
          <li>Using reports and insights responsibly and in context;</li>
          <li>
            Avoiding decisions about employment, discipline, termination,
            promotion, compensation, or individual performance based solely on
            POD-360 outputs;
          </li>
          <li>
            Maintaining the confidentiality of account credentials, dashboards,
            reports, and exported data;
          </li>
          <li>Ensuring that authorized users comply with these Terms.</li>
        </ul>
        <p className="mt-4">
          Clients must not use POD-360 to target, discipline, shame, retaliate
          against, or unfairly evaluate individual employees or participants.
        </p>
      </>
    ),
  },
  {
    id: "participant-responsibilities",
    title: "4. Participant Responsibilities",
    content: (
      <>
        <p>
          Participants are expected to provide honest and respectful responses.
          Participants must not submit unlawful, threatening, discriminatory,
          defamatory, confidential third-party information, or personal
          information about others unless they are authorized to do so.
        </p>
        <p className="mt-4">
          Participants understand that their responses may be analyzed and
          reported in aggregated, summarized, or role-based formats, depending
          on the configuration agreed with the client organization.
        </p>
      </>
    ),
  },
  {
    id: "account-security",
    title: "5. Account Access and Security",
    content: (
      <>
        <p>
          Users may be required to create an account or access POD-360 through
          an invitation link. You are responsible for keeping login credentials
          secure and for notifying us promptly of any suspected unauthorized
          access.
        </p>
        <p className="mt-4">
          We may suspend or restrict access if we reasonably believe there has
          been unauthorized use, misuse, a security risk, or a breach of these
          Terms.
        </p>
      </>
    ),
  },
  {
    id: "results-reporting",
    title: "6. Assessment Results and Reporting",
    content: (
      <>
        <p>
          POD-360 results are based on participant responses, client-provided
          information, assessment design, scoring logic, platform configuration,
          and, where applicable, AI-assisted analysis.
        </p>
        <p className="mt-4">Outputs may include:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Domain and sub-domain scores;</li>
          <li>Stakeholder group comparisons;</li>
          <li>Readiness indicators;</li>
          <li>Risk flags;</li>
          <li>
            Suggested objectives, key results, actions, or benefits measures;
          </li>
          <li>Executive summaries;</li>
          <li>Trends between assessment checkpoints;</li>
          <li>De-identified or aggregated insights.</li>
        </ul>
        <p className="mt-4">
          Results are intended to support discussion and planning. They should
          be interpreted alongside other organizational context, stakeholder
          input, leadership judgment, and professional advice where appropriate.
        </p>
      </>
    ),
  },
  {
    id: "ai-features",
    title: "7. AI-Enabled Features",
    content: (
      <>
        <p>
          POD-360 may include AI-enabled functionality under POD-Insights AI™ or
          related modules. AI-generated outputs may include summaries, themes,
          recommendations, risk indicators, suggested OKRs, action cards, or
          benefit tracking suggestions.
        </p>
        <p className="mt-4">
          AI-generated outputs may be incomplete, inaccurate, or require human
          review. The client is responsible for reviewing, validating, and
          deciding how to use any AI-generated content.
        </p>
        <p className="mt-4">
          We do not guarantee that AI outputs will be error-free, exhaustive,
          unbiased, or suitable for every organizational context.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "8. Acceptable Use",
    content: (
      <>
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>
            Use the Services for unlawful, harmful, discriminatory, or
            retaliatory purposes;
          </li>
          <li>
            Attempt to identify individual respondents where reports are
            intended to be aggregated or anonymous;
          </li>
          <li>Upload malicious code, viruses, or harmful content;</li>
          <li>
            Attempt to reverse engineer, scrape, copy, or reproduce the
            platform;
          </li>
          <li>Interfere with platform security or availability;</li>
          <li>Misrepresent your identity or authority;</li>
          <li>Use outputs in a misleading way;</li>
          <li>
            Use the Services to make automated decisions that create significant
            effects for individuals without appropriate human review and legal
            compliance.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "9. Intellectual Property",
    content: (
      <>
        <p>
          POD-360™, POD-Insights AI™, assessment models, scoring logic,
          dashboards, reports, templates, frameworks, content, designs, product
          names, trademarks, and related intellectual property are owned by
          Talent By Design Collective Inc. or its licensors.
        </p>
        <p className="mt-4">
          Clients receive a limited, non-exclusive, non-transferable right to
          access and use the Services for their internal organizational purposes
          during the applicable subscription, pilot, or service period.
        </p>
        <p className="mt-4">
          You may not copy, reproduce, sell, sublicense, distribute, or create
          derivative products from POD-360 materials without our prior written
          consent.
        </p>
      </>
    ),
  },
  {
    id: "client-data",
    title: "10. Client Data",
    content: (
      <>
        <p>
          Client data may include organizational information, assessment
          configuration, participant responses, uploaded documents, assessment
          results, dashboard content, reports, comments, and other information
          provided through the Services.
        </p>
        <p className="mt-4">
          As between the client and the Company, the client retains ownership of
          its underlying client data. The Company may process client data to
          provide, secure, maintain, improve, and support the Services, subject
          to our Privacy Policy and any written agreement with the client.
        </p>
      </>
    ),
  },
  {
    id: "aggregated-data",
    title: "11. Aggregated and De-Identified Data",
    content: (
      <>
        <p>
          We may use aggregated or de-identified information to improve POD-360,
          develop benchmarks, enhance scoring models, conduct research, improve
          AI-assisted insights, and create generalized industry or
          organizational effectiveness insights.
        </p>
        <p className="mt-4">
          We will not intentionally identify an individual or disclose a
          client's confidential information through aggregated or de-identified
          outputs.
        </p>
      </>
    ),
  },
  {
    id: "confidentiality",
    title: "12. Confidentiality",
    content: (
      <>
        <p>
          Each party may receive confidential information from the other.
          Confidential information includes non-public business, technical,
          financial, product, assessment, client, participant, or strategic
          information.
        </p>
        <p className="mt-4">
          Each party agrees to protect confidential information using reasonable
          safeguards and to use it only for the purposes of providing or
          receiving the Services, unless disclosure is required by law.
        </p>
      </>
    ),
  },
  {
    id: "fees-payment",
    title: "13. Fees, Payment, Pilots, and Subscriptions",
    content: (
      <>
        <p>
          Fees, payment terms, subscription periods, pilot terms, implementation
          fees, renewal terms, and cancellation terms will be set out in the
          applicable order form, statement of work, proposal, invoice, or
          written agreement.
        </p>
        <p className="mt-4">
          Unless otherwise stated in writing, fees are non-refundable once
          Services have been provided or access has been granted.
        </p>
      </>
    ),
  },
  {
    id: "availability",
    title: "14. Availability and Changes to the Services",
    content: (
      <>
        <p>
          We aim to provide reliable access to POD-360, but we do not guarantee
          uninterrupted or error-free availability. The Services may be
          unavailable due to maintenance, updates, technical issues, third-party
          service outages, or events beyond our control.
        </p>
        <p className="mt-4">
          We may modify, improve, suspend, or discontinue parts of the Services
          from time to time.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    title: "15. Third-Party Services",
    content: (
      <>
        <p>
          The Services may integrate with or rely on third-party providers, such
          as hosting providers, analytics tools, authentication services, AI
          service providers, email services, payment processors, or productivity
          platforms.
        </p>
        <p className="mt-4">
          We are not responsible for third-party services that are not
          controlled by us. Use of third-party services may be subject to
          separate terms and privacy policies.
        </p>
      </>
    ),
  },
  {
    id: "no-professional-advice",
    title: "16. No Professional Advice",
    content: (
      <>
        <p>
          POD-360 outputs are informational and advisory in nature. They do not
          constitute legal, employment, labour relations, psychological,
          medical, financial, accounting, or other regulated professional
          advice.
        </p>
        <p className="mt-4">
          Clients should seek appropriate professional advice before making
          decisions that may affect individuals, employment relationships, legal
          obligations, financial matters, or organizational risk.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "17. Disclaimers",
    content: (
      <>
        <p>
          The Services are provided on an "as is" and "as available" basis. To
          the fullest extent permitted by law, we disclaim warranties of
          merchantability, fitness for a particular purpose, non-infringement,
          accuracy, completeness, and uninterrupted availability.
        </p>
        <p className="mt-4">
          We do not guarantee specific organizational outcomes, business
          results, employee engagement improvements, productivity gains,
          adoption results, benefits realization, or return on investment.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "18. Limitation of Liability",
    content: (
      <>
        <p>
          To the fullest extent permitted by law, Talent By Design Collective
          Inc. will not be liable for indirect, incidental, consequential,
          special, exemplary, or punitive damages, including lost profits, lost
          revenue, business interruption, loss of goodwill, or loss of data.
        </p>
        <p className="mt-4">
          Unless otherwise agreed in writing, our total liability arising from
          or related to the Services will not exceed the amount paid by the
          client for the Services in the six months before the event giving rise
          to the claim.
        </p>
        <p className="mt-4">
          Some jurisdictions do not allow certain limitations of liability, so
          some limitations may not apply.
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "19. Indemnity",
    content: (
      <>
        <p>
          You agree to indemnify and hold harmless Talent By Design Collective
          Inc. from claims, damages, losses, liabilities, costs, and expenses
          arising from your misuse of the Services, breach of these Terms,
          violation of law, or unauthorized use of third-party information.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    title: "20. Termination",
    content: (
      <>
        <p>
          We may suspend or terminate access to the Services if a user or client
          breaches these Terms, fails to pay applicable fees, creates a security
          risk, misuses the platform, or uses the Services unlawfully.
        </p>
        <p className="mt-4">
          Upon termination, access to the Services may be disabled. Data return,
          deletion, or retention will be handled according to the applicable
          agreement and our Privacy Policy.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "21. Governing Law",
    content: (
      <>
        <p>
          These Terms are governed by the laws of the Province of British
          Columbia and the applicable laws of Canada, unless another
          jurisdiction is required by law or agreed in writing.
        </p>
        <p className="mt-4">
          The parties agree to the exclusive jurisdiction of the courts of
          British Columbia for disputes arising from these Terms, unless
          otherwise agreed in writing.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "22. Changes to These Terms",
    content: (
      <>
        <p>
          We may update these Terms from time to time. The updated version will
          be posted with a revised "Last Updated" date. Continued use of the
          Services after changes are posted means you accept the updated Terms.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "23. Contact",
    content: (
      <>
        <p>Questions about these Terms may be directed to:</p>
        <p className="mt-4 font-semibold text-slate-800">
          Talent By Design Collective Inc.
        </p>
        <p className="mt-2">
          <strong>Email:</strong> sdesouza@tbdcollective.ca
        </p>
        <p className="mt-2">
          <strong>Address:</strong> 3350 Wellington Street, Port Coquitlam, BC
        </p>
        <p className="mt-2">
          <strong>Privacy / Legal Contact:</strong> Confidential
        </p>
      </>
    ),
  },
];

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Page Loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Reliable scroll-spy: tracks which section is in view, handles bottom-of-page edge case
  useEffect(() => {
    const OFFSET = 160; // px from top to trigger active (accounts for sticky header)

    const handleScroll = () => {
      // If user has scrolled to (or near) the bottom, activate the last section
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 80;
      if (atBottom) {
        setActiveSection(sections[sections.length - 1].id);
        return;
      }

      let current = sections[0].id;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= OFFSET) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // set correct state on initial render
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pageLoading) {
    return <SpinnerLoader />;
  }

  return (
    <>
      <Header />

      <div className="bg-slate-50/50 min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 text-center border-b border-gray-100 bg-white relative overflow-hidden z-0">
          <style>{`
            @keyframes pan-bg {
              from { background-position: 0px 0px; }
              to { background-position: 48px 48px; }
            }
          `}</style>
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black_10%,transparent_100%)]"
              style={{ animation: "pan-bg 20s linear infinite" }}
            />
          </div>

          <div className="max-w-3xl mx-auto relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              Terms and Conditions
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium">
              Last Updated: June 25, 2026
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row gap-12 lg:gap-20 relative">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
            <div className="md:sticky md:top-32 space-y-1 relative z-20">
              {/* Mobile Dropdown Navigation */}
              <div className="md:hidden mb-6 sticky top-24">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-full flex items-center justify-between bg-slate-900 text-white px-5 py-4 rounded-lg font-bold text-xs uppercase tracking-wide shadow-md"
                >
                  Table of Contents
                  <Icon
                    icon={
                      mobileMenuOpen
                        ? "heroicons:chevron-up"
                        : "heroicons:chevron-down"
                    }
                    className="w-5 h-5 text-white"
                  />
                </button>
                {mobileMenuOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 rounded-lg shadow-xl border border-slate-800 overflow-hidden max-h-[60vh] overflow-y-auto">
                    <ul className="flex flex-col py-2">
                      {sections.map((section) => (
                        <li key={section.id}>
                          <a
                            href={`#${section.id}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block px-5 py-3 text-xs transition-colors ${
                              activeSection === section.id
                                ? "text-[var(--primary-color)]"
                                : "text-slate-300 hover:text-white"
                            }`}
                          >
                            {section.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Desktop Vertical Navigation */}
              <div
                className="hidden md:block relative pr-4"
                style={{ scrollbarWidth: "thin" }}
              >
                {/* Vertical Line */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-100 rounded-full" />

                <ul className="flex flex-col">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className={`block py-3 pl-5 border-l-2 transition-all duration-200 text-sm font-medium relative -ml-[1px] ${
                          activeSection === section.id
                            ? "border-[var(--primary-color)] text-[var(--primary-color)] bg-[var(--primary-color)]/5"
                            : "border-transparent text-slate-500 hover:text-slate-900 hover:border-gray-300"
                        }`}
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="w-full md:w-3/4 lg:w-3/5">
            <div className="prose prose-slate prose-lg max-w-none">
              {/* Introduction */}
              <div className="text-slate-600 mb-16 leading-relaxed text-base">
                <p>
                  These Terms and Conditions ("Terms") govern access to and use
                  of the POD-360™ platform, assessment tools, dashboards,
                  reports, insights, AI-enabled features, and related services
                  collectively referred to as the "Services."
                </p>
                <p className="mt-4">
                  The Services are provided by Talent By Design Collective Inc.
                  ("Company," "we," "us," or "our"). By accessing or using the
                  Services, you agree to these Terms. If you are using the
                  Services on behalf of an organization, you confirm that you
                  have authority to bind that organization to these Terms.
                </p>
              </div>

              {/* Dynamic Sections */}
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-32 mb-16 group"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 transition-colors duration-300">
                    {section.title}
                  </h2>
                  <div className="text-slate-600 space-y-5 leading-relaxed text-base">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>
          </main>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default TermsOfService;
