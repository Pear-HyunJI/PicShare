import React from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";

const HeaderBlock = styled.div``;

const Header = () => {
  return (
    <HeaderBlock>
      <h1>헤더!!</h1>
      <div>
        <Link to='/join'>회원가입</Link>
      </div>
    </HeaderBlock>
  );
};

export default Header;
