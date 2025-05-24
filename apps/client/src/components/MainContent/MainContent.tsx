import React from "react";

const MainContent: React.FC = () => {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-50 p-6 shadow-sm sm:h-auto sm:w-2/3">
      <div className="text-center">
        <div className="mb-4 inline-flex h-20 w-20 items-center justify-center">
          <svg
            className="h-10 w-10 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          Create New Call
        </h3>
        <p className="text-gray-600">
          Select an existing call or create a new one to get started
        </p>
      </div>
    </div>
  );
};

export default MainContent;
