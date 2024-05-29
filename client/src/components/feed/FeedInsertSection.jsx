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
  }

  .images {
    display: flex;
    gap: 10px;

    img {
      width: 100px;
      height: 100px;
      object-fit: cover;
    }
  }
`;

const FeedInsertSection = () => {
  const user = useSelector((state) => state.members.user);
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [hashtags, setHashtags] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSave = async (isImmediate) => {
    const formData = new FormData();
    formData.append("userNo", user.userNo);
    formData.append("content", content);
    images.forEach((file) => {
      formData.append("images", file);
    });
    formData.append("hashtags", hashtags);

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
        handleSave(true); // Immediate post
      }}
    >
      <p>{user.userNo}</p>
      <textarea
        placeholder="피드 내용을 입력하세요..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
      />
      <div className="images">
        {Array.from(images).map((file, idx) => (
          <img key={idx} src={URL.createObjectURL(file)} alt="upload preview" />
        ))}
      </div>
      <input
        type="text"
        placeholder="해시태그를 입력하세요 (스페이스로 구분)"
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
      />
      <input
        type="datetime-local"
        value={scheduledAt}
        onChange={(e) => setScheduledAt(e.target.value)}
      />
      <button type="submit">포스팅</button>
      <button
        type="button"
        onClick={() => handleSave(false)} // Scheduled post
      >
        예약포스팅
      </button>
      <button type="button" onClick={handleBack}>
        뒤로가기
      </button>
    </FeedInsertSectionBlock>
  );
};

export default FeedInsertSection;
