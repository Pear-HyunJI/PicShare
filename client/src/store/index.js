import { configureStore } from "@reduxjs/toolkit";
import memberReducer from "./member";
import followReducer from "./follow";
import feedReducer from "./feed";
import likeReducer from "./like";

const store = configureStore({
  reducer: {
    members: memberReducer,
    follows: followReducer,
    feeds: feedReducer,
    likes: likeReducer,
  },
});

export default store;
