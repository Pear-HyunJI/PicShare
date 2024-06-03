import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import FollowButton from "../follow/FollowButton";



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
  const currentUserId = 1; // 로그인된 사용자 ID
  const targetUserId = 2; // 팔로우할 대상 사용자 ID

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);


  const user = useSelector((state) => state.members.user);


  useEffect(() => {
    // 사용자 ID를 하드코딩하거나 로그인 정보를 가져와서 사용함
    const userId = 1;

    axios.get(`/followers/${userId}`)
      .then(response => setFollowers(response.data))
      .catch(error => console.error('Error fetching followers:', error));

    // following도 비슷한 방식으로 fetch
    // axios.get(`/following/${userId}`)
    //   .then(response => setFollowing(response.data))
    //   .catch(error => console.error('Error fetching following:', error));
  }, []);


  return (
    <ProfileSectionBlock>
      <div className="profile">
      <img src={`http://localhost:8001/uploads/${user.profilePicture}`} alt="프로필사진" />
      <p>게시물</p>
      <p>팔로워</p>
      <p>팔로잉</p>
      <Link to="/profilemodify"><FaPen /></Link>
      </div>
      <div className="btn">
        <FollowButton userId={currentUserId} followerId={targetUserId}/>
      </div>
    </ProfileSectionBlock>
  );
};

export default ProfileSection;
