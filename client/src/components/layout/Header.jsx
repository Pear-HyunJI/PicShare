import React from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";

const HeaderBlock = styled.div``;

const Header = () => {
  return (
    <HeaderBlock>
      <h1>헤더!!</h1>
      <div>
        <p>이메일</p>
        <p>비밀번호</p>
        <Link to='/join'>가입하기</Link>
      </div>
    </HeaderBlock>
  );
};

export default Header;
