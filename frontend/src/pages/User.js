import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CanCreate, CanEdit, CanDelete } from '../components/PermissionGuard';
import api from '../services/api';

const User = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: currentUser, canEdit, canDelete, isMasterAdmin } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    branch: '',
    departments: [],
    loginPin: '',
    biometricId: ''
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

 const fetchRolesAndBranches = async () => {
    try {
  const [rolesRes] = await Promise.all([
        api.get('/roles')
  ]);
  setRoles(rolesRes.data);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
};

useEffect(() => {
  fetchUsers();
  fetchRolesAndBranches();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      let emailValue = value;
      if (!emailValue.endsWith('@gmail.com')) {
        emailValue = emailValue.replace(/@.*/, '') + '@gmail.com';
      }
      setFormData(prev => ({ ...prev, [name]: emailValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddUser = async () => {
    if (formData.name.trim()) {
      try {
        await api.post('/users', formData);
        resetForm();
        fetchUsers();
      } catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to add user';
        alert('Add User Error: ' + msg);
      }
    } else {
      alert('Name is required');
    }
  };

  const handleUpdateUser = async () => {
    if (formData.name.trim() && currentUserId) {
      try {
        await api.put(`/users/${currentUserId}`, formData);
        resetForm();
        fetchUsers();
      } catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update user';
        alert('Update User Error: ' + msg);
      }
    } else {
      alert('Name is required');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      try {
        await api.delete(`/users/${id}`);
      fetchUsers();
      } catch (err) {
        alert('Delete User Error: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const openEditModal = (user) => {
    setEditMode(true);
    setCurrentUserId(user._id);
    setFormData({
      name: user.name,
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

  const openAddModal = () => {
    setEditMode(false);
    setCurrentUserId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: '',
      branch: '',
      departments: [],
      loginPin: '',
      biometricId: ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-600 mt-1">Manage all system users</p>
          {currentUser && (
            <div className="mt-2 text-sm text-gray-500">
              <span className="font-medium">Your Role:</span> {currentUser.role}
              {isMasterAdmin() && <span className="ml-2 text-blue-600">👑 Master Admin</span>}
            </div>
          )}
        </div>
        <CanCreate>
        <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          onClick={openAddModal}
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          Add User
        </button>
        </CanCreate>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
          <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biometric ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
            <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        {user.isMasterAdmin && <span className="text-xs text-blue-600">👑 Master Admin</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'master_admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : user.role === 'admin'
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.biometricId || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <CanEdit>
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                    </CanEdit>
                    <CanDelete>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </CanDelete>
                    {!canEdit() && !canDelete() && (
                      <span className="text-gray-400 text-xs">View Only</span>
                    )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editMode ? 'Edit User' : 'Add New User'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                  placeholder="Enter name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                    <option key={role._id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                  placeholder="Enter email (e.g. user@gmail.com)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              </div>

              {!editMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biometric ID</label>
                <input
                  type="text"
                  name="biometricId"
                  value={formData.biometricId}
                  onChange={handleChange}
                  placeholder="Enter biometric ID"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={resetForm}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={editMode ? handleUpdateUser : handleAddUser}
              >
                {editMode ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
