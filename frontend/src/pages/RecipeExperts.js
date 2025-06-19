import React, { useEffect, useState } from 'react';
import axios from 'axios';
import backend_url from '../config/config';

const RecipeExperts = () => {
  const [experts, setExperts] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    experts: []
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [expRes, userRes] = await Promise.all([
      axios.get(`${backend_url}/recipe-experts`),
      axios.get(`${backend_url}/users`)
    ]);
    setExperts(expRes.data);
    setUsers(userRes.data);
  };

  const handleToggleUser = (id) => {
    setFormData(prev => {
      const updated = prev.experts.includes(id)
        ? prev.experts.filter(e => e !== id)
        : [...prev.experts, id];
      return { ...prev, experts: updated };
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      await axios.put(`${backend_url}/recipe-experts/${editingId}`, formData);
    } else {
      await axios.post(`${backend_url}/recipe-experts`, formData);
    }

    setFormData({ name: '', experts: [] });
    setEditingId(null);
    setShowModal(false);
    fetchData();
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      experts: item.experts.map(e => e._id),
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expert?')) {
      await axios.delete(`${backend_url}/recipe-experts/${id}`);
      fetchData();
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recipe Experts</h2>
        <button
          onClick={() => {
            setShowModal(true);
            setFormData({ name: '', experts: [] });
            setEditingId(null);
          }}
          className="bg-[#735dff] text-white px-4 py-2 rounded"
        >
          Add Expert
        </button>
      </div>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Experts</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {experts.map(item => (
            <tr key={item._id}>
              <td className="p-2 border text-center">{item.name}</td>
              <td className="p-2 border text-center">
                {(item.experts || []).map(u => u.name).join(', ')}
              </td>
              <td className="p-2 border space-x-2 flex justify-center">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 text-center"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 text-center"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-xl">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">
                {editingId ? 'Edit Recipe Expert' : 'Add Recipe Expert'}
              </h3>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border p-2 rounded"
              />
              <div>
                <label className="block font-medium mb-1">Select Experts</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {users.map(user => (
                    <label key={user._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.experts.includes(user._id)}
                        onChange={() => handleToggleUser(user._id)}
                      />
                      <span>{user.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="bg-[#735dff] text-white px-6 py-2 rounded"
              >
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeExperts;
