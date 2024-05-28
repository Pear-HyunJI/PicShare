import express from "express";
import { db } from "../db.js";

const authRouter = express.Router();

// JOIN 기능
authRouter.post("/join", (req, res) => {
  const { email, userName, userNickname, password } = req.body;

  db.query(
    `INSERT INTO users (email, userName, userNickname, password) VALUES (?, ?, ?, ?)`,
    [email, userName, userNickname, password],
    (err, result) => {
      if (err) {
        //   if (err.code === "ER_DUP_ENTRY") {
        //     return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
        //   } else {
        //     return res
        //       .status(500)
        //       .json({ message: "서버 오류가 발생했습니다. 다시 시도해주세요." });
        //   }
        throw err;
      } else {
        res
          // .json({ message: "성공적으로 회원가입이 완료되었습니다." })
          .send(result);
        // .status(200)
      }
    }
  );
});

export default authRouter;
