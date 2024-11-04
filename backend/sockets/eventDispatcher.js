const dbModel = require('../models/database_model');
require('dotenv').config();
const recordSocket = require('./recordSocket');
const appointmentSocket = require('./appointmentSocket');
const queueSocket = require('./queueSocket');
const staffSocket = require('./staffSocket');
const pharmacySocket = require('./pharmacySocket');
const authenticationSocket = require('./authenticationSocket');
const bloodSocket = require('./bloodSocket');
const messagingSocket = require('./messagingSocket');
const equipmentSocket = require('./equipmentSocket');

function initializeWebSocket(io) {
  
  recordSocket(io);
  appointmentSocket(io);
  queueSocket(io);
  staffSocket(io);
  pharmacySocket(io);
  bloodSocket(io);
  authenticationSocket(io);
  messagingSocket(io);
  equipmentSocket(io);

  return io;
}

module.exports = initializeWebSocket;