const { convertDate } = require('../globalFunctions');
const dbModel = require('../models/database_model');

module.exports = function(socket) {
  socket.on('newAnnouncementSocket', async (data) => {
    let connection;
    try {
      connection = await dbModel.getConnection();

      const response = await dbModel.query('SELECT * FROM announcements WHERE announcement_id = ?', data);
      const newResponse = response.map(prev => ({
        ...prev,
        datetime: convertDate(prev.datetime)
      }));
      
      socket.emit('announcementSocket', newResponse);
      socket.broadcast.emit('announcementSocket', newResponse);
    } catch (error) {
      socket.emit('announcementSocketError', error.message);
    } finally {
      dbModel.releaseConnection(connection);
    }
  })
  socket.on('deleteAnnouncement', (data) => {
    socket.emit('deleteAnnouncementSocket', data);
    socket.broadcast.emit('deleteAnnouncementSocket', data);
  })
};