import { useEffect, useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Icon } from "@iconify/react";
import SpinnerLoader from "../../components/spinnerLoader";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
  },
  { id: "description", title: "2. Description of Service" },
  { id: "registration", title: "3. User Registration" },
  { id: "conduct", title: "4. User Conduct" },
  { id: "intellectual", title: "5. Intellectual Property" },
  { id: "payment", title: "6. Payment Terms" },
  { id: "termination", title: "7. Termination" },
  { id: "disclaimer", title: "8. Disclaimer of Warranties" },
  { id: "liability", title: "9. Limitation of Liability" },
  { id: "indemnification", title: "10. Indemnification" },
  { id: "governing", title: "11. Governing Law" },
  { id: "changes", title: "12. Changes to Terms" },
  { id: "contact", title: "13. Contact Us" },
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

  // Handle scroll to highlight the active section in the sidebar
  useEffect(() => {
    const handleScroll = () => {
      let currentSection = sections[0].id;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust offset as needed based on header height
          if (rect.top <= 150) {
            currentSection = section.id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger once on mount
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
              Terms of Service
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium">
              Last Updated: October 26th, 2026
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
              <div className="hidden md:block relative">
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
                  Welcome and thank you for your interest in our services. These
                  Terms of Service govern your use of our websites and mobile
                  applications, and establish the legal agreement between you and
                  us.
                </p>
                <p className="mt-4">
                  Wherever our customers use our Service to submit, manage, or
                  otherwise use content relating to our customers’ end users
                  ("Customer Data") during the provision of our Service, we have
                  contractually committed ourselves to only process such
                  information on behalf and under the instruction of the
                  respective customer, who is the data controller.
                </p>
              </div>

              {/* Dynamic Sections with Dummy Content */}
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-32 mb-16 group"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 transition-colors duration-300">
                    {section.title}
                  </h2>
                  <div className="text-slate-600 space-y-5 leading-relaxed">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                    <p>
                      Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est laborum.
                      Nunc aliquet bibendum enim facilisis gravida neque
                      convallis a cras. Non curabitur gravida arcu ac tortor
                      dignissim convallis aenean.
                    </p>
                    <ul className="list-none space-y-3 mt-6 text-sm p-6 rounded-2xl border border-gray-100 shadow-sm bg-white">
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-color)] mt-2 flex-shrink-0" />
                        <span>
                          <strong>General Terms:</strong> Pellentesque
                          habitant morbi tristique senectus et netus et
                          malesuada fames ac turpis egestas.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-color)] mt-2 flex-shrink-0" />
                        <span>
                          <strong>Restrictions:</strong> Malesuada fames ac
                          turpis egestas integer eget aliquet nibh.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-color)] mt-2 flex-shrink-0" />
                        <span>
                          <strong>Liability:</strong> Donec ac odio
                          tempor orci dapibus ultrices in iaculis nunc.
                        </span>
                      </li>
                    </ul>
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
