import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useSelector } from "react-redux";

const FeedInsertSectionBlock = styled.form`
  max-width: 600px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;

  input,
  textarea,
  button {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  textarea {
    resize: none;
    height: 150px;
  }

  .image-upload-section {
    display: flex;
    gap: 10px;

    .images {
      border: 1px solid #ccc;
      border-radius: 5px;
      width: 300px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 100px;
        height: 100px;
        object-fit: cover;
      }

      span {
        font-size: 12px;
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
    gap: 5px;

    .hashtag {
      display: flex;
      align-items: center;
      gap: 5px;

      input {
        width: 200px;
      }

      button {
        background-color: #ccc;
        border: none;
        cursor: pointer;
        padding: 5px 10px;
      }
    }
  }

  .scheduled-section {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const FeedInsertSection = () => {
  const user = useSelector((state) => state.members.user);
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [hashtags, setHashtags] = useState([""]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
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

  const handleSave = async (isImmediate) => {
    const formData = new FormData();
    formData.append("userNo", user.userNo);
    formData.append("content", content);
    images.forEach((file) => {
      formData.append("images", file);
    });
    formData.append("hashtags", hashtags.join(" "));

    if (!isImmediate) {
      formData.append("scheduled_at", scheduledAt || null);
    }

    try {
      await axios.post("http://localhost:8001/feed/insert", formData, {
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
    const confirmSave = window.confirm("임시저장하시겠어요?");
    if (confirmSave) {
      handleSave();
    } else {
      navigate(-1);
    }
  };

  return (
    <FeedInsertSectionBlock
      onSubmit={(e) => {
        e.preventDefault();
        handleSave(!isScheduled); // Immediate post if not scheduled
      }}
    >
      <p>{user.userNo}</p>
      <div className="image-upload-section">
        <div className="images">
          {images.length > 0 ? (
            images.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt="upload preview"
              />
            ))
          ) : (
            <span>Photo</span>
          )}
        </div>
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
          </div>
        ))}
        <button type="button" onClick={handleAddHashtag}>
          +
        </button>
      </div>
      <div className="scheduled-section">
        <label>
          <input
            type="checkbox"
            checked={isScheduled}
            onChange={() => setIsScheduled(!isScheduled)}
          />
          예약포스팅
        </label>
        {isScheduled && (
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        )}
      </div>
      <button type="submit">포스팅</button>
      <button type="button" onClick={handleBack}>
        뒤로가기
      </button>
    </FeedInsertSectionBlock>
  );
};

export default FeedInsertSection;
