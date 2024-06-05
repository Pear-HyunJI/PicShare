import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { fetchAllFeed } from "@/store/feed";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const MainFeedSectionBlock = styled.div`
  margin: 0 20px;
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
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
  .like {
    position: absolute;
    right: 10px;
    color: #f00;
    cursor: pointer;
    z-index: 9999;
    font-size: 25px;
  }
`;

const PostContent = styled.div`
  margin: 30px 10px;
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
  width: 100%;
  // height: ${({ height }) => height}px;
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

const MainFeedSection = ({ filter }) => {
  const dispatch = useDispatch();
  const { feeds, loading, error } = useSelector((state) => state.feeds);

  useEffect(() => {
    // 피드 데이터를 가져오는 로직
    if (filter.type === "all") {
      dispatch(fetchAllFeed());
    } else if (filter.type === "following") {
      dispatch(fetchAllFeed(filter));
    }
  }, [filter]);

  // 좋아요
  const user = useSelector((state) => state.members.user);
  const [hearts, setHearts] = useState([]);

  // 좋아요 데이터를 가져오는 로직
  useEffect(() => {
    if (user) {
      axios
        .post("http://localhost:8001/other/post/likeList", {
          userNo: user.userNo,
        })
        .then((res) => {
          if (res.data) {
            let initialHearts = res.data.map((post) => ({
              postId: post.postId,
              isLiked: post.isLiked,
            }));
            // const updatedHearts = initialHearts.map((heart) => {
            //   const dbHeart = res.data.find((item) => item.postId === heart.postId);
            //   return dbHeart ? { ...heart, isLiked: dbHeart.isLiked } : heart;
            // });
            setHearts(initialHearts);
          } else {
            console.log("좋아요 데이터를 가져오는데 실패했습니다.");
          }
        })
        .catch((error) => {
          console.error("좋아요 데이터를 가져오는 중 오류 발생:", error);
        });
    }
  }, [dispatch, user]);

  const onToggle = (postItem, index) => {
    if (user) {
      const updateHearts = hearts.map((heart) =>
        heart.postId === postItem.id
          ? { ...heart, isLiked: !heart.isLiked }
          : heart
      );
      setHearts(updateHearts);
      axios
        .post("http://localhost:8001/other/post/likeToggle", {
          post: postItem,
          userNo: user.userNo,
        })
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
              heart.postId === postItem.id
                ? { ...heart, isLiked: !heart.isLiked }
                : heart
            )
          );
        });
    } else {
      alert("로그인해 주세요.");
    }
  };

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
      {filteredFeeds.map((post, index) => {
        return (
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
              <span className="like" onClick={() => onToggle(post, index)}>
                {hearts.find((heart) => heart.postId === post.postId)
                  ?.isLiked ? (
                  <FaHeart />
                ) : (
                  <FaRegHeart />
                )}
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
            <PostContent>
              <div className="hashtag"> {post.feedHashtags.join(" ")}</div>
              <div className="content">{post.content}</div>
            </PostContent>
            <PostFooter>
              <div>Posted at: {new Date(post.created_at).toLocaleString()}</div>
            </PostFooter>
          </PostBlock>
        );
      })}
    </MainFeedSectionBlock>
  );
};

export default MainFeedSection;
