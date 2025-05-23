import { useEffect } from "react";
import { type FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { type SerializedError } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/errorHandler";

// TODO: Implement in Components that use RTK Query Hooks
// Error handler for UI
export const useErrorHandler = (
  error: FetchBaseQueryError | SerializedError | undefined,
) => {
  useEffect(() => {
    if (error) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  }, [error]);
};
