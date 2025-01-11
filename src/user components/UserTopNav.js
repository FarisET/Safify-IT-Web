import React, { useState, useEffect } from 'react';
import { ReactComponent as SafifyIcon } from '../assets/images/safify_it_icon.svg';
import { FaBars, FaTimes, FaBell, FaQuestionCircle, FaCog, FaBullhorn, FaPowerOff } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useLogout from '../services/logout';



const UserTopNav = ({ children }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Use the custom hook inside the component
  const logout = useLogout();

  const handleLogout = async () => {
    setLogoutLoading(true);
    await logout();
    setLogoutLoading(false);
  };

  const onCloseLogoutModal = async () => {
    setLogoutLoading(false);
    setShowLogoutConfirm(false)
  };


  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6 z-50">
        {/* Logo Section */}
        <div
          className="flex items-center gap-3 w-auto flex-grow cursor-pointer"
          onClick={() => navigate('/user-portal')}
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
            onClick={() => navigate('/user-portal')}
          >
            My Tickets
          </span>

          <span
            className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded"
            onClick={() => navigate('/launch-ticket')}
          >
            Launch Ticket
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4 w-[38.2%] justify-end">

          <span
            onClick={() => setShowLogoutConfirm(true)}
            className="relative cursor-pointer hover:text-red-500 rounded-full group"
          >
            <FaPowerOff />
            <span className="absolute top-full right-0 mt-2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
              Logout</span>
          </span>
        </div>

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
                  className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:text-red-500 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}



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
                  navigate('/user-portal');
                  toggleMenu();
                }}
              >
                My Tickets
              </span>
              <span
                className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded"
                onClick={() => {
                  navigate('/launch-ticket');
                  toggleMenu();
                }}
              >
                Launch Ticket
              </span>
            </nav>

            <div className="mt-auto flex flex-col gap-4">
              <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex font-semibold items-center gap-2 hover:bg-red-200 p-2 rounded mb-4"
              >
                <FaPowerOff className='text-red-500' />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Render the children */}
      <div className="mt-16">{children}</div>
    </>
  );
};

export default UserTopNav;
