import React, { useState, useEffect } from 'react';
import { ReactComponent as SafifyIcon } from '../assets/images/safify_it_icon.svg';
import { FaBars, FaTimes, FaBell, FaQuestionCircle, FaBullhorn } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Notifications from './NotificationsCard';
import TeamsCard from './ActionTeamsCard';
import { Modal, Input } from 'antd';
import axios from 'axios';

const TopNav = ({ teams, fetchTeams }) => {
  const navigate = useNavigate();

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

  const handleAnnouncementSubmit = async () => {
    try {
      setAnnouncementLoading(true);
      const jwtToken = sessionStorage.getItem('jwt');
      await axios.post(
        'http://localhost:3001/admin/dashboard/alertUsers',
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
        <button className="p-2 rounded-full hover:bg-gray-200 transition" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-grow justify-left w-auto gap-6 font-semibold text-gray-700">
        <span className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded" onClick={() => navigate('/dashboard')}>
          Dashboard
        </span>
        <span className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded" onClick={() => navigate('/assets')}>
          Assets
        </span>
        <div className="relative teams-menu mt-1">
          <span className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded" onClick={toggleTeams}>
            Teams
          </span>
          {showTeams && <TeamsCard teams={teams} />}
        </div>
        <span className="cursor-pointer bg-sky-200 hover:bg-gray-100 px-3 py-1 rounded" onClick={() => navigate('/launch-ticket')}>
          Launch Ticket
        </span>
        <span className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded" onClick={() => navigate('/my-tickets')}>
          My Tickets
        </span>
      </div>

      {/* Right-Side Icons */}
      <div className="hidden md:flex items-center gap-4">
        <span className="relative cursor-pointer hover:bg-gray-200 p-2 rounded-full group" onClick={openAnnouncementModal}>
          <FaBullhorn />
          <span className="absolute top-full right-0 mt-2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
            Announcement
          </span>
        </span>
        <span className="relative cursor-pointer hover:bg-gray-200 p-2 rounded-full group" onClick={() => navigate('/help')}>
          <FaQuestionCircle />
          <span className="absolute top-full right-0 mt-2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
            Help
          </span>
        </span>
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
    </div>
  );
};

export default TopNav;
