import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout } from "../slices/authSlice";
import { logger } from "../../utils/logger";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
if (!SERVER_URL) {
  console.warn("SERVER_URL is not defined! Falling back to localhost.");
}
const baseQuery = fetchBaseQuery({
  baseUrl: `${SERVER_URL}/api` || "http://localhost:3000/api",
  credentials: "include", // Send cookies with requests
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
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
    logger("Token expired, attempting refresh...");

    // Try to refresh the token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      logger("Token refreshed successfully");
      // Retry the original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // No refresh token available, logout
      logger("Token refresh failed, logging out");
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
