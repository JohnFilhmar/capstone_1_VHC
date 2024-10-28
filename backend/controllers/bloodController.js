const dbModel = require('../models/database_model');
const { convertDate } = require('../globalFunctions');

class BloodController {
  
  async getBlood(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();

      const response = await dbModel.query(`
        SELECT 
          cb.donation_id, CONCAT(c.citizen_firstname, ' ', c.citizen_lastname) AS full_name, c.citizen_gender, c.citizen_birthdate, c.citizen_bloodtype, c.citizen_barangay, c.citizen_number, cb.donated_at
        FROM 
          citizen_blood cb 
        INNER JOIN 
          citizen c 
        ON 
          c.citizen_family_id = cb.citizen_family_id;`);
      const newResponse = response.map((res) => {
        return {
          ...res,
          donated_at: convertDate(res.donated_at, false),
          citizen_birthdate: convertDate(res.citizen_birthdate, false)
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

  async addDonor(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();

      const { familyId, staff_id, bloodtype, isBloodChanged, dateTime } = req.body;
      if (isBloodChanged) {
        const updateBloodQuery = `
          UPDATE citizen SET citizen_bloodtype = ? WHERE citizen_family_id = ?;`;
        await dbModel.query(updateBloodQuery, [bloodtype, familyId]);
      }

      const addDonorQuery = `
        INSERT INTO 
          citizen_blood (citizen_family_id, donated_at)
        VALUES
          (?, ?);`;
      await dbModel.query(addDonorQuery, [familyId, dateTime]);

      const insertCitizenHistoryQuery =
        "INSERT INTO `citizen_history` (`family_id`, `action`, `action_details`, `staff_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)";
      const insertCitizenHistoryPayload = [
        familyId,
        "donated blood",
        `donated blood at ${dateTime}`,
        staff_id,
        dateTime,
      ];
      await dbModel.query(insertCitizenHistoryQuery, insertCitizenHistoryPayload);
      
      const insertHistoryQuery = 'INSERT INTO `medicalstaff_history` (`staff_id`, `action`, `action_details`, `citizen_family_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)';
      const insertHistoryPayload = [
        staff_id,
        'created blood donation',
        `added ${familyId} a blood donor record at ${dateTime}`,
        familyId,
        dateTime
      ]
      await dbModel.query(insertHistoryQuery, insertHistoryPayload);
            
      return res.status(200).json({
        status: 200,
        message: 'Donor added succesfully!'
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