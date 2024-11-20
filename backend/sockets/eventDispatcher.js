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
const userSocket = require('./userSocket');
const historicalRecordSocket = require('./historicalRecordSocket');
const notificationSocket = require('./notificationSocket');
const announcementSocket = require('./announcementSocket');

function initializeWebSocket(io) {
  
  io.on('connection', (socket) => {
    userSocket(socket);
    recordSocket(socket);
    historicalRecordSocket(socket);
    appointmentSocket(socket);
    queueSocket(socket);
    staffSocket(socket);
    pharmacySocket(socket);
    bloodSocket(socket);
    authenticationSocket(socket);
    messagingSocket(socket);
    equipmentSocket(socket);
    notificationSocket(socket);
    announcementSocket(socket);
  });

  return io;
}

module.exports = initializeWebSocket;