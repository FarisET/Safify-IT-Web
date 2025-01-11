import React, { useEffect, useState } from 'react';
import { Pie, PieChart, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { Table, Select, Typography } from "antd";
import axios from 'axios';
import { Divider } from 'antd';
import { FaQuestionCircle } from 'react-icons/fa';

const { Option } = Select;



const Dashboard = () => {
  // State for analytics data
  const [timeBoundData, setTimeBoundData] = useState({});
  const [nonTimeBoundData, setNonTimeBoundData] = useState({});

  // Date filter options
  const today = new Date();
  const [selectedDateRange, setSelectedDateRange] = useState('All');
  const [selectedUserDateRange, setSelectedUserDateRange] = useState('All');


  const last7Days = new Date();
  const last15Days = new Date();
  const last30Days = new Date();
  const last365Days = new Date();

  last7Days.setDate(today.getDate() - 7);
  last15Days.setDate(today.getDate() - 15);
  last30Days.setDate(today.getDate() - 30);
  last365Days.setDate(today.getDate() - 365);

  const dateOptions = [
    { text: 'All', value: 'All' },
    { text: 'Today', value: today.toISOString().split('T')[0] },
    { text: 'Last 7 Days', value: last7Days.toISOString().split('T')[0] },
    { text: 'Last 15 Days', value: last15Days.toISOString().split('T')[0] },
    { text: 'Last Month', value: last30Days.toISOString().split('T')[0] },
    { text: 'Last Year', value: last365Days.toISOString().split('T')[0] },
  ];

  //2 level piechart


  //user tickets
  const [userTickets, setUserTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserTickets = async (dateRange) => {
    try {
      const jwtToken = sessionStorage.getItem("jwt");
      let dataRange = dateRange;
      const endpoint = dateRange === "All"
        ? "http://localhost:3001/analytics/fetchTotalTicketsByUser"
        : `http://localhost:3001/analytics/fetchTotalTicketsByUser?timestamp=${dateRange}`;

      const response = await axios.get(
        endpoint,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      setUserTickets(response.data);
    } catch (error) {
      setError("Failed to fetch user tickets. Please try again.");
    }
  };




  // Fetch Time-Bound Analytics
  const fetchTimeBoundAnalytics = async (dateRange) => {
    try {
      const jwtToken = sessionStorage.getItem('jwt');

      let dataRange = dateRange;
      const endpoint = dateRange === "All"
        ? "http://localhost:3001/analytics/fetchAnalyticsTimeBound"
        : `http://localhost:3001/analytics/fetchAnalyticsTimeBound?timestamp=${dateRange}`;

      const response = await axios.get(
        endpoint,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setTimeBoundData(response.data);
    } catch (error) {
      console.error('Error fetching time-bound analytics:', error);
    }
  };

  // Fetch Non-Time-Bound Analytics
  const fetchNonTimeBoundAnalytics = async () => {
    const jwtToken = sessionStorage.getItem('jwt');

    try {
      const response = await axios.get('http://localhost:3001/analytics/fetchAnalyticsNonTimeBound',
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }

      );
      setNonTimeBoundData(response.data);
    } catch (error) {
      console.error('Error fetching non-time-bound analytics:', error);
    }
  };

  // Handle date range change
  const handleDateRangeChange = (value) => {
    setSelectedDateRange(value);
    fetchTimeBoundAnalytics(value);
  };

  const handleUserDateRangeChange = (value) => {
    setSelectedUserDateRange(value);
    fetchUserTickets(value);
  };

  // Initial data load
  useEffect(() => {
    fetchTimeBoundAnalytics(selectedDateRange);
    fetchNonTimeBoundAnalytics();
    fetchUserTickets(selectedUserDateRange);

  }, []);

  const [activeTab, setActiveTab] = useState("timeBound");
  const COLORS = [
    '#0284c7', // Original blue color
    '#22d3ee', // Cyan 400
    '#06b6d4', // Cyan 500
    '#0891b2', // Cyan 600
    '#0e7490', // Cyan 700
    '#155e75', // Cyan 800
    '#164e63', // Cyan 900
    '#083344', // Cyan 950
    '#38bdf8', // Sky 400
    '#0ea5e9', // Sky 500
    '#0369a1', // Sky 600
    '#075985', // Sky 700
    '#0c4a6e'  // Sky 900
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      {timeBoundData.assetsByStatus || nonTimeBoundData.efficiency ? (
        <div className="mt-6">
          {/* Tab Navigation */}
          <div className="flex border-gray-300 mb-4">
            <button
              onClick={() => setActiveTab("timeBound")}
              className={`px-4 py-2 font-semibold ${activeTab === "timeBound"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 hover:text-blue-500"
                }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab("nonTimeBound")}
              className={`px-4 py-2 font-semibold ${activeTab === "nonTimeBound"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 hover:text-blue-500"
                }`}
            >
              Efficiency
            </button>

            <button
              onClick={() => setActiveTab("user")}
              className={`px-4 py-2 font-semibold ${activeTab === "user"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 hover:text-blue-500"
                }`}
            >
              User
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "timeBound" && (
              <div className="p-4 mb-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Statistics</h3>
                  <Select
                    value={selectedDateRange}
                    onChange={(value) => handleDateRangeChange(value)} // Adjust to handle the value directly
                    className="w-48"
                  >
                    {dateOptions.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.text}
                      </Option>
                    ))}
                  </Select>



                </div>

                <div className='max-h-[60vh] overflow-y-auto overflow-x-auto max-w-[90vw]'>

                  {/* Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 mr-4">
                    <Card title="Total Tickets" tooltipContent="Total tickets launched. Based on date filter">
                      <p className="text-lg font-bold">{timeBoundData.incidentsReported || 0}</p>
                    </Card>
                    <Card title="Tickets Resolved" tooltipContent="Total tickets closed based on date filter">
                      <p className="text-lg font-bold">{timeBoundData.incidentsResolved || 0}</p>
                    </Card>
                    <Card title="Ticket by Criticality" tooltipContent="Total tickets categorized by criticality of issue. Based on date filter">
                      <div className="flex flex-wrap gap-4">
                        {timeBoundData.totalTicketsByIncidentCriticality?.length > 0 ? (
                          timeBoundData.totalTicketsByIncidentCriticality.map((item, index) => {
                            // Assign background color based on the Criticality Level
                            const bgColor =
                              item['Criticality Level'] === 'low'
                                ? 'px-3 py-1 text-gray-700 font-semibold rounded bg-emerald-100'
                                : item['Criticality Level'] === 'high'
                                  ? 'px-3 py-1 text-gray-700 font-semibold rounded bg-yellow-100'
                                  : item['Criticality Level'] === 'critical'
                                    ? 'px-3 py-1 text-gray-700 font-semibold rounded bg-red-100'
                                    : 'px-3 py-1 text-gray-700 font-semibold rounded bg-gray-100'; // Default color if no match

                            return (
                              <div
                                key={index}
                                className={`text-lg font-bold px-4 py-2 rounded ${bgColor}`}
                              >
                                {`${item['Criticality Level']}: ${item['Ticket Count']}`}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-lg font-bold">No data available</div>
                        )}
                      </div>
                    </Card>

                  </div>




                  {/* Charts */}
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6 mr-4">
                    {/* Assets by Status Bar Chart */}
                    <Card title="Assets by Status" tooltipContent="total count of assets for each status. For example: easily identify how many are operational and how many are in repair. Based on date filter">
                      {timeBoundData.assetsByStatus && (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={timeBoundData.assetsByStatus}>
                            <XAxis dataKey="status" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#4b5563">
                              {timeBoundData.assetsByStatus.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </Card>




                    {/* Total Incidents on Locations Pie Chart */}
                    {/* <Card title="Total Incidents on Locations"  tooltipContent="Count of tickets categorized by locations.">
                      {timeBoundData.totalIncidentsOnLocations && (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={timeBoundData.totalIncidentsOnLocations}
                              dataKey="incident_count"
                              nameKey="location_name"
                              outerRadius={100}
                              fill="#4b5563"
                              label
                            >
                              {timeBoundData.totalIncidentsOnLocations.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </Card> */}

                    <Card title="Total Tickets by Location and Sub Location" tooltipContent="Inner pie chart represents sublocations. Outer pie chart represents locations">
                      {timeBoundData.totalIncidentsOnLocations && timeBoundData.totalIncidentsOnSubLocations && (
                        <ResponsiveContainer width="100%" height={500}>
                          <PieChart>
                            {/* Outer Pie for Locations */}
                            <Pie
                              data={timeBoundData.totalIncidentsOnLocations}
                              dataKey="incident_count"
                              nameKey="location_name"
                              cx="50%"
                              cy="50%"
                              outerRadius={60}
                              fill="#8884d8"
                            >
                              {timeBoundData.totalIncidentsOnLocations.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            {/* Inner Pie for Sub-Locations */}
                            <Pie
                              data={timeBoundData.totalIncidentsOnSubLocations}
                              dataKey="incident_count"
                              nameKey="sub_location_name"
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={90}
                              fill="#82ca9d"

                            >
                              {timeBoundData.totalIncidentsOnSubLocations.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </Card>



                  </div>

                </div>

              </div>
            )}

            {activeTab === "nonTimeBound" && (
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-4">Efficiency</h3>

                <div className='max-h-[60vh] overflow-y-auto'>


                  {/* Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <Card title="Average Response Time (hrs)" tooltipContent="The average time in which the users launched ticket will be assigned to the relevant personel and notified back to user.">
                      <p className="text-lg font-bold">
                        {nonTimeBoundData.averageResponseTime?.[0]?.["time (hrs)"] || 0}
                      </p>
                    </Card>
                    <Card title="Average Ticket Closing Time (hrs)" tooltipContent="The average time it takes for the investigation report to be approved.">
                      <p className="text-lg font-bold">
                        {nonTimeBoundData.averageTicketClosingTime?.[0]?.["time (hrs)"] || 0}
                      </p>
                    </Card>
                    <Card title="Average Ticket Lifecycle (hrs)" tooltipContent="The average time it takes to close a ticket from user launching till ticket closure.">
                      <p className="text-lg font-bold">
                        {nonTimeBoundData.averageTicketLifecycle?.[0]?.["time (hrs)"] || 0}
                      </p>
                    </Card>
                  </div>

                  {/* Charts */}
                  <div>
                    <Card title="Efficiency by Team" tooltipContent="A percentage value calculated based on how quickly and efficiently a particular action team is resolving issues">
                      {nonTimeBoundData.efficiency && (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={nonTimeBoundData.efficiency}>
                            <XAxis dataKey="action_team_name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="efficiency_value"
                              fill="#4b5563"
                              // Disable hover effect
                              isAnimationActive={false} // Prevents hover animation
                              activeDot={false} // Removes active dot hover effect
                              onMouseEnter={() => { }} // Prevent hover color change
                            >
                              {nonTimeBoundData.efficiency.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "user" && (
              <div>
                {!error ? (
                  <div>
                    <div className="flex justify-between items-center mb-2 p-4">
                      <h3 className="text-xl font-semibold">User</h3>
                      <Select
                        value={selectedUserDateRange}
                        onChange={(value) => handleUserDateRangeChange(value)}
                        className="w-48"
                      >
                        {dateOptions.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.text}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    <Table
                      dataSource={userTickets}
                      columns={[
                        {
                          title: "User",
                          dataIndex: "user_name",
                          key: "user_name",
                        },
                        {
                          title: "Total Tickets",
                          dataIndex: "tickets",
                          key: "tickets",
                        },
                        {
                          title: "Asset(s) Assigned",
                          dataIndex: "assets",
                          key: "assets",
                        },
                      ]}
                      rowKey="user_name"
                      pagination={{ pageSize: 10 }}
                    />
                  </div>
                ) : (
                  <Typography.Text type="danger">{error}</Typography.Text>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="loader border-t-transparent border-4 border-gray-400 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

    </div>
  );
};
const Card = ({ title, tooltipContent, children }) => {
  return (
    <div className="relative bg-white border border-gray-300 rounded-lg p-4">
      {title && <h3 className="text-md font-semibold text-gray-700 mb-2">{title}</h3>}

      {/* Question Icon */}
      <span className="absolute top-2 right-2">
        <label className="group inline-block">
          <FaQuestionCircle className="text-gray-500 text-lg hover:text-sky-500 cursor-pointer" />
          <div className="absolute right-0 mt-2 w-64 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {tooltipContent || ""}
          </div>
        </label>
      </span>

      {/* Card Content */}
      <div>{children}</div>
    </div>
  );
};




export default Dashboard;
