const dbModel = require('../models/database_model');

module.exports = function(socket) {
  socket.on('updateQueue', async (data) => {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const date = new Date(data.dateTime);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      const startDate = `${year}-${month}-${day} 00:00:00`;
      const endDate = `${year}-${month}-${day} 23:59:59`;
      const queueQuery = `
      SELECT 
        cq.queue_number, 
        c.citizen_family_id AS family_id, 
        CONCAT(c.citizen_firstname, ' ', c.citizen_middlename, ' ', c.citizen_lastname) AS citizen_fullname, 
        c.citizen_barangay, 
        c.citizen_number, 
        c.citizen_gender, 
        cq.time_arrived, 
        cq.current_status,
        cq.reason 
      FROM 
        citizen c 
      INNER JOIN  
        citizen_queue cq 
      ON 
        c.citizen_family_id = cq.citizen_family_id
      WHERE 
        cq.time_arrived BETWEEN ? AND ? `;
      const response = await dbModel.query(queueQuery, [startDate, endDate]);
      const newResponse = response.map((res) => {
        const date = new Date(res.time_arrived);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours() % 12 || 12);
        const minute = String(date.getMinutes());
        const meridian = date.getHours() >= 12 ? 'PM' : 'AM';
        const formattedDateTime = `${month}-${day}-${year} ${hour}:${minute} ${meridian}`;
        return {
          ...res,
          time_arrived: formattedDateTime,
        };
      });
      socket.emit('queueSocket', newResponse);
      socket.broadcast.emit('queueSocket', newResponse);
    } catch (error) {
      socket.emit('queueSocketError', error.message);
    } finally {
      dbModel.releaseConnection(connection);
    }
  });

  socket.on('updateAttended', async () => {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const query = `SELECT cq.queue_number, c.citizen_family_id AS family_id, CONCAT(c.citizen_firstname, ' ', c.citizen_middlename, ' ', c.citizen_lastname) AS citizen_fullname, c.citizen_barangay, c.citizen_number, c.citizen_gender, cq.time_arrived, cq.current_status FROM citizen c INNER JOIN  citizen_queue cq ON c.citizen_family_id = cq.citizen_family_id`;
      const response = await dbModel.query(query);
      socket.emit('newAttended', response);
      socket.broadcast.emit('newAttended', response);
    } catch (error) {
      socket.emit('newAttendedError', error.message);
    } finally {
      dbModel.releaseConnection(connection);
    }
  })
};