import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
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
import AdminReport from "./screens/adminReport";
import LeaderReport from "./screens/leaderReport";
import ManagerReport from "./screens/managerReport";
import TopicSelectorModal from "./components/TopicSelectorModal";

// import { useTheme } from "./context/useTheme";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const handleGeneratePdf = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/generate-report/report", {
        userId: "someUserId", // Replace with actual user ID
        selectedDomain: "People Potential", // Replace with the actual selected domain
        selectedSubdomain: "Psychological Health & Safety", // Replace with the actual subdomain
        selectedTopics
      }, { responseType: "arraybuffer" });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "report.pdf";
      link.click();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveSelectedTopics = (topics: string[]) => {
    setSelectedTopics(topics);
  };

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
            <Route path="organization/:orgName" element={<OrgInvitationDetails />} />
            <Route path="org-assessments/:orgName" element={<OrgAssessmentDetails />} />
            <Route path="users" element={<OrgUsers />} />
            <Route path="notifications" element={<NotificationHistory />} />
            <Route path="assessment-history" element={<AssessmentHistory />} />
            <Route path="team-assessments" element={<AdminAssessments />} />
            <Route path="org-assessments" element={<SuperAdminStats />} />
            <Route path="user-profile" element={<UserProfile />} />
            <Route path="settings" element={<AccountSetting />} />

            {/* Reports */}
            <Route path="reports/org-head" element={<AdminReport />} />
            <Route path="reports/senior-leader" element={<LeaderReport />} />
            <Route path="reports/manager" element={<ManagerReport />} />
            <Route path="reports/employee" element={<EmployeeReport />} />
          </Route>
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <button onClick={handleOpenModal}>Select Topics for PDF</button>

      {isModalOpen && (
        <TopicSelectorModal
          onSave={handleSaveSelectedTopics}
          onClose={handleCloseModal}
        />
      )}

      <button onClick={handleGeneratePdf}>Download PDF</button>
    </AuthProvider>
  );
};

export default App;
