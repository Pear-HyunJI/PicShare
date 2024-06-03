import express from "express";
import dayjs from 'dayjs'
import { db } from "../db.js";

const otherRouter = express.Router();

otherRouter.post('/post/likeList',(req, res) => {
  const userNo = req.body.userNo
  db.query(`SELETE * FROM postlike WHERE userNo=?`, [userNo], (err,result) =>{
    if (err) {
        throw err
    } else {
        res.send(result)
    }
  })
})

otherRouter.post('/post/likeToggle',(req, res)=>{
    let connection;
    try {
        connection = db.getConnection((err, connection)=>{
            if (err) {
                console.error("에러",err)
                res.status(500).send("실패");
                return
            }
            connection.beginTransaction(()=>{
                if (err) {
                    console.error("에러",err)
                    res.status(500).send("실패");
                    connection.release();
                    return
                }
                const {post, userNo} = req.body
                const date = dayjs()
                const insertLikeQuery = `Insert Into postlike 
                                        (userNo, postId, postPhoto, isLiked, date) 
                                        Values (?,?,?,1,?)
                                        On Duplicate Key
                                        Update isLiked = Not isLiked
                                        `
                connection.query(insertLikeQuery, [userNo, post.Id, post.postphoto, date.format("YYYY-MM-DD HH:mm:SS")], (err, result)=>{
                    if (err) {
                        return connection.rollback(()=>{
                            connection.release();
                            res.status(500).send(err);
                        });
                    } if (result.affectedRows !=0) {
                        const selectLikeQuery = 'SELECT * FROM postlike WHERE userNo=?';
                        connection.query(selectLikeQuery, [userNo], (err, result)=>{
                            if(err){
                                return connection.rollback(()=>{
                                    connection.release();
                                    res.status(500).send(err);
                                });
                            }
                            connection.commit((err)=>{
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        res.status(500).send(err);
                                    });
                                }
                                console.log("결과", result)
                                connection.release();
                                res.send(result);
                            })
                        })
                    } else {
                        connection.rollback(() => {
                            connection.release();
                            res.status(500).send('좋아요 업데이트 실패');
                        });
                    }
                })
            })
        })
    } catch (err){
        console.error("수정실패:", err);
        res.status(500).send("실패");
    } if (connection) {
        connection.rollback(()=>{
            connection.release();
        });
    }
})

export default otherRouter;
    