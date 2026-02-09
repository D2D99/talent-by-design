import AdminOverview from "../../screens/adminOverview";
import LeaderOverview from "../../screens/leaderOverview";
import ManagerOverview from "../../screens/managerOverview";
import PageNotFound from "../../screens/pageNotFound";
import SuperAdminOverview from "../../screens/superAdminOverview";

import { useAuth } from "../../context/useAuth";

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
    default:
      return <PageNotFound />;
  }
};

export default OverviewRoute;
