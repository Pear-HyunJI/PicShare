import express from "express";
import { db } from "../db.js";

const followersRouter = express.Router();

app.get('/followers/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `
      SELECT users.id, users.username 
      FROM followers 
      JOIN users ON followers.follower_id = users.id 
      WHERE followers.user_id = ?
    `;
    db.query(query, [userId], (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  
  app.post('/follow', (req, res) => {
    const { userId, followerId } = req.body;
    const query = 'INSERT INTO followers (user_id, follower_id) VALUES (?, ?)';
    db.query(query, [userId, followerId], (err, results) => {
      if (err) throw err;
      res.json({ message: 'Followed successfully' });
    });
  });
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

export default followersRouter;