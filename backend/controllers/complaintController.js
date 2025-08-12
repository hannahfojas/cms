const Complaint = require('../models/Complaint');

// US1: Create complaint
exports.createComplaint = async (req, res) => {
  try {
    const doc = await Complaint.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// US2: Get all complaints
exports.getComplaints = async (req, res) => {
  try {
    const docs = await Complaint.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// US3: Update complaint details
exports.updateComplaint = async (req, res) => {
  try {
    const doc = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// US4: Close without resolution
exports.closeWithoutResolution = async (req, res) => {
  try {
    const doc = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: 'Closed - No Resolution' },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
