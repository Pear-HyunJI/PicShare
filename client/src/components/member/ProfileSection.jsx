import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import axios from "axios";
import FollowButton from "../follow/FollowButton";
import { fetchFollowerList, fetchFollowingList } from "@/store/follow";

const serverUrl = import.meta.env.VITE_API_URL;

const ProfileSectionBlock = styled.div`
  margin: 100px 100px 80px 100px;
  .profile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom:15px;
    p {
      // margin:-50px;
    }
    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
    }
    .length {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
    }
  }
  .nickname {
    margin-left:50px;
    width: 100px;
  }
  .modify {
    margin-left:15px;
    width: 150px;
  }
`;

// url으로 보낸 번호로 유저정보 가져와야 할거 같음

const ProfileSection = ({ length }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userNo } = useParams(); // URL에서 유저넘버 추출
  const targetUserNo = parseInt(userNo); // URL에서 받아온 유저넘버
  const currentUser = useSelector((state) => state.members.user);
  const currentUserNo = currentUser.userNo;

  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  console.log("필터드피드스개수", length);

  useEffect(() => {
    if (currentUserNo) {
      dispatch(fetchFollowingList(currentUserNo));
    }
  }, [dispatch, currentUserNo]);

  useEffect(() => {
    const fetchTargetUserData = (targetUserNo) => {
      axios
        .get(`${serverUrl}/auth/users?targetUserNo=${targetUserNo}`)
        .then((res) => {
          const data = res.data;
          setUser(data);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    };

    fetchTargetUserData(targetUserNo);

    // 팔로워 목록 가져오기
    dispatch(fetchFollowerList(targetUserNo)).then((response) => {
      setFollowers(response);
    });

    console.log("팔로워 목록 가져오기", followers);

    // 팔로잉 목록 가져오기
    dispatch(fetchFollowingList(targetUserNo)).then((response) => {
      setFollowing(response);
    });

    console.log("팔로잉 목록 가져오기", following);
  }, [userNo, targetUserNo, dispatch]);

  // 팔로잉리스트 페이지로 이동
  const handleFollowingClick = (userNo) => {
    navigate(`/followinglist/${userNo}`, {
      state: { following },
    });
  };
  // 팔로워리스트 페이지로 이동
  const handleFollowerClick = (userNo) => {
    navigate(`/followerlist/${userNo}`, {
      state: { followers },
    });
  };

  if (loading)
    return (
      <div>
        {/* Loading...현재 페이지의 파라미터(타겟유저)는 {targetUserNo},
        currentUser는
        {currentUserNo} */}
        로딩중
      </div>
    );

  console.log("셋유저된 user", user);

  return (
    <ProfileSectionBlock>
      <div className="profile">
        <img
          src={`${serverUrl}/uploads/${user[0].profilePicture}`}
          alt="프로필사진"
        />
        <div className="length">
          <p>{length}</p>
          <p>게시물</p>
        </div>
        <div
          className="length"
          onClick={() => handleFollowerClick(user[0].userNo)}
        >
          <p>{followers.length || 0}</p>
          <p>팔로워</p>
        </div>
        <div
          className="length"
          onClick={() => handleFollowingClick(user[0].userNo)}
        >
          <p>{following.length || 0}</p>
          <p>팔로잉</p>
        </div>
      </div>
      <span className="nickname">{user[0].userNickname}</span>
      <span className="modify">
        {currentUserNo == targetUserNo && (
          <Link to="/profilemodify">
            <FaPen />
          </Link>
        )}
      </span>
      <div className="btn">
        {currentUserNo !== targetUserNo && (
          <FollowButton userNo={targetUserNo} />
        )}
      </div>
    </ProfileSectionBlock>
  );
};

export default ProfileSection;