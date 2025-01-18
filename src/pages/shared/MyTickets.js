import React, { useEffect, useState } from "react";
import axios from "axios";
import { Divider } from "antd";
import { FaImage } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import constants from "../../const";
const MyTickets = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image modal
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  // Fetch reports from the API
  const fetchReports = async () => {
    try {
      const jwtToken = sessionStorage.getItem("jwt");
      const userId = sessionStorage.getItem("userId");

      const response = await axios.get(
        `${constants.API.BASE_URL}/ticket/dashboard/${userId}/reports`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setReports(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="flex flex-col max-h-[80vh] px-4 py-8">
      <h2 className="text-2xl text-center lg:text-left font-semibold mb-4 px-4 py-2">My Tickets</h2>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="loader border-t-transparent border-4 border-gray-400 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && reports.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-10 px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-primary mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 10h18M9 21h6M9 3h6m-7 8h8m-4 4v6"
            />
          </svg>
          <p className="text-gray-700 text-lg font-semibold">No Tickets</p>
          <p className="text-gray-500 text-sm text-center mt-2">
            You have no active tickets. <button 
            onClick={()=>navigate('/launch-ticket')}
            className="text-primary underline"> Launch ticket</button>
          </p>
        </div>
      )}


      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="fixed w-64 h-70 bg-transparent rounded-lg p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center h-full">
              <img src={selectedImage} alt="Image" className="max-w-full max-h-full rounded" />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 max-h-[70vh] overflow-y-auto px-4 mr-6">
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report.user_report_id}
              className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold mb-1 text-sky-700">{report.asset_no}</h3>

              <p className="text-sm text-gray-500 font-semibold mb-2">{report.asset_name}</p>

              <p className="text-sm text-gray-700">
                <strong>Description:</strong> {report.report_description}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Criticality: </strong>
                <span
                  className={`$ {
                                        report.incident_criticality_level === 'low'
                                            ? 'text-emerald-800 font-semibold'
                                            : report.incident_criticality_level === 'high'
                                                ? 'text-yellow-800 font-semibold'
                                                : 'text-red-800 font-semibold'
                                    }`}
                >
                  {report.incident_criticality_level.charAt(0).toUpperCase() + report.incident_criticality_level.slice(1).toLowerCase()}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                <strong>Status: </strong>
                <span
                  className={`$ {
                                        report.status === 'open'
                                            ? 'text-emerald-800 font-semibold'
                                            : report.status === 'completed'
                                                ? 'text-gray-800 font-semibold'
                                                : 'text-red-800 font-semibold'
                                    }`}
                >
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1).toLowerCase()}
                </span>
              </p>

              <p className="text-sm text-gray-700">
                <strong>Sub-location:</strong> {report.sub_location_name}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Date:</strong> {report.date_time}
              </p>

              <Divider />

              <div className="flex justify-between">
                <p className="text-sm text-gray-700 mt-2">
                  <strong># Ticket ID:</strong>
                  <span className="bg-sky-100 text-sky-700 px-2 py-1 rounded-md ml-2">
                    {report.user_report_id}
                  </span>
                </p>

                <div className="flex justify-end space-x-2">
                  {report.image ? (
                    <button
                      onClick={() => setSelectedImage(report.image)}
                      type="button"
                      className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-sky-200 transition"
                    >
                      <FaImage />
                    </button>
                  ) : (
                    <p
                      className="px-3 py-1 bg-red-100 text-gray-700 font-semibold rounded"
                    >
                      No Image
                    </p>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
