import React from "react";

const Home: React.FC = () => {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl bg-white p-8 text-center shadow-lg">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <span className="text-3xl">📞</span>
        </div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Welcome to Call Management System
        </h2>
        <p className="text-gray-600">
          Please sign in to access the application
        </p>
      </div>
    </div>
  );
};

export default Home;
