const User = require('../models/User');
const SECRET_KEY = 'resturant_website';
const jwt = require("jsonwebtoken")
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('role').populate('branch');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { name, password } = req.body;

  // ✅ Hardcoded admin login
  if (name === 'admin' && password === 'admin123') {
    const token = jwt.sign({ name: 'admin', role: 'admin' }, SECRET_KEY, { expiresIn: '1d' });
    return res.status(200).json({ message: 'Admin login successful', token, role: 'admin' });
  }

  try {
    const user = await User.findOne({ name, password });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1d' });

    const roleMessage = user.role === 'admin' ? 'Admin' : 'User';

    return res.status(200).json({ message: `${roleMessage} login successful`, token, role: user.role });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};