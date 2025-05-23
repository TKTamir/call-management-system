import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
} from "../store/api";
import {
  setCredentials,
  logout as logoutAction,
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsAdmin,
  selectIsLoading,
} from "../store/slices/authSlice";
import type { LoginRequest } from "../types";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const isLoading = useSelector(selectIsLoading);

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();

  // Get current user query (only runs if authenticated)
  const { refetch: refetchCurrentUser } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  const login = async (credentials: LoginRequest) => {
    try {
      const result = await loginMutation(credentials).unwrap();

      // Store credentials in Redux state and localStorage
      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        }),
      );

      // Navigate based on role
      if (result.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

      return result;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear server-side session (if any)
      await logoutMutation().unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state regardless of server response
      dispatch(logoutAction());
      navigate("/login");
    }
  };

  const refreshUserData = async () => {
    if (isAuthenticated) {
      try {
        await refetchCurrentUser();
      } catch (error) {
        console.error("Failed to refresh user data:", error);
        // If refresh fails, logout user
        logout();
      }
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    isAdmin,
    isLoading: isLoading || isLoginLoading,

    // Actions
    login,
    logout,
    refreshUserData,

    // Computed values
    isUser: user?.role === "user",
    userRole: user?.role,
  };
};
