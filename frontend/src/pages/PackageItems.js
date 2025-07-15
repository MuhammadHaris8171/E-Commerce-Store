import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backend_url from '../config/config';

const PackageItems = () => {
  const [packageItems, setPackageItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [units, setUnits] = useState([]);
  const [images, setImages] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [taxes, setTaxes] = useState([]);
  const [selectedTax, setSelectedTax] = useState(null);

  const [formData, setFormData] = useState({
    packageItemName: '', // Package Item Name
    supplierName: '', // Supplier Name
    supplierItemName: '', // Supplier Item Name
    supplierItemCode: '', // Supplier Item Code
    pricingUOM: '', // Pricing UOM
    priceExclVat: '', // Price (Excl. Vat)
    priceInclVat: '', // Price (Incl. Vat)
    image: '', // Image
    tax: '' // Tax
  });

  const fetchData = async () => {
    const [packageItemRes, supplierRes, unitRes, taxRes, imgRes] = await Promise.all([
      axios.get(`${backend_url}/package-items`),
      axios.get(`${backend_url}/suppliers`),
      axios.get(`${backend_url}/units`),
      axios.get(`${backend_url}/tax`),
      axios.get(`${backend_url}/gallery`)
    ]);
    setPackageItems(packageItemRes.data);
    setSuppliers(supplierRes.data);
    setUnits(unitRes.data);
    setTaxes(taxRes.data);
    setImages(imgRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTaxChange = (e) => {
    const taxId = e.target.value;
    setFormData(prev => ({ ...prev, tax: taxId }));
    const foundTax = taxes.find(t => t._id === taxId);
    setSelectedTax(foundTax || null);
    // Recalculate prices if both are present
    if (formData.priceExclVat && foundTax) {
      const excl = parseFloat(formData.priceExclVat);
      const incl = excl + (excl * (foundTax.taxRate / 100));
      setFormData(prev => ({ ...prev, priceInclVat: incl ? incl.toFixed(2) : '' }));
    } else if (formData.priceInclVat && foundTax) {
      const incl = parseFloat(formData.priceInclVat);
      const excl = incl / (1 + (foundTax.taxRate / 100));
      setFormData(prev => ({ ...prev, priceExclVat: excl ? excl.toFixed(2) : '' }));
    }
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };
    if (selectedTax && value) {
      if (name === 'priceExclVat') {
        const excl = parseFloat(value);
        const incl = excl + (excl * (selectedTax.taxRate / 100));
        newFormData.priceInclVat = incl ? incl.toFixed(2) : '';
      } else if (name === 'priceInclVat') {
        const incl = parseFloat(value);
        const excl = incl / (1 + (selectedTax.taxRate / 100));
        newFormData.priceExclVat = excl ? excl.toFixed(2) : '';
      }
    }
    setFormData(newFormData);
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`${backend_url}/package-items/${editingId}`, formData);
      } else {
        await axios.post(`${backend_url}/package-items`, formData);
      }
      setFormData({ 
        packageItemName: '', 
        supplierName: '', 
        supplierItemName: '', 
        supplierItemCode: '', 
        pricingUOM: '', 
        priceExclVat: '', 
        priceInclVat: '', 
        image: '', 
        tax: '' 
      });
      setEditingId(null);
      setShowFormModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving package item:', error);
    }
  };

  const handleEdit = (packageItem) => {
    setFormData({
      packageItemName: packageItem.packageItemName || '',
      supplierName: packageItem.supplierName?._id || '',
      supplierItemName: packageItem.supplierItemName || '',
      supplierItemCode: packageItem.supplierItemCode || '',
      pricingUOM: packageItem.pricingUOM?._id || '',
      priceExclVat: packageItem.priceExclVat || '',
      priceInclVat: packageItem.priceInclVat || '',
      image: packageItem.image?._id || '',
      tax: packageItem.tax?._id || ''
    });
    setEditingId(packageItem._id);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package item?')) {
      try {
        await axios.delete(`${backend_url}/package-items/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting package item:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Package Items</h2>
        <button
          onClick={() => {
            setFormData({ 
              packageItemName: '', 
              supplierName: '', 
              supplierItemName: '', 
              supplierItemCode: '', 
              pricingUOM: '', 
              priceExclVat: '', 
              priceInclVat: '', 
              image: '', 
              tax: '' 
            });
            setEditingId(null);
            setShowFormModal(true);
          }}
          className="bg-[#735dff] text-white px-4 py-2 rounded"
        >
          Add Package Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Package Item Name</th>
              <th className="p-2 border">Supplier Name</th>
              <th className="p-2 border">Supplier Item Name</th>
              <th className="p-2 border">Supplier Item Code</th>
              <th className="p-2 border">Pricing UOM</th>
              <th className="p-2 border">Price (Excl. Vat)</th>
              <th className="p-2 border">Price (Incl. Vat)</th>
              <th className="p-2 border">Tax</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packageItems.map(packageItem => (
              <tr key={packageItem._id} className="text-center">
                <td className="p-2 border">{packageItem.packageItemName}</td>
                <td className="p-2 border">{packageItem.supplierName?.legalName || 'N/A'}</td>
                <td className="p-2 border">{packageItem.supplierItemName}</td>
                <td className="p-2 border">{packageItem.supplierItemCode}</td>
                <td className="p-2 border">{packageItem.pricingUOM?.name || 'N/A'}</td>
                <td className="p-2 border">{packageItem.priceExclVat}</td>
                <td className="p-2 border">{packageItem.priceInclVat}</td>
                <td className="p-2 border">{packageItem.tax?.name || 'N/A'}</td>
                <td className="p-2 border">
                  {packageItem.image?.url ? (
                    <img src={packageItem.image.url} alt="img" className="w-12 h-12 object-cover mx-auto" />
                  ) : (
                    'No image'
                  )}
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handleEdit(packageItem)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handleDelete(packageItem._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Package Item */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Package Item' : 'Add Package Item'}</h3>
              <button
                onClick={() => {
                  setShowFormModal(false);
                  setEditingId(null);
                  setFormData({ 
                    packageItemName: '', 
                    supplierName: '', 
                    supplierItemName: '', 
                    supplierItemCode: '', 
                    pricingUOM: '', 
                    priceExclVat: '', 
                    priceInclVat: '', 
                    image: '', 
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
                name="packageItemName"
                value={formData.packageItemName}
                onChange={handleChange}
                placeholder="Package Item Name"
                className="border p-2 rounded"
              />

              <select
                name="supplierName"
                value={formData.supplierName}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select Supplier</option>
                {suppliers.length === 0 ? (
                  <option value="" disabled>No suppliers found. Please add a supplier.</option>
                ) : (
                  suppliers.map(supplier => (
                    <option key={supplier._id} value={supplier._id}>{supplier.legalName}</option>
                  ))
                )}
              </select>

              <input
                type="text"
                name="supplierItemName"
                value={formData.supplierItemName}
                onChange={handleChange}
                placeholder="Supplier Item Name"
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="supplierItemCode"
                value={formData.supplierItemCode}
                onChange={handleChange}
                placeholder="Supplier Item Code"
                className="border p-2 rounded"
              />

              <select
                name="pricingUOM"
                value={formData.pricingUOM}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select Pricing UOM</option>
                {units.map(unit => (
                  <option key={unit._id} value={unit._id}>{unit.name}</option>
                ))}
              </select>

              <select
                name="tax"
                value={formData.tax || ''}
                onChange={handleTaxChange}
                className="border p-2 rounded"
              >
                <option value="">Select Tax</option>
                {taxes.map(tax => (
                  <option key={tax._id} value={tax._id}>{tax.name} ({tax.taxRate}%)</option>
                ))}
              </select>

              <input
                type="number"
                name="priceExclVat"
                value={formData.priceExclVat}
                onChange={handlePriceChange}
                placeholder="Price (Excl. Vat)"
                className="border p-2 rounded"
                min="0"
              />

              <input
                type="number"
                name="priceInclVat"
                value={formData.priceInclVat}
                onChange={handlePriceChange}
                placeholder="Price (Incl. Vat)"
                className="border p-2 rounded"
                min="0"
              />

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
              {editingId ? 'Update Package Item' : 'Add Package Item'}
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

export default PackageItems; 