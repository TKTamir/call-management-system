import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, isAdmin, user } = useAuth();

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
