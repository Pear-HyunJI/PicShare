import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import profileIMG from "@/assets/images/profileIMG.jpg";
import { FaPen } from "react-icons/fa";

const ProfileSectionBlock = styled.div`
margin: 100px;
  .profile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      // margin:-50px;
    }
    img {
      border-radius:50%;
    }
  }
`;

const ProfileSection = () => {
  return (
    <ProfileSectionBlock>
      <div className="profile">
      <img src={profileIMG} alt="프로필사진" />
      <p>게시물</p>
      <p>팔로워</p>
      <p>팔로잉</p>
      <Link to="/profilemodify"><FaPen /></Link>
      </div>
    </ProfileSectionBlock>
  );
};

export default ProfileSection;
