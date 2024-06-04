import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchFollowingList, fetchFollowerList } from "@/store/follow";

const FollowButtonBlock = styled.div`
  button {
    padding: 7px 18px;
    cursor: pointer;
    border: none;
    background-color: #09dd52;
    color: white;
    border-radius: 5px;
  }
`;

const FollowButton = ({ userNo }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.members.user);
  const followingList = useSelector((state) => state.follows.followingList);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (followingList && followingList.length > 0) {
      setIsFollowing(
        followingList.some((followee) => followee.userNo === userNo)
      );
    }
  }, [followingList, userNo]);

  const handleFollow = async () => {
    try {
      await axios.post("http://localhost:8001/follow/followfunction", {
        followerId: currentUser.userNo,
        followeeId: userNo,
      });
      dispatch(fetchFollowingList(currentUser.userNo)); // 팔로잉 목록 업데이트
      dispatch(fetchFollowerList(currentUser.userNo)); // 팔로워 목록 업데이트
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.post("http://localhost:8001/follow/unfollowfunction", {
        followerId: currentUser.userNo,
        followeeId: userNo,
      });
      dispatch(fetchFollowingList(currentUser.userNo)); // 팔로잉 목록 업데이트
      dispatch(fetchFollowerList(currentUser.userNo)); // 팔로워 목록 업데이트
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <FollowButtonBlock>
      <button onClick={isFollowing ? handleUnfollow : handleFollow}>
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    </FollowButtonBlock>
  );
};

export default FollowButton;
