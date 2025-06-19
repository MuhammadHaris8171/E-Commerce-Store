import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backend_url from '../config/config';

const Currency = () => {
  const [currencies, setCurrencies] = useState([]);
  const [newCurrency, setNewCurrency] = useState({ currencyName: '', symbol: '' });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCurrencyId, setCurrentCurrencyId] = useState(null);

  const fetchCurrencies = async () => {
    const res = await axios.get(`${backend_url}/currency`);
    setCurrencies(res.data);
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleAddCurrency = async () => {
    if (newCurrency.currencyName.trim() && newCurrency.symbol.trim()) {
      await axios.post(`${backend_url}/currency`, newCurrency);
      setNewCurrency({ currencyName: '', symbol: '' });
      setShowModal(false);
      fetchCurrencies();
    } else {
      alert('Please enter both Currency Name and Symbol.');
    }
  };

  const handleUpdateCurrency = async () => {
    if (newCurrency.currencyName.trim() && newCurrency.symbol.trim() && currentCurrencyId) {
      await axios.put(`${backend_url}/currency/${currentCurrencyId}`, newCurrency);
      setNewCurrency({ currencyName: '', symbol: '' });
      setCurrentCurrencyId(null);
      setEditMode(false);
      setShowModal(false);
      fetchCurrencies();
    } else {
      alert('Please enter both Currency Name and Symbol.');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this currency?");
    if (confirmDelete) {
      await axios.delete(`${backend_url}/currency/${id}`);
      fetchCurrencies();
    }
  };

  const openEditModal = (currency) => {
    setEditMode(true);
    setCurrentCurrencyId(currency._id);
    setNewCurrency({ currencyName: currency.currencyName, symbol: currency.symbol });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setNewCurrency({ currencyName: '', symbol: '' });
    setCurrentCurrencyId(null);
  };

  return (
    <div className="p-4 z-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Currencies</h2>
        <button
          className="bg-[#735dff] text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          Add Currency
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              {editMode ? 'Edit Currency' : 'Add New Currency'}
            </h3>
            <input
              type="text"
              value={newCurrency.currencyName}
              onChange={(e) => setNewCurrency({ ...newCurrency, currencyName: e.target.value })}
              placeholder="Enter currency name"
              className="w-full border p-2 mb-4 rounded"
            />
            <input
              type="text"
              value={newCurrency.symbol}
              onChange={(e) => setNewCurrency({ ...newCurrency, symbol: e.target.value })}
              placeholder="Enter symbol"
              className="w-full border p-2 mb-4 rounded"
            />
            <div className="flex justify-end gap-2">
              <button onClick={closeModal} className="text-gray-500">
                Cancel
              </button>
              <button
                onClick={editMode ? handleUpdateCurrency : handleAddCurrency}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {editMode ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white border mt-4">
        <thead>
          <tr>
            <th className="py-2 border-b">#</th>
            <th className="py-2 border-b">Currency Name</th>
            <th className="py-2 border-b">Symbol</th>
            <th className="py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currencies.map((currency, index) => (
            <tr key={currency._id}>
              <td className="py-2 border-b text-center">{index + 1}</td>
              <td className="py-2 border-b text-center">{currency.currencyName}</td>
              <td className="py-2 border-b text-center">{currency.symbol}</td>
              <td className="py-2 border-b text-center space-x-2">
                <button
                  onClick={() => openEditModal(currency)}
                  className="text-[#735dff] hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(currency._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Currency;
