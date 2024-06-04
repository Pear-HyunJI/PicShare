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

//프로필사진수정기능
// productRouter.post("/modify", upload.single("photo"), (req, res)=>{
//   const {prNo, category, name, price, description, inventory} = req.body
//   const photo = req.file
//   const query = `UPDATE producttbl
//                  SET category=?, name=?, price=?, description=?, inventory=?, photo=?
//                  WHERE prNo=?`
//   const queryparam = [category, name, price, description, inventory, photo.filename, prNo]
//   db.query(query, queryparam, (err, result)=>{
//       if (err) {
//           res.status(500).send("상품정보 수정 실패");
//           throw err
//       } else {
//           res.send(result)
//       }
//   })
// });

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

export default authRouter;
