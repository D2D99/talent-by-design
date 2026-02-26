import { useNavigate, useSearchParams } from "react-router-dom";
const Logo = "/static/img/POD-logo.svg";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import api from "../../services/axios";
import SpinnerLoader from "../spinnerLoader";
const IconStar = "/static/img/icons/ic-star.svg";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface AssessmentStartData {
  title: string;
  description_one: string;
  description_two: string;
  duration_minutes: number;
}

type Stakeholder = "employee" | "admin" | "leader" | "manager";

const StartAssessment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 🔹 Invite token → anonymous employee (direct link, not logged in)
  const inviteToken = searchParams.get("token") || searchParams.get("token1");

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AssessmentStartData | null>(null);
  const [stakeholder, setStakeholder] = useState<Stakeholder | null>(null);

  // Whether this user is a logged-in registered employee (uses standard flow)
  const [isLoggedInEmployee, setIsLoggedInEmployee] = useState(false);

  // =====================================================
  // 🔐 DETERMINE STAKEHOLDER (EMPLOYEE OR /ME ROLE)
  // =====================================================
  useEffect(() => {
    const determineStakeholder = async () => {
      const accessToken = localStorage.getItem("accessToken");

      // 🔹 If user is logged in, use /me to get role (handles registered employees too)
      if (accessToken) {
        try {
          const res = await api.get("auth/me");
          const role = res.data.role?.toLowerCase() as Stakeholder;
          setStakeholder(role);
          if (role === "employee") {
            setIsLoggedInEmployee(true);
          }
          setPageLoading(false);
          return;
        } catch (error) {
          console.error(
            "Failed to fetch /me, falling back to invite token",
            error,
          );
        }
      }

      // 🔹 Anonymous employee via invite link (not logged in)
      if (inviteToken) {
        setStakeholder("employee");
        setIsLoggedInEmployee(false);
        setPageLoading(false);
        return;
      }

      // 🔹 No token and not logged in — redirect to login
      toast.error("Please log in to access the assessment.");
      navigate("/login", { replace: true });
    };

    determineStakeholder();
  }, [inviteToken, navigate]);

  // =====================================================
  // 📥 FETCH START PAGE DATA (AFTER ROLE IS KNOWN)
  // =====================================================
  useEffect(() => {
    if (!stakeholder) return;

    const fetchStartData = async () => {
      try {
        const res = await api.get("assessment/start", {
          params: { stakeholder },
          headers:
            stakeholder === "employee" && inviteToken && !isLoggedInEmployee
              ? { "x-invite-token": inviteToken }
              : {},
        });
        setData(res.data);
      } catch (error) {
        console.error("Error fetching assessment start data:", error);
      }
    };

    fetchStartData();
  }, [stakeholder, inviteToken, isLoggedInEmployee]);

  const handleClick = async () => {
    if (!stakeholder) return;

    setLoading(true);

    try {
      // 🔹 ANONYMOUS EMPLOYEE FLOW (via invite link, no login)
      if (stakeholder === "employee" && inviteToken && !isLoggedInEmployee) {
        const res = await api.post(
          "employee-assessment/start",
          {},
          {
            headers: { "x-invite-token": inviteToken },
          },
        );

        navigate(
          `/assessment-question?assessmentId=${res.data.assessmentId}&token=${inviteToken}`,
        );
        return;
      }

      // 🔹 ALL LOGGED-IN USERS (including registered employees)
      const res = await api.post("assessment/start", { stakeholder });
      navigate(`/assessment-question?assessmentId=${res.data.assessmentId}`);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.status === 401) return;

      console.error("Error starting assessment:", error);
      toast.error(axiosError.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading || !stakeholder) {
    return <SpinnerLoader />;
  }

  return (
    <div className="min-h-screen bg-[var(--light-primary-color)]">
      <div className="lg:w-1/2 w-full mx-auto sm:pt-20 pt-10 pb-5 px-3">
        <div className="text-center mb-8 mx-auto">
          <img src={Logo} className="w-[150px] mx-auto" alt="Logo" />
        </div>

        <div className="w-full mx-auto sm:max-w-3xl rounded-xl shadow-md border bg-white sm:py-10 py-6 sm:px-10 px-4">
          <h2 className="sm:text-2xl text-xl font-medium mb-2">
            {data?.title}
          </h2>

          <p className="text-sm">{data?.description_one}</p>
          <p className="text-sm mt-1">
            <strong>POD-360™</strong> {data?.description_two}
          </p>

          <div className="mt-10">
            <h6 className="mb-2 text-xl font-medium">Test Guidelines</h6>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <img src={IconStar} className="w-3 mt-1" alt="star" />
                Respond honestly and instinctively.
              </li>
              <li className="flex gap-2">
                <img src={IconStar} className="w-3 mt-1" alt="star" />
                Duration: {data?.duration_minutes} minutes.
              </li>
              <li className="flex gap-2">
                <img src={IconStar} className="w-3 mt-1" alt="star" />
                Progress is saved automatically.
              </li>
            </ul>
          </div>

          <div className="grid place-items-center mt-10">
            <button
              disabled={loading}
              onClick={handleClick}
              className="group w-full text-white py-3 rounded-full font-semibold bg-gradient-to-r from-[#1a3652] to-[#448bd2]"
            >
              {loading ? "Initializing..." : "Begin Diagnostic"}
              {!loading && (
                <Icon
                  icon="mynaui:arrow-right-circle-solid"
                  width="24"
                  className="inline ml-2 -rotate-45 group-hover:rotate-0 transition"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartAssessment;
