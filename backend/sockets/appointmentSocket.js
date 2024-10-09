const dbModel = require('../models/database_model');

module.exports = function(io) {
  io.on('connection', (socket) => {

    socket.on('newAppointmentSocket', async (data) => {
      let connection;
      try {
        connection = await dbModel.getConnection();
        const response = await dbModel.query("SELECT ca.appointment_id, CONCAT(c.citizen_firstname, ' ', c.citizen_lastname) AS full_name, c.citizen_number, ca.status, ca.created_at, ca.appointed_datetime FROM citizen_appointments ca INNER JOIN citizen c ON c.citizen_family_id = ca.citizen_family_id WHERE ca.citizen_family_id = ? AND ca.appointed_datetime = ?", [data.citizen_family_id, data.appointedTime]);
        const convertDate = (Ddate) => {
          const date = new Date(Ddate);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = date.getHours() % 12 || 12;
          const meridian = date.getHours() >= 12 ? 'PM' : 'AM';
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const formattedDateString = `${month}-${day}-${year} ${hours}:${minutes} ${meridian}`;
          return formattedDateString;
        };
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
        socket.broadcast.emit('appointmentSocketError', error.message);
      } finally {
        dbModel.releaseConnection(connection);
      }
    });

    socket.on('appointmentDecisionSocket', async () => {
      
    });

  });
};