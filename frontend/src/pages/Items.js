import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backend_url from '../config/config';
import { useNavigate } from 'react-router-dom';

const Item = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [units, setUnits] = useState([]);
  const [images, setImages] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    departments: [],
    unit: '',
    image: ''
  });

  const fetchData = async () => {
    const [itemRes, catRes, deptRes, unitRes, imgRes] = await Promise.all([
      axios.get(`${backend_url}/items`),
      axios.get(`${backend_url}/item-categories`),
      axios.get(`${backend_url}/departments`),
      axios.get(`${backend_url}/units`),
      axios.get(`${backend_url}/gallery`)
    ]);
    setItems(itemRes.data);
    setCategories(catRes.data);
    setDepartments(deptRes.data);
    setUnits(unitRes.data);
    setImages(imgRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDepartmentToggle = (id) => {
    setFormData(prev => {
      const updated = prev.departments.includes(id)
        ? prev.departments.filter(dep => dep !== id)
        : [...prev.departments, id];
      return { ...prev, departments: updated };
    });
  };

  const handleSubmit = async () => {
    if (formData.name.trim() && formData.category) {
      try {
        if (editingId) {
          await axios.put(`${backend_url}/items/${editingId}`, formData);
        } else {
          await axios.post(`${backend_url}/items`, formData);
        }
        setFormData({ name: '', category: '', departments: [], unit: '', image: '' });
        setEditingId(null);
        setShowFormModal(false);
        fetchData();
      } catch (error) {
        console.error('Error saving item:', error);
      }
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      category: item.category?._id || '',
      departments: item.departments?.map(d => d._id) || [],
      unit: item.unit?._id || '',
      image: item.image || ''
    });
    setEditingId(item._id);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${backend_url}/items/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Items</h2>
        <button
          onClick={() => {
            setFormData({ name: '', category: '', departments: [], unit: '', image: '' });
            setEditingId(null);
            setShowFormModal(true);
          }}
          className="bg-[#735dff] text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Departments</th>
              <th className="p-2 border">Unit</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id} className="text-center">
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.category?.nameEn || 'N/A'}</td>
                <td className="p-2 border">
                  {(item.departments || []).map(dep => dep.name).join(', ')}
                </td>
                <td className="p-2 border">{item.unit?.name || 'N/A'}</td>
                <td className="p-2 border">
                  {item.image?.url ? (
                    <img src={item.image.url} alt="img" className="w-12 h-12 object-cover mx-auto" />
                  ) : (
                    'No image'
                  )}
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                  <button
  className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
  onClick={() => navigate(`/items/${item._id}/edit`)}
>
  Action1
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Item */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-2xl">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Item' : 'Add Item'}</h3>
              <button
                onClick={() => {
                  setShowFormModal(false);
                  setEditingId(null);
                  setFormData({ name: '', category: '', departments: [], unit: '', image: '' });
                }}
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Item Name"
                className="border p-2 rounded"
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.nameEn}</option>
                ))}
              </select>

              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select Unit</option>
                {units.map(unit => (
                  <option key={unit._id} value={unit._id}>{unit.name}</option>
                ))}
              </select>

              <div className="col-span-2">
                <label className="block font-medium mb-1">Departments</label>
                <div className="grid grid-cols-2 gap-2">
                  {departments.map(dept => (
                    <label key={dept._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.departments.includes(dept._id)}
                        onChange={() => handleDepartmentToggle(dept._id)}
                      />
                      <span>{dept.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block font-medium mb-1">Image</label>
                <div
                  className="w-32 h-32 border rounded flex items-center justify-center cursor-pointer overflow-hidden"
                  onClick={() => setShowImageModal(true)}
                >
                  {formData.image ? (
                    <img src={formData.image.url} alt="Selected" className="object-cover w-full h-full" />
                  ) : (
                    <span>Select Image</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="bg-[#735dff] text-white px-6 py-2 rounded"
            >
              {editingId ? 'Update' : 'Save'} Item
            </button>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded w-[80%] max-h-[80%] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Select Image</h3>
              <button onClick={() => setShowImageModal(false)}>Close</button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map(img => (
                <img
                  key={img._id}
                  src={img.url}
                  alt=""
                  className="w-full h-32 object-cover cursor-pointer border hover:border-blue-500"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, image: img }));
                    setShowImageModal(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;
