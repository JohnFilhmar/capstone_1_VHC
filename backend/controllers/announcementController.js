const dbModel = require('../models/database_model');
const jwt = require("jsonwebtoken");

class Controller {
  
  async addAnnouncement(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      
      const { title, details, dateTime } = req.body;
      const addAnnouncementQuery = `
        INSERT INTO announcements 
          (title, details, datetime)
        VALUES
          (?, ?, ?);`;
      const payload = [title, details, dateTime];
      const response = await dbModel.query(addAnnouncementQuery, payload);
      return res.status(200).json({
        status: 200,
        message: "Successfully added an announcement!",
        insertId: response.insertId
      })
            
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

  async deleteAnnouncement(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      
      await dbModel.query('DELETE FROM announcements WHERE announcement_id = ?', req.params.id);
      return res.status(200).json({
        status: 200,
        message: "Announcement successfully deleted!"
      })
            
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