const dbModel = require('../models/database_model');

module.exports = function(io) {
  io.on('connection', (socket) => {

    socket.on('newEquipmentSocket', async (data) => {
      let connection;
      try {
        connection = await dbModel.getConnection();
        
        const response = await dbModel.query(`SELECT * FROM equipments WHERE equipment_id = ? AND equipment_type = ? AND location = ? AND purchase_date = ? AND next_maintenance = ? AND serial_number = ?;`, [data.equipmentname, data.equipmenttype, data.location, data.purchasedate, data.nextmaintenance, data.serialnumber]);
        const newResponse = response.map(prev => ({
          ...prev,
          purchase_date: convertDate(prev.purchase_date, false),
          maintenance_date: convertDate(prev.maintenance_date, false),
          next_maintenance: convertDate(prev.next_maintenance, false)
        }));
        
        socket.emit('equipmentSocket', newResponse);
        socket.broadcast.emit('equipmentSocket', newResponse);
      } catch (error) {
        socket.emit('equipmentSocketError', error.message);
      } finally {
        dbModel.releaseConnection(connection);
      }
    });

  });
};