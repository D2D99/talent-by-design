import AdminOverview from "../../screens/adminOverview";
import LeaderOverview from "../../screens/leaderOverview";
import ManagerOverview from "../../screens/managerOverview";
import PageNotFound from "../../screens/pageNotFound";
import SuperAdminOverview from "../../screens/superAdminOverview";

import { useAuth } from "../../context/useAuth";
import { Navigate } from "react-router-dom";

const OverviewRoute = () => {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  switch (role) {
    case "superadmin":
      return <SuperAdminOverview />;
    case "admin":
      return <AdminOverview />;
    case "manager":
      return <ManagerOverview />;
    case "leader":
      return <LeaderOverview />;
    case "employee":
      // Employees don't have a dashboard — send them straight to assessment
      return <Navigate to="/start-assessment" replace />;
    default:
      return <PageNotFound />;
  }
};

export default OverviewRoute;
