import React, { useState, type ChangeEvent } from "react";
import { toast } from "react-toastify";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { useAuth } from "../../hooks/useAuth";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { useRegisterMutation } from "../../store/api";

export interface RegisterProps {
  isOpen: boolean;
  onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  const { login } = useAuth();
  const [register, { error, isLoading }] = useRegisterMutation();

  useErrorHandler(error);

  const handleRegister = async () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      const lowercaseUsername = username.trim().toLowerCase();
      const lowercaseEmail = email.trim().toLowerCase();
      
      await register({
        email: lowercaseEmail,
        username: lowercaseUsername,
        password,
        role,
      }).unwrap();
      
      // Auto-login after successful registration
      await login({ username: lowercaseUsername, password });
      
      toast.success("Signed up and logged in successfully!");
      onClose();
      setEmail("");
      setUsername("");
      setPassword("");
      setRole("user");
    } catch (error) {
      console.error("Failed to register:", error);
      toast.error("Failed to register, please try again");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleRegister();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name="Sign Up to Call Management System"
      inputValue={username}
      onInputChange={(e: ChangeEvent<HTMLInputElement>) =>
        setUsername(e.target.value)
      }
      onSubmit={handleRegister}
      submitButtonText={isLoading ? "Signing up..." : "Sign up"}
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter your password"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as "user" | "admin")}
            disabled={isLoading}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition-all duration-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            buttonText={isLoading ? "Signing up..." : "Sign up"}
            onClick={handleRegister}
            className="bg-blue-600 px-6 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800"
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default Register;
