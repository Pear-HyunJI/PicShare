import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import profileIMG from "@/assets/images/profileIMG.jpg";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import FollowButton from "../follow/FollowButton";

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
      border-radius:50%;
    }
    a {
      font-size: 30px;
      color:skyblue;
    }
  }
`


const ProfileModifySection = () => {
  return (
    <ProfileModifySectionBlock>
      <p className="setting">프로필 설정</p>
      <div className="profile">
      <img src={profileIMG} alt="프로필사진" />
      <p>게시물</p>
      <p>팔로워</p>
      <p>팔로잉</p>
      <Link to="/personalpage"><FaCheckCircle /></Link>
      </div>
      <div className="btn">
        {/* <FollowButton userId={currentUserId} followerId={targetUserId}/> */}
      </div>
    </ProfileModifySectionBlock>
  );
};

export default ProfileModifySection;
