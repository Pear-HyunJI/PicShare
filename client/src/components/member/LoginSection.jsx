import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../../assets/images/PicShare.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { userLogin } from "@/store/member";

const LoginSectionBlock = styled.div`
  max-width: 345px;
  margin: 50px auto;
  text-align: center;
  color: gray;
  .top {
    margin: 20px 0;
    p {
      margin: 20px 0;
      white-space: nowrap;
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
    button {
      margin: 20px 0;
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
`;

const LoginSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const emailRef = useRef();
  const passwordRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      alert("이메일을 입력하세요.");
      emailRef.current.focus();
      return;
    }
    if (!password) {
      alert("비밀번호를 입력하세요.");
      passwordRef.current.focus();
      return;
    }

    try {
      const response = await axios.post("http://localhost:8001/auth/login", {
        email,
        password,
      });
      console.log(response.data);
      dispatch(userLogin(response.data));
      navigate("/feed");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("로그인 오류?");
        console.log(err);
      }
    }
  };

  return (
    <LoginSectionBlock>
      <form onSubmit={handleLogin}>
        <div className="top">
          <img src={logo} alt="" className="logo" />
          <p>친구들의 사진과 동영상을 보려면 로그인 하세요.</p>
        </div>
        <table>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  ref={emailRef}
                  name="email"
                  id="email"
                  placeholder="이메일 주소"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <input
                  type="password"
                  ref={passwordRef}
                  name="password"
                  id="password"
                  placeholder="비밀번호"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </td>
            </tr>
            {error && (
              <tr>
                <td colSpan="2">
                  <p className="error">{error}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="btn">
          <button type="submit">로그인</button>
          <p style={{ color: "gray" }}>
            ­―――――――――&nbsp;&nbsp;또는&nbsp;&nbsp;―――――――――
          </p>
          <button>Facebook으로 로그인</button>
          <p>
            계정이 없으신가요?&nbsp;&nbsp;
            <Link to="/join" className="textColor">
              가입하기
            </Link>
          </p>
        </div>
      </form>
    </LoginSectionBlock>
  );
};

export default LoginSection;
