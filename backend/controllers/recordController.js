const dbModel = require('../models/database_model');

class RecordController {

  async describeRecords(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();

      const getDescribeQuery = "DESCRIBE `citizen`";
      const getDescribeResponse = await dbModel.query(getDescribeQuery);
      
      if (!getDescribeResponse) return res.status(404).json({ status: 404, message: "Table not found!" });

      return res.status(200).json({ status: 200, data: getDescribeResponse, message: "Table successfully described!" });
      
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
  
  async addRecord(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const { family_id, firstName, middleName, lastName, gender, birthdate, barangay, phone_number, dateTime, staff_id } = req.body;

      const checkFamilyIdQuery = 'SELECT `citizen_family_id` FROM `citizen` WHERE `citizen_family_id` = ?';
      const [checkFamilyIdResponse] = await dbModel.query(checkFamilyIdQuery, [family_id])
      if (checkFamilyIdResponse) return res.status(409).json({ status: 409, message: "Family Id Already Taken!" });
      
      const insertCitizenQuery = 'INSERT INTO `citizen`(`citizen_family_id`, `citizen_firstname`, `citizen_middlename`, `citizen_lastname`, `citizen_gender`, `citizen_birthdate`, `citizen_barangay`, `citizen_number`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      const citizenPayload = [
        family_id, firstName, middleName, lastName, gender, birthdate, barangay, phone_number
      ];
      await dbModel.query(insertCitizenQuery, citizenPayload)

      const insertHistoryQuery = 'INSERT INTO `citizen_history` (`family_id`, `action`, `action_details`, `staff_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)';
      const insertHistoryPayload = [
        family_id, 'record added', 'added this to records', staff_id, dateTime
      ]
      await dbModel.query(insertHistoryQuery, insertHistoryPayload);
      return res.status(200).json({ status: 200, message: 'Record added successfully' });

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

  async getRecords(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const response = await dbModel.query('SELECT `citizen_firstname`, `citizen_middlename`, `citizen_lastname`, `citizen_gender`, `citizen_birthdate`, `citizen_barangay`, `citizen_family_id`, `citizen_number` FROM `citizen`');
      const newResponse = response.map((res) => {
        const date = new Date(res.citizen_birthdate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${month}-${day}-${year}`;
    
        return {
            citizen_family_id: res.citizen_family_id,
            ...res,
            citizen_birthdate: formattedDate
        };
      });
      return res.status(200).json({
        status: 200,
        message: "Data retrieved successfully",
        data: newResponse
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error.message
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
      const findCitizenIdQuery = "SELECT `citizen_gender`, `citizen_barangay`, `citizen_family_id`, CONCAT(`citizen_firstname`, ' ', `citizen_lastname`) AS `full_name`, `citizen_number` FROM `citizen` WHERE `citizen_firstname` LIKE ? OR `citizen_lastname` LIKE ?";
      const [citizen] = await dbModel.query(findCitizenIdQuery, [req.body.name, req.body.name]);
      if (!citizen) return res.status(404).json({ status: 404, message: 'Citizen Not Found!' });

      return res.status(200).json({ status: 200, message: 'Citizen Found!', citizen });
      
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error.message
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection)
      }
    }
  }

  async handleFileUploadRecords(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const payload = req.body.data;
      for (const item of payload) {
        if (!item.item_name) {
          continue;
        }
        const data = {
          item_name: item.item_name,
          quantity: item.quantity,
          container_type: item.container_type,
          lot_no: item.lot_no,
          exp_date: item.exp_date,
          quantity_stockroom: item.quantity_stockroom
        };
        await dbModel.query(
          'INSERT INTO `pharmacy_inventory` (`item_name`, `quantity`, `container_type`, `lot_no`, `exp_date`, `quantity_stockroom`) VALUES (?, ?, ?, ?, ?, ?)',
          [data.item_name, data.quantity, data.container_type, data.lot_no, data.exp_date, data.quantity_stockroom]
        );
      }
      
      const createStaffHistoryQuery = "INSERT INTO `medicalstaff_history` (`staff_id`, `action`, `action_details`, `citizen_family_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)";
      const staffHistoryValues = [req.body.staff_id, 'upload pharmacy', 'uploaded a file to the inventory of pharmacy', null, req.body.dateTime];
      await dbModel.query(createStaffHistoryQuery, staffHistoryValues);

      return res.status(200).json({
        status: 200,
        message: "Data inserted successfully",
      });
    } catch (error) {
      console.error("Error inserting data:", error);
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

      const getCitizenHistoryQuery = "SELECT c.citizen_family_id, CONCAT(c.citizen_firstname, ' ', c.citizen_middlename, ' ', c.citizen_lastname) AS full_name, c.citizen_gender, c.citizen_barangay, c.citizen_number, c.citizen_birthdate, ch.history_id, ch.action, ch.action_details, ch.action_datetime, ms.username FROM citizen c INNER JOIN citizen_history ch ON c.citizen_family_id = ch.family_id INNER JOIN medicalstaff ms ON ch.staff_id = ms.staff_id WHERE c.citizen_family_id = ?";
      const family_id = req.params.id;
      const getCitizenHistoryResponse = await dbModel.query(getCitizenHistoryQuery, [family_id]);
      if (!getCitizenHistoryResponse) return res.status(404).json({ status: 404, message: "Citizen was not found!" });

      return res.status(200).json({
        status: 200,
        message: "Data retrieved successfully",
        data: getCitizenHistoryResponse,
      });
      
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error.message
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
      const query = "SELECT `citizen_family_id`, CONCAT(`citizen_firstname`, ' ', `citizen_lastname`) AS citizen_full_name, `citizen_gender`, `citizen_barangay`, `citizen_number` FROM `citizen` WHERE CONCAT(`citizen_firstname`, ' ', `citizen_lastname`) LIKE CONCAT('%', ?, '%')";
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
        error: error.message
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

}

module.exports = new RecordController();