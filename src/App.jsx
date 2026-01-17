import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard.jsx";
import TopUsersPage from "./pages/TopUsersPage.jsx";
import ShopkeeperDetails from "./pages/ShopkeeperDetails.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Logs from "./pages/Logs.jsx";
import Notification from "./pages/Notification.jsx";
import DeleteUser from "./pages/DeleteUser.jsx";
import ChaiDevice from "./pages/ChaiDevice.jsx";
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/top-users"
            element={
              <ProtectedRoute>
                <TopUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-details"
            element={
              <ProtectedRoute>
                <ShopkeeperDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <ProtectedRoute>
                <Logs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notification"
            element={
              <ProtectedRoute>
                <Notification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delete-user"
            element={
              <ProtectedRoute>
                <DeleteUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chai-device"
            element={
              <ProtectedRoute>
                <ChaiDevice />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
