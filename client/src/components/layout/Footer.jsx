import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "@/store/member";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";


const FooterBlock = styled.div`
  padding: 15px;
  margin-left: 150px;
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
  font-size: 20px;
  margin: 0 0 5px 20px;
  img {
    margin-right: 10px;
    border-radius:50%;
    width: 16%;
  }
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
          <Upload><Link to="/feedinsert"><FaCirclePlus /></Link></Upload>
          <Profile><Link to="/personalpage"><img src= {user.photo} alt="프로필사진" />({user.userNickname})</Link></Profile>
        </div>
        
      ) : (
        <div>
          {/* <h2>푸터</h2> */}
          <Loginout><FaUserTimes /></Loginout>
        </div>
      )}
    </FooterBlock>
  );
};

export default Footer;
