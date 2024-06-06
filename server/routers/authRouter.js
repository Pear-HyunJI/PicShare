import express from "express";
import { db } from "../db.js";
import multer from "multer";

const authRouter = express.Router();

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 파일이 저장될 폴더 경로
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // 파일명 설정
  },
});
const upload = multer({ storage: storage });

// 이메일 중복 체크
authRouter.post("/check-email", (req, res) => {
  const { email } = req.body;

  db.query(
    `SELECT email FROM users WHERE email = ?`,
    [email],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "서버 오류가 발생했습니다. 다시 시도해주세요." });
      }
      if (results.length > 0) {
        return res
          .status(400)
          .json({ field: "email", message: "이미 존재하는 이메일입니다." });
      }
      res.status(200).json({ message: "사용 가능한 이메일입니다." });
    }
  );
});

// 닉네임 중복 체크
authRouter.post("/check-nickname", (req, res) => {
  const { userNickname } = req.body;

  db.query(
    `SELECT userNickname FROM users WHERE userNickname = ?`,
    [userNickname],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "서버 오류가 발생했습니다. 다시 시도해주세요." });
      }
      if (results.length > 0) {
        return res.status(400).json({
          field: "userNickname",
          message: "이미 존재하는 닉네임입니다.",
        });
      }
      res.status(200).json({ message: "사용 가능한 닉네임입니다." });
    }
  );
});

// JOIN 기능
authRouter.post("/join", upload.single("photo"), (req, res) => {
  const { email, userName, userNickname, password } = req.body;
  let photo = req.file ? req.file.filename : "defaultProfile.jpg"; // 기본 프로필 사진 설정

  db.query(
    `INSERT INTO users (email, userName, userNickname, password, profilePicture) VALUES (?, ?, ?, ?, ?)`,
    [email, userName, userNickname, password, photo],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ field: "email", message: "이미 존재하는 이메일입니다." });
        } else {
          return res
            .status(500)
            .json({ message: "서버 오류가 발생했습니다. 다시 시도해주세요." });
        }
      } else {
        res.status(200).json({ affectedRows: result.affectedRows });
      }
    }
  );
});

// LOGIN 기능
authRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    `SELECT * FROM users WHERE email = ? AND password = ?`,
    [email, password],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "서버 오류가 발생했습니다. 다시 시도해주세요." });
      } else {
        if (results.length === 0) {
          return res
            .status(400)
            .json({ message: "존재하지 않는 이메일입니다." });
        }

        const user = results[0];
        if (password !== user.password) {
          return res
            .status(400)
            .json({ message: "비밀번호가 일치하지 않습니다." });
        }

        res.json({
          userNo: user.userNo,
          email: user.email,
          password: user.password,
          userName: user.userName,
          userNickname: user.userNickname,
          profilePicture: user.profilePicture,
          created_at: user.created_at,
        });
        // res.send(results); // 이렇게 하면 유저가 undifined로 뜸 왜지???
      }
    }
  );
});

// LOGOUT 기능
authRouter.post("/remove", (req, res) => {
  const userNo = req.body.userNo;
  db.query("DELETE FROM membertbl WHERE userNo=?", [userNo], (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send(result);
    }
  });
});

// all users 가져오기
authRouter.get("/users", (req, res) => {
  const { targetUserNo } = req.query;
  console.log(targetUserNo);
  // targetUserNo가 있을 때는 해당하는 사용자 정보만 가져오기
  if (targetUserNo) {
    db.query(
      `SELECT userNo, userName, userNickname, profilePicture FROM users WHERE userNo = ?`,
      [targetUserNo],
      (err, userData) => {
        if (err) {
          console.error(err);
          s;
          return res.json({
            message: "서버 오류가 발생했습니다. 다시 시도해주세요.",
          });
        }
        console.log("유저 데이터:", userData);
        if (userData.length === 0) {
          return res.json({
            message: "해당하는 사용자를 찾을 수 없습니다.",
          });
        }
        res.send(userData);
      }
    );
  } else {
    // targetUserNo가 없을 때는 모든 사용자 데이터 가져오기
    db.query(
      `SELECT userNo, userName, userNickname, profilePicture FROM users`,
      (err, usersData) => {
        if (err) {
          console.error(err);
          return res.json({
            message: "서버 오류가 발생했습니다. 다시 시도해주세요.",
          });
        }
        console.log("모든 유저 데이터:", usersData);
        res.send(usersData);
      }
    );
  }
});

