const router = require('express').Router();
const {
  createComplaint,
  getComplaints,
  updateComplaint,
  closeWithoutResolution,
  updateStatus,
  addResolutionNote
} = require('../controllers/complaintController');

router.post('/', createComplaint);
router.get('/',  getComplaints);
router.patch('/:id', updateComplaint);
router.post('/:id/close',  closeWithoutResolution);
router.post('/:id/status', updateStatus);

router.post('/:id/notes', addResolutionNote);

module.exports = router;
