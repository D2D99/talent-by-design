import { useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../../../public/static/img/home/logo.svg";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import api from "../../services/axios";
import SpinnerLoader from "../spinnerLoader";
import IconStar from "../../../public/static/img/icons/ic-star.svg";
import { AxiosError } from "axios";

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

  // 🔹 Invite token → employee
  const inviteToken = searchParams.get("token") || searchParams.get("token1");

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AssessmentStartData | null>(null);
  const [stakeholder, setStakeholder] = useState<Stakeholder | null>(null);

  // =====================================================
  // 🔐 DETERMINE STAKEHOLDER (EMPLOYEE OR /ME ROLE)
  // =====================================================
  useEffect(() => {
    const determineStakeholder = async () => {
      // 🔹 Employee via invite link
      if (inviteToken) {
        setStakeholder("employee");
        setPageLoading(false);
        return;
      }

      // 🔹 Admin / Leader / Manager via /me
      try {
        const res = await api.get("auth/me");
        setStakeholder(res.data.role);
      } catch (error) {
        console.error("Failed to determine user role", error);
      } finally {
        setPageLoading(false);
      }
    };

    determineStakeholder();
  }, [inviteToken]);

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
            stakeholder === "employee" && inviteToken
              ? { "x-invite-token": inviteToken }
              : {},
        });
        setData(res.data);
      } catch (error) {
        console.error("Error fetching assessment start data:", error);
      }
    };

    fetchStartData();
  }, [stakeholder, inviteToken]);

  const handleClick = async () => {
    if (!stakeholder) return;

    setLoading(true);

    try {
      // 🔹 EMPLOYEE FLOW
      if (stakeholder === "employee" && inviteToken) {
        const res = await api.post("employee-assessment/start", {}, {
          headers: { "x-invite-token": inviteToken },
        });

        navigate(`/assessment-question?assessmentId=${res.data.assessmentId}&token=${inviteToken}`);
        return;
      }

      // 🔹 ADMIN / LEADER / MANAGER FLOW
      const res = await api.post("assessment/start", { stakeholder });
      navigate(`/assessment-question?assessmentId=${res.data.assessmentId}`);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.status === 401) return;

      console.error("Error starting assessment:", error);
      alert(axiosError.response?.data?.message || "Something went wrong");
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
          <h2 className="sm:text-2xl text-xl font-medium mb-1">
            {data?.title}
          </h2>

          <p className="text-sm">{data?.description_one}</p>
          <p className="text-sm mt-1">
            <strong>POD-360™</strong> {data?.description_two}
          </p>

          <div className="mt-5">
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
