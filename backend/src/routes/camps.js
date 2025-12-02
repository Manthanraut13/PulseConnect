const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Camp = require('../models/Camp');

// @route   GET /api/camps
// @desc    Get all camps
// @access  Public
router.get('/', async (req, res) => {
  try {
    const camps = await Camp.find().populate('organizer', 'name').sort('date');
    res.json({ success: true, data: camps });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   POST /api/camps
// @desc    Create camp
// @access  Private (NGO only)
router.post('/', protect, authorize('ngo', 'admin'), async (req, res) => {
  try {
    const camp = await Camp.create({
      ...req.body,
      organizer: req.user.id
    });
    res.status(201).json({ success: true, data: camp });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;