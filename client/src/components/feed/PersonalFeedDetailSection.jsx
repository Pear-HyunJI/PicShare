import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { IoIosArrowBack } from "react-icons/io";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { IoMdMore } from "react-icons/io";
import { fetchAllFeed } from "@/store/feed";
import axios from "axios";
import LikeButton from "@/components/list/LikeButton";

const serverUrl = import.meta.env.VITE_API_URL;

const PersonalFeedDetailSectionBlock = styled.div`
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
  position: relative;
  // .like {
  //   position: absolute;
  //   right:"55px";
  //   color: #f00;
  //   cursor: pointer;
  //   z-index: 9999;
  //   font-size: 25px;
  // }
  .addfunction {
    top: 2px;
    position: absolute;
    right: 3px;
    cursor: pointer;
    z-index: 9999;
    font-size: 35px;
  }
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

const EditDeleteButtons = styled.div`
  z-index: 1000;
  position: absolute;
  top: 40px;
  right: 3px;
  display: flex;
  flex-direction: column;
  button {
    margin: 2px 0;
    padding: 5px 10px;
    background: #09dd52;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background: #07b345;
    }
  }
`;

const PersonalFeedDetailSection = () => {
  const { postId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { filteredFeeds } = location.state || { filteredFeeds: [] };
  const [showEditDelete, setShowEditDelete] = useState({});
  const user = useSelector((state) => state.members.user);

  const postIndex = filteredFeeds.findIndex(
    (feed) => feed.postId === parseInt(postId)
  );
  const postsToDisplay = filteredFeeds.slice(postIndex);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleEditDelete = (postId) => {
    setShowEditDelete((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleDelete = (postId) => {
    console.log("삭제 포스트아이디", postId);
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (confirmDelete) {
      axios
        .delete(`${serverUrl}/feed/delete`, { params: { postId } })
        .then((res) => {
          if (res.data === "포스트 및 관련 데이터 삭제 완료") {
            console.log(res.data);
            dispatch(fetchAllFeed());
            navigate(-1);
          } else {
            alert("삭제하지 못했습니다.");
            return;
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const sliderSettings = {
    dots: true,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  if (!filteredFeeds.length) return <div>Loading...</div>;
  return (
    <PersonalFeedDetailSectionBlock>
      <div className="top">
        <div className="tag">
          <button onClick={handleBack}>
            <IoIosArrowBack />
          </button>
          <h2>내 게시글</h2>
        </div>
        <div className="num">
          <span>게시물 {postsToDisplay.length}개</span>
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
            {user.userNo === post.userNo && (
              <div>
                <span
                  className="addfunction"
                  onClick={() => toggleEditDelete(post.postId)}
                >
                  <IoMdMore />
                </span>
                {showEditDelete[post.postId] && (
                  <EditDeleteButtons>
                    <Link to={`/feedupdate/${post.postId}`}>
                      <button>수정</button>
                    </Link>
                    <button onClick={() => handleDelete(post.postId)}>
                      삭제
                    </button>
                  </EditDeleteButtons>
                )}
              </div>
            )}
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
    </PersonalFeedDetailSectionBlock>
  );
};

export default PersonalFeedDetailSection;
