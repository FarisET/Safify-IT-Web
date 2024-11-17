import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

const teamsList = [
  { id: 1, name: 'Development' },
  { id: 2, name: 'Marketing' },
  { id: 3, name: 'HR' },
  { id: 4, name: 'Finance' },
  { id: 5, name: 'Support' },
  { id: 6, name: 'Sales' },
  { id: 7, name: 'Design' },
  { id: 8, name: 'Operations' },
];

const getRandomColor = () => {
  const colors = ['bg-gray-500','bg-red-500', 'bg-purple-500', 'bg-yellow-500'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const TeamsCard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeams = teamsList.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-50">
      {/* Search Bar */}
      <div className="p-4 border-b">
        <h2 className="font-semibold text-gray-800 mb-2">Teams</h2>
        <input
          type="text"
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Teams List */}
      <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <div
              key={team.id}
              className="flex items-center p-4 border-b hover:bg-gray-100 transition duration-200 ease-in-out cursor-pointer"
            >
              <div
                className={`${getRandomColor()} text-white flex items-center justify-center w-10 h-10 rounded-full mr-4`}
              >
                {team.name.charAt(0)}
              </div>
              <span className="text-gray-900 font-medium">{team.name}</span>
            </div>
          ))
        ) : (
          <div className="p-4 text-gray-500 text-center">No teams found</div>
        )}
      </div>

      {/* Add New Team Button */}
      <div
        className="flex items-center justify-center gap-2 p-4 border-t cursor-pointer hover:bg-gray-100 transition duration-200 ease-in-out"
        onClick={() => alert('Add new team')}
      >
        <FaPlus className="text-blue-500" />
        <span className="text-blue-500 font-semibold">Add New Team</span>
      </div>
    </div>
  );
};

export default TeamsCard;
