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
import OrgUsers from "./components/orgUsers";
import OrgInvitationDetails from "./components/orgInvitationDetails";
import OrgAssessmentDetails from "./components/orgAssessmentDetails";
import CrudQuestion from "./screens/crudQuestion";
import ProtectedRoute from "./routes/protectedRoute";
import OverviewRoute from "./components/overviewRoute";
import SuperAdminOverview from "./screens/superAdminOverview";
import LeaderOverview from "./screens/leaderOverview";
import ManagerOverview from "./screens/managerOverview";
import "react-tooltip/dist/react-tooltip.css";
import UserProfile from "./screens/userProfile";
import SessionPopup from "./components/sessionPopup";
import AccountSetting from "./components/accountSetting";
import NotificationHistory from "./screens/notifications";
import AssessmentHistory from "./screens/assessmentHistory";
import SuperAdminStats from "./screens/superAdminStats";
import AdminAssessments from "./screens/adminAssessments";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployeeReport from "./screens/employeeReport";
// import { useTheme } from "./context/useTheme";

function App() {
  // const { theme } = useTheme();

  return (
    <AuthProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        // theme={theme}
      />
      <SessionPopup />

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
            <Route
              path="organization/:orgName"
              element={<OrgInvitationDetails />}
            />
            <Route
              path="org-assessments/:orgName"
              element={<OrgAssessmentDetails />}
            />
            <Route path="users" element={<OrgUsers />} />
            <Route path="notifications" element={<NotificationHistory />} />
            <Route path="assessment-history" element={<AssessmentHistory />} />
            <Route path="team-assessments" element={<AdminAssessments />} />
            <Route path="org-assessments" element={<SuperAdminStats />} />
            <Route path="user-profile" element={<UserProfile />} />

            <Route path="settings" element={<AccountSetting />} />

            {/* Reports */}
            <Route path="reports/org-head" element={<SuperAdminOverview />} />
            <Route path="reports/senior-leader" element={<LeaderOverview />} />
            <Route path="reports/manager" element={<ManagerOverview />} />
            <Route path="reports/employee" element={<EmployeeReport />} />
            {/* <Route path="reports/employee" element={<EmployeeReport />} /> */}
          </Route>
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
