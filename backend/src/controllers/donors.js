const User = require('../models/User');
const Request = require('../models/Request');
const geolib = require('geolib');

// @desc    Get nearby donors
// @route   GET /api/v1/donors/nearby
// @access  Private
exports.getNearbyDonors = async (req, res) => {
  try {
    const { lat, lng, radius = 10, bloodGroup } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Please provide latitude and longitude'
      });
    }

    // Convert radius from km to meters
    const radiusInMeters = radius * 1000;

    // Create query
    let query = {
      role: 'donor',
      isAvailable: true,
      verified: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radiusInMeters
        }
      }
    };

    // Filter by blood group if provided
    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }

    const donors = await User.find(query)
      .select('-password -__v')
      .limit(50);

    // Calculate distance for each donor
    const donorsWithDistance = donors.map(donor => {
      const distance = geolib.getDistance(
        { latitude: lat, longitude: lng },
        { latitude: donor.location.coordinates[1], longitude: donor.location.coordinates[0] }
      );
      
      return {
        ...donor.toObject(),
        distance: distance / 1000, // Convert to km
        distanceInMeters: distance
      };
    });

    // Sort by distance
    donorsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      count: donorsWithDistance.length,
      data: donorsWithDistance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get donor profile
// @route   GET /api/v1/donors/:id
// @access  Private
exports.getDonorProfile = async (req, res) => {
  try {
    const donor = await User.findById(req.params.id)
      .select('-password -__v')
      .populate({
        path: 'donationHistory',
        select: 'patientName bloodGroup unitsRequired createdAt status'
      });

    if (!donor || donor.role !== 'donor') {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: donor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update donor availability
// @route   PUT /api/v1/donors/availability
// @access  Private
exports.updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    const donor = await User.findByIdAndUpdate(
      req.user.id,
      { isAvailable },
      { new: true, runValidators: true }
    ).select('-password -__v');

    // Emit socket event for real-time update
    if (req.app.get('socketio')) {
      req.app.get('socketio').emit('donorAvailabilityUpdate', {
        donorId: donor._id,
        isAvailable: donor.isAvailable,
        location: donor.location
      });
    }

    res.status(200).json({
      success: true,
      data: donor,
      message: `Availability updated to ${isAvailable ? 'Available' : 'Not Available'}`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get donation history
// @route   GET /api/v1/donors/history
// @access  Private
exports.getDonationHistory = async (req, res) => {
  try {
    const history = await Request.find({
      $or: [
        { assignedDonor: req.user.id },
        { 'matchedDonors.donor': req.user.id, 'matchedDonors.accepted': true }
      ],
      status: { $in: ['completed', 'cancelled'] }
    })
    .select('patientName bloodGroup unitsRequired urgency status completedAt createdAt')
    .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update location
// @route   PUT /api/v1/donors/location
// @access  Private
exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Please provide latitude and longitude'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        location: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        }
      },
      { new: true }
    ).select('-password -__v');

    // Emit socket event for real-time location update
    if (req.app.get('socketio')) {
      req.app.get('socketio').emit('locationUpdate', {
        userId: user._id,
        role: user.role,
        location: user.location,
        isAvailable: user.isAvailable
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'Location updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};