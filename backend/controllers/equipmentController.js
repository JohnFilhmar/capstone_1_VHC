const { convertDate } = require("../globalFunctions");
const dbModel = require("../models/database_model");

class Controller {
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
      const newGetEquipmentsResponse = getEquipmentsResponse.map(prev => ({
        ...prev,
        purchase_date: convertDate(prev.purchase_date, false),
        maintenance_date: convertDate(prev.maintenance_date, false),
        next_maintenance: convertDate(prev.next_maintenance, false)
      }))
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

      const addEquipmentQuery = `
        INSERT INTO equipments
          (equipment_name, equipment_type, status, location, purchase_date, maintenance_date, next_maintenance, equipment_condition, serial_number, notes)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const addEquipmentPayload = Object.values(req.body).map(String);
      await dbModel.query(addEquipmentQuery, addEquipmentPayload);
      return res.status(200).json({
        status: 200,
        message: "Added new equipment"
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
}

module.exports = new Controller();
