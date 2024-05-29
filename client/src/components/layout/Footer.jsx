import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "@/store/member";

const FooterBlock = styled.div``;

const Footer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.members.user);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(userLogout());
    navigate("/");
  };

  return (
    <FooterBlock>
      {user ? (
        <div>
          <h2>푸터</h2>
          <p>로그인 됐음</p>
          <Link to="/personalpage">
            유저 개인 페이지로 이동({user.userNickname})
          </Link>
          <a href="#" onClick={handleLogout}>
            로그아웃
          </a>
        </div>
      ) : (
        <div>
          <h2>푸터</h2>
          <p>로그인안되어있음</p>
        </div>
      )}
    </FooterBlock>
  );
};

export default Footer;
