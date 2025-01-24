import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import Report from '../../models/UserReport';  // Adjust path as necessary
import { FaUser, FaTrash, FaArrowRight, FaImage } from 'react-icons/fa';
import { formatDate } from '../../utils/date';
import { FaCircleExclamation } from 'react-icons/fa6';
import { Select } from 'antd';
import constants from '../../const';
import { Table, Icon, Switch, Radio, Form, Divider, Tooltip, Button, InputNumber} from 'antd';

const Incidents = () => {
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

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowToggle, setSelectedRowToggle] = useState(false);

  const { Option } = Select;

  //Escalate Ticket
  const [isEscalateModalVisible, setIsEscalateModalVisible] = useState(false);
  const [isEscalateLoading, setisEscalateLoading] = useState(false);
  const [escalateMsg, setEscalateMsg] = useState('');
  const [escalateError, setEscalateError] = useState('');
  const [comment, setComment] = useState('');

  //Delete Ticket
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleteLoading, setisDeleteLoading] = useState(false);
  const [DeleteError, setDeleteError] = useState('');
  const [DeleteMsg, setDeleteMsg] = useState('');

  //Table options
  const [bordered, setBordered] = useState(false);
  const [size, setSize] = useState('default');
  const [pagination, setPagination] = useState({ position: 'top', pageSize: 10 });
  const [showHeader, setFixedHeader] = useState(true);
  const [scroll, setScroll] = useState(undefined);





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

  //Row Selection
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    // Allow only a single selection
    setSelectedRowKeys(newSelectedRowKeys.slice(-1)); // Keep only the latest selected key
  };

  const onSelect = (record, selected) => {
    if (selected) {
      setSelectedRowKeys([record.userReportId]); // Allow only one selection
      setSelectedRow(record); // Set the selected row
      setSelectedRowToggle(true); // Show buttons
    } else {
      setSelectedRowKeys([]); // Clear selection
      setSelectedRow(null); // Clear selected row
      setSelectedRowToggle(false); // Hide buttons
    }
  };

  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys,
    onChange: onSelectChange,
    onSelect, // Trigger selection logic
  };



  const handleRowDoubleClick = (row) => {
    if (selectedRow?.userReportId === row.userReportId) {
      // Deselect if the same row is clicked
      setSelectedRow(null);
      setSelectedRowToggle(false);
    } else {
      // Select a new row
      setSelectedRow(row);
      setSelectedRowToggle(true);
    }
  };




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
        `${constants.API.BASE_URL}/admin/dashboard/fetchAllUserReports`,
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
    ?.filter((report) => {
      if (statusFilter !== 'All') {
        return (
          report?.status?.toLowerCase() === statusFilter.toLowerCase()
        );
      }
      return true;
    })
    ?.filter((report) => {
      if (critFilter !== 'All') {
        return (
          report?.incidentCriticalityLevel?.toLowerCase() === critFilter.toLowerCase()
        );
      }
      return true;
    });
  // .filter(report => (statusFilter === 'All' || report.status.toLowerCase() === statusFilter.toLowerCase()))
  // .filter(report => (critFilter === 'All' || report.incidentCriticalityLevel.toLowerCase() === critFilter.toLowerCase()));


  useEffect(() => {
  }, [searchTerm, statusFilter, critFilter, requestTypeFilter, userReports]);


  if (loading) return <div className="text-center py-8">
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="loader border-t-transparent border-4 border-gray-400 rounded-full w-16 h-16 animate-spin"></div>
    </div>

  </div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  // Ticket Escalate


  const showEscalateModal = () => {
    setIsEscalateModalVisible(true);
  };

  const handleEscalateCancel = () => {
    setIsEscalateModalVisible(false);
    setComment('');
    setEscalateMsg('');
    setEscalateError('');
  };

  const handleEscalate = async () => {
    try {
      setisEscalateLoading(true);
      const jwtToken = localStorage.getItem('jwt');

      const response = await axios.post(`${constants.API.BASE_URL}/admin/dashboard/escalateReport`,
        {
          user_report_id: selectedRow.userReportId,
          user_report_desc: selectedRow.reportDescription,
          user_report_criticality: selectedRow.incidentCriticalityLevel,
          asset_name: selectedRow.assetName,
          additional_comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setEscalateMsg('Ticket escalated successfully')

      setTimeout(() => {
        handleEscalateCancel();
        setComment('');
      }, 2000);

    } catch (error) {
      setEscalateError('Failed to send message. Please try again');
    } finally {
      setisEscalateLoading(false); // Hide loading indicator
    }
  };

  //Delete Ticket

  const showDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setDeleteError('');
    setDeleteMsg('');
  };

  const handleDelete = async () => {
    try {
      setisDeleteLoading(true);
      const jwtToken = localStorage.getItem('jwt');
      const response = await axios.delete(`${constants.API.BASE_URL}/admin/dashboard/deleteUserReport/${selectedRow.userReportId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setDeleteMsg('Ticket deleted successfully')

      setTimeout(() => {
        handleDeleteCancel();
        fetchUserReports();
        setSelectedRowToggle(false);
      }, 2000);

    } catch (error) {
      setDeleteError('Failed to delete ticket. Please try again');
    } finally {
      setisDeleteLoading(false); // Hide loading indicator
    }
  };

  const state = {
    bordered: false,
    loading: false,
    pagination,
    size: 'default',
    title: undefined,
    showHeader: true,
    rowSelection: {},
    scroll: undefined,
    hasData: true,
    tableLayout: undefined,
  };


  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };

  const handlePaginationChange = (e) => {
    const { value } = e.target;
    setPagination(value === 'none' ? false : { ...pagination, position: value });
  };

  const handlePageSizeChange = (value) => {
    setPagination((prev) => ({ ...prev, pageSize: value }));
  };

  const handleFixedHeaderChange = (enabled) => {
    setFixedHeader(enabled);
  };


  const handleScrollChange = (enable) => {
    setScroll(enable ? { y: 480 } : undefined);
  };







  const columns = [
    {
      title: 'Ticket',
      dataIndex: 'userReportId',
      key: 'ticket',
      render: (text) => <div className="font-semibold text-gray-700 cursor-pointer">{text}</div>,
    },
    {
      title: 'Asset',
      dataIndex: 'assetNo',
      key: 'asset',
      render: (text, record) => (
        <div className="font-semibold text-sky-600 cursor-pointer">
          {record.assetNo ? (
            <>
              {record.assetNo}
              <div className="text-sm text-gray-500 mt-1">{record.assetName}</div>
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <span className="text-gray-700 font-bold">X</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Summary',
      dataIndex: 'reportDescription',
      key: 'summary',
      render: (text) => (
        <Tooltip title={text}>
          <span>
            {text.length > 50 ? `${text.substring(0, 50)}...` : text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Reporter',
      dataIndex: 'userId',
      key: 'reporter',
      render: (text) => text ||
        <div className="flex justify-center items-center h-full">
          <span className="text-gray-700 font-bold">X</span>
        </div>
    },
    {
      title: 'Location',
      dataIndex: 'subLocationName',
      key: 'location',
      render: (text) => text ||
        <div className="flex justify-center items-center h-full">
          <span className="text-gray-700 font-bold">X</span>
        </div>
    },
    {
      title: 'Team',
      dataIndex: 'Assignee',
      key: 'assignee',
      render: (text, record) => (
        <div
          className={`flex ${text === 'Unassigned' ? 'cursor-pointer hover:bg-gray-100' : 'cursor-default'} font-semibold`}
          onClick={text === 'Unassigned' ? () => handleAssignClick(record.userReportId, record.userId) : undefined}
        >
          <span className="text-gray-700 p-1 mr-2">
            <FaUser />
          </span>
          <span className={text === 'Unassigned' ? 'text-sky-600' : 'text-gray-900'}>{text}</span>
          {text === 'Unassigned' && (
            <span className="text-gray-700 p-1 mr-2">
              <FaArrowRight />
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text) => (
        text ? (
          <Button
            type="link"
            className="text-sky-600 font-semibold"
            onClick={() => setSelectedImage(text)}
          >
            <FaImage />
          </Button>
        ) : (
          <div className="flex justify-left items-left ml-4 h-full">
            <span className="text-gray-700 font-bold">X</span>
          </div>
        )
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <span className={`px-2 py-1 rounded text-sm font-bold text-gray-700 ${getStatusClass(text)}`}>
          {text}
        </span>
      ),
    },
    {
      title: 'Criticality',
      dataIndex: 'incidentCriticalityLevel',
      key: 'criticality',
      render: (text) => (
        <span className={`px-2 py-1 rounded text-sm font-bold text-gray-700 ${getCritClass(text)}`}>
          {text}
        </span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'dateTime',
      key: 'date',
      render: (text) => (
        text ? formatDate(text).date :
          <div className="flex justify-center items-center h-full">
            <span className="text-gray-700 font-bold">X</span>
          </div>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'dateTime',
      key: 'time',
      render: (text) => (
        text ? `${text.split(' ')[1]} ${text.split(' ')[2]}` :
          <div className="flex justify-center items-center h-full">
            <span className="text-gray-700 font-bold">X</span>
          </div>
      ),
    },
  ];


  return (
    <div className="mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4 text-left">Tickets</h2>


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

          {/* Status Dropdown */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="status" className="text-sm font-medium text-gray-600">Status</label>
            <Select
              id="status"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              className="w-24"
            >
              <Option value="All">All</Option>
              <Option value="Open">Open</Option>
              <Option value="assigned">Assigned</Option>
            </Select>
          </div>
        </div>
      </div>

      <div className="mb-4 text-gray-700">{filteredReports.length} ticket{filteredReports.length !== 1 ? 's' : ''}</div>

      {/* Action Buttons - Shown when any checkbox is selected */}
      {selectedRowToggle && (
        <div className="flex gap-6 items-center p-1 mb-1 rounded">
          {selectedRow.Assignee === 'Unassigned' ? (
            // Show delete button only if Assignee is "Unassigned"
            <div className="flex gap-2">
              <button
                className="flex items-center bg-gray-100 hover:bg-red-200 px-3 py-1 rounded"
                onClick={() => showDeleteModal()}
              >
                <FaTrash className="text-sm" />
                <p className="text-sm ml-1">Delete Ticket</p>
              </button>
            </div>
          ) : (
            // Show escalate ticket button if Assignee is not "Unassigned"
            <div className="flex gap-2">
              <button
                className="flex items-center bg-gray-100 hover:bg-amber-200 px-3 py-1 rounded"
                onClick={() => showEscalateModal()}
              >
                <FaCircleExclamation className="text-sm" />
                <p className="text-sm ml-1">Escalate Ticket</p>
              </button>
            </div>
          )}
        </div>
      )}



      {/* Table to display reports */}
      {filteredReports.length != 0 ? (
        <div>
          <Form layout="inline" style={{ marginBottom: 16 }}>
            <Form.Item label="Bordered">
              <Switch checked={bordered} onChange={setBordered} />
            </Form.Item>
            <Form.Item label="Size">
              <Radio.Group value={size} onChange={handleSizeChange}>
                <Radio.Button value="default">Default</Radio.Button>
                <Radio.Button value="middle">Middle</Radio.Button>
                <Radio.Button value="small">Small</Radio.Button>
              </Radio.Group>
            </Form.Item>
            {/* <Form.Item label="Pagination">
              <Radio.Group
                value={pagination ? pagination.position : 'none'}
                onChange={handlePaginationChange}
              >
                <Radio.Button value="top">Top</Radio.Button>
                <Radio.Button value="bottom">Bottom</Radio.Button>
                <Radio.Button value="both">Both</Radio.Button>
                <Radio.Button value="none">None</Radio.Button>
              </Radio.Group>
            </Form.Item> */}
            <Form.Item label="Page Size">
              <InputNumber
                min={1}
                max={100}
                value={pagination?.pageSize}
                onChange={handlePageSizeChange}
              />
            </Form.Item>
            <Form.Item label="Fixed Header">
              <Switch checked={!!scroll} onChange={handleScrollChange} />
            </Form.Item>
          </Form>
          <Table
            columns={columns}
            dataSource={filteredReports}
            rowKey="userReportId"
            bordered={bordered}
            size={size}
            scroll={scroll}
            pagination={pagination}
            showHeader={showHeader}
          />
        </div>
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
            <p className="text-2xl font-semibold text-sky-500">No Tickets</p>
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
              <img
                src={selectedImage} // Remove surrounding quotes
                alt="Report"
                className="max-w-full max-h-full rounded"
                crossOrigin="anonymous"
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
              <select
                id="criticality"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCriticality}
                onChange={(e) => setSelectedCriticality(e.target.value)} // Handle criticality selection
              >
                <option value="">Select Criticality</option>
                <option value="CRT1">Minor</option>
                <option value="CRT2">Serious</option>
                <option value="CRT3">Critical</option>
              </select>
            </div>

            {/* Loading Indicator */}
            {isLoading && <p className="mb-4 p-3 rounded text-sky-700 bg-sky-100">Assigning task, please wait...</p>}

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
                    setTimeout(() => handleCloseModal(), 2000);
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


      {isEscalateModalVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => handleCloseModal()} // Close modal and reset form on background click
        >
          <div
            className="bg-white rounded-lg shadow-lg w-1/3 p-6"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <h3 className="text-xl font-semibold mb-4">Escalate Ticket</h3>

            {isEscalateLoading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
            {escalateMsg && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{escalateMsg}</p>}
            {escalateError && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{escalateError}</p>}

            {/* Comment Field */}
            <div className="mb-4">
              <label htmlFor="comment" className="block text-gray-700 font-semibold mb-2">
                Optional Message:
              </label>
              <textarea
                id="comment"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Send a message to the assigned action team"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="3"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                onClick={() => handleEscalateCancel()}
                disabled={isEscalateLoading} // Disable button while loading
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 hover:bg-emerald-200 transition"
                onClick={async () => {
                  handleEscalate();

                }}
                disabled={isEscalateLoading} // Disable button while loading
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p>Are you sure you want to delete this ticket?</p>
            {isDeleteLoading && <p className="mb-4 mt-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
            {DeleteMsg && <p className="mb-4 mt-4 p-3 rounded text-emerald-600 bg-emerald-100">{DeleteMsg}</p>}
            {DeleteError && <p className="mb-4 mt-4 p-3 rounded text-red-600 bg-red-100">{DeleteError}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => handleDeleteCancel()}
                className="px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-sky-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-red-200 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Incidents;
