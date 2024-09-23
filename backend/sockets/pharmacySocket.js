const dbModel = require('../models/database_model');

module.exports = function(io) {
  io.on('connection', (socket) => {
    socket.on('updatePharmacy', async () => {
      let connection;
      try {
        connection = await dbModel.getConnection();
        const response = await dbModel.query('SELECT `item_id`, `item_name`, `quantity`, `container_type`, `lot_no`, `exp_date`, `quantity_stockroom` FROM `pharmacy_inventory`');
        const newResponse = response.map((res) => {
          if (!res.exp_date || isNaN(new Date(res.exp_date).getTime())) {
            return {
              ...res,
              exp_date: null,
            };
          }
          const date = new Date(res.exp_date);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const formattedDateTime = `${month}-${day}-${year}`;
          return {
            ...res,
            exp_date: formattedDateTime
          };
        });
        socket.emit('newPharmacy', newResponse);
        socket.broadcast.emit('newPharmacy', newResponse);
      } catch (error) {
        socket.emit('newPharmacyError', error.message);
        socket.broadcast.emit('newPharmacyError', error.message);
      } finally {
        dbModel.releaseConnection(connection);
      }
    });
  });
};