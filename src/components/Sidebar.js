import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaClipboardList, FaCalendarAlt, FaBell, FaAngleDown, FaChevronLeft } from 'react-icons/fa';
import { ReactComponent as SafifyIcon } from '../assets/images/safify_it_icon.svg';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  
  // Assuming we have 4 filters as shown in the Queues example
  const filterCount = 4;

  return (
    <div
      className={`p-2 fixed top-12 left-0 h-[calc(100vh-3rem)] bg-white border-r border-grey transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } pt-4`}
    >
      {/* Header with logo and toggle button */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
          <SafifyIcon className={`w-6 h-6 ${isCollapsed && 'hidden'}`} />
          {!isCollapsed && <h2 className="text-black text-lg font-semibold">SAFIFY IT</h2>}
        </div>
        <div
          className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <FaChevronLeft className={`text-gray-600 transition-transform ${isCollapsed && 'rotate-180'}`} />
        </div>
      </div>
      <div className="border-t-2 border-grey-600"></div>

      {/* Incidents Heading */}
      {!isCollapsed && (
        <div className="px-4">
          <h3 className="text-gray-600 font-semibold mb-2 mt-2">Incidents</h3>
        </div>
      )}

      {/* Filter Section */}
      <div className="px-3 bg-gray-100">
        <div
          className="flex items-center justify-between text-black font-semibold cursor-pointer hover:bg-lightGrey p-2 rounded"
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className="flex items-center gap-2">
            {!isCollapsed && <span>Filters</span>}
            <FaAngleDown />
            
          </div>

          {!isCollapsed && (
            <span className="text-gray-500">{filterCount} filters</span>
          )}
        </div>
        <div className="border-t border-grey-600"></div>

        {showFilters && (
  <div className="mt-2 space-y-2">
    <NavLink
      to="/open-incidents"
      className="flex items-center justify-between text-gray-700 p-2 rounded"
      activeClassName="bg-primary text-white"
      style={{ transition: 'background-color 0.2s' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E3F2FD')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
    >
      <div className="flex items-center gap-2">
        <FaClipboardList />
        {!isCollapsed && <span>Open Incidents</span>}
      </div>
      {!isCollapsed && <span className="text-gray-500 bg-gray-200 px-2 py-1 rounded-full">0</span>}
    </NavLink>

    <NavLink
      to="/my-incidents"
      className="flex items-center justify-between text-gray-700 p-2 rounded"
      activeClassName="bg-primary text-white"
      style={{ transition: 'background-color 0.3s' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E0F7FA')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
    >
      <div className="flex items-center gap-2">
        <FaBell />
        {!isCollapsed && <span>My Incidents</span>}
      </div>
      {!isCollapsed && <span className="text-gray-500 bg-gray-200 px-2 py-1 rounded-full">0</span>}
    </NavLink>

    <NavLink
      to="/major-incidents"
      className="flex items-center justify-between text-gray-700 p-2 rounded"
      activeClassName="bg-primary text-white"
      style={{ transition: 'background-color 0.3s' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E0F7FA')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
    >
      <div className="flex items-center gap-2">
        <FaCalendarAlt />
        {!isCollapsed && <span>Major Incidents</span>}
      </div>
      {!isCollapsed && <span className="text-gray-500 bg-gray-200 px-2 py-1 rounded-full">0</span>}
    </NavLink>

    <NavLink
      to="/resolved-incidents"
      className="flex items-center justify-between text-gray-700 p-2 rounded"
      activeClassName="bg-primary text-white"
      style={{ transition: 'background-color 0.3s' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E0F7FA')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
    >
      <div className="flex items-center gap-2">
        <FaClipboardList />
        {!isCollapsed && <span>Resolved Incidents (last 30)</span>}
      </div>
      {!isCollapsed && <span className="text-gray-500 bg-gray-200 px-2 py-1 rounded-full">0</span>}
    </NavLink>
  </div>
)}

      </div>
    </div>
  );
};

export default Sidebar;
