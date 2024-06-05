import express from "express";
import multer from "multer";
import { db } from "../db.js";

const userprofileRouter = express.Router();

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

// 닉네임 중복 체크
userprofileRouter.post("/check-nickname", (req, res) => {
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
userprofileRouter.post("/join", upload.single("photo"), (req, res) => {
  const { userNickname } = req.body;
  let photo = req.file ? req.file.filename : "defaultProfile.jpg"; // 기본 프로필 사진 설정

  db.query(
    `INSERT INTO users (userNickname, profilePicture) VALUES (?, ?)`,
    [userNickname, photo],
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


export default userprofileRouter;
