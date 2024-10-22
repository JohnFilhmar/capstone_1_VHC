const dbModel = require('../models/database_model');

class BloodController {
  
  async getBlood(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();

      const response = await dbModel.query("SELECT * FROM `citizen_blood`");
      const newResponse = response.map((res) => {
        const date = res.dontated_at;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${month}-${day}-${year}`;
        return {
          ...res,
          dontated_at: formattedDate
        };
      });
      return res.status(200).json({
        status: 200,
        message: "Data retrieved successfully",
        data: newResponse,
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

module.exports = new BloodController();