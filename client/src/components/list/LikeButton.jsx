import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { fetchLikeList } from "@/store/like";

const LikeButtonBlock = styled.div``;

const LikeButton = ({ postId }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.members.user);
  const likeList = useSelector((state) => state.likes.likeList);
  const [isLiked, setIsLiked] = useState(false); // 초기 상태를 null로 설정

  // useEffect(() => {
  //   if (user) {
  //     dispatch(fetchLikeList(user.userNo)); // 좋아요 목록
  //   }
  // }, [user, dispatch]);

  // useEffect(() => {
  //   const likedPost = likeList.find((post) => post.postId === postId);
  //   if (likedPost) {
  //     setIsLiked(likedPost.isLiked === 1); // 라이크 리스트 값이 존재할 때에만 상태 설정
  //   }
  // }, [likeList, postId]);

  useEffect(() => {
    if (likeList && likeList.length > 0) {
      setIsLiked(likeList.some((post) => post.postId === postId));
    }
  }, [likeList, postId]);

  // useEffect(() => {
  //   if (user) {
  //     axios
  //       .post("http://localhost:8001/other/post/likeList", {
  //         userNo: user.userNo,
  //       })
  //       .then((res) => {
  //         if (res.data) {
  //           const likedPost = res.data.find((post) => post.postId === postId);
  //           if (likedPost) {
  //             setIsLiked(likedPost.isLiked === 1);
  //           }
  //         } else {
  //           console.log("좋아요 데이터를 가져오는데 실패했습니다.");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("좋아요 데이터를 가져오는 중 오류 발생:", error);
  //       });
  //   }
  // }, [user, postId]);

  const onToggle = () => {
    if (user) {
      axios
        .post("http://localhost:8001/other/post/likeToggle", {
          post: { postId },
          userNo: user.userNo,
        })
        .then((res) => {
          if (res.data) {
            setIsLiked((prev) => !prev);
            dispatch(fetchLikeList());
          } else {
            console.log("좋아요 상태 변경 실패");
          }
        })
        .catch((error) => {
          console.error("좋아요 상태 변경 중 오류 발생:", error);
        });
    } else {
      alert("로그인해 주세요.");
    }
  };

  // 초기 상태가 null이면 빈 하트, 그렇지 않으면 상태에 따라 채워진 하트 또는 빈 하트 표시
  return (
    <LikeButtonBlock>
      <span className="like" onClick={onToggle}>
        {isLiked ? <FaHeart /> : <FaRegHeart />}
        {/* {isLiked === null ? (
          <FaRegHeart />
        ) : isLiked ? (
          <FaHeart />
        ) : (
          <FaRegHeart />
        )} */}
        {/* {isLiked === null && <FaRegHeart />}
        {isLiked === false && <FaRegHeart />}
        {isLiked && <FaHeart />} */}
      </span>
      {/* <span className="like" onClick={onToggle}>
        {isLiked === null ? (
          <FaRegHeart />
        ) : isLiked ? (
          <FaHeart />
        ) : (
          <FaHeart />
        )}
      </span> */}
    </LikeButtonBlock>
  );
};

export default LikeButton;
