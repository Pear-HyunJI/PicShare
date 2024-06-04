import express from "express";
import { db } from "../db.js";

const followRouter = express.Router();

// 팔로우
followRouter.post("/followfunction", (req, res) => {
  const { followerId, followeeId } = req.body;
  db.query(
    "INSERT INTO follows (followerId, followeeId) VALUES (?,?)",
    [followerId, followeeId],
    (err, followfunction) => {
      if (err) {
        console.error("팔로우기능 수행 중 에러", err);
        return res.json({
          message: "팔로우 기능 수행 중 에러 발생",
        });
      }
      console.log("팔로우기능", followfunction);
      res.send(followfunction);
    }
  );
});

// 언팔로우
followRouter.post("/unfollowfunction", (req, res) => {
  const { followerId, followeeId } = req.body;
  db.query(
    "DELETE FROM follows WHERE followerId =? AND followeeId =?",
    [followerId, followeeId],
    (err, unfollowfunction) => {
      if (err) {
        console.error("언팔로우기능 수행 중 에러", err);
        return res.json({
          message: "언팔로우 기능 수행 중 에러 발생",
        });
      }
      console.log("언팔로우기능", unfollowfunction);
      res.send(unfollowfunction);
    }
  );
});

// 팔로잉리스트
// 팔로워아이디가 '현재유저의 넘버(userNo, 커런트아이디를 유저넘버로 보내줌)'인 팔로이아이디의 유저 정보를 불러옴
followRouter.get("/followinglist", (req, res) => {
  const { userNo } = req.query;
  db.query(
    "SELECT * FROM users WHERE userNo IN (SELECT followeeId FROM follows WHERE followerId = ?)",
    [userNo],
    (err, followinglistdata) => {
      if (err) {
        console.error("팔로잉리스트 에러", err);
        return res.json({
          message: "팔로잉리스트 불러오기 실패",
        });
      }
      console.log("팔로잉리스트", followinglistdata);
      res.send(followinglistdata);
    }
  );
});

// 팔로워리스트
followRouter.get("/followerlist", (req, res) => {
  const { userNo } = req.query;
  db.query(
    "SELECT * FROM users WHERE userNo IN (SELECT followerId FROM follows WHERE followeeId = ?)",
    [userNo],
    (err, followerlistdata) => {
      if (err) {
        console.error("팔로워리스트 에러", err);
        return res.json({
          message: "팔로워리스트 불러오기 실패",
        });
      }
      console.log("팔로워리스트", followerlistdata);
      res.send(followerlistdata);
    }
  );
});

export default followRouter;