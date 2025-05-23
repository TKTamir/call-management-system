import React from "react";
import "./App.css";
import { AppProvider } from "./providers/AppProvider";
import AppContent from "./components/AppContent/AppContent";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
      <ToastContainer />
    </AppProvider>
  );
};

export default App;
