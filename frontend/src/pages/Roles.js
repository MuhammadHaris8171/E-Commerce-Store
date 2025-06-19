import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backend_url from '../config/config';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRoleId, setCurrentRoleId] = useState(null);

  const fetchRoles = async () => {
    const res = await axios.get(`${backend_url}/roles`);
    setRoles(res.data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddRole = async () => {
    if (newRole.trim()) {
      await axios.post(`${backend_url}/roles`, { name: newRole });
      setNewRole('');
      setShowModal(false);
      fetchRoles();
    }
  };

  const handleUpdateRole = async () => {
    if (newRole.trim() && currentRoleId) {
      await axios.put(`${backend_url}/roles/${currentRoleId}`, { name: newRole });
      setNewRole('');
      setCurrentRoleId(null);
      setEditMode(false);
      setShowModal(false);
      fetchRoles();
    }
  };

 const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this role?");
  if (confirmDelete) {
    await axios.delete(`${backend_url}/roles/${id}`);
    fetchRoles();
  }
};

  const openEditModal = (role) => {
    setEditMode(true);
    setCurrentRoleId(role._id);
    setNewRole(role.name);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setNewRole('');
    setCurrentRoleId(null);
  };

  return (
    <div className="p-4 z-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Roles</h2>
        <button
          className="bg-[#735dff] text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          Add Role
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              {editMode ? 'Edit Role' : 'Add New Role'}
            </h3>
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="Enter role name"
              className="w-full border p-2 mb-4 rounded"
            />
            <div className="flex justify-end gap-2">
              <button onClick={closeModal} className="text-gray-500">
                Cancel
              </button>
              <button
                onClick={editMode ? handleUpdateRole : handleAddRole}
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
            <th className="py-2 border-b">ID</th>
            <th className="py-2 border-b">Role Name</th>
            <th className="py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={role._id}>
              <td className="py-2 border-b text-center">{index + 1}</td>
              <td className="py-2 border-b text-center">{role.name}</td>
              <td className="py-2 border-b text-center space-x-2">
                <button
                  onClick={() => openEditModal(role)}
                  className="text-[#735dff] hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(role._id)}
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

export default Roles;
