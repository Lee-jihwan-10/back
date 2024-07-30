const mysql = require('mysql2')
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database:"website",
    password:'0000',
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
})

 const getNotice = async () => {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query('SELECT ID AS id, Title AS title, description AS description, date AS date FROM notice;');
  
    const notices = rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      date: new Date(row.date)
    }));
  
    console.log(notices);
    return notices;
};

async function getEvents() {
  const promisePool = pool.promise();
  
  // 이벤트 데이터를 조회합니다
  const [rows] = await promisePool.query(
      'SELECT id AS id, title AS title, startDate AS startDate, endDate AS endDate, color AS color, description AS description FROM events;'
  );

  // 데이터 매핑
  const events = rows.map(row => ({
      id: row.id,
      title: row.title,
      startDate: new Date(row.startDate),
      endDate: new Date(row.endDate),
      color: row.color,
      description: row.description
  }));

  console.log(events);
  return events;
}
module.exports= {getNotice, getEvents};