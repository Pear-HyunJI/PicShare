import React, { useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../../assets/images/PicShare.png";

const serverUrl = import.meta.env.VITE_API_URL;

const JoinSectionBlock = styled.div`
  max-width: 345px;
  margin: 50px auto;
  text-align: center;
  color: gray;
  .top {
    margin: 20px 0;
    p {
      margin: 20px 0;
    }
    button {
      width: 95%;
      height: 40px;
      background: #ccc;
      color: #fff;
      border-radius: 10px;
      &:hover {
        background: gray;
      }
    }
  }
  table {
    width: 100%;
    td {
      padding: 10px;
      text-align: center;
      img {
        border-radius: 50%;
        width: 150px;
        height: 150px;
      }

      .checkbox-label {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        font-size: 13px;

        input[type="checkbox"] {
          display: none;
        }
      }
    }
    input {
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  }
  .btn {
    margin-top: 20px 0;
    button {
      margin-bottom: 50px;
      width: 95%;
      height: 40px;
      background: #ccc;
      color: #fff;
      border-radius: 10px;
      &:hover {
        background: gray;
      }
    }
    .textColor {
      color: #09fc52;
    }
  }
  .error {
    color: red;
    font-size: 0.875rem;
    margin-top: 5px;
  }
  .success {
    color: green;
    font-size: 0.875rem;
    margin-top: 5px;
  }
`;

const JoinSection = () => {
  const navigate = useNavigate();

  const emailRef = useRef();
  const userNameRef = useRef();
  const userNicknameRef = useRef();
  const passwordRef = useRef();
  const [userInfo, setUserInfo] = useState({
    email: "",
    userName: "",
    userNickname: "",
    password: "",
    photo: "",
  });
  const [error, setError] = useState({});
  const [success, setSuccess] = useState({});
  const [useDefaultProfile, setUseDefaultProfile] = useState(true); // 기본은 기본프로필 사용
  const [profilePreview, setProfilePreview] = useState(
    `${serverUrl}/uploads/defaultProfile.jpg`
  ); // 프로필프리뷰

  // 프로필프리뷰
  const handleCheckboxChange = () => {
    setUseDefaultProfile((prevUseDefaultProfile) => {
      const newUseDefaultProfile = !prevUseDefaultProfile;
      console.log("체크박스 클릭시", newUseDefaultProfile);
      setProfilePreview(
        newUseDefaultProfile
          ? `${serverUrl}/uploads/defaultProfile.jpg`
          : profilePreview
      );
      return newUseDefaultProfile;
    });
  };

  // 프로필사진 변경
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUserInfo((prevUserInfo) => ({ ...prevUserInfo, photo: file }));
    setProfilePreview(URL.createObjectURL(file)); // 사진을 등록하면 프로필프리뷰 변경
  };

  // 이메일, 닉네임 중복체크
  const handleChange = async (e) => {
    const { value, name } = e.target;
    setUserInfo((userInfo) => ({ ...userInfo, [name]: value }));
    setError((error) => ({ ...error, [name]: "" }));
    setSuccess((success) => ({ ...success, [name]: "" }));

    if (name === "email" && value) {
      try {
        await axios.post(`${serverUrl}/auth/check-email`, {
          email: value,
        });
        setSuccess((success) => ({
          ...success,
          email: "사용 가능한 이메일입니다.",
        }));
      } catch (err) {
        if (err.response && err.response.data) {
          setError((error) => ({ ...error, email: err.response.data.message }));
        }
      }
    }

    if (name === "userNickname" && value) {
      try {
        await axios.post(`${serverUrl}/auth/check-nickname`, {
          userNickname: value,
        });
        setSuccess((success) => ({
          ...success,
          userNickname: "사용 가능한 닉네임입니다.",
        }));
      } catch (err) {
        if (err.response && err.response.data) {
          setError((error) => ({
            ...error,
            userNickname: err.response.data.message,
          }));
        }
      }
    }
  };

  // submit
  const register = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", userInfo.email);
    formData.append("userName", userInfo.userName);
    formData.append("userNickname", userInfo.userNickname);
    formData.append("password", userInfo.password);
    if (useDefaultProfile || !userInfo.photo) {
      formData.append("photo", "defaultProfile.jpg");
    } else {
      formData.append("photo", userInfo.photo);
    }

    try {
      const res = await axios.post(
        `${serverUrl}/auth/join`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.affectedRows === 1) {
        alert("회원가입이 성공했습니다.");
        navigate("/login");
      } else {
        alert("회원가입에 실패했습니다.");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const { field, message } = err.response.data;
        setError((error) => ({ ...error, [field]: message }));
      } else {
        console.error(err);
      }
    }
  };

  return (
    <JoinSectionBlock>
      <form onSubmit={register}>
        <div className="top">
          <img src={logo} alt="PicShare" className="logo" />
          <p>친구들의 사진과 동영상을 보려면 가입하세요.</p>
          <button type="button">Facebook으로 로그인</button>
          <p style={{ color: "gray" }}>
            ­―――――――――&nbsp;&nbsp;또는&nbsp;&nbsp;―――――――――
          </p>
        </div>
        <table>
          <tbody>
            <tr>
              <td>
                <img src={profilePreview} alt="프로필사진" />
              </td>
            </tr>
            <tr>
              <td>
                <div className="checkbox-label">
                  <p>나만의 프로필사진을 추가할까요?</p>
                  <label>
                    <input
                      type="checkbox"
                      checked={!useDefaultProfile} // 이 체크박스가 체크됐다는건 -> 기본프로필을 사용하지 않겠다
                      onChange={handleCheckboxChange}
                    />
                    {useDefaultProfile ? (
                      <span
                        style={{
                          color: "#09fc52",
                          fontWeight: "bold",
                        }}
                      >
                        사진 추가하기
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#09fc52",
                          fontWeight: "bold",
                        }}
                      >
                        기본 이미지로 변경
                      </span>
                    )}
                  </label>
                </div>
                {!useDefaultProfile && (
                  <input
                    type="file"
                    name="photo"
                    id="photo"
                    onChange={handleFileChange}
                    placeholder="Profile Image"
                  />
                )}
              </td>
            </tr>
            <tr>
              <td>
                <input
                  type="text"
                  name="email"
                  id="email"
                  ref={emailRef}
                  value={userInfo.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
                {error.email && <p className="error">{error.email}</p>}
                {success.email && <p className="success">{success.email}</p>}
              </td>
            </tr>
            <tr>
              <td>
                <input
                  type="text"
                  name="userName"
                  id="userName"
                  ref={userNameRef}
                  value={userInfo.userName}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                />
                {error.userName && <p className="error">{error.userName}</p>}
              </td>
            </tr>
            <tr>
              <td>
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
                {error.userNickname && (
                  <p className="error">{error.userNickname}</p>
                )}
                {success.userNickname && (
                  <p className="success">{success.userNickname}</p>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <input
                  type="password"
                  name="password"
                  id="password"
                  ref={passwordRef}
                  value={userInfo.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
                {error.password && <p className="error">{error.password}</p>}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="btn">
          <button type="submit">가입</button>
          <p>
            이미 계정이 있으신가요?&nbsp;&nbsp;
            <Link to="/login" className="textColor">
              로그인
            </Link>
          </p>
        </div>
      </form>
    </JoinSectionBlock>
  );
};

export default JoinSection;
