import React, { useEffect } from "react";
import styled from "styled-components";
import { Outlet, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useMediaQuery } from "react-responsive";
import logo from "@/assets/images/PicShare.png";
import screenShot from "@/assets/images/screenShot.png";
import screenShot2 from "@/assets/images/screenShot2.png";
import { useSelector, useDispatch } from "react-redux";
import { localUser } from "@/store/member";
import axios from "axios";

const serverUrl = import.meta.env.VITE_API_URL;

const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow-y: hidden;
  justify-content: space-evenly;
  background-color: #f2f2f2;
  .screenShotWrapper {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
  }
  .screenShot,
  .screenShot2 {
    width: 45%;
  }

  @media (max-width: 1200px) {
    display: block;
    justify-content: center;
  }
`;

const LeftLayoutBlock = styled.div`
  flex: 0 0 420px;
  height: 100vh;
  position: sticky;
  top: 0;
  margin: 0 50px;
  padding-top: 150px;
  text-align: center;

  display: flex;
  flex-direction: column;

  p {
    font-size: 25px;
    font-weight: 600;
    margin: 35px auto;
    color: #0d0d0d;
  }
`;

const RightLayoutBlock = styled.div`
  flex: 1;
  max-width: 760px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fff;

  @media (max-width: 1200px) {
    max-width: 760px;
    margin: 0 auto;
  }
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  max-width: 100%;
`;

const Layout = () => {
  const mobile = useMediaQuery({ maxWidth: 1200 });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.members.user);

  // (sessionStorage) 새로고침-> 로그인 유지 || 페이지 닫기-> 로그인 유지안되게
  useEffect(() => {
    if (sessionStorage.getItem("loging")) {
      const { userNo } = JSON.parse(sessionStorage.getItem("loging"));
      axios
        .post(`${serverUrl}/auth/refresh`, { userNo })
        .then((res) => {
          dispatch(localUser(res.data.user));
        })
        .catch((err) => console.log(err));
    }
  }, [dispatch, user?.userNo]);
  return (
    <LayoutWrapper>
      {!mobile && (
        <LeftLayoutBlock>
          <Link to={`/login`}>
          <img src={logo} alt="로고" />
          </Link>
          <p>
            사진으로 연결되는 세상, <br /> PicShare와 함께.
          </p>
          <div className="screenShotWrapper">
            <img src={screenShot} alt="스크린샷" className="screenShot" />
            <img src={screenShot2} alt="스크린샷2" className="screenShot2" />
          </div>
        </LeftLayoutBlock>
      )}
      <RightLayoutBlock>
        {user && <Header />}
        <MainContent>
          <Outlet />
        </MainContent>
        {user && <Footer />}
      </RightLayoutBlock>
    </LayoutWrapper>
  );
};

export default Layout;
