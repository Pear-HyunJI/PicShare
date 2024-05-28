import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "@/Layout";
import MainFeedView from "@/views/feed/MainFeedView";
import JoinView from "@/views/JoinView";
import LoginView from "@/views/LoginView";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LoginView />} />
        <Route path="/join"  element={<JoinView />}/>
        <Route path="/login"  element={<LoginView />}/>
        <Route path="/feed" element={<MainFeedView />} />
      </Route>
    </Routes>
  );
};

export default App;
