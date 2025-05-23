import React from "react";
import Button from "../Button/Button";

interface NavbarProps {
  activeView: "adminDashboard" | "userDashboard";
  onLogout: () => void;
  onLoginClick: () => void;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  onTagsClick?: () => void;
  onCallsClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onLogout,
  isLoggedIn,
  isAdmin,
  onLoginClick,
  activeView,
  onTagsClick,
  onCallsClick,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 border-b bg-white z-10">
      <div className="text-lg font-semibold">📞 Cytactic</div>

      {/* Center buttons - only visible for admin users when in admin view */}
      {isAdmin && isLoggedIn && (
        <div className="flex items-center gap-4">
          <Button
            buttonText="Admin"
            onClick={onTagsClick || (() => {})}
            className={`px-4 ${activeView === "adminDashboard" ? "bg-gray-100" : ""}`}
          />
          <Button
            buttonText="User"
            onClick={onCallsClick || (() => {})}
            className={`px-4 ${activeView === "userDashboard" ? "bg-gray-100" : ""}`}
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
