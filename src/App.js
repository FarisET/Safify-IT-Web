import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login';
import Incidents from './pages/Incidents';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import TopNavWrapper from './components/TopNavWrapper'; // New Wrapper Component
import AssetPage from './pages/Assets';
import Approvals from './pages/Approvals';
import SolutionForum from './pages/SolutionForum';
import UsersDirectory from './pages/UserDirectory';

const AppRouter = () => {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <TopNavWrapper /> {/* Wrapper Component for TopNav */}

        {/* Page Content */}
        <div className="flex-1 mt-12 p-4 ml-12">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/incidents"
              element={
                <ProtectedRoute>
                  <Incidents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assets"
              element={
                <ProtectedRoute>
                  <AssetPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/approvals"
              element={
                <ProtectedRoute>
                  <Approvals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/solution-forum"
              element={
                <ProtectedRoute>
                  <SolutionForum />
                </ProtectedRoute>
              }
            />

<Route
              path="/users-directory"
              element={
                <ProtectedRoute>
                  <UsersDirectory />
                </ProtectedRoute>
              }
            />
            {/* Default route to redirect to login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppRouter;
