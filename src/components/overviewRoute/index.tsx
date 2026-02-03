import AdminOverview from "../../screens/adminOverview";
import LeaderOverview from "../../screens/leaderOverview";
import ManagerOverview from "../../screens/managerOverview";
import PageNotFound from "../../screens/pageNotFound";
import SuperAdminOverview from "../../screens/superAdminOverview";

const OverviewRoute = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
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
