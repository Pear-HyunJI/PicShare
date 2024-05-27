import React from "react";
import styled from "styled-components";
import MainFeed from "@/components/feed/MainFeed";

const MainFeedViewBlock = styled.div``;

const MainFeedView = () => {
  return (
    <MainFeedViewBlock>
      <MainFeed />
    </MainFeedViewBlock>
  );
};

export default MainFeedView;
