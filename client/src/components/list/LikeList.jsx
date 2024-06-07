import React, { useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { fetchLikeList } from "@/store/like";
import LikeButton from "@/components/list/LikeButton";

const serverUrl = import.meta.env.VITE_API_URL;

const LikeListBlock = styled.div`
  padding: 20px;
  position: relative;
  .top {
    h2 {
      margin-bottom: 10px;
      background: #eee;
      color: gray;
      padding: 10px;
      font-weight: 500;
      font-size: 18px;
      border-radius: 5px;
    }
    .num {
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
  .like {
    margin-top: 30px;
    position: absolute;
    left: 40px;
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
`;

const PostContent = styled.div`
  margin: 65px 10px;
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
  width: 50%;
  height: 250px;
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

const LikeList = () => {
  const dispatch = useDispatch();
  const likeList = useSelector((state) => state.likes.likeList);
  const user = useSelector((state) => state.members.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchLikeList(user.userNo));
      console.log("라이크리스트", likeList);
    }
  }, [user, dispatch]);

  const sliderSettings = {
    dots: true,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <LikeListBlock>
      <div className="top">
        <h2>
          <FaHeart />
          &nbsp;&nbsp;내가 좋아요한 게시물 목록
        </h2>
        <div className="num">
          <span>게시물 {likeList.length}개</span>
        </div>
      </div>
      {likeList.map((post) => (
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
          {post.imageUrls && post.imageUrls.length > 1 ? (
            <div className="slidesection">
              <Slider {...sliderSettings}>
                {post.imageUrls.map((image, index) => (
                  <SlideBlock
                    key={index}
                    className="slideBlock"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <PostImage
                      className="postImage"
                      src={image}
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
            post.imageUrls &&
            post.imageUrls.map((image, index) => (
              <SlideBlock
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <PostImage
                  src={image}
                  style={{
                    display: "inline-block",
                  }}
                  alt={`Post ${post.postId} Image`}
                />
              </SlideBlock>
            ))
          )}
          <LikeButton postId={post.postId} />
          <PostContent>
            <div className="hashtag">{post.hashtags.replace(/,/g, " ")}</div>
            <div className="content">{post.content}</div>
          </PostContent>
          <PostFooter>
            <div>Posted at: {new Date(post.created_at).toLocaleString()}</div>
          </PostFooter>
        </PostBlock>
      ))}
    </LikeListBlock>
  );
};

export default LikeList;
