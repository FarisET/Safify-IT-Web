import React, { useState, useEffect } from 'react';
import { ReactComponent as SafifyIcon } from '../assets/images/safify_it_icon.svg';
import { FaBars, FaTimes, FaBell, FaQuestionCircle, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Notifications from '../components/NotificationsCard';
import TeamsCard from '../components/ActionTeamsCard';

const TopNav = ({ teams, fetchTeams }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!teams) {
      fetchTeams();
    }
  }, [teams, fetchTeams]);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (showTeams) setShowTeams(false);
  };

  const toggleTeams = () => {
    setShowTeams((prev) => !prev);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6 z-50">
      {/* Logo Section */}
      <div
        className="flex items-center gap-3 w-[38.2%] flex-grow cursor-pointer"
        onClick={() => navigate('/incidents')}
      >
        <SafifyIcon className="w-8 h-8" />
        <h1 className="hidden lg:block text-md lg:text-lg font-semibold text-gray-900">
          SAFIFY IT Service Management
        </h1>
      </div>

      {/* Hamburger Menu Button */}
      <div className="flex md:hidden">
        <button
          className="p-2 rounded-full hover:bg-gray-200 transition"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Center Menu and Right Section for Large Screens */}
      <div className="hidden md:flex flex-grow justify-center w-[23.6%] gap-6 font-semibold text-gray-700 relative">
        <span
          className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded"
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </span>
        <span
          className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded"
          onClick={() => navigate('/assets')}
        >
          Assets
        </span>
        <span
          className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded"
          onClick={toggleTeams}
        >
          Teams
        </span>
        {showTeams && (
          <div className="absolute top-full mt-1 right-0 w-72 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
            <TeamsCard teams={teams} />
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center gap-4 w-[38.2%] justify-end">
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
        <span className="cursor-pointer hover:bg-gray-200 p-2 rounded-full">
          <FaQuestionCircle />
        </span>
        <span className="cursor-pointer hover:bg-gray-200 p-2 rounded-full">
          <FaCog />
        </span>
        <div className="bg-green-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">
          FE
        </div>
        <div className="bg-green-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">
          F
        </div>
      </div>

      {/* Hamburger Menu for Small Screens */}
      {isMenuOpen && (
        <div className="fixed top-0 right-0 h-screen w-64 bg-white shadow-lg z-50 flex flex-col p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              className="p-2 rounded-full hover:bg-gray-200 transition"
              onClick={toggleMenu}
            >
              <FaTimes size={20} />
            </button>
          </div>
          <nav className="flex flex-col gap-4 font-semibold text-gray-700">
            <span
              className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded"
              onClick={() => {
                navigate('/dashboard');
                toggleMenu();
              }}
            >
              Dashboard
            </span>
            <span
              className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded"
              onClick={() => {
                navigate('/assets');
                toggleMenu();
              }}
            >
              Assets
            </span>
            <span
              className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded"
              onClick={() => {
                toggleTeams();
                toggleMenu();
              }}
            >
              Teams
            </span>
          </nav>
          <div className="mt-auto flex flex-col gap-4">
            <button
              className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded"
              onClick={toggleNotifications}
            >
              <FaBell />
              <span>Notifications</span>
            </button>
            <button className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded">
              <FaQuestionCircle />
              <span>Help</span>
            </button>
            <button className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded">
              <FaCog />
              <span>Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNav;
