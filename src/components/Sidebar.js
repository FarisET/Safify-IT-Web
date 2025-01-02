import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaChevronLeft,
  FaBookOpen,
  FaChartBar,
  FaUsers,
  FaMapMarkerAlt,
  FaBox,
  FaCheckCircle,
  FaPowerOff,
  FaSign,

  FaTicketAlt,
} from 'react-icons/fa';
import { ReactComponent as SafifyIcon } from '../assets/images/safify_it_icon.svg';
import useLogout from '../services/logout';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Default state is now collapsed
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Use the custom hook inside the component
  const logout = useLogout();

  const handleLogout = async () => {
    await logout(); // Call the logout function from the custom hook
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-12 left-0 h-[calc(100vh-3rem)] bg-white border-r shadow-sm z-40 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'
          }`}
      >
        {/* Header with logo and toggle button */}
        <div className="flex items-center justify-between px-3 mb-2 mt-6">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <SafifyIcon className={`w-6 h-6 ${isCollapsed && 'hidden'}`} />
            {!isCollapsed && (
              <h2 className="text-black text-lg font-semibold">SAFIFY IT</h2>
            )}
          </div>
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer mt-2"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <FaChevronLeft
              className={`text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''
                }`}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-1"></div>

        {/* Sections */}
        <SidebarSection
          isCollapsed={isCollapsed}
          title="Tickets"
          links={[
            { to: '/incidents', icon: FaTicketAlt, label: 'Open Tickets' },
            { to: '/incidents', icon: FaTicketAlt, label: 'Critical Tickets' },
          ]}
        />
        <div className="border-t border-gray-200 my-1"></div>


        <SidebarSection
          isCollapsed={isCollapsed}
          title="Approvals"
          links={[
            { to: '/approvals', icon: FaSign, label: 'Pending Approvals' },
            {
              to: '/approvals',
              icon: FaCheckCircle,
              label: 'Approved Reports (last 30)',
            },
          ]}
        />

        <div className="border-t border-gray-200 my-1"></div>

        <SidebarSection
          isCollapsed={isCollapsed}
          title="Knowledge Base"
          links={[
            { to: '/solution-forum', icon: FaBookOpen, label: 'Solution Forum' },
            { to: '/reports', icon: FaChartBar, label: 'Reports' },
          ]}
        />

        <div className="border-t border-gray-200 my-1"></div>

        <SidebarSection
          isCollapsed={isCollapsed}
          title="Resource Directory"
          links={[
            { to: '/users-directory', icon: FaUsers, label: 'Users' },
            { to: '/locations', icon: FaMapMarkerAlt, label: 'Locations' },
            { to: '/assets', icon: FaBox, label: 'Assets' },
          ]}
        />
        <div className="border-t border-gray-200 my-1"></div>


        {/* Logout Button */}
        <div className="fixed bottom-2 px-3"> {/* Add bottom margin */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 text-red-600 p-2 rounded hover:text-gray-700 transition-all"
          >
            <FaPowerOff />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>



      </div>
      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-sky-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
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
const SidebarSection = ({ title, links, isCollapsed }) => (
  <div className="px-3">
    {!isCollapsed && <h3 className="text-gray-600 font-semibold mb-2">{title}</h3>}
    <div className="space-y-2">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className="flex items-center gap-2 text-gray-700 p-2 rounded hover:bg-gray-200 transition-all relative group"
          activeClassName="bg-blue-500 text-white"
        >
          <Icon className="text-lg" />
          {!isCollapsed && <span>{label}</span>}
          {isCollapsed && (
            <span className="absolute left-full ml-2 hidden group-hover:block bg-black text-white text-sm rounded py-1 px-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {label}
            </span>
          )}
        </NavLink>
      ))}
    </div>
  </div>
);

export default Sidebar;
