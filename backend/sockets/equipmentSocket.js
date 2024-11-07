const { convertDate } = require("../globalFunctions");
const dbModel = require("../models/database_model");

module.exports = function (socket) {
  socket.on("newEquipmentSocket", async (data) => {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const response = await dbModel.query(
        `SELECT * FROM equipments WHERE equipment_id = ?;`, data);
      const newResponse = response.map((prev) => ({
        ...prev,
        purchase_date: convertDate(prev.purchase_date, false),
        maintenance_date: convertDate(prev.maintenance_date, false),
        next_maintenance: convertDate(prev.next_maintenance, false),
      }));
      socket.emit("equipmentSocket", newResponse);
      socket.broadcast.emit("equipmentSocket", newResponse);
    } catch (error) {
      socket.emit("equipmentSocketError", error.message);
    } finally {
      dbModel.releaseConnection(connection);
    }
  });
};
