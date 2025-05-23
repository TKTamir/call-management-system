import React from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { AppProvider } from "./providers/AppProvider";
import AppContent from "./components/AppContent/AppContent";

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
      <ToastContainer />
    </AppProvider>
  );
};

export default App;
