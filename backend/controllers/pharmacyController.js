const dbModel = require('../models/database_model');

class PharmacyController {
  
  async describePharmacy(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();

      const getDescribeQuery = "DESCRIBE `pharmacy_inventory`";
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

  async handleFileUploadPharmacy(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const payload = req.body.data;
      for (const item of payload) {
        if (!item.item_name) {
          continue;
        }

        const insertPharmacyQuery = 'INSERT INTO `pharmacy_inventory` (`item_name`, `quantity`, `container_type`, `lot_no`, `exp_date`, `quantity_stockroom`) VALUES (?, ?, ?, ?, ?, ?)';
        const insertPharmacyPayload = [item.item_name, item.quantity, item.container_type, item.lot_no, item.exp_date, item.quantity_stockroom];
        await dbModel.query(insertPharmacyQuery, insertPharmacyPayload);
        
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
  
  async getPharmacyInventory(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const query = 'SELECT `item_id`, `item_name`, `quantity`, `container_type`, `lot_no`, `exp_date`, `quantity_stockroom` FROM `pharmacy_inventory`';
      const response = await dbModel.query(query);
      const formattedResponse = response.map((row) => {
          if (!row.exp_date || isNaN(new Date(row.exp_date).getTime())) {
            return {
              ...row,
              exp_date: null,
            };
          }
        const expDate = row.exp_date ? new Date(row.exp_date) : null;
        const formattedExpDate = expDate ? expDate.toLocaleDateString() : null;
        return {
          ...row,
          exp_date: formattedExpDate,
        };
      });
      return res.status(200).json({
        status: 200,
        message: "Data retrieved successfully",
        data: formattedResponse,
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

  async searchPharmacyInventory(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const query = 'SELECT `item_name`, `quantity`, `container_type`, `lot_no`, `exp_date`, `quantity_stockroom`, `item_logs` FROM `pharmacy_inventory` WHERE `item_id` = ?';
      const response = await dbModel.query(query, req.params.id);
      const formattedResponse = response.map((row) => {
        const expDate = row.exp_date ? new Date(row.exp_date) : null;
        const formattedExpDate = expDate ? 
            `${expDate.getFullYear()}-${(expDate.getMonth() + 1).toString().padStart(2, '0')}-${expDate.getDate().toString().padStart(2, '0')}`
            : null;
        return {
            ...row,
            exp_date: formattedExpDate,
        };
      });
      return res.status(200).json({
        status: 200,
        message: "Data retrieved successfully",
        data: formattedResponse,
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

  async findMedicine(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      
      const searchTerms = (req.body.medicine).split(' ');
      const getMedicineQuery = `
        SELECT item_id, item_name, container_type 
        FROM pharmacy_inventory 
        WHERE
        ${searchTerms.map(() => "`item_name` LIKE CONCAT('%', ?, '%')").join(' OR ')} 
        AND quantity > 0 `;
      const getMedicineResponse = await dbModel.query(getMedicineQuery, searchTerms);

      if (!getMedicineResponse) return res.status(404).json({ status: 404, message: "Medicine not found!" });
      return res.status(200).json({ status: 200, message: "Medicine found successfully!", medicine: getMedicineResponse });
      
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

  async addMedicine(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const { staff_id, itemName, quantity, container, lotNo, expiry, stockroom, dateTime } = req.body;

      const addMedicineQuery = "INSERT INTO `pharmacy_inventory` (`item_name`, `quantity`, `container_type`, `lot_no`, `exp_date`, `quantity_stockroom`) VALUES (?, ?, ?, ?, ?, ?)";
      const addmedicinePayload = [itemName, quantity, container, lotNo, expiry, stockroom];
      await dbModel.query(addMedicineQuery, addmedicinePayload);

      const createStaffHistoryQuery = "INSERT INTO `medicalstaff_history` (`staff_id`, `action`, `action_details`, `citizen_family_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)";
      const staffHistoryValues = [staff_id, 'added a medicine', 'added a new medicine data to the inventory', null, dateTime];
      await dbModel.query(createStaffHistoryQuery, staffHistoryValues);
      
      return res.status(200).json({ status: 200, message: "Medicine added successfully!" });
      
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error
      })
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection)
      }
    }
  }

}
module.exports = new PharmacyController();