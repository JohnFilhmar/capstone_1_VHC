const { Server } = require('socket.io');
const dbModel = require('../models/database_model');
require('dotenv').config();
const recordSocket = require('./recordSocket');
const appointmentSocket = require('./appointmentSocket');
const queueSocket = require('./queueSocket');
const staffSocket = require('./staffSocket');
const pharmacySocket = require('./pharmacySocket');
const authenticationSocket = require('./authenticationSocket');

function initializeWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: [process.env.ALLOWED_ORIGIN, 'https://localhost:3000', 'https://192.168.1.2:3000'],
      methods: ["GET", "POST"],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    },
  });
  
  recordSocket(io);
  appointmentSocket(io);
  queueSocket(io);
  staffSocket(io);
  pharmacySocket(io);
  authenticationSocket(io);

  return io;
}

module.exports = initializeWebSocket;