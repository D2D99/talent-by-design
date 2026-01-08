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

function App() {
  return (
    <>
      <Routes>
        <Route path="*" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/after-send-email" element={<AfterSendEmail />}></Route>
        <Route path="/new-password" element={<NewPassword />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/after-register" element={<AfterRegister />}></Route>
        <Route path="/profile-info" element={<ProfileInfo />}></Route>
        <Route
          path="/assessment-question"
          element={<AssessmentQuestion />}
        ></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
    </>
  );
}

export default App;
