import React, { useState } from 'react';
import { ReactComponent as SafifyIcon } from '../assets/images/safify_it_icon.svg';
import Button from '../components/Button';
import { FaBell, FaQuestionCircle, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Notifications from '../components/NotificationsCard';
import TeamsCard from '../components/ActionTeamsCard';

const TopNav = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTeams, setShowTeams] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowTeams(false); // Hide Teams if Notifications are open
  };

  const toggleTeams = () => {
    setShowTeams(!showTeams);
    setShowNotifications(false); // Hide Notifications if Teams are open
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6 z-50">
      {/* Left Section: Logo and Title */}
      <div
        className="flex items-center gap-3 flex-grow cursor-pointer"
        onClick={() => navigate('/incidents')}
      >
        <SafifyIcon className="w-8 h-8" />
        <h1 className="text-lg md:text-xl font-semibold text-gray-900">
          SAFIFY IT Service Management
        </h1>
      </div>

      {/* Center Section: Menu Items */}
      <div className="hidden md:flex flex-grow justify-center gap-6 font-semibold text-gray-700 relative">
        {/* Dashboard Menu Item */}
        <span className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded">Dashboard</span>

        {/* Assets Menu Item */}
        <span className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded">Assets</span>

        {/* Teams Menu Item with Dropdown */}
        <span
          className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded"
          onClick={toggleTeams}
        >
          Teams
        </span>

        {/* Dropdown Card for Teams */}
        {showTeams && (
          <div className="absolute top-full mt-1 right-0 w-72 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
            <TeamsCard />
          </div>
        )}
      </div>


      {/* Right Section: Icons and Profile */}
      <div className="flex items-center gap-4 relative">
        {/* Notifications Icon */}
        <span
          className="relative cursor-pointer hover:bg-gray-200 p-2 rounded-full transition"
          onClick={toggleNotifications}
        >
          <FaBell />
          {showNotifications && (
            <div className="absolute right-0 mt-2">
              <Notifications />
            </div>
          )}
        </span>

        {/* Help and Settings Icons */}
        <span className="cursor-pointer hover:bg-gray-200 p-2 rounded-full">
          <FaQuestionCircle />
        </span>
        <span className="cursor-pointer hover:bg-gray-200 p-2 rounded-full">
          <FaCog />
        </span>

        {/* User Profile Icons */}
        <div className="bg-green-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">
          FE
        </div>
        <div className="bg-green-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">
          F
        </div>
      </div>
    </div>
  );
};

export default TopNav;
