import React from "react";
import JoinSection from "@/components/member/JoinSection";
import styled from "styled-components";

const JoinViewBlock = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  .joinViewWrapper {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
  }
`;

const JoinView = () => {
  return (
    <JoinViewBlock>
      <div className="joinViewWrapper">
        <JoinSection />
      </div>
    </JoinViewBlock>
  );
};

export default JoinView;
