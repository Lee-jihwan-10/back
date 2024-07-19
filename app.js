const express = require('express');
var cors = require('cors')
const app = express();

app.use(cors());
app.use(express.json())

const noticeData = [
  {id:0, title:"공지사항 1입니다.",desc:"안녕하세용",date: new Date('2024-07-02')},
  {id:1, title:"공지사항 2입니다.",desc:"안녕하세용",date: new Date('2024-07-02')},
  {id:2, title:"공지사항 3입니다.",desc:"안녕하세용",date: new Date('2024-07-02')},
  {id: 3, title: "공지사항 4입니다.", desc: "안녕하세용", date: new Date('2024-07-02') },
  {id:4, title:"공지사항 5입니다.",desc:"안녕하세용",date: new Date('2024-07-02')},

]

app.get('/api/notice', (req, res) => {
    res.send(JSON.stringify(noticeData));
})

app.listen(3001);

