const dbModel = require('../models/database_model');

module.exports = function(io) {
  io.on('connection', (socket) => {

    socket.on('newStaffSocket', async () => {
      let connection;
      try {
        connection = await dbModel.getConnection();
        const query = "SELECT `staff_id`, `username`, `email`, `isVerified`, `role` FROM `medicalstaff` WHERE `username` = ?";
        const response = await dbModel.query(query, req.body.username);
        const newResponse = response.map((res) => {
          return {
              ...res,
              isVerified: res.isVerified ? 'Verified' : 'Unverified'
          };
        });
        socket.emit('staffSocket', newResponse);
        socket.broadcast.emit('staffSocket', newResponse);
      } catch (error) {
        socket.emit('staffSocketError', error.message);
      } finally {
        dbModel.releaseConnection(connection);
      }
    });

  });
};