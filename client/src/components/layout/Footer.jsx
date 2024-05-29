import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "@/store/member";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";

const FooterBlock = styled.div`
  padding: 15px;
  .menu {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Loginout = styled.div`
  font-size: 30px;
  margin-left: 20px;
`;

const Upload = styled.div`
  font-size: 30px;
  margin-left: 20px;
`;

const Profile = styled.div`
  font-size: 30px;
  margin-left: 20px;
`;



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
        <div className="menu">
          {/* <h2>푸터</h2> */}
          <Loginout><a href="#" onClick={handleLogout}><FaUserCheck /></a></Loginout>
          <Upload><Link to="/feedinsert"><CiCirclePlus /></Link></Upload>
          <Profile><Link to="/personalpage">프로필({user.userNickname})</Link></Profile>
          
        </div>
        
      ) : (
        <div>
          {/* <h2>푸터</h2> */}
          <Logout><FaUserTimes /></Logout>
        </div>
      )}
    </FooterBlock>
  );
};

export default Footer;
