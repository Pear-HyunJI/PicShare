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

  .images {
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 10px;
    .imagewrap {
      img {
        width: 200px;
        height: 200px;
        object-fit: cover;
      }
    }
    .lengthwrap {
      span {
        font-size: 20px;
        color: #aaa;
      }
    }
  }
`;

const FeedUpdateSection = () => {
  const user = useSelector((state) => state.members.user);
  const navigate = useNavigate();
  const { postId } = useParams();
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [photo, setPhoto] = useState([]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`${serverUrl}/feed/postbypostid`, {
          params: { postId },
        });
        const post = response.data;
        setContent(post.content);
        setHashtags(post.hashtags);
        setPhoto(post.images);
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
    handleSave();
    navigate(-1);
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
        <div className="images">
          <div className="imagewrap">
            {photo.slice(0, 3).map((file, idx) => (
              <img
                key={idx}
                src={`${serverUrl}/uploads/${file.imageUrl}`}
                alt="upload preview"
              />
            ))}
          </div>
          <div className="lengthwrap">
            {photo.length > 3 && <span>+{photo.length - 3} more</span>}
          </div>
        </div>
        <div className="hashtags">
          {hashtags.map((hashtag, idx) => (
            <span key={idx}>{hashtag}</span>
          ))}
        </div>
        <p>콘텐츠를 수정하시겠어요? 아래에 새로운 내용을 입력하세요:</p>
        <textarea
          placeholder="피드 내용을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button type="submit">수정</button>
      </FeedUpdateSectionBlock>
    </div>
  );
};

export default FeedUpdateSection;
