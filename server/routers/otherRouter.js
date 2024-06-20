import express from "express";
import { db } from "../db.js";
import dayjs from "dayjs";

const otherRouter = express.Router();

otherRouter.post("/post/likeList", (req, res) => {
  const userNo = req.body.userNo;

  const query = `
      SELECT 
      p.postId, 
      p.content, 
      p.userNo, 
      u.userNickname, 
      u.profilePicture,
      GROUP_CONCAT(i.imageUrl) AS imageUrls,
      GROUP_CONCAT(h.tag) AS hashtags,
      p.created_at
    FROM postlike AS pl
    JOIN posts AS p ON pl.postId = p.postId
    JOIN users AS u ON p.userNo = u.userNo
    LEFT JOIN images AS i ON p.postId = i.postId
    LEFT JOIN post_hashtags AS ph ON p.postId = ph.postId
    LEFT JOIN hashtags AS h ON ph.hashtagId = h.hashtagId
    WHERE pl.userNo = ? AND pl.isLiked = 1
    GROUP BY p.postId
    ORDER BY p.created_at ASC;
  `;

  db.query(query, [userNo], (err, result) => {
    if (err) {
      console.error("에러", err);
      res.status(500).send("실패");
    } else {
      res.send(result);
    }
  });
});

otherRouter.post("/post/likeToggle", (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
      console.error("에러", err);
      res.status(500).send("실패");
      return;
    }

    connection.beginTransaction((err) => {
      if (err) {
        console.error("에러", err);
        res.status(500).send("실패");
        connection.release();
        return;
      }

      const { post, userNo } = req.body;
      const date = dayjs();

      const insertLikeQuery = `
        INSERT INTO postlike (userNo, postId, postPhoto, isLiked, date) 
        VALUES (?, ?, ?, 1, ?)
        ON DUPLICATE KEY UPDATE isLiked = NOT isLiked`;

      connection.query(
        insertLikeQuery,
        [
          userNo,
          post.postId,
          post.postPhoto,
          date.format("YYYY-MM-DD HH:mm:ss"),
        ],
        (err, result) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              res.status(500).send(err);
            });
          }

          if (result.affectedRows !== 0) {
            const selectLikeQuery = "SELECT * FROM postlike WHERE userNo=?";
            connection.query(selectLikeQuery, [userNo], (err, result) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  res.status(500).send(err);
                });
              }

              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    res.status(500).send(err);
                  });
                }

                console.log("결과", result);
                connection.release();
                res.send(result);
              });
            });
          } else {
            connection.rollback(() => {
              connection.release();
              res.status(500).send("좋아요 업데이트 실패");
            });
          }
        }
      );
    });
  });
});

otherRouter.post("/post/likedUsers", (req, res) => {
  const { postId } = req.body;

  const query = `
    SELECT u.userNo, u.userNickname, u.profilePicture
    FROM postlike AS pl
    JOIN users AS u ON pl.userNo = u.userNo
    WHERE pl.postId = ? AND pl.isLiked = 1
  `;

  db.query(query, [postId], (err, result) => {
    if (err) {
      console.error("에러", err);
      res.status(500).send("실패");
    } else {
      res.send(result);
    }
  });
});

otherRouter.post("/post/comment", (req, res) => {
  console.log("댓글 저장 요청이 도착했습니다.");
  db.getConnection((err, connection) => {
    if (err) {
      console.error("에러", err);
      res.status(500).send("실패");
      return;
    }

    connection.beginTransaction((err) => {
      if (err) {
        console.error("에러", err);
        res.status(500).send("실패");
        connection.release();
        return;
      }

      const { postId, comment, userNo } = req.body;
      const date = dayjs().format("YYYY-MM-DD HH:mm:ss"); // 현재 날짜 및 시간을 포맷팅

      console.log("서버에서 댓글", postId, comment, userNo, date);

      const insertCommentQuery = `
        INSERT INTO comments (postId, comment, userNo, date) 
        VALUES (?, ?, ?, ?)
      `;

      connection.query(
        insertCommentQuery,
        [postId, JSON.stringify(comment), userNo, date],
        (err, result) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              res.status(500).send(err);
            });
          }

          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                res.status(500).send(err);
              });
            }

            console.log("댓글이 성공적으로 저장되었습니다.");
            connection.release();
            // res.send("댓글이 성공적으로 저장되었습니다.");
            res.send("댓글이 성공적으로 저장되었습니다."); // 클라이언트에 메시지 전달
          });
        }
      );
    });
  });
});

otherRouter.post("/post/commentList", (req, res) => {
  const userNo = req.body.userNo;

  const query = `SELECT 
                  comments.commentId,
                  comments.userNo,
                  comments.postId,
                  comments.comment,
                  comments.date
                FROM 
                  comments
                WHERE 
                  comments.userNo = ?
                  ORDER BY comments.date DESC;
                `;

                db.query(query, [userNo], (err, results) => {
                  if (err) {
                    console.error('댓글 데이터를 가져오는 중 오류 발생:', err);
                    res.status(500).json({ error: '댓글 데이터를 가져오는 중 오류 발생' });
                    return;
                  }
              
                  res.json(results);
                });
              });

otherRouter.delete("/delete/commentList/:commentId", (req,res) => {
  const { commentId } = req.params;

  db.query("DELETE FROM comments WHERE commentId=?", [commentId], (err,commentResult) => {
    if (err) {
      console.log("댓글 삭제 중 에러:", err);
      res.status(500).send("댓글 삭제 실패")
      return;
    }
    res.send("댓글 삭제 완료");
  })
})     

// 해당post의 해당comment를 불러오는 엔드포인트 (오류남)
// otherRouter.get('/post/comments/:postId', async (req, res) => {
//   const { postId } = req.params;
//   try {
//     const comments = await Comment.find({ postId }).sort({ createdAt: 'desc' });
//     res.json(comments);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


export default otherRouter;