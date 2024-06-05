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

// otherRouter.post("/post/likeList", (req, res) => {
//   const userNo = req.body.userNo;
//   db.query(
//     `SELECT pl.*, p.content, i.imageUrl
//      FROM postlike AS pl
//      JOIN posts AS p ON pl.postId = p.postId
//      LEFT JOIN images AS i ON pl.postId = i.postId
//      WHERE pl.userNo = ?`,
//     [userNo],
//     (err, result) => {
//       if (err) {
//         console.error("에러", err);
//         res.status(500).send("실패");
//       } else {
//         res.send(result);
//       }
//     }
//   );
// });

// otherRouter.post("/post/likeList", (req, res) => {
//   const userNo = req.body.userNo;
//   db.query(`SELECT pl.postId, p.content, i.imageUrl
//   FROM postlike AS pl
//   JOIN posts AS p ON pl.postId = p.postId
//   JOIN postimages AS i ON p.postId = i.postId
//   WHERE pl.userNo = ?
//   `, [userNo], (err, result) => {
//     if (err) {
//       console.error("에러", err);
//       res.status(500).send("실패");
//     } else {
//       res.send(result);
//     }
//   });
// });

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

export default otherRouter;
