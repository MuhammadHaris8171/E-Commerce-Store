const Currency = require('../models/Currency');

exports.getCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.find();
    res.status(200).json(currencies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch currencies' });
  }
};

exports.addCurrency = async (req, res) => {
  try {
    const newCurrency = new Currency({ currencyName: req.body.currencyName, symbol: req.body.symbol });
    await newCurrency.save();
    res.status(201).json(newCurrency);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add currency' });
  }
};

exports.updateCurrency = async (req, res) => {
  try {
    const updatedCurrency = await Currency.findByIdAndUpdate(req.params.id, { currencyName: req.body.currencyName, symbol: req.body.symbol }, { new: true });
    res.status(200).json(updatedCurrency);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update currency' });
  }
};

exports.deleteCurrency = async (req, res) => {
  try {
    await Currency.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Currency deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete currency' });
  }
};
