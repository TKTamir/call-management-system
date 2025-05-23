import React from "react";

const AppContent: React.FC = () => {
  return (
    <></>
    // <Routes>
    //   <Route path="/login" element={<Home />} /> Home Includes Login Modal
    //
    //   <Route
    //     path="/admin"
    //     element={
    //       <ProtectedRoute requiredRole="admin">
    //         <AdminDashboard /> Admin Dashboard Includes toggle for switching between tags and suggested tasks views, and a toggle for switching to  calls view
    //       </ProtectedRoute>
    //     }
    //   />
    //   <Route
    //     path="/user"
    //     element={
    //       <ProtectedRoute requiredRole="user">
    //         <UserDashboard /> // User Dashboard includes calls view
    //       </ProtectedRoute>
    //     }
    //   />
    //   <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
    //   <Route path="/" element={<Navigate to="/login" replace />} />
    // </Routes>
  );
};

export default AppContent;
