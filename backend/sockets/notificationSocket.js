const dbModel = require('../models/database_model');

module.exports = function(socket) {
  setInterval(async () => {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const response = await dbModel.query('SELECT * FROM announcements');
      socket.broadcast.emit("broadcastNotification", response);
    } catch (error) {
      socket.emit('broadcastNotificationError', error.message);
    } finally {
      dbModel.releaseConnection(connection);
    }
  }, 60000);
};