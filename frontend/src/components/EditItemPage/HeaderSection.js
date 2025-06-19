import React from 'react';

export default function HeaderSection() {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-medium">
        Edit Item - <span className="text-green-600 font-semibold">Olive Oil</span>
      </h2>
      <button className="bg-purple-600 text-white px-4 py-1 rounded">Lock</button>
    </div>
  );
}