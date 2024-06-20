import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { fetchAllFeed } from "@/store/feed";
import { AiFillMessage } from "react-icons/ai";
import { IoMdCloseCircle } from "react-icons/io";
import LikeButton from "@/components/list/LikeButton";
import axios from "axios";
import { MdPlace } from "react-icons/md";

const serverUrl = import.meta.env.VITE_API_URL;

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
  position: relative;
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
  position: relative; /* Added position relative */
`;

const Modal = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  top: ${(props) => (props.show === "true" ? "50%" : "100%")};
  padding: 20px;
  width: 100%;
  max-width: 600px;
  height: auto;
  background: #fff;
  box-shadow: -2px 0 15px rgba(0, 0, 0, 0.5);
  transition: top 0.5s ease-in-out;
  z-index: 10000;
  border-radius: 10px;
`;

const ModalContent = styled.div`
  position: relative;
  padding: 10px;
  button {
    right: 10px;
    position: absolute;
    font-size: 25px;
  }
  .postcontent {
    margin: 20px 0px;
    font-weight: bold;
    }
    p {
      margin: 20px 0px;
      font-size:12px;
      font-weight: 100;
      .error{
        color:red;
      }
  }
`;

const LocationWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  display: ${(props) => (props.show ? "block" : "none")};
  p {
    text-align: left;
  }
  .weatherwrap {
    display: flex;
    align-items: center;
  }
`;

const MainFeedSection = ({ filter }) => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const { feeds, loading, error } = useSelector((state) => state.feeds);
  const user = useSelector((state) => state.members.user);

  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [mycomment, setMyComment] = useState("");
  const [comments, setComments] = useState([]);


  const openModal = (index) => {
    setCurrentPost(feeds[index]);
    setShowModal(true);
    fetchComments(feeds[index].postId);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentPost(null);
  };

  // 텍스트박스 변경 핸들러
  const handleInputChange = (event) => {
    setMyComment(event.target.value);
  };

  // 엔터 키 핸들러
  const handleEnterPress = (event) => {
    if (event.key === "Enter") {
      setComments((prevComments) => [...prevComments, mycomment]);
      saveComment(currentPost.postId, user.userNo, mycomment);
      console.log("엔터", currentPost.postId, mycomment, user.userNo);
      setMyComment("");
    }
  };

  const saveComment = (postId, userNo, comment) => {
    console.log("댓글 저장 요청을 보냈습니다.");
    axios
      .post(
        `${serverUrl}/other/post/comment`,
        {
          postId: postId,
          comment: comment,
          userNo: userNo,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("댓글이 저장되었습니다.", response.data);
      })
      .catch((error) => {
        console.error("댓글 저장 실패:", error.response);
      });
  };

  // post마다 저장된 해당comment를 불러오는 기능필요 / 저장된post이외에 모든 post에 comment가 보이고, 새로고침하면 사라짐.(서버에는 있음)
  // const fetchComments = async (postId) => {
  //   try {
  //     const response = await axios.get(`${serverUrl}/other/post/comments/${postId}`);
  //     setComments(response.data); // 댓글 데이터를 받아와 상태에 저장
  //   } catch (error) {
  //     console.error("댓글 불러오기 실패:", error);
  //     if (error.response) {
  //       console.error("서버 응답:", error.response.data);
  //     }
  //   }
  // };
  

  const [clickedImageIndex, setClickedImageIndex] = useState(null);
  const handleImageClick = (index) => {
    setClickedImageIndex(index === clickedImageIndex ? null : index);
  };

  useEffect(() => {
    if (filter.type === "all") {
      dispatch(fetchAllFeed());
    } else if (filter.type === "following") {
      dispatch(fetchAllFeed(filter));
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
    <>
      {!filteredFeeds || filteredFeeds.length === 0 ? (
        <div>피드가 없습니다.</div>
      ) : (
        <MainFeedSectionBlock>
          {filteredFeeds.map((post, index) => (
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

                <span
                  className="comment"
                  onClick={() => openModal(filteredFeeds.indexOf(post))}
                >
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
                        onClick={() => handleImageClick(index)}
                      >
                        <PostImage
                          className="postImage"
                          src={`${serverUrl}/uploads/${image.imageUrl}`}
                          alt={`Post ${post.postId} Image`}
                          style={{
                            display: "inline-block",
                          }}
                        />
                        {clickedImageIndex === index && (
                          <LocationWrap show>
                            <p>
                              <MdPlace /> {post.locationName}
                            </p>
                            <div className="weatherwrap">
                              <img
                                src={`https://openweathermap.org/img/wn/${post.weathericon}.png`}
                                alt="Weather Icon"
                              />{" "}
                              <p>{post.weatherInfo}</p>
                            </div>
                          </LocationWrap>
                        )}
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
                      width: "100%",
                      height: "400px",
                    }}
                    onClick={() => handleImageClick(index)}
                  >
                    <PostImage
                      src={`${serverUrl}/uploads/${image.imageUrl}`}
                      alt={`Post ${post.postId} Image`}
                      style={{
                        display: "inline-block",
                      }}
                    />
                    {clickedImageIndex === index && (
                      <LocationWrap show>
                        <p>
                          <MdPlace /> {post.locationName}
                        </p>
                        <div className="weatherwrap">
                          <img
                            src={`https://openweathermap.org/img/wn/${post.weathericon}.png`}
                            alt="Weather Icon"
                          />{" "}
                          <p>{post.weatherInfo}</p>
                        </div>
                      </LocationWrap>
                    )}
                  </SlideBlock>
                ))
              )}

              <LikeButton postId={post.postId} />

              <PostContent>
                <div className="hashtag"> {post.feedHashtags.join(" ")}</div>
                <div className="content">{post.content}</div>
              </PostContent>
              <PostFooter>
                {new Date(post.created_at).getTime() !==
                new Date(post.updated_at).getTime() ? (
                  <div>
                    {new Date(post.updated_at).toLocaleString()} 에 수정된
                    게시물입니다.
                  </div>
                ) : (
                  <div>
                    Posted at: {new Date(post.created_at).toLocaleString()}
                  </div>
                )}
              </PostFooter>
            </PostBlock>
          ))}
          {showModal && currentPost && (
            <Modal show={showModal.toString()}>
              <ModalContent>
                <button onClick={closeModal}>
                  <IoMdCloseCircle />
                </button>
                <div className="postcontent">
                  {currentPost.userNickname}&nbsp;:&nbsp;{currentPost.content}
                </div>
                <div
                  className="comments"
                  style={{ marginBottom: "10px", lineHeight: "2" }}
                >
                  {comments.map((comment, index) => (
                    <div key={index}>
                      {user.userNickname}&nbsp;:&nbsp;{comment}
                    </div>
                  ))}
                </div>
                <div className="mycomment">
                  <input
                    type="text"
                    value={mycomment}
                    onChange={handleInputChange}
                    onKeyPress={handleEnterPress}
                    placeholder="댓글을 입력하세요."
                    style={{
                      width: "100%",
                      padding: "10px",
                    }}
                  />
                  <p>post마다 저장된 comment를 불러오는 기능 필요함<br/><span className="error">오류- 댓글이 저장된 post이외에 모든 post에 comment(댓글)가 보이고,<br/>새로고침하면 모두 사라짐. (서버에는 있음)</span></p>
                </div>
              </ModalContent>
            </Modal>
          )}
        </MainFeedSectionBlock>
      )}
    </>
  );
};

export default MainFeedSection;