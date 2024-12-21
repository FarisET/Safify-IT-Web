const ActionTeamsModal = ({ isOpen, onClose, onSelectTeam }) => {
    if (!isOpen) return null;
  
    const actionTeams = ['Team A', 'Team B', 'Team C']; // Replace with actual data or API fetch
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-4 w-1/3">
          <h2 className="text-xl font-bold mb-4">Select Action Team</h2>
          <ul>
            {actionTeams.map((team, index) => (
              <li key={index} className="mb-2">
                <button
                  onClick={() => {
                    onSelectTeam(team);
                    onClose();
                  }}
                  className="text-blue-600 hover:underline"
                >
                  {team}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  