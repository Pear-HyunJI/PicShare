import React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useMediaQuery } from "react-responsive";

const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow-y: scroll;
`;

const LeftLayoutBlock = styled.div`
  flex: 0 0 412px;
  height: 100vh;
  border: 1px solid red;
  position: sticky;
  top: 0;
`;

const RightLayoutBlock = styled.div`
  flex: 0 0 412px;
  border: 1px solid red;
  display: flex;
  flex-direction: column;
  height: 100vh;

  @media (max-width: 900px) {
    flex: 0 0 412px;
    margin-left: 0;
  }
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: hidden;
`;

const Layout = () => {
  const mobile = useMediaQuery({ maxWidth: 900 });
  return (
    <LayoutWrapper>
      {!mobile && <LeftLayoutBlock>야dididi</LeftLayoutBlock>}
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
