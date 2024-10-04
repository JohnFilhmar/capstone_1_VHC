const dbModel = require('../models/database_model');

module.exports = function(io) {
  io.on('connection', (socket) => {

    socket.on('updateSocket', async () => {
      let connection;
      try {
        connection = await dbModel.getConnection();
        const query = "SELECT `staff_id`, `username`, `email`, `isVerified`, `role` FROM `medicalstaff`";
        const response = await dbModel.query(query);
        const newResponse = response.map((res) => {
          return {
              ...res,
              isVerified: res.isVerified ? 'Verified' : 'Unverified'
          };
        });
        socket.emit('newSocket', newResponse);
        socket.broadcast.emit('newSocket', newResponse);
      } catch (error) {
        socket.emit('newSocketError', error.message);
        socket.broadcast.emit('newSocketError', error.message);
      } finally {
        dbModel.releaseConnection(connection);
      }
    });

  });
};