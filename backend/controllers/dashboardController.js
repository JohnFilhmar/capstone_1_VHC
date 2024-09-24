const dbModel = require('../models/database_model');

class DashboardController {
  
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
  
  async getDashboardData(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();

      const getPatientCountQuery = `
      SELECT COUNT(DISTINCT cq.citizen_family_id) AS patient_count
        FROM (
            SELECT citizen_family_id
            FROM citizen_queue
            WHERE DATE(time_arrived) = CURDATE()
            UNION
            SELECT citizen_family_id
            FROM citizen_appointments
            WHERE DATE(appointed_datetime) = CURDATE() AND status = "scheduled"
        ) AS cq;
      `;
      const [getPatientCountResponse] = await dbModel.query(getPatientCountQuery);

      const getStaffCountQuery = `SELECT COUNT(staff_id) AS staff_count FROM medicalstaff`;
      const [getStaffCountResponse] = await dbModel.query(getStaffCountQuery);

      const getDeliveriesQuery = `
      SELECT YEAR(ch.action_datetime) AS delivery_year, COUNT(*) AS delivery_count
        FROM citizen_history ch
        WHERE 
            (
                ch.action LIKE '%delivery%' 
                OR ch.action LIKE '%delivered%' 
                OR ch.action LIKE '%delivering%' 
                OR ch.action_details LIKE '%delivery%' 
                OR ch.action_details LIKE '%delivered%'
                OR ch.action_details LIKE '%delivering%'
            )
        GROUP BY delivery_year
        UNION ALL
        SELECT YEAR(cq.time_arrived) AS delivery_year, COUNT(*) AS delivery_count
        FROM citizen_queue cq
        WHERE 
            (
                cq.reason LIKE '%delivery%' 
                OR cq.reason LIKE '%delivered%'
                OR cq.reason LIKE '%delivering%'
            )
        GROUP BY delivery_year
        ORDER BY delivery_year
      `;
      const getDeliveriesResponse = await dbModel.query(getDeliveriesQuery);

      const total_deliveries = getDeliveriesResponse.reduce((total, current) => total + current.delivery_count, 0);
      
      return res.status(200).json({
        status: 200,
        message: "Successfully Retrieved Data!",
        data: {
          ...getPatientCountResponse,
          ...getStaffCountResponse,
          total_deliveries: total_deliveries,
          annual_deliveries: getDeliveriesResponse
        }
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

module.exports = new DashboardController();