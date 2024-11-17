import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login';
import Incidents from './pages/Incidents';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import AssetPage from './pages/Assets';


const AppRouter = () => {
  return (
    <Router>
      <Sidebar />
      <TopNav />
      <div className="ml-64 mt-12 p-4">
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

          {/* Optionally, add a default route to redirect to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
