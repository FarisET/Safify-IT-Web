import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const UsersDirectory = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Fetch users on component mount
  const fetchUsers = async () => {
    try {
      const jwtToken = sessionStorage.getItem("jwt");
      const response = await axios.get(
        "http://localhost:3001/admin/dashboard/fetchUsers",
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      const usersData = response.data.map((user) => ({
        id: user.user_id,
        name: user.user_name,
      }));
      setUsers(usersData);
      setFilteredUsers(usersData); // Initially, no filtering
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Filter users based on search term
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) || user.id.toString().includes(term)
    );
    setFilteredUsers(filtered);
  };

  // Handle Edit user
  const handleEditUser = (userId) => {
    console.log("Edit user with ID:", userId);
    // Add your logic for editing the user
  };

  // Handle Delete user
  const handleDeleteUser = (userId) => {
    console.log("Delete user with ID:", userId);
    // Add your logic for deleting the user
  };

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4 text-left">User Directory</h2>

      {/* Total Users Count */}
      <div className="mb-4 text-gray-700">
        <span>Total Users: {filteredUsers.length}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="🔍 Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="border rounded px-4 py-2 w-1/3"
        />

        {/* Add User Button */}
        <button
          // onClick={handleAddUser}  // Function to handle adding a user
          className="px-3 py-1 bg-gray-100 text-md text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
        >
          Add User +
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="table-auto w-full shadow-lg rounded-md overflow-hidden">
          <thead className="text-black text-left">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600 border-b">Username</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600 border-b">Email</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600 border-b">Is Active</th>
              <th className="px-6 py-3 text-center font-medium text-gray-600 border-b w-1/4">Action</th> {/* Set a fixed width */}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-3 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 border-b">{user.name}</td>
                  <td className="px-6 py-3 border-b">{user.id}</td>
                  <td className="px-6 py-3 border-b">Active</td>
                  <td className="px-6 py-3 border-b flex justify-end space-x-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEditUser(user.id)}
                      className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
                    >
                      <span>Edit</span>
                      <FaEdit className="text-sm" />
                    </button>

                    {/* Disable Button */}
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                    >
                      <span>Disable</span>
                      <FaTrash className="text-sm" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersDirectory;
