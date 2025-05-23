import { type FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { type SerializedError } from "@reduxjs/toolkit";

// Error handler for getting the error message in Logic / Custom error UI
export const isFetchBaseQueryError = (
  error: unknown,
): error is FetchBaseQueryError => {
  return error !== null && typeof error === "object" && "status" in error;
};

export const isSerializedError = (error: unknown): error is SerializedError => {
  return (
    error !== null &&
    typeof error === "object" &&
    "message" in error &&
    !("status" in error)
  );
};

export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined,
): string => {
  if (!error) return "An unknown error occurred";

  if (isFetchBaseQueryError(error)) {
    if (error.status === "FETCH_ERROR") {
      return "Network error - please check your connection";
    }
    if (error.status === "TIMEOUT_ERROR") {
      return "Request timeout - please try again";
    }
    if (
      typeof error.data === "object" &&
      error.data !== null &&
      "message" in error.data &&
      typeof error.data.message === "string"
    ) {
      return error.data.message;
    }
    return `Server error: ${error.status}`;
  }

  if (isSerializedError(error)) {
    return error.message || "An error occurred";
  }

  return "An unknown error occurred";
};
