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
  socket.on("updateEquipmentHistory", async (data) => {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const response = await dbModel.query(`
        SELECT
          eh.history_id AS id,
          CONCAT(cit.citizen_firstname, ' ', cit.citizen_lastname) AS borrower,
          ms.username AS lender,
          cit.citizen_barangay AS borrower_address,
          eq.equipment_name,
          eq.equipment_condition,
          eq.notes,
          eh.quantity,
          eh.address,
          eh.notes,
          eh.borrowed_at,
          eh.returned_at
        FROM
          equipments_history eh
        INNER JOIN
          equipments eq
        ON
          eq.equipment_id = eh.equipment_id
        INNER JOIN
          citizen cit
        ON
          eh.citizen_family_id = cit.citizen_family_id
        INNER JOIN
          medicalstaff ms
        ON
          eh.staff_id = ms.staff_id
        WHERE
          eh.history_id = ?`, data);
      const newResponse = response.map(prev => ({
        ...prev,
        borrowed_at: convertDate(prev.borrowed_at),
        returned_at: convertDate(prev.returned_at)
      }));
      socket.emit("equipmentHistorySocket", newResponse);
    } catch (error) {
      socket.emit("equipmentHistorySocketError", error.message);
    } finally {
      dbModel.releaseConnection(connection);
    }
  })
};
