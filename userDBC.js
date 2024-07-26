const mysql = require('mysql2');

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool
({
  host: 'localhost',
  user: 'root',
  database: 'website',
  password: 'hy77097562',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const getNotice = async () => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('SELECT NoticeID AS id, Title AS title, Content AS content, Upload_DATE AS date FROM Notice;');
  
    // 데이터를 변환하여 요청한 형식으로 변경
    const notices = rows.map(row => ({
      id: row.id,
      title: row.title,
      desc: row.content,
      date: new Date(row.date)
    }));
  
    console.log(notices);
    return notices;
};

module.exports = 
{
    getNotice,
};