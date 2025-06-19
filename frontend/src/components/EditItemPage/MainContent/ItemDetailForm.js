import React from 'react';

export default function ItemDetailsForm({ item }) {
  if (!item) return null;

  return (
    <div className="flex-1 bg-white p-4 rounded shadow-sm">
      <h3 className="font-semibold text-md mb-2">Basic Details</h3>
      <div className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Item Name (EN) *"
          defaultValue={item.nameEn || ''}
          readOnly
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Item Name (Alt)"
          defaultValue={item.nameAlt || ''}
          readOnly
        />
        <div className="flex gap-4">
          <input
            className="w-1/2 border p-2 rounded"
            placeholder="Base Unit *"
            defaultValue={item.unit?.name || ''}
            readOnly
          />
          <input
            className="w-1/2 border p-2 rounded"
            placeholder="Item Code *"
            defaultValue={item.itemCode || ''}
            readOnly
          />
        </div>
      </div>

      <h3 className="font-semibold text-md mt-6 mb-2">Category Details</h3>
      <div className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Category *"
          defaultValue={item.category?.nameEn || ''}
          readOnly
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Enter Accounting Category"
          defaultValue={item.accountingCategory || ''}
          readOnly
        />
      </div>
    </div>
  );
}
