import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { ProfileManager } from "./pages/ProfileManager";
import { ProjectsManager } from "./pages/ProjectsManager";
import { SkillsManager } from "./pages/SkillsManager";

// Day 5 feature placeholder component
const ComingSoon = ({ title }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-sm">
    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-lg">
      5
    </div>
    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
    <p className="text-sm text-slate-500 mt-2">
      This management section is part of the Day 5 roadmap. Full UI and controls will be active next!
    </p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected CMS Admin Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfileManager />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProjectsManager />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <Layout>
                  <SkillsManager />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Placeholders for Day 5 */}
          <Route
            path="/experience"
            element={
              <ProtectedRoute>
                <Layout>
                  <ComingSoon title="Experience & Education Manager" />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <Layout>
                  <ComingSoon title="Services & Testimonials Manager" />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/blogs"
            element={
              <ProtectedRoute>
                <Layout>
                  <ComingSoon title="Blog Posts & Articles Manager" />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Layout>
                  <ComingSoon title="Inquiries & Messages Inbox" />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
