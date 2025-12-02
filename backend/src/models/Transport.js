const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  agencyName: {
    type: String,
    required: true
  },
  vehicleNo: {
    type: String,
    required: true,
    unique: true
  },
  vehicleType: {
    type: String,
    enum: ['car', 'bike', 'van', 'refrigerated-van'],
    default: 'car'
  },
  driverName: {
    type: String,
    required: true
  },
  driverPhone: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  status: {
    type: String,
    enum: ['available', 'on-duty', 'off-duty', 'maintenance'],
    default: 'available'
  },
  currentAssignment: {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request'
    },
    assignedAt: Date,
    estimatedDelivery: Date,
    status: {
      type: String,
      enum: ['assigned', 'picked', 'in-transit', 'delivered', 'cancelled']
    }
  },
  documents: [{
    licenseUrl: String,
    rcUrl: String,
    insuranceUrl: String
  }],
  verified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  completedDeliveries: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

transportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Transport', transportSchema);