const { convertDate } = require("../globalFunctions");
const dbModel = require("../models/database_model");
const jwt = require("jsonwebtoken");

class Controller {
  
  async borrowEquipment(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const authHeader = req.headers["authorization"];
      const accessToken = authHeader.split(" ")[1];
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const [user] = await dbModel.query(
        "SELECT staff_id, uuid FROM medicalstaff WHERE username = ?",
        decoded.username
      );
      const staff_id = user.staff_id;
      const { equipmentId, quantity, citizenNumber, address, notes, dateTime } =
        req.body;
      if (!equipmentId || !citizenNumber || !dateTime || !staff_id) return res.status(400).json({ status: 200, message: "Data can't be empty!" })

      const insertHistoryQuery = 'INSERT INTO `citizen_history` (`family_id`, `action`, `action_details`, `staff_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)';
      const historyPayload = [
        citizenNumber,
        `borrowed an equipment`,
        `borrowed an equipment from ${staff_id} at ${String(dateTime)}`,
        staff_id,
        dateTime
      ];
      await dbModel.query(insertHistoryQuery, historyPayload);
      
      const insertStaffHistoryQuery = 'INSERT INTO `medicalstaff_history` (`staff_id`, `action`, `action_details`, `citizen_family_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)';
      const staffHistoryPayload = [
        staff_id,
        'created an equipment borrow form',
        `filled up a borrow form for ${citizenNumber}`,
        citizenNumber,
        dateTime
      ];
      await dbModel.query(insertStaffHistoryQuery, staffHistoryPayload);
        
      const updateEquipmentQuery = `
        UPDATE
          equipments
        SET
          status = ?,
          location = ?
        WHERE
          equipment_id = ?;`;
      await dbModel.query(updateEquipmentQuery, ['in use', address, equipmentId]);
      
      const borrowEquipmentQuery = `
        INSERT INTO
          equipments_history
          (
            equipment_id, 
            quantity, 
            citizen_family_id, 
            staff_id, 
            address, 
            notes, 
            borrowed_at
          )
        VALUES
          (?, ?, ?, ?, ?, ?, ?);`;
      const borrowEquipmentPayload = [
        equipmentId,
        quantity,
        citizenNumber,
        staff_id,
        address,
        notes,
        dateTime,
      ];
      await dbModel.query(borrowEquipmentQuery, borrowEquipmentPayload);
      return res.status(200).json({
        status: 200,
        message: "Equipment borrowing successfully logged!"
      })
      
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

  async getEquipments(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();

      const getEquipmentsQuery = `
        SELECT 
          * 
        FROM
          equipments`;
      const getEquipmentsResponse = await dbModel.query(getEquipmentsQuery);
      const newGetEquipmentsResponse = getEquipmentsResponse.map((prev) => ({
        ...prev,
        purchase_date: convertDate(prev.purchase_date, false),
        maintenance_date: convertDate(prev.maintenance_date, false),
        next_maintenance: convertDate(prev.next_maintenance, false),
      }));
      return res.status(200).json({
        status: 200,
        data: newGetEquipmentsResponse,
        message: "Data retrieved successfully",
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

  async addEquipment(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const {
        equipmentname,
        equipmenttype,
        status,
        equipmentlocation,
        purchasedate,
        maintenancedate,
        nextmaintenance,
        condition,
        serialnumber,
        notes,
        dateTime
      } = req.body;

      const addEquipmentQuery = `
        INSERT INTO equipments
          (equipment_name, equipment_type, status, location, purchase_date, maintenance_date, next_maintenance, equipment_condition, serial_number, notes)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const addEquipmentPayload = [
        equipmentname,
        equipmenttype,
        status,
        equipmentlocation,
        purchasedate,
        maintenancedate,
        nextmaintenance,
        condition,
        serialnumber,
        notes,
      ];
      
      const insertStaffHistoryQuery = 'INSERT INTO `medicalstaff_history` (`staff_id`, `action`, `action_details`, `citizen_family_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)';
      const staffHistoryPayload = [
        staff_id,
        `added ${equipmentname} to the inventory`,
        `added an equipment at ${dateTime}`,
        null,
        dateTime
      ];
      await dbModel.query(insertStaffHistoryQuery, staffHistoryPayload);
      
      const response = await dbModel.query(
        addEquipmentQuery,
        addEquipmentPayload
      );
      return res.status(200).json({
        status: 200,
        message: "Added new equipment",
        id: response.insertId,
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

  async getEquipmentHistory(req, res) {
    const equipment_id = req.params.id;
    let connection;
    try {
      connection = await dbModel.getConnection();

      const getEquipmentHistoryQuery = `
        SELECT
          CONCAT(cit.citizen_firstname, ' ', cit.citizen_lastname) AS borrower,
          ms.username AS lender,
          cit.citizen_barangay AS borrower_address,
          eq.equipment_name,
          eq.equipment_type,
          eq.equipment_condition,
          eq.notes,
          eq.status,
          eq.location,
          eh.quantity,
          eh.address,
          eh.notes,
          eh.borrowed_at
        FROM
          equipments_history eh
        INNER JOIN
          equipments eq
        ON
          eq.equipment_id = eh.equipment_id
        INNER JOIN
          citizen cit
        ON
          eh.citizen_family_id = cit.citizen_family_id
        INNER JOIN
          medicalstaff ms
        ON
          eh.staff_id = ms.staff_id
        WHERE
          eh.equipment_id = ?;`;
      const getEquipmentHistoryResponse = await dbModel.query(
        getEquipmentHistoryQuery,
        equipment_id
      );
      const response = getEquipmentHistoryResponse.map((prev) => ({
        ...prev,
        borrowed_at: convertDate(prev.borrowed_at)
      }));
      return res.status(200).json({
        status: 200,
        data: response,
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
}

module.exports = new Controller();
