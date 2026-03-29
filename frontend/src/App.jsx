import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Analyzer from "./pages/Analyzer";
import MyResumes from "./pages/MyResumes";
import Predictions from "./pages/Predictions";
import ResumeBuilder from "./pages/ResumeBuilder";
import Settings from "./pages/Settings";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

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

          <Route path="/analyzer" element={
            <ProtectedRoute>
              <Analyzer />
            </ProtectedRoute>}
          />

          <Route path="/ai-prediction" element={
            <ProtectedRoute>
              <Predictions />
            </ProtectedRoute>}
          />

          <Route path="/myresumes" element={
            <ProtectedRoute>
              <MyResumes />
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