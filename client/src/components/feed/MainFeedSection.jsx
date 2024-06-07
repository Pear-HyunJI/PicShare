import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { fetchAllFeed } from "@/store/feed";
import { AiFillMessage } from "react-icons/ai";
import LikeButton from "@/components/list/LikeButton";
import { fetchLikeList } from "@/store/like";

const MainFeedSectionBlock = styled.div`
  margin: 0 20px;
  position: relative;
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
  .like {
    margin-top: 30px;
    position: absolute;
    left: 20px;
    color: #f00;
    cursor: pointer;
    z-index: 9999;
    font-size: 25px;
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
  position: relative;

  .comment {
    position: absolute;
    right: 10px;
    color: #000;
    cursor: pointer;
    z-index: 9999;
    font-size: 25px;
  }
`;

const PostContent = styled.div`
  margin: 70px 10px;
  .hashtag {
    font-size: 17px;
  }
  .content {
    margin: 10px 0;
  }
`;

const PostFooter = styled.div`
  margin: 0 10px;
`;

const SlideBlock = styled.div`
  width: 80%;
  height: 400px;
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

const MainFeedSection = ({ filter }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { feeds, loading, error } = useSelector((state) => state.feeds);
  const user = useSelector((state) => state.members.user);

  useEffect(() => {
    if (filter.type === "all") {
      dispatch(fetchAllFeed());
      // dispatch(fetchLikeList(user.userNo));
    } else if (filter.type === "following") {
      dispatch(fetchAllFeed(filter));
      // dispatch(fetchLikeList(user.userNo));
    }
  }, [filter, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const getCurrentTime = () => new Date();

  const filteredFeeds = feeds.filter((post) => {
    const createdAt = new Date(post.created_at);
    return createdAt <= getCurrentTime();
  });

  const sliderSettings = {
    dots: true,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <MainFeedSectionBlock>
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

            <span className="comment">
              <AiFillMessage />
            </span>
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
                      src={image.imageUrl}
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
                  width: "80%",
                  height: "400px",
                }}
              >
                <PostImage
                  src={image.imageUrl}
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
    </MainFeedSectionBlock>
  );
};

export default MainFeedSection;
