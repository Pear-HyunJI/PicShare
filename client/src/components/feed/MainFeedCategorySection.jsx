import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { fetchFollowingList } from "@/store/follow"; // 팔로잉 리스트 가져오는 액션 추가

const MainFeedCategorySectionBlock = styled.div`
  display: flex;
  justify-content: center;
  margin: 40px 0px;
  button {
    margin: 0 10px;
    padding: 10px 20px;
    cursor: pointer;
    border: 1px solid;
    background-color: #09dd52;
    color: white;
    border-radius: 5px;

    &:hover {
      background-color: #09bd52;
    }

    &.on {
      background: #09bd52;
    }
  }
`;

const MainFeedCategorySection = ({ setFilter, filter }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.members.user);

  const handleFilterClick = async (filterType) => {
    if (filterType === "all") {
      setFilter({ type: "all" });
    } else if (filterType === "following" && currentUser) {
      try {
        const response = await dispatch(fetchFollowingList(currentUser.userNo));
        console.log("팔로잉피드 누렀을대 결과", response);
        console.log(
          "팔로잉피드 눌렀을대 패치팔로잉리스트에 가져오는 유저넘버만!",
          response.map((user) => user.userNo)
        );
        const followingUserNos = response.map((user) => user.userNo);
        setFilter({ type: "following", userNos: followingUserNos });
        // {type: "following", userNos: [10],[11]}
        console.log("셋필터보내줌", followingUserNos);
      } catch (error) {
        console.error("팔로잉 필터 실패:", error);
      }
    }
  };

  return (
    <MainFeedCategorySectionBlock>
      <button
        onClick={() => handleFilterClick("all")}
        className={filter.type == "all" && "on"}
      >
        All
      </button>
      <button
        onClick={() => handleFilterClick("following")}
        className={filter.type == "following" && "on"}
      >
        Following Feed
      </button>
    </MainFeedCategorySectionBlock>
  );
};

export default MainFeedCategorySection;
