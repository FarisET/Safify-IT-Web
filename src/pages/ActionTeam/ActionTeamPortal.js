import React, { useEffect, useState } from "react";
import axios from "axios";
import { Divider } from "antd";
import { FaImage } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import constants from "../../const";
const ActionTeamPortal = ({ ticketID, taskID }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //Image
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    // Fetch assigned tasks from the API
    const fetchAssignedReports = async () => {
        try {
            // Fetch JWT token from localStorage
            const jwtToken = localStorage.getItem("jwt");
            const userId = localStorage.getItem("userId");

            const response = await axios.get(
                `${constants.API.BASE_URL}/userReport/dashboard/${userId}/reports`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );

            setTasks(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch tasks on component mount
    useEffect(() => {
        fetchAssignedReports();
    }, []);

    return (
        <div className="flex flex-col  max-h-[90vh]">
            <h2 className="text-2xl font-semibold mb-4 px-4 py-2">My Tickets</h2>

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="loader border-t-transparent border-4 border-gray-400 rounded-full w-16 h-16 animate-spin"></div>
                </div>
            )}

            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-10 px-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5h6M9 9h6m-6 4h6m-7 4h8M5 5h.01M5 9h.01M5 13h.01"
                        />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">No tasks assigned.</p>
                    <p className="text-gray-400 text-sm">
                        You currently have no tasks. Please check back later.
                    </p>
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
                            <img src={selectedImage} alt="Image" className="max-w-full max-h-full rounded" crossOrigin="anonymous"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 max-h-[70vh] overflow-y-auto px-4 mr-6">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {tasks.map((task) => (
                        <div
                            key={task.assigned_task_id}
                            className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
                        >
                            <h3 className="text-lg font-bold mb-1 text-sky-700">{task.asset_no}</h3>

                            <p className="text-sm text-gray-500 font-semibold mb-2">{task.asset_name}</p>

                            <p className="text-sm text-gray-700">
                                <strong>Description:</strong> {task.report_description}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>Criticality: </strong>
                                <span
                                    className={`${task.status === 'low'
                                        ? 'text-emerald-800 font-semibold'
                                        : task.status === 'high'
                                            ? 'text-yellow-800 font-semibold'
                                            : 'text-red-800 font-semibold'
                                        }`}
                                >
                                    {task.incident_criticality_level.charAt(0).toUpperCase() + task.incident_criticality_level.slice(1).toLowerCase()}

                                </span>
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>Status: </strong>
                                <span
                                    className={`${task.status === 'approved'
                                        ? 'text-emerald-800 font-semibold'
                                        : task.status === 'approval pending'
                                            ? 'text-yellow-800 font-semibold'
                                            : 'text-red-800 font-semibold'
                                        }`}
                                >
                                    {task.status.charAt(0).toUpperCase() + task.status.slice(1).toLowerCase()}

                                </span>
                            </p>

                            <p className="text-sm text-gray-700">
                                <strong>Sub-location:</strong> {task.sub_location_name}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>Date of Assignment:</strong> {task.date_of_assignment}
                            </p>

                            <Divider />

                            <div className="flex justify-between">

                                <p className="text-sm text-gray-700 mt-2">
                                    <strong># Ticket ID:</strong>
                                    <span className="bg-sky-100 text-sky-700 px-2 py-1 rounded-md ml-2">
                                        {task.user_report_id}
                                    </span>
                                </p>

                                <div className="flex justify-end space-x-2">
                                    {task.image ? (

                                        <button
                                            onClick={() => setSelectedImage(task.image)}
                                            type="button"
                                            className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-sky-200 transition"
                                        >
                                            <FaImage />
                                        </button>
                                    ) : <p
                                        className="px-3 py-1 bg-red-100 text-gray-700 font-semibold rounded"
                                    >
                                        No Image
                                    </p>}
                                    {task.status != 'approved' && (
                                        <button
                                            onClick={() => navigate('/action-form', { state: { user_report_id: task.user_report_id } })}
                                            type="submit"
                                            className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
                                        >
                                            Take Action
                                        </button>

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

export default ActionTeamPortal;
