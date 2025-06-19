import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backend_url from '../config/config';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [newBranch, setNewBranch] = useState({ name: '', code: '' });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBranchId, setCurrentBranchId] = useState(null);

  const fetchBranches = async () => {
    const res = await axios.get(`${backend_url}/branch`);
    setBranches(res.data);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleAddBranch = async () => {
    if (newBranch.name.trim() && newBranch.code.trim()) {
      await axios.post(`${backend_url}/branch`, newBranch);
      setNewBranch({ name: '', code: '' });
      setShowModal(false);
      fetchBranches();
    } else {
      alert('Please enter both Name and Code.');
    }
  };

  const handleUpdateBranch = async () => {
    if (newBranch.name.trim() && newBranch.code.trim() && currentBranchId) {
      await axios.put(`${backend_url}/branch/${currentBranchId}`, newBranch);
      setNewBranch({ name: '', code: '' });
      setCurrentBranchId(null);
      setEditMode(false);
      setShowModal(false);
      fetchBranches();
    } else {
      alert('Please enter both Name and Code.');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this branch?");
    if (confirmDelete) {
      await axios.delete(`${backend_url}/branch/${id}`);
      fetchBranches();
    }
  };

  const openEditModal = (branch) => {
    setEditMode(true);
    setCurrentBranchId(branch._id);
    setNewBranch({ name: branch.name, code: branch.code });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setNewBranch({ name: '', code: '' });
    setCurrentBranchId(null);
  };

  return (
    <div className="p-4 z-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Branches</h2>
        <button
          className="bg-[#735dff] text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          Add Branch
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              {editMode ? 'Edit Branch' : 'Add New Branch'}
            </h3>
            <input
              type="text"
              value={newBranch.name}
              onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
              placeholder="Enter branch name"
              className="w-full border p-2 mb-4 rounded"
            />
            <input
              type="text"
              value={newBranch.code}
              onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value })}
              placeholder="Enter branch code"
              className="w-full border p-2 mb-4 rounded"
            />
            <div className="flex justify-end gap-2">
              <button onClick={closeModal} className="text-gray-500">
                Cancel
              </button>
              <button
                onClick={editMode ? handleUpdateBranch : handleAddBranch}
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
            <th className="py-2 border-b">Branch Name</th>
            <th className="py-2 border-b">Branch Code</th>
            <th className="py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch, index) => (
            <tr key={branch._id}>
              <td className="py-2 border-b text-center">{index + 1}</td>
              <td className="py-2 border-b text-center">{branch.name}</td>
              <td className="py-2 border-b text-center">{branch.code}</td>
              <td className="py-2 border-b text-center space-x-2">
                <button
                  onClick={() => openEditModal(branch)}
                  className="text-[#735dff] hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(branch._id)}
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

export default Branches;
