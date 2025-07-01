import React, { useEffect } from "react";
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
import Button from "../Button/Button";
import Register from "../Register/Register";
import { useModalState } from "../../hooks/useModalState";

const AppContent: React.FC = () => {
  const { isAdmin, isAuthenticated, isLoading, refreshUserData, logout, user } =
    useAuth();
  const { openModal, closeModal, isModalOpen } = useModalState();
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
      closeModal("login");

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar
        isLoggedIn={isAuthenticated}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onLoginClick={() => openModal("login")}
        onRegisterClick={() => openModal("register")}
        currentPath={location.pathname}
      />
      <Login
        isOpen={isModalOpen("login")}
        onClose={() => closeModal("login")}
      />
      <Register
        isOpen={isModalOpen("register")}
        onClose={() => closeModal("register")}
      />
      <div className="mt-12 sm:mt-16 flex flex-grow items-center justify-center p-4">
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
              <div className="rounded-xl bg-white p-8 text-center shadow-lg">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <svg
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900">
                  Access Denied
                </h1>
                <p className="mb-6 text-gray-600">
                  You don't have permission to access this page.
                </p>
                <Button
                  buttonText="Sign In"
                  onClick={() => openModal("login")}
                  className="bg-blue-600 px-6 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800"
                />
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
