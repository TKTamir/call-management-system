import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "../Navbar/Navbar";
import Login from "../Login/Login";
import Home from "../../pages/Home";
import Dashboard from "../../pages/Dashboard";
import AdminDashboard from "../../pages/AdminDashboard";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const AppContent: React.FC = () => {
  const { isAdmin, isAuthenticated, isLoading, refreshUserData, logout, user } =
    useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      refreshUserData();
    }
  }, [isAuthenticated]);

  // Handle login success - redirect based on role
  useEffect(() => {
    if (isAuthenticated && user) {
      setShowLoginModal(false);

      // Only redirect from home page
      if (location.pathname === "/" || location.pathname === "/home") {
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    }
  }, [isAuthenticated, user, navigate]);

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading your dashboard..." />;
  }

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar
        isLoggedIn={isAuthenticated}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onLoginClick={handleLoginClick}
        currentPath={location.pathname}
      />
      <Login isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <div className="flex flex-grow items-center justify-center mt-16">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />
              ) : (
                <Home />
              )
            }
          />
          <Route path="/home" element={<Home />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="both">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/unauthorized"
            element={
              <div className="text-center">
                <h1>Access Denied</h1>
                <p>You don't have permission to access this page.</p>
                <button
                  onClick={handleLoginClick}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Login
                </button>
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default AppContent;
