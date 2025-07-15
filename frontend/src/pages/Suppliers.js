import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backend_url from '../config/config';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [images, setImages] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    legalName: '', // Supplier Legal Name
    shortName: '', // Short Name
    taxRegistrationNo: '', // Tax Registration No
    googleLocation: '', // Google Location
    repName: '', // Rep. Name
    mobileCall: '', // Mobile No - Call
    mobileWhatsapp: '', // Mobile No - Whatsapp
    image: '', // Image
    assignBranch: '', // Assign Branch
    tax: '' // Tax
  });

  const fetchData = async () => {
    const [supplierRes, taxRes, branchRes, imgRes] = await Promise.all([
      axios.get(`${backend_url}/suppliers`),
      axios.get(`${backend_url}/tax`),
      axios.get(`${backend_url}/branch`),
      axios.get(`${backend_url}/gallery`)
    ]);
    setSuppliers(supplierRes.data);
    setTaxes(taxRes.data);
    setBranches(branchRes.data);
    setImages(imgRes.data);
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
        await axios.put(`${backend_url}/suppliers/${editingId}`, formData);
      } else {
        await axios.post(`${backend_url}/suppliers`, formData);
      }
      setFormData({ 
        legalName: '', 
        shortName: '', 
        taxRegistrationNo: '', 
        googleLocation: '', 
        repName: '', 
        mobileCall: '', 
        mobileWhatsapp: '', 
        image: '', 
        assignBranch: '', 
        tax: '' 
      });
      setEditingId(null);
      setShowFormModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  const handleEdit = (supplier) => {
    setFormData({
      legalName: supplier.legalName || '',
      shortName: supplier.shortName || '',
      taxRegistrationNo: supplier.taxRegistrationNo || '',
      googleLocation: supplier.googleLocation || '',
      repName: supplier.repName || '',
      mobileCall: supplier.mobileCall || '',
      mobileWhatsapp: supplier.mobileWhatsapp || '',
      image: supplier.image?._id || '',
      assignBranch: supplier.assignBranch?._id || '',
      tax: supplier.tax?._id || ''
    });
    setEditingId(supplier._id);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await axios.delete(`${backend_url}/suppliers/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Suppliers</h2>
        <button
          onClick={() => {
            setFormData({ 
              legalName: '', 
              shortName: '', 
              taxRegistrationNo: '', 
              googleLocation: '', 
              repName: '', 
              mobileCall: '', 
              mobileWhatsapp: '', 
              image: '', 
              assignBranch: '', 
              tax: '' 
            });
            setEditingId(null);
            setShowFormModal(true);
          }}
          className="bg-[#735dff] text-white px-4 py-2 rounded"
        >
          Add Supplier
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Legal Name</th>
              <th className="p-2 border">Short Name</th>
              <th className="p-2 border">Tax Registration No</th>
              <th className="p-2 border">Rep. Name</th>
              <th className="p-2 border">Mobile Call</th>
              <th className="p-2 border">Mobile Whatsapp</th>
              <th className="p-2 border">Assign Branch</th>
              <th className="p-2 border">Tax</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr key={supplier._id} className="text-center">
                <td className="p-2 border">{supplier.legalName}</td>
                <td className="p-2 border">{supplier.shortName}</td>
                <td className="p-2 border">{supplier.taxRegistrationNo || 'N/A'}</td>
                <td className="p-2 border">{supplier.repName}</td>
                <td className="p-2 border">{supplier.mobileCall}</td>
                <td className="p-2 border">{supplier.mobileWhatsapp || 'N/A'}</td>
                <td className="p-2 border">{supplier.assignBranch?.name || 'N/A'}</td>
                <td className="p-2 border">{supplier.tax?.name || 'N/A'}</td>
                <td className="p-2 border">
                  {supplier.image?.url ? (
                    <img src={supplier.image.url} alt="img" className="w-12 h-12 object-cover mx-auto" />
                  ) : (
                    'No image'
                  )}
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handleEdit(supplier)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handleDelete(supplier._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Supplier */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Supplier' : 'Add Supplier'}</h3>
              <button
                onClick={() => {
                  setShowFormModal(false);
                  setEditingId(null);
                  setFormData({ 
                    legalName: '', 
                    shortName: '', 
                    taxRegistrationNo: '', 
                    googleLocation: '', 
                    repName: '', 
                    mobileCall: '', 
                    mobileWhatsapp: '', 
                    image: '', 
                    assignBranch: '', 
                    tax: '' 
                  });
                }}
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="legalName"
                value={formData.legalName}
                onChange={handleChange}
                placeholder="Supplier Legal Name"
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
                placeholder="Short Name"
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="taxRegistrationNo"
                value={formData.taxRegistrationNo}
                onChange={handleChange}
                placeholder="Tax Registration No"
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="googleLocation"
                value={formData.googleLocation}
                onChange={handleChange}
                placeholder="Google Location"
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="repName"
                value={formData.repName}
                onChange={handleChange}
                placeholder="Rep. Name"
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="mobileCall"
                value={formData.mobileCall}
                onChange={handleChange}
                placeholder="Mobile No - Call"
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="mobileWhatsapp"
                value={formData.mobileWhatsapp}
                onChange={handleChange}
                placeholder="Mobile No - Whatsapp"
                className="border p-2 rounded"
              />

              <select
                name="assignBranch"
                value={formData.assignBranch}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch._id} value={branch._id}>{branch.name}</option>
                ))}
              </select>

              <select
                name="tax"
                value={formData.tax}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select Tax</option>
                {taxes.map(tax => (
                  <option key={tax._id} value={tax._id}>{tax.name}</option>
                ))}
              </select>

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
              className="bg-[#735dff] text-white px-4 py-2 rounded"
            >
              {editingId ? 'Update Supplier' : 'Add Supplier'}
            </button>
          </div>
        </div>
      )}

      {/* Image Selection Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">Select Image</h3>
              <button onClick={() => setShowImageModal(false)}>Close</button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map(img => (
                <div
                  key={img._id}
                  className="cursor-pointer border rounded p-2"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, image: img }));
                    setShowImageModal(false);
                  }}
                >
                  <img src={img.url} alt="img" className="w-full h-32 object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
