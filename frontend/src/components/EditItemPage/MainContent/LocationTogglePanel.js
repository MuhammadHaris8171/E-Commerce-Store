import React, { useState } from 'react';

const locations = [
  'Grill N Rice - Grill N Rice Central Kitchen',
  'Grill N Rice - BK-Methaas',
  'Grill N Rice - SK-Methaas',
  'Grill N Rice - DS-Methaas',
  'Grill N Rice - GNR - DineIn',
  'Grill N Rice - GNR 2',
  'Grill N Rice - GNR 3',
  'Grill N Rice - GNR 4'
];

export default function LocationTogglePanel() {
  const [active, setActive] = useState([true, false, false, false, false, false, false, false]);

  const toggle = (index) => {
    const updated = [...active];
    updated[index] = !updated[index];
    setActive(updated);
  };

  return (
    <div className="w-1/2 bg-white p-4 rounded shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Active Locations <span className="text-gray-500">Total Locations: {locations.length}</span></h3>
        <div className="space-x-2">
          <button className="text-purple-600">Select All</button>
          <button className="text-purple-600">Unselect All</button>
        </div>
      </div>
      <input className="w-full mb-4 border p-2 rounded" placeholder="Search locations" />
      <table className="w-full text-left">
        <thead>
          <tr className="text-sm text-gray-500">
            <th>Location Name</th>
            <th className="text-center">Active</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc, index) => (
            <tr key={index} className="border-t hover:bg-gray-50">
              <td className="py-2 px-1">{loc}</td>
              <td className="text-center">
                <input
                  type="checkbox"
                  className="accent-purple-600 scale-125"
                  checked={active[index]}
                  onChange={() => toggle(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
