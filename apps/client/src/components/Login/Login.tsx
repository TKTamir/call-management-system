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
    if (!username.trim() || !password.trim()) {
      toast("Username and password are required");
      return;
    }

    try {
      await login({ username, password });

      onClose();
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Login failed:", error);
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
      name="Sign in"
      inputValue={username}
      onInputChange={(e: ChangeEvent<HTMLInputElement>) =>
        setUsername(e.target.value)
      }
      onSubmit={handleLogin}
      submitButtonText={isLoading ? "Signing in..." : "Sign in"}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="w-full border rounded-md px-3 py-2 disabled:opacity-50"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="w-full border rounded-md px-3 py-2 disabled:opacity-50"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex justify-end">
          <Button
            buttonText={isLoading ? "Signing in..." : "Sign in"}
            onClick={handleLogin}
            className="px-4"
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default Login;
