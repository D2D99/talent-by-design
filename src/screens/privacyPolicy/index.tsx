import { useEffect, useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Icon } from "@iconify/react";
import SpinnerLoader from "../../components/spinnerLoader";

const sections = [
  {
    id: "scope",
    title: "1. Scope of This Policy",
    content: (
      <>
        <p>This Privacy Policy applies to personal information we collect from or about:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Client contacts and administrators;</li>
          <li>Assessment participants;</li>
          <li>Leaders, managers, employees, contractors, or stakeholders invited to complete POD-360 assessments;</li>
          <li>Website visitors;</li>
          <li>Prospective clients, vendors, and business contacts;</li>
          <li>Users of POD-360 dashboards, reports, or related services.</li>
        </ul>
        <p className="mt-4">Where POD-360 is provided to a client organization, the client may also have its own privacy notices, policies, employment obligations, or consent practices. We encourage participants to review any privacy information provided by their organization.</p>
      </>
    )
  },
  {
    id: "what-we-collect",
    title: "2. What Personal Information We Collect",
    content: (
      <>
        <p>Depending on how the Services are used, we may collect the following types of information:</p>
        <h3 className="font-semibold text-slate-800 mt-4 text-lg">Account and Contact Information</h3>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Name;</li>
          <li>Email address;</li>
          <li>Organization name;</li>
          <li>Job title or role;</li>
          <li>Department, team, business unit, or stakeholder group;</li>
          <li>Login or account credentials;</li>
          <li>Communication preferences.</li>
        </ul>
        <h3 className="font-semibold text-slate-800 mt-6 text-lg">Assessment Information</h3>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Assessment responses;</li>
          <li>Ratings, scores, and selected answers;</li>
          <li>Written comments or open-text responses;</li>
          <li>Role or stakeholder group;</li>
          <li>Manager, leader, employee, or administrator designation;</li>
          <li>Assessment completion status;</li>
          <li>Date and time of completion.</li>
        </ul>
        <h3 className="font-semibold text-slate-800 mt-6 text-lg">Organizational Context</h3>
        <p className="mt-2">Clients may provide organizational information to support assessment setup and reporting, such as:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Strategic priorities;</li>
          <li>Project or program objectives;</li>
          <li>Change initiatives;</li>
          <li>Benefits, KPIs, or OKRs;</li>
          <li>Business unit or team structures;</li>
          <li>Uploaded documents or background materials.</li>
        </ul>
        <p className="mt-4">Clients should avoid uploading unnecessary personal information or sensitive personal information unless it is required and authorized.</p>
        <h3 className="font-semibold text-slate-800 mt-6 text-lg">Usage and Technical Information</h3>
        <p className="mt-2">We may collect technical and usage data, such as:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>IP address;</li>
          <li>Browser type;</li>
          <li>Device information;</li>
          <li>Operating system;</li>
          <li>Pages or features accessed;</li>
          <li>Log-in and log-out activity;</li>
          <li>Error logs;</li>
          <li>Audit logs;</li>
          <li>Cookie or similar technology data.</li>
        </ul>
        <h3 className="font-semibold text-slate-800 mt-6 text-lg">Communications</h3>
        <p className="mt-2">If you contact us, we may collect information included in your message, inquiry, support request, meeting notes, or feedback.</p>
      </>
    )
  },
  {
    id: "sensitive",
    title: "3. Sensitive Information",
    content: (
      <>
        <p>POD-360 is not designed to collect medical, diagnostic, psychological, financial, government identification, or other highly sensitive personal information.</p>
        <p className="mt-4">Participants should avoid including sensitive personal information about themselves or others in open-text responses unless specifically requested and clearly appropriate.</p>
        <p className="mt-4">Client organizations are responsible for ensuring assessment questions, participant communications, and uploaded materials are appropriate for the intended purpose.</p>
      </>
    )
  },
  {
    id: "how-we-use",
    title: "4. How We Use Personal Information",
    content: (
      <>
        <p>We may use personal information to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Provide, operate, configure, and support POD-360;</li>
          <li>Administer assessments;</li>
          <li>Authenticate users and manage accounts;</li>
          <li>Generate dashboards, reports, summaries, insights, and recommendations;</li>
          <li>Analyze assessment results by organization, role, stakeholder group, project, program, or assessment checkpoint;</li>
          <li>Support change management, benefits realization, organizational effectiveness, and leadership planning;</li>
          <li>Provide customer support;</li>
          <li>Improve platform functionality, scoring, reporting, and user experience;</li>
          <li>Develop aggregated or de-identified benchmarks and insights;</li>
          <li>Protect the security and integrity of the Services;</li>
          <li>Communicate with clients and users;</li>
          <li>Meet legal, regulatory, contractual, accounting, or security obligations.</li>
        </ul>
      </>
    )
  },
  {
    id: "ai",
    title: "5. AI-Enabled Processing",
    content: (
      <>
        <p>POD-360 may use AI-enabled tools to support analysis, summarization, theme identification, recommendations, action planning, benefits tracking, OKR suggestions, risk indicators, and executive reporting.</p>
        <p className="mt-4">AI-enabled outputs are intended to support human review and decision-making. They should not be used as the sole basis for decisions that may significantly affect an individual.</p>
        <p className="mt-4">Where AI features are used, personal information may be processed to generate insights unless the feature is configured to use aggregated, de-identified, or limited data.</p>
        <p className="mt-4">We aim to apply reasonable safeguards and data minimization practices when using AI-enabled features.</p>
      </>
    )
  },
  {
    id: "consent",
    title: "6. Consent and Legal Basis for Use",
    content: (
      <>
        <p>We collect, use, and disclose personal information with consent or as otherwise permitted or required by applicable law.</p>
        <p className="mt-4">Consent may be provided directly by an individual, through participation in an assessment, through account registration, through communications with us, or through a client organization where appropriate.</p>
        <p className="mt-4">Before completing an assessment, participants should be informed of the purpose of the assessment, how results will be used, who may access reports, and whether results will be reported individually, by group, or in aggregated form.</p>
      </>
    )
  },
  {
    id: "reporting",
    title: "7. How Assessment Results Are Reported",
    content: (
      <>
        <p>POD-360 may report assessment results in individual, role-based, team-based, stakeholder group, organizational, or aggregated formats depending on the service configuration and client agreement.</p>
        <p className="mt-4">Where possible, reports are designed to support organizational insight rather than individual monitoring. We encourage clients to use minimum group-size thresholds, aggregation, and de-identification where appropriate.</p>
        <p className="mt-4">Open-text comments may be summarized, themed, edited, or displayed in reports. Participants should not include names or identifying details about others in open-text responses.</p>
      </>
    )
  },
  {
    id: "disclosure",
    title: "8. Disclosure of Personal Information",
    content: (
      <>
        <p>We may disclose personal information to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>The client organization that invited users to complete an assessment;</li>
          <li>Authorized administrators, leaders, consultants, or project team members designated by the client;</li>
          <li>Service providers who help us host, operate, secure, support, analyze, or improve the Services;</li>
          <li>Professional advisors, such as lawyers, accountants, insurers, or auditors;</li>
          <li>Government, regulatory, law enforcement, or legal authorities where required or permitted by law;</li>
          <li>A successor organization in connection with a merger, acquisition, financing, restructuring, or sale of business assets, subject to appropriate protections.</li>
        </ul>
        <p className="mt-4">We do not sell personal information.</p>
      </>
    )
  },
  {
    id: "service-providers",
    title: "9. Service Providers and Cross-Border Processing",
    content: (
      <>
        <p>We may use service providers located in Canada or other jurisdictions. Personal information may be stored or processed outside the province or country where the individual resides.</p>
        <p className="mt-4">Where personal information is processed outside Canada, it may be subject to the laws of that jurisdiction. We use contractual, technical, and organizational safeguards intended to protect personal information handled by service providers.</p>
      </>
    )
  },
  {
    id: "retention",
    title: "10. Data Retention",
    content: (
      <>
        <p>We retain personal information only as long as reasonably necessary for the purposes described in this Privacy Policy, to provide the Services, to meet client agreement requirements, to comply with legal or accounting obligations, to resolve disputes, and to maintain security records.</p>
        <p className="mt-4">Retention periods may vary depending on the client agreement, type of data, legal requirements, and operational needs.</p>
        <p className="mt-4">When personal information is no longer required, we will delete, anonymize, de-identify, or securely dispose of it, subject to legal and contractual obligations.</p>
      </>
    )
  },
  {
    id: "security",
    title: "11. Security Safeguards",
    content: (
      <>
        <p>We use reasonable administrative, technical, and physical safeguards designed to protect personal information against unauthorized access, use, disclosure, alteration, loss, or destruction.</p>
        <p className="mt-4">Safeguards may include access controls, authentication, encryption where appropriate, audit logging, secure hosting practices, confidentiality obligations, and role-based access.</p>
        <p className="mt-4">No system can be guaranteed to be completely secure. Users are responsible for protecting account credentials and notifying us promptly of suspected unauthorized access.</p>
      </>
    )
  },
  {
    id: "cookies",
    title: "12. Cookies and Analytics",
    content: (
      <>
        <p>Our website or platform may use cookies and similar technologies to support authentication, remember preferences, improve functionality, analyze usage, and maintain security.</p>
        <p className="mt-4">Users may adjust browser settings to block or delete cookies, but some features may not function properly without them.</p>
      </>
    )
  },
  {
    id: "access",
    title: "13. Accessing or Correcting Personal Information",
    content: (
      <>
        <p>Individuals may request access to or correction of their personal information, subject to legal, contractual, and security limitations.</p>
        <p className="mt-4">Where POD-360 is provided through a client organization, we may direct certain requests to the client organization, especially where the client controls the assessment relationship or determines how the information is used.</p>
        <p className="mt-4">Requests may be sent to the contact listed below.</p>
      </>
    )
  },
  {
    id: "withdraw",
    title: "14. Withdrawing Consent",
    content: (
      <>
        <p>Where we rely on consent, individuals may withdraw consent, subject to legal or contractual restrictions and reasonable notice.</p>
        <p className="mt-4">Withdrawing consent may limit access to certain Services or prevent participation in an assessment.</p>
      </>
    )
  },
  {
    id: "complaints",
    title: "15. Privacy Questions or Complaints",
    content: (
      <>
        <p>Individuals may contact us with privacy questions, access requests, correction requests, or complaints.</p>
        <p className="mt-4">We will review privacy complaints and respond within a reasonable time. If we cannot resolve a concern, individuals may have the right to contact the applicable privacy commissioner or regulatory authority.</p>
      </>
    )
  },
  {
    id: "children",
    title: "16. Children and Minors",
    content: (
      <>
        <p>The Services are intended for organizational and professional use and are not directed to children. We do not knowingly collect personal information from children without appropriate authorization.</p>
      </>
    )
  },
  {
    id: "changes",
    title: "17. Changes to This Privacy Policy",
    content: (
      <>
        <p>We may update this Privacy Policy from time to time. The updated version will be posted with a revised “Last Updated” date.</p>
        <p className="mt-4">For material changes, we may provide additional notice where appropriate or required by law.</p>
      </>
    )
  },
  {
    id: "contact",
    title: "18. Contact Us",
    content: (
      <>
        <p>Privacy questions, requests, or complaints may be directed to:</p>
        <p className="mt-4 font-semibold text-slate-800">Talent By Design Collective Inc.</p>
        <p className="mt-2"><strong>Privacy Officer:</strong> Suzanna de Souza</p>
        <p className="mt-2"><strong>Email:</strong> sdesouza@tbdcollective.ca</p>
        <p className="mt-2"><strong>Address:</strong> 3350 Wellington Street, Port Coquitlam, BC</p>
        <p className="mt-2"><strong>Phone:</strong> +1-604-785-8966</p>
      </>
    )
  }
];

const PrivacyPolicy = () => {
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
          {/* Animated Background Abstract */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Ultra-faint panning straight grid */}
            <div
              className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black_10%,transparent_100%)]"
              style={{ animation: "pan-bg 20s linear infinite" }}
            />
          </div>

          <div className="max-w-3xl mx-auto relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium">
              Last Updated: June 15, 2026
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
              <div className="hidden md:block relative overflow-y-auto pr-4" style={{ scrollbarWidth: 'thin' }}>
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
                  This Privacy Policy explains how Talent By Design Collective Inc. (“Company,” “we,” “us,” or “our”) collects, uses, discloses, stores, and protects personal information in connection with POD-360™, POD-Insights AI™, our website, assessment platform, dashboards, reports, and related services collectively referred to as the “Services.”
                </p>
                <p className="mt-4">
                  We are committed to protecting personal information and using it responsibly, transparently, and only for appropriate purposes.
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

export default PrivacyPolicy;
