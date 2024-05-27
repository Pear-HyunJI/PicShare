import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "@/Layout";
import MainFeedView from "@/views/feed/MainFeedView";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MainFeedView />} />
      </Route>
    </Routes>
  );
};

export default App;
