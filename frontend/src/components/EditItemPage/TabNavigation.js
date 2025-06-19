import React, { useEffect, useState } from 'react';
import ItemDetailsForm from './MainContent/ItemDetailForm';
import LocationTogglePanel from './MainContent/LocationTogglePanel';
import axios from 'axios';
import backend_url from '../../config/config';
import { useParams } from 'react-router-dom';

const tabs = ['Item Details', 'Packaging', 'Suppliers', 'Allergens', 'Inventory', 'Recipes'];

export default function ItemTabs() {
  const [activeTab, setActiveTab] = useState('Packaging'); // default to Packaging for demo
   const { id } = useParams();
    const [item, setItem] = useState(null);
  
    useEffect(() => {
      const fetchItem = async () => {
        try {
          const res = await axios.get(`${backend_url}/items/${id}`);
          setItem(res.data);
        } catch (err) {
          console.error('Error fetching item:', err);
        }
      };
      fetchItem();
    }, [id]);
  
    if (!item) return <div className="p-4">Loading item...</div>;
  

  const renderContent = () => {
    switch (activeTab) {
      case 'Item Details':
        return <div className="flex gap-6 mt-6">
        <ItemDetailsForm  item={item}/>
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
                <p className="text-sm text-gray-800">Olive Oil 1L</p>
                <button className="text-sm text-[#5B2685] mt-2 hover:underline">+ Add Packaging</button>
              </div>

              {/* Pack Card */}
              <div className="border border-[#3F88C5] rounded-lg p-4 bg-white shadow-sm">
                <h3 className="text-sm text-[#3F88C5] font-bold mb-1">Pack</h3>
                <p className="text-sm text-gray-800">Olive Oil Can (10x1L)</p>
                <button className="text-sm text-[#3F88C5] mt-2 hover:underline">+ Add Packaging</button>
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
                    <td className="p-2">Olive Oil Can (10x1L)</td>
                    <td className="p-2">Budget Foods</td>
                    <td className="p-2">Olive Oil Can (10x1L)</td>
                    <td className="p-2">Item Code</td>
                    <td className="p-2">Can (10x1L)</td>
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
    </div>
  );
}
