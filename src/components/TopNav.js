import React from 'react';
import { ReactComponent as SafifyIcon } from '../assets/images/safify_it_icon.svg';
import Button from '../components/Button';

const TopNav = () => {
  return (
    <div className="fixed top-0 left-0 w-full bg-white border-b border-grey h-16 flex items-center px-4 md:px-6 z-50">
      {/* Left Section: Logo and Title */}
      <div className="flex items-center gap-3 flex-grow min-w-0">
        <SafifyIcon className="w-8 h-8" />
        <h1 className="text-lg md:text-xl font-semibold text-gray-900 whitespace-nowrap overflow-hidden overflow-ellipsis">
          SAFIFY IT Service Management
        </h1>
      </div>

      {/* Center Section: Menu Items */}
      <div className="hidden md:flex flex-grow justify-center gap-6 font-semibold text-gray-700 text-base">
        <span className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded">Dashboard</span>
        <span className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded">Teams</span>
        <span className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded">Assets</span>
        <Button onClick={() => alert('Report')} className="">Report</Button>

      </div>

      {/* Right Section: Actions and User Profiles */}
      <div className="flex items-center gap-4">
        {/* Create Button */}
        <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition hidden sm:block">
          Create
        </button>

        {/* Responsive Search Bar */}
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 px-3 py-1 rounded text-sm focus:outline-none hidden md:block"
          style={{ minWidth: '150px', maxWidth: '200px' }}
        />

        {/* Icons with Tooltips */}
        <div className="flex gap-3 text-gray-600 text-lg">
          <span
            className="cursor-pointer hover:text-black relative"
            title="Notifications"
          >
            🔔
          </span>
          <span
            className="cursor-pointer hover:text-black relative"
            title="Help"
          >
            ❓
          </span>
          <span
            className="cursor-pointer hover:text-black relative"
            title="Settings"
          >
            ⚙️
          </span>
        </div>

        {/* User Profiles */}
        <div className="bg-green-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">
          FE
        </div>

        {/* Additional User Icon */}
        <div className="bg-green-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">
          F
        </div>
      </div>
    </div>
  );
};

export default TopNav;
