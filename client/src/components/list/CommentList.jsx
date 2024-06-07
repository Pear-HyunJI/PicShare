import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { AiFillMessage } from "react-icons/ai";
// import FollowButton from '../follow/FollowButton';
// import { Link } from "react-router-dom";

const serverUrl = import.meta.env.VITE_API_URL;

const CommentListBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px;
  h2 {
    margin-bottom: 30px;
    background: #eee;
    color: gray;
    padding: 10px;
    font-weight: 500;
    font-size: 18px;
    border-radius: 5px;
  }
`;
const commentItem = styled.div`
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  .comment {
    color: #000;
    z-index: 9999;
    font-size: 25px;
    margin-bottom: 10px;
  }
  .commentImg {
    width: 10%;
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

  console.log("코멘트리스트", commentList);

  return (
    <CommentListBlock>
      <h2>
        <AiFillMessage />
        &nbsp;&nbsp;내가 작성한 댓글 목록
      </h2>
      <div>
        {commentList.map((comment) => (
          <CommentItem key={comment.postId}>
            <div className="comment">
              <AiFillMessage />
            </div>
            <div></div>

            <div className="commentImg">
              <img src={`${serverUrl}/uploads/${comment.imageUrls}`} alt="Post" />
            </div>
            <p className="commentContent">게시글 : {comment.content}</p>
          </CommentItem>
        ))}
      </div>
    </CommentListBlock>
  );
};

export default CommentList;