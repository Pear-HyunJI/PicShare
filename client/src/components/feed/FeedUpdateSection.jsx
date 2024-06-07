import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useSelector } from "react-redux";
import { IoIosArrowBack } from "react-icons/io";

const serverUrl = import.meta.env.VITE_API_URL;

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

  .hashtags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin: 20px 0;
    font-size: 20px;
    font-weight: bold;

    span {
      background-color: #ccc;
      border-radius: 5px;
      padding: 5px 10px;
    }
  }
`;

const FeedUpdateSection = () => {
  const user = useSelector((state) => state.members.user);
  const navigate = useNavigate();
  const { postId } = useParams();
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState([]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/feed/postbypostid`,
          {
            params: { postId },
          }
        );
        const post = response.data;
        setContent(post.content);
        setHashtags(post.hashtags);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPostData();
  }, [postId]);

  const handleSave = async () => {
    try {
      await axios.put(`${serverUrl}/feed/update/${postId}`, {
        content,
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
    <div>
      <FeedUpdateSectionBlock
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="top">
          <button type="button" onClick={handleBack}>
            <IoIosArrowBack />
          </button>
          <h2>게시물 수정</h2>
        </div>
        <textarea
          placeholder="피드 내용을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="hashtags">
          {hashtags.map((hashtag, idx) => (
            <span key={idx}>#{hashtag}</span>
          ))}
        </div>
        <button type="submit">수정</button>
      </FeedUpdateSectionBlock>
    </div>
  );
};

export default FeedUpdateSection;
