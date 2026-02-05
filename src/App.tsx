import { Route, Routes } from "react-router-dom";
import Login from "./screens/login";
import Home from "./screens/landing";
import ForgotPassword from "./screens/forgotPassword";
import AfterSendEmail from "./screens/afterSendEmail";
import NewPassword from "./screens/newPassword";
import Register from "./screens/register";
import AfterRegister from "./screens/afterRegister";
import ProfileInfo from "./screens/profileInfo";
import AssessmentQuestion from "./components/assessmentQuestion";
import Dashboard from "./components/dashboard";
import StartAssessment from "./components/startAssessment";
import PageNotFound from "./screens/pageNotFound";
import { AuthProvider } from "./context/AuthProvider";
import OrgInvitation from "./components/orgInvitation";
import CrudQuestion from "./screens/crudQuestion";
import ProtectedRoute from "./routes/protectedRoute";
import OverviewRoute from "./components/overviewRoute";
import SuperAdminOverview from "./screens/superAdminOverview";
import "react-tooltip/dist/react-tooltip.css";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/after-register" element={<AfterRegister />} />
        <Route path="/after-send-email" element={<AfterSendEmail />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/start-assessment" element={<StartAssessment />} />
        <Route path="/assessment-question" element={<AssessmentQuestion />} />

        <Route path="/profile-info" element={<ProfileInfo />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<OverviewRoute />} />
            <Route path="questions" element={<CrudQuestion />} />
            <Route path="invite" element={<OrgInvitation />} />
            {/* <Route path="settings" element={<Settings />} /> */}

            {/* Reports */}
            <Route path="reports/org-head" element={<SuperAdminOverview />} />
            {/* <Route
            path="reports/senior-leader"
            element={<SeniorLeaderReport />}
            /> */}
            {/* <Route path="reports/manager" element={<ManagerReport />} /> */}
            {/* <Route path="reports/employee" element={<EmployeeReport />} /> */}
          </Route>
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
