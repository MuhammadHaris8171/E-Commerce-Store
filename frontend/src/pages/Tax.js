import React, { useEffect, useState } from 'react';
import axios from 'axios';
import backend_url from '../config/config';


const Tax = () => {
  const [taxes, setTaxes] = useState([]);
  const [formData, setFormData] = useState({ name: '', taxRate: '' });
  const [editMode, setEditMode] = useState(false);
  const [currentTaxId, setCurrentTaxId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchTaxes = async () => {
    const res = await axios.get(`${backend_url}/tax`);
    setTaxes(res.data);
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.taxRate) return;

    if (editMode) {
      await axios.put(`${backend_url}/tax/${currentTaxId}`, formData);
    } else {
      await axios.post(`${backend_url}/tax`, formData);
    }

    resetForm();
    fetchTaxes();
  };

  const handleEdit = (tax) => {
    setEditMode(true);
    setFormData({ name: tax.name, taxRate: tax.taxRate });
    setCurrentTaxId(tax._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this tax?')) {
      await axios.delete(`${backend_url}/tax/${id}`);
      fetchTaxes();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', taxRate: '' });
    setEditMode(false);
    setCurrentTaxId(null);
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Taxes</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Tax
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-1/3">
            <h3 className="text-lg font-semibold mb-4">{editMode ? 'Edit Tax' : 'Add Tax'}</h3>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tax Name"
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="number"
              name="taxRate"
              value={formData.taxRate}
              onChange={handleChange}
              placeholder="Tax Rate"
              className="w-full mb-4 p-2 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button onClick={resetForm} className="text-gray-500">Cancel</button>
              <button
                onClick={handleSave}
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
            <th className="py-2 border-b">Tax Rate</th>
            <th className="py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {taxes.map((tax) => (
            <tr key={tax._id}>
              <td className="py-2 border-b text-center">{tax.name}</td>
              <td className="py-2 border-b text-center">{tax.taxRate}%</td>
              <td className="py-2 border-b text-center space-x-2">
                <button onClick={() => handleEdit(tax)} className="text-blue-500">Edit</button>
                <button onClick={() => handleDelete(tax._id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tax;
