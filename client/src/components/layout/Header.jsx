import React, { useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logo from "../../assets/images/PicShare.png";
import { FaHeart, FaRegHeart, FaSearch } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";

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
  }
`;

const Search = styled.div`
  font-size: 25px;
  margin-right: 5px;
  display: flex;
  justify-content: space- between;
  align-items: center;
  input {
    border: 1px solid #e8ecf2;
    font-size: 16px;
    padding: 10px 20px;
    max-width: 200px;
    margin-left: 10px;
  }
`;

const Like = styled.div`
  font-size: 30px;
  color: red;
  margin-left: 10px;
`;

const Dm = styled.div`
  font-size: 30px;
  margin-left: 10px;
`;

const Header = () => {
  return (
    <HeaderBlock>
      <Link to="/feed" className="logo">
        <img src={logo} alt="로고" />
      </Link>
      <div className="menu">
        <Search>
          <Link to="/usersearch">
            <FaSearch />
          </Link>
        </Search>
        <Like>
          <Link to="/">
            <FaHeart />
          </Link>
          {/* <FaRegHeart/> */}
        </Like>
        <Dm>
          <Link to="/">
            <AiFillMessage />
          </Link>
        </Dm>
      </div>
    </HeaderBlock>
  );
};

export default Header;
