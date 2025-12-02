const socketIO = require('socket.io');

let io;

const init = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join room based on user role and ID
    socket.on('join', (userData) => {
      if (userData.userId) {
        socket.join(`user_${userData.userId}`);
      }
      if (userData.role) {
        socket.join(userData.role);
      }
      if (userData.requestId) {
        socket.join(`request_${userData.requestId}`);
      }
      console.log(`User ${userData.userId} joined rooms`);
    });

    // Track transport location
    socket.on('updateTransportLocation', (data) => {
      const { transportId, location, requestId } = data;
      
      // Update transport location in database (optional)
      // Emit to relevant users
      io.to(`request_${requestId}`).emit('transportLocationUpdate', {
        transportId,
        location,
        timestamp: new Date()
      });
      
      // Also emit to blood bank and admin
      io.to('blood-bank').to('admin').emit('transportTracking', {
        transportId,
        requestId,
        location,
        timestamp: new Date()
      });
    });

    // Handle donor availability updates
    socket.on('donorAvailability', (data) => {
      io.emit('donorAvailabilityUpdate', data);
    });

    // Handle request status updates
    socket.on('requestStatusUpdate', (data) => {
      const { requestId, status, updatedBy } = data;
      
      io.to(`request_${requestId}`).emit('requestStatusChanged', {
        requestId,
        status,
        updatedBy,
        timestamp: new Date()
      });
    });

    // Handle inventory updates
    socket.on('inventoryUpdate', (data) => {
      const { bloodBankId, inventory } = data;
      
      io.emit('bloodBankInventoryUpdate', {
        bloodBankId,
        inventory,
        timestamp: new Date()
      });
    });

    // Handle urgent request notifications
    socket.on('urgentRequest', (data) => {
      const { request, bloodGroup, location } = data;
      
      // Find nearby donors and notify them
      io.to('donor').emit('urgentRequestNotification', {
        request,
        bloodGroup,
        location,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Store io instance in app
  require('../app').set('socketio', io);
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { init, getIO };