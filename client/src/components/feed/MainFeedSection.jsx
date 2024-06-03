import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { fetchAllFeed } from "@/store/feed";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";

const MainFeedSectionBlock = styled.div`
  // 스타일 정의
`;

const PostBlock = styled.div`
  border: 1px solid #ddd;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const PostImages = styled.div`
  display: flex;
  overflow-x: auto;
`;

const PostImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin-right: 10px;
`;

const PostContent = styled.div`
  margin-top: 10px;
`;

const PostFooter = styled.div`
  margin-top: 10px;
  .like {
  }
`;

const MainFeedSection = ({ filter, posts }) => {
  const dispatch = useDispatch();
  const { feeds, loading, error } = useSelector((state) => state.feeds);

  // 좋아요
  const user = useSelector((state) => state.members.user);
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // 피드 데이터를 가져오는 로직
    if (filter.type === "all") {
      dispatch(fetchAllFeed());
    } else if (filter.type === "following") {
      dispatch(fetchAllFeed(filter));
    }

    // 좋아요 데이터를 가져오는 로직
    if (user) {
      axios
        .post("http://localhost:8001/other/post/likeList", { userNo: user.userNo })
        .then((res) => {
          if (res.data) {
            let initialHearts = posts.map((post) => ({ postId: post.id, isLiked: 0 }));
            const updatedHearts = initialHearts.map((heart) => {
              const dbHeart = res.data.find((item) => item.postId === heart.postId);
              return dbHeart ? { ...heart, isLiked: dbHeart.isLiked } : heart;
            });
            setHearts(updatedHearts);
          } else {
            console.log("좋아요 데이터를 가져오는데 실패했습니다.");
          }
        })
        .catch((error) => {
          console.error("좋아요 데이터를 가져오는 중 오류 발생:", error);
        });
    }
  }, [dispatch, filter, user, posts]);

  const onToggle = (postItem) => {
    if (user) {
      const updateHearts = hearts.map((heart) =>
        heart.postId === postItem.id ? { ...heart, isLiked: !heart.isLiked } : heart
      );
      setHearts(updateHearts);
      axios
        .post("http://localhost:8001/other/post/likeToggle", { post: postItem, userNo: user.userNo })
        .then((res) => {
          if (res.data) {
            console.log("좋아요 리스트 업데이트:", res.data);
            setHearts(res.data);
          } else {
            console.log("좋아요 저장 실패");
          }
        })
        .catch((error) => {
          console.error("좋아요 저장 중 오류 발생:", error);
          setHearts((prevHearts) =>
            prevHearts.map((heart) =>
              heart.postId === postItem.id ? { ...heart, isLiked: !heart.isLiked } : heart
            )
          );
        });
    } else {
      alert("로그인해 주세요.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // 현재 시간을 가져오는 함수
  const getCurrentTime = () => {
    return new Date();
  };

  // 피드가 현재 시간과 같거나 현재 시간 이후에 생성된 경우만 필터링
  const filteredFeeds = feeds.filter((post) => {
    const createdAt = new Date(post.created_at);
    return createdAt <= getCurrentTime();
  });

  return (
    <MainFeedSectionBlock>
      <h2>{filter.type === "all" ? "모든 피드" : "팔로잉한 사람 피드"}</h2>
      {filteredFeeds.map((post) => (
        <PostBlock key={post.postId}>
          <PostHeader>
            <Link to={`/personalpage/${post.userNo}`}>
              <img
                src={`http://localhost:8001/uploads/${post.profilePicture}`}
                alt={post.userNickname}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <span>{post.userNickname}</span>
            </Link>
          </PostHeader>
          <PostImages>
            {post.feedImages &&
              post.feedImages.map((image) => (
                <PostImage key={image.imageId} src={image.imageUrl} alt={`Post ${post.postId} Image`} />
              ))}
          </PostImages>
          <PostContent>{post.content}</PostContent>
          <PostFooter>
            <div>Hashtags: {post.feedHashtags.join(", ")}</div>
            <div>Posted at: {new Date(post.created_at).toLocaleString()}</div>
            <div className="like" onClick={() => onToggle(post)}>
              {hearts.find((heart) => heart.postId === post.postId)?.isLiked ? <FaHeart /> : <FaRegHeart />}
            </div>
          </PostFooter>
        </PostBlock>
      ))}
    </MainFeedSectionBlock>
  );
};

export default MainFeedSection;
