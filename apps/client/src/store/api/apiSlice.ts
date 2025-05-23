import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { type RootState } from "../index";
import { setTokens, logout } from "../slices/authSlice";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
if (!SERVER_URL) {
  console.warn("SERVER_URL is not defined! Falling back to localhost.");
}
const baseQuery = fetchBaseQuery({
  baseUrl: `${SERVER_URL}/api` || "http://localhost:3000/api",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;

    // Add authorization header if we have a token
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// Base query with automatic token refresh
const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401, try to refresh the token
  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    if (refreshToken) {
      console.log("Token expired, attempting refresh...");

      // Try to refresh the token
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const newTokens = refreshResult.data as {
          accessToken: string;
          refreshToken: string;
        };

        // Update tokens in state
        api.dispatch(setTokens(newTokens));

        console.log("Token refreshed successfully");

        // Retry the original request with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.log("Token refresh failed, logging out");
        // Refresh failed, logout user
        api.dispatch(logout());
      }
    } else {
      // No refresh token available, logout
      console.log("No refresh token available, logging out");
      api.dispatch(logout());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReAuth,
  tagTypes: [
    "User",
    "Tag",
    "Task",
    "Call",
    "CallTag",
    "CallTask",
    "SuggestedTask",
    "TagTaskAssociation",
  ],
  endpoints: () => ({}),
});