// 로그인 유지
authRouter.post("/refresh", (req, res) => {
  const userNo = req.body.userNo;
  db.query("SELECT * FROM users WHERE userNo=?", [userNo], (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send({ user: result[0] });
    }
  });
});

//회원탈퇴
authRouter.delete("/delete", (req, res) => {
  const { userNo } = req.query;

  // 유저 삭제
  db.query("DELETE FROM users WHERE userNo=?", [userNo], (err, userResult) => {
    if (err) {
      console.error("유저 삭제 중 에러:", err);
      res.status(500).send("유저 삭제 실패");
      return;
    }

    // 포스트 삭제
    db.query(
      "DELETE FROM posts WHERE userNo=?",
      [userNo],
      (err, postResult) => {
        if (err) {
          console.error("포스트 삭제 중 에러:", err);
          res.status(500).send("포스트 삭제 실패");
          return;
        }

        // 이미지 삭제
        db.query(
          "DELETE FROM images WHERE postId IN (SELECT postId FROM posts WHERE userNo=?)",
          [userNo],
          (err, imageResult) => {
            if (err) {
              console.error("이미지 삭제 중 에러:", err);
              res.status(500).send("이미지 삭제 실패");
              return;
            }

            // 해시태그 관계 삭제
            db.query(
              "DELETE FROM post_hashtags WHERE postId IN (SELECT postId FROM posts WHERE userNo=?)",
              [userNo],
              (err, hashtagResult) => {
                if (err) {
                  console.error("해시태그 관계 삭제 중 에러:", err);
                  res.status(500).send("해시태그 관계 삭제 실패");
                  return;
                }

                // 좋아요 정보 삭제
                db.query(
                  "DELETE FROM postlike WHERE postId IN (SELECT postId FROM posts WHERE userNo=?)",
                  [userNo],
                  (err, likeResult) => {
                    if (err) {
                      console.error("좋아요 정보 삭제 중 에러:", err);
                      res.status(500).send("좋아요 정보 삭제 실패");
                      return;
                    }

                    // 팔로우 관계 삭제
                    db.query(
                      "DELETE FROM follows WHERE followerId=? OR followeeId=?",
                      [userNo, userNo],
                      (err, followResult) => {
                        if (err) {
                          console.error("팔로우 관계 삭제 중 에러:", err);
                          res.status(500).send("팔로우 관계 삭제 실패");
                          return;
                        }

                        console.log("회원 및 관련 데이터 삭제 완료");
                        res.send("회원 및 관련 데이터 삭제 완료");
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

// 프로필사진 및 닉네임 수정 기능
// authRouter.put("/update-profile", upload.single("photo"), (req, res) => {
//   const { userNo, userNickname, currentPassword, newPassword } = req.body;
//   const photo = req.file ? req.file.filename : "defaultProfile.jpg";
//   console.log("서버 포토", photo);

//   // 닉네임만
//   if (!photo) {
//     db.query(
//       `UPDATE users SET userNickname = ? WHERE userNo = ?`,
//       [userNickname, userNo],
//       (err, result) => {
//         if (err) {
//           return res.status(500).json({
//             message: "서버 오류가 발생했습니다. 다시 시도해주세요.",
//           });
//         }
//         res.status(200).json({ affectedRows: result.affectedRows });
//       }
//     );
//   }

//   // 프로필 사진과 닉네임
//   db.query(
//     `UPDATE users SET profilePicture = ?, userNickname = ? WHERE userNo = ?`,
//     [photo, userNickname, userNo],
//     (err, result1) => {
//       if (err) {
//         return res.status(500).json({
//           message: "서버 오류가 발생했습니다. 다시 시도해주세요.",
//         });
//       }
//       res.status(200).json({ affectedRows: result1.affectedRows });
//     }
//   );

//   // 비밀번호를 변경할 떼
//   if (newPassword) {
//     // 현재 비밀번호 확인
//     db.query(
//       "SELECT * FROM users WHERE userNo = ?",
//       [userNo],
//       (err, results) => {
//         if (err) {
//           return res.status(500).json({
//             message: "서버 오류가 발생했습니다. 다시 시도해주세요.",
//           });
//         }
//         const user = results[0];
//         if (user.password !== currentPassword) {
//           return res.status(400).json({
//             field: "currentPassword",
//             message: "현재 비밀번호가 일치하지 않습니다.",
//           });
//         }

//         // 새로운 비밀번호로 업데이트
//         db.query(
//           "UPDATE users SET password = ? WHERE userNo = ?",
//           [newPassword, userNo],
//           (err, results) => {
//             if (err) {
//               return res.status(500).json({
//                 message: "서버 오류가 발생했습니다. 다시 시도해주세요.",
//               });
//             }
//             res.status(200).json({ affectedRows: results.affectedRows });
//           }
//         );
//       }
//     );
//   }
// });

// 비밀번호 변경 기능
// authRouter.put("/update-password", (req, res) => {
//   const { currentPassword, newPassword } = req.body;

//   // 현재 비밀번호 확인
//   db.query(
//     "SELECT * FROM users WHERE userNo = ?",
//     [req.body.userNo],
//     (err, results) => {
//       if (err) {
//         return res.status(500).json({
//           message: "서버 오류가 발생했습니다. 다시 시도해주세요.",
//         });
//       }
//       const user = results[0];
//       if (user.password !== currentPassword) {
//         return res.status(400).json({
//           field: "currentPassword",
//           message: "현재 비밀번호가 일치하지 않습니다.",
//         });
//       }

//       // 새로운 비밀번호로 업데이트
//       db.query(
//         "UPDATE users SET password = ? WHERE userNo = ?",
//         [newPassword, req.body.userNo],
//         (err, result) => {
//           if (err) {
//             return res.status(500).json({
//               message: "서버 오류가 발생했습니다. 다시 시도해주세요.",
//             });
//           }
//           res.status(200).json({ affectedRows: result.affectedRows });
//         }
//       );
//     }
//   );
// });

authRouter.put("/update-profile", upload.single("photo"), (req, res) => {
  const { userNo, userNickname, currentPassword, newPassword } = req.body;
  const photo = req.file ? req.file.filename : null;

  // 닉네임과 프로필 사진 업데이트
  if (photo || userNickname) {
    let updateQuery = "UPDATE users SET";
    let queryParams = [];

    if (photo) {
      updateQuery += " profilePicture = ?";
      queryParams.push(photo);
    }

    if (userNickname) {
      if (queryParams.length > 0) updateQuery += ",";
      updateQuery += " userNickname = ?";
      queryParams.push(userNickname);
    }

    updateQuery += " WHERE userNo = ?";
    queryParams.push(userNo);

    db.query(updateQuery, queryParams, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "서버 오류가 발생했습니다. 다시 시도해주세요.",
        });
      }
      if (newPassword) {
        updatePassword();
      } else {
        res.status(200).json({ affectedRows: result.affectedRows });
      }
    });
  } else if (newPassword) {
    updatePassword();
  }

  function updatePassword() {
    // 현재 비밀번호 확인
    db.query(
      "SELECT * FROM users WHERE userNo = ?",
      [userNo],
      (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "서버 오류가 발생했습니다. 다시 시도해주세요.",
          });
        }
        const user = results[0];
        if (user.password !== currentPassword) {
          return res.status(400).json({
            field: "currentPassword",
            message: "현재 비밀번호가 일치하지 않습니다.",
          });
        }

        // 새로운 비밀번호로 업데이트
        db.query(
          "UPDATE users SET password = ? WHERE userNo = ?",
          [newPassword, userNo],
          (err, results) => {
            if (err) {
              return res.status(500).json({
                message: "서버 오류가 발생했습니다. 다시 시도해주세요.",
              });
            }
            res.status(200).json({ affectedRows: results.affectedRows });
          }
        );
      }
    );
  }
});

export default authRouter;
