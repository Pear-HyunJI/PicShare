import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import axios from "axios";
import profileIMG from "@/assets/images/profileIMG.jpg";

const ProfileModifySectionBlock = styled.div`
  margin: 100px;

  .setting {
    text-align: center;
    margin-bottom: 70px;
    font-size: 30px;
  }

  .profile {
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      border-radius: 50%;
    }

    a {
      font-size: 30px;
      color: gray;
    }
  }

  .btn {
    margin: 50px auto;

    button {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin: 30px auto;
      width: 60%;
      background: #ddd;
      color: #000;
      border-radius: 10px;
      padding: 15px;

      &:hover {
        background-color: #aaa;
        color: #fff;
      }

      img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
    }
  }
`;

const ProfileModifySection = () => {
  const [photoUrl, setPhotoUrl] = useState(""); 

  // 파일이 선택되면 실행되는 함수
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await axios.post("http://localhost:8001/uploads", formData); 
      const imageUrl = response.data.imageUrl; 
      setPhotoUrl(imageUrl); 
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // 닉네임 변경 등의 로직 추가
  };

  const handleButtonClick = () => {
    document.getElementById("photo").click();
  };

  return (
    <ProfileModifySectionBlock>
      <form onSubmit={onSubmit}>
        <div>
          <p className="setting">프로필 설정</p>
          <div className="profile">
            {photoUrl && <img src={photoUrl} alt="프로필사진" />}
            <p>게시물</p>
            <p>팔로워</p>
            <p>팔로잉</p>
            <Link to="/personalpage">
              <FiUpload />
            </Link>
          </div>
        </div>
        <div className="btn">
          <label htmlFor="photo" onClick={handleButtonClick}>
            <button type="button">프로필 사진 변경</button>
          </label>
          <input
            type="file"
            name="photo"
            id="photo"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button type="submit">닉네임 변경</button>
        </div>
      </form>
    </ProfileModifySectionBlock>
  );
};

export default ProfileModifySection;



