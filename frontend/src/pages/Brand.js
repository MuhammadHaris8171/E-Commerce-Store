import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backend_url from '../config/config';

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [branches, setBranches] = useState([]);
  const [images, setImages] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  console.log(brands)

  const [formData, setFormData] = useState({
    nameEn: '',
    nameAr: '',
    branch: '',  // store branch _id only
    type: '',
    logo: ''     // store logo _id only
  });

  // Helper: find logo object by id from images
  const selectedLogo = images.find(img => img._id === formData.logo);

  const fetchData = async () => {
    try {
      const [brandRes, branchRes, imageRes] = await Promise.all([
        axios.get(`${backend_url}/brand`),
        axios.get(`${backend_url}/branch`),
        axios.get(`${backend_url}/gallery`)
      ]);
      setBrands(brandRes.data);
      setBranches(branchRes.data);
      setImages(imageRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`${backend_url}/brand/${editingId}`, formData);
      } else {
        await axios.post(`${backend_url}/brand`, formData);
      }
      setFormData({ nameEn: '', nameAr: '', branch: '', type: '', logo: '' });
      setEditingId(null);
      setShowFormModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  const handleEdit = (brand) => {
    setFormData({
      nameEn: brand.nameEn || '',
      nameAr: brand.nameAr || '',
      branch: brand.branch?._id || '',
      type: brand.type || '',
      logo: brand.logo?._id || ''
    });
    setEditingId(brand._id);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await axios.delete(`${backend_url}/brand/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting brand:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Brands</h2>
        <button
          onClick={() => {
            setFormData({ nameEn: '', nameAr: '', branch: '', type: '', logo: '' });
            setEditingId(null);
            setShowFormModal(true);
          }}
          className="bg-[#735dff] text-white px-4 py-2 rounded"
        >
          Add Brand
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name (EN)</th>
              <th className="p-2 border">Name (AR)</th>
              <th className="p-2 border">Branch</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Logo</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand._id} className="text-center">
                <td className="p-2 border">{brand.nameEn}</td>
                <td className="p-2 border">{brand.nameAr}</td>
                <td className="p-2 border">{brand.branch?.name || 'N/A'}</td>
                <td className="p-2 border">{brand.type}</td>
                <td className="p-2 border">
                  {brand.logo?.url ? (
                    <img
                      src={brand.logo.url}
                      alt="Logo"
                      className="w-12 h-12 object-cover mx-auto"
                    />
                  ) : (
                    'No logo'
                  )}
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handleEdit(brand)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handleDelete(brand._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Brand */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-2xl">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Brand' : 'Add Brand'}</h3>
              <button
                onClick={() => {
                  setShowFormModal(false);
                  setEditingId(null);
                  setFormData({ nameEn: '', nameAr: '', branch: '', type: '', logo: '' });
                }}
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                placeholder="Name (EN)"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="nameAr"
                value={formData.nameAr}
                onChange={handleChange}
                placeholder="Name (AR)"
                className="border p-2 rounded"
              />

              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch._id} value={branch._id}>{branch.name}</option>
                ))}
              </select>

              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Type"
                className="border p-2 rounded"
              />

              <div className="col-span-2">
                <label className="block font-medium mb-1">Logo</label>
                <div
                  className="w-32 h-32 border rounded flex items-center justify-center cursor-pointer overflow-hidden"
                  onClick={() => setShowImageModal(true)}
                >
                  {selectedLogo ? (
                    <img src={selectedLogo.url} alt="Selected" className="object-cover w-full h-full" />
                  ) : (
                    <span>Select Logo</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="bg-[#735dff] text-white px-6 py-2 rounded"
            >
              {editingId ? 'Update' : 'Save'} Brand
            </button>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded w-[80%] max-h-[80%] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Select Logo</h3>
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
                    setFormData(prev => ({ ...prev, logo: img._id }));
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

export default Brand;
