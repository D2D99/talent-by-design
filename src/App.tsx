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

import ProtectedRoute from "./routes/protectedRoute/index";
import PageNotFound from "./screens/pageNotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/after-send-email" element={<AfterSendEmail />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/after-register" element={<AfterRegister />} />
        <Route path="/profile-info" element={<ProfileInfo />} />
        <Route path="/start-assessment" element={<StartAssessment />} />
        <Route path="/assessment-question" element={<AssessmentQuestion />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
