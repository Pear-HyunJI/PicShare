import React, { useState, useEffect } from "react";
import styled from "styled-components";
import MainFeedSection from "@/components/feed/MainFeedSection";
import MainFeedCategorySection from "@/components/feed/MainFeedCategorySection";

const MainFeedViewBlock = styled.div``;

const MainFeedView = () => {
  const [filter, setFilter] = useState({ type: "all" });

  // useEffect(console.log("팔로잉피드를 눌렀을대 보내주는 값은? ", filter));

  return (
    <MainFeedViewBlock>
      <MainFeedCategorySection setFilter={setFilter} />
      <MainFeedSection filter={filter} />
    </MainFeedViewBlock>
  );
};

export default MainFeedView;
