import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFeed } from "@/store/feed";

const MainFeedSectionBlock = styled.div`
  // .post {
  //   border: 1px solid #ddd;
  //   padding: 16px;
  //   margin: 16px 0;
  //   border-radius: 8px;
  // }

  // .post img {
  //   max-width: 100%;
  //   height: auto;
  //   display: block;
  //   margin: 8px 0;
  // }
`;

const MainFeedSection = () => {
  const dispatch = useDispatch();
  const { feeds, loading, error } = useSelector((state) => state.feeds);

  useEffect(() => {
    dispatch(fetchAllFeed());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <MainFeedSectionBlock>
      {feeds &&
        feeds.map((post) => (
          <div key={post.postId} className="post">
            <h3>{post.userNickname}</h3>
            <p>{post.content}</p>
            <img
              src={`http://localhost:8001/uploads/${post.profilePicture}`}
              alt={post.userNickname}
            />
            {post.feedImages &&
              post.feedImages.map((image) => (
                <img key={image.imageId} src={image.imageUrl} alt="" />
              ))}
            <p>Hashtags: {post.feedHashtags.join(", ")}</p>
            <p>Posted at: {new Date(post.created_at).toLocaleString()}</p>
          </div>
        ))}
      <p>메인피드</p>
    </MainFeedSectionBlock>
  );
};

export default MainFeedSection;
