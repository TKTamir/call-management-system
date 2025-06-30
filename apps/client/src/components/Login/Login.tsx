import React, { useState, type ChangeEvent } from "react";
import { toast } from "react-toastify";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { useAuth } from "../../hooks/useAuth";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { useLoginMutation } from "../../store/api";

export interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading } = useAuth();
  const [, { error }] = useLoginMutation();

  useErrorHandler(error);

  const handleLogin = async () => {
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
      await login({ username: lowercaseUsername, password });
      toast.success("Successfully logged in!");
      onClose();
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid credentials");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name="Sign in to Call Management System"
      inputValue={username}
      onInputChange={(e: ChangeEvent<HTMLInputElement>) =>
        setUsername(e.target.value)
      }
      onSubmit={handleLogin}
      submitButtonText={isLoading ? "Signing in..." : "Sign in"}
    >
      <div className="space-y-4">
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

        <div className="flex justify-end pt-2">
          <Button
            buttonText={isLoading ? "Signing in..." : "Sign in"}
            onClick={handleLogin}
            className="bg-blue-600 px-6 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800"
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default Login;
