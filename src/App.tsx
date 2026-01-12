import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "5px solid #448cd2",
            borderTop: "5px solid #e4f0fc",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }


  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/after-send-email" element={<AfterSendEmail />} />
      <Route path="/new-password" element={<NewPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/after-register" element={<AfterRegister />} />
      <Route path="/profile-info" element={<ProfileInfo />} />
      <Route
        path="/assessment-question"
        element={<AssessmentQuestion />}
      />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
