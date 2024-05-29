import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const ProfileSectionBlock = styled.div``;

const ProfileSection = () => {
  return (
    <ProfileSectionBlock>
      프로필사진, 팔로워, 팔로잉 <br />
      <Link to="/profilemodify">프로필수정</Link>
    </ProfileSectionBlock>
  );
};

export default ProfileSection;
