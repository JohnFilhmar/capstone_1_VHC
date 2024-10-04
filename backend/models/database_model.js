const mysql = require('mysql');
require('dotenv').config();

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.PROJECT_STATE === 'production' ? process.env.MYSQL_HOST : 'localhost',
      user: process.env.PROJECT_STATE === 'production' ? process.env.MYSQL_USER : 'root',
      password: process.env.PROJECT_STATE === 'production' ? process.env.MYSQL_PASS : '',
      database: process.env.PROJECT_STATE === 'production' ? process.env.MYSQL_DATABASE : 'u807685206_kalusugapp',
      port: 3306,
      ssl: {
        rejectUnauthorized: process.env.PROJECT_STATE === 'production' ? true : false
      }
    });
  }

  getConnection() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          err.message = 'Failed to connect to the database.';
          reject(err);
        } else {
          resolve(connection);
        }
      });
    });
  }

  releaseConnection(connection) {
    connection.release();
  }

  initializePool() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          err.message = 'Failed to initialize the database pool.';
          reject(err);
        } else {
          console.log('Connected to the database pool!');
          resolve();
        }
      });
    });
  }  

  query(sql, values) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

}

const dbModel = new Database();

module.exports = dbModel;
