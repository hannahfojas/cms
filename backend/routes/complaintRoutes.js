const router = require('express').Router();
const c = require('../controllers/complaintController');

router.post('/', c.createComplaint);
router.get('/', c.getComplaints);
router.patch('/:id', c.updateComplaint);
router.post('/:id/close', c.closeWithoutResolution);
router.post('/:id/status', c.updateStatus);

module.exports = router;
