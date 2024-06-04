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
  const createdAtValue = scheduled_at ? scheduled_at : new Date();
  const scheduledAtValue = scheduled_at ? scheduled_at : null;

  // post테이블에 userNo, content, scheduled_at(예약설정시간) 저장
  db.query(
    `INSERT INTO posts (userNo, content, scheduled_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
    [userNo, content, scheduledAtValue, createdAtValue, createdAtValue],
    (err, result) => {
      if (err) {
        console.error("post인서트 에러:", err);
        return res.json({ message: "서버 오류가 발생했습니다." });
      }

      const postId = result.insertId;

      // images 테이블에 이미지 저장
      const imageInsert = files.map((file) => {
        const imageUrl = `http://localhost:8001/uploads/${file.filename}`;
        return new Promise((imageres, imagedata) => {
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
        });
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

// 유저의 포스트 가져옴
feedRouter.get("/all", (req, res) => {
  const { userNo } = req.query;

  let query = `SELECT p.*, u.userNickname, u.profilePicture 
               FROM posts p 
               JOIN users u ON p.userNo = u.userNo`;

  // fecthAllFeed에서 userNo가 왔을때, 여기서 userNo는 팔로잉리스트에 있는 유저넘버!!(메인피드에서)
  // 따라서 팔로잉한 유저의 피드만 가져오기!(메인피드에서)
  // 개인페이지에서 가져오는건 타겟유저넘버
  if (userNo) {
    query += ` WHERE p.userNo = ${userNo}`;
  }
  // 가져온 userNo가 없을때는 모든유저의 피드 가져오기
  query += ` ORDER BY p.created_at DESC`;

  db.query(query, (err, posts) => {
    if (err) {
      console.log(err);
      return res.json({
        message: "서버 오류가 발생했습니다. 다시 시도해주세요.",
      });
    }

    const postIds = posts.map((post) => post.postId);

    // 피드 이미지 가져옴
    db.query(
      ` SELECT i.* FROM images i WHERE i.postId IN (?) `,
      [postIds],
      (err, imagesdata) => {
        if (err) {
          console.log(err);
          return res.json({
            message: "피드의 이미지를 가져오던 중 오류가 발생했습니다.",
          });
        }

        // 해시태그 가져옴
        db.query(
          `
          SELECT ph.postId, h.tag
          FROM post_hashtags ph
          JOIN hashtags h ON ph.hashtagId = h.hashtagId
          WHERE ph.postId IN (?)
          `,
          [postIds],
          (err, hashtagsdata) => {
            if (err) {
              console.log(err);
              return res.json({
                message: "피드의 해시태그를 가져오던 중 오류가 발생했습니다.",
              });
            }

            // 각각의 이미지를 해당 포스트에 매핑
            const imagesByPostId = imagesdata.reduce((acc, image) => {
              if (!acc[image.postId]) acc[image.postId] = [];
              acc[image.postId].push(image);
              return acc;
            }, {});

            // 각각의 해시태그를 해당 포스트에 매핑
            const hashtagsByPostId = hashtagsdata.reduce((acc, hashtag) => {
              if (!acc[hashtag.postId]) acc[hashtag.postId] = [];
              acc[hashtag.postId].push(hashtag.tag);
              return acc;
            }, {});

            // 결과를 최종 포스트 데이터에 합침
            const result = posts.map((post) => ({
              ...post,
              feedImages: imagesByPostId[post.postId] || [],
              feedHashtags: hashtagsByPostId[post.postId] || [],
            }));

            console.log("서버에서 보내주는 올피드데이터", result);
            res.send(result);
          }
        );
      }
    );
  });
});

export default feedRouter;