import express from "express";
import { db } from "../db.js";
import dayjs from "dayjs";

const otherRouter = express.Router();

// otherRouter.post("/post/likeToggle", (req, res) => {
//   try {
//     const { postId } = req.body;
//     // 해당 포스트의 좋아요 상태를 토글합니다.
//     const [rows] = db.query("SELECT isLiked FROM posts WHERE postId = ?", [
//       postId,
//     ]);
//     const isLiked = rows[0].isLiked ? 0 : 1;
//     db.query("UPDATE posts SET isLiked = ? WHERE postId = ?", [
//       isLiked,
//       postId,
//     ]);

//     // 업데이트된 포스트 리스트를 반환합니다.
//     const updatedPosts = db.query("SELECT * FROM posts");
//     res.json(updatedPosts);
//   } catch (error) {
//     console.error("Error toggling like:", error);
//     res.status(500).json({ error: "Failed to toggle like" });
//   }
// });

export default otherRouter;
