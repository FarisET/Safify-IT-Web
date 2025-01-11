import React, { useState, useEffect } from 'react';
import { ReactComponent as SafifyIcon } from '../assets/images/safify_it_icon.svg';
import { FaBars, FaTimes, FaBell, FaQuestionCircle, FaCog, FaBullhorn } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Notifications from './NotificationsCard';
import TeamsCard from './ActionTeamsCard';
import { Modal, Input } from 'antd';
import axios from 'axios';


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

  //Announcement
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementBody, setAnnouncementBody] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [announcementError, setAnnouncementError] = useState(false);
  const [announcementLoading, setAnnouncementLoading] = useState(false);




  const handleOpenAnnouncementModal = () => {
    setIsAnnouncementModalOpen(true);
  };

  const handleCloseAnnouncementModal = () => {
    setIsAnnouncementModalOpen(false);
    setAnnouncementTitle('');
    setAnnouncementBody('');
    setAnnouncementError('');
    setAnnouncementMsg('');
  };

  const handleAnnouncementSubmit = async () => {
    try {
      setAnnouncementLoading(true);
      const jwtToken = sessionStorage.getItem('jwt');

      const response = await axios.post('http://localhost:3001/admin/dashboard/alertUsers',
        {
          messageTitle: announcementTitle,
          messageBody: announcementBody
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setAnnouncementMsg('Announcement sent successfully')

      setTimeout(() => {
        handleCloseAnnouncementModal();
      }, 2000);

    } catch (error) {
      setAnnouncementError('Failed to send message. Please try again');
      setAnnouncementTitle('');
      setAnnouncementBody('');

    } finally {
      setAnnouncementLoading(false); // Hide loading indicator
    }

  };


  return (
    <div className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6 z-50">
      {/* Logo Section */}
      <div
        className="flex items-center gap-3 w-[38.2%] flex-grow cursor-pointer"
        onClick={() => navigate('/tickets')}
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
        {/* <span
          className="relative cursor-pointer hover:bg-gray-200 p-2 rounded-full transition"
          onClick={toggleNotifications}
        >
          <FaBell />
          {showNotifications && (
            <div className="absolute right-0 mt-2">
              <Notifications />
            </div>
          )}
        </span> */}
        <span
          className="relative cursor-pointer hover:bg-gray-200 p-2 rounded-full group"
          onClick={() => navigate('/help')}
        >
          <FaQuestionCircle />
          <span className="absolute top-full right-0 mt-2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
            Help
          </span>
        </span>

        <span
          className="relative cursor-pointer hover:bg-gray-200 p-2 rounded-full group"
          onClick={handleOpenAnnouncementModal}
        >
          <FaBullhorn />
          <span className="absolute top-full right-0 mt-2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
            Announcement
          </span>
        </span>



      </div>

      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-lg font-semibold mb-4">Make an Announcement</h2>

            {announcementLoading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
            {announcementMsg && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{announcementMsg}</p>}
            {announcementError && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{announcementError}</p>}

            <Input
              placeholder="Title"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              className="mb-4"
            />
            <Input.TextArea
              placeholder="Body"
              value={announcementBody}
              onChange={(e) => setAnnouncementBody(e.target.value)}
              rows={4}
            />

            <div className="mt-4 flex justify-end space-x-2">

              <button
                disabled={announcementLoading}
                className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                type="button" onClick={handleCloseAnnouncementModal}>
                Cancel
              </button>
              <button
                disabled={announcementLoading}
                className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
                type="submit" onClick={handleAnnouncementSubmit}>
                Submit
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

          </nav>

          <div className="mt-auto flex flex-col gap-4">
            {/* <button
              className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded"
              onClick={toggleNotifications}
            >
              <FaBell />
              <span>Notifications</span>
            </button> */}
            <button
              onClick={handleOpenAnnouncementModal}
              className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded">
              <FaBullhorn />
              <span>Announcement</span>
            </button>

            <button
              onClick={() => navigate('/help')}
              className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded mb-4">
              <FaQuestionCircle />
              <span>Help</span>
            </button>
            {/* <button className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded">
              <FaCog />
              <span>Settings</span>
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNav;
