import React from "react";

interface LoadingSpinnerProps {
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = "Loading...",
  fullScreen = false,
}) => {
  const containerClass = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white z-50"
    : "flex items-center justify-center min-h-96";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center space-y-4">
        <div
          className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
          role="status"
          aria-label="Loading"
        />
        <p className="text-gray-600 text-lg font-medium">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
