const Departments = require('../models/departments');

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Departments.find().populate('branch');
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

exports.addDepartments = async (req, res) => {
  try {
    const newDepartment = new Departments({
      name: req.body.name,
      branch: req.body.branch,
    });
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add department' });
  }
};

exports.updateDepartments = async (req, res) => {
  try {
    const updatedDepartment = await Departments.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        branch: req.body.branch,
      },
      { new: true }
    );
    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update department' });
  }
};

exports.deleteDepartments = async (req, res) => {
  try {
    await Departments.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete department' });
  }
};
