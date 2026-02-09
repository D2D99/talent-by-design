import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const ProtectedRoute = () => {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
