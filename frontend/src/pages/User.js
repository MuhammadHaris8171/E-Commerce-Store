import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backend_url from '../config/config';

const User = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  // const [departments, setDepartments] = useState([]) .;
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: '',
    branch: '',
    departments: [],
    loginPin: '',
    biometricId: ''
  });
  console.log(users)
  const [branches,setBranches] = useState([])

  const fetchUsers = async () => {
    const res = await axios.get(`${backend_url}/users`);
    setUsers(res.data);
  };

 const fetchRolesAndBranches = async () => {
  const [rolesRes, branchesRes] = await Promise.all([
    axios.get(`${backend_url}/roles`),
    axios.get(`${backend_url}/branch`) // <-- assuming you have a branches API
  ]);
  setRoles(rolesRes.data);
  setBranches(branchesRes.data);
};

useEffect(() => {
  fetchUsers();
  fetchRolesAndBranches();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    if (formData.name.trim()) {
      await axios.post(`${backend_url}/users`, formData);
      resetForm();
      fetchUsers();
    }
  };

  const handleUpdateUser = async () => {
    if (formData.name.trim() && currentUserId) {
      await axios.put(`${backend_url}/users/${currentUserId}`, formData);
      resetForm();
      fetchUsers();
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      await axios.delete(`${backend_url}/users/${id}`);
      fetchUsers();
    }
  };

  const openEditModal = (user) => {
    setEditMode(true);
    setCurrentUserId(user._id);
    setFormData({
      name: user.name,
      username: user.username || '',
      email: user.email || '',
      password: '', // leave blank for edit
      role: user.role,
      branch: user.branch,
      departments: (user.departments || []).map(dep => (typeof dep === 'object' ? dep._id : dep)),
      loginPin: user.loginPin,
      biometricId: user.biometricId
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
      role: '',
      branch: '',
      departments: [],
      loginPin: '',
      biometricId: ''
    });
    setShowModal(false);
    setEditMode(false);
    setCurrentUserId(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Users</h2>
        <button
          className="bg-[#735dff] text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          Add User
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-1/2">
            <h3 className="text-lg font-semibold mb-4">
              {editMode ? 'Edit User' : 'Add New User'}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="border p-2 rounded"
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </select>

             <select
  name="branch"
  value={formData.branch}
  onChange={handleChange}
  className="border p-2 rounded"
>
  <option value="">Select Branch</option>
  {branches.map((branch) => (
    <option key={branch._id} value={branch._id}>
      {branch.name}
    </option>
  ))}
</select>


              {/* <div className="col-span-2">
                <label className="block font-medium mb-1">Departments</label>
                <div className="grid grid-cols-2 gap-2">
                  {departments.map((dept) => (
                    <label key={dept._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={dept._id}
                        checked={formData.departments.includes(dept._id)}
                        onChange={(e) => {
                          const selected = formData.departments.includes(dept._id)
                            ? formData.departments.filter(id => id !== dept._id)
                            : [...formData.departments, dept._id];
                          setFormData(prev => ({ ...prev, departments: selected }));
                        }}
                      />
                      <span>{dept.name}</span>
                    </label>
                  ))}
                </div>
              </div> */}

              <input
                type="text"
                name="loginPin"
                value={formData.loginPin}
                onChange={handleChange}
                placeholder="Login PIN"
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="biometricId"
                value={formData.biometricId}
                onChange={handleChange}
                placeholder="Biometric ID"
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="border p-2 rounded"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border p-2 rounded"
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="border p-2 rounded"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={resetForm} className="text-gray-500">
                Cancel
              </button>
              <button
                onClick={editMode ? handleUpdateUser : handleAddUser}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {editMode ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white border mt-4">
        <thead>
          <tr>
            <th className="py-2 border-b">Name</th>
            <th className="py-2 border-b">Role</th>
            <th className="py-2 border-b">Branch</th>
            {/* <th className="py-2 border-b">Departments</th> */}
            <th className="py-2 border-b">Login PIN</th>
            <th className="py-2 border-b">Biometric</th>
            <th className="py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="py-2 border-b text-center">{user.name}</td>
              <td className="py-2 border-b text-center">{user.role?.name || user.role}</td>
              <td className="py-2 border-b text-center">{user?.branch?.name}</td>
              {/* <td className="py-2 border-b text-center">
                {(user.departments || []).map(dep => (
                  <span
                    key={dep._id || dep}
                    className="inline-block bg-gray-200 rounded px-2 py-1 m-1 text-sm"
                  >
                    {typeof dep === 'string' ? dep : dep.name}
                  </span>
                ))}
              </td> */}
              <td className="py-2 border-b text-center">{user.loginPin}</td>
              <td className="py-2 border-b text-center">{user.biometricId}</td>
              <td className="py-2 border-b text-center space-x-2">
                <button
                  onClick={() => openEditModal(user)}
                  className="text-[#735dff] hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default User;
