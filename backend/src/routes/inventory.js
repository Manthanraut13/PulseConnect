const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Inventory = require('../models/Inventory');

// @route   GET /api/inventory
// @desc    Get inventory for current blood bank
// @access  Private (Blood Bank)
router.get('/', protect, authorize('blood-bank', 'admin'), async (req, res) => {
  try {
    let inventory = await Inventory.findOne({ bloodBankId: req.user.id });
    
    if (!inventory) {
      // Create default inventory if not exists
      inventory = await Inventory.create({ 
        bloodBankId: req.user.id,
        bloodGroups: {
          'A+': 10, 'A-': 5,
          'B+': 8, 'B-': 4,
          'O+': 15, 'O-': 3,
          'AB+': 6, 'AB-': 2
        }
      });
    }
    
    res.json({ success: true, data: inventory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/inventory
// @desc    Update inventory
// @access  Private (Blood Bank)
router.put('/', protect, authorize('blood-bank', 'admin'), async (req, res) => {
  try {
    const { bloodGroup, action } = req.body; // action: 'increase' or 'decrease'
    
    let inventory = await Inventory.findOne({ bloodBankId: req.user.id });
    
    if (!inventory) {
      return res.status(404).json({ success: false, message: 'Inventory not found' });
    }
    
    if (action === 'increase') {
      inventory.bloodGroups[bloodGroup] += 1;
    } else if (action === 'decrease') {
      if (inventory.bloodGroups[bloodGroup] > 0) {
        inventory.bloodGroups[bloodGroup] -= 1;
      }
    }
    
    inventory.lastUpdated = new Date();
    await inventory.save();
    
    res.json({ success: true, data: inventory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;