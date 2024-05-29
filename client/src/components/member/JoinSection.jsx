import React, { useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import logo from "../../assets/images/PicShare.png";

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
      text-align: left;
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
    margin: 20px 0;
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
  const emailRef = useRef();
  const userNameRef = useRef();
  const userNicknameRef = useRef();
  const passwordRef = useRef();
  const [userInfo, setUserInfo] = useState({
    email: "",
    userName: "",
    userNickname: "",
    password: "",
  });
  const [error, setError] = useState({});
  const [success, setSuccess] = useState({});

  const handleChange = async (e) => {
    const { value, name } = e.target;
    setUserInfo((userInfo) => ({ ...userInfo, [name]: value }));
    setError((error) => ({ ...error, [name]: "" })); // 필드 수정 시 해당 필드의 에러 메시지 초기화
    setSuccess((success) => ({ ...success, [name]: "" })); // 성공 메시지 초기화

    if (name === "email" && value) {
      try {
        await axios.post("http://localhost:8001/auth/check-email", {
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
        await axios.post("http://localhost:8001/auth/check-nickname", {
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

  const register = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!userInfo.email) {
      newErrors.email = "이메일을 입력해 주세요.";
    }
    if (!userInfo.userName) {
      newErrors.userName = "성명을 입력해 주세요.";
    }
    if (!userInfo.userNickname) {
      newErrors.userNickname = "닉네임을 입력해 주세요.";
    }
    if (!userInfo.password) {
      newErrors.password = "비밀번호를 입력해 주세요.";
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8001/auth/join", userInfo);
      if (res.data.affectedRows === 1) {
        alert("회원가입이 성공했습니다.");
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
        <div>
          <img src={logo} alt="PicShare" className="logo" />
          <p>친구들의 사진과 동영상을 보려면 가입하세요.</p>
          <button type="button">Facebook으로 로그인</button>
          <p>­ ―――――― 또는 ―――――― </p>
        </div>
        <table border="1">
          <colgroup>
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td>
                <label htmlFor="email">이메일 주소</label>
              </td>
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
                <label htmlFor="userName">성명</label>
              </td>
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
              <td>닉네임</td>
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
                <label htmlFor="password">비밀번호</label>
              </td>
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
        </div>
      </form>
    </JoinSectionBlock>
  );
};

export default JoinSection;
