import { useNavigate } from "react-router-dom";
import Logo from "../../../public/static/img/home/logo.svg";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import axios from "axios";
import SpinnerLoader from "../spinnerLoader";
import IconStar from "../../../public/static/img/icons/ic-star.svg";

interface AssessmentStartData {
  title: string;
  description_one: string;
  description_two: string;
  duration_minutes: number;
}

const StartAssessment = () => {
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false); // For button state
  const [data, setData] = useState<AssessmentStartData | null>(null);

  useEffect(() => {
    const fetchStartData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}assessment/start`,
          {
            withCredentials: true,
          }
        );
        setData(res.data);
      } catch (error) {
        console.error("Error fetching assessment start data:", error);
      } finally {
        setTimeout(() => setPageLoading(false), 800);
      }
    };

    fetchStartData();
  }, []);

  const handleClick = () => {
    setLoading(true);
    navigate("/assessment-question");
  };

  if (pageLoading) {
    return <SpinnerLoader />;
  }

  return (
    <>
      <div className="min-h-screen bg-[var(--light-primary-color)]">
        <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 pb-5 px-3">
          <div className="text-center mb-8 mx-auto">
            <button type="button" className="!max-w-[150px] cursor">
              <img src={Logo} className="w-[150px] mx-auto" alt="Logo" />
            </button>
          </div>

          <div className="w-full mx-auto sm:max-w-3xl max-w-full rounded-xl shadow-md border border-[rgba(68,140,210,0.2)] bg-white sm:py-10 py-6 sm:px-10 px-4">
            <div>
              {/* ✅ Dynamic Title from Backend */}
              <h2 className="sm:text-2xl text-xl font-medium mb-1">
                {data?.title || "POD-360™ | From Friction to Flow"}
              </h2>

              {/* ✅ Dynamic Description from Backend */}
              <p className="text-sm">
                {data?.description_one ||
                  "Every organization experiences friction especially during times of rapid and constant change."}
              </p>
              <p className="text-sm mt-1">
                <strong>POD-360™</strong>{" "}
                {data?.description_two ||
                  "is a confidential, organization-level assessment designed to identify how friction impacts performance."}
              </p>

              <div className="mt-5">
                <h6 className="capitalize mb-2 text-xl font-medium">
                  Test Guidelines
                </h6>
                <ul className="space-y-2">
                  <li className="feature-list sm:!text-base text-sm flex items-start gap-2">
                    <img
                      src={IconStar}
                      alt="icon"
                      className="mt-1 sm:w-4 w-3"
                    />
                    <span>
                      Please respond honestly and instinctively—your first
                      response often reflects your lived experience most
                      accurately.
                    </span>
                  </li>

                  <li className="feature-list sm:!text-base text-sm flex items-start gap-2">
                    <img
                      src={IconStar}
                      alt="icon"
                      className="mt-1 sm:w-4 w-3"
                    />
                    <span>
                      The assessment takes approximately{" "}
                      {data?.duration_minutes || 40} minutes.
                    </span>
                  </li>

                  <li className="feature-list sm:!text-base text-sm flex items-start gap-2">
                    <img
                      src={IconStar}
                      alt="icon"
                      className="mt-1 sm:w-4 w-3"
                    />
                    <span>Progress is saved automatically.</span>
                  </li>
                </ul>
              </div>

              <div className="grid place-items-center mt-10">
                <button
                  type="button"
                  disabled={loading}
                  className={`group w-full text-[var(--white-color)] pl-4 py-2.5 pr-2 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] transition-all ${
                    loading
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:opacity-100 active:scale-95"
                  }`}
                  onClick={handleClick}
                >
                  {loading ? "Initializing..." : "Begin Diagnostic"}
                  {!loading && (
                    <Icon
                      icon="mynaui:arrow-right-circle-solid"
                      width="25"
                      height="25"
                      className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="max-w-md md:px-1 mx-auto text-sm font-medium text-[var(--secondary-color)]">
              By clicking BEGIN DIAGNOSTIC, you’re confirming that you’ve read
              and agree to our{" "}
              <a
                className="font-bold text-[var(--primary-color)] underline hover:opacity-75"
                href="/privacy"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                className="font-bold text-[var(--primary-color)] underline hover:opacity-75"
                href="/terms"
              >
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartAssessment;
