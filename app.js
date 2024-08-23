const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const { getNotice, getNoticeByID, getFinance, getFinanceById, getCalendar } = require('./userDBC');
const authStudent = require('./auth');
const app = express();


app.use(cors());
app.use(express.json())
app.use(bodyParser.json());


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
//윤수 페이지별로 공지사항 가져오기
app.get('/api/notice/:page', async (req, res) => {
  const page = parseInt(req.params.page, 10);
  const limit = 10; // 페이지당 공지사항 수
  const offset = (page - 1) * limit;

  try {
    const noticeData = await getNotice(limit, offset);
    res.json(noticeData);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//공지사항 생성
app.post('/api/admin/notice', async (req, res) => {
  const { title, content } = req.body;
  try {
    const newNotice = await createNotice(title, content);
    res.status(201).json(newNotice);
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 공지사항 수정
app.put('/api/admin/notice/:id', async (req, res) => {
  const noticeId = parseInt(req.params.id, 10);
  const { title, content } = req.body;
  try {
    const updatedNotice = await updateNotice(noticeId, title, content);
    if (updatedNotice) {
      res.json(updatedNotice);
    } else {
      res.status(404).json({ error: 'Notice not found' });
    }
  } catch (error) {
    console.error('Error updating notice:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 공지사항 삭제
app.delete('/api/admin/notice/:id', async (req, res) => {
  const noticeId = parseInt(req.params.id, 10);
  try {
    const result = await deleteNotice(noticeId);
    if (result) {
      res.json({ message: 'Notice deleted successfully' });
    } else {
      res.status(404).json({ error: 'Notice not found' });
    }
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// 승희: 특정 공지사항 ``가져오기``
//윤수: 이거 detail로 좀 바꿨어요
app.get('/api/notice/detail/:id', async (req, res) => {
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

app.get('/api/calendar', async (req, res) => {
  try {
    const calendarData = await getCalendar();
    res.json(calendarData);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//되는지 모르겠음
app.post('/api/authStudent', (req, res) => {
  const { studentId, name } = req.body;
  
  if (!studentId || !name) {
      return res.status(400).json({ error: '학번과 이름을 모두 제공해야 합니다.' });
  }

  authStudent(studentId, name);
  
});

// 결산안 추가 API
app.post('/api/admin/finance/post', async (req, res) => {
  try {
    const { year, month, qurter, imageurl } = req.body;
    const query = 'INSERT INTO finance (year, month, qurter, imageurl) VALUES (?, ?, ?, ?)';
    const [result] = await pool.execute(query, [year, month, qurter, JSON.stringify(imageurl)]);
    res.json({ id: result.insertId, message: '결산안이 성공적으로 추가되었습니다.' });
  } catch (error) {
    console.error('결산안 추가 에러:', error);
    res.status(500).json({ error: '결산안 추가 중 오류가 발생했습니다.' });
  }
});

// 결산안 수정 API
app.patch('/api/admin/finance/patch/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month, qurter, imageurl } = req.body;
    const query = 'UPDATE finance SET year = ?, month = ?, qurter = ?, imageurl = ? WHERE id = ?';
    const [result] = await pool.execute(query, [year, month, qurter, JSON.stringify(imageurl), id]);
    if (result.affectedRows > 0) {
      res.json({ message: '결산안이 성공적으로 수정되었습니다.' });
    } else {
      res.status(404).json({ error: '해당 ID의 결산안을 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('결산안 수정 에러:', error);
    res.status(500).json({ error: '결산안 수정 중 오류가 발생했습니다.' });
  }
});

// 결산안 삭제 API
app.delete('/api/admin/finance/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM finance WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    if (result.affectedRows > 0) {
      res.json({ message: '결산안이 성공적으로 삭제되었습니다.' });
    } else {
      res.status(404).json({ error: '해당 ID의 결산안을 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('결산안 삭제 에러:', error);
    res.status(500).json({ error: '결산안 삭제 중 오류가 발생했습니다.' });
  }
});

// 지환: 갤러리 게시물 전체 수정 엔드포인트
app.put('/api/admin/gallery/put/:id', async (req, res) => {
    const postId = parseInt(req.params.id, 10); // URL 파라미터에서 게시물 ID를 가져옴
    const { title, upload_date, content, image_url } = req.body;

    // 데이터 유효성 검사
    if (!title || !upload_date || !content || !Array.isArray(image_url)) {
        return res.status(400).json({ message: '필수 데이터가 부족하거나 잘못된 형식입니다.' });
    }

    try {
        // 트랜잭션 시작
        await pool.query('BEGIN');

        // 게시물 데이터 업데이트
        const updatePostQuery = `
            UPDATE gallery_posts
            SET title = $1, upload_date = $2, content = $3
            WHERE id = $4
        `;
        await pool.query(updatePostQuery, [title, upload_date, content, postId]);

        // 기존 이미지 삭제
        const deleteImagesQuery = 'DELETE FROM gallery_images WHERE post_id = $1';
        await pool.query(deleteImagesQuery, [postId]);

        // 새 이미지 추가
        const insertImageQuery = 'INSERT INTO gallery_images (post_id, image_url) VALUES ($1, $2)';
        for (const url of image_url) {
            await pool.query(insertImageQuery, [postId, url]);
        }

        // 트랜잭션 커밋
        await pool.query('COMMIT');

        res.status(200).json({
            message: '갤러리 게시물이 성공적으로 수정되었습니다.',
            postId
        });
    } catch (error) {
        // 트랜잭션 롤백
        await pool.query('ROLLBACK');
        console.error('Error updating post:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

//지환: 갤러리 게시물 삭제 엔드포인트
app.delete('/api/admin/gallery/delete/:id', async (req, res) => {
    const postId = parseInt(req.params.id, 10); // URL 파라미터에서 게시물 ID를 가져옴

    try {
        // 트랜잭션 시작
        await pool.query('BEGIN');

        // 이미지 삭제
        const deleteImagesQuery = 'DELETE FROM gallery_images WHERE post_id = $1';
        await pool.query(deleteImagesQuery, [postId]);

        // 게시물 삭제
        const deletePostQuery = 'DELETE FROM gallery_posts WHERE id = $1';
        const result = await pool.query(deletePostQuery, [postId]);

        if (result.rowCount === 0) {
            // 게시물이 존재하지 않는 경우
            await pool.query('ROLLBACK');
            return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });
        }

        // 트랜잭션 커밋
        await pool.query('COMMIT');

        res.status(200).json({
            message: '갤러리 게시물이 성공적으로 삭제되었습니다.',
            postId
        });
    } catch (error) {
        // 트랜잭션 롤백
        await pool.query('ROLLBACK');
        console.error('Error deleting post:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
