const Complaint = require('../models/Complaint');

// US1: Create complaint
exports.createComplaint = async (req, res) => {
  try {
    const payload = { ...req.body, status: 'Open' };
    const doc = await Complaint.create(payload);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// US2: Get all complaint
exports.getComplaints = async (req, res) => {
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

//This is for status Updatess woohoo
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const update = { status };
    if (status === 'Resolved') update.completionDate = new Date();

    const doc = await Complaint.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
