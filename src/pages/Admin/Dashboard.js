import React, { useEffect, useState } from 'react';
import { Pie, PieChart, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Card } from '@mui/material';
import Split from "react-split";

import axios from 'axios';
import { Divider } from 'antd';

const Dashboard = () => {
  // State for analytics data
  const [timeBoundData, setTimeBoundData] = useState({});
  const [nonTimeBoundData, setNonTimeBoundData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState('today');

  // Date filter options
  const today = new Date();
  const last30Days = new Date();
  last30Days.setDate(today.getDate() - 30); // Subtract 30 days from today
  
  const dateOptions = [
    { text: 'Today', value: today.toISOString().split('T')[0] },
    { text: 'Last 30 Days', value: last30Days.toISOString().split('T')[0] },
  ];

  // Fetch Time-Bound Analytics
  const fetchTimeBoundAnalytics = async (dateRange) => {
    try {
      const jwtToken = sessionStorage.getItem('jwt');

      let timestamp =
        dateRange === 'today'
          ? new Date().toISOString().split('T')[0]
          : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const response = await axios.get(
        `http://localhost:3001/analytics/fetchAnalyticsTimeBound?timestamp=${timestamp}`,
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

  const [activeTab, setActiveTab] = useState("timeBound");
  const COLORS = ['#4b5563', '#0284c7'];


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
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "timeBound" && (
              <div className="p-4">
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

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <Card title="Total Tickets">
                    <p className="text-lg font-bold">{timeBoundData.incidentsReported || 0}</p>
                  </Card>
                  <Card title="Tickets Resolved">
                    <p className="text-lg font-bold">{timeBoundData.incidentsResolved || 0}</p>
                  </Card>
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
                            innerRadius={80}
                            outerRadius={100}
                            paddingAngle={5}
                            fill="#4b5563"
                            label
                          >
                          {timeBoundData.totalIncidentsOnLocations.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                          </Pie>
                          <Tooltip />
                          <Legend/>
                          </PieChart>
                      </ResponsiveContainer>
                    )}
                  </Card>
                </div>

              </div>
            )}

            {activeTab === "nonTimeBound" && (
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-4">Efficiency</h3>

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
            )}
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="loader border-t-transparent border-4 border-gray-400 rounded-full w-16 h-16 animate-spin"></div>
        </div>)}

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
