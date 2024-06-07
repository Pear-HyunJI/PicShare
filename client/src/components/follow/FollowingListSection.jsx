import React from "react";
import styled from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import FollowButton from "@/components/follow/FollowButton";
import { IoIosArrowBack } from "react-icons/io";

const serverUrl = import.meta.env.VITE_API_URL;

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
  .followingListWrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .empty {
    padding: 50px 20px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
  }
`;

const FollowingList = styled.div`
  flex: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;

  margin: 20px 10px 30px;
  .imageBox {
    display: flex;
    align-items: center;
    margin-right: 10px;
    flex: 50%;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
`;

const FollowingListSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { following } = location.state || { following: [] };

  console.log("팔로잉페이지의 팔로잉", following);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <FollowingListSectionBlock>
      <div className="top">
        <div className="tag">
          <button onClick={handleBack}>
            <IoIosArrowBack />
          </button>
          <h2>팔로잉 목록</h2>
        </div>
        <div className="num">
          {!following.length ? (
            <span>팔로잉 0 명</span>
          ) : (
            <span>팔로잉 {following.length}명</span>
          )}
        </div>
      </div>
      {!following.length ? (
        <div className="empty">
          <p>아직 팔로잉한 사람이 없습니다.</p>
          <p>새로운 사람들을 팔로우하고 소식을 받아보세요!</p>
        </div>
      ) : (
        <div className="followingListWrap">
          {following.map((user) => (
            <FollowingList key={user.userNo}>
              <Link to={`/personalpage/${user.userNo}`} className="imageBox">
                <img
                  src={`${serverUrl}/uploads/${user.profilePicture}`}
                  alt={user.userNickname}
                />
                <span>@{user.userNickname}</span>
              </Link>
              <FollowButton userNo={user.userNo} />
            </FollowingList>
          ))}
        </div>
      )}
    </FollowingListSectionBlock>
  );
};

export default FollowingListSection;
