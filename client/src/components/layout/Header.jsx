import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logo from "../../assets/images/PicShare.png";

const HeaderBlock = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  .logo {
    max-width: 250px;
  }
  .menu {
    display: flex;
    justify-content: space- between;

    align-items: center;
    p {
      padding-left: 20px;
    }
  }
`;

const Header = () => {
  return (
    <HeaderBlock>
      <div className="logo">
        <img src={logo} alt="로고" />
      </div>
      <div className="menu">
        <p>좋아요한 피드목록</p>
        <p>다이렉트 메세지</p>
      </div>
    </HeaderBlock>
  );
};

export default Header;
