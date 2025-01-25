import React, { useState, useEffect } from 'react';
import { ReactComponent as SafifyIcon } from '../assets/images/safify_it_icon.svg';
import { FaBars, FaTimes, FaBell, FaQuestionCircle, FaBullhorn, FaPowerOff } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import Notifications from './NotificationsCard';
import TeamsCard from './ActionTeamsCard';
import { Modal, Input } from 'antd';
import axios from 'axios';
import useLogout from '../services/logout';
import constants from '../const';

const TopNav = ({ teams, fetchTeams }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // State Management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTeams, setShowTeams] = useState(false);

  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementBody, setAnnouncementBody] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [announcementError, setAnnouncementError] = useState(false);
  const [announcementLoading, setAnnouncementLoading] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const toggleProfileCard = () => setShowProfileCard((prev) => !prev);


  const logout = useLogout();

  const handleLogout = async () => {
    setLogoutLoading(true);
    await logout();
    setLogoutLoading(false);
  };


  const onCloseLogoutModal = () => {
    setLogoutLoading(false);
    setShowLogoutConfirm(false);
  };


  // Fetch Teams if not already fetched
  useEffect(() => {
    if (!teams) {
      fetchTeams();
    }
  }, [teams, fetchTeams]);

  // Handle Menu Toggle
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Handle Notifications Toggle
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (showTeams) setShowTeams(false);
  };

  // Handle Teams Dropdown Toggle
  const toggleTeams = () => {
    setShowTeams((prev) => !prev);
    if (showNotifications) setShowNotifications(false);
    if (showProfileCard) setShowProfileCard(false);
  };

  // Announcement Modal Handlers
  const openAnnouncementModal = () => setIsAnnouncementModalOpen(true);
  const closeAnnouncementModal = () => {
    setIsAnnouncementModalOpen(false);
    setAnnouncementTitle('');
    setAnnouncementBody('');
    setAnnouncementMsg('');
    setAnnouncementError(false);
  };

  const isActive = (path) => location.pathname === path;


  const handleAnnouncementSubmit = async () => {
    try {
      setAnnouncementLoading(true);
      const jwtToken = localStorage.getItem('jwt');
      await axios.post(
        `${constants.API.BASE_URL}/admin/dashboard/alertUsers`,
        { messageTitle: announcementTitle, messageBody: announcementBody },
        { headers: { Authorization: `Bearer ${jwtToken}` } }
      );
      setAnnouncementMsg('Announcement sent successfully');
      setTimeout(closeAnnouncementModal, 2000);
    } catch {
      setAnnouncementError('Failed to send message. Please try again.');
    } finally {
      setAnnouncementLoading(false);
    }
  };

  // Close Teams Dropdown on Outside Click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.teams-menu')) setShowTeams(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);



  const user = {
    name: localStorage.getItem('userName'),
    email: localStorage.getItem('userId'),
    role: localStorage.getItem('role')
  };




  return (
    <div className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6 z-50">
      {/* Logo Section */}
      <div className="flex items-center gap-3 w-auto flex-grow cursor-pointer" onClick={() => navigate('/tickets')}>
        <SafifyIcon className="w-8 h-8" />
        <h1 className="hidden lg:block text-md lg:text-lg font-semibold text-gray-900">
          SAFIFY IT Service Management
        </h1>
      </div>

      {/* Hamburger Menu Button */}
      <div className="flex md:hidden">
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-gray-200 transition"
            onClick={toggleProfileCard}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center bg-primary text-white text-md font-medium`}
            >
              {user.role ? (user.role === 'action_team' ? 'T' : user.role.charAt(0).toUpperCase()) : ''}
            </div>
          </button>

          {/* Profile Details Card */}
          {showProfileCard && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
              <h3 className="text-lg font-semibold">{user.email}</h3>
              {/* <p className="text-sm text-gray-600">{user.email}</p> */}
              <p className="text-sm text-gray-600">Role: {user.role}</p>
              <button
                onClick={() => {
                  setShowLogoutConfirm(true);
                }}
                className="mt-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded hover:text-red-500 transition"
              >
                <span className="flex gap-2 items-center justify-center">
                  <FaPowerOff />
                  <p>Logout</p>
                </span>

              </button>
            </div>
          )}
        </div>

        <button className="p-2 rounded-full hover:bg-gray-200 transition" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-grow justify-left w-auto gap-6 font-semibold text-gray-700">
        <span
          className={`cursor-pointer px-3 py-1 rounded ${isActive('/dashboard') ? 'text-primary' : 'hover:bg-gray-100'
            }`} onClick={() => navigate('/dashboard')}>
          Dashboard
        </span>
        <span
          className={`cursor-pointer px-3 py-1 rounded ${isActive('/assets') ? 'text-primary' : 'hover:bg-gray-100'
            }`}
          onClick={() => navigate('/assets')}>
          Assets
        </span>
        <div className="relative teams-menu mt-1">
          <span
            className={`cursor-pointer px-3 py-1 rounded hover:bg-gray-100
              `} onClick={toggleTeams}>
            Teams
          </span>
          {showTeams && <TeamsCard teams={teams} />}
        </div>
        <span
          className={`cursor-pointer px-3 py-1 rounded ${isActive('/my-tickets') ? 'text-primary' : 'hover:bg-gray-100'}`}
          onClick={() => navigate('/my-tickets')}>
          My Tickets
        </span>
        <span className="flex items-center gap-2 px-3 cursor-pointer py-1 bg-primary text-white font-semibold rounded-lg shadow hover:bg-sky-600 transition-transform transform hover:scale-105" onClick={() => navigate('/launch-ticket')}>
          Launch Ticket
        </span>
      </div>

      {/* Right-Side Icons */}
      <div className="hidden md:flex items-center gap-4">
        <span
          className="relative cursor-pointer hover:bg-gray-200 p-2 rounded-full group"
          onClick={openAnnouncementModal}
        >
          <FaBullhorn />
          <span className="absolute top-full right-0 mt-2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
            Announcement
          </span>
        </span>
        <span
          className="relative cursor-pointer hover:bg-gray-200 p-2 rounded-full group"
          onClick={() => navigate('/help')}
        >
          <FaQuestionCircle />
          <span className="absolute top-full right-0 mt-2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
            Help
          </span>
        </span>
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-gray-200 transition"
            onClick={toggleProfileCard}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center bg-primary text-white text-md font-medium`}
            >
              {user.role ? (user.role === 'action_team' ? 'T' : user.role.charAt(0).toUpperCase()) : ''}
            </div>
          </button>

          {/* Profile Details Card */}
          {showProfileCard && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
              <h3 className="text-lg font-semibold">{user.email}</h3>
              {/* <p className="text-sm text-gray-600">{user.email}</p> */}
              <p className="text-sm text-gray-600">Role: {user.role}</p>
              <button
                onClick={() => {
                  setShowLogoutConfirm(true);
                }}
                className="mt-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded hover:text-red-500 transition"
              >
                <span className="flex gap-2 items-center justify-center">
                  <FaPowerOff />
                  <p>Logout</p>
                </span>

              </button>
            </div>
          )}
        </div>
      </div>

      {/* Announcement Modal */}
      {isAnnouncementModalOpen && (
        <Modal
          title="Make an Announcement"
          visible={isAnnouncementModalOpen}
          onCancel={closeAnnouncementModal}
          onOk={handleAnnouncementSubmit}
          confirmLoading={announcementLoading}
        >
          <Input placeholder="Title" value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} />
          <Input.TextArea
            placeholder="Body"
            value={announcementBody}
            onChange={(e) => setAnnouncementBody(e.target.value)}
            rows={4}
            className="mt-2"
          />
          {announcementMsg && <p className="mt-2 text-emerald-600">{announcementMsg}</p>}
          {announcementError && <p className="mt-2 text-red-600">{announcementError}</p>}
        </Modal>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            {logoutLoading && (
              <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => onCloseLogoutModal()}
                className="px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-sky-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded hover:text-red-500 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}



      {isMenuOpen && (
        <div className="fixed top-0 right-0 h-[70vh] w-64 bg-white shadow-lg z-50 flex flex-col p-4 overflow-auto">
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
              className={`cursor-pointer px-3 py-1 rounded ${isActive('/dashboard') ? 'text-primary' : 'hover:bg-gray-100'
                }`}

              onClick={() => {
                navigate('/dashboard');
                toggleMenu();
              }}
            >
              Dashboard
            </span>
            <span
              className={`cursor-pointer px-3 py-1 rounded ${isActive('/assets') ? 'text-primary' : 'hover:bg-gray-100'
                }`}
              onClick={() => {
                navigate('/assets');
                toggleMenu();
              }}
            >
              Assets
            </span>


            <span
              className={`cursor-pointer px-3 py-1 rounded ${isActive('/launch-ticket') ? 'text-primary' : 'hover:bg-gray-100'
                }`}
              onClick={() => {
                navigate('/launch-ticket');
                toggleMenu();
              }}
            >
              Launch Ticket
            </span>

            <span
              className={`cursor-pointer px-3 py-1 rounded ${isActive('/my-tickets') ? 'text-primary' : 'hover:bg-gray-100'
                }`}
              onClick={() => {
                navigate('/my-tickets');
                toggleMenu();
              }}
            >
              My Tickets
            </span>

          </nav>


          <div className="mt-auto flex flex-col gap-4">

            {/* <button
              onClick={() => navigate('/help')}
              className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded mb-4">
              <FaQuestionCircle />
              <span>Help</span>
            </button> */}
            <button
              onClick={() => {
                toggleMenu();
                setShowLogoutConfirm(true);
              }}
              className="flex font-semibold items-center gap-2 hover:bg-red-200 p-2 rounded mb-4"
            >
              <FaPowerOff className='text-red-500' />
              <span>Logout</span>
            </button>


          </div>
        </div>
      )}
    </div>
  );
};

export default TopNav;



