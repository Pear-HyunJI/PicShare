import express from "express";
import multer from "multer";
import { db } from "../db.js"; // Ensure this path is correct

const feedRouter = express.Router();

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
const upload = multer({ storage: storage });

// 피드 작성
feedRouter.post("/insert", upload.array("images", 10), (req, res) => {
  const { userNo, content, hashtags, scheduled_at } = req.body;
  const files = req.files;

  // Check if scheduled_at is provided
  const scheduledAtValue = scheduled_at ? scheduled_at : null;

  // 오류확인
  console.log("받은 데이터:", {
    userNo,
    content,
    hashtags,
    scheduled_at: scheduledAtValue,
  });
  console.log("받은 파일:", files);

  db.query(
    `INSERT INTO posts (userNo, content, scheduled_at) VALUES (?, ?, ?)`,
    [userNo, content, scheduledAtValue],
    (err, result) => {
      if (err) {
        console.error("Error inserting post:", err);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
      }

      const postId = result.insertId;

      // 이미지 저장
      const imageInsertPromises = files.map((file) => {
        const imageUrl = `/uploads/${file.filename}`;
        return new Promise((resolve, reject) => {
          db.query(
            `INSERT INTO images (postId, imageUrl) VALUES (?, ?)`,
            [postId, imageUrl],
            (err, result) => {
              if (err) {
                console.error("Error inserting image:", err);
                return reject(err);
              }
              resolve(result);
            }
          );
        });
      });

      // 해시태그 저장
      const hashtagArray = hashtags
        .split(" ")
        .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
      const hashtagInsertPromises = hashtagArray.map((tag) => {
        return new Promise((resolve, reject) => {
          db.query(
            `INSERT INTO hashtags (tag) VALUES (?) ON DUPLICATE KEY UPDATE tag=tag`,
            [tag],
            (err, result) => {
              if (err) {
                console.error("Error inserting hashtag:", err);
                return reject(err);
              }

              const hashtagId = result.insertId || result[0].hashtagId;
              db.query(
                `INSERT INTO post_hashtags (postId, hashtagId) VALUES (?, ?)`,
                [postId, hashtagId],
                (err, result) => {
                  if (err) {
                    console.error("Error linking post and hashtag:", err);
                    return reject(err);
                  }
                  resolve(result);
                }
              );
            }
          );
        });
      });

      Promise.all([...imageInsertPromises, ...hashtagInsertPromises])
        .then(() => {
          res
            .status(200)
            .json({ message: "피드가 성공적으로 작성되었습니다." });
        })
        .catch((err) => {
          res.status(500).json({ message: "서버 오류가 발생했습니다." });
        });
    }
  );
});

export default feedRouter;
