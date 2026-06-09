import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthProvider";
import { TooltipProvider } from "./context/TooltipContext";
import ProtectedRoute from "./routes/protectedRoute";
import OverviewRoute from "./components/overviewRoute";
import SessionPopup from "./components/sessionPopup";
import { ToastContainer } from "react-toastify";

// Lazy load screens/components
const Login = lazy(() => import("./screens/login"));
const Home = lazy(() => import("./screens/landing"));
const ForgotPassword = lazy(() => import("./screens/forgotPassword"));
const AfterSendEmail = lazy(() => import("./screens/afterSendEmail"));
const NewPassword = lazy(() => import("./screens/newPassword"));
const Register = lazy(() => import("./screens/register"));
const AfterRegister = lazy(() => import("./screens/afterRegister"));
const ProfileInfo = lazy(() => import("./screens/profileInfo"));
const AssessmentQuestion = lazy(
  () => import("./components/assessmentQuestion"),
);
const Dashboard = lazy(() => import("./components/dashboard"));
const StartAssessment = lazy(() => import("./components/startAssessment"));
const PageNotFound = lazy(() => import("./screens/pageNotFound"));
const OrgInvitation = lazy(() => import("./components/orgInvitation"));
const OrgUsers = lazy(() => import("./components/orgUsers"));
const OrgInvitationDetails = lazy(
  () => import("./components/orgInvitationDetails"),
);
const OrgAssessmentDetails = lazy(
  () => import("./components/orgAssessmentDetails"),
);
const OrgDeepDive = lazy(() => import("./screens/orgDeepDive"));
const PersonDeepDive = lazy(() => import("./screens/personDeepDive"));
const CrudQuestion = lazy(() => import("./screens/crudQuestion"));
const UserProfile = lazy(() => import("./screens/userProfile"));
const AccountSetting = lazy(() => import("./components/accountSetting"));
const NotificationHistory = lazy(() => import("./screens/notifications"));
const AssessmentHistory = lazy(() => import("./screens/assessmentHistory"));
const SuperAdminStats = lazy(() => import("./screens/superAdminStats"));
const AdminAssessments = lazy(() => import("./screens/adminAssessments"));
const EmployeeReport = lazy(() => import("./screens/employeeReport"));
const UserResponseView = lazy(() => import("./screens/userResponseView"));
const ManagerReport = lazy(() => import("./screens/managerReport"));
const LeaderReport = lazy(() => import("./screens/leaderReport"));
const TeamIntelligence = lazy(() => import("./screens/teamIntelligence"));

const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center bg-white">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--primary-color)] border-t-transparent"></div>
  </div>
);

function App() {
  // const { theme } = useTheme();

  return (
    <TooltipProvider>
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

        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/after-register" element={<AfterRegister />} />
            <Route path="/after-send-email" element={<AfterSendEmail />} />
            <Route path="/new-password" element={<NewPassword />} />
            <Route path="/start-assessment" element={<StartAssessment />} />
            <Route
              path="/assessment-question"
              element={<AssessmentQuestion />}
            />

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
                <Route
                  path="org-intelligence/:orgName"
                  element={<OrgDeepDive />}
                />
                <Route
                  path="person-intelligence"
                  element={<PersonDeepDive />}
                />
                <Route
                  path="team-intelligence"
                  element={<TeamIntelligence />}
                />
                <Route path="users" element={<OrgUsers />} />
                <Route path="notifications" element={<NotificationHistory />} />
                <Route
                  path="assessment-history"
                  element={<AssessmentHistory />}
                />
                <Route path="team-assessments" element={<AdminAssessments />} />
                <Route path="org-assessments" element={<SuperAdminStats />} />
                <Route
                  path="user-responses/:assessmentId"
                  element={<UserResponseView />}
                />
                <Route path="user-profile" element={<UserProfile />} />

                <Route path="settings" element={<AccountSetting />} />

                {/* Reports */}
                {/* <Route path="reports/org-head" element={<AdminReport />} /> */}
                <Route
                  path="reports/senior-leader"
                  element={<LeaderReport />}
                />
                <Route path="reports/manager" element={<ManagerReport />} />
                <Route path="reports/employee" element={<EmployeeReport />} />
                {/* <Route path="reports/employee" element={<EmployeeReport />} /> */}
              </Route>
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </TooltipProvider>
  );
}

export default App;
