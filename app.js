const express = require('express');
var cors = require('cors')
const app = express();
const { getNotice,getEvents } = require('./dbconnect');

app.use(cors());
app.use(express.json())



app.get('/api/notice', async (req, res) => {
  try {
    const noticeData = await getNotice();
    res.send(noticeData);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
})

app.get('/api/events', async (req, res) => {
  try {
    const Data = await getEvents();
    res.send(Data);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
})

app.listen(3001);

