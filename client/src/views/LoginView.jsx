import React from "react";
import LoginSection from "@/components/member/LoginSection";
import styled from "styled-components";

const LoginViewBlock = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  .loginViewWrapper {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
  }
`;

const LoginView = () => {
  return (
    <LoginViewBlock>
      <div className="loginViewWrapper">
        <LoginSection />
      </div>
    </LoginViewBlock>
  );
};

export default LoginView;
