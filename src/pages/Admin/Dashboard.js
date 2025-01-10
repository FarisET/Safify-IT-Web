import React, { useEffect, useState } from 'react';
import { Pie, PieChart, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
// import { Card } from '@mui/material';
import Split from "react-split";

import axios from 'axios';
import { Divider } from 'antd';

const Dashboard = () => {
  // State for analytics data
  const [timeBoundData, setTimeBoundData] = useState({});
  const [nonTimeBoundData, setNonTimeBoundData] = useState({});

  // Date filter options
  const today = new Date();
  const [selectedDateRange, setSelectedDateRange] = useState(today.toISOString().split('T')[0]);

  const last7Days = new Date();
  const last15Days = new Date();
  const last30Days = new Date();
  const last365Days = new Date();

  last7Days.setDate(today.getDate() - 7);
  last15Days.setDate(today.getDate() - 15);
  last30Days.setDate(today.getDate() - 30);
  last365Days.setDate(today.getDate() - 365);

  const dateOptions = [
    { text: 'Today', value: today.toISOString().split('T')[0] },
    { text: 'Last 7 Days', value: last7Days.toISOString().split('T')[0] },
    { text: 'Last 15 Days', value: last15Days.toISOString().split('T')[0] },
    { text: 'Last Month', value: last30Days.toISOString().split('T')[0] },
    { text: 'Last Year', value: last365Days.toISOString().split('T')[0] },
  ];

  // Fetch Time-Bound Analytics
  const fetchTimeBoundAnalytics = async (dateRange) => {
    try {
      const jwtToken = sessionStorage.getItem('jwt');

      let dataRange = dateRange;

      const response = await axios.get(
        `http://localhost:3001/analytics/fetchAnalyticsTimeBound?timestamp=${dataRange}`,
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
  const handleDateRangeChange = (e) => {
    setSelectedDateRange(e.target.value);
    fetchTimeBoundAnalytics(e.target.value);
  };

  // Initial data load
  useEffect(() => {
    fetchTimeBoundAnalytics(selectedDateRange);
    fetchNonTimeBoundAnalytics();
  }, []);

  const [activeTab, setActiveTab] = useState("nonTimeBound");
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


  const COLORS_NEEDLE = ['#10b981', '#f59e0b', '#ef4444'];


  const RADIAN = Math.PI / 180;

  const cx = 180;
  const cy = 100;
  const iR = 50;
  const oR = 100;
  const value = 50;

  const needle = (data, cx, cy, iR, oR, color) => {
    // Ensure data is valid
    if (!Array.isArray(data) || data.length === 0) return null;

    // Calculate total tickets
    const total = data.reduce((sum, entry) => sum + entry["Ticket Count"], 0);

    // Find the criticality with the highest count
    const maxEntry = data.reduce((max, entry) =>
      entry["Ticket Count"] > max["Ticket Count"] ? entry : max
    );

    // Calculate the cumulative sum up to the midpoint of the largest segment
    let cumulativeSum = 0;
    for (const entry of data) {
      if (entry === maxEntry) {
        cumulativeSum += entry["Ticket Count"] / 2;
        break;
      }
      cumulativeSum += entry["Ticket Count"];
    }

    // Calculate the angle for the needle
    const ang = 180.0 * (1 - cumulativeSum / total);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = 5;

    // Calculate needle points
    const x0 = cx;
    const y0 = cy;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;

    return [
      <circle key="circle" cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
      <path
        key="path"
        d={`M${xba},${yba} L${xbb},${ybb} L${xp},${yp} Z`}
        fill={color}
        stroke="none"
      />,
    ];
  };

  //user tickets
  const [userTickets, setUserTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserTickets = async () => {
      setLoading(true);
      try {
        const jwtToken = sessionStorage.getItem("jwt");
        const response = await axios.get(
          'http://localhost:3001/fetchTotalTicketsByUser',
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );
        setUserTickets(response.data);
      } catch (error) {
        setError("Failed to fetch user tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "user") {
      fetchUserTickets();
    }
  }, [activeTab]);





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
                  <select
                    value={selectedDateRange}
                    onChange={handleDateRangeChange}
                    className="font-medium text-gray-700 rounded-lg px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  >
                    {dateOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.text}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='max-h-[60vh] overflow-y-auto overflow-x-auto max-w-[90vw]'>

                  {/* Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <Card title="Total Tickets">
                      <p className="text-lg font-bold">{timeBoundData.incidentsReported || 0}</p>
                    </Card>
                    <Card title="Tickets Resolved">
                      <p className="text-lg font-bold">{timeBoundData.incidentsResolved || 0}</p>
                    </Card>

                    {timeBoundData.totalTicketsByIncidentCriticality && (
                      <div className=''>
                        <ResponsiveContainer width="100%" height={140}>

                          <PieChart >
                            <Pie
                              dataKey="Ticket Count"
                              nameKey="Criticality Level"
                              startAngle={180}
                              endAngle={0}
                              data={timeBoundData.totalTicketsByIncidentCriticality}
                              cx={cx}
                              cy={cy}
                              innerRadius={iR}
                              outerRadius={oR}
                              fill="#8884d8"
                              stroke="none"
                              label

                            >
                              {timeBoundData.totalTicketsByIncidentCriticality.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS_NEEDLE[index % COLORS_NEEDLE.length]} />
                              ))}
                            </Pie>
                            {needle(
                              timeBoundData?.totalTicketsByIncidentCriticality || [],
                              cx,
                              cy,
                              iR,
                              oR,
                              '#000'
                            )}
                            <Legend />

                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                    )}

                  </div>




                  {/* Charts */}
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Assets by Status Bar Chart */}
                    <Card title="Assets by Status">
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
                    <Card title="Total Incidents on Locations">
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
                    <Card title="Average Response Time (hrs)">
                      <p className="text-lg font-bold">
                        {nonTimeBoundData.averageResponseTime?.[0]?.["time (hrs)"] || 0}
                      </p>
                    </Card>
                    <Card title="Average Ticket Closing Time (hrs)">
                      <p className="text-lg font-bold">
                        {nonTimeBoundData.averageTicketClosingTime?.[0]?.["time (hrs)"] || 0}
                      </p>
                    </Card>
                    <Card title="Average Ticket Lifecycle (hrs)">
                      <p className="text-lg font-bold">
                        {nonTimeBoundData.averageTicketLifecycle?.[0]?.["time (hrs)"] || 0}
                      </p>
                    </Card>
                  </div>

                  {/* Charts */}
                  <div>
                    <Card title="Efficiency by Team">
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
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {!loading && !error && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Total Tickets</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTickets.map((ticket) => (
                        <tr key={ticket.user_id}>
                          <td>{ticket.user_name}</td>
                          <td>{ticket.total_tickets}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
const Card = ({ children, title }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      {title && <h3 className="text-md font-semibold text-gray-700 mb-2">{title}</h3>}
      {children}
    </div>
  );
};



export default Dashboard;
