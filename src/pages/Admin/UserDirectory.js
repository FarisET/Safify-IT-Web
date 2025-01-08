import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaIdCard, FaMailBulk, FaTrash } from "react-icons/fa";
import Split from "react-split";
import { Modal, Input, Button } from 'antd';
import { useLocation } from "react-router-dom";


const UsersDirectory = () => {
  const location = useLocation();
  const { role = "user" } = location.state || {};
  
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState(role);

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

  // Add User
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    role: "user",
    email: ""
  });
  const [addError, setAddError] = useState("");
  const [isAddLoading, setisAddLoading] = useState("");
  const [isAddSuccess, setisAddSuccess] = useState("");
  const [email, setEmail] = useState("");


  const handleOpenModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setFormData({ name: "", password: "", role: "user", email: "" });
    setAddError("");
    setisAddLoading(false);
    setisAddSuccess("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, password, role, email } = formData;

    if (!name || !role) {
      setAddError("Name and Role are required.");
      return;
    }

    try {
      setisAddLoading(true);
      const jwtToken = sessionStorage.getItem("jwt");
      await axios.post(
        "http://localhost:3001/admin/dashboard/createUser",
        {
          user_name: name,
          user_pass: password,
          role_name: role,
          user_id: email,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`
          },
        }
      );
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      setAddError("Failed to create user. Please try again.");
    } finally {
      setisAddLoading(false);
    }
  };

  // DELETE USER
  const [DeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [DeleteUsermodalMessage, setDeleteUserModalMessage] = useState(null);
  const [DeleteUserloading, setDeleteUserLoading] = useState(false);
  const [deleteUserInput, setDeleteUserInput] = useState("");
  const [userId, setuserId] = useState("");
  const [DeletUserError, setDeleteUserError] = useState(null);



  const onCloseDeleteUser = () => {
    setDeleteUserModalMessage('')
    setDeleteUserModalOpen(false);
    setDeleteUserError('');
    setDeleteUserInput('');
  }




  const handleDeleteUserSubmit = async (e) => {
    e.preventDefault();
    setDeleteUserLoading(true);
    setDeleteUserModalMessage('')
    setDeleteUserError('');

    try {
      const jwtToken = sessionStorage.getItem('jwt');
      const response = await axios.delete(
        `http://localhost:3001/admin/dashboard/deleteUser/${userId}`,

        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setDeleteUserModalMessage("User deleted successfully!");
      setTimeout(() => {
        setDeleteUserLoading(false);
        setDeleteUserModalOpen(false);
        setDeleteUserModalMessage('');
        setDeleteUserError('');
        setDeleteUserInput('');
        fetchUsers();
      }, 2000);

    } catch (error) {
      if (error.response && error.response.data.error) {
        setDeleteUserError(error.response.data.error);
      } else {
        setDeleteUserError("Failed to delete user. Please try again.");
      }
    } finally {
      setDeleteUserLoading(false);
    }

  }

  const handleDeleteUserClick = (user_id) => {
    setuserId(user_id);
    setDeleteUserModalOpen(true);
  };

  //----------------X------------------

  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [editUserModalMessage, setEditUserModalMessage] = useState(null);
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [editUserInput, setEditUserInput] = useState({ userId: "", userName: "", roleName: "" });
  const [editUserError, setEditUserError] = useState(null);

  const handleEditUser = async (e) => {
    e.preventDefault();
    setEditUserLoading(true);
    try {
      const jwtToken = sessionStorage.getItem('jwt');

      const response = await axios.put(
        'http://localhost:3001/admin/dashboard/updateUser',
        {
          user_id: editUserInput.userId,
          user_name: editUserInput.userName,
          role_name: editUserInput.roleName,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setEditUserModalMessage("User updated successfully");
      fetchUsers();
      handleCloseEditUserModal();
    } catch (error) {
      // Set error message
      setEditUserError("Failed to update user. Please try again.");
    } finally {
      // Stop the loading spinner
      setEditUserLoading(false);
    }
  };


  const handleCloseEditUserModal = (e) => {
    e.preventDefault();
    setEditUserModalOpen(false);
    setEditUserInput({ userId: "", userName: "", roleName: "" });
    setEditUserError(null);
    setEditUserModalMessage('');
  };

  //Update User ID
  const [changeEmailModalOpen, setChangeEmailModalOpen] = useState(false);
  const [changeEmailInput, setChangeEmailInput] = useState({ userId: "", newEmail: "" });
  const [changeEmailLoading, setChangeEmailLoading] = useState(false);
  const [changeEmailError, setChangeEmailError] = useState(null);
  const [changeEmailMessage, setChangeEmailMessage] = useState(null);

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    if (changeEmailInput.userId == changeEmailInput.newEmail) {
      setChangeEmailError("New email cannot be the same as the old email.");
      return;
    }

    setChangeEmailLoading(true);
    try {
      const jwtToken = sessionStorage.getItem('jwt');
      const response = await axios.put(
        'http://localhost:3001/admin/dashboard/updateUserID',
        {
          user_id_old: changeEmailInput.userId,
          user_id_new: changeEmailInput.newEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setChangeEmailMessage("Email updated successfully");
      fetchUsers();
      handleCloseChangeEmailModal();
    } catch (error) {
      setChangeEmailError("Failed to update email. Please try again.");
    } finally {
      setChangeEmailLoading(false);
    }
  };

  const handleCloseChangeEmailModal = () => {
    setChangeEmailModalOpen(false);
    setChangeEmailInput({ userId: "", newEmail: "" });
    setChangeEmailError(null);
  };



  return (
    <div className="h-screen overflow-hidden border-x bg-gray-100">
      {/* Using Split for resizable panes */}
      <Split
        className="flex"
        sizes={[15, 85]} // Initial pane sizes (in percentage)
        minSize={150}
        expandToMin={true}
        gutterSize={7}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        gutter={(index, direction) => {
          const gutter = document.createElement('div');
          gutter.className = `gutter ${direction === 'horizontal' ? 'cursor-ew-resize' : 'cursor-ns-resize'}`;
          return gutter;
        }}
      >
        {/* Left Pane: Role Types */}
        <div className="h-screen border-r border-gray-200 bg-white overflow-y-auto">
          <h2 className="text-lg font-semibold p-4 border-b">User Types</h2>
          <ul className="p-4 space-y-2">
            {["admin", "user", "action team"].map((role) => (
              <li
                key={role}
                className={`px-3 py-1 rounded flex items-center justify-between gap-2 cursor-pointer transition ${selectedRole === role
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
            <button
              onClick={handleOpenModal}

              className="px-3 py-1 bg-gray-100 text-md text-gray-700 font-semibold rounded hover:bg-emerald-200 transition">
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
                          onClick={() => {
                            setChangeEmailInput({ userId: user.id, newEmail: "" });
                            setChangeEmailModalOpen(true);
                          }
                          }
                          className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-emerald-200 transition whitespace-nowrap"
                        >
                          <span>Change email</span>
                          <FaIdCard className="text-sm" />
                        </button>
                        <button
                          onClick={() => {
                            setEditUserInput({ userId: user.id, userName: user.name, roleName: user.role });
                            setEditUserModalOpen(true);

                          }}
                          className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-sm text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
                        >
                          <span>Edit</span>
                          <FaEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteUserClick(user.id)}
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

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-lg font-semibold mb-4">Add New User</h2>

            {isAddLoading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
            {isAddSuccess && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{isAddSuccess}</p>}
            {addError && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{addError}</p>}

            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">User Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border rounded px-4 py-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="border rounded px-4 py-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Password (Optional)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="border rounded px-4 py-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="border rounded px-4 py-2 w-full"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="action_team">Action Team</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Asset Type Modal */}
      {DeleteUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Disable User</h2>
            <div className="space-y-2 mb-4">
              <p className="text-md">
                Are you sure you want to disable user:
                <span className="font-semibold"> {userId}</span>
              </p>
              <p className="text-sm text-red-600 font-semibold">
                Warning: All assets assigned to this user will be forcibly
                unassigned.
              </p>

            </div>


            <form className="space-y-4">
              {DeleteUserloading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
              {DeleteUsermodalMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{DeleteUsermodalMessage}</p>}
              {DeletUserError && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{DeletUserError}</p>}

              {/* Input Field for Confirmation */}
              <div>
                <label htmlFor="delete-confirm" className="block text-gray-700">
                  Type <strong className='text-red-500 font-semibold'>DISABLE</strong> to confirm:
                </label>
                <input
                  type="text"
                  id="delete-confirm"
                  value={deleteUserInput}
                  onChange={(e) => setDeleteUserInput(e.target.value)}
                  className="w-full border p-2 rounded mt-2"
                  placeholder="DISABLE"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => onCloseDeleteUser()}
                  className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                >
                  No
                </button>
                {deleteUserInput === "DISABLE" && (
                  <button
                    type="button"
                    onClick={handleDeleteUserSubmit}
                    disabled={DeleteUserloading}
                    className={`px-3 py-1 bg-gray-100 rounded font-semibold text-gray-700 transition ${DeleteUserloading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-emerald-200"
                      }`}
                  >
                    Yes
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {editUserModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-lg font-semibold mb-4">Edit User</h2>

            {editUserLoading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
            {editUserModalMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{editUserModalMessage}</p>}
            {editUserError && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{editUserError}</p>}

            <form onSubmit={handleEditUser}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">New Username</label>
                <input
                  type="text"
                  value={editUserInput.userName}
                  onChange={(e) => setEditUserInput({ ...editUserInput, userName: e.target.value })
                  }
                  className="border rounded px-4 py-2 w-full"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium">Role</label>
                <select
                  value={editUserInput.roleName}
                  onChange={(e) => setEditUserInput({ ...editUserInput, roleName: e.target.value })}
                  className="border rounded px-4 py-2 w-full"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="action team">Action Team</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseEditUserModal}
                  className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
                >
                  Edit User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {changeEmailModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-lg font-semibold mb-4">Change Email</h2>

            {changeEmailLoading && <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>}
            {changeEmailMessage && <p className="mb-4 p-3 rounded text-emerald-600 bg-emerald-100">{changeEmailMessage}</p>}
            {changeEmailError && <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{changeEmailError}</p>}

            <form onSubmit={handleChangeEmail}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Old Email</label>
                <input
                  type="text"
                  value={changeEmailInput.userId}
                  onChange={(e) => setChangeEmailInput({ ...changeEmailInput, userId: e.target.value })}
                  className="border rounded px-4 py-2 w-full bg-gray-200 text-gray-700 cursor-not-allowed"
                  readOnly
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium">New Email</label>
                <input
                  type="text"
                  value={changeEmailInput.newEmail}
                  onChange={(e) => setChangeEmailInput({ ...changeEmailInput, newEmail: e.target.value })
                  }
                  className="border rounded px-4 py-2 w-full"
                  required
                />
              </div>


              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseChangeEmailModal}
                  className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
                >
                  Change Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UsersDirectory;
