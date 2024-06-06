import React, { useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "@/store/member";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
// import { fecthUsers } from "@/store/member";

const FooterBlock = styled.div`
  background: #000;
  color: #fff;
  padding: 15px;
  .menu {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
`;

const Loginout = styled.div`
  font-size: 30px;
  margin-left: 20px;
`;

const Upload = styled.div`
  font-size: 30px;
  margin: 0px 20px;
`;

const Profile = styled.div`
  font-size: 20px;
  margin-bottom: 5px;
  img {
    margin-right: 10px;
    border-radius: 50%;
    width: 30px;
    height: 30px;
  }
`;

const Footer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.members.user);

  // useEffect(dispatch(fecthUsers(user.userNo)));

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(userLogout());
    navigate("/");
  };

  return (
    <FooterBlock>
      {user ? (
        <div className="menu">
          <Loginout>
            <a href="#" onClick={handleLogout}>
              <FaUserCheck />
            </a>
          </Loginout>
          <Upload>
            <Link to="/feedinsert">
              <FaCirclePlus />
            </Link>
          </Upload>
          <Profile>
            <Link to={`/personalpage/${user.userNo}`}>
              <img
                src={`http://localhost:8001/uploads/${user.profilePicture}`}
                alt="프로필사진"
              />
              ({user.userNickname})
            </Link>
          </Profile>
        </div>
      ) : (
        <div>
          <Loginout>
            <FaUserTimes />
          </Loginout>
        </div>
      )}
    </FooterBlock>
  );
};

export default Footer;
