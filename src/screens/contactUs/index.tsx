import { Icon } from "@iconify/react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import SpinnerLoader from "../../components/spinnerLoader";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

type ContactFormFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

const ContactUs = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormFields>();

  const onSubmit: SubmitHandler<ContactFormFields> = async (data) => {
    // mock submit delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form data:", data);
    toast.success("Thank you! Your message has been sent successfully.");
    reset();
  };

  // Page Loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const faqs = [
    {
      question: "What makes POD-360 different from other assessment tools?",
      answer:
        "POD-360 goes beyond simple surveys by providing a comprehensive, strategic framework for evaluating and tracking transformation readiness and benefits realization.",
    },
    {
      question: "How secure is my organizational data?",
      answer:
        "We employ enterprise-grade security protocols, including end-to-end encryption and strict access controls, to ensure your sensitive transformation data remains completely secure.",
    },
    {
      question: "Can I personalize the assessment for my organization?",
      answer:
        "Yes, our platform is designed to be highly customizable, allowing you to tailor questions, metrics, and reporting to your specific strategic goals.",
    },
    {
      question: "What support and advisory services do you offer?",
      answer:
        "We offer comprehensive support ranging from initial setup and onboarding to ongoing strategic advisory, ensuring you maximize the value of your transformation efforts.",
    },
  ];

  if (pageLoading) {
    return <SpinnerLoader />;
  }

  return (
    <>
      <Header />

      {/* Hero Section & Form */}
      <section className="relative isolate sm:pt-32 pt-24 pb-20 px-4 z-0 overflow-hidden">
        {/* Modern Custom Background Abstract */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none bg-[linear-gradient(53deg,rgba(237,245,253,0.3)_75%,#e4f0fc_100%)]">
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.3] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)]" />
          
          {/* Subtle Glows matching brand colors */}
          <div
            className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-br from-[var(--primary-color)] via-[#C7E0F8] to-transparent opacity-[0.15] rounded-full blur-[100px] mix-blend-multiply animate-pulse"
            style={{ animationDuration: "8s" }}
          />
          <div
            className="absolute top-[20%] -right-[15%] w-[500px] h-[500px] bg-gradient-to-tl from-[var(--dark-primary-color)] via-[#e4f0fc] to-transparent opacity-[0.1] rounded-full blur-[100px] mix-blend-multiply animate-pulse"
            style={{ animationDuration: "12s", animationDelay: "2s" }}
          />
        </div>

        <div className="max-w-7xl mx-auto lg:px-4 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Content */}
            <div className="max-w-xl">
              <h4 className="badge">CONNECT WITH US</h4>
              <h1 className="heading text-left !mx-0">
                Contact Us
              </h1>
              <p className="text-lg text-[var(--secondary-color)] font-medium mb-8 leading-relaxed">
                Email, call, or complete the form to learn how POD-360 can
                solve your strategic transformation challenges.
              </p>

              <div className="space-y-4 mb-12">
                <a
                  href="mailto:infopod360@gmail.com"
                  className="block text-xl font-bold text-[var(--dark-primary-color)] hover:text-[var(--primary-color)] transition-colors"
                >
                  infopod360@gmail.com
                </a>
                <a
                  href="tel:6047858966"
                  className="block text-xl font-bold text-[var(--dark-primary-color)] hover:text-[var(--primary-color)] transition-colors"
                >
                  604 785 8966
                </a>
                <div className="mt-4">
                  <a
                    href="#"
                    className="inline-block text-base font-semibold text-[var(--primary-color)] hover:text-[var(--dark-primary-color)] border-b-2 border-[var(--primary-color)] transition-colors pb-0.5"
                  >
                    Customer Support
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-bold text-[var(--dark-primary-color)] mb-2 text-sm uppercase tracking-wide">
                    Customer Support
                  </h3>
                  <p className="text-[var(--secondary-color)] text-sm leading-relaxed">
                    Our support team is available around the clock to address any
                    concerns or queries you may have.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-[var(--dark-primary-color)] mb-2 text-sm uppercase tracking-wide">
                    Feedback
                  </h3>
                  <p className="text-[var(--secondary-color)] text-sm leading-relaxed">
                    We value your feedback and are continuously working to
                    improve POD-360.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-[var(--dark-primary-color)] mb-2 text-sm uppercase tracking-wide">
                    Media Inquiries
                  </h3>
                  <p className="text-[var(--secondary-color)] text-sm leading-relaxed">
                    For media-related questions or press inquiries, please
                    contact us.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="bg-white rounded-xl p-8 shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] border border-[rgba(68,140,210,0.2)] relative">
              <h2 className="text-2xl font-medium text-[var(--dark-primary-color)] mb-2">
                Get in Touch
              </h2>
              <p className="text-[var(--secondary-color)] mb-8 text-sm">
                You can reach us anytime
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="First name"
                      className={`font-medium text-sm text-[#5D5D5D] w-full p-3 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] ${
                        errors.firstName ? "border-red-500" : "border-[#E8E8E8] focus:border-[var(--primary-color)]"
                      }`}
                      {...register("firstName", { required: "First name is required" })}
                    />
                    {errors.firstName && (
                      <span className="text-red-500 text-xs mt-1 block">{errors.firstName.message}</span>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Last name"
                      className={`font-medium text-sm text-[#5D5D5D] w-full p-3 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] ${
                        errors.lastName ? "border-red-500" : "border-[#E8E8E8] focus:border-[var(--primary-color)]"
                      }`}
                      {...register("lastName", { required: "Last name is required" })}
                    />
                    {errors.lastName && (
                      <span className="text-red-500 text-xs mt-1 block">{errors.lastName.message}</span>
                    )}
                  </div>
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Your email"
                    className={`font-medium text-sm text-[#5D5D5D] w-full p-3 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] ${
                      errors.email ? "border-red-500" : "border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    }`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Enter a valid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>
                  )}
                </div>

                <div>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: "Phone number is required",
                      validate: (value) => {
                        if (!value) return true;
                        return (
                          isValidPhoneNumber(value) ||
                          "Please enter a valid phone number"
                        );
                      },
                    }}
                    render={({ field: { onChange, value } }) => (
                      <PhoneInput
                        id="phone"
                        international
                        defaultCountry="US"
                        value={value}
                        onChange={(val) => onChange(val || "")}
                        placeholder="Phone number"
                        className={`phone-input-custom font-medium text-sm text-[#5D5D5D] w-full p-3 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] ${errors.phone ? "border-red-500" : "border-[#E8E8E8] focus-within:border-[var(--primary-color)]"}`}
                      />
                    )}
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.phone.message}</span>
                  )}
                </div>

                <div>
                  <textarea
                    rows={4}
                    placeholder="How can we help?"
                    className={`font-medium text-sm text-[#5D5D5D] w-full p-3 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] resize-none ${
                      errors.message ? "border-red-500" : "border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    }`}
                    {...register("message", { required: "Message is required" })}
                  ></textarea>
                  {errors.message && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.message.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full group text-white p-2.5 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase transition-all bg-gradient-to-r from-[#1a3652] to-[#448bd2] ${
                    isSubmitting
                      ? "disabled:pointer-events-none disabled:opacity-40"
                      : "opacity-100 active:scale-95"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                  {!isSubmitting && (
                    <Icon
                      icon="mynaui:arrow-right-circle-solid"
                      width="25"
                      className={`transition-transform duration-300 ${
                        isSubmitting ? "-rotate-45" : "rotate-0"
                      }`}
                    />
                  )}
                </button>
                
                <p className="text-center text-xs text-[var(--secondary-color)] mt-4">
                  By contacting us, you agree to our{" "}
                  <Link to="/terms-of-service" className="text-[var(--primary-color)] font-medium hover:underline transition-colors">
                    Terms of service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" className="text-[var(--primary-color)] font-medium hover:underline transition-colors">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto lg:px-4 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Map Placeholder */}
            <div className="rounded-xl overflow-hidden bg-[#E4F0FC] aspect-square sm:aspect-[4/3] relative border border-[rgba(68,140,210,0.2)] shadow-[4px_4px_4px_0_rgba(68,140,210,0.1)] group">
              {/* Fake Map Image / Design */}
              <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48ZGVmcz48cGF0dGVybiBpZD0icC1ncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3AtZ3JpZCkiLz48cGF0aCBkPSJNMTAwLDE1MCBMMjAwLDMwMCBMMzAwLDE1MCBaIiBmaWxsPSJub25lIiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iMiIgb3BhY2l0eT0iMC4yIi8+PC9zdmc+')] bg-cover" />
              
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="bg-white p-5 rounded-xl shadow-[4px_4px_15px_0_rgba(68,140,210,0.15)] border border-[rgba(68,140,210,0.1)] w-full max-w-sm transform group-hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary-color)] flex items-center justify-center shrink-0">
                      <Icon icon="heroicons:building-office-2" className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--dark-primary-color)]">Talent By Design</h4>
                      <p className="text-xs text-[var(--secondary-color)] mb-3">Strategic Transformation Partner</p>
                      
                      <div className="text-sm text-[var(--dark-primary-color)] font-medium">
                        Virtually Everywhere<br />
                        Vancouver, BC<br />
                        Kelowna, BC<br />
                        Edmonton, AB
                      </div>
                      
                      <a href="#" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary-color)] mt-3 hover:underline transition-colors">
                        Open Google Maps
                        <Icon icon="heroicons:chevron-right" className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div>
              <h4 className="badge">OUR LOCATION</h4>
              <h2 className="sub-heading !text-left !mx-0">
                Connecting <span className="sub-heading-highlight">Near</span> and <span className="sub-heading-highlight">Far</span>
              </h2>

              <div className="space-y-2 mt-8">
                <h3 className="text-xl font-bold text-[var(--dark-primary-color)] mb-4">Locations</h3>
                <p className="text-[var(--secondary-color)] text-base font-medium leading-relaxed">
                  Virtually Everywhere<br />
                  Vancouver, BC<br />
                  Kelowna, BC<br />
                  Edmonton, AB
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-[linear-gradient(53deg,rgba(237,245,253,0)_75%,#e4f0fc_100%)] relative">
        <div className="max-w-7xl mx-auto lg:px-4 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h4 className="badge">FAQ</h4>
              <h2 className="sub-heading !text-left !mx-0 mb-6">
                Do you have any<br /><span className="sub-heading-highlight">questions</span> for us?
              </h2>
              <p className="text-base font-medium mt-2 text-[var(--secondary-color)] mb-10 max-w-sm leading-relaxed">
                If there are any questions you want to ask, we will answer all your questions.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className={`border-b border-[rgba(68,140,210,0.2)] pb-4`}
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between py-4 text-left group"
                  >
                    <span className={`text-lg font-medium transition-colors ${activeFaq === idx ? 'text-[var(--primary-color)]' : 'text-slate-900 group-hover:text-[var(--primary-color)]'}`}>
                      {faq.question}
                    </span>
                    <Icon 
                      icon={activeFaq === idx ? "heroicons:minus" : "heroicons:plus"} 
                      className={`w-5 h-5 text-[var(--primary-color)] transition-transform duration-300`} 
                    />
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-[var(--secondary-color)] pb-4 pr-8 text-base font-normal leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ContactUs;
