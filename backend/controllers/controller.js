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