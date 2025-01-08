import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import LoginPage from './pages/Admin/login';
import Incidents from './pages/Admin/Incidents';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import TopNavWrapper from './components/TopNavWrapper';
import AssetPage from './pages/Admin/Assets';
import Approvals from './pages/Admin/Approvals';
import SolutionForum from './pages/Admin/SolutionForum';
import UsersDirectory from './pages/Admin/UserDirectory';
import LocationsDirectory from './pages/Admin/LocationsDirectory';
import Help from './pages/Admin/Help';
import useTokenMonitor from './hooks/useTokenMoniter';
import { useNavigate } from 'react-router-dom';
import useLogout from './services/logout';
import Modal from './components/SessionModal';
import { useState } from 'react';
import Dashboard from './pages/Admin/Dashboard';
import NotFound from './pages/shared/NotFound';
import IncidentsCompleted from './pages/Admin/IncidentsCompleted';
import ApprovedReports from './pages/Admin/ApprovedReports';

const AppLayout = () => {
  const location = useLocation(); // Hook called within a Router context
  const isLoginScreen = location.pathname === "/login";
  const isNotFoundPage = location.pathname === "/404";
  const navigate = useNavigate();
  const logout = useLogout(); // Call the hook, do not invoke it
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { showModal, setShowModal } = useTokenMonitor(logout);

  const handleModalClose = async () => {
    setLogoutLoading(true);
    await logout(); // Logout handles navigation to /login
    setLogoutLoading(false);
    setShowModal(false);
  };




  return (

    <div className="flex h-screen">
      {showModal && (
        <Modal
          message="Your session has expired."
          onClose={handleModalClose}
          loading={logoutLoading}
        />
      )}
      {/* Conditionally render Sidebar and TopNavWrapper */}
      {!isLoginScreen && !isNotFoundPage && <Sidebar />}
      {!isLoginScreen && !isNotFoundPage && <TopNavWrapper />}

      {/* Page Content */}
      <div className={`flex-1 ${isLoginScreen || isNotFoundPage ? "" : "mt-12 p-4 ml-12"}`}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/login" />
              </ProtectedRoute>
            }
          />
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
            path="/incidents-completed"
            element={
              <ProtectedRoute>
                <IncidentsCompleted />
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
            path="/approved-reports"
            element={
              <ProtectedRoute>
                <ApprovedReports />
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

          <Route
            path="/locations-directory"
            element={
              <ProtectedRoute>
                <LocationsDirectory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Default route to redirect to 404 */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
      </div>
    </div>
  );
};

const AppRouter = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default AppRouter;
