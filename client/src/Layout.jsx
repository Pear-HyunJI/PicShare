import React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useMediaQuery } from "react-responsive";
import logo from "@/assets/images/PicShare.png";
import screenShot from "@/assets/images/screenShot.png";
import screenShot2 from "@/assets/images/screenShot2.png";

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
  .screenShot, .screenShot2 {
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
  return (
    <LayoutWrapper>
      {!mobile && (
        <LeftLayoutBlock>
          <img src={logo} alt="로고" />
          <p>
            사진으로 연결되는 세상, <br /> PicShare와 함께.
          </p>
          <div className="screenShotWrapper">
            <img src={screenShot} alt="스크린샷" className="screenShot"/>
            <img src={screenShot2} alt="스크린샷2" className="screenShot2"/>
          </div>
        </LeftLayoutBlock>
      )}
      <RightLayoutBlock>
        <Header />
        <MainContent>
          <Outlet />
        </MainContent>
        <Footer />
      </RightLayoutBlock>
    </LayoutWrapper>
  );
};

export default Layout;
