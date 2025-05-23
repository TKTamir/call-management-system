import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "../store";
import { useRealTimeUpdates } from "../hooks/useSocketIntegration";

const AppWithHooks: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize real-time updates integration
  useRealTimeUpdates();

  return <>{children}</>;
};

// Main app provider that wraps everything
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppWithHooks>{children}</AppWithHooks>
      </BrowserRouter>
    </Provider>
  );
};
