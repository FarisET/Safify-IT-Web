import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const getRandomColor = () => {
  const colors = ['bg-gray-500', 'bg-red-500', 'bg-purple-500', 'bg-yellow-500'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const TeamsCard = ({ teams }) => {

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();


  const filteredTeams = Array.isArray(teams)
    ? teams.filter((team) =>
      team.action_team_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];
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
              key={team.action_team_id}
              className="flex items-center p-4 border-b hover:bg-gray-100 transition duration-200 ease-in-out cursor-pointer"
            >
              <div
                className={`${getRandomColor()} text-white flex items-center justify-center w-10 h-10 rounded-full mr-4`}
              >
                {team.action_team_name.charAt(0)}
              </div>
              <span className="text-gray-900 font-medium">{team.action_team_name}</span>
            </div>
          ))
        ) : (
          <div className="p-4 text-gray-500 text-center">No teams found</div>
        )}
      </div>

      {/* Add New Team Button */}
      <button
        className="flex items-center justify-center w-full gap-2 py-4 border-t cursor-pointer hover:bg-gray-100 transition duration-200 ease-in-out"
        onClick={() =>
          navigate("/users-directory", { state: { role: "action team" } })
        }
      >
        Add New Team +
      </button>
    </div>
  );
};

export default TeamsCard;
