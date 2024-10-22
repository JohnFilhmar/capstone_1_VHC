const dbModel = require('../models/database_model');

module.exports = function(io) {
  io.on('connection', (socket) => {

    socket.on('newBloodSocket', async () => {
      let connection;
      try {
        connection = await dbModel.getConnection();
        const query = "SELECT * FROM `citizen_blood` WHERE `citizen_family_id` = ?";
        const response = await dbModel.query(query, req.body.citizen_family_id);
        const newResponse = response.map((res) => {
          const date = res.dontated_at;
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const formattedDate = `${month}-${day}-${year}`;
          return {
            ...res,
            dontated_at: formattedDate
          };
        });
        socket.emit('bloodSocket', newResponse);
        socket.broadcast.emit('bloodSocket', newResponse);
      } catch (error) {
        socket.emit('bloodSocketError', error.message);
        socket.broadcast.emit('bloodSocketError', error.message);
      } finally {
        dbModel.releaseConnection(connection);
      }
    });

  });
};