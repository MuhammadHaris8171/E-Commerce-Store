import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backend_url from '../config/config';
import { useNavigate } from 'react-router-dom';

const Item = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [units, setUnits] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nameEn: '', // Item Name (Eng)
    nameAlt: '', // Item Name (Alt)
    baseUnit: '', // Base Unit
    category: '', // Item Category
    tax: '', // Tax
    assignBranch: '', // Assign Branch
    assignBrand: '', // Assign Brand
    image: '', // Image
    departments: [], // Keep existing departments
    name: '', // Keep existing name for compatibility
    unitCount: '', // Number of Units
    subCategory: '' // Sub Category
  });

  const fetchData = async () => {
    const [itemRes, catRes, subCatRes, deptRes, unitRes, taxRes, branchRes, brandRes, imgRes] = await Promise.all([
      axios.get(`${backend_url}/items`),
      axios.get(`${backend_url}/item-categories`),
      axios.get(`${backend_url}/sub-categories`),
      axios.get(`${backend_url}/departments`),
      axios.get(`${backend_url}/units`),
      axios.get(`${backend_url}/tax`),
      axios.get(`${backend_url}/branch`),
      axios.get(`${backend_url}/brand`),
      axios.get(`${backend_url}/gallery`)
    ]);
    setItems(itemRes.data);
    setCategories(catRes.data);
    setSubCategories(subCatRes.data);
    setDepartments(deptRes.data);
    setUnits(unitRes.data);
    setTaxes(taxRes.data);
    setBranches(branchRes.data);
    setBrands(brandRes.data);
    setImages(imgRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter sub categories based on selected main category
  const filteredSubCategories = subCategories.filter(sub => 
    !formData.category || sub.category?._id === formData.category
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Reset sub category when main category changes
      if (name === 'category') {
        updated.subCategory = '';
      }
      return updated;
    });
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
  // Validate required fields
  if (!formData.nameEn?.trim()) {
    alert('Item Name (Eng) is required');
    return;
  }
  if (!formData.baseUnit) {
    alert('Base Unit is required');
    return;
  }
  if (!formData.category) {
    alert('Category is required');
    return;
  }

  try {
    const submitData = {
      ...formData,
      unit: formData.baseUnit,
      name: formData.nameEn
    };

    if (editingId) {
      await axios.put(`${backend_url}/items/${editingId}`, submitData);
      fetchData();
    } else {
      const res = await axios.post(`${backend_url}/items`, submitData);
      const newItemId = res.data?._id;
      if (newItemId) {
        navigate(`/items/${newItemId}/edit`);
      }
    }

    // Reset state
    setFormData({
      nameEn: '', nameAlt: '', baseUnit: '', category: '',
      tax: '', assignBranch: '', assignBrand: '', image: '',
      departments: [], name: '', unitCount: '', subCategory: ''
    });
    setEditingId(null);
    setShowFormModal(false);

  } catch (error) {
    console.error('Error saving item:', error);
    alert(error?.response?.data?.message || 'Error saving item');
  }
};


  const handleEdit = (item) => {
    setFormData({
      nameEn: item.nameEn || item.name || '',
      nameAlt: item.nameAlt || '',
      baseUnit: item.baseUnit?._id || '',
      category: item.category?._id || '',
      tax: item.tax?._id || '',
      assignBranch: item.assignBranch?._id || '',
      assignBrand: item.assignBrand?._id || '',
      image: item.image?._id || '',
      departments: item.departments?.map(d => d._id) || [],
      name: item.nameEn || item.name || '',
      unitCount: item.unitCount || '',
      subCategory: item.subCategory?._id || ''
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
            setFormData({ 
              nameEn: '', 
              nameAlt: '', 
              baseUnit: '', 
              category: '', 
              tax: '', 
              assignBranch: '', 
              assignBrand: '', 
              image: '', 
              departments: [], 
              name: '', 
              unitCount: '',
              subCategory: ''
            });
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
              <th className="p-2 border">Item Name (Eng)</th>
              <th className="p-2 border">Item Name (Alt)</th>
              <th className="p-2 border">Base Unit</th>
              <th className="p-2 border">Main Category</th>
              <th className="p-2 border">Sub Category</th>
              <th className="p-2 border">Tax</th>
              <th className="p-2 border">Assign Branch</th>
              <th className="p-2 border">Assign Brand</th>
              <th className="p-2 border">Number of Units</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id} className="text-center">
                <td className="p-2 border">{item.nameEn || item.name}</td>
                <td className="p-2 border">{item.nameAlt || 'N/A'}</td>
                <td className="p-2 border">{item.baseUnit?.name || 'N/A'}</td>
                <td className="p-2 border">{item.category?.nameEn || 'N/A'}</td>
                <td className="p-2 border">{item.subCategory?.nameEn || 'N/A'}</td>
                <td className="p-2 border">{item.tax?.name || 'N/A'}</td>
                <td className="p-2 border">{item.assignBranch?.name || 'N/A'}</td>
                <td className="p-2 border">{item.assignBrand?.name || 'N/A'}</td>
                <td className="p-2 border">{item.unitCount || 'N/A'}</td>
                <td className="p-2 border">{item.image?.url ? <img src={item.image.url} alt="" className="h-8" /> : 'N/A'}</td>
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
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Item' : 'Add Item'}</h3>
              <button
                onClick={() => {
                  setShowFormModal(false);
                  setEditingId(null);
                  setFormData({ 
                    nameEn: '', 
                    nameAlt: '', 
                    baseUnit: '', 
                    category: '', 
                    tax: '', 
                    assignBranch: '', 
                    assignBrand: '', 
                    image: '', 
                    departments: [], 
                    name: '', 
                    unitCount: '',
                    subCategory: ''
                  });
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
                placeholder="Item Name (Eng)"
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="nameAlt"
                value={formData.nameAlt}
                onChange={handleChange}
                placeholder="Item Name (Alt)"
                className="border p-2 rounded"
              />

              <select
                name="baseUnit"
                value={formData.baseUnit}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select Base Unit</option>
                {units.map(unit => (
                  <option key={unit._id} value={unit._id}>{unit.name}</option>
                ))}
              </select>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select Main Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.nameEn}</option>
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
                name="assignBrand"
                value={formData.assignBrand}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select Brand</option>
                {brands.length === 0 ? (
                  <option value="" disabled>No brands found. Please add a brand.</option>
                ) : (
                  brands.map(brand => (
                    <option key={brand._id} value={brand._id}>
                      {brand.nameEn} {brand.nameAr ? `(${brand.nameAr})` : ''}
                    </option>
                  ))
                )}
              </select>

              <select className="w-full border p-2 rounded" name="subCategory" value={formData.subCategory} onChange={handleChange}>
                <option value="">Select Sub Category (Optional)</option>
                {filteredSubCategories.map(sc => (
                  <option key={sc._id} value={sc._id}>{sc.nameEn}</option>
                ))}
              </select>

              <input
                type="number"
                name="unitCount"
                value={formData.unitCount}
                onChange={handleChange}
                placeholder="Number of Units"
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
            </div>

            <button
              onClick={handleSubmit}
              className="bg-[#735dff] text-white px-4 py-2 rounded"
            >
              {editingId ? 'Update Item' : 'Add Item'}
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

export default Item;
