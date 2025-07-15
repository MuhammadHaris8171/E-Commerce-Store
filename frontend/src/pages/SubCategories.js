import React, { useEffect, useState } from 'react';
import axios from 'axios';
import backend_url from '../config/config';

const SubCategories = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ nameEn: '', nameAlt: '', category: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [subs, cats] = await Promise.all([
        axios.get(`${backend_url}/sub-categories`),
        axios.get(`${backend_url}/item-categories`)
      ]);
      setSubCategories(subs.data);
      setCategories(cats.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.nameEn?.trim() || !form.category) {
      alert('Sub Category Name and Main Category are required');
      return;
    }
    
    try {
      setSubmitting(true);
      if (editingId) {
        await axios.put(`${backend_url}/sub-categories/${editingId}`, form);
      } else {
        await axios.post(`${backend_url}/sub-categories`, form);
      }
      setForm({ nameEn: '', nameAlt: '', category: '' });
      setEditingId(null);
      fetchAll();
    } catch (error) {
      console.error('Error saving sub category:', error);
      alert('Error saving sub category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = sub => {
    setForm({ nameEn: sub.nameEn, nameAlt: sub.nameAlt || '', category: sub.category?._id || '' });
    setEditingId(sub._id);
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this sub category?')) {
      try {
        await axios.delete(`${backend_url}/sub-categories/${id}`);
        fetchAll();
      } catch (error) {
        console.error('Error deleting sub category:', error);
        alert('Error deleting sub category');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ nameEn: '', nameAlt: '', category: '' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sub Categories Management</h2>
        <div className="text-sm text-gray-600">
          Total: {subCategories.length} sub categories
        </div>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {editingId ? 'Edit Sub Category' : 'Add New Sub Category'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub Category Name (English) *
              </label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#735dff] focus:border-transparent" 
                name="nameEn" 
                placeholder="Enter sub category name" 
                value={form.nameEn} 
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub Category Name (Alternative)
              </label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#735dff] focus:border-transparent" 
                name="nameAlt" 
                placeholder="Enter alternative name" 
                value={form.nameAlt} 
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Category *
            </label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#735dff] focus:border-transparent" 
              name="category" 
              value={form.category} 
              onChange={handleChange}
              required
            >
              <option value="">Select Main Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.nameEn}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button 
              className="bg-[#735dff] text-white px-6 py-2 rounded-lg hover:bg-[#5a4bcc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (editingId ? 'Update Sub Category' : 'Add Sub Category')}
            </button>
            {editingId && (
              <button 
                type="button" 
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors" 
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Sub Categories Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Sub Categories List</h3>
        </div>
        {subCategories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">📂</div>
            <div className="text-lg font-medium mb-1">No sub categories found</div>
            <div className="text-sm">Add your first sub category using the form above</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name (English)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name (Alternative)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Main Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subCategories.map((sub, index) => (
                  <tr key={sub._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sub.nameEn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sub.nameAlt || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {sub.category?.nameEn || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleEdit(sub)} 
                        className="text-[#735dff] hover:text-[#5a4bcc] transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(sub._id)} 
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCategories; 