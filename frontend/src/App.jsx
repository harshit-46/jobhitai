import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MyResumes from "./pages/MyResumes";
import ResumeBuilder from "./components/resume/ResumeBuilder";
import Settings from "./pages/Settings";
import CareerInsight from "./pages/CareerInsight";
import SkillMatcherPage from "./pages/SkillMatcherPage";
import ResumeClassifierPage from "./pages/ResumeClassifierPage";
import SkillMatchSetPage from "./pages/SkillMatchSetPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPassword from "./pages/ForgotPassword";
import CheckEmail from "./pages/CheckEmail";
import VerifySuccess from "./pages/Verifysuccess";
import VerifyFailed from "./pages/Verifyfailed";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/verification-successful" element={<VerifySuccess />} />
          <Route path="/verify-failed" element={<VerifyFailed />} />

          {/* Protected Route */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>}
          />

          <Route path="/resume-builder" element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>}
          />

          <Route path="/career-advisor" element={
            <ProtectedRoute>
              <CareerInsight />
            </ProtectedRoute>}
          />

          <Route path="/skill-matcher" element={
            <ProtectedRoute>
              <SkillMatcherPage />
            </ProtectedRoute>}
          />

          <Route path="/job-category" element={
            <ProtectedRoute>
              <ResumeClassifierPage />
            </ProtectedRoute>}
          />

          <Route path="/skill-match-set" element={
            <ProtectedRoute>
              <SkillMatchSetPage />
            </ProtectedRoute>}
          />

          <Route path="/myresumes" element={
            <ProtectedRoute>
              <MyResumes />
            </ProtectedRoute>}
          />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>}
          />

          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>}
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;