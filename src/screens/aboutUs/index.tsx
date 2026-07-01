import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import SpinnerLoader from "../../components/spinnerLoader";

const FounderImg = "/static/img/suz.png";
const BaIMg = "/static/img/ba.png";
const DevIMg = "/static/img/dev.png";

const PODImg = "/static/img/pod-about.png";

const AboutUs = () => {
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const TOTAL_SLIDES = 3;

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

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full backdrop-blur-sm border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-sm font-semibold text-[var(--primary-color)] mb-6 tracking-wide bg-white/50">
            <Icon
              icon="solar:star-fall-minimalistic-bold-duotone"
              className="size-4"
            />
            ABOUT US
          </div>

          <h1 className="relative capitalize text-4xl md:text-6xl font-bold tracking-tight text-slate-900 sm:mb-6 mb-3 md:leading-loose !leading-tight">
            People-First{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-bl from-[var(--primary-color)] to-[var(--dark-primary-color)]">
              Change Management
            </span>
          </h1>

          <p className="relative text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Talent By Design Collective Inc. combines expert change management
            consulting, leadership coaching, and our proprietary POD-360 data
            insights platform to ensure your enterprise technology and process
            changes deliver real, lasting business value.
          </p>

          <div className="flex justify-center gap-4">
            <button
              type="button"
              className="group text-white rounded-full py-3.5 pl-8 pr-4 flex items-center gap-2 font-semibold sm:text-lg text-base uppercase bg-gradient-to-r from-[var(--dark-primary-color)] to-[var(--primary-color)] hover:shadow-[0_8px_16px_rgba(68,140,210,0.2)] transition-all duration-300"
              onClick={() => navigate("/contact-us")}
            >
              WORK WITH US
              <Icon
                icon="mynaui:arrow-right-circle-solid"
                width="26"
                height="26"
                className="-rotate-45 transition-transform duration-300 group-hover:rotate-0"
              />
            </button>
          </div>
        </div>
      </section>
      {/* Hero Section End */}

      {/* Founder Section */}
      <section className="py-20 lg:py-28 bg-white relative">
        <div className="max-w-screen-xl mx-auto xl:px-10 px-4">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 relative z-0 pb-6 sm:pb-8 w-full max-w-[460px] mx-auto lg:ml-auto lg:order-1 order-2">
              <img
                src={FounderImg}
                alt="Suzanna de Souza"
                className="relative w-full aspect-[4/5] object-cover rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.15)] border-4 border-white z-10"
              />
            </div>
            <div className="lg:col-span-7 lg:order-2 order-1">
              <h4 className="badge mb-3">ABOUT THE FOUNDER</h4>
              <h2 className="sub-heading mb-1">Suzanna de Souza</h2>
              <p className="text-[var(--dark-primary-color)] font-semibold mb-6 text-sm">
                Founder, Talent By Design Collective Inc.
              </p>

              <div className="space-y-4 text-base font-normal sm:mt-2 mt-3 max-w-screen-lg text-[var(--secondary-color)]">
                <p>
                  Suzanna is a change manager, leadership coach, entrepreneur,
                  and single mom who has spent her career helping organizations
                  move through change with more clarity, confidence, and
                  purpose.
                </p>
                <p>
                  For Suzanna, change has never been only about systems,
                  projects, or technology. It has always been about people.
                </p>
                <p>
                  Her experience leading transformation work, building a
                  business, raising two teenagers, and navigating real-life
                  change has shaped the way Talent By Design supports clients:
                  with structure, empathy, honesty, and a focus on what actually
                  helps people adopt and sustain change.
                </p>
              </div>

              <div className="mt-8 flex gap-5 bg-slate-50 border border-slate-100 p-6 rounded-2xl items-start">
                <Icon
                  icon="streamline-ultimate:earthquake-global-seismic-wave"
                  className="size-10 mt-1 text-[var(--dark-primary-color)] flex-shrink-0"
                />
                <p className="text-sm text-[var(--secondary-color)] italic font-medium leading-relaxed">
                  Outside of work, Suzanna loves to travel the world, spend time
                  with family and friends, and learn from different people,
                  places, and cultures. That curiosity and human-centred
                  perspective are at the heart of Talent By Design.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Founder Section End */}

      {/* Story Behind POD-360 */}
      <section className="py-20 lg:py-28 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-screen-2xl mx-auto xl:px-10 px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h4 className="badge mb-3">THE STORY BEHIND</h4>
              <h2 className="sub-heading !text-left !mx-0">POD-360™</h2>
              <p className="text-base text-[var(--secondary-color)] mt-6 mb-6">
                POD-360 was created after years of seeing the same challenge
                inside transformation projects.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "A new system goes live.",
                  "Training is complete.",
                  "Communications are sent.",
                  "The project is marked as successful.",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Icon
                      icon="solar:check-circle-linear"
                      className="w-5 h-5 text-[var(--primary-color)]"
                    />
                    <span className="text-[var(--dark-primary-color)] font-medium">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="text-base font-bold text-[var(--dark-primary-color)] mb-4">
                But the real questions often come after launch:
              </p>

              <ul className="space-y-3 mb-8 ml-2">
                {[
                  "Are people using the change?",
                  "Do they feel confident?",
                  "Are managers able to support their teams?",
                  "Are the intended benefits actually being realized?",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Icon
                      icon="solar:alt-arrow-right-linear"
                      className="w-4 h-4 text-[var(--primary-color)]"
                    />
                    <span className="text-[var(--secondary-color)] font-medium">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="text-base text-[var(--secondary-color)] mb-4 leading-relaxed">
                POD-360 helps organizations answer those questions.
              </p>
              <p className="text-base text-[var(--secondary-color)] leading-relaxed">
                It is Talent By Design's proprietary framework for measuring
                adoption, sustainment, and benefits realization after
                implementation. It looks at three connected areas:
              </p>
            </div>

            <div>
              <img
                src={PODImg}
                alt="POD-360"
                className="w-full h-auto rounded-3xl object-cover mb-6"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Story Behind POD-360 End */}

      {/* Our Team */}
      <section className="py-20 lg:py-28 bg-slate-100 relative">
        <div className="max-w-screen-2xl mx-auto xl:px-10 px-4">
          <div className="mb-16">
            <h4 className="badge mb-3">OUR TEAM</h4>
            <h2 className="sub-heading">
              Blending Experience{" "}
              <span className="sub-heading-highlight">
                With Fresh Perspective
              </span>
            </h2>
            <p className="text-base text-[var(--secondary-color)] mt-4 max-w-2xl  leading-relaxed">
              We combine deep industry expertise with the technical curiosity of
              emerging talent to deliver innovative, data-driven solutions for
              our clients.
            </p>
          </div>

          <div className="relative team-swiper-wrap">
            <Swiper
              modules={[Autoplay, A11y]}
              loop={true}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onRealIndexChange={(swiper) => setActiveIndex(swiper.realIndex)}
              breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 16 },
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className="!pb-4"
            >
              {/* Suzanna */}
              <SwiperSlide>
                <div className="group bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-500">
                  <div className="relative overflow-hidden h-80 bg-slate-200">
                    <img
                      src={FounderImg}
                      alt="Suzanna de Souza"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      style={{ objectPosition: "100% 35%" }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-xl capitalize font-bold text-slate-900">
                          Suzanna de Souza
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Founder & Change Leader
                        </p>
                      </div>
                      <a
                        href="https://www.linkedin.com/in/suzannadesouza"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--light-primary-color)] hover:bg-[var(--dark-primary-color)] hover:text-white transition-all duration-200 flex items-center justify-center text-[var(--primary-color)] mt-0.5"
                        aria-label="LinkedIn"
                      >
                        <Icon icon="streamline:linkedin" className="size-3.5" />
                      </a>
                    </div>
                    <div className="w-10 h-px bg-slate-200 mb-4"></div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      A change manager and leadership coach who has spent her
                      career helping organizations move through change with more
                      clarity, confidence, and purpose. Suzanna built Talent By
                      Design on a foundation of empathy, structure, and
                      real-world transformation experience.
                    </p>
                  </div>
                </div>
              </SwiperSlide>

              {/* Rithvik */}
              <SwiperSlide>
                <div className="group bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-500">
                  <div className="relative overflow-hidden h-80 bg-slate-200">
                    <img
                      src={BaIMg}
                      alt="Rithvik Sharma"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      style={{ objectPosition: "100% 10%" }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-xl capitalize font-bold text-slate-900">
                          Rithvik Sharma
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Data & Product Analyst
                        </p>
                      </div>
                      <a
                        href="https://www.linkedin.com/in/rithviksharma"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--light-primary-color)] hover:bg-[var(--dark-primary-color)] hover:text-white transition-all duration-200 flex items-center justify-center text-[var(--primary-color)] mt-0.5"
                        aria-label="LinkedIn"
                      >
                        <Icon icon="streamline:linkedin" className="size-3.5" />
                      </a>
                    </div>
                    <div className="w-10 h-px bg-slate-200 mb-4"></div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      A recent BCIT Business Information Technology Management
                      graduate who joined through the POD-360 pilot. Rithvik
                      brings fresh technical curiosity to data analytics,
                      dashboards, and business documentation, strengthening the
                      insights Talent By Design delivers to clients.
                    </p>
                  </div>
                </div>
              </SwiperSlide>

              {/* Custom Coder */}
              <SwiperSlide>
                <div className="group bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-500">
                  <div className="relative overflow-hidden h-80 bg-slate-200">
                    <img
                      src={DevIMg}
                      alt="Developer"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      style={{ objectPosition: "100% 35%" }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-xl capitalize font-bold text-slate-900">
                          Custom Coder
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Full-Stack Developer
                        </p>
                      </div>
                      <a
                        href="https://www.linkedin.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--light-primary-color)] hover:bg-[var(--dark-primary-color)] hover:text-white transition-all duration-200 flex items-center justify-center text-[var(--primary-color)] mt-0.5"
                        aria-label="LinkedIn"
                      >
                        <Icon icon="streamline:linkedin" className="size-3.5" />
                      </a>
                    </div>
                    <div className="w-10 h-px bg-slate-200 mb-4"></div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      The custom code developer behind the Talent By Design
                      platform. He architects and builds the full-stack
                      infrastructure from the POD-360 data dashboards to the
                      public-facing site translating complex requirements into
                      clean, scalable, and performant solutions.
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
            {/* Manual Pill Pagination */}
            <div className="flex items-center justify-center gap-2 mt-6 lg:hidden">
              {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => swiperRef.current?.slideToLoop(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  style={{
                    width: activeIndex === i ? "28px" : "8px",
                    height: "8px",
                    borderRadius: "999px",
                    background: activeIndex === i ? "#448cd2" : "#468cd22d",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    flexShrink: 0,
                    transition:
                      "width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Our Team End */}

      {/* How We Help Clients */}
      <section className="py-20 lg:py-28 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-screen-2xl mx-auto xl:px-10 px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h4 className="badge mb-3">HOW WE HELP CLIENTS</h4>
            <h2 className="sub-heading !mx-auto">
              Beyond Go-Live.{" "}
              <span className="sub-heading-highlight">Into Real Impact.</span>
            </h2>
            <p className="text-base text-[var(--secondary-color)] mt-4">
              We help organizations understand whether change is truly working
              and what to do next.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              {
                t: "Understand Adoption",
                d: "See how people are experiencing and adopting the change.",
                i: "solar:users-group-rounded-linear",
              },
              {
                t: "Identify Gaps",
                d: "Find where people need more support to succeed.",
                i: "solar:minimalistic-magnifer-linear",
              },
              {
                t: "Track Benefits",
                d: "Measure whether benefits are being realized.",
                i: "solar:chart-square-linear",
              },
              {
                t: "Turn Insights Into Action",
                d: "Use feedback and data to guide clear next steps.",
                i: "solar:target-linear",
              },
              {
                t: "Reports & Dashboards",
                d: "Create practical dashboards and executive insights.",
                i: "solar:monitor-camera-linear",
              },
              {
                t: "Strengthen Sustainment",
                d: "Build communication, coaching, and ongoing support.",
                i: "solar:chat-round-line-linear",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_8px_40px_rgb(0,0,0,0.04)] text-center flex flex-col items-center transition-transform duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                  <Icon
                    icon={item.i}
                    className="w-8 h-8 text-[var(--primary-color)]"
                  />
                </div>
                <h3 className="text-lg font-bold text-[var(--dark-primary-color)] mb-2">
                  {item.t}
                </h3>
                <p className="text-sm font-medium text-[var(--secondary-color)] leading-relaxed">
                  {item.d}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[var(--primary-color)] border border-[var(--primary-color)]/20 p-8 lg:p-10 rounded-3xl shadow-xl flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-color)]/5 to-transparent"></div>
            <div className="flex gap-6 items-start relative z-10 lg:w-2/3 md:flex-nowrap flex-wrap justify-center">
              <Icon
                icon="solar:hand-heart-linear"
                className="w-20 h-20 text-white flex-shrink-0"
              />
              <div>
                <p className="text-xs text-white/75 font-medium mb-2">
                  Our work brings together change management, coaching, business
                  analysis, data insights, and product thinking.
                </p>
                <p className="text-sm text-white/75 font-medium leading-relaxed">
                  <strong className="text-lg text-white block">
                    Because successful transformation is not just about
                    launching something new.
                  </strong>
                  It is about helping people work better, helping leaders make
                  better decisions, and helping organizations realize the value
                  they set out to create.
                </p>
              </div>
            </div>
            <div className="relative z-10 lg:w-1/3 flex justify-end">
              <button
                type="button"
                className="group text-[var(--primary-color)] rounded-full py-2.5 pl-7 pr-3.5 flex items-center gap-1.5 font-semibold text-base uppercase 
               bg-gradient-to-r bg-[var(--white-color)] border-solid border-[var(--primary-color)] border"
                onClick={() => navigate("/contact-us")}
              >
                LET'S WORK TOGETHER
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  className="iconify iconify--mynaui -rotate-45 group-hover:rotate-0 transition-transform duration-300"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M2.25 12c0 5.385 4.365 9.75 9.75 9.75s9.75-4.365 9.75-9.75S17.385 2.25 12 2.25S2.25 6.615 2.25 12m10.22-4.03a.75.75 0 0 1 1.06 0l3.5 3.5a.75.75 0 0 1 0 1.06l-3.5 3.5a.75.75 0 1 1-1.06-1.06l2.22-2.22H7.5a.75.75 0 0 1 0-1.5h7.19l-2.22-2.22a.75.75 0 0 1 0-1.06"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* How We Help Clients End */}

      <Footer />
    </>
  );
};

export default AboutUs;
