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
import BulkUpload from './pages/Admin/BulkUpload';
import UserPortal from './pages/User/UserPortal';
import UserTopNav from './user components/UserTopNav';
import NotAuthorized from './pages/shared/NotAuthorized'
import TicketForm from './pages/shared/TicketForm';


const AppLayout = () => {
  const location = useLocation(); // Hook called within a Router context
  const isLoginScreen = location.pathname === "/login";
  const isNotFoundPage = location.pathname === "/404";
  const isNotUserPortal = location.pathname === "/user-portal";
  const isNotAction = location.pathname === "/action-team-portal";
  const isNotTicketForm = location.pathname === "/launch-ticket";
  const isNotUnAuthorized = location.pathname === "/not-authorized";

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
      {(showModal && !isLoginScreen) && (
        <Modal
          message="Your session has expired."
          onClose={handleModalClose}
          loading={logoutLoading}
        />
      )}
      {/* Conditionally render Sidebar and TopNavWrapper */}
      {!isLoginScreen && !isNotFoundPage && !isNotUserPortal && !isNotTicketForm && !isNotUnAuthorized &&<Sidebar />}
      {!isLoginScreen && !isNotFoundPage && !isNotUserPortal && !isNotTicketForm && !isNotUnAuthorized && <TopNavWrapper />}

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
            path="/tickets"
            element={
              <ProtectedRoute requiredRole="admin">
                <Incidents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets-closed"
            element={
              <ProtectedRoute requiredRole="admin">
                <IncidentsCompleted />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets"
            element={
              <ProtectedRoute requiredRole="admin">
                <AssetPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approvals"
            element={
              <ProtectedRoute requiredRole="admin">
                <Approvals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approved-reports"
            element={
              <ProtectedRoute requiredRole="admin">
                <ApprovedReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/solution-forum"
            element={
              <ProtectedRoute requiredRole="admin">
                <SolutionForum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users-directory"
            element={
              <ProtectedRoute requiredRole="admin">
                <UsersDirectory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/locations-directory"
            element={
              <ProtectedRoute requiredRole="admin">
                <LocationsDirectory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/help"
            element={
              <ProtectedRoute requiredRole="admin">
                <Help />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bulk-upload-assets"
            element={
              <ProtectedRoute requiredRole="admin">
                <BulkUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-portal"
            element={
              <ProtectedRoute requiredRole="user">
                <UserTopNav>
                  <UserPortal />
                </UserTopNav>
              </ProtectedRoute>
            }
          />
          <Route
            path="/launch-ticket"
            element={
              <ProtectedRoute allowAll>
                <UserTopNav >
                  <TicketForm />
                </UserTopNav>
              </ProtectedRoute>
            }
          />

          <Route path="/not-authorized" element={<NotAuthorized />} />

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
