import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { fetchAllFeed } from "@/store/feed";

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
`;

const MainFeedSection = ({ filter }) => {
  const dispatch = useDispatch();
  const { feeds, loading, error } = useSelector((state) => state.feeds);

  useEffect(() => {
    if (filter.type === "all") {
      dispatch(fetchAllFeed());
    } else if (filter.type === "following") {
      console.log("팔로잉을 눌렀을대 받으 filter는?", filter);
      // dispatch(fetchAllFeed({ userNo: filter.userNos[0] }));
      dispatch(fetchAllFeed(filter));
    }
  }, [dispatch, filter]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MainFeedSectionBlock>
      <h2>{filter.type === "all" ? "모든 피드" : "팔로잉한 사람 피드"}</h2>
      {feeds.map((post) => (
        <PostBlock key={post.postId}>
          <PostHeader>
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
          </PostHeader>
          <PostImages>
            {post.feedImages &&
              post.feedImages.map((image) => (
                <PostImage
                  key={image.imageId}
                  src={image.imageUrl}
                  alt={`Post ${post.postId} Image`}
                />
              ))}
          </PostImages>
          <PostContent>{post.content}</PostContent>
          <PostFooter>
            <div>Hashtags: {post.feedHashtags.join(", ")}</div>
            <div>Posted at: {new Date(post.created_at).toLocaleString()}</div>
          </PostFooter>
        </PostBlock>
      ))}
    </MainFeedSectionBlock>
  );
};

export default MainFeedSection;
