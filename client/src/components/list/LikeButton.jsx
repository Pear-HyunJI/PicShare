import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { fetchLikeList } from "@/store/like";
import LikedUsersModal from "@/components/list/LikedUsersModal";

const serverUrl = import.meta.env.VITE_API_URL;

const LikeButtonBlock = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  .likewrap {
    display: flex;
    align-items: center;
    // border: 1px solid green;
    .like {
      padding: 20px 10px;
      align-items: center;
      color: red;
      // margin-right: 8px;
      font-size: 25px;
      // border: 1px solid blue;
    }
    .likeCount {
      margin-left: 2px;
      color: red;
      // border: 1px solid black;
    }
  }
`;

const LikeButton = ({ postId }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.members.user);
  const likeList = useSelector((state) => state.likes.likeList);
  const [isLiked, setIsLiked] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (likeList && likeList.length > 0) {
      setIsLiked(likeList.some((post) => post.postId === postId));
    }
  }, [likeList, postId]);

  const fetchLikedUsers = async () => {
    try {
      const res = await axios.post(`${serverUrl}/other/post/likedUsers`, {
        postId,
      });
      if (res.data) {
        setLikedUsers(res.data);
      }
    } catch (error) {
      console.error("좋아요 유저 목록을 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchLikedUsers();
  }, [postId]);

  const onToggle = async () => {
    if (user) {
      try {
        const res = await axios.post(`${serverUrl}/other/post/likeToggle`, {
          post: { postId },
          userNo: user.userNo,
        });
        if (res.data) {
          setIsLiked((prev) => !prev);
          dispatch(fetchLikeList());
          await fetchLikedUsers(); // 좋아요 유저 목록을 다시 가져옴
        } else {
          console.log("좋아요 상태 변경 실패");
        }
      } catch (error) {
        console.error("좋아요 상태 변경 중 오류 발생:", error);
      }
    } else {
      alert("로그인해 주세요.");
    }
  };

  const showLikedUsers = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <LikeButtonBlock>
      <div className="likewrap">
        <div className="like" onClick={onToggle}>
          {isLiked ? <FaHeart /> : <FaRegHeart />}
        </div>
        <div className="likeCount" onClick={showLikedUsers}>
          {likedUsers.length > 0
            ? `${likedUsers[0].userNickname} 외 ${likedUsers.length}명이 좋아합니다.`
            : "0명이 좋아합니다"}
        </div>
      </div>
      {showModal && (
        <LikedUsersModal likedUsers={likedUsers} onClose={closeModal} />
      )}
    </LikeButtonBlock>
  );
};

export default LikeButton;
