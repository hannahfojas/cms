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

<<<<<<< HEAD
// Get all complaints (includes ageDays has been added also)
=======
// Get all complaints
>>>>>>> 8619fb8 (refine add,view, update, resolution)
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

<<<<<<< HEAD
// Close without resolution
=======
// Close without resolution fiunc
>>>>>>> 8619fb8 (refine add,view, update, resolution)
const closeWithoutResolution = async (
  req,
  res
) => {
  try {
    const doc = await Complaint.findByIdAndUpdate(
      req.params.id,
<<<<<<< HEAD
      { status: 'Closed - No Resolution', completionDate: new Date() }, //stops aging also if closed even if no reso
=======
      { status: 'Closed - No Resolution' }, // (original behavior: no completionDate here)
>>>>>>> 8619fb8 (refine add,view, update, resolution)
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

<<<<<<< HEAD
const addResolutionNote = async (
  req,
  res
) => {
  try {
    const { text, author } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Note text is required' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Not found' });

    if (complaint.status !== 'Resolved') {
      return res.status(400).json({ message: 'Resolution notes can only be added when complaint is Resolved' });
    }

    complaint.resolutionNotes = complaint.resolutionNotes || [];
    complaint.resolutionNotes.push({
      text: text.trim(),
      author: author && author.trim() ? author.trim() : 'Staff'
    });

    const updated = await complaint.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

=======
>>>>>>> 8619fb8 (refine add,view, update, resolution)
module.exports = {
  createComplaint,
  getComplaints,
  updateComplaint,
  closeWithoutResolution,
<<<<<<< HEAD
  updateStatus,
  addResolutionNote
};
=======
  updateStatus
};
>>>>>>> 8619fb8 (refine add,view, update, resolution)
