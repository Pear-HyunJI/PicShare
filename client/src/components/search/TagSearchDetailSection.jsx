import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

const TagSearchDetailSectionBlock = styled.div`
  padding: 20px;
  .top {
    .tag {
      margin: 10px 0;
      display: flex;
      // justify-content: space-between;
      align-items: center;
      gap: 10px;
      margin: 20px 0 30px;
      color: #0d0d0d;
      h2 {
        flex: 0 0 90%;
        text-align: center;
        align-items: center;
      }
      button {
        background: none;
        border: none;
        color: black;
        font-size: 30px;
        font-weight: bold;
      }
    }
    .num {
      flex: 0 0 10%;
      text-align: center;
      align-items: center;
      margin: 0 0 50px;
    }
  }
`;

const PostBlock = styled.div`
  border: 1px solid #ddd;
  margin-bottom: 20px;
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
  // overflow: hidden;
  overflow-x: auto;
  img {
    width: 50%;
    object-fit: cover;
  }
`;

const PostContent = styled.div`
  margin-top: 10px;
`;

const PostFooter = styled.div`
  margin-top: 10px;
  color: gray;
`;

const TagSearchDetailSection = () => {
  const navigate = useNavigate();

  const { postId } = useParams();
  const location = useLocation();
  const { searchTerm, currentSlide } = location.state || ""; // 서치 결과 받아온거
  const allFeeds = useSelector((state) => state.feeds.feeds);

  const filteredFeeds = allFeeds.filter((feed) =>
    feed.feedHashtags.some((hashtag) =>
      hashtag.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const postIndex = filteredFeeds.findIndex(
    (feed) => feed.postId === parseInt(postId)
  );
  const postsToDisplay = filteredFeeds.slice(postIndex);

  console.log("필터드피드~", filteredFeeds);
  console.log("서치텀~", postsToDisplay);

  const handleBack = () => {
    navigate(-1, { state: { currentSlide } });
  };

  return (
    <TagSearchDetailSectionBlock>
      <div className="top">
        <div className="tag">
          <button onClick={handleBack}>
            <IoIosArrowBack />
          </button>
          <h2>#{searchTerm}</h2>
        </div>
        <div className="num">
          <span>게시물{postsToDisplay.length}개</span>
        </div>
      </div>
      {postsToDisplay.map((post) => (
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
                <img
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
    </TagSearchDetailSectionBlock>
  );
};

export default TagSearchDetailSection;
