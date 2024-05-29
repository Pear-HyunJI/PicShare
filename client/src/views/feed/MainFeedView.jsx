import React from "react";
import styled from "styled-components";
import MainFeedSection from "@/components/feed/MainFeedSection";

const MainFeedViewBlock = styled.div``;

const MainFeedView = () => {
  return (
    <MainFeedViewBlock>
      <MainFeedSection />
    </MainFeedViewBlock>
  );
};

export default MainFeedView;
