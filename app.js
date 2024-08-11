const express = require('express');
var cors = require('cors');
const { getNotice, getNoticeByID } = require('./userDBC');

const app = express();


app.use(cors());
app.use(express.json())

// 승희: 전체 공지사항 가져오기
app.get('/api/notice', async (req, res) => {
  try {
      const noticeData = await getNotice(); // 비동기 함수 호출
      res.json(noticeData); // JSON 형태로 응답
  } catch (error) {
      console.error('Error fetching notices:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 승희: 특정 공지사항 가져오기
app.get('/api/notice/:id', async (req, res) => {
  const noticeId = parseInt(req.params.id, 10); // URL 파라미터에서 공지사항 ID를 가져옹

  try {
    const noticeData = await getNoticeById(noticeId);
    if (noticeData) {
      res.json(noticeData); 
    } else {
      res.status(404).json({ error: 'Notice not found' });
    }
  } catch (error) {
    console.error('Error fetching notice:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 승희: 전체 결산안 가져오기
app.get('/api/finance', async (req, res) => {
  try {
    const financeData = await getFinance(); // 비동기 함수 호출
    res.json({ response: financeData }); // JSON 형태로 응답
  } catch (error) {
    console.error('Error fetching finance data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 승희: 특정 결산안 가져오기
app.get('/api/finance/:id', async (req, res) => {
  const financeId = parseInt(req.params.id, 10); // URL 파라미터에서 결산안 ID를 가져옴

  try {
    const financeData = await getFinanceById(financeId);
    if (financeData) {
      res.json(financeData);
    } else {
      res.status(404).json({ error: 'Finance data not found' });
    }
  } catch (error) {
    console.error('Error fetching finance data by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});