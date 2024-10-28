const dbModel = require("../models/database_model");
const { convertDate } = require('../globalFunctions');

class RecordController {
  async describeRecords(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();

      const getDescribeQuery = "DESCRIBE `citizen`";
      const getDescribeResponse = await dbModel.query(getDescribeQuery);

      if (!getDescribeResponse)
        return res
          .status(404)
          .json({ status: 404, message: "Table not found!" });

      return res.status(200).json({
        status: 200,
        data: getDescribeResponse,
        message: "Table successfully described!",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error,
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

  async addRecord(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const {
        family_id,
        firstName,
        middleName,
        lastName,
        gender,
        birthdate,
        bloodType,
        barangay,
        phone_number,
        dateTime,
        staff_id,
      } = req.body;

      const familyIdExistsQuery = `
        SELECT COUNT(citizen_lastname) AS count, citizen_lastname
        FROM citizen
        WHERE citizen_family_id LIKE CONCAT(?, '%')
        GROUP BY citizen_lastname
        LIMIT 1`;
      const [familyIdExistsResponse] = await dbModel.query(
        familyIdExistsQuery,
        [family_id]
      );
      const count = familyIdExistsResponse?.count;
      if (count > 0) return res.status(208).json({ status: 208, message: `Found ${count} records with the same Family ID.`, lastname: familyIdExistsResponse.citizen_lastname });

      const fullName = `${firstName} ${
        middleName ? middleName + " " : ""
      }${lastName}`;
      const date = new Date(birthdate);
      const newBirthdate = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      const checkIfNameExistsQuery = `
        SELECT 
          CASE 
            WHEN COUNT(*) > 0 THEN TRUE 
            ELSE FALSE 
          END AS record_exists
        FROM 
          citizen
        WHERE 
          LOWER(CONCAT(citizen_firstname, ' ', COALESCE(citizen_middlename, ''), ' ', citizen_lastname)) LIKE LOWER(?)
          AND citizen_birthdate = ?
          AND LOWER(citizen_barangay) = LOWER(?);`;
      const [checkIfNameExistsResponse] = await dbModel.query(
        checkIfNameExistsQuery,
        [fullName, newBirthdate, barangay]
      );
      if (Boolean(checkIfNameExistsResponse.record_exists)) {
        return res.status(403).json({
          status: 403,
          message: "Record already exists in the database! ",
        });
      }

      const insertCitizenQuery =
        "INSERT INTO `citizen`(`citizen_family_id`, `citizen_firstname`, `citizen_middlename`, `citizen_lastname`, `citizen_gender`, `citizen_birthdate`, `citizen_bloodtype`, `citizen_barangay`, `citizen_number`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const citizenPayload = [
        family_id,
        firstName,
        middleName,
        lastName,
        gender,
        birthdate,
        bloodType,
        barangay,
        phone_number,
      ];
      await dbModel.query(insertCitizenQuery, citizenPayload);

      const insertHistoryQuery =
        "INSERT INTO `citizen_history` (`family_id`, `action`, `action_details`, `staff_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)";
      const insertHistoryPayload = [
        family_id,
        "record added",
        "added this to records",
        staff_id,
        dateTime,
      ];
      await dbModel.query(insertHistoryQuery, insertHistoryPayload);
      return res
        .status(200)
        .json({ status: 200, message: "Record added successfully" });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error,
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

  async proceedAddRecord(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const {
        family_id,
        firstName,
        middleName,
        lastName,
        gender,
        birthdate,
        bloodType,
        barangay,
        phone_number,
        dateTime,
        staff_id,
      } = req.body;
      
      const familyIdExistsQuery = `
        SELECT COUNT(citizen_lastname) AS count
        FROM citizen
        WHERE citizen_family_id LIKE CONCAT(?, '%')`;
      const [familyIdExistsResponse] = await dbModel.query(
        familyIdExistsQuery,
        [family_id]
      );
      const count = familyIdExistsResponse.count;
      
      const fullName = `${firstName} ${
        middleName ? middleName + " " : ""
      }${lastName}`;
      const date = new Date(birthdate);
      const newBirthdate = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      const checkIfNameExistsQuery = `
        SELECT 
          CASE 
            WHEN COUNT(*) > 0 THEN TRUE 
            ELSE FALSE 
          END AS record_exists
        FROM 
          citizen
        WHERE 
          LOWER(CONCAT(citizen_firstname, ' ', COALESCE(citizen_middlename, ''), ' ', citizen_lastname)) LIKE LOWER(?)
          AND citizen_birthdate = ?
          AND LOWER(citizen_barangay) = LOWER(?);`;
      const [checkIfNameExistsResponse] = await dbModel.query(
        checkIfNameExistsQuery,
        [fullName, newBirthdate, barangay]
      );
      if (Boolean(checkIfNameExistsResponse.record_exists)) {
        return res.status(226).json({
          status: 226,
          message: "Record already exists in the database! ",
        });
      }

      const insertCitizenQuery =
        "INSERT INTO `citizen`(`citizen_family_id`, `citizen_firstname`, `citizen_middlename`, `citizen_lastname`, `citizen_gender`, `citizen_birthdate`, `citizen_bloodtype`, `citizen_barangay`, `citizen_number`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const citizenPayload = [
        `${family_id}~${count}`,
        firstName,
        middleName,
        lastName,
        gender,
        birthdate,
        bloodType,
        barangay,
        phone_number,
      ];
      await dbModel.query(insertCitizenQuery, citizenPayload);

      const insertHistoryQuery =
        "INSERT INTO `citizen_history` (`family_id`, `action`, `action_details`, `staff_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)";
      const insertHistoryPayload = [
        `${family_id}~${count}`,
        "record added",
        "added this to records",
        staff_id,
        dateTime,
      ];
      await dbModel.query(insertHistoryQuery, insertHistoryPayload);
      return res
        .status(200)
        .json({ status: 200, message: "Record added successfully" });
            
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
  
  async getRecords(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const response = await dbModel.query(
        "SELECT `citizen_firstname`, `citizen_middlename`, `citizen_lastname`, `citizen_gender`, `citizen_birthdate`, `citizen_bloodtype`, `citizen_barangay`, `citizen_family_id`, `citizen_number` FROM `citizen`"
      );
      const newResponse = response.map((res) => {
        const date = new Date(res.citizen_birthdate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${month}-${day}-${year}`;

        return {
          citizen_family_id: res.citizen_family_id,
          ...res,
          citizen_birthdate: formattedDate,
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
        error: error.message,
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

  async findCitizen(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const { name, famId } = req.body;
      let citizen = null;
      if (name) {
        const findCitizenIdQuery = `
          SELECT citizen_family_id, CONCAT(citizen_firstname, " ", citizen_lastname) AS full_name, citizen_barangay, citizen_gender, citizen_number, citizen_birthdate, citizen_bloodtype
          FROM citizen
          WHERE 
          CONCAT(citizen_firstname, " ", citizen_lastname) LIKE CONCAT('%', ?, '%')
          LIMIT 5`;
        citizen = await dbModel.query(findCitizenIdQuery, [name]);
        if (citizen.length === 0)
          return res
            .status(404)
            .json({ status: 404, message: "Citizen Not Found!" });
      }
      if (famId) {
        const findCitizenIdQuery = `
          SELECT citizen_family_id, CONCAT(citizen_firstname, " ", citizen_lastname) AS full_name, citizen_barangay, citizen_gender, citizen_number, citizen_birthdate, citizen_bloodtype
          FROM citizen 
          WHERE 
          citizen_family_id LIKE CONCAT('%', ?, '%')
          LIMIT 5`;
        citizen = await dbModel.query(findCitizenIdQuery, [famId]);
        if (citizen.length === 0)
          return res
            .status(404)
            .json({ status: 404, message: "Citizen Not Found!" });
      }
      const formattedCitizenBirthDate = citizen.map(prev => {
        const date = prev.citizen_birthdate;
        const newDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        return {
          ...prev,
          citizen_gender: String(prev.citizen_gender).toLowerCase(),
          citizen_birthdate: newDate
        }
      });
      return res
        .status(200)
        .json({ status: 200, citizen: formattedCitizenBirthDate });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error.message,
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

  async handleFileUploadRecords(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const payload = req.body.data;
      for (const item of payload) {
        if (!item.citizen_family_id) {
          continue;
        }
        const dateBirthdate = new Date(item.citizen_birthdate ?? "2001-01-01");

        const newBirthDate = `${dateBirthdate.getFullYear()}-${
          dateBirthdate.getMonth() + 1
        }-${dateBirthdate.getDate()}`;

        const fullName = `${item.citizen_firstname} ${
          item.citizen_middlename ? item.citizen_middlename + " " : ""
        }${item.citizen_lastname}`;
        const checkIfNameExistsQuery = `
          SELECT 
            CASE 
              WHEN COUNT(*) > 0 THEN TRUE 
              ELSE FALSE 
            END AS record_exists
          FROM 
            citizen
          WHERE 
            CONCAT(citizen_firstname, ' ', COALESCE(citizen_middlename, ''), ' ', citizen_lastname) LIKE ?
            AND citizen_birthdate = ?
            AND citizen_barangay = ?;`;
        const [checkIfNameExistsResponse] = await dbModel.query(
          checkIfNameExistsQuery,
          [fullName, newBirthDate, item.citizen_barangay]
        );
        if (Boolean(checkIfNameExistsResponse.record_exists)) continue;

        const [countFamilyId] = await dbModel.query(
          `
          SELECT COUNT(citizen_family_id) AS count
          FROM citizen
          WHERE citizen_family_id LIKE ?;`,
          [`${item.citizen_family_id}%`]
        );

        const newCitizenFamId =
          countFamilyId.count > 0
            ? `${item.citizen_family_id}~${countFamilyId.count}`
            : item.citizen_family_id;
        const data = {
          citizen_family_id: newCitizenFamId,
          citizen_firstname: item.citizen_firstname,
          citizen_middlename: item.citizen_middlename,
          citizen_lastname: item.citizen_lastname,
          citizen_gender: item.citizen_gender,
          citizen_birthdate: newBirthDate,
          citizen_barangay: item.citizen_barangay,
          citizen_number: item.citizen_number,
        };
        await dbModel.query(
          "INSERT INTO `citizen` (`citizen_family_id`, `citizen_firstname`, `citizen_middlename`, `citizen_lastname`, `citizen_gender`, `citizen_birthdate`, `citizen_barangay`, `citizen_number`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            data.citizen_family_id,
            data.citizen_firstname,
            data.citizen_middlename,
            data.citizen_lastname,
            data.citizen_gender,
            data.citizen_birthdate,
            data.citizen_barangay,
            data.citizen_number,
          ]
        );
        const insertHistoryQuery =
          "INSERT INTO `citizen_history` (`family_id`, `action`, `action_details`, `staff_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)";
        const insertHistoryPayload = [
          newCitizenFamId,
          "record added",
          "added this to records",
          req.body.staff_id,
          req.body.dateTime,
        ];
        await dbModel.query(insertHistoryQuery, insertHistoryPayload);
      }

      const createStaffHistoryQuery =
        "INSERT INTO `medicalstaff_history` (`staff_id`, `action`, `action_details`, `citizen_family_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)";
      const staffHistoryValues = [
        req.body.staff_id,
        "upload citizen records",
        "uploaded a file to the records of citizens",
        null,
        req.body.dateTime,
      ];
      await dbModel.query(createStaffHistoryQuery, staffHistoryValues);

      return res.status(200).json({
        status: 200,
        message: "Data inserted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error,
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

  async findRecord(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();

      const getCitizenHistoryQuery =
        "SELECT c.citizen_family_id, c.citizen_firstname, c.citizen_middlename, c.citizen_lastname, c.citizen_gender, c.citizen_barangay, c.citizen_number, c.citizen_birthdate, c.citizen_bloodtype, ch.history_id, ch.action, ch.action_details, ch.action_datetime, ms.username FROM citizen c INNER JOIN citizen_history ch ON c.citizen_family_id = ch.family_id INNER JOIN medicalstaff ms ON ch.staff_id = ms.staff_id WHERE c.citizen_family_id = ?";
      const family_id = req.params.id;
      const getCitizenHistoryResponse = await dbModel.query(
        getCitizenHistoryQuery,
        [family_id]
      );
      if (!getCitizenHistoryResponse)
        return res
          .status(404)
          .json({ status: 404, message: "Citizen was not found!" });

      return res.status(200).json({
        status: 200,
        message: "Data retrieved successfully",
        data: getCitizenHistoryResponse,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error.message,
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

  async updateRecord(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const {
        firstname,
        middlename,
        lastname,
        gender,
        birthdate,
        bloodtype,
        barangay,
        family_id,
        dateTime,
        staff_id
      } = req.body;
      const updateCitizenQuery = `
        UPDATE citizen 
        SET citizen_firstname = ?, 
          citizen_middlename = ?, 
          citizen_lastname = ?, 
          citizen_gender = ?, 
          citizen_birthdate = ?, 
          citizen_bloodtype = ?,
          citizen_barangay = ?
        WHERE citizen_family_id = ?
      `;
      const citizenPayload = [
        firstname,
        middlename,
        lastname,
        gender,
        birthdate,
        bloodtype,
        barangay,
        family_id
      ];
      await dbModel.query(updateCitizenQuery, citizenPayload);
      const insertHistoryQuery = `
        INSERT INTO citizen_history (family_id, action, action_details, staff_id, action_datetime)
        VALUES (?, ?, ?, ?, ?)
      `;
      const historyPayload = [
        family_id,
        'record updated',
        'updated record details',
        staff_id,
        dateTime
      ];
      await dbModel.query(insertHistoryQuery, historyPayload);

      const insertStaffHistoryQuery = 'INSERT INTO `medicalstaff_history` (`staff_id`, `action`, `action_details`, `citizen_family_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)';
      const staffHistoryPayload = [
        staff_id,
        'updated record',
        'updated record details',
        family_id,
        dateTime
      ]
      await dbModel.query(insertStaffHistoryQuery, staffHistoryPayload);
      
      return res.status(200).json({ status: 200, message: 'Record updated successfully' });
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
  };

  async deleteRecord(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const { staff_id, dateTime } = req.body;
      const { id: family_id } = req.params;
      const checkRecordQuery = 'SELECT * FROM citizen WHERE citizen_family_id = ?';
      const [record] = await dbModel.query(checkRecordQuery, [family_id]);
      if (!record) {
        return res.status(404).json({ status: 404, message: 'Record not found!' });
      }
      const deleteCitizenQuery = 'DELETE FROM citizen WHERE citizen_family_id = ?';
      await dbModel.query(deleteCitizenQuery, [family_id]);
      // const insertHistoryQuery = `
      //     INSERT INTO citizen_history (family_id, action, action_details, staff_id, action_datetime)
      //     VALUES (?, ?, ?, ?, ?)
      // `;
      // const historyPayload = [
      //     family_id,
      //     'record deleted',
      //     'deleted this record from the database',
      //     staff_id,
      //     dateTime
      // ];
      // await dbModel.query(insertHistoryQuery, historyPayload);

      const insertStaffHistoryQuery = 'INSERT INTO `medicalstaff_history` (`staff_id`, `action`, `action_details`, `citizen_family_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)';
      const staffHistoryPayload = [
        staff_id,
        'deleted record',
        `deleted record ID: ${family_id}`,
        null,
        dateTime
      ];
      await dbModel.query(insertStaffHistoryQuery, staffHistoryPayload);

      return res.status(200).json({ status: 200, message: 'Record deleted successfully' });
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

  async findFirstName(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const query =
        "SELECT `citizen_family_id`, CONCAT(`citizen_firstname`, ' ', `citizen_lastname`) AS citizen_full_name, `citizen_gender`, `citizen_barangay`, `citizen_number` FROM `citizen` WHERE CONCAT(`citizen_firstname`, ' ', `citizen_lastname`) LIKE CONCAT('%', ?, '%')";
      const nameInput = req.params.id;
      const response = await dbModel.query(query, nameInput);
      if (response.length !== 0) {
        return res.status(200).json({
          status: 200,
          message: "Data retrieved successfully",
          data: response,
        });
      } else {
        return res.status(204).json({
          status: 204,
          message: "Nothing data found",
          data: response,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error.message,
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }
}

module.exports = new RecordController();
