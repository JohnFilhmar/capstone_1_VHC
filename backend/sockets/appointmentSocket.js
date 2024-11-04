const { convertDate } = require('../globalFunctions');
const dbModel = require('../models/database_model');

module.exports = function(io) {
  io.on('connection', (socket) => {

    socket.on('updateAppointmentSocket', async () => {
      let connection;
      try {
        connection = await dbModel.getConnection();
        const response = await dbModel.query(`
        SELECT 
          ca.appointment_id, 
          CONCAT(c.citizen_firstname, ' ', c.citizen_lastname) AS full_name, 
          ca.phone_number, 
          ca.status, 
          ca.created_at, 
          ca.appointed_datetime 
        FROM citizen_appointments ca 
        INNER JOIN citizen c 
        ON c.citizen_family_id = ca.citizen_family_id`);
        const newResponse = response.map((res) => {
          return {
              ...res,
              appointed_datetime: convertDate(res.appointed_datetime),
              created_at: convertDate(res.created_at),
          };
        });
        socket.emit('appointmentSocket', newResponse);
        socket.broadcast.emit('appointmentSocket', newResponse);
      } catch (error) {
        socket.emit('appointmentSocketError', error.message);
      } finally {
        dbModel.releaseConnection(connection);
      }
    });

    socket.on('appointmentDecisionSocket', async () => {
      
    });

  });
};