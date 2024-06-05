import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

const LikeListBlock = styled.div`
  padding: 20px;
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

const LikeList = () => {
  const [likeList, setLikeList] = useState([]);
  const user = useSelector((state) => state.members.user);

  useEffect(() => {
    if (user) {
      axios
        .post("http://localhost:8001/other/post/likeList", {
          userNo: user.userNo,
        })
        .then((res) => {
          if (res.data) {
            // 이미지 URL을 배열로 변환
            const postsWithImages = res.data.map((post) => ({
              ...post,
              imageUrls: post.imageUrls ? post.imageUrls.split(",") : [],
            }));
            setLikeList(postsWithImages);
            console.log("라이크리스트", likeList);
            console.log("라이크리스트", postsWithImages);
          } else {
            console.log("좋아요 데이터를 가져오는데 실패했습니다.");
          }
        })
        .catch((error) => {
          console.error("좋아요 데이터를 가져오는 중 오류 발생:", error);
        });
    }
    console.log("라이크리스트", likeList);
  }, [user]);

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
                  alt={`Post ${post.postId} Image`}
                  style={{
                    display: "inline-block",
                  }}
                />
              </SlideBlock>
            ))
          )}
          <PostContent>
            <div className="hashtag"> {post.hashtags.replace(/,/g, " ")}</div>
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
