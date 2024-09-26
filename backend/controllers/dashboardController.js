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
      });
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
      ) AS cq;`;
      const [getPatientCountResponse] = await dbModel.query(
        getPatientCountQuery
      );

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
        ORDER BY delivery_year`;
      const getDeliveriesResponse = await dbModel.query(getDeliveriesQuery);

      const total_deliveries = getDeliveriesResponse.reduce(
        (total, current) => total + current.delivery_count,
        0
      );

      const getIllnessesCountsQuery = `
        SELECT illnesses AS illness, COUNT(*) AS count
          FROM ccr_diagnosis
          GROUP BY illnesses
          ORDER BY count DESC`;
      const getIllnessesCountsResponse = await dbModel.query(
        getIllnessesCountsQuery
      );

      const getIllnessesRateCountQuery = `
        SELECT 
          YEAR(ccr.datetime_issued) AS year, 
          cd.illnesses AS illness, 
          COUNT(*) AS count
        FROM 
          ccr_diagnosis cd
        JOIN 
          citizen_clinical_record ccr ON cd.record_id = ccr.record_id
        GROUP BY 
          year, illness
        ORDER BY 
          year, count DESC
        LIMIT 10;`;
      const getIllnessesRateCountResponse = await dbModel.query(
        getIllnessesRateCountQuery
      );

      const getAnnualPatientsQuery = `
        SELECT 
          YEAR(appointed_datetime) AS year, 
          COUNT(DISTINCT citizen_family_id) AS patient_count
        FROM 
          citizen_appointments
        WHERE 
          status = 'scheduled'
        GROUP BY 
          year
        UNION ALL
        SELECT 
          YEAR(time_arrived) AS year, 
          COUNT(DISTINCT citizen_family_id) AS patient_count
        FROM 
          citizen_queue
        GROUP BY 
          year
        ORDER BY
        year`;
      const getAnnualPatientsResponse = await dbModel.query(
        getAnnualPatientsQuery
      );

      const getMonthlyPatientsQuery = `
        SELECT 
          month, 
          SUM(patient_count) AS patient_count
        FROM (
          SELECT 
            MONTHNAME(appointed_datetime) AS month, 
            COUNT(DISTINCT citizen_family_id) AS patient_count
          FROM 
            citizen_appointments
          WHERE 
            status = 'scheduled'
            AND WEEK(appointed_datetime, 1) = WEEK(CURDATE(), 1)  
            AND MONTH(appointed_datetime) = MONTH(CURDATE())  
            AND YEAR(appointed_datetime) = YEAR(CURDATE())  
          GROUP BY 
            month
          UNION ALL
          SELECT 
            MONTHNAME(time_arrived) AS month, 
            COUNT(DISTINCT citizen_family_id) AS patient_count
          FROM 
            citizen_queue
          WHERE 
            WEEK(time_arrived, 1) = WEEK(CURDATE(), 1)  
            AND MONTH(time_arrived) = MONTH(CURDATE())  
            AND YEAR(time_arrived) = YEAR(CURDATE())  
          GROUP BY 
            month
        ) AS combined
        GROUP BY 
          month
        ORDER BY 
          FIELD(month, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');`;
      const getMonthlyPatientsResponse = await dbModel.query(
        getMonthlyPatientsQuery
      );

      const getDailyPatientsQuery = `
        SELECT 
          DAYNAME(appointed_datetime) AS day_name,
          COUNT(DISTINCT citizen_family_id) AS patient_count
        FROM 
          citizen_appointments
        WHERE 
          status = 'scheduled'
          AND WEEK(appointed_datetime, 1) = WEEK(CURDATE(), 1)
          AND YEAR(appointed_datetime) = YEAR(CURDATE())
        GROUP BY 
          day_name
        UNION ALL
        SELECT 
          DAYNAME(time_arrived) AS day_name,
          COUNT(DISTINCT citizen_family_id) AS patient_count
        FROM 
          citizen_queue
        WHERE 
          WEEK(time_arrived, 1) = WEEK(CURDATE(), 1)
          AND YEAR(time_arrived) = YEAR(CURDATE())
        GROUP BY 
          day_name
        ORDER BY 
          FIELD(day_name, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');  -- Order days by week`;
      const getDailyPatientsResponse = await dbModel.query(
        getDailyPatientsQuery
      );

      const getBarangayIllnessRateQuery = `
        SELECT 
  c.citizen_barangay AS barangay,
  d.illnesses AS illness,
  COUNT(d.illnesses) AS illness_count
FROM 
  citizen c
JOIN 
  citizen_clinical_record cr ON c.citizen_family_id = cr.citizen_family_id
JOIN 
  ccr_diagnosis d ON cr.record_id = d.record_id
WHERE 
  YEAR(cr.datetime_issued) = YEAR(CURDATE())  -- Filter for the current year
GROUP BY 
  c.citizen_barangay, d.illnesses
HAVING 
  illness_count = (
    SELECT MAX(illness_count)
    FROM (
      SELECT 
        COUNT(d2.illnesses) AS illness_count,
        c2.citizen_barangay
      FROM 
        citizen c2
      JOIN 
        citizen_clinical_record cr2 ON c2.citizen_family_id = cr2.citizen_family_id
      JOIN 
        ccr_diagnosis d2 ON cr2.record_id = d2.record_id
      WHERE 
        YEAR(cr2.datetime_issued) = YEAR(CURDATE())  -- Filter for current year
      GROUP BY 
        c2.citizen_barangay, d2.illnesses
    ) AS subquery
    WHERE subquery.citizen_barangay = c.citizen_barangay
  )
ORDER BY 
  barangay ASC, illness_count DESC;
`;
      const getBarangayIllnessRateResponse = await dbModel.query(
        getBarangayIllnessRateQuery
      );

      return res.status(200).json({
        status: 200,
        message: 'Successfully Retrieved Data!',
        data: {
          ...getPatientCountResponse,
          ...getStaffCountResponse,
          total_deliveries: total_deliveries,
          annual_deliveries: getDeliveriesResponse,
          illnesses_count: getIllnessesCountsResponse,
          illnesses_rate: getIllnessesRateCountResponse,
          annual_patients: getAnnualPatientsResponse,
          monthly_patients: getMonthlyPatientsResponse,
          daily_patients: getDailyPatientsResponse,
          barangay_illness_rate: getBarangayIllnessRateResponse
        }
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }
}

module.exports = new DashboardController();
