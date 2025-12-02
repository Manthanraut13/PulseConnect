const express = require('express');
const router = express.Router();
const {
  getNearbyDonors,
  getDonorProfile,
  updateAvailability,
  getDonationHistory,
  updateLocation
} = require('../controllers/donors');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// @route   GET /api/v1/donors/nearby
// @desc    Get nearby donors
// @access  Private (Blood Bank, NGO, Admin)
router.get(
  '/nearby',
  authorize('blood-bank', 'ngo', 'admin'),
  getNearbyDonors
);

// @route   GET /api/v1/donors/:id
// @desc    Get donor profile
// @access  Private
router.get('/:id', getDonorProfile);

// @route   PUT /api/v1/donors/availability
// @desc    Update donor availability
// @access  Private (Donor only)
router.put(
  '/availability',
  authorize('donor'),
  updateAvailability
);

// @route   GET /api/v1/donors/history
// @desc    Get donation history
// @access  Private (Donor only)
router.get(
  '/history',
  authorize('donor'),
  getDonationHistory
);

// @route   PUT /api/v1/donors/location
// @desc    Update donor location
// @access  Private (Donor, Transport)
router.put(
  '/location',
  authorize('donor', 'transport'),
  updateLocation
);

module.exports = router;