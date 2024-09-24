const mysql = require('mysql');
const config = require('../config');

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: config.PROJECT_STATE === 'production' ? config.MYSQL_HOST : 'localhost',
      user: config.PROJECT_STATE === 'production' ? config.MYSQL_USER : 'root',
      password: config.PROJECT_STATE === 'production' ? config.MYSQL_PASS : '',
      database: config.PROJECT_STATE === 'production' ? config.MYSQL_DATABASE : 'capstone'
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
