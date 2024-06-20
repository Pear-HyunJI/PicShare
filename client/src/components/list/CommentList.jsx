import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { AiFillMessage } from "react-icons/ai";
import { RiCloseFill } from "react-icons/ri";

const serverUrl = import.meta.env.VITE_API_URL;

const CommentListBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px;
  h2 {
    margin-bottom: 10px;
    background: #eee;
    color: gray;
    padding: 10px;
    font-weight: 500;
    font-size: 18px;
    border-radius: 5px;
  }
  .num {
    margin-bottom: 10px;
  }
`;
const PostBlock = styled.div`
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  position: relative;
  .comment {
    color: #000;
    z-index: 9999;
    font-size: 25px;
    margin-bottom: 10px;
    .delete {
      position: absolute;
      top: 10px;
      right: 10px;
      color: #f00;
    }
  }
  .commentContent{
    margin-bottom: 10px;
  }
`;

const CommentList = () => {
  const dispatch = useDispatch();
  const [commentList, setCommentList] = useState([]);
  const user = useSelector((state) => state.members.user);
  
  useEffect(() => {
    if (user) {
      axios
        .post(`${serverUrl}/other/post/commentList`, {
          userNo: user.userNo,
        })
        .then((res) => {
          if (res.data) {
            setCommentList(res.data);
          } else {
            console.log("댓글 데이터를 가져오는데 실패했습니다.");
          }
        })
        .catch((error) => {
          console.error("댓글 데이터를 가져오는 중 오류 발생:", error);
        });
    }
  }, [dispatch, user]);

  const handleDelete = (commentId) => {
    const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
    if (confirmDelete) {
      axios
        .delete(`${serverUrl}/other/delete/commentList/${commentId}`)
        .then((res) => {
          if (res.data === "댓글 삭제 완료") {
            alert("댓글을 삭제하였습니다.");
            setCommentList((prevCommentList) =>
              prevCommentList.filter((comment) => comment.commentId !== commentId)
            );
          } else {
            alert("삭제를 실패하였습니다.");
          }
        })
        .catch((err) => console.log(err));
    }
  }

  return (
    <CommentListBlock>
      <h2>
        <AiFillMessage />
        &nbsp;&nbsp;내가 작성한 댓글 목록
      </h2>
      <div className="num">
        <span>게시물 {commentList.length}개</span>
      </div>
      <div>
        
        {commentList.map((comment) => (  
          <PostBlock key={comment.commentId}>
            <div className="comment">
              <AiFillMessage />
              <span className="delete">
                <RiCloseFill onClick={() => handleDelete(comment.commentId)} />
              </span>
            </div>
            <div className="commentContent">내가 쓴 댓글 : {comment.comment}</div>
            <div>Posted at: {new Date(comment.date).toLocaleString()}</div>
          </PostBlock>
        ))}
      </div>
    </CommentListBlock>
  );
};

export default CommentList;
