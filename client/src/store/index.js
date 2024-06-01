import { configureStore } from "@reduxjs/toolkit";
import memberReducer from "./member";
import followReducer from "./follow";
import feedReducer from "./feed";

const store = configureStore({
  reducer: {
    members: memberReducer,
    follows: followReducer,
    feeds: feedReducer,
  },
});

export default store;
