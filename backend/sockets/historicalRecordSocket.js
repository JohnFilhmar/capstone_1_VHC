const { convertDate } = require("../globalFunctions");
const dbModel = require("../models/database_model");

module.exports = function (socket) {
  socket.on("newHistoricalDataSocket", async (data) => {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const getClinicRecordQuery = `
        SELECT * FROM citizen_clinical_record WHERE record_id = ?;
      `;
      const getClinicRecordResponse = await dbModel.query(getClinicRecordQuery, data);
      
      // socket.emit("historicalDataSocket", newResponse);
      // socket.broadcast.emit("historicalDataSocket", newResponse);
    } catch (error) {
      socket.emit("equipmentSocketError", error.message);
    } finally {
      dbModel.releaseConnection(connection);
    }
  });
};
