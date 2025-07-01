import { toast } from "react-toastify";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginValidationData {
  username: string;
  password: string;
}

interface RegistrationValidationData extends LoginValidationData {
  email: string;
}

export const validateLogin = (data: LoginValidationData): boolean => {
  if (!data.username.trim()) {
    toast.error("Username is required");
    return false;
  }

  if (!data.password.trim()) {
    toast.error("Password is required");
    return false;
  }

  return true;
};

export const validateRegister = (data: RegistrationValidationData): boolean => {
  if (!EMAIL_REGEX.test(data.email.trim())) {
    toast.error("Please enter a valid email address");
    return false;
  }

  if (data.username.trim().length < 4) {
    toast.error("Username must be at least 4 characters long");
    return false;
  }

  if (data.password.length < 4) {
    toast.error("Password must be at least 4 characters long");
    return false;
  }

  return validateLogin(data);
};
