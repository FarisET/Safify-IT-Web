import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import Report from '../../models/ActionReport';  // Adjust path as necessary
import { formatDate } from '../../utils/date';
import { FaChevronDown, FaCheck, FaTrash, FaImage } from 'react-icons/fa';

const ApprovedReports = () => {
  const [actionReports, setactionReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [requestTypeFilter, setRequestTypeFilter] = useState('All');

  const [selectedReports, setSelectedReports] = useState([]); // State to track selected rows
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(''); // State to hold the modal message
  const [responseMessage, setResponseMessage] = useState(''); // Response from the endpoint
  const [reportToApprove, setReportToApprove] = useState(null); // Report to approve/reject
  const [isDropdownOpen, setIsDropdownOpen] = useState(null); // State for controlling dropdown visibility
  const [selectedImage, setSelectedImage] = useState(null);


  useEffect(() => {
    fetchActionReports();
  }, []);

  const fetchActionReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const jwtToken = sessionStorage.getItem('jwt');
      const response = await axios.get('http://localhost:3001/admin/dashboard/Fetchallactionreportsapproved', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });
      const reports = response.data.map(reportData => new Report(reportData));
      setactionReports(reports);
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const approveReport = async (reportId, actionReportId) => {
    const jwtToken = sessionStorage.getItem('jwt');
    const payload = {
      user_report_id: reportId,
      action_report_id: actionReportId,
      is_approved: true,
    };

    try {
      const response = await axios.post(
        'http://localhost:3001/admin/dashboard/approvedActionReport',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        setResponseMessage(response.data.message); // Display response from the endpoint
        await fetchActionReports(); // Reload the reports
        setIsModalOpen(false); // Close modal after action
      }
    } catch (err) {
      setErrorMessage('Failed to approve the report. Please try again.');
      setResponseMessage(''); // Clear any previous success message
    }
  };

  const rejectReport = async (actionReportId) => {
    try {
      const result = await deleteActionReport(actionReportId);
      if (result) {
        setResponseMessage('Report rejected successfully.');
        fetchActionReports();
        setIsModalOpen(false);
      } else {
        setErrorMessage('Failed to delete the report. Please try again.');
        setResponseMessage('');
      }
    } catch (err) {
      setErrorMessage('Error rejecting the report. Please try again.');
      setResponseMessage('');
    }
  };

  const deleteActionReport = async (actionReportId) => {
    const jwtToken = sessionStorage.getItem('jwt');
    const url = `http://localhost:3001/admin/dashboard/deleteActionReport/${actionReportId}`;

    try {
      const response = await axios.delete(url, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const toggleDropdown = (reportId) => {
    setIsDropdownOpen(prev => (prev === reportId ? null : reportId));
  };

  const getStatusClass = (status) => {
    const normalizedStatus = status.trim().toLowerCase();
    if (normalizedStatus === 'approval pending') return 'bg-gray-100 text-gray-700';
    if (normalizedStatus === 'approved') return 'bg-emerald-100';
    return '';
  };

  const filteredReports = actionReports
    .filter(report =>
      report.reportDescription && report.reportDescription.toLowerCase().includes(searchTerm.toLowerCase())
      || (report.assetName && report.assetName.toLowerCase().includes(searchTerm.toLowerCase()))
      || (report.status && report.status.toLowerCase().includes(searchTerm.toLowerCase()))
      || (formatDistanceToNow(new Date(report.dateTime), { addSuffix: true }) && formatDistanceToNow(new Date(report.dateTime), { addSuffix: true }).toLowerCase().includes(searchTerm.toLowerCase()))
      || (report.incidentCriticalityLevel && report.incidentCriticalityLevel.toLowerCase().includes(searchTerm.toLowerCase()))
      || (report.userReportId == searchTerm)

    )
    .filter(report => (statusFilter === 'All' || report.status.toLowerCase() === statusFilter.toLowerCase()))

  useEffect(() => {
  }, [searchTerm, statusFilter, requestTypeFilter, actionReports]);

  if (loading) return <div className="text-center py-8">
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="loader border-t-transparent border-4 border-gray-400 rounded-full w-16 h-16 animate-spin"></div>
    </div>

  </div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4 text-left">Approved Reports</h2>

      <div className="flex items-center justify-between mb-4">
        {/* Search and Filter Section */}
        <input
          type="text"
          placeholder="search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-4 py-2 w-1/3"
        />


      </div>

      <div className="mb-4 text-gray-700">{filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}</div>

      {/* Table to display reports */}
      {filteredReports.length != 0 ? (
        <table className="table-auto w-full border-collapse shadow-lg rounded-md">
          <thead className="bg-blue-600 text-black text-left">
            <tr>
              <th className="px-4 py-2 border-b">Ticket</th>
              <th className="px-4 py-2 border-b">Asset</th>
              <th className="px-4 py-2 border-b">Summary</th>
              <th className="px-4 py-2 border-b">Assignee</th>
              <th className="px-4 py-2 border-b">Action Team</th>
              <th className="px-4 py-2 border-b">Image</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Time</th>
            </tr>
          </thead>
          <tbody className="text-left">
            {filteredReports.map((report) => (
              <tr key={report.userReportId} className="bg-white hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{report.userReportId}</td>
                <td className="px-4 py-2 border-b">{report.assetName}</td>
                <td className="px-4 py-2 border-b font-semibold text-gray-700">
                  <span className="block text-gray-800">⚠️ {report.reportDescription}</span>
                  <span className="block text-gray-500 text-sm">💬 {report.resolutionDescription}</span>
                </td>
                <td className="px-4 py-2 border-b font-semibold text-gray-700">{report.reportedBy}</td>
                <td className="px-4 py-2 border-b">{report.actionTeamName}</td>
                <td className="px-4 py-2 border-b text-center">
                  {report.proofImage ? (
                    <button
                      className="text-sky-600 font-semibold cursor-pointer hover:underline focus:outline-none focus:ring focus:ring-blue-300 transition-all"
                      onClick={() => setSelectedImage(report.proofImage)}
                      title="Click to view the image"
                    >
                      <FaImage />
                    </button>
                  ) : (
                    <span className="text-gray-700 font-bold">X</span>
                  )}
                </td>
                <td
                  className={`px-4 py-2 border-b whitespace-nowrap`}
                >
                  <span className={`px-2 py-1 rounded text-sm font-bold text-gray-700 ${getStatusClass(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-4 py-2 border-b font-semibold">
                  {report.dateTime
                    ? formatDate(report.dateTime).date // Display formatted date
                    : <span className="text-gray-700 font-bold">X</span>}
                </td>
                <td className="px-4 py-2 border-b font-semibold">
                  {report.dateTime
                    ? `${report.dateTime.split(' ')[1]} ${report.dateTime.split(' ')[2]}` // Extract and display the time and period
                    : <span className="text-gray-700 font-bold">X</span>}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-emerald-100 text-emerald-500 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-label="No Approvals Icon"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-11.707a1 1 0 00-1.414-1.414L10 7.586 7.707 5.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 12.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-2xl font-semibold text-emerald-500">No Approved Reports</p>
            <p className="text-sm text-gray-500 mt-2">
              Great! Seems like there are no approved reports.
            </p>
          </div>
        </div>
      )}

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


      {/* Modal for Success/Error Messages */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold">{responseMessage ? 'Success' : 'Error'}</h2>
            <p className="mt-4">{responseMessage || errorMessage}</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedReports;
