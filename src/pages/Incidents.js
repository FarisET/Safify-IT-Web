import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import Report from '../models/UserReport';  // Adjust path as necessary
import { FaSearch, FaLink, FaComment, FaUser, FaExchangeAlt, FaCheck, FaTrash } from 'react-icons/fa';

const Incidents = () => {
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [requestTypeFilter, setRequestTypeFilter] = useState('All');
  const [selectedReports, setSelectedReports] = useState([]); // State to track selected rows
  const [selectedImage, setSelectedImage] = useState(null); // State to handle modal image
  const [actionTeams, setActionTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedCriticality, setSelectedCriticality] = useState('');


  useEffect(() => {
    if (isModalOpen) {
      const fetchActionTeams = async () => {
        setLoadingTeams(true);
        try {
          const jwtToken = sessionStorage.getItem('jwt');
          const response = await axios.get(
            'http://localhost:3001/admin/dashboard/fetchAllActionTeamsWithDepartments?department_id=D1',
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );
          setActionTeams(response.data);
        } catch (error) {
          console.error('Failed to fetch action teams', error);
        } finally {
          setLoadingTeams(false);
        }
      };
      fetchActionTeams();
    }
  }, [isModalOpen]);

  const handleAssignClick = (reportId) => {
    console.log('Assign clicked for report:', reportId); // Debug log
    setSelectedReportId(reportId);
    setIsModalOpen(true);
  };
  

  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        const jwtToken = sessionStorage.getItem('jwt');
        const response = await axios.get(
          'http://localhost:3001/admin/dashboard/fetchAllUserReports',
          {
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
            },
          }
        );
        const reports = response.data.map(reportData => new Report(reportData));
        setUserReports(reports);
      } catch (err) {
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchUserReports();
  }, []);

  const toggleReportSelection = (id) => {
    setSelectedReports((prev) =>
      prev.includes(id) ? prev.filter(reportId => reportId !== id) : [...prev, id]
    );
  };

  const getStatusClass = (status) => {
    const normalizedStatus = status.trim().toLowerCase();
    if (normalizedStatus === 'open') return 'text-red-500';
    if (normalizedStatus === 'in progress') return 'text-yellow-500	';
    if (normalizedStatus === 'completed') return 'text-lime-500';
    return '';
  };


  const filteredReports = userReports
    .filter(report =>
      report.reportDescription && report.reportDescription.toLowerCase().includes(searchTerm.toLowerCase())
      || (report.assetName && report.assetName.toLowerCase().includes(searchTerm.toLowerCase()))
      || (report.status && report.status.toLowerCase().includes(searchTerm.toLowerCase()))
      || (formatDistanceToNow(new Date(report.dateTime), { addSuffix: true }) && formatDistanceToNow(new Date(report.dateTime), { addSuffix: true }).toLowerCase().includes(searchTerm.toLowerCase()))
      || (report.incidentCriticalityLevel && report.incidentCriticalityLevel.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(report => (statusFilter === 'All' || report.status.toLowerCase() === statusFilter.toLowerCase()))

  useEffect(() => {
  }, [searchTerm, statusFilter, requestTypeFilter, userReports]);


  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Incidents</h2>

      <div className="flex items-center justify-between mb-4">
        {/* Search and Filter Section */}
        <input
          type="text"
          placeholder="Search for issues"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-4 py-2 w-1/3"
        />


        <div className="flex space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-4 py-2"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>

          </select>

        </div>
      </div>

      <div className="mb-4 text-gray-700">{filteredReports.length} issue{filteredReports.length !== 1 ? 's' : ''}</div>

      {/* Action Buttons - Shown when any checkbox is selected */}
      {selectedReports.length > 0 && (
        <div className="flex gap-6 items-center p-2 mb-4 rounded">
          <span>{selectedReports.length} selected</span>
          <div className="flex gap-2">


            <button className="flex items-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded">
              <FaUser className="mr-2" />
              Assign
            </button>

            <button className="flex items-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded">
              <FaCheck className="mr-2" />
              Approve
            </button>
            <button className="flex items-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded">
              <FaTrash className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      )}


      {/* Table to display reports */}
      <table className="table-auto w-full border-collapse shadow-lg rounded-md">
        <thead className="bg-blue-600 text-black text-left">
          <tr>
            <th className="px-4 py-2 border-b">
              <input
                type="checkbox"
                onChange={(e) => setSelectedReports(e.target.checked ? filteredReports.map(r => r.userReportId) : [])}
                checked={selectedReports.length === filteredReports.length}
              />
            </th>
            <th className="px-4 py-2 border-b">Asset</th>
            {/* <th className="px-4 py-2 border-b">Asset.No</th> */}
            <th className="px-4 py-2 border-b">Summary</th>
            <th className="px-4 py-2 border-b">Reporter</th>
            <th className="px-4 py-2 border-b">Assignee</th>
            <th className="px-4 py-2 border-b">Location</th>
            <th className="px-4 py-2 border-b">Image</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Created</th>
            {/* <th className="px-4 py-2 border-b">Urgency</th> */}
          </tr>
        </thead>
        <tbody className="text-left">
          {filteredReports.map((report) => (
            <tr key={report.userReportId} className="bg-white hover:bg-gray-100">
              <td className="px-4 py-2 border-b">
                <input
                  type="checkbox"
                  checked={selectedReports.includes(report.userReportId)}
                  onChange={() => toggleReportSelection(report.userReportId)}
                />
              </td>
              <td className="px-4 py-2 border-b">{report.assetName}</td>
              {/* <td className="px-4 py-2 border-b">{report.asset_no}</td> */}
              {/* <td className="px-4 py-2 border-b">IMS-{report.userReportId}</td> */}
              <td className="px-4 py-2 border-b">{report.reportDescription}</td>
              <td className="px-4 py-2 border-b">{report.userId}</td>
              <td className="px-4 py-2 border-b cursor-pointer text-blue-600 hover:underline">
                <div className="flex">
                  <span className="text-gray-700 p-1 mr-2" onClick={() => handleAssignClick(report.userReportId)}>
                    <FaUser />
                  </span>
                  {report.Assignee}
                </div>
              </td>
              <td className="px-4 py-2 border-b">{report.subLocationName}</td>

              <td className="px-4 py-2 border-b text-center">
                {report.image ? (
                  <button
                    className="text-sky-600 hover:text-blue-800 focus:outline-none focus:ring focus:ring-blue-300 transition-all underline"
                    onClick={() => setSelectedImage(report.image)}
                    title="Click to view the image"
                  >
                    Image
                  </button>
                ) : (
                  <span className="text-gray-400 italic">N/A</span>
                )}
              </td>

              <td className="px-4 py-2 border-b whitespace-nowrap">
                <span className={`px-2 py-1 rounded text-sm ${getStatusClass(report.status)}`}>
                  {report.status}
                </span>
              </td>

              <td className="px-4 py-2 border-b">
                {formatDistanceToNow(new Date(report.dateTime), { addSuffix: true })}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)} // Close modal on background click
        >
          <div
            className="fixed w-64 h-70 bg-transparent rounded-lg p-4 relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the card
          >
            <div className="flex items-center justify-center h-full">
              <img src={selectedImage} alt="Report" className="max-w-full max-h-full rounded" />
            </div>
          </div>
        </div>
      )}

{isModalOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    onClick={() => setIsModalOpen(false)} // Close modal on background click
  >
    <div
      className="bg-white rounded-lg shadow-lg w-1/3 p-6"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
    >
      <h3 className="text-xl font-semibold mb-4">Assign Task</h3>

      {/* Action Team Dropdown */}
      {loadingTeams ? (
        <p>Loading teams...</p>
      ) : (
        <div className="mb-4">
          <label htmlFor="actionTeam" className="block text-gray-700 mb-2">Select Action Team</label>
          <select
            id="actionTeam"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSelectedTeam(e.target.value)} // Handle team selection
          >
            <option value="">Select Team</option>
            {actionTeams.map((team) => (
              <option key={team.action_team_id} value={team.action_team_id}>
                {team.action_team_name}
              </option>
            ))}
          </select>
        </div>
      )}


      <div className="mb-4">
        <label htmlFor="criticality" className="block text-gray-700 mb-2">Select Criticality</label>
        <select
          id="criticality"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSelectedCriticality(e.target.value)} // Handle criticality selection
        >
          <option value="">Select Criticality</option>
          <option value="CRT1">Minor</option>
          <option value="CRT2">Serious</option>
          <option value="CRT3">Critical</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">


        <button
          className="px-3 py-1 bg-gray-100 font-semibold text-gray-700 rounded hover:bg-red-200 transition"
          onClick={() => setIsModalOpen(false)}
        >
          Cancel
        </button>
        <button
          className="px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 hover:bg-emerald-200 transition"
          onClick={() => {
            console.log(`Assigned to team: ${selectedTeam}, Criticality: ${selectedCriticality}`);
            setIsModalOpen(false);
          }}
        >
          Assign
        </button>
      </div>
    </div>
  </div>
)}



    </div>
  );
};


export default Incidents;
