const { convertDate } = require('../globalFunctions');
const dbModel = require('../models/database_model');
const jwt = require("jsonwebtoken");

class Controller {
  
  async getHomeData(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();

      const getAnnouncements = await dbModel.query(`
        SELECT * FROM announcements`);
      const newAnnouncements = getAnnouncements.map(prev => ({
        ...prev,
        datetime: convertDate(prev.datetime)
      }))

      const [getOnQueue] = await dbModel.query(`
        SELECT 
          COUNT(*) AS total_status_count
        FROM 
          citizen_queue
        WHERE 
          current_status IN ('waiting', 'serving', 'emergency', 'priority') 
          AND DATE(time_arrived) = CURDATE();`);

      const [getUpcomingAppointments] = await dbModel.query(`
        SELECT 
          COUNT(*) AS total_upcoming_appointments
        FROM 
          citizen_appointments
        WHERE 
          status = 'scheduled' 
          AND appointed_datetime >= NOW();`);
          
      return res.status(200).json({
        status: 200,
        data: {
          announcements: newAnnouncements,
          onQueue: getOnQueue.total_status_count,
          upcomingAppointments: getUpcomingAppointments.total_upcoming_appointments
        }
      });
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