import { api } from "./apiSlice";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  User,
} from "../../types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    // Register (Admin/IT use only)
    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Get current user profile
    getCurrentUser: builder.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    // Refresh token (handled automatically by baseQuery, but exposed for manual use)
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (tokenData) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body: tokenData,
      }),
    }),

    // Logout (client-side only, clears tokens)
    logout: builder.mutation<void, void>({
      queryFn: () => ({ data: undefined }),
      invalidatesTags: [
        "User",
        "Tag",
        "Task",
        "Call",
        "CallTag",
        "CallTask",
        "SuggestedTask",
        "TagTaskAssociation",
      ],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
