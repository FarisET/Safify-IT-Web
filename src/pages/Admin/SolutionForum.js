import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaList, FaPen, FaQuestion, FaQuestionCircle, FaResolving, FaRoad, FaStepForward } from 'react-icons/fa';

const SolutionForum = () => {
  const [forumEntries, setForumEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchForumEntries = async () => {
      try {
        const jwtToken = sessionStorage.getItem('jwt');
        const response = await axios.get(
          'http://localhost:3001/solutionForum/fetchAllSolutions',
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setForumEntries(response.data);
      } catch (err) {
        setError('Failed to load forum entries');
      } finally {
        setLoading(false);
      }
    };

    fetchForumEntries();
  }, []);

  const filteredEntries = forumEntries.filter(
    (item) =>
      item.Problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Solution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (categoryFilter === 'All' || item.category === categoryFilter)
  );

  const handleStepsClick = (steps) => {
    setSelectedSteps(steps);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSteps([]);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4 text-left">Solution Forum</h2>

      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="🔍 Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-4 py-2 w-1/3"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="font-semibold text-gray-700 rounded px-2 py-2 border"
        >
          <option value="All">All</option>
          <option value="Safety">Safety</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Compliance">Compliance</option>
        </select>
      </div>

      <div className="mb-4 text-gray-700">
        {filteredEntries.length} forum entr{filteredEntries.length !== 1 ? 'ies' : 'y'}
      </div>

      <table className="table-auto w-full shadow-lg rounded-md overflow-hidden">
        <thead className="text-black text-left">
          <tr>
            <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">⚠️ Problem</th>
            <th className="px-4 py-2 border-b">💡 Solution</th>
            <th className="px-4 py-2 border-b">Asset</th>
            <th className="px-4 py-2 border-b">Reported Time</th>
            <th className="px-4 py-2 border-b flex items-center">
              Steps
              <span className="ml-2 relative group">
                <FaQuestionCircle className="fas fa-question-circle text-gray-500 text-sm hover:text-sky-500 cursor-pointer"/>
                <div className="absolute right-0 mt-2 w-64 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  Steps taken by the investigator to solve the issue
                </div>
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="text-left">
          {filteredEntries.map((item, index) => (
            <tr key={item['Ticket ID']}>
              <td className="px-4 py-2 font-semibold text-gray-700 border-b">{index + 1}</td>
              <td className="px-4 py-2 font-semibold text-gray-700 border-b">{item.Problem || 'N/A'}</td>
              <td className="px-4 py-2 font-semibold text-gray-700 border-b">{item.Solution || 'N/A'}</td>
              <td className="px-4 py-2 border-b">
                <div className="font-semibold text-sky-600">
                  {item['Asset Number'] !== 'No asset number specified' || item['Asset Name'] !== 'No asset name specified' ? (
                    <>
                      {item['Asset Number']}
                      <div className="text-sm text-gray-500 mt-1">
                        {item['Asset Name']}
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-700 font-bold">X</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-2 font-semibold text-gray-700 border-b">{item['Reported Time'] || 'N/A'}</td>
              <td className="px-4 py-2 font-semibold text-gray-700 border-b">
                {item.steps && item.steps.length > 0 ? (
                  <button
                    onClick={() => handleStepsClick(item.steps)}
                    className="text-blue-500 underline"
                  >
                    <FaList className='text-sky-600' />
                  </button>
                ) : (
                  'X'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-1/3">
            {/* Close button at the top-right */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-700 hover:text-red-600 focus:outline-none"
              aria-label="Close Modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h3 className="text-xl font-semibold mb-4 text-gray-800">Steps</h3>
            <ul className="list-decimal pl-6">
              {selectedSteps.map((step, idx) => (
                <li key={idx} className="mb-2 text-gray-700">
                  {Object.values(step)}
                </li>
              ))}
            </ul>

          </div>
        </div>
      )}

    </div>
  );
};

export default SolutionForum;
