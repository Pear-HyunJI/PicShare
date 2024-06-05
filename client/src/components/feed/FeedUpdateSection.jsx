import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { IoIosArrowBack } from "react-icons/io";
import { fetchPostByPostid, updateFeed } from "@/store/feed";

const FeedUpdateSectionBlock = styled.form`
  max-width: 600px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;

  input,
  textarea,
  button {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    background: #ccc;
    color: #fff;
    border-radius: 10px;
    &:hover {
      background: gray;
    }
  }

  textarea {
    resize: none;
    height: 150px;
  }

  .top {
    margin: 10px 0;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin: 20px 0 30px;
    color: #0d0d0d;
    h2 {
      flex: 0 0 80%;
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

  .image-upload-section {
    display: flex;
    gap: 10px;

    .images {
      width: 380px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        padding: 4px;
      }

      span {
        font-size: 20px;
        color: #aaa;
      }
    }

    input {
      flex: 1;
    }
  }

  .hashtags {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 5px;
    margin: 20px 0;
    font-size: 20px;
    font-weight: bold;
    .hashtag {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;

      input {
        width: 200px;
      }

      button {
        background-color: #ccc;
        border: none;
        cursor: pointer;
        padding: 10px 13px;
      }
    }
  }

  .scheduled-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 20px 0;

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      input[type="checkbox"] {
        display: none;
      }
    }

    .datetime-input {
      width: 100%;
    }
  }
`;

const FeedUpdateSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { postId } = useParams();
  const user = useSelector((state) => state.members.user);
  const post = useSelector((state) =>
    state.feeds.feeds.find((feed) => feed.postId === parseInt(postId))
  );

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [hashtags, setHashtags] = useState([""]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);

  useEffect(() => {
    if (post) {
      setContent(post.content);
      setImages(post.feedImages || []);
      setHashtags(post.feedHashtags || [""]);
      setScheduledAt(post.scheduled_at || "");
      setIsScheduled(!!post.scheduled_at);
    }
  }, [post]);

  useEffect(() => {
    if (!post) {
      dispatch(fetchPostByPostid(postId));
    }
  }, [dispatch, postId, post]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setImages(files);
  };

  const handleHashtagChange = (index, value) => {
    const newHashtags = [...hashtags];
    newHashtags[index] = value;
    setHashtags(newHashtags);
  };

  const handleAddHashtag = () => {
    setHashtags([...hashtags, ""]);
  };

  const handleRemoveHashtag = (index) => {
    const newHashtags = [...hashtags];
    newHashtags.splice(index, 1);
    setHashtags(newHashtags);
  };

  const handleSave = async (isImmediate) => {
    const formData = new FormData();
    formData.append("userNo", user.userNo);
    formData.append("content", content);
    newImages.forEach((file) => {
      formData.append("images", file);
    });
    formData.append("hashtags", hashtags.join(" "));

    if (!isImmediate) {
      formData.append("scheduled_at", scheduledAt || null);
    }

    try {
      await axios.put(`http://localhost:8001/feed/update/${postId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/feed");
    } catch (err) {
      console.error(err);
    }
  };

  const handleBack = () => {
    const confirmSave = window.confirm("변경 사항을 저장하시겠습니까?");
    if (confirmSave) {
      handleSave();
    } else {
      navigate(-1);
    }
  };

  return (
    <div>
      <FeedUpdateSectionBlock
        onSubmit={(e) => {
          e.preventDefault();
          if (newImages.length > 0 || images.length > 0) {
            handleSave(!isScheduled); // 예약되지 않은 경우 바로 포스트함
          } else {
            alert("이미지를 하나 이상 업로드해주세요.");
          }
        }}
      >
        <div className="top">
          <button type="button" onClick={handleBack}>
            <IoIosArrowBack />
          </button>
          <h2>게시물 수정</h2>
        </div>
        <div className="image-upload-section">
          {images.length > 0 ? (
            <div className="images">
              {images.slice(0, 3).map((image, idx) => (
                <img key={idx} src={image.imageUrl} alt="upload preview" />
              ))}
              {images.length > 3 && <span>+{images.length - 3} more</span>}
            </div>
          ) : (
            <div
              className="images"
              style={{ border: "1px solid #ccc", borderRadius: "5px" }}
            >
              <p>photo</p>
            </div>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <textarea
          placeholder="피드 내용을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="hashtags">
          {hashtags.map((hashtag, idx) => (
            <div className="hashtag" key={idx}>
              <span>#</span>
              <input
                type="text"
                placeholder={`${idx + 1}번째 해시태그를 입력하세요`}
                value={hashtag}
                onChange={(e) => handleHashtagChange(idx, e.target.value)}
              />
              {idx === hashtags.length - 1 && (
                <>
                  <button type="button" onClick={handleAddHashtag}>
                    +
                  </button>
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHashtag(idx)}
                    >
                      -
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="date-picker">
          <label>
            <input
              type="checkbox"
              checked={isScheduled}
              onChange={() => setIsScheduled(!isScheduled)}
            />
            예약 포스팅
          </label>
          {isScheduled && (
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          )}
        </div>
        <div className="buttons">
          <button type="submit">수정</button>
          <button type="button" onClick={() => handleSave(!isScheduled)}>
            {isScheduled ? "예약 취소" : "바로 포스팅"}
          </button>
        </div>
      </FeedUpdateSectionBlock>
    </div>
  );
};

export default FeedUpdateSection;
