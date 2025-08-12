const Complaint = require('../models/Complaint');

// Create complaint
const createComplaint = async (
  req,
  res
) => {
  try {
    const payload = { ...req.body, status: 'Open' }; // enforce Open on create
    const doc = await Complaint.create(payload);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all complaints
const getComplaints = async (
  req,
  res
) => {
  try {
    const docs = await Complaint.find().sort({ createdAt: -1 });
    const now = Date.now();
    const out = docs.map(d => {
      const end =
        d.status === 'Resolved' || d.status === 'Closed - No Resolution'
          ? (d.completionDate ? d.completionDate.getTime() : now)
          : now;
      const ageDays = Math.floor((end - d.createdAt.getTime()) / (1000 * 60 * 60 * 24));
      return { ...d.toObject(), ageDays };
    });
    res.json(out);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update complaint details
const updateComplaint = async (
  req,
  res
) => {
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

// Close without resolution fiunc
const closeWithoutResolution = async (
  req,
  res
) => {
  try {
    const doc = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: 'Closed - No Resolution' }, // (original behavior: no completionDate here)
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update status (sets completionDate when Resolved)
const updateStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;
    const update = { status };
    if (status === 'Resolved') update.completionDate = new Date();

    const doc = await Complaint.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  updateComplaint,
  closeWithoutResolution,
  updateStatus
};
