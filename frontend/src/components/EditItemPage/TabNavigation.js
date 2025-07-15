import React, { useEffect, useState } from 'react';
import ItemDetailsForm from './MainContent/ItemDetailForm';
import LocationTogglePanel from './MainContent/LocationTogglePanel';
import axios from 'axios';
import backend_url from '../../config/config';
import { useParams } from 'react-router-dom';

const tabs = ['Item Details', 'Packaging', 'Suppliers', 'Allergens', 'Inventory', 'Recipes'];

export default function ItemTabs() {
  const [activeTab, setActiveTab] = useState('Packaging');
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [showPackagingForm, setShowPackagingForm] = useState(false);
  const [packagingType, setPackagingType] = useState(''); // 'base' or 'pack'
  const [packagingData, setPackagingData] = useState({
    amount: '',
    unit: 'L',
    packSize: '',
    packUnit: ''
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        // Fetch item name
        const itemRes = await axios.get(`${backend_url}/items/${id}`);
        const itemName = itemRes.data.nameEn || itemRes.data.name || '';
        // Fetch packaging info
        const packagingRes = await axios.get(`${backend_url}/packaging/${id}`);
        const packagingArr = packagingRes.data;
        const basePackaging = packagingArr.find(p => p.type === 'base');
        const packPackaging = packagingArr.find(p => p.type === 'pack');
        setItem({
          name: itemName,
          nameEn: itemRes.data.nameEn,
          basePackaging,
          packPackaging
        });
      } catch (err) {
        console.error('Error fetching item or packaging:', err);
      }
    };
    fetchItem();
  }, [id]);

  if (!item) return <div className="p-4">Loading item...</div>;

  const handleAddPackaging = (type) => {
    setPackagingType(type);
    setShowPackagingForm(true);
    setPackagingData({
      amount: '',
      unit: 'L',
      packSize: '',
      packUnit: ''
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        itemId: id,
        type: packagingType,
        amount: packagingData.amount,
        unit: packagingData.unit,
        ...(packagingType === 'pack' && {
          packSize: packagingData.packSize,
          ...(packagingData.packUnit && { packUnit: packagingData.packUnit })
        })
      };
      await axios.post(`${backend_url}/packaging/${id}`, payload);
      // Update state immediately
      const newPackaging = {
        type: packagingType,
        amount: parseFloat(packagingData.amount),
        unit: packagingData.unit,
        ...(packagingType === 'pack' && {
          packSize: parseInt(packagingData.packSize),
          packUnit: packagingData.packUnit
        })
      };
      setItem(prev => ({
        ...prev,
        ...(packagingType === 'base' ? { basePackaging: newPackaging } : { packPackaging: newPackaging })
      }));
      setShowPackagingForm(false);
    } catch (err) {
      console.error('Error adding packaging:', err);
    }
  };

  const handleFormCancel = () => {
    setShowPackagingForm(false);
    setPackagingData({
      amount: '',
      unit: 'L',
      packSize: '',
      packUnit: ''
    });
  };

  const PackagingForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-lg">
        <h3 className="text-lg font-semibold text-[#5B2685] mb-4">
          Add {packagingType === 'base' ? 'Base' : 'Pack'} Packaging
        </h3>
        
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={item?.name || ''}
              disabled
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={packagingData.amount}
                onChange={(e) => setPackagingData({...packagingData, amount: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5B2685] focus:border-transparent"
                placeholder="1"
                required 
              />
            </div>
            <div className="w-20">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                value={packagingData.unit}
                onChange={(e) => setPackagingData({...packagingData, unit: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5B2685] focus:border-transparent"
              >
                <option value="L">L</option>
                <option value="ml">ml</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="pcs">pcs</option>
              </select>
            </div>
          </div>

          {packagingType === 'pack' && (
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pack Size
                </label>
                <input
                  type="number"
                  value={packagingData.packSize}
                  onChange={(e) => setPackagingData({...packagingData, packSize: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5B2685] focus:border-transparent"
                  placeholder="10"
                  required
                />
              </div>
              <div className="w-20">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  value={packagingData.packUnit}
                  onChange={(e) => setPackagingData({...packagingData, packUnit: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5B2685] focus:border-transparent"
                >
                  <option value="x">x</option>
                  <option value="per">per</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleFormCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#5B2685] text-white rounded-md hover:bg-[#4A1F6F] transition-colors"
            >
              Add Packaging
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Item Details':
        return <div className="flex gap-6 mt-6">
          <ItemDetailsForm item={item}/>
          <LocationTogglePanel />
        </div>
        
      case 'Packaging':
        return (
          <div className="mt-6 space-y-6">
            <h2 className="text-xl font-semibold text-[#5B2685]">Packaging</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Base Card */}
              <div className="border border-[#D9D9D9] rounded-lg p-4 bg-white shadow-sm">
                <h3 className="text-sm text-[#5B2685] font-bold mb-1">Base</h3>
                <p className="text-sm text-gray-800">
                  {item?.basePackaging ? 
                    `${item.nameEn} ${item.basePackaging.amount}${item.basePackaging.unit}` : 
                    'No base packaging configured'
                  }
                </p>
                <button 
                  onClick={() => handleAddPackaging('base')}
                  className="text-sm text-[#5B2685] mt-2 hover:underline"
                >
                  {item?.basePackaging ? 'Edit Packaging' : '+ Add Packaging'}
                </button>
              </div>

              {/* Pack Card */}
              <div className="border border-[#3F88C5] rounded-lg p-4 bg-white shadow-sm">
                <h3 className="text-sm text-[#3F88C5] font-bold mb-1">Pack</h3>
                <p className="text-sm text-gray-800">
                  {item?.packPackaging ? 
                    `${item.name} ${item.packPackaging.packSize} ${item.packPackaging.amount}${item.packPackaging.unit}` : 
                    'No pack packaging configured'
                  }
                </p>
                <button 
                  onClick={() => handleAddPackaging('pack')}
                  className="text-sm text-[#3F88C5] mt-2 hover:underline"
                >
                  {item?.packPackaging ? 'Edit Packaging' : '+ Add Packaging'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'Suppliers':
        return (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-[#5B2685] mb-4">Suppliers</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-[#E0E0E0] text-sm">
                <thead className="bg-[#F2F2F2] text-[#5B2685] font-semibold">
                  <tr>
                    <th className="p-2 text-left">Package Item Name</th>
                    <th className="p-2 text-left">Supplier Name</th>
                    <th className="p-2 text-left">Supplier Item Name</th>
                    <th className="p-2 text-left">Supplier Item Code</th>
                    <th className="p-2 text-left">Pricing UOM</th>
                    <th className="p-2 text-left">Price (SAR)</th>
                    <th className="p-2 text-left">Total Price</th>
                    <th className="p-2 text-left">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200">
                    <td className="p-2">{item?.packPackaging ? `${item.name} ${item.packPackaging.packSize}${item.packPackaging.packUnit}${item.packPackaging.amount}${item.packPackaging.unit}` : item?.name}</td>
                    <td className="p-2">Budget Foods</td>
                    <td className="p-2">{item?.packPackaging ? `${item.name} ${item.packPackaging.packSize}${item.packPackaging.packUnit}${item.packPackaging.amount}${item.packPackaging.unit}` : item?.name}</td>
                    <td className="p-2">Item Code</td>
                    <td className="p-2">{item?.packPackaging ? `${item.packPackaging.packSize}${item.packPackaging.packUnit}${item.packPackaging.amount}${item.packPackaging.unit}` : 'N/A'}</td>
                    <td className="p-2">130.00</td>
                    <td className="p-2">130.00</td>
                    <td className="p-2">
                      <input type="checkbox" checked readOnly className="accent-[#5B2685]" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return <div className="text-gray-600 mt-6">Coming Soon...</div>;
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="border-b border-gray-300 flex gap-6">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer pb-2 text-sm font-medium ${
              activeTab === tab
                ? 'text-[#5B2685] border-b-2 border-[#5B2685]'
                : 'text-gray-500'
            }`}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div>{renderContent()}</div>

      {/* Packaging Form Modal */}
      {showPackagingForm && <PackagingForm />}
    </div>
  );
}