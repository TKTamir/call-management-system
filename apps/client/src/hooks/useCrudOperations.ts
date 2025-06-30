import { toast } from "react-toastify";

interface CrudOperationOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useCrudOperations = () => {
  const executeOperation = async <T>(
    operation: () => Promise<T>,
    options: CrudOperationOptions = {},
  ) => {
    const {
      successMessage,
      errorMessage = "Operation failed",
      onSuccess,
      onError,
    } = options;

    try {
      await operation();
      if (successMessage) {
        toast.success(successMessage);
      }
      onSuccess?.();
    } catch (error) {
      console.error(errorMessage, error);
      onError?.(error);
    }
  };

  return { executeOperation };
};
