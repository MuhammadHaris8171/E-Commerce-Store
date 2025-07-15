import React, { useEffect, useState } from 'react';
import axios from 'axios';
import backend_url from '../config/config';

const SubCategoryItems = () => {
  const [items, setItems] = useState([]);
  const subCategories = ['Methaai', 'Butter', 'Fresh Vegetables', 'Water'];

  useEffect(() => {
    axios.get(`${backend_url}/items`).then(res => setItems(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Items by Sub Category</h2>
      {subCategories.map(subCat => (
        <div key={subCat} className="mb-8">
          <h3 className="text-lg font-semibold mb-2">{subCat}</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 mb-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Item Name (Eng)</th>
                  <th className="p-2 border">Item Name (Alt)</th>
                  <th className="p-2 border">Base Unit</th>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Sub Category</th>
                  <th className="p-2 border">Tax</th>
                  <th className="p-2 border">Assign Branch</th>
                  <th className="p-2 border">Assign Brand</th>
                  <th className="p-2 border">Number of Units</th>
                  <th className="p-2 border">Image</th>
                </tr>
              </thead>
              <tbody>
                {items.filter(item => item.subCategory === subCat).map(item => (
                  <tr key={item._id}>
                    <td className="p-2 border">{item.nameEn || item.name}</td>
                    <td className="p-2 border">{item.nameAlt}</td>
                    <td className="p-2 border">{item.baseUnit?.name}</td>
                    <td className="p-2 border">{item.category?.nameEn}</td>
                    <td className="p-2 border">{item.subCategory}</td>
                    <td className="p-2 border">{item.tax?.name}</td>
                    <td className="p-2 border">{item.assignBranch?.name}</td>
                    <td className="p-2 border">{item.assignBrand?.name}</td>
                    <td className="p-2 border">{item.unitCount}</td>
                    <td className="p-2 border">{item.image?.url ? <img src={item.image.url} alt="" className="h-8" /> : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.filter(item => item.subCategory === subCat).length === 0 && (
              <div className="text-gray-500">No items in this sub category.</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubCategoryItems; 