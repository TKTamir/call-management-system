import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";

interface NavbarProps {
  currentPath: string;
  onLogout: () => void;
  onLoginClick: () => void;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  onLogout,
  isLoggedIn,
  isAdmin,
  onLoginClick,
  currentPath,
}) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 border-b bg-white z-10">
      <div className="text-lg font-semibold">📞 Cytactic</div>

      {/* Navigation buttons for admin users */}
      {isAdmin && isLoggedIn && (
        <div className="flex items-center gap-4">
          <Button
            buttonText="Admin"
            onClick={() => navigate("/admin")}
            className={`px-4 ${currentPath === "/admin" ? "bg-gray-100" : ""}`}
          />
          <Button
            buttonText="User"
            onClick={() => navigate("/dashboard")}
            className={`px-4 ${currentPath === "/dashboard" ? "bg-gray-100" : ""}`}
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <Button onClick={onLogout} className="px-4 py-1">
            Sign out
          </Button>
        ) : (
          <Button onClick={onLoginClick} className="px-4 rounded-md">
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
