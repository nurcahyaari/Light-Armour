'use strict'

// const Sequelize = require('sequelize');
// const sequelize = new Sequelize('database', 'username', 'password', {
//   host: 'localhost',
//   dialect: 'mysql'|'sqlite'|'postgres'|'mssql',
//   operatorsAliases: false,

//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   },

//   // SQLite only
//   storage: 'path/to/database.sqlite'
// });

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

  // module.exports = sequelize;
const mysql = require('mysql')
const util = require('util');
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tokoonline'
})

pool.query = util.promisify(pool.query);

pool.getConnection((err, connection) => {
  if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.error('Database connection was closed.')
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
          console.error('Database has too many connections.')
      }
      if (err.code === 'ECONNREFUSED') {
          console.error('Database connection was refused.')
      }
  }
  if (connection){
    console.log("Database Connected");
    connection.release();
  }
  return
})

module.exports = pool;