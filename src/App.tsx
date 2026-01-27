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
// import LoaderTest from "./components/loaderTest";

import PageNotFound from "./screens/pageNotFound";
// import ProtectedRoute from "./routes/protectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import OrgInvitation from "./components/orgInvitation";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Guest Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/after-register" element={<AfterRegister />} />
        <Route path="/after-send-email" element={<AfterSendEmail />} />
        <Route path="/new-password" element={<NewPassword />} />

        <Route path="/profile-info" element={<ProfileInfo />} />
        <Route path="/start-assessment" element={<StartAssessment />} />
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="settings" element={<OrgInvitation />} />
        </Route>
        <Route path="/assessment-question" element={<AssessmentQuestion />} />
        {/* Private Routes */}
        {/* <Route element={<ProtectedRoute />}>
        </Route> */}

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
