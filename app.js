const express = require('express');
var cors = require('cors');
const { getNotice } = require('./userDBC');
const app = express();


app.use(cors());
app.use(express.json())

const noticeData = getNotice();

app.get('/api/notice', async (req, res) => {
  try {
      const noticeData = await getNotice(); // 비동기 함수 호출
      res.json(noticeData); // JSON 형태로 응답
  } catch (error) {
      console.error('Error fetching notices:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3001);