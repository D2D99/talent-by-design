import { lazy, Suspense } from "react";
import { useAuth } from "../../context/useAuth";
import { Navigate } from "react-router-dom";

const AdminOverview = lazy(() => import("../../screens/adminOverview"));
// LeaderOverview is replaced by AdminOverview for department-level view
const ManagerOverview = lazy(() => import("../../screens/managerOverview"));
const PageNotFound = lazy(() => import("../../screens/pageNotFound"));
const SuperAdminOverview = lazy(
  () => import("../../screens/superAdminOverview"),
);

const Loading = () => (
  <div className="flex h-[400px] w-full items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--primary-color)] border-t-transparent"></div>
  </div>
);

const OverviewRoute = () => {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  return (
    <Suspense fallback={<Loading />}>
      {(() => {
        switch (role) {
          case "superadmin":
            return <SuperAdminOverview />;
          case "admin":
            return <AdminOverview />;
          case "manager":
            return <ManagerOverview />;
          case "leader":
            return <AdminOverview />;
          case "employee":
            if (user?.assessmentStatus === "COMPLETED") {
              return <Navigate to="/dashboard/reports/employee" replace />;
            }
            return <Navigate to="/start-assessment" replace />;
          default:
            return <PageNotFound />;
        }
      })()}
    </Suspense>
  );
};

export default OverviewRoute;
