const dbModel = require('../models/database_model');

module.exports = function(socket) {
  socket.on('broadcastNotification', async (data) => {
    socket.emit('newNotification', data);
    socket.broadcast.emit('newNotification', data);
  });
};