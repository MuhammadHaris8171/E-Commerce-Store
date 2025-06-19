import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backend_url from '../config/config';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [newDepartment, setNewDepartment] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDepartmentId, setCurrentDepartmentId] = useState(null);

  // Fetch departments
  const fetchDepartments = async () => {
    const res = await axios.get(`${backend_url}/departments`);
    setDepartments(res.data);
  };

  // Fetch branches
  const fetchBranches = async () => {
    const res = await axios.get(`${backend_url}/branch`);
    setBranches(res.data);
  };

  useEffect(() => {
    fetchDepartments();
    fetchBranches();
  }, []);

  const handleAddDepartment = async () => {
    if (newDepartment.trim() && selectedBranch) {
      await axios.post(`${backend_url}/departments`, {
        name: newDepartment,
        branch: selectedBranch,
      });
      resetForm();
      fetchDepartments();
    }
  };

  const handleUpdateDepartment = async () => {
    if (newDepartment.trim() && currentDepartmentId && selectedBranch) {
      await axios.put(`${backend_url}/departments/${currentDepartmentId}`, {
        name: newDepartment,
        branch: selectedBranch,
      });
      resetForm();
      fetchDepartments();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      await axios.delete(`${backend_url}/departments/${id}`);
      fetchDepartments();
    }
  };

  const openEditModal = (dept) => {
    setEditMode(true);
    setCurrentDepartmentId(dept._id);
    setNewDepartment(dept.name);
    setSelectedBranch(dept.branch?._id || '');
    setShowModal(true);
  };

  const resetForm = () => {
    setNewDepartment('');
    setSelectedBranch('');
    setCurrentDepartmentId(null);
    setEditMode(false);
    setShowModal(false);
  };

  return (
    <div className="p-4 z-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Departments</h2>
        <button
          className="bg-[#735dff] text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          Add Department
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              {editMode ? 'Edit Department' : 'Add New Department'}
            </h3>

            <input
              type="text"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              placeholder="Enter department name"
              className="w-full border p-2 mb-4 rounded"
            />

            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={resetForm} className="text-gray-500">
                Cancel
              </button>
              <button
                onClick={editMode ? handleUpdateDepartment : handleAddDepartment}
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
            <th className="py-2 border-b">#</th>
            <th className="py-2 border-b">Department Name</th>
            <th className="py-2 border-b">Branch</th>
            <th className="py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept, index) => (
            <tr key={dept._id}>
              <td className="py-2 border-b text-center">{index + 1}</td>
              <td className="py-2 border-b text-center">{dept.name}</td>
              <td className="py-2 border-b text-center">{dept.branch?.name || 'N/A'}</td>
              <td className="py-2 border-b text-center space-x-2">
                <button
                  onClick={() => openEditModal(dept)}
                  className="text-[#735dff] hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(dept._id)}
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

export default Departments;
