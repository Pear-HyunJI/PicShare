import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import { AiFillMessage } from "react-icons/ai";
// import FollowButton from '../follow/FollowButton';
// import { Link } from "react-router-dom";

const CommentListBlock = styled.div`
display: flex;
flex-direction: column;
padding: 30px;
h2 {
  margin-bottom: 30px;
  background: #eee;
  color:gray;
  padding:10px;
  font-weight: 500;
  font-size:18px;
  border-radius: 5px;
}
`
const LikeItem = styled.div`
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  .like {
    color: #000;
    z-index: 9999;
    font-size: 25px;
    margin-bottom: 10px;
  }
  .likeImg{
    width: 10%;
    margin-bottom: 10px;
  }
`;



const CommentList = () => {
    const dispatch = useDispatch();
    const [likeList, setLikeList] = useState([]);
    const user = useSelector((state) => state.members.user);
    
    useEffect(() => {
      if (user) {
        axios
          .post("http://localhost:8001/other/post/likeList", {
            userNo: user.userNo,
          })
          .then((res) => {
            if (res.data) {
              setLikeList(res.data);
            } else {
              console.log("좋아요 데이터를 가져오는데 실패했습니다.");
            }
          })
          .catch((error) => {
            console.error("좋아요 데이터를 가져오는 중 오류 발생:", error);
          });
      }
    }, [dispatch, user]);
  
    return (
      <CommentListBlock>
        <h2><AiFillMessage />&nbsp;&nbsp;내가 작성한 댓글 목록</h2>
        <div>
          {likeList.map(like => (
            <LikeItem key={like.postId}>
              <div className='like'><AiFillMessage /></div>
              <div></div>
              <div className='likeImg'><img src={like.imageUrl} alt="Post" /></div>
              <p className='likeContent'>게시글 : {like.content}</p>
            </LikeItem>
          ))}
        </div>
      </CommentListBlock>
    );
  };
  

  export default CommentList;