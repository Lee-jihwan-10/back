const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // 3306
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

async function authStudent(studentId, name) {
  try {
    const query = 'SELECT * FROM Student WHERE student_id = ? AND name = ?';
    const [rows] = await promisePool.query(query, [studentId, name]);

    if (rows.length > 0) {
      await promisePool.query('INSERT INTO User (Stu_ID, Name, Status) VALUES (?, ?, ?)', [studentId, name, 'active']);
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error executing query:', error);
    throw error; 
  }
}

module.exports = {
  authStudent
};