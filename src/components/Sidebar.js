import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaClipboardList,
  FaCalendarAlt,
  FaBell,
  FaChevronLeft,
  FaBookOpen,
  FaChartBar,
  FaUsers,
  FaMapMarkerAlt,
  FaBox,
} from 'react-icons/fa';
import { ReactComponent as SafifyIcon } from '../assets/images/safify_it_icon.svg';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`fixed top-12 left-0 h-[calc(100vh-3rem)] bg-white border-r shadow-sm transition-width duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
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
            className={`text-gray-600 transition-transform ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-2"></div>

      {/* Sections */}
      <SidebarSection
        isCollapsed={isCollapsed}
        title="Incidents"
        links={[
          { to: '/open-incidents', icon: FaClipboardList, label: 'Open Incidents' },
          { to: '/my-incidents', icon: FaBell, label: 'My Incidents' },
          { to: '/major-incidents', icon: FaCalendarAlt, label: 'Major Incidents' },
          {
            to: '/resolved-incidents',
            icon: FaClipboardList,
            label: 'Resolved Incidents (last 30)',
          },
        ]}
      />

      <div className="border-t border-gray-200 my-2"></div>

      <SidebarSection
        isCollapsed={isCollapsed}
        title="Knowledge Base"
        links={[
          { to: '/solution-forum', icon: FaBookOpen, label: 'Solution Forum' },
          { to: '/reports', icon: FaChartBar, label: 'Reports' },
        ]}
      />

      <div className="border-t border-gray-200 my-2"></div>

      <SidebarSection
        isCollapsed={isCollapsed}
        title="Resource Directory"
        links={[
          { to: '/users', icon: FaUsers, label: 'Users' },
          { to: '/locations', icon: FaMapMarkerAlt, label: 'Locations' },
          { to: '/assets', icon: FaBox, label: 'Assets' },
        ]}
      />
    </div>
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
