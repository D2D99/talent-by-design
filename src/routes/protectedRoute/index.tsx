import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useEffect, useState } from "react";
import api from "../../services/axios";

const ProtectedRoute = () => {
  const { token, user } = useAuth();
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [needsAssessment, setNeedsAssessment] = useState(false);

  useEffect(() => {
    if (!token || !user) {
      setChecking(false);
      return;
    }

    // Employees are never dashboard users — always send to assessment
    const role = user?.role?.toLowerCase();
    if (role === "employee") {
      setNeedsAssessment(true);
      setChecking(false);
      return;
    }

    // SuperAdmin never needs an assessment
    if (role === "superadmin") {
      setChecking(false);
      return;
    }

    // For admin/leader/manager — ask the SERVER (uses assessment.config.js cycle)
    const checkAssessmentStatus = async () => {
      try {
        const res = await api.get("auth/me");
        const status = res.data.assessmentStatus;
        // PENDING = never done, DUE = cycle expired → both require assessment
        if (status === "PENDING" || status === "DUE") {
          setNeedsAssessment(true);
        }
      } catch {
        // If the check fails (e.g. network), don't block the user
      } finally {
        setChecking(false);
      }
    };

    checkAssessmentStatus();
  }, [token, user]);

  // Not logged in → go to home
  if (!token || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Still checking with server
  if (checking) return null;

  // Assessment required → redirect to start-assessment
  if (needsAssessment) {
    return <Navigate to="/start-assessment" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
