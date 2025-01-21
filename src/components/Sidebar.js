import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FaChevronLeft,
  FaBars, // Import FaBars for the hamburger icon
  FaBookOpen,
  FaChartBar,
  FaUsers,
  FaMapMarkerAlt,
  FaBox,
  FaCheckCircle,
  FaPowerOff,
  FaSign,
  FaTicketAlt,
  FaNetworkWired,
  FaEyeSlash,
  FaEye,
} from 'react-icons/fa';
import { ReactComponent as SafifyIcon } from '../assets/images/safify_it_icon.svg';
import useLogout from '../services/logout';
import { Tooltip } from 'antd'; // ✅ Import Tooltip from antd

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false); // State to control sidebar visibility
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const logout = useLogout();

  const handleLogout = async () => {
    setLogoutLoading(true);
    await logout();
    setLogoutLoading(false);
  };

  const onCloseLogoutModal = async () => {
    setLogoutLoading(false);
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {/* Hamburger menu for mobile screens */}
      <div className="fixed top-20 left-3 z-50 md:hidden">
        <button
          className="text-gray-700 bg-white p-2 rounded shadow-lg"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-12 left-0 h-[calc(93vh)] bg-white border-r shadow-sm z-40 transition-transform duration-300 flex flex-col ${showSidebar ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        <div className="flex items-center justify-between px-3 mb-2 mt-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
            <SafifyIcon className={`w-6 h-6 ${isCollapsed && 'hidden'}`} />
            {!isCollapsed && <h2 className="text-black text-lg font-semibold">SAFIFY IT</h2>}
          </div>
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer mt-2"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <FaChevronLeft
              className={`text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''} hidden sm:block`}
            />
          </div>
        </div>

        <div className="border-b border-gray-200 my-3"></div>

        <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-auto">
          <SidebarSection
            isCollapsed={isCollapsed}
            title="Tickets"
            links={[
              { to: '/tickets', icon: FaTicketAlt, label: 'Open Tickets' },
              { to: '/tickets-closed', icon: FaTicketAlt, label: 'Closed Tickets' },
            ]}
          />
          <div className="border-t border-gray-200 my-1"></div>

          <SidebarSection
            isCollapsed={isCollapsed}
            title="Approvals"
            links={[
              { to: '/approvals', icon: FaSign, label: 'Pending Approvals' },
              { to: '/approved-reports', icon: FaCheckCircle, label: 'Approved Tasks' },
            ]}
          />
          <div className="border-t border-gray-200 my-1"></div>

          <SidebarSection
            isCollapsed={isCollapsed}
            title="Knowledge Base"
            links={[
              { to: '/solution-forum', icon: FaBookOpen, label: 'Solution Forum' },
              { to: '/dashboard', icon: FaChartBar, label: 'Dashboard' },
            ]}
          />
          <div className="border-t border-gray-200 my-1"></div>

          <SidebarSection
            isCollapsed={isCollapsed}
            title="Resource Directory"
            links={[
              { to: '/users-directory', icon: FaUsers, label: 'Users' },
              { to: '/locations-directory', icon: FaMapMarkerAlt, label: 'Locations' },
              { to: '/assets', icon: FaBox, label: 'Assets' },
            ]}
          />
          <div className="border-t border-gray-200 my-1"></div>

          <SidebarSection
            isCollapsed={isCollapsed}
            title="Network Discovery"
            links={[{ to: '/scan-network', icon: FaNetworkWired, label: 'Scan Network' }]}
          />
          <div className="border-t border-gray-200 my-1"></div>
        </div>

        <div className="w-full px-3">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 text-red-600 p-2 rounded hover:text-gray-700 transition-all"
          >
            <FaPowerOff />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            {logoutLoading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => onCloseLogoutModal()}
                className="px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-sky-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-red-200 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SidebarSection = ({ title, links, isCollapsed }) => {
  const location = useLocation();

  return (
    <div className="px-3">
      {!isCollapsed && <h3 className="text-gray-600 font-semibold mb-2">{title}</h3>}
      <div className="space-y-2">
        {links.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          const activeClass = isActive ? 'text-primary' : 'text-gray-700';

          return (
            <Tooltip key={to} title={label} placement="right" visible={isCollapsed ? undefined : false}>
              <NavLink
                to={to}
                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-200 transition-all ${isActive ? 'bg-blue-500 text-white' : ''
                  }`}
              >
                <Icon className={`text-lg ${activeClass}`} />
                {!isCollapsed && <span className={`${activeClass}`}>{label}</span>}
              </NavLink>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
