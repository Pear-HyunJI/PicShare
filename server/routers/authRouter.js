import express from "express";
import { db } from "../db.js";

const authRouter = express.Router();

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
authRouter.post("/join", (req, res) => {
  const { email, userName, userNickname, password } = req.body;

  db.query(
    `INSERT INTO users (email, userName, userNickname, password) VALUES (?, ?, ?, ?)`,
    [email, userName, userNickname, password],
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

export default authRouter;
