import React from "react";
import styled from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import FollowButton from "@/components/follow/FollowButton";
import { IoIosArrowBack } from "react-icons/io";

const FollowingListSectionBlock = styled.div`
  .top {
    .tag {
      margin: 10px 0;
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 20px 0 30px;
      color: #0d0d0d;
      h2 {
        flex: 0 0 90%;
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
    .num {
      flex: 0 0 10%;
      text-align: center;
      align-items: center;
      margin: 0 0 50px;
    }
  }
`;

const FollowingList = styled.div``;

const FollowingListSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { following } = location.state || { following: [] };

  console.log("팔로잉페이지의 팔로잉", following);

  const handleBack = () => {
    navigate(-1);
  };

  if (!following.length) return <div>Loading...</div>;
  return (
    <FollowingListSectionBlock>
      <div className="top">
        <div className="tag">
          <button onClick={handleBack}>
            <IoIosArrowBack />
          </button>
          <h2>팔로잉리스트</h2>
        </div>
        <div className="num">
          <span>팔로잉 {following.length}명</span>
        </div>
      </div>
      {following.map((user) => (
        <FollowingList key={user.userNo}>
          <Link to={`/personalpage/${user.userNo}`} className="imageBox">
            <img
              src={`http://localhost:8001/uploads/${user.profilePicture}`}
              alt={user.userNickname}
            />
            <span>@{user.userNickname}</span>
          </Link>
          <FollowButton userNo={user.userNo} />
        </FollowingList>
      ))}
    </FollowingListSectionBlock>
  );
};

export default FollowingListSection;
