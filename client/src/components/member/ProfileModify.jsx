import React, { useRef,useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import { useSelector} from 'react-redux'
import axios from "axios";


const ProfileModifyBlock = styled.div`
  margin: 100px;

  .setting {
    text-align: center;
    margin-bottom: 20px;
    font-size: 30px;
  }

  .profile {
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
    }

    a {
      font-size: 30px;
      color: gray;
    }
  }
  .nickName{
    display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    input {
      text-align: center;
      width: 60%;
      padding: 15px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  }
  .btn {
    margin: 50px auto;

    button {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin: 30px auto;
      width: 60%;
      background: #ddd;
      color: #000;
      border-radius: 10px;
      padding: 15px;

      &:hover {
        background-color: #aaa;
        color: #fff;
      }

      img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
    }
  }
`;

const ProfileModify = () => {
  const user = useSelector(state => state.members.user);
  const navigate = useNavigate();
  const userNicknameRef = useRef();

  const [userInfo, setUserInfo] = useState({
    userNickname: "",
    profilePicture:"",
  });

 const handleFileChange = (e) => {
  const file = e.target.files[0];
  setUserInfo((prevUserInfo) => ({ ...prevUserInfo, profilePicture: file }));
};

  
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userNickname", userInfo.userNickname);

    if (userInfo.profilePicture) {
        formData.append("profilePicture", userInfo.profilePicture)
    }

    axios.post("http://localhost:8001/userInfo/modify", formData, {
        headers : {
            "Content-Type": "multipart/form-data",
        }
    })
    .then(res=>{
        if (res.data.affectedRows==1) {
            navigate("/userInfo", {state:{user}})
        } else {
            alert("실패")
            return
        }
    })
    .catch(err=>console.log(err))
};

  const handleChange = (e)=>{
    console.log(e)
    const {value, name} = e.target
    setUserInfo(userInfo=>({...userInfo, [name]:value }))
}

  const handleButtonClick = () => {
    document.getElementById("profilePicture").click();
  };

  return (
    <ProfileModifyBlock>
      <form onSubmit={onSubmit}>
        <div>
          <p className="setting">프로필 설정</p>
          <div className="profile">
            <img src={`http://localhost:8001/uploads/${user.profilePicture}`} alt="프로필사진" />
            <p>게시물</p>
            <p>팔로워</p>
            <p>팔로잉</p>
            {/* <Link to="/personalpage/:userNo">
              <FiUpload />
            </Link> */}
          </div>
        </div>
        <div className="btn">
          <label htmlFor="profilePicture" onClick={handleButtonClick}>
            <button type="button">프로필 사진 변경</button>
          </label>
          <input
            type="file"
            name="profilePicture"
            id="profilePicture"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <div className="nickName">
            <input
                    type="text"
                    name="userNickname"
                    id="userNickname"
                    ref={userNicknameRef}
                    value={userInfo.userNickname}
                    onChange={handleChange}
                    placeholder="Usernickname"
                    required
                  />
          </div>
          <label htmlFor="name" onClick={handleButtonClick}>
          <button type="submit">닉네임 변경</button>
          </label>
        </div>
      </form>
    </ProfileModifyBlock>
  );
};

export default ProfileModify;



