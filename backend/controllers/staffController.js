const dbModel = require('../models/database_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

class StaffController {
  
  async verifyEmail(req, res) {
    let connection;
    try {
      
    } catch (error) {
      
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

  async getStaffId(req, res) {
    let connection;
    try {
      
      const authHeader = req.headers['authorization'];
      const accessToken = authHeader.split(' ')[1]; 
      jwt.verify( accessToken , config.ACCESS_TOKEN_SECRET, async (err, decoded) => {

        connection = await dbModel.getConnection();
        const getStaffIdQuery = 'SELECT `staff_id` FROM `medicalstaff` WHERE `username` = ?';
        const [staff] = await dbModel.query(getStaffIdQuery, decoded.username);
        if (!staff) return res.status(404).json({ message: 'Staff not found' });
        return res.status(200).json({ staff_id: staff.staff_id });

      })
      
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
  
  async getStaff(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const query = "SELECT `staff_id`, `username`, `email`, `isVerified`, `role` FROM `medicalstaff`";
      const response = await dbModel.query(query);
      return res.status(200).json({
        status: 200,
        message: 'Data retrieved successfully',
        data: response
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
  
  async addStaff(req, res) {
    let connection;
    try {
      const saltRounds = config.PASSWORD_SALT_ROUNDS;
      const access_token = config.ACCESS_TOKEN_SECRET;

      connection = await dbModel.getConnection();
      const payload = req.body;

      const retrieveQuery = "SELECT `username` FROM `medicalstaff` WHERE `username` = ?";
      const emailRetrieveQuery = "SELECT `username` FROM `medicalstaff` WHERE `email`= ?"
      const retrieveResponse = await dbModel.query(retrieveQuery, payload.username);
      const retrieveEmailResponse = await dbModel.query(emailRetrieveQuery, payload.email);

      if (retrieveResponse.length !== 0) {
        return res.status(403).json({
          status: 403,
          message: "Username already exists!"
        });
      }
      if (retrieveEmailResponse.length !== 0) {
        return res.status(403).json({
          status: 403,
          message: "Email already exists!"
        });
      }

      const generateToken = (role, secret, expiresIn) => {
        return jwt.sign({ role }, secret, { expiresIn });
      };

      bcrypt.hash(payload.password, parseInt(saltRounds), async function(err, hash) {
        if (err) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        try {
          const insertQuery = 'INSERT INTO `medicalstaff` (`username`, `password`, `refresh_token`, `email`, `role`) VALUES (?, ?, ?, ?, ?)';
          const insertPayload = [
            payload.username, 
            hash,
            generateToken(payload.role, config.REFRESH_TOKEN_SECRET, "15s"),
            String(payload.email).toLowerCase(),
            payload.role
          ];
          const insertResponse = await dbModel.query(insertQuery, insertPayload);
          
          if (!(insertResponse?.affectedRows > 0)) {
            return res.status(409).json({ status: 409, message: "The request could not be completed!" });
          }

          const insertHistoryQuery = 'INSERT INTO `medicalstaff_history` (`staff_id`, `action`, `action_details`, `citizen_family_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)';
          const historyPayload = [
            insertResponse.insertId,
            'registered',
            'account created',
            null,
            payload.current_datetime
          ]
          const historyResponse = await dbModel.query(insertHistoryQuery, historyPayload);

          const createEmailVerificationQuery = 'INSERT INTO `medicalstaff_email_verification`  VALUES (?, ?, ?)';
          const addHoursToDate = (hours) => {
            const date = new Date();
            date.setHours(date.getHours() + hours);
            return date;
          };
          const formatDateToMySQL = (date) => {
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            const hours = ('0' + date.getHours()).slice(-2);
            const minutes = ('0' + date.getMinutes()).slice(-2);
            const seconds = ('0' + date.getSeconds()).slice(-2);
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          };
          const expDate = addHoursToDate(2);
          const token = jwt.sign({ userId: insertResponse.insertId }, access_token, { expiresIn: '1m' });
          const emailVerificationPayload = [
            token,
            insertResponse.insertId,
            formatDateToMySQL(expDate)
          ];
          const emailVerificationResponse = await dbModel.query(createEmailVerificationQuery, emailVerificationPayload);

          if(historyResponse?.affectedRows > 0 && emailVerificationResponse?.affectedRows > 0) {
            return res.status(200).json({
              status: 200,
              message: 'User added successfully'
            });
          } else {
            throw new Error("Something have gone wrong while logging history.");
          }

        } catch (error) {
          return res.status(500).json({
            status: 500,
            message: 'Oops! Something have gone wrong',
            error_message: error
          });
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
  };

  async logoutUser(req, res) {
    let connection;
    try {
      const {username, dateTime} = req.body;
      if (username && username === config.DEVELOPER_USERNAME) {
        return res.status(200).json({
          status: 200,
          message: "Logout Successfully"
        });
      }
      connection = await dbModel.getConnection();
      const userQuery = 'SELECT `staff_id`, `refresh_token` FROM `medicalstaff` WHERE `username` = ?';
      const [user] = await dbModel.query(userQuery, [username]);
      if (!user) return res.status(404).json({ status: 404, message: "User not found!" });
      
      const insertHistoryQuery = 'INSERT INTO `medicalstaff_history` (`staff_id`, `action`, `action_details`, `citizen_family_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)';
      const historyPayload = [
        user.staff_id,
        'logged out',
        'logged out of account',
        null,
        dateTime
      ];
      const historyResponse = await dbModel.query(insertHistoryQuery, historyPayload);
      
      if (historyResponse) {
        res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: true,
          sameSite: 'Strict'
        });
        return res.status(200).json({ status: 200, message: "Logged out successfully!" });
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

  async verifyAccessToken(req, res) {
    let connection;
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
      }
  
      jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'Strict', secure: true });
            return res.status(401).json({ message: "Your session has expired!" });
          }
          res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'Strict', secure: true });
          return res.status(403).json({ message: "Invalid refresh token!" });
        }

        const user = {
          username: decoded.username,
          role: decoded.role
        };
        const accessToken = jwt.sign(user, config.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
        return res.status(200).json({ status: 200, accessToken: accessToken, message: "Session is still valid" });
      });
    
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(500).json({ message: "Internal server error" });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

}

module.exports = new StaffController();