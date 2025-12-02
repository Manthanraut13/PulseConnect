const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Request = require('../models/Request');

// @route   GET /api/requests
// @desc    Get all requests
// @access  Public (for demo)
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find().populate('createdBy', 'name email').sort('-createdAt');
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   POST /api/requests
// @desc    Create blood request
// @access  Private
router.post('/', protect, authorize('donor', 'admin'), async (req, res) => {
  try {
    const request = await Request.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/requests/:id/accept
// @desc    Accept a blood request
// @access  Private (Blood Bank only)
router.put('/:id/accept', protect, authorize('blood-bank', 'admin'), async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    request.status = 'assigned';
    request.assignedTo = req.user.id;
    await request.save();

    res.json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   GET /api/requests/nearby
// @desc    Get nearby requests (simplified)
// @access  Private
router.get('/nearby', protect, async (req, res) => {
  try {
    // Simplified: just return all open requests
    const requests = await Request.find({ status: 'open' }).sort('-createdAt');
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;