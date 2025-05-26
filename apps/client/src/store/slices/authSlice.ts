import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "../../types";

// Initialize from localStorage if available
const getInitialState = (): AuthState => {
  try {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    return {
      user,
      isAuthenticated: !!user,
      isLoading: false,
    };
  } catch (error) {
    console.error("Error loading auth state from localStorage:", error);
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;

      // Persist to localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      // Clear localStorage
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, setLoading, logout } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectIsAdmin = (state: { auth: AuthState }) =>
  state.auth.user?.role === "admin";
export const selectIsLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
