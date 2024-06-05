import React from "react";
import styled from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import FollowButton from "@/components/follow/FollowButton";
import { IoIosArrowBack } from "react-icons/io";

const FollowerListSectionBlock = styled.div`
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
  .followerListWrap {
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

const FollowerList = styled.div`
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

const FollowerListSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { followers } = location.state || { followers: [] };

  console.log("팔로워페이지의 팔로잉", followers);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <FollowerListSectionBlock>
      <div className="top">
        <div className="tag">
          <button onClick={handleBack}>
            <IoIosArrowBack />
          </button>
          <h2>팔로워 목록</h2>
        </div>
        <div className="num">
          {!followers.length ? (
            <span>팔로워 0 명</span>
          ) : (
            <span>팔로워 {followers.length}명</span>
          )}
        </div>
      </div>
      {!followers.length ? (
        <div className="empty">
          <p>당신을 팔로우하는 사람이 아직 없어요.</p>
          <p>멋진 컨텐츠를 공유해보세요!</p>
        </div>
      ) : (
        <div className="followerListWrap">
          {followers.map((user) => (
            <FollowerList key={user.userNo}>
              <Link to={`/personalpage/${user.userNo}`} className="imageBox">
                <img
                  src={`http://localhost:8001/uploads/${user.profilePicture}`}
                  alt={user.userNickname}
                />
                <span>@{user.userNickname}</span>
              </Link>
              <FollowButton userNo={user.userNo} />
            </FollowerList>
          ))}
        </div>
      )}
    </FollowerListSectionBlock>
  );
};

export default FollowerListSection;
