const dbModel = require('../models/database_model');
const jwt = require("jsonwebtoken");

class Controller {
  
  async getBarangaysPopulation(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();

      const response = await dbModel.query(`
        SELECT 
          citizen_barangay AS Barangay,
          COUNT(*) AS "Total Population",
          SUM(CASE WHEN LOWER(citizen_gender) = 'male' THEN 1 ELSE 0 END) AS Male,
          SUM(CASE WHEN LOWER(citizen_gender) = 'female' THEN 1 ELSE 0 END) AS Female
        FROM 
          citizen
        GROUP BY 
          citizen_barangay
        ORDER BY 
          "Total Population" DESC;`);
      return res.status(200).json({
        status: 200,
        data: response
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