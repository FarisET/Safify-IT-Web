import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import Split from "react-split";

const UsersDirectory = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("user");

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
        email: user.email,
        role: user.role_name,
        isActive: user.is_active,
      }));
      setUsers(usersData);
      setFilteredUsers(usersData.filter((user) => user.role === selectedRole));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle role selection
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setFilteredUsers(users.filter((user) => user.role === role));
  };

  // Filter users based on search term
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = users.filter(
      (user) =>
        (user.name.toLowerCase().includes(term) ||
          user.id.toLowerCase().includes(term)) &&
        user.role === selectedRole
    );
    setFilteredUsers(filtered);
  };

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="h-screen overflow-hidden border-x bg-gray-100">
      {/* Using Split for resizable panes */}
      <Split
        className="flex"
        sizes={[15, 85]} // Initial pane sizes (in percentage)
        minSize={150}
        expandToMin={true}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
      >
        {/* Left Pane: Role Types */}
        <div className="h-screen border-r border-gray-200 bg-white overflow-y-auto">
        <h2 className="text-lg font-semibold p-4 border-b">User Types</h2>
          <ul className="p-4 space-y-2">
            {["admin", "user", "action team"].map((role) => (
              <li
                key={role}
                className={`px-3 py-1 rounded flex items-center justify-between gap-2 cursor-pointer transition ${
                  selectedRole === role
                    ? "bg-gray-100 shadow"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => handleRoleChange(role)}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Pane: Users Table */}
        <div className="border-l border-gray-200 h-screen bg-white overflow-auto">
          <h2 className="text-lg font-semibold p-4 bg-gray-50 border-b">User Directory</h2>
          <div className="p-4 text-gray-700">
            <span>Total: {filteredUsers.length}</span>
          </div>
          <div className="flex items-center justify-between p-4">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="🔍 Search..."
              value={searchTerm}
              onChange={handleSearch}
              className="border rounded px-4 py-2 w-1/3"
            />
            {/* Add User Button */}
            <button className="px-3 py-1 bg-gray-100 text-md text-gray-700 font-semibold rounded hover:bg-emerald-200 transition">
              Add +
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white p-4">
            <table className="table-auto w-full shadow-md rounded-md overflow-hidden">
              <thead className="text-black text-left">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 border-b">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 border-b">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 border-b">
                    Is Active
                  </th>
                  <th className="px-6 py-3 text-center font-medium text-gray-600 border-b w-1/4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-3 text-center text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 border-b">{user.name}</td>
                      <td className="px-6 py-3 border-b">{user.id}</td>
                      <td className="px-6 py-3 border-b">
                        {user.isActive ? "Inactive" : "Active"}
                      </td>
                      <td className="px-6 py-3 border-b flex justify-end space-x-2">
                        <button
                          onClick={() => console.log("Edit user", user.id)}
                          className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
                        >
                          <span>Edit</span>
                          <FaEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => console.log("Delete user", user.id)}
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
      </Split>
    </div>
  );
};

export default UsersDirectory;
