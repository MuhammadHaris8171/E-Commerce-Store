import React, { useEffect, useState } from 'react';
import axios from 'axios';
import backend_url from '../config/config';

const ItemCategory = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    nameEn: '',
    nameUr: ''
  });

  const fetchCategories = async () => {
    const res = await axios.get(`${backend_url}/item-categories`);
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ nameEn: '', nameUr: '' });
    setShowModal(false);
    setEditMode(false);
    setCurrentId(null);
  };

  const handleSave = async () => {
    if (formData.nameEn.trim()) {
      if (editMode) {
        await axios.put(`${backend_url}/item-categories/${currentId}`, formData);
      } else {
        await axios.post(`${backend_url}/item-categories`, formData);
      }
      resetForm();
      fetchCategories();
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Delete this category?');
    if (confirmDelete) {
      await axios.delete(`${backend_url}/item-categories/${id}`);
      fetchCategories();
    }
  };

  const openEditModal = (cat) => {
    setEditMode(true);
    setCurrentId(cat._id);
    setFormData({ nameEn: cat.nameEn, nameUr: cat.nameUr });
    setShowModal(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Item Categories</h2>
        <button
          className="bg-[#735dff] text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          Add Category
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-1/2">
            <h3 className="text-lg font-semibold mb-4">
              {editMode ? 'Edit Category' : 'Add New Category'}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                placeholder="Name (English)"
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="nameUr"
                value={formData.nameUr}
                onChange={handleChange}
                placeholder="Name (Urdu)"
                className="border p-2 rounded"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={resetForm} className="text-gray-500">Cancel</button>
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
                {editMode ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white border mt-4">
        <thead>
          <tr>
            <th className="py-2 border-b">Name (English)</th>
            <th className="py-2 border-b">Name (Urdu)</th>
            <th className="py-2 border-b">Total Items</th>
            <th className="py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat._id}>
              <td className="py-2 border-b text-center">{cat.nameEn}</td>
              <td className="py-2 border-b text-center">{cat.nameUr}</td>
              <td className="py-2 border-b text-center">{cat.totalItems}</td>
              <td className="py-2 border-b text-center space-x-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="text-[#735dff] hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
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

export default ItemCategory;
