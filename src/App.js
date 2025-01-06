import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import LoginPage from './pages/login';
import Incidents from './pages/Incidents';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import TopNavWrapper from './components/TopNavWrapper';
import AssetPage from './pages/Assets';
import Approvals from './pages/Approvals';
import SolutionForum from './pages/SolutionForum';
import UsersDirectory from './pages/UserDirectory';
import LocationsDirectory from './pages/LocationsDirectory';
import Help from './pages/Admin/Help';

const AppLayout = () => {

  const location = useLocation(); // Hook called within a Router context
  const isLoginScreen = location.pathname === "/login";
  


  return (
    <div className="flex h-screen">
      {/* Conditionally render Sidebar and TopNavWrapper */}
      {!isLoginScreen && <Sidebar />}
      {!isLoginScreen && <TopNavWrapper />}

      {/* Page Content */}
      <div className={`flex-1 ${isLoginScreen ? "" : "mt-12 p-4 ml-12"}`}>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
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
          {/* Default route to redirect to login */}
          <Route path="*" element={<Navigate to="/login" />} />
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
