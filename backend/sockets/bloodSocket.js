const { convertDate } = require('../globalFunctions');
const dbModel = require('../models/database_model');

module.exports = function(io) {
  io.on('connection', (socket) => {

    socket.on('newBloodSocket', async (data) => {
      let connection;
      try {
        connection = await dbModel.getConnection();
        const query = `
        SELECT 
          cb.donation_id, CONCAT(c.citizen_firstname, ' ', c.citizen_lastname) AS full_name, c.citizen_gender, c.citizen_birthdate, c.citizen_bloodtype, c.citizen_barangay, c.citizen_number, cb.donated_at
        FROM 
          citizen_blood cb 
        INNER JOIN 
          citizen c 
        ON 
          c.citizen_family_id = cb.citizen_family_id
        WHERE
          cb.citizen_family_id = ?
        ORDER BY cb.donation_id DESC
        LIMIT 1;`;
        const response = await dbModel.query(query, data.citizen_family_id);
        const newResponse = response.map((res) => {
          return {
            ...res,
            citizen_birthdate: convertDate(res.citizen_birthdate, false),
            donated_at: convertDate(res.donated_at, false),
          };
        });
        socket.emit('bloodSocket', newResponse);
        socket.broadcast.emit('bloodSocket', newResponse);
      } catch (error) {
        socket.emit('bloodSocketError', error.message);
      } finally {
        dbModel.releaseConnection(connection);
      }
    });

  });
};