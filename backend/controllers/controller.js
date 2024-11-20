const dbModel = require('../models/database_model');
const jwt = require("jsonwebtoken");

class Controller {
  
  async endPoint(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const authHeader = req.headers["authorization"];
      const accessToken = authHeader.split(" ")[1];
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);


      const insertHistoryQuery = 'INSERT INTO `citizen_history` (`family_id`, `action`, `action_details`, `staff_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)';
      const historyPayload = [
        famId,
        `queued for ${status}`,
        `added to queue as ${status} by ${staff_id} at ${String(dateTime)}`,
        staff_id,
        dateTime
      ];
      await dbModel.query(insertHistoryQuery, historyPayload);
      
      const insertStaffHistoryQuery = 'INSERT INTO `medicalstaff_history` (`staff_id`, `action`, `action_details`, `citizen_family_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)';
      const staffHistoryPayload = [
        staff_id,
        'added a patient to the queue',
        `added to patient ${famId} to the queue`,
        famId,
        dateTime
      ];
      await dbModel.query(insertStaffHistoryQuery, staffHistoryPayload);
            
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error
      })
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

}

module.exports = new Controller();