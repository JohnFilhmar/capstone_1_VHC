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

      const getCasesCountsQuery = `
        -- From ccr_diagnosis
        SELECT 
          TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(d.cases, ',', numbers.n), ',', -1)) AS case_name,
          COUNT(*) AS case_count
        FROM 
          ccr_diagnosis d
        JOIN (
          SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
          UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 
          UNION ALL SELECT 9 UNION ALL SELECT 10
        ) numbers ON CHAR_LENGTH(d.cases) - CHAR_LENGTH(REPLACE(d.cases, ',', '')) >= numbers.n - 1
        WHERE 
          TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(d.cases, ',', numbers.n), ',', -1)) <> ''
        GROUP BY 
          case_name
        HAVING 
          case_name IS NOT NULL

        UNION ALL

        -- From citizen_appointments
        SELECT 
          TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(a.description, ',', numbers.n), ',', -1)) AS case_name,
          COUNT(*) AS case_count
        FROM 
          citizen_appointments a
        JOIN (
          SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
          UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 
          UNION ALL SELECT 9 UNION ALL SELECT 10
        ) numbers ON CHAR_LENGTH(a.description) - CHAR_LENGTH(REPLACE(a.description, ',', '')) >= numbers.n - 1
        WHERE 
          a.status = 'scheduled' AND
          TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(a.description, ',', numbers.n), ',', -1)) <> ''
        GROUP BY 
          case_name
        HAVING 
          case_name IS NOT NULL

        UNION ALL

        -- From citizen_queue
        SELECT 
          TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(cq.reason, ',', numbers.n), ',', -1)) AS case_name,
          COUNT(*) AS case_count
        FROM 
          citizen_queue cq
        JOIN (
          SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
          UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 
          UNION ALL SELECT 9 UNION ALL SELECT 10
        ) numbers ON CHAR_LENGTH(cq.reason) - CHAR_LENGTH(REPLACE(cq.reason, ',', '')) >= numbers.n - 1
        WHERE 
          TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(cq.reason, ',', numbers.n), ',', -1)) <> ''
        GROUP BY 
          case_name
        HAVING 
          case_name IS NOT NULL

        ORDER BY 
          case_count DESC
        LIMIT 5;`;
      const getCasesCountsResponse = await dbModel.query(
        getCasesCountsQuery
      );

      const getCasesRateCountQuery = `
        SELECT 
          YEAR(ccr.datetime_issued) AS year, 
          TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(cd.cases, ',', n.n), ',', -1)) AS case_name, 
          COUNT(*) AS count
        FROM 
          ccr_diagnosis cd
        JOIN 
          citizen_clinical_record ccr ON cd.record_id = ccr.record_id
        JOIN 
          (SELECT a.N + b.N * 10 + 1 AS n
          FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a,
                (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
          ) n ON CHAR_LENGTH(cd.cases) - CHAR_LENGTH(REPLACE(cd.cases, ',', '')) >= n.n - 1
        -- Ensure case_name is not empty or null
        WHERE 
          TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(cd.cases, ',', n.n), ',', -1)) <> ''
        GROUP BY 
          year, case_name
        HAVING 
          case_name IS NOT NULL
        ORDER BY 
          year, count DESC;`;
      const getCasesRateCountResponse = await dbModel.query(
        getCasesRateCountQuery
      );

      const getAnnualPatientsQuery = `
        SELECT 
          year, 
          SUM(count) AS patient_count
        FROM (
          SELECT 
            YEAR(appointed_datetime) AS year, 
            COUNT(DISTINCT citizen_family_id) AS count
          FROM 
            citizen_appointments 
          WHERE 
            status = 'scheduled'
            AND YEAR(appointed_datetime) >= YEAR(CURDATE()) - 4
          GROUP BY 
            year
          UNION ALL
          SELECT 
            YEAR(time_arrived) AS year, 
            COUNT(DISTINCT citizen_family_id) AS count
          FROM 
            citizen_queue
          WHERE 
            YEAR(time_arrived) >= YEAR(CURDATE()) - 4
          GROUP BY 
            year
        ) AS combined_data
        GROUP BY 
          year
        ORDER BY 
          year ASC;`;
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
            YEAR(appointed_datetime) = YEAR(CURDATE())
          GROUP BY 
            MONTHNAME(appointed_datetime)
          UNION ALL
          SELECT 
            MONTHNAME(time_arrived) AS month, 
            COUNT(DISTINCT citizen_family_id) AS patient_count
          FROM 
            citizen_queue
          WHERE 
            YEAR(time_arrived) = YEAR(CURDATE())
          GROUP BY 
            MONTHNAME(time_arrived)
        ) AS combined
        GROUP BY 
          month
        ORDER BY 
          FIELD(
            month, 
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')
        LIMIT 4;`;
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
        LIMIT 3`;
      const getDailyPatientsResponse = await dbModel.query(
        getDailyPatientsQuery
      );

      const getBarangayCasesRateQuery = `
        SELECT 
          c.citizen_barangay AS barangay,
          TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(d.cases, ',', numbers.n), ',', -1)) AS case_name,
          COUNT(*) AS cases_count
        FROM 
          citizen c
        JOIN 
          citizen_clinical_record cr ON c.citizen_family_id = cr.citizen_family_id
        JOIN 
          ccr_diagnosis d ON cr.record_id = d.record_id
        JOIN (
          SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
          UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 
          UNION ALL SELECT 9 UNION ALL SELECT 10
        ) numbers ON CHAR_LENGTH(d.cases) - CHAR_LENGTH(REPLACE(d.cases, ',', '')) >= numbers.n - 1
        -- Filter out empty case names
        WHERE 
          YEAR(cr.datetime_issued) = YEAR(CURDATE()) AND 
          TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(d.cases, ',', numbers.n), ',', -1)) <> ''
        GROUP BY 
          c.citizen_barangay, case_name
        HAVING 
          case_name IS NOT NULL
        ORDER BY 
          barangay ASC, cases_count DESC
        LIMIT 5;`;
      const getBarangayCasesRateResponse = await dbModel.query(
        getBarangayCasesRateQuery
      );

      const getBloodCountQuery = `SELECT COUNT(*) as blood_count FROM citizen_blood;`
      const [getBloodCountResponse] = await dbModel.query(getBloodCountQuery);
      
      const getTopBloodDonorQuery = `
      SELECT 
        c.citizen_firstname AS firstname, 
        COUNT(cb.citizen_family_id) AS count
      FROM 
        citizen_blood cb
      JOIN 
        citizen c ON c.citizen_family_id = cb.citizen_family_id
      GROUP BY 
        c.citizen_firstname
      ORDER BY 
        count DESC
      LIMIT 5;`
      const getTopBloodDonorResponse = await dbModel.query(getTopBloodDonorQuery);
      
      return res.status(200).json({
        status: 200,
        message: 'Successfully Retrieved Data!',
        data: {
          ...getPatientCountResponse,
          ...getStaffCountResponse,
          cases_count: getCasesCountsResponse,
          cases_rate: getCasesRateCountResponse,
          annual_patients: getAnnualPatientsResponse,
          monthly_patients: getMonthlyPatientsResponse,
          daily_patients: getDailyPatientsResponse,
          barangay_cases_rate: getBarangayCasesRateResponse,
          ...getBloodCountResponse,
          annual_blood: getTopBloodDonorResponse
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
