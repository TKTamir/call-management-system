import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, isAdmin, isLoading, user, refreshUserData } =
    useAuth();

  useEffect(() => {
    // Refresh user data when entering protected route
    if (isAuthenticated) {
      refreshUserData();
    }
  }, [isAuthenticated, refreshUserData]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole === "admin" && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRole === "user" && user?.role !== "user") {
    return <Navigate to="/unauthorized" replace />;
  }

  // All checks passed - render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
