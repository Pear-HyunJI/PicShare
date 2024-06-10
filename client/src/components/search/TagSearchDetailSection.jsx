import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import LikeButton from "@/components/list/LikeButton";
import { MdPlace } from "react-icons/md";

const serverUrl = import.meta.env.VITE_API_URL;

const TagSearchDetailSectionBlock = styled.div`
  padding: 20px;
  position: relative;
  .top {
    .tag {
      margin: 10px 0;
      display: flex;
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
  .slidesection {
    .slick-dots {
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translate(-50%);
      li {
        display: inline-block;
        padding: 0 3.5px;
        button {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #e0e0e0;
          text-indent: -9999px;
          overflow: hidden;
        }
        &.slick-active {
          button {
            width: 12px;
            height: 12px;
            background: #09dd52;
          }
        }
      }
    }
  }
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

const PostContent = styled.div`
  margin: 10px 10px;
  .hashtag {
    font-size: 18px;
  }
  .content {
    margin: 10px 0 25px;
  }
`;

const PostFooter = styled.div`
  margin: 0 10px;
`;

const SlideBlock = styled.div`
  width: 100%;
  height: 500px;
  background-color: #ddd;
  display: flex;
  align-items: center;
  text-align: center;
`;

const PostImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  display: inline-block;
`;

const TagSearchDetailSection = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const location = useLocation();
  const { searchTerm, currentSlide, searchType } = location.state || ""; // 서치 결과 받아온거
  const allFeeds = useSelector((state) => state.feeds.feeds);

  // 검색 타입에 따라 필터링 로직 변경
  let filteredFeeds = [];
  if (searchType === "hashtag") {
    filteredFeeds = allFeeds.filter((feed) =>
      feed.feedHashtags.some((hashtag) =>
        hashtag.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  } else if (searchType === "location") {
    filteredFeeds = allFeeds.filter(
      (feed) =>
        (feed.locationName &&
          feed.locationName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (feed.weatherInfo &&
          feed.weatherInfo.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  const postIndex = filteredFeeds.findIndex(
    (feed) => feed.postId === parseInt(postId)
  );
  const postsToDisplay = filteredFeeds.slice(postIndex);

  const handleBack = () => {
    navigate(-1, { state: { currentSlide } });
  };

  const sliderSettings = {
    dots: true,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <TagSearchDetailSectionBlock>
      <div className="top">
        <div className="tag">
          <button onClick={handleBack}>
            <IoIosArrowBack />
          </button>
          {searchType === "hashtag" ? (
            <h2>#{searchTerm}</h2>
          ) : (
            <h2>
              <MdPlace />
              {searchTerm}
            </h2>
          )}
          {/* <h2>#{searchTerm}</h2> */}
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
                src={`${serverUrl}/uploads/${post.profilePicture}`}
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
          {post.feedImages && post.feedImages.length > 1 ? (
            <div className="slidesection">
              <Slider {...sliderSettings}>
                {post.feedImages.map((image) => (
                  <SlideBlock
                    key={image.imageId}
                    className="slideBlock"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <PostImage
                      className="postImage"
                      src={`${serverUrl}/uploads/${image.imageUrl}`}
                      alt={`Post ${post.postId} Image`}
                      style={{
                        display: "inline-block",
                      }}
                    />
                  </SlideBlock>
                ))}
              </Slider>
            </div>
          ) : (
            post.feedImages &&
            post.feedImages.map((image) => (
              <SlideBlock
                key={image.imageId}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <PostImage
                  src={`${serverUrl}/uploads/${image.imageUrl}`}
                  alt={`Post ${post.postId} Image`}
                  style={{
                    display: "inline-block",
                  }}
                />
              </SlideBlock>
            ))
          )}
          <LikeButton postId={post.postId} />
          <PostContent>
            <div className="hashtag"> {post.feedHashtags.join(" ")}</div>
            <div className="content">{post.content}</div>
          </PostContent>
          <PostFooter>
            <div>Posted at: {new Date(post.created_at).toLocaleString()}</div>
          </PostFooter>
        </PostBlock>
      ))}
    </TagSearchDetailSectionBlock>
  );
};

export default TagSearchDetailSection;
