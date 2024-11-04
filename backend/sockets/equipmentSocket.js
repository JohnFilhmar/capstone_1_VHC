const dbModel = require('../models/database_model');

module.exports = function(io) {
  io.on('connection', (socket) => {

    socket.on('equipmentSocket', async () => {
      let connection;
      try {
        connection = await dbModel.getConnection();
        
        
        
        socket.emit('equipmentSocket', newResponse);
        socket.broadcast.emit('equipmentSocket', newResponse);
      } catch (error) {
        socket.emit('equipmentSocketError', error.message);
      } finally {
        dbModel.releaseConnection(connection);
      }
    });

  });
};