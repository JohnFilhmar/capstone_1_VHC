const dbModel = require('../models/database_model');
const { convertDate } = require('../globalFunctions');

class AppointmentController {

  async newAppointment(req, res) {
    let connection;
    try {

      connection = await dbModel.getConnection();
      const { appointedTime, description, dateTime, staff_id, citizen_family_id, phone_number } = req.body;

      const insertAppointmentQuery = "INSERT INTO `citizen_appointments` (`citizen_family_id`, `description`, `phone_number`, `appointed_datetime`, `status`, `created_at`) VALUES (?, ?, ?, ?, ?, ?)";
      const insertAppointmentResponse = await dbModel.query (insertAppointmentQuery, [citizen_family_id, description, phone_number, appointedTime, 'pending', dateTime]);

      if (insertAppointmentResponse.affectedRows > 0) {
        const insertHistoryQuery = "INSERT INTO `citizen_history` (`family_id`, `action`, `action_details`, `staff_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)";
        const insertHistoryResponse = await dbModel.query(insertHistoryQuery, [citizen_family_id, 'appointment', 'requested for an appointment', staff_id, dateTime]);
        if (insertHistoryResponse.affectedRows > 0) {
          return res.status(200).json({ status: 200, message: "Appointment Successfully Created!" });
        }
      }

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

  async getAppointments(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const response = await dbModel.query(`
        SELECT 
          ca.appointment_id, 
          CONCAT(c.citizen_firstname, ' ', c.citizen_lastname) AS full_name, 
          ca.phone_number, 
          ca.status, 
          ca.created_at, 
          ca.appointed_datetime 
        FROM citizen_appointments ca 
        INNER JOIN citizen c 
        ON c.citizen_family_id = ca.citizen_family_id`);      
      const newResponse = response.map((res) => {
        return {
          ...res,
          appointed_datetime: convertDate(res.appointed_datetime),
          created_at: convertDate(res.created_at)
        }
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
        error: error
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }
  
  async editAppointment(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const query = "";
      const newResponse = response.map((res) => {
        return {
          ...res,
          appointed_datetime: convertDate(res.appointed_datetime),
          created_at: convertDate(res.created_at)
        }
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
        error: error
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

  async handleCancelAppointment(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const appointmentId = req.params.id;
      const { staff_id, dateTime } = req.body;

      const getStatusQuery = "SELECT `status`, `citizen_family_id` FROM `citizen_appointments` WHERE `appointment_id` = ?";
      const [getStatusResponse] = await dbModel.query(getStatusQuery, req.params.id);
      if (getStatusResponse.status !== 'pending') return res.status(200).json({ status: 200, message: 'Appointment Already Cancelled!'});

      const updateStatusQuery = "UPDATE `citizen_appointments` SET `status` = ? WHERE `appointment_id` = ?";
      const updateStatusResponse = await dbModel.query(updateStatusQuery, ['rejected', appointmentId]);
      
      if (updateStatusResponse.affectedRows > 0) {
        const insertHistoryQuery = "INSERT INTO `citizen_history` (`family_id`, `action`, `action_details`, `staff_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)";
        const insertHistoryResponse = await dbModel.query(insertHistoryQuery, [getStatusResponse.citizen_family_id, 'appointment rejected', 'appointment was rejected', staff_id, dateTime]);
        if (insertHistoryResponse.affectedRows > 0) {
          return res.status(200).json({ status: 200, message: "Appointment Successfully Cancelled!" });
        }
      }      
      
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

  async handleApproveAppointment(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const appointmentId = req.params.id;
      const { staff_id, dateTime } = req.body;

      const getStatusQuery = "SELECT `status`, `citizen_family_id` FROM `citizen_appointments` WHERE `appointment_id` = ?";
      const [getStatusResponse] = await dbModel.query(getStatusQuery, req.params.id);
      if (getStatusResponse.status !== 'pending') return res.status(200).json({ status: 200, message: 'Appointment Already Approved!'});

      const updateStatusQuery = "UPDATE `citizen_appointments` SET `status` = ? WHERE `appointment_id` = ?";
      const updateStatusResponse = await dbModel.query(updateStatusQuery, ['scheduled', appointmentId]);
      
      if (updateStatusResponse.affectedRows > 0) {
        const insertHistoryQuery = "INSERT INTO `citizen_history` (`family_id`, `action`, `action_details`, `staff_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)";
        const insertHistoryResponse = await dbModel.query(insertHistoryQuery, [getStatusResponse.citizen_family_id, 'appointment approved', 'appointment was approved', staff_id, dateTime]);
        if (insertHistoryResponse.affectedRows > 0) {
          return res.status(200).json({ status: 200, message: "Appointment Successfully Approved!" });
        }
      }      
      
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
  
  async findAppointmentByNumber(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const PK = req.params.id;
      const query = "SELECT ca.appointment_id, c.citizen_family_id, CONCAT(c.citizen_firstname, ' ', c.citizen_lastname) AS fullname, ca.description, c.citizen_number AS phoneNumber, ca.appointed_datetime, ca.status, ca.created_at FROM citizen_appointments ca INNER JOIN citizen c ON c.citizen_family_id = ca.citizen_family_id WHERE ca.appointment_id = ?";
      const response = await dbModel.query(query, PK);
      const newResponse = response.map((res) => {
        return {
          ...res,
          appointed_datetime: convertDate(res.appointed_datetime),
        }
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
        error: error
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }
  
}

module.exports = new AppointmentController();