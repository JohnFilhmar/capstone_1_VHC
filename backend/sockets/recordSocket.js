const dbModel = require('../models/database_model');

module.exports = function(socket) {
  socket.on('newRecordSocket', async (data) => {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const response = await dbModel.query('SELECT `citizen_firstname`, `citizen_middlename`, `citizen_lastname`, `citizen_gender`, `citizen_birthdate`, `citizen_bloodtype`, `citizen_barangay`, `citizen_family_id`, `citizen_number` FROM `citizen` WHERE `citizen_family_id` = ? AND `citizen_firstname` = ? AND `citizen_birthdate` = ?', [data.citizen_family_id, data.citizen_firstname, data.citizen_birthdate]);
      const newResponse = response.map((res) => {
        const date = new Date(res.citizen_birthdate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${month}-${day}-${year}`;
        return {
            citizen_family_id: res.citizen_family_id,
            ...res,
            citizen_birthdate: formattedDate
        };
      });
      socket.emit('recordSocket', newResponse);
      socket.broadcast.emit('recordSocket', newResponse);
    } catch (error) {
      socket.emit('recordSocketError', error.message);
    } finally {
      dbModel.releaseConnection(connection);
    }
  });
};