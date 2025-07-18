import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import Report from '../../models/UserReport';  // Adjust path as necessary
import { FaUser, FaTrash, FaArrowRight, FaImage } from 'react-icons/fa';
import { formatDate } from '../../utils/date';
import { Select } from 'antd';
import constants from '../../const';
import { Table, Button } from 'antd';


const IncidentsCompleted = () => {
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [critFilter, setcritFilter] = useState('All');
  const [requestTypeFilter, setRequestTypeFilter] = useState('All');
  const [selectedReports, setSelectedReports] = useState([]); // State to track selected rows
  const [selectedImage, setSelectedImage] = useState(null); // State to handle modal image
  const [actionTeams, setActionTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedCriticality, setSelectedCriticality] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { Option } = Select;



  useEffect(() => {
    if (isModalOpen) {
      const fetchActionTeams = async () => {
        setLoadingTeams(true);
        try {
          const jwtToken = localStorage.getItem('jwt');
          const response = await axios.get(
            `${constants.API.BASE_URL}/admin/dashboard/fetchAllActionTeamsWithDepartments?department_id=D1`,
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

  const handleAssignClick = (reportId, userId) => {
    setSelectedReportId(reportId);
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTeam('');
    setSelectedCriticality('');
    setResponseMessage('');
    setResponseStatus('');
  };



  // Define fetchUserReports outside of useEffect so it can be reused
  const fetchUserReports = async () => {
    try {
      const jwtToken = localStorage.getItem('jwt');
      const response = await axios.get(
        `${constants.API.BASE_URL}/admin/dashboard/Fetchalluserreportscompleted`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
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

  // Use fetchUserReports inside useEffect to load reports initially
  useEffect(() => {
    fetchUserReports();
  }, []);

  // Updated handleAssignTask function
  const handleAssignTask = async () => {
    if (!selectedReportId || !selectedTeam || !selectedCriticality || !selectedUserId) {
      return { status: 'error', message: 'Please select all fields before assigning the task.' };
    }

    setIsLoading(true); // Show loading indicator
    try {
      const jwtToken = localStorage.getItem('jwt');
      const payload = {
        user_report_id: selectedReportId,
        user_id: selectedUserId,
        action_team_id: selectedTeam,
        incident_criticality_id: selectedCriticality,
      };

      const response = await axios.post(
        `${constants.API.BASE_URL}/admin/dashboard/InsertAssignTask`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.status === 200) {
        await fetchUserReports(); // Reuse fetchUserReports here
        return { status: 'success', message: 'Task assigned successfully!' };
      }
    } catch (error) {
      console.error('Failed to assign task', error);
      return { status: 'error', message: 'Error assigning task. Please try again.' };
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };





  const toggleReportSelection = (id) => {
    setSelectedReports((prev) =>
      prev.includes(id) ? prev.filter(reportId => reportId !== id) : [...prev, id]
    );
  };

  const getStatusClass = (status) => {
    const normalizedStatus = status.trim().toLowerCase();
    if (normalizedStatus === 'open') return 'bg-red-100';
    if (normalizedStatus === 'assigned') return 'bg-gray-100 text-gray-700';
    if (normalizedStatus === 'completed') return 'bg-emerald-100';
    return '';
  };

  const getCritClass = (status) => {
    const normalizedStatus = status.trim().toLowerCase();
    if (normalizedStatus === 'low') return 'bg-emerald-100';
    if (normalizedStatus === 'high') return 'bg-amber-100 text-gray-700';
    if (normalizedStatus === 'critical') return 'bg-red-100 text-gray-700';
    return '';
  };




  const filteredReports = userReports
    .filter(report =>
      report.reportDescription && report.reportDescription.toLowerCase().includes(searchTerm.toLowerCase())
      || (report.assetName && report.assetName.toLowerCase().includes(searchTerm.toLowerCase()))
      || (report.assetNo && report.assetNo.toLowerCase().includes(searchTerm.toLowerCase()))
      || (report.status && report.status.toLowerCase().includes(searchTerm.toLowerCase()))
      || (formatDistanceToNow(new Date(report.dateTime), { addSuffix: true }) && formatDistanceToNow(new Date(report.dateTime), { addSuffix: true }).toLowerCase().includes(searchTerm.toLowerCase()))
      || (report.incidentCriticalityLevel && report.incidentCriticalityLevel.toLowerCase().includes(searchTerm.toLowerCase()))
      || (report.userReportId == searchTerm)
    )
    .filter(report => (statusFilter === 'All' || report.status.toLowerCase() === statusFilter.toLowerCase()))
    .filter(report => (critFilter === 'All' || report.incidentCriticalityLevel.toLowerCase() === critFilter.toLowerCase()));


  useEffect(() => {
  }, [searchTerm, statusFilter, critFilter, requestTypeFilter, userReports]);


  if (loading) return <div className="text-center py-8">
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="loader border-t-transparent border-4 border-gray-400 rounded-full w-16 h-16 animate-spin"></div>
    </div>

  </div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  //Ticket Escalate
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [selectedTicket, setSelectedTicket] = useState(null);
  // const [comment, setComment] = useState('');

  // const showModal = (ticket) => {
  //   setSelectedTicket(ticket);
  //   setIsModalVisible(true);
  // };

  // const handleCancel = () => {
  //   setIsModalVisible(false);
  //   setComment('');
  // };

  const columns = [
    {
      title: 'Ticket',
      dataIndex: 'userReportId',
      key: 'userReportId',
      render: (text) => <div className="font-semibold text-gray-700">{text}</div>,
    },
    {
      title: 'Asset',
      key: 'asset',
      render: (_, record) => (
        <div className="font-semibold text-sky-600">
          {record.assetNo || record.assetName ? (
            <>
              {record.assetNo}
              <div className="text-sm text-gray-500 mt-1">{record.assetName}</div>
            </>
          ) : (
            <span className="text-gray-700 font-bold">X</span>
          )}
        </div>
      ),
    },
    {
      title: 'Summary',
      dataIndex: 'reportDescription',
      key: 'reportDescription',
      render: (text) =>
        text ? (
          <span className='cursor-pointer' title={text}>
            {text.length > 25 ? `${text.substring(0, 25)}...` : text}
          </span>
        ) : (
          <span className="text-gray-700 font-bold">X</span>
        ),
    },
    {
      title: 'Reporter',
      dataIndex: 'userId',
      key: 'userId',
      render: (text) => text || <span className="text-gray-700 font-bold">X</span>,
    },
    {
      title: 'Location',
      dataIndex: 'subLocationName',
      key: 'subLocationName',
      render: (text) => text || <span className="text-gray-700 font-bold">X</span>,
    },
    {
      title: 'Assignee',
      key: 'assignee',
      render: (_, record) => (
        <div
          className={`flex ${record.Assignee === 'Unassigned'
              ? 'cursor-pointer hover:bg-gray-100'
              : 'cursor-default'
            } font-semibold`}
          onClick={
            record.Assignee === 'Unassigned'
              ? () => handleAssignClick(record.userReportId, record.userId)
              : undefined
          }
        >
          <span className="text-gray-700 p-1 mr-2">
            <FaUser />
          </span>
          <span
            className={
              record.Assignee === 'Unassigned' ? 'text-sky-600' : 'text-gray-900'
            }
          >
            {record.Assignee}
          </span>
          {record.Assignee === 'Unassigned' && (
            <span className="text-gray-700 p-1">
              <FaArrowRight />
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Image',
      key: 'image',
      render: (_, record) =>
        record.image ? (
          <Button
            type="link"
            className="text-sky-600 font-semibold"
            onClick={() => setSelectedImage(record.image)}
          >
            <FaImage />
          </Button>
        ) : (
          <span className="text-gray-700 font-bold">X</span>
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <span
          className={`px-2 py-1 rounded text-sm font-bold text-gray-700 ${getStatusClass(
            text
          )}`}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Criticality',
      dataIndex: 'incidentCriticalityLevel',
      key: 'incidentCriticalityLevel',
      render: (text) => (
        <span
          className={`px-2 py-1 rounded text-sm font-bold text-gray-700 ${getCritClass(
            text
          )}`}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (text) =>
        text ? `${text} hrs` : <span className="text-gray-700 font-bold">X</span>,
    },
    {
      title: 'Date',
      dataIndex: 'dateTime',
      key: 'dateTime',
      render: (text) =>
        text
          ? formatDate(text).date
          : <span className="text-gray-700 font-bold">X</span>,
    },
    {
      title: 'Time',
      dataIndex: 'dateTime',
      key: 'time',
      render: (text) =>
        text ? (
          <span>
            {text.split(' ')[1]} {text.split(' ')[2]}
          </span>
        ) : (
          <span className="text-gray-700 font-bold">X</span>
        ),
    },
  ];



  return (
    <div className="mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4 text-left">Closed Tickets</h2>


      <div className="flex items-center justify-between mb-4">
        {/* Search and Filter Section */}
        <input
          type="text"
          placeholder="🔍 Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-4 py-2 w-1/3"
        />



        <div className="flex space-x-4 items-center">
          {/* Criticality Dropdown */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="criticality" className="text-sm font-medium text-gray-600">Criticality</label>
            <Select
              id="criticality"
              value={critFilter}
              onChange={(value) => setcritFilter(value)}
              className="w-24"
            >
              <Option value="All">All</Option>
              <Option value="critical">Critical</Option>
              <Option value="high">High</Option>
              <Option value="low">Low</Option>
            </Select>
          </div>


        </div>



      </div>

      <div className="mb-4 text-gray-700">{filteredReports.length} ticket{filteredReports.length !== 1 ? 's' : ''}</div>

      {/* Action Buttons - Shown when any checkbox is selected */}
      {selectedReports.length > 0 && (
        <div className="flex gap-6 items-center p-2 mb-4 rounded">
          <span>{selectedReports.length} selected</span>
          <div className="flex gap-2">


            <button className="flex items-center bg-gray-100 hover:bg-red-200 px-4 py-2 rounded">
              <FaTrash className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      )}


      {/* Table to display reports */}
      {filteredReports.length != 0 ? (

        // <table className="table-auto w-full border-collapse shadow-lg rounded-md">
        //   <thead className="text-black text-left">
        //     <tr>
        //       {/* <th className="px-4 py-2 border-b">
        //         <input
        //           type="checkbox"
        //           onChange={(e) => setSelectedReports(e.target.checked ? filteredReports.map(r => r.userReportId) : [])}
        //           checked={selectedReports.length === filteredReports.length}
        //         />
        //       </th> */}
        //       <th className="px-4 py-2 border-b">Ticket</th>
        //       <th className="px-4 py-2 border-b">Asset</th>
        //       {/* <th className="px-4 py-2 border-b">Asset.No</th> */}
        //       <th className="px-4 py-2 border-b">Summary</th>
        //       <th className="px-4 py-2 border-b">Reporter</th>
        //       <th className="px-4 py-2 border-b">Location</th>
        //       <th className="px-4 py-2 border-b">Assignee</th>
        //       <th className="px-4 py-2 border-b">Image</th>
        //       <th className="px-4 py-2 border-b">Status</th>
        //       <th className="px-4 py-2 border-b">Criticality</th>
        //       <th className="px-4 py-2 border-b">Duration</th>
        //       <th className="px-4 py-2 border-b">Date</th>
        //       <th className="px-4 py-2 border-b">Time</th>


        //       {/* <th className="px-4 py-2 border-b">Urgency</th> */}
        //     </tr>
        //   </thead>
        //   <tbody className="text-left">
        //     {filteredReports.map((report) => (
        //       <tr key={report.userReportId} className="bg-white hover:bg-gray-100">
        //         {/* <td className="px-4 py-2 border-b">
        //           <input
        //             type="checkbox"
        //             checked={selectedReports.includes(report.userReportId)}
        //             onChange={() => toggleReportSelection(report.userReportId)}
        //           />
        //         </td> */}
        //         <td className="px-4 py-2 border-b">
        //           <div className="font-semibold text-gray-700 cursor-pointer">
        //             {report.userReportId}
        //           </div>
        //         </td>
        //         <td className="px-4 py-2 border-b">
        //           <div className="font-semibold text-sky-600 cursor-pointer">
        //             {report.assetNo || report.assetName ? (
        //               <>
        //                 {report.assetNo}
        //                 <div className="text-sm text-gray-500 mt-1">
        //                   {report.assetName}
        //                 </div>
        //               </>
        //             ) : (
        //               <span className="text-gray-700 font-bold">X</span>
        //             )}
        //           </div>
        //         </td>


        //         <td className="px-4 py-2 border-b font-semibold text-gray-700 relative group">
        //           {report.reportDescription ? (
        //             <>
        //               {/* Display truncated description */}
        //               <span>
        //                 {report.reportDescription.length > 25
        //                   ? `${report.reportDescription.substring(0, 25)}...`
        //                   : report.reportDescription}
        //               </span>

        //               {/* Tooltip for full description */}
        //               <div className="absolute hidden group-hover:block z-10 bg-gray-800 text-white text-sm rounded p-2 shadow-lg max-w-sm w-auto">
        //                 {report.reportDescription}
        //               </div>
        //             </>
        //           ) : (
        //             <span className="text-gray-700 font-bold">X</span>
        //           )}
        //         </td>
        //         <td className="px-4 py-2 border-b font-semibold text-gray-700">
        //           {report.userId ? report.userId : <span className="text-gray-700 font-bold">X</span>}
        //         </td>
        //         <td className="px-4 py-2 border-b font-semibold text-gray-700">
        //           {report.subLocationName ? report.subLocationName : <span className="text-gray-700 font-bold">X</span>}
        //         </td>

        //         <td className="px-4 py-2 border-b">
        //           <div
        //             className={`flex ${report.Assignee === 'Unassigned' ? 'cursor-pointer hover:bg-gray-100' : 'cursor-default'} font-semibold`}
        //             onClick={report.Assignee === 'Unassigned' ? () => handleAssignClick(report.userReportId, report.userId) : undefined}
        //           >
        //             {/* User Icon */}
        //             <span className={`text-gray-700 p-1 mr-2 `}>
        //               <FaUser />
        //             </span>

        //             {/* Assignee Text */}
        //             <span className={report.Assignee === 'Unassigned' ? 'text-sky-600' : 'text-gray-900'}>
        //               {report.Assignee}
        //             </span>

        //             {report.Assignee === 'Unassigned' && (
        //               <span className="text-gray-700 p-1 mr-2">
        //                 <FaArrowRight />
        //               </span>
        //             )}
        //           </div>
        //         </td>

        //         <td className="px-4 py-2 border-b text-center">
        //           {report.image ? (
        //             <button
        //               className="text-sky-600 font-semibold cursor-pointer hover:underline focus:outline-none focus:ring focus:ring-blue-300 transition-all"
        //               onClick={() => setSelectedImage(report.image)}
        //               title="Click to view the image"
        //             >
        //               <FaImage />
        //             </button>
        //           ) : (
        //             <span className="text-gray-700 font-bold">X</span>
        //           )}
        //         </td>

        //         <td className="px-4 py-2 border-b whitespace-nowrap">
        //           <span className={`px-2 py-1 rounded text-sm font-bold text-gray-700 ${getStatusClass(report.status)}`}>
        //             {report.status}
        //           </span>
        //         </td>

        //         <td className="px-4 py-2 border-b whitespace-nowrap">
        //           <span className={`px-2 py-1 rounded text-sm font-bold text-gray-700 ${getCritClass(report.incidentCriticalityLevel)}`}>
        //             {report.incidentCriticalityLevel}
        //           </span>
        //         </td>

        //         <td className="px-4 py-2 border-b font-semibold">
        //           {report.duration
        //             ? `${report.duration} hrs` // Display formatted date
        //             : <span className="text-gray-700 font-bold">X</span>}
        //         </td>
        //         <td className="px-4 py-2 border-b font-semibold">
        //           {report.dateTime
        //             ? formatDate(report.dateTime).date // Display formatted date
        //             : <span className="text-gray-700 font-bold">X</span>}
        //         </td>
        //         <td className="px-4 py-2 border-b font-semibold">
        //           {report.dateTime
        //             ? `${report.dateTime.split(' ')[1]} ${report.dateTime.split(' ')[2]}` // Extract and display the time and period
        //             : <span className="text-gray-700 font-bold">X</span>}
        //         </td>






        //       </tr>

        //     ))}
        //   </tbody>

        // </table>
        <Table
          dataSource={filteredReports}
          columns={columns}
          rowKey="userReportId"
          pagination={{ pageSize: 10 }}
        />
      ) : (

        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 text-sky-500 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-label="No Tickets Icon"
              >
                <path d="M9 2a1 1 0 00-.894.553L6.382 6H3a1 1 0 000 2h3.382l1.724 3.447a1 1 0 00.894.553H17a1 1 0 000-2H9.618L7.894 6.553A1 1 0 009 6h7a1 1 0 000-2H9z" />
                <path d="M3 14a1 1 0 011-1h10a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3z" />
              </svg>
            </div>
            <p className="text-2xl font-semibold text-sky-500">No Ticket Closed</p>
            <p className="text-sm text-gray-500 mt-2">No issues in your company. All systems are running smoothly!</p>
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
              <img src={selectedImage} alt="Report" className="max-w-full max-h-full rounded" crossOrigin="anonymous"
              />
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => handleCloseModal()} // Close modal and reset form on background click
        >
          <div
            className="bg-white rounded-lg shadow-lg w-1/3 p-6"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <h3 className="text-xl font-semibold mb-4">Assign Task</h3>

            {/* Response Message */}
            {responseMessage && (
              <div
                className={`mb-4 p-3 rounded ${responseStatus === 'success'
                  ? 'text-emerald-600 bg-emerald-100'
                  : 'text-red-600 bg-red-100'
                  }`}
              >
                {responseMessage}
              </div>
            )}

            {/* Action Team Dropdown */}
            {loadingTeams ? (
              <p>Loading teams...</p>
            ) : (
              <div className="mb-4">
                <label htmlFor="actionTeam" className="block text-gray-700 mb-2">
                  Select Action Team
                </label>
                <select
                  id="actionTeam"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedTeam}
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
              <label htmlFor="criticality" className="block text-gray-700 mb-2">
                Select Criticality
              </label>
              <Select
                id="criticality"
                value={critFilter}
                onChange={(value) => setSelectedCriticality(value)}
                className="w-24"
              >
                <Option value="All">All</Option>
                <Option value="critical">Critical</Option>
                <Option value="high">High</Option>
                <Option value="low">Low</Option>
              </Select>
            </div>

            {/* Loading Indicator */}
            {isLoading && <p className="text-blue-500 mb-4">Assigning task, please wait...</p>}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                onClick={() => handleCloseModal()}
                disabled={isLoading} // Disable button while loading
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 hover:bg-emerald-200 transition"
                onClick={async () => {
                  const result = await handleAssignTask();
                  setResponseMessage(result.message);
                  setResponseStatus(result.status);
                  if (result.status === 'success') {
                    setTimeout(() => handleCloseModal(), 2000); // Close modal after 2 seconds
                  }
                }}
                disabled={isLoading} // Disable button while loading
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

export default IncidentsCompleted;
