import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "@/Layout";
import MainFeedView from "@/views/feed/MainFeedView";
import JoinView from "@/views/JoinView";
import LoginView from "@/views/LoginView";
import PersonalPageView from "@/views/PersonalPageView";
import ProfileModifyView from "@/views/ProfileModifyView";
import FeedInsertView from "@/views/FeedInsertView";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LoginView />} />
        <Route path="/join" element={<JoinView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/feed" element={<MainFeedView />} />
        <Route path="/personalpage" element={<PersonalPageView />} />
        <Route path="/profilemodify" element={<ProfileModifyView />} />
        <Route path="/feedinsert" element={<FeedInsertView />} />
      </Route>
    </Routes>
  );
};

export default App;
