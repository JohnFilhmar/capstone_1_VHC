const dbModel = require('../models/database_model');

function convertDate(datebaseDate) {
  const date = new Date(datebaseDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = date.getHours() % 12 || 12;
  const meridian = date.getHours() >= 12 ? 'PM' : 'AM';
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const formattedDateString = `${month}-${day}-${year} @ ${hours}:${minutes} ${meridian}`;
  return formattedDateString;
}

function convertDate(datetime) {
  const appointedDateTime = new Date(datetime);
  const year = appointedDateTime.getFullYear();
  const month = (appointedDateTime.getMonth() + 1).toString().padStart(2, '0');
  const day = appointedDateTime.getDate().toString().padStart(2, '0');
  const hours = appointedDateTime.getHours().toString().padStart(2, '0');
  const minutes = appointedDateTime.getMinutes().toString().padStart(2, '0');
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
  return formattedDateTime;
}

class AppointmentController {

  async newAppointment(req, res) {
    let connection;
    try {

      connection = await dbModel.getConnection();
      const { appointedTime, description, dateTime, staff_id, citizen_family_id } = req.body;

      const insertAppointmentQuery = "INSERT INTO `citizen_appointments` (`citizen_family_id`, `description`, `appointed_datetime`, `status`, `created_at`) VALUES (?, ?, ?, ?, ?)";
      const insertAppointmentResponse = await dbModel.query(insertAppointmentQuery, [citizen_family_id, description, appointedTime, 'pending', dateTime]);

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
      const response = await dbModel.query("SELECT a.appointment_id, CASE WHEN a.citizen_id IS NULL OR a.fullname IS NOT NULL THEN a.fullname ELSE CONCAT(mc.citizen_firstname, ' ', mc.citizen_lastname) END AS citizen_fullname, CASE WHEN a.citizen_id IS NULL THEN a.phone_number ELSE mc.citizen_number END AS phone_number, a.appointed_datetime AS appointed_datetime,a.description AS description, a.status AS status, a.created_at AS created_at FROM appointments a LEFT JOIN citizen mc ON a.citizen_id = mc.citizen_family_id");
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
      if (getStatusResponse.status !== 'pending') return res.status(200).json({ status: 200, message: 'Appointment Already Cancelled!'});

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