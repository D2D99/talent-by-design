import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const ProtectedRoute = () => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    // Save the location the user was trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
