import express from "express";
import multer from "multer";
import { db } from "../db.js";

const feedRouter = express.Router();

// Multer 설정(이미지파일)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// 피드 작성
feedRouter.post("/insert", upload.array("images", 10), (req, res) => {
  const { userNo, content, hashtags, scheduled_at } = req.body;
  const files = req.files;

  // 이미지 파일이 없는 경우 에러 반환
  if (files.length === 0) {
    return res.json({ message: "이미지를 한 개 이상 업로드해주세요." });
  }

  // schedule_at가 제공되는지 확인
  const scheduledAtValue = scheduled_at ? scheduled_at : null;

  // post테이블에 userNo, content, scheduled_at(예약설정시간) 저장
  db.query(
    `INSERT INTO posts (userNo, content, scheduled_at) VALUES (?, ?, ?)`,
    [userNo, content, scheduledAtValue],
    (err, result) => {
      if (err) {
        console.error("post인서트 에러:", err);
        return res.json({ message: "서버 오류가 발생했습니다.?" });
      }

      const postId = result.insertId;

      // images 테이블에 이미지 저장
      const imageInsert = files.map((file) => {
        const imageUrl = `/uploads/${file.filename}`;
        return (imageres, imagedata) => {
          db.query(
            `INSERT INTO images (postId, imageUrl) VALUES (?, ?)`,
            [postId, imageUrl],
            (err, result) => {
              if (err) {
                console.error("image인서트 오류:", err);
                return imagedata(err);
              }
              imageres(result);
            }
          );
        };
      });

      // 해시태그 저장

      // 해시태그 분리 -> 각 해시태그에 # 추가해서 형식 통일
      const hashtagArray = hashtags
        .split(" ")
        .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));

      const hashtagInsert = hashtagArray.map((tag) => {
        return new Promise((hashtagres, hashtagdata) => {
          //promise안하면 작동안함. 이유는 모름...
          db.query(
            `SELECT hashtagId FROM hashtags WHERE tag = ?`,
            [tag],
            (err, rows) => {
              if (err) {
                console.error("hashtag 검색 중 오류:", err);
                return hashtagdata(err);
              }

              if (rows.length > 0) {
                // 이미 존재하는 해시태그인 경우
                const hashtagId = rows[0].hashtagId;
                db.query(
                  `INSERT INTO post_hashtags (postId, hashtagId) VALUES (?, ?)`,
                  [postId, hashtagId],
                  (err, result) => {
                    if (err) {
                      console.error("post_hashtags에 삽입 중 오류:", err);
                      return hashtagdata(err);
                    }
                    hashtagres(result);
                  }
                );
              } else {
                // 새로운 해시태그인 경우
                db.query(
                  `INSERT INTO hashtags (tag) VALUES (?)`,
                  [tag],
                  (err, result) => {
                    if (err) {
                      console.error("hashtag 삽입 중 오류:", err);
                      return hashtagdata(err);
                    }
                    const hashtagId = result.insertId;
                    db.query(
                      `INSERT INTO post_hashtags (postId, hashtagId) VALUES (?, ?)`,
                      [postId, hashtagId],
                      (err, result) => {
                        if (err) {
                          console.error("post_hashtags에 삽입 중 오류:", err);
                          return hashtagdata(err);
                        }
                        hashtagres(result);
                      }
                    );
                  }
                );
              }
            }
          );
        });
      });

      Promise.all([...imageInsert, ...hashtagInsert])
        .then(() => {
          res.json({ message: "피드가 성공적으로 작성되었습니다." });
        })
        .catch((err) => {
          console.error("Error processing post:", err);
          res.json({ message: "서버 오류가 발생했습니다." });
        });
    }
  );
});

export default feedRouter;
