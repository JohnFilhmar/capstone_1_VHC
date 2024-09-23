const dbModel = require('../models/database_model');

class Controller {
  
  async endPoint(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();


            
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