import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backend_url from '../config/config';

const MenuItems = () => {
  const [items, setItems] = useState([]);
  const [brands, setBrands] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', brand: '' });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchItems();
    fetchBrands();
  }, []);

  const fetchItems = async () => {
    const res = await axios.get(`${backend_url}/menu`);
    setItems(res.data);
  };

  const fetchBrands = async () => {
    const res = await axios.get(`${backend_url}/brand`);
    setBrands(res.data);
  };

  const handleAdd = async () => {
    if (newItem.name && newItem.brand) {
      await axios.post(`${backend_url}/menu`, newItem);
      resetModal();
      fetchItems();
    }
  };

  const handleUpdate = async () => {
    if (newItem.name && newItem.brand && currentId) {
      await axios.put(`${backend_url}/menu/${currentId}`, newItem);
      resetModal();
      fetchItems();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await axios.delete(`${backend_url}/menu/${id}`);
      fetchItems();
    }
  };

  const openEditModal = (item) => {
    setEditMode(true);
    setCurrentId(item._id);
    setNewItem({ name: item.name, brand: item.brand._id });
    setShowModal(true);
  };

  const resetModal = () => {
    setNewItem({ name: '', brand: '' });
    setShowModal(false);
    setEditMode(false);
    setCurrentId(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Menu Category</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={() => setShowModal(true)}>
          Add Menu Category
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-1/3">
            <h3 className="text-lg font-semibold mb-4">{editMode ? 'Edit Menu Category' : 'Add Menu Category'}</h3>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Item name"
              className="w-full border p-2 mb-4 rounded"
            />
            <select
              value={newItem.brand}
              onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
              className="w-full border p-2 mb-4 rounded"
            >
              <option value="">Select Brand</option>
              {brands.map(b => (
                <option key={b._id} value={b._id}>{b.nameEn}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={resetModal} className="text-gray-500">Cancel</button>
              <button
                onClick={editMode ? handleUpdate : handleAdd}
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
            <th className="py-2 border-b">Brand</th>
            <th className="py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item._id}>
              <td className="py-2 border-b text-center">{i + 1}</td>
              <td className="py-2 border-b text-center">{item.name}</td>
              <td className="py-2 border-b text-center">{item.brand.nameEn}</td>
              <td className="py-2 border-b text-center space-x-2">
                <button onClick={() => openEditModal(item)} className="text-purple-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MenuItems;
