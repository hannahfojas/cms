const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complainantName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },

  title: { type: String, required: true },
  description: { type: String },

  createdAt: { type: Date, default: Date.now },
  completionDate: { type: Date },

  category: { type: String, enum: ['Low', 'Moderate', 'High'], required: true },
  assignedTo: { type: String, required: true },

  status: {type: String, enum: ['Open','In Progress','Completed','Closed - No Resolution'], default: 'Open'}
});

module.exports = mongoose.model('Complaint', complaintSchema);
