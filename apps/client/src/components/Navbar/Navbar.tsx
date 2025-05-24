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
    <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm backdrop-blur-sm bg-opacity-95">
      <div className="flex items-center justify-between px-3 py-2 sm:px-6 sm:py-4">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-xl sm:text-2xl">📞</span>
          <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent sm:text-xl">
            Cytactic
          </span>
        </div>

        {/* Navigation buttons for admin users */}
        {isAdmin && isLoggedIn && (
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              buttonText="Admin"
              onClick={() => navigate("/admin")}
              className={`px-2 py-1.5 text-xs font-medium transition-all sm:px-4 sm:py-2 sm:text-sm ${
                currentPath === "/admin"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            />
            <Button
              buttonText="User"
              onClick={() => navigate("/dashboard")}
              className={`px-2 py-1.5 text-xs font-medium transition-all sm:px-4 sm:py-2 sm:text-sm ${
                currentPath === "/dashboard"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            />
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-4">
          {isLoggedIn ? (
            <Button
              onClick={onLogout}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors sm:px-5 sm:py-2 sm:text-sm"
            >
              Sign out
            </Button>
          ) : (
            <Button
              onClick={onLoginClick}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-all hover:shadow-md sm:px-5 sm:py-2 sm:text-sm"
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
