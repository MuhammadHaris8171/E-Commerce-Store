import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backend_url from '../config/config';

const Units = () => {
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({ name: '', unitType: '', symbol: '' });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUnitId, setCurrentUnitId] = useState(null);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const res = await axios.get(`${backend_url}/units`);
      setUnits(res.data);
    } catch (err) {
      console.error('Failed to fetch units:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUnit = async () => {
    if (formData.name.trim() && formData.unitType.trim() && formData.symbol.trim()) {
      try {
        await axios.post(`${backend_url}/units`, formData);
        closeModal();
        fetchUnits();
      } catch (err) {
        console.error('Failed to add unit:', err);
      }
    }
  };

  const handleUpdateUnit = async () => {
    if (formData.name.trim() && formData.unitType.trim() && formData.symbol.trim() && currentUnitId) {
      try {
        await axios.put(`${backend_url}/units/${currentUnitId}`, formData);
        closeModal();
        fetchUnits();
      } catch (err) {
        console.error('Failed to update unit:', err);
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this unit?");
    if (confirmDelete) {
      try {
        await axios.delete(`${backend_url}/units/${id}`);
        fetchUnits();
      } catch (err) {
        console.error('Failed to delete unit:', err);
      }
    }
  };

  const openEditModal = (unit) => {
    setEditMode(true);
    setCurrentUnitId(unit._id);
    setFormData({ name: unit.name, unitType: unit.unitType, symbol: unit.symbol });
    setShowModal(true);
  };

  const closeModal = () => {
    setFormData({ name: '', unitType: '', symbol: '' });
    setShowModal(false);
    setEditMode(false);
    setCurrentUnitId(null);
  };

  return (
    <div className="p-4 z-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Units</h2>
        <button
          className="bg-[#735dff] text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          Add Unit
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              {editMode ? 'Edit Unit' : 'Add New Unit'}
            </h3>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter unit name"
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="text"
              name="unitType"
              value={formData.unitType}
              onChange={handleChange}
              placeholder="Enter unit type (e.g. Weight, Volume)"
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="Enter symbol (e.g. kg, L)"
              className="w-full border p-2 mb-4 rounded"
            />
            <div className="flex justify-end gap-2">
              <button onClick={closeModal} className="text-gray-500">
                Cancel
              </button>
              <button
                onClick={editMode ? handleUpdateUnit : handleAddUnit}
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
            <th className="py-2 border-b">Name</th>
            <th className="py-2 border-b">Type</th>
            <th className="py-2 border-b">Symbol</th>
            <th className="py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit, index) => (
            <tr key={unit._id}>
              <td className="py-2 border-b text-center">{index + 1}</td>
              <td className="py-2 border-b text-center">{unit.name}</td>
              <td className="py-2 border-b text-center">{unit.unitType}</td>
              <td className="py-2 border-b text-center">{unit.Symbol}</td>
              <td className="py-2 border-b text-center space-x-2">
                <button
                  onClick={() => openEditModal(unit)}
                  className="text-[#735dff] hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(unit._id)}
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

export default Units;
